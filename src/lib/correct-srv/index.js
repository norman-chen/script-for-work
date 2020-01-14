//
//
//
// node src/lib/correct-srv --NODE_ENV=qa --foldName=log-qa-1226-3-2 --shouldUpdate=true
// node src/lib/correct-srv --NODE_ENV=production --foldName=log-prod-0108-check --shouldUpdate=false
//
//
//

const {
    xoDs,
    requestInfo
} = require('./constants');
const xoReq = new(require('xo-request'))();

const Promise = require('bluebird');
const _ = require('lodash');
const fs = require('fs');
const initFold = require('../../helpers/initFold');

const executeLimit = 50;

const marketCodeToRank = {};

const getMarketCodeToRank = async() => {
    const marketDB = await xoDs.pg.execute('storefront', 'select * from markets');

    marketDB.forEach(({ data: d }) => {
        marketCodeToRank[d.code] = d.rank;
    });
};

const getCronjobLog = () => {
    const sql = `select distinct(t1."storefrontId") from (
        select
            data->'market'->0->>'storefrontId' as "storefrontId"
        from new_markets_expiration_logs
        where jsonb_array_length(data->'market') > 0 AND data->>'status' = 'success'
    ) t1`;

    return xoDs.pg.execute('storefront', sql);
};

const keepWhichSrvLive = (sales, marketCode) => {
    sales.services = sales.services.map((srv) => {
        if (srv.marketCode === marketCode) {
            srv.statusCode = 'LIVE';
        } else {
            srv.statusCode = 'REMOVED';
        }

        return srv;
    });
};

const updateThroughApi = async(sales) => {
    const { url, apikey, token } = requestInfo;

    let all = [];

    for (let i = 0; i < sales.length; i++) {
        const sa = sales[i];
        const options = {
            payload: {
                services : sa.services,
                accountId: sa.accountId
            },
            headers: {
                Authorization: token
            }
        };

        all.push(
            xoReq.put(`${url}/sales/${sa.id}?apikey=${apikey}`, options)
                .then(() => {
                    fs.appendFileSync(`${__dirname}/${foldName}/succeed.log`, `'${sa.storefrontId}',\n`);
                })
                .catch(() => {
                    fs.appendFileSync(`${__dirname}/${foldName}/fail.log`, `'${sa.storefrontId}',\n`);
                })
        );

        if (all.length === 30 | i === (sales.length - 1)) {
            await Promise.all(all);
            all = [];
        }
    }
};

const execute = async(storefrontIds) => {
    const _storefrontIdsInCon = `(${JSON.stringify(storefrontIds).replace('[', '').replace(']', '').replace(/\"/g, '\'')})`;

    const getSalesSql = `select
        data->'services' as services,
        data->>'id' as id,
        data->>'storefrontId' as "storefrontId"
    from sales_profiles
    where data->>'storefrontId' in ${_storefrontIdsInCon}`;

    // console.log(getSalesSql);

    const getMapMarketSql = `with tmp_services as (
        select
            srv as data,
            sp.data->>'storefrontId' as sfid,
            srv ->> 'marketCode' as mc
        from sales_profiles sp, jsonb_array_elements(sp.data->'services') as srv
        where sp.data->>'storefrontId' in ${_storefrontIdsInCon}
    )
    select ps.data->>'storefrontId' as "storefrontId",
        ps.data->>'legacyMarketCode' as "legacyMarketCode",
        ps.data->>'newMarketCode' as "marketCode",
        ps.data->>'categoryCode' as "categoryCode",
        ps.data->>'mappedLegacyMarketCode' as "mappedLegacyMarketCode",
        ps.data->>'marketStatus' as "marketStatus"
    from paid_storefront_market_map ps
    inner join tmp_services ts on ps.data->>'storefrontId' = ts.sfid and (case when ps.data->>'legacyMarketCode' is not null then ps.data->>'legacyMarketCode' else ps.data->>'mappedLegacyMarketCode' end)=ts.data->>'marketCode'
    inner join sales_profiles sp on ps.data->>'storefrontId' = sp.data->>'storefrontId', jsonb_array_elements(sp.data->'services') as service
    where service->>'id'=ps.data->>'salesProfileId'`;

    const [salesInDB, mappedMarkets] = await Promise.all([
        xoDs.pg.execute('storefront', getSalesSql),
        xoDs.pg.execute('storefront', getMapMarketSql)
    ]);

    const salesNeedToCorrect = [];
    salesInDB.forEach((sa) => {
        const liveSrvs = sa.services.filter((srv) => srv.statusCode === 'LIVE');
        if (liveSrvs.length === 1 && liveSrvs[0].purchaseStatusCode === 'FREEMIUM' && liveSrvs[0].subscriptionId) {
            return salesNeedToCorrect.push(sa);
        }

        return fs.appendFileSync(`${__dirname}/${foldName}/can-not-touch.log`, `'${sa.storefrontId}',\n`);
    });

    const needFixSalesFinal = [];

    salesNeedToCorrect.forEach((sales) => {
        const oldLIVEMarket = sales.services.find((srv) => srv.statusCode === 'LIVE').marketCode;

        const mappedMarketsBySf = mappedMarkets.filter((m) => m.storefrontId === sales.storefrontId);

        let originalMarketCodes = [];

        mappedMarketsBySf.filter((m) => m.marketStatus !== 'UNCHANGED').forEach((m) => {
            originalMarketCodes.push(m.legacyMarketCode || m.mappedLegacyMarketCode);
        });

        mappedMarketsBySf.filter((m) => m.marketStatus === 'UNCHANGED').forEach((m) => {
            originalMarketCodes.push(m.marketCode);
        });
        originalMarketCodes = Array.from(new Set(originalMarketCodes));

        // console.log('originalMarketCodes: ', originalMarketCodes);
        if (originalMarketCodes.length === 0) {
            console.log(`WTF??!! ${sales.id} ${sales.storefrontId}`);

            return;
        }

        if (originalMarketCodes.length === 1) {
            if (oldLIVEMarket === originalMarketCodes[0]) {
                fs.appendFileSync(`${__dirname}/${foldName}/already-correct.log`, `'${sales.storefrontId}',\n`);

                return;
            }

            keepWhichSrvLive(sales, originalMarketCodes[0]);
            needFixSalesFinal.push(sales);
            fs.appendFileSync(`${__dirname}/${foldName}/need-to-fix.log`, `['${sales.storefrontId}', '${originalMarketCodes[0]}', '${originalMarketCodes[0]}'],\n`);

            return;
        }

        // find the one that we should keep LIVE
        const originMarkets = sales.services.filter((srv) => originalMarketCodes.includes(srv.marketCode))
            .map((srv) => ({
                marketCode: srv.marketCode,
                endDate   : srv.endDate,
                rank      : marketCodeToRank[srv.marketCode]
            }));

        const marketShouldLIVE = _.orderBy(
            originMarkets,
            ['endDate', 'rank'],
            ['desc', 'asc']
        )[0].marketCode;

        if (oldLIVEMarket === marketShouldLIVE) {
            fs.appendFileSync(`${__dirname}/${foldName}/already-correct.log`, `'${sales.storefrontId}',\n`);

            return;
        }

        keepWhichSrvLive(sales, marketShouldLIVE);
        needFixSalesFinal.push(sales);
        fs.appendFileSync(`${__dirname}/${foldName}/need-to-fix.log`, `['${sales.storefrontId}', '${marketShouldLIVE}', '${originMarkets.map((m) => m.marketCode).join(',')}'],\n`);
    });

    shouldUpdate && await updateThroughApi(needFixSalesFinal);
    // console.log(salesNeedToCorrect.length);
    // console.log(needFixSalesFinal.length);
}

;(async() => {
    initFold(`${__dirname}/${foldName}`);
    await getMarketCodeToRank();

    const storefrontIds = await getCronjobLog();
    const total = storefrontIds.length;
    console.log('total: ', total);
    let executedSfs = [];

    for (let i = 0; i < total; i++) {
        executedSfs.push(storefrontIds[i].storefrontId);
        if (executedSfs.length === executeLimit || i === (total - 1)) {
            await execute(executedSfs);
            executedSfs = [];
            // break;
        }
    }
})();

// ;(async() => {
//     initFold(`${__dirname}/${foldName}`);
//     await getMarketCodeToRank();

//     const storefrontIds = [
//         'd10406d2-040c-41f0-be1e-a35001100e4b'
//     ];
//     const total = storefrontIds.length;
//     console.log('total: ', total);
//     let executedSfs = [];

//     for (let i = 0; i < total; i++) {
//         executedSfs.push(storefrontIds[i]);
//         if (executedSfs.length === executeLimit || i === (total - 1)) {
//             await execute(executedSfs);
//             executedSfs = [];
//             // break;
//         }
//     }
// })();
