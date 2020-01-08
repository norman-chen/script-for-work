'use strict';

const csv = require('csvtojson');
const _ = require('lodash');


// const {
//     checkAllMENExist,
//     checkMarketExist
// } = require('./checking');


const {
    init,
    listPath
} = require('./constants');

const updateMEN = require('./updateMEN.fix');
const getScriptedMarket = require('./getMapped');

;(async function() {
    init();

    let updateList = await csv().fromFile(listPath);
    updateList = updateList.map((d) => ({
        ...d,
        LocationID: d.LocationID.toLowerCase(),
        MarketCode: d.MarketCode < 10 ? `00${d.MarketCode}` : d.MarketCode < 100 ? `0${d.MarketCode}` : `${d.MarketCode}`
    }));
    updateList = _.orderBy(updateList, ['LocationID', 'MarketCode']);
    // await checkAllMENExist(updateList);
    // await checkMarketExist(updateList);

    const scriptedList = await getScriptedMarket(updateList);

    console.log('----Done to get scripted market');

    await updateMEN([...updateList, ...scriptedList]);
}());
