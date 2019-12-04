'use strict';

const csv = require('csvtojson');
const _ = require('lodash');

// const {
//     checkAllMENExist,
//     checkMarketExist
// } = require('./checking');

const updateMEN = require('./updateMEN');

const listName = 'list.csv';
const listPath = `${__dirname}/${listName}`;


;(async function() {
    let updateList = await csv().fromFile(listPath);
    updateList = updateList.map((d) => ({
        ...d,
        LocationID: d.LocationID.toLowerCase(),
        MarketCode: d.MarketCode < 10 ? `00${d.MarketCode}` : d.MarketCode < 100 ? `0${d.MarketCode}` : `${d.MarketCode}`
    })),
    updateList = _.orderBy(updateList, ['LocationID', 'MarketCode']);
    // await checkAllMENExist(updateList);
    // await checkMarketExist(updateList);

    await updateMEN(updateList);
}());
