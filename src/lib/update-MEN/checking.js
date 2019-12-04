'use strict';

const _ = require('lodash');

const {
    DB,
    xoDs
} = require('./constants');

const checkAllMENExist = async(updateList) => {
    const locationGrp = _.groupBy(updateList, 'LocationID');
    const locationArr = Object.keys(locationGrp);

    const total = locationArr.length;

    for (let i = 0; i < total; i++) {
        const sql = `select
            data->>'id' as id,
            data->>'statusCode' as "statusCode",
            data->>'isPurchased' as "isPurchased"
        from storefronts
        where data->>'locationId' = '${locationArr[i]}' AND data->>'categoryCode' = 'MEN'`;
        const r = await xoDs.pg.execute(DB, sql);

        if (r.length !== 1) {
            console.log('-------MORE THAN ONE-------');
            console.log(`locationId: ${locationArr[i]}`);
            console.dir(r, {depth: 9});
        }

        if (r[0].statusCode !== 'REMOVED') {
            console.log('-------NOT REMOVED-------');
            console.log(`locationId: ${locationArr[i]}`);
            console.dir(r, {depth: 9});
        }
    }
};

const checkMarketExist = async(updateList) => {
    const total = updateList.length;

    let updateGrp = [];
    let preLoc;

    for (let i = 0; i < total; i++) {
        const isLastOne = i === (total - 1);
        const { LocationID } = updateList[i];

        if (i === 0) {
            updateGrp.push(updateList[i]);
            preLoc = LocationID;
            continue;
        }

        if (LocationID === preLoc) {
            updateGrp.push(updateList[i]);

            // The last one
            if (isLastOne) {
                await checkMarketExistExecuter(updateGrp, isLastOne);
            }
        } else {
            await checkMarketExistExecuter(updateGrp, isLastOne);
            // break
            updateGrp = [];
            updateGrp.push(updateList[i]);
            preLoc = LocationID;
        }
    }
};

const checkMarketExistExecuter = async(updateArr, isLastOne = false) => {
    let jobs = [];
    const max = 30;

    jobs.push(checkMarketExistExecute(updateArr));

    if (jobs.length === max || isLastOne) {
        await Promise.all(jobs);
        jobs = [];
    }
};

const checkMarketExistExecute = async(updateArr) => {
    return Promise.resolve()
        .then(() => {
            const sql = `select sf.data->>'id' as id,
                sf.data->>'statusCode' as st,
                sf.data->>'isPurchased' as pur,
                sf.data->>'locationId' as loc,
                sp.data as sales
            from storefronts sf
            inner join sales_profiles sp on sp.data->>'storefrontId' = sf.data->>'id'
            where sf.data->>'locationId' = '${updateArr[0].LocationID}' AND sf.data->>'categoryCode' = '${updateArr[0].CategoryCode}' AND sf.data->>'statusCode' = 'LIVE';`;

            return xoDs.pg.execute(DB, sql);
        })
        .then(([{ id, st, pur, loc, sales }]) => {
            updateArr.forEach((item) => {
                if (item.SKU === 'SKU-00000092') {
                    const exist = sales.services.find((srv) => srv.marketCode === item.MarketCode);

                    if (!exist) {
                        // console.log('-----Not exist service')
                        console.dir(`${item.LocationID} ${item.SKU} ${item.MarketCode} ${id}`);
                    }
                } else if (item.SKU === 'SKU-00000034') {
                    const existSrv = sales.services.find((srv) => srv.marketCode === item.MarketCode);

                    if (!existSrv) {
                        // console.log('-----Not exist service 1')
                        console.dir(`${item.LocationID} ${item.SKU} ${item.MarketCode} ${id}`);

                        return;
                    }

                    const aoExist = existSrv.addOns.find((ao) => ao.sku === item.SKU);
                    if (!aoExist) {
                        // console.log('-----Not exist addon 1')
                        console.dir(`${item.LocationID} ${item.SKU} ${item.MarketCode} ${id}`);

                        return;
                    }
                } else {
                    console.log(`********Unexpected SKU ${item.SKU} ${item.LocationID}`);
                }
            });
        });
};


module.exports = {
    checkAllMENExist,
    checkMarketExist
};
