'use strict';

const csv = require('csvtojson');
const _ = require('lodash');
const Promise = require('bluebird');

const fs = require('fs');

const {
    DB,
    xoDs,
    listPath,
    mapListPath,
    notExistPath,
    notMatchMarketPath,
    updatedByGPPath,
    allRemovedPath,
    existManyButNoWin,
    existManyLive,
    freeSrvPath,
    freeAddonPath,
    failToUpdatePath
} = require('./constants');

const updateSales = require('./updateList');

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
    fs.existsSync(failToUpdatePath) && fs.unlinkSync(failToUpdatePath);

    fs.appendFileSync(mapListPath, 'LocationId,CategoryCode,MarketCode,SKU,newMarketCode,StorefrontId\n');
    fs.appendFileSync(updatedByGPPath, 'LocationId,CategoryCode,MarketCode,SKU,StorefrontId\n');
    fs.appendFileSync(freeAddonPath, 'LocationId,CategoryCode,MarketCode,SKU,StorefrontId\n');
    fs.appendFileSync(freeSrvPath, 'LocationId,CategoryCode,MarketCode,SKU,StorefrontId\n');
    fs.appendFileSync(failToUpdatePath, 'LocationID,SubscriptionEndDate,MarketCode,SKU,Product,CategoryCode,message\n');
};

const getData = async(loc, cat) => {
    const sql = `select sf.data->>'id' as id,
    sf.data->>'statusCode' as st,
    sf.data->>'isPurchased' as pur,
    sf.data->>'winningStorefrontId' as winid,
    sf.data->>'locationId' as loc,
    sf.data->>'salesProfileStartDate' as spsd,
    sp.data as sales
from storefronts sf
inner join sales_profiles sp on sp.data->>'storefrontId' = sf.data->>'id'
where sf.data->>'locationId' = '${loc}' AND sf.data->>'categoryCode' = '${cat}' AND sf.data->>'statusCode' = 'LIVE';`;

    const r = await xoDs.pg.execute(DB, sql);
    if (r.length === 0) {
        fs.appendFileSync(notExistPath, `${loc},${cat}\n`);

        return null;
    }

    if (r.length > 1) {
        fs.appendFileSync(existManyLive, `${loc},${cat}\n`);

        return null;
    }

    return r[0].sales;
};

const execute = (updateArr) => {
    if (!updateArr.length) { return; }

    return getData(updateArr[0].LocationID, updateArr[0].CategoryCode)
        .then((sales) => updateSales(sales, updateArr));
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
