'use strict';

const csv = require('csvtojson');
const XoDs = require('xo-ds-handler');
const xoDs = new XoDs();
const xoReq = new(require('xo-request'))();

const config = {
    xoDsConfig: {
        'write-store': {
            storefront: 'postgres://localservices:XvkTraVU94enXcud@storefronts-pg-prod.cfjnafc8bsrz.us-east-1.rds.amazonaws.com/storefront'
        }
    },
    DB: 'storefront',
    requestInfo :{
        url   : 'https://prod-sales-api.localsolutions.theknot.com',
        token : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJNeUFjY291bnQgQWRtaW4gQXBwbGljYXRpb24iLCJpYXQiOjE0OTk0MTc4MDEsImV4cCI6NDY1NTA5MDkxNywiYXVkIjoiaHR0cDovL3BhcnRuZXJzYWRtaW4udGhla25vdC5jb20iLCJzdWIiOiJ2MSBzZWN1cml0eSIsImNsaWVudElkIjoiNTQ5MTUzM2ItNTI2Ny00NzhmLThlOWItNTNkNzUyYWQ5ZTRhIn0.jF218AKdaS8q3gFa_ixn5KZA0wht9xgzR-MVNdeizqY',
        apikey: '2c3e706eec474381a58aef482a5cff68'
    }
};

const getSrvSQL = (storefrontId, srvIdx) => `with tmp_services as (
	select data->'services'->${srvIdx} as data from sales_profiles
	where data->>'storefrontId' = '${storefrontId}'
)
select ps.data->>'storefrontId' as "storefrontId",
    ps.data->>'crmAccountId' as "crmAccountId",
    ps.data->>'locationId' as "locationId",
    ps.data->>'newMarketCode' as "marketCode",
    ps.data->>'categoryCode' as "categoryCode",
    sp.data as "preSalesProfiles"
from paid_storefront_market_map ps
inner join tmp_services ts on ps.data->>'storefrontId' = '${storefrontId}' and (case when ps.data->>'legacyMarketCode' is not null then ps.data->>'legacyMarketCode' else ps.data->>'mappedLegacyMarketCode' end)=ts.data->>'marketCode'
inner join sales_profiles sp on ps.data->>'storefrontId' = sp.data->>'storefrontId', jsonb_array_elements(sp.data->'services') as service
where ps.data->>'marketStatus' <> 'UNCHANGED'
and service->>'id'=ps.data->>'salesProfileId'
-- and service->>'purchaseStatusCode'='PAID'
and coalesce(service->>'subscriptionId','') <> ''`;

const getMapSrv = async(storefrontId, srvIdx, xoDs) => {
    const mapItem = await xoDs.pg.execute(config.DB, getSrvSQL(storefrontId, srvIdx));

    return mapItem.map((item) => ({
        marketCode: item.marketCode
        // sku: item.sku
    }));
};

;(async () => {
    const needMapSrv = true;
    const listPath = `${__dirname}/list.csv`;
    let updateList = await csv().fromFile(listPath);

    const { url, token, apikey } = config.requestInfo;
    xoDs.config(config.xoDsConfig);

    // StorefrontID
    // ServiceStartDate
    // ServiceEndDate
    // SalesMarketCode
    // Subscription

    process.env.TZ = 'America'

    updateList = updateList.map(l => ({
        storefrontId  : l.StorefrontID,
        startDate     : new Date(l.ServiceStartDate).toISOString(),
        endDate       : new Date(l.ServiceEndDate).toISOString(),
        sku           : l.SKU,
        marketCode    : l.SalesMarketCode.length === 3 ? l.SalesMarketCode: '0' + l.SalesMarketCode,
        subscriptionId: l.Subscription
    }));

    // const mapArr = [];

    for (let i = 0; i < updateList.length; i++) {
        const info = updateList[i];

        const getSrvInfoSQL = `select
    t1.value::jsonb as v,
    t1.index::int as index,
    t1.value::jsonb ->> 'marketCode' as "marketCode",
    t1.id as id
from (
	select *, ordinality- 1 as index, sp.data->>'id' as id
    from sales_profiles sp, jsonb_array_elements_text(sp.data->'services') with ordinality
    where sp.data->>'storefrontId' = '${info.storefrontId}'
) t1
where t1.value::jsonb ->> 'marketCode'= '${info.marketCode}'`;
        const [r] = await xoDs.pg.execute(config.DB, getSrvInfoSQL)
        // console.log(r)
        const mapSrv = await getMapSrv(info.storefrontId, r.index, xoDs)
        // if(mapSrv.length) {
        //     mapSrv.forEach(m => {
        //         mapArr.push({
        //             ...info,
        //             marketCode: m.marketCode
        //         })
        //     })
        // }

        // const updateSQL = `SET data=`
        const sales = await xoReq.get(`${url}/sales/${r.id}?apikey=${apikey}`, {headers: {
            Authorization: token
        }})

        let needUpdate = false;

        const salesInDB = sales.getBody()
        const idx = salesInDB.services.findIndex(sa => sa.marketCode === info.marketCode)
        if (!salesInDB.services[idx].subscriptionId) {
            console.log(`----${info.storefrontId} UPDATE BY GP ALREADY`)
            // continue;
        }

        if (salesInDB.services[idx].purchaseStatusCode === 'PAID' && salesInDB.services[idx].statusCode === 'LIVE') {
            // console.log(salesInDB.services[idx])
            console.log(`----${info.storefrontId} ${info.marketCode} SERVICE IS PAID/LIVE ALREADY`)
            // continue;
        }

        if (needUpdate) {
            salesInDB.services[idx].purchaseStatusCode = 'PAID'
            salesInDB.services[idx].statusCode = 'LIVE'
            salesInDB.services[idx].endDate = info.endDate
        }


        if (mapSrv.length) {
            mapSrv.forEach(ms => {
                const idx = salesInDB.services.findIndex(sa => sa.marketCode === ms.marketCode)
                if (!salesInDB.services[idx].subscriptionId) {
                    console.log(`----map ${info.storefrontId} ${ms.marketCode} UPDATE BY GP ALREADY`)
                    return;
                }
                if (salesInDB.services[idx].purchaseStatusCode === 'PAID' && salesInDB.services[idx].statusCode === 'LIVE') {
                    console.log(`----map ${info.storefrontId} ${ms.marketCode} SERVICE IS PAID/LIVE ALREADY`)
                    return
                }

                needUpdate = true

                salesInDB.services[idx].purchaseStatusCode = 'PAID'
                salesInDB.services[idx].statusCode = 'LIVE'
                salesInDB.services[idx].endDate = info.endDate
            })
        }

        if (!needUpdate) {
            console.log('---no one update')
            continue
        }

        console.log('---need update')
        const payload = {
            services: salesInDB.services,
            accountId: salesInDB.accountId
        };
        // await xoReq.put(`${url}/sales/${r.id}?apikey=${apikey}`, {
        //     payload,
        //     headers: {
        //         Authorization: token
        //     }
        // })
        console.log(`${info.storefrontId} ${info.marketCode} done`)
    }


    // console.dir(updateList)
})()