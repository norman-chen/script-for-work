'use strict';

const XoDs = require('xo-ds-handler');
const xoDs = new XoDs();
const csv = require('csvtojson');
const _ = require('lodash');
const Promise = require('bluebird');
const { getSrvSQL, getAddOnSQL } = require('./getMapSQL');
const fs = require('fs');

const listName = 'list2';
const listPath = `${__dirname}/${listName}.csv`;

const mapListPath = `${__dirname}/${listName}-map.csv`;
const notExistPath = `${__dirname}/${listName}-not-exist.csv`;
const notMatchMarketPath = `${__dirname}/${listName}-no-match-market.csv`;
const updatedByGPPath = `${__dirname}/${listName}-updated-by-GP.csv`;
const allRemovedPath = `${__dirname}/${listName}-all-removed.csv`;
const existManyButNoWin = `${__dirname}/${listName}-exist-many-but-no-winning.csv`;
const existManyLive = `${__dirname}/${listName}-exist-many-live.csv`;
const freeSrvPath = `${__dirname}/${listName}-free-srv.csv`;
const freeAddonPath = `${__dirname}/${listName}-free-addon.csv`;

const config = {
    xoDsConfig: {
        // 'write-store': {
        //     storefront: 'postgres://localservices:!q2w3e4r5t6y7@storefronts-pg-qa.cfjnafc8bsrz.us-east-1.rds.amazonaws.com/storefront'
        // }
        'write-store': {
            storefront: 'postgres://localservices:XvkTraVU94enXcud@storefronts-pg-prod.cfjnafc8bsrz.us-east-1.rds.amazonaws.com/storefront'
        }
    },
    DB: 'storefront'
};

xoDs.config(config.xoDsConfig);

const DB = 'storefront';

const init = () => {
    fs.existsSync(mapListPath) && fs.unlinkSync(mapListPath);
    fs.existsSync(notExistPath) && fs.unlinkSync(notExistPath);
    fs.existsSync(notMatchMarketPath) && fs.unlinkSync(notMatchMarketPath);
    fs.existsSync(updatedByGPPath) && fs.unlinkSync(updatedByGPPath);
    fs.existsSync(allRemovedPath) && fs.unlinkSync(allRemovedPath);
    fs.existsSync(existManyButNoWin) && fs.unlinkSync(existManyButNoWin);
    fs.existsSync(existManyLive) && fs.unlinkSync(existManyLive);
    fs.existsSync(freeSrvPath) && fs.unlinkSync(freeSrvPath);
    fs.existsSync(freeAddonPath) && fs.unlinkSync(freeAddonPath);

    fs.appendFileSync(mapListPath, 'LocationId,CategoryCode,MarketCode,SKU,newMarketCode,StorefrontId\n');
    fs.appendFileSync(updatedByGPPath, 'LocationId,CategoryCode,MarketCode,SKU,StorefrontId\n');
    fs.appendFileSync(freeAddonPath, 'LocationId,CategoryCode,MarketCode,SKU,StorefrontId\n');
    fs.appendFileSync(freeSrvPath, 'LocationId,CategoryCode,MarketCode,SKU,StorefrontId\n');
};

const findStorefrontId = async(loc, cat) => {
    const sql = `select data->>'id' as id,
        data->>'statusCode' as st,
        data->>'isPurchased' as pur,
        data->>'winningStorefrontId' as winid,
        data->>'locationId' as loc,
        data->>'salesProfileStartDate' as spsd
    from storefronts
    where data->>'locationId' = '${loc}' AND data->>'categoryCode' = '${cat}';`;

    const r = await xoDs.pg.execute(DB, sql);
    if (r.length === 0) {
        fs.appendFileSync(notExistPath, `${loc},${cat}\n`);

        return null;
    }

    if (r.length === 1) {
        return r[0].id;
    }

    const winIds = r.filter((sf) => sf.winid === '00000000-0000-0000-0000-000000000000');
    if (winIds.length === 0) {
        fs.appendFileSync(existManyButNoWin, `${loc},${cat}\n`);

        return null;
    }

    if (winIds.length > 1) {
        const notRemovedSF = r.filter((sf) => sf.st !== 'REMOVED');
        if (notRemovedSF.length === 0) {
            fs.appendFileSync(allRemovedPath, `${loc},${cat}\n`);

            return null;
        }
        if (notRemovedSF.length > 1) {
            fs.appendFileSync(existManyLive, `${loc},${cat}\n`);

            return null;
        }

        return notRemovedSF[0].id;
    }

    return winIds[0].id;
};

const updateSales = async(storefrontId, updateArr) => {
    if (!storefrontId) { return; }
    const sql = `select * from sales_profiles where data->>'storefrontId' = '${storefrontId}'`;

    let [sales] = await xoDs.pg.execute(DB, sql);
    sales = sales.data;

    for (let j = 0; j < updateArr.length; j++) {
        const updateItem = updateArr[j];

        let getRealItem = false;

        for (let i = 0; i < sales.services.length; i++) {
            const srv = sales.services[i];

            if (srv.marketCode !== updateItem.MarketCode) { continue; }

            if (srv.sku === updateItem.SKU) {
                if (!srv.subscriptionId) {
                    fs.appendFileSync(updatedByGPPath, `${updateItem.LocationID},${updateItem.CategoryCode},${updateItem.MarketCode},${updateItem.SKU},${storefrontId}\n`);

                    return;
                }

                if (srv.purchaseStatusCode === 'FREEMIUM') {
                    fs.appendFileSync(freeSrvPath, `${updateItem.LocationID},${updateItem.CategoryCode},${updateItem.MarketCode},${updateItem.SKU},${storefrontId}\n`);
                }

                await getMapSrv(storefrontId, i, updateItem);

                srv.endDate = new Date(updateItem.SubscriptionEndDate).toISOString();
                getRealItem = true;
            } else if (srv.addOns.length) {
                const aoMatchIdx = srv.addOns.findIndex((ao) => ao.sku === updateItem.SKU);

                if (aoMatchIdx !== -1) {
                    const aoMatch = srv.addOns[aoMatchIdx];

                    if (!aoMatch.subscriptionId) {
                        fs.appendFileSync(updatedByGPPath, `${updateItem.LocationID},${updateItem.CategoryCode},${updateItem.MarketCode},${updateItem.SKU},${storefrontId}\n`);

                        return;
                    }

                    if (aoMatch.status === 'INACTIVE') {
                        fs.appendFileSync(freeAddonPath, `${updateItem.LocationID},${updateItem.CategoryCode},${updateItem.MarketCode},${updateItem.SKU},${storefrontId}\n`);
                    }

                    await getMapAddOn(storefrontId, updateItem.MarketCode, i, aoMatchIdx, updateItem);

                    aoMatch.endDate = new Date(updateItem.SubscriptionEndDate).toISOString();
                    getRealItem = true;
                }
            }

            if (!getRealItem && updateItem.Product === 'Storefront' && !srv.sku) {
                await getMapSrv(storefrontId, i, updateItem);

                if (srv.purchaseStatusCode === 'FREEMIUM') {
                    fs.appendFileSync(freeSrvPath, `${updateItem.LocationID},${updateItem.CategoryCode},${updateItem.MarketCode},${updateItem.SKU},${storefrontId}\n`);
                }

                srv.endDate = new Date(updateItem.SubscriptionEndDate).toISOString();
                getRealItem = true;
            }

            break;
        }

        if (!getRealItem) {
            fs.appendFileSync(notMatchMarketPath, `${updateItem.LocationID},${updateItem.CategoryCode},${updateItem.MarketCode},${updateItem.SKU},${storefrontId}\n`);
        }
    }

    // req(sales.service)
};

const getMapSrv = async(storefrontId, srvIdx, updateItem) => {
    const mapItem = await xoDs.pg.execute(DB, getSrvSQL(storefrontId, srvIdx));

    mapItem.forEach((item) => {
        fs.appendFileSync(mapListPath, `${updateItem.LocationID},${updateItem.CategoryCode},${updateItem.MarketCode},${updateItem.SKU},${item.marketCode},${storefrontId}\n`);
    });
};

const getMapAddOn = async(storefrontId, markCode, srvIdx, addonIdx, updateItem) => {
    const mapItem = await xoDs.pg.execute(DB, getAddOnSQL(storefrontId, markCode, srvIdx, addonIdx));

    mapItem.forEach((item) => {
        fs.appendFileSync(mapListPath, `${updateItem.LocationID},${updateItem.CategoryCode},${updateItem.MarketCode},${updateItem.SKU},${item.marketCode},${storefrontId}\n`);
    });
};

const execute = (updateArr) => {
    if (!updateArr.length) { return; }

    return findStorefrontId(updateArr[0].LocationID, updateArr[0].CategoryCode)
        .then((sfId) => updateSales(sfId, updateArr));
};

const executer = async(updateArr, isLastOne = false) => {
    let jobs = [];
    const max = 30;

    jobs.push(execute(updateArr));

    if (jobs.length === max || isLastOne) {
        await Promise.all(jobs);
        jobs = [];
    }
}

;(async function() {
    init();

    let updateList = await csv().fromFile(listPath);
    updateList = updateList.map((d) => ({
        ...d,
        LocationID: d.LocationID.toLowerCase()
    })),
    updateList = _.orderBy(updateList, ['LocationID', 'CategoryCode', 'MarketCode']);

    const total = updateList.length;

    let updateGrp = [];
    let preCat, preLoc;

    for (let i = 0; i < total; i++) {
        const isLastOne = i === (total - 1);
        const { LocationID, CategoryCode } = updateList[i];
        if (LocationID === preLoc && CategoryCode === preCat) {
            updateGrp.push(updateList[i]);

            // The last one
            if (isLastOne) {
                await executer(updateGrp, isLastOne);
            }
        } else {
            await executer(updateGrp, isLastOne);
            updateGrp = [];
            updateGrp.push(updateList[i]);
            preLoc = LocationID;
            preCat = CategoryCode;
        }
    }
}());
