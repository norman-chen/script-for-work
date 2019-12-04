'use strict';

const fs = require('fs');
const xoReq = new(require('xo-request'))();
const _ = require('lodash');

const {
    requestInfo,
    isUpdateByApi
} = require('./constants');

const {
    DB,
    xoDs
} = require('./constants');

const req = (sales, updateArr) => {
    const { url, apikey, token } = requestInfo;

    const options = {
        payload: {
            services : sales.services,
            accountId: sales.accountId
        },
        headers: {
            Authorization: token
        }
    };
    // console.dir(sales, {depth: 9});

    if (isUpdateByApi) {
        return xoReq.put(`${url}/sales/${sales.id}?apikey=${apikey}`, options)
            .then(() => {
                updateArr.forEach((item) => {
                    fs.appendFileSync(`${__dirname}/succeed.log`, `${item.LocationID},${item.MarketCode},${item.SKU},${item.CategoryCode},${sales.id}\n`);
                });
            })
            .catch((error) => {
                updateArr.forEach((item) => {
                    fs.appendFileSync(`${__dirname}/fail.log`, `${item.LocationID},${item.MarketCode},${item.SKU},${item.CategoryCode},${sales.id},${error.message}\n`);
                });
            });
    }
};

module.exports = async(updateArr) => {
    const locGrp = _.groupBy(updateArr, 'LocationID');
    const locs = Object.keys(locGrp);

    for (let i = 0; i < locs.length; i++) {
        const loc = locs[i];
        const updateArrEachLoc = _.orderBy(locGrp[loc], ['MarketCode', 'SKU'], ['asc', 'desc']);

        const sql = `select sf.data->>'categoryCode' as "categoryCode",
        sp.data as sales
    from storefronts sf
    inner join sales_profiles sp on sp.data->>'storefrontId' = sf.data->>'id'
    where (sf.data->>'locationId' = '${updateArrEachLoc[0].LocationID}' AND sf.data->>'categoryCode' = 'MEN') OR
    (sf.data->>'locationId' = '${updateArrEachLoc[0].LocationID}' AND sf.data->>'categoryCode' = 'BWP' AND sf.data->>'statusCode' = 'LIVE')`;

        const salesRaw = await xoDs.pg.execute(DB, sql);

        if (salesRaw.length === 0 || salesRaw.length === 1) {
            console.log(`${updateArrEachLoc[0].LocationID} not exist`);

            return;
        }

        if (salesRaw.length > 2) {
            console.log(`${updateArrEachLoc[0].LocationID} more than one`);

            return;
        }

        const salesMEN = salesRaw.find((d) => d.categoryCode === 'MEN').sales;
        const salesBWP = salesRaw.find((d) => d.categoryCode === 'BWP').sales;

        updateArrEachLoc.forEach((item) => {
            if (item.SKU === 'SKU-00000092') {
                const exist = salesMEN.services.find((srv) => srv.marketCode === item.MarketCode);

                if (!exist) {
                    const BWPSrv = salesBWP.services.find((srv) => srv.marketCode === item.MarketCode);
                    if (!BWPSrv) {
                        console.log(`-----${item.LocationID} ${item.SKU} ${item.MarketCode} BWP srv not exist`);

                        return;
                    } else {
                        salesMEN.services.push({
                            ...BWPSrv,
                            categoryCode      : 'MEN',
                            endDate           : new Date(item.ExtendedSubscriptionEndDate).toISOString(),
                            purchaseStatusCode: 'PAID',
                            statusCode        : 'LIVE',
                            addOns            : []
                        });
                    }
                } else {
                    exist.endDate = new Date(item.ExtendedSubscriptionEndDate).toISOString();
                    exist.purchaseStatusCode = 'PAID';
                    exist.statusCode = 'LIVE';
                }
            } else if (item.SKU === 'SKU-00000034') {
                const existSrv = salesMEN.services.find((srv) => srv.marketCode === item.MarketCode);

                if (!existSrv) {
                    console.log(`-----${item.LocationID} ${item.SKU} ${item.MarketCode} srv not exist`);

                    return;
                }

                const aoExist = existSrv.addOns.find((ao) => ao.sku === item.SKU);
                if (!aoExist) {
                    const BWPSrv = salesBWP.services.find((srv) => srv.marketCode === item.MarketCode);
                    const BWPAddon = BWPSrv.addOns.find((ao) => ao.sku === item.SKU);
                    existSrv.addOns.push({
                        ...BWPAddon,
                        endDate: new Date(item.ExtendedSubscriptionEndDate).toISOString(),
                        status : 'ACTIVE'
                    });
                } else {
                    aoExist.endDate = new Date(item.ExtendedSubscriptionEndDate).toISOString();
                    aoExist.status = 'ACTIVE';
                }
            } else {
                console.log(`********Unexpected SKU ${item.SKU} ${item.LocationID}`);
            }
        });

        await req(salesMEN, updateArrEachLoc);
    }
};
