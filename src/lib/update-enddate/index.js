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
    freeAddonPath
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

    fs.appendFileSync(mapListPath, 'LocationId,CategoryCode,MarketCode,SKU,newMarketCode,StorefrontId\n');
    fs.appendFileSync(updatedByGPPath, 'LocationId,CategoryCode,MarketCode,SKU,StorefrontId\n');
    fs.appendFileSync(freeAddonPath, 'LocationId,CategoryCode,MarketCode,SKU,StorefrontId\n');
    fs.appendFileSync(freeSrvPath, 'LocationId,CategoryCode,MarketCode,SKU,StorefrontId\n');
};

// const findStorefrontId = async(loc, cat) => {
//     const sql = `select data->>'id' as id,
//         data->>'statusCode' as st,
//         data->>'isPurchased' as pur,
//         data->>'winningStorefrontId' as winid,
//         data->>'locationId' as loc,
//         data->>'salesProfileStartDate' as spsd
//     from storefronts
//     where data->>'locationId' = '${loc}' AND data->>'categoryCode' = '${cat}';`;

//     const r = await xoDs.pg.execute(DB, sql);
//     if (r.length === 0) {
//         fs.appendFileSync(notExistPath, `${loc},${cat}\n`);

//         return null;
//     }

//     if (r.length === 1) {
//         return r[0].id;
//     }

//     const winIds = r.filter((sf) => sf.winid === '00000000-0000-0000-0000-000000000000');
//     if (winIds.length === 0) {
//         fs.appendFileSync(existManyButNoWin, `${loc},${cat}\n`);

//         return null;
//     }

//     if (winIds.length > 1) {
//         const notRemovedSF = r.filter((sf) => sf.st !== 'REMOVED');
//         if (notRemovedSF.length === 0) {
//             fs.appendFileSync(allRemovedPath, `${loc},${cat}\n`);

//             return null;
//         }
//         if (notRemovedSF.length > 1) {
//             fs.appendFileSync(existManyLive, `${loc},${cat}\n`);

//             return null;
//         }

//         return notRemovedSF[0].id;
//     }

//     return winIds[0].id;
// };

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
