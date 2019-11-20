const XoDs = require('xo-ds-handler');
const xoDs = new XoDs();
const csv = require('csvtojson');
const _ = require('lodash');
const Promise = require('bluebird');

const config = {
    xoDsConfig: {
        // 'write-store': {
        //     storefront: 'postgres://localservices:!q2w3e4r5t6y7@storefronts-pg-qa.cfjnafc8bsrz.us-east-1.rds.amazonaws.com/storefront'
        // }
        "write-store": {
            "storefront": "postgres://localservices:XvkTraVU94enXcud@storefronts-pg-prod.cfjnafc8bsrz.us-east-1.rds.amazonaws.com/storefront"
        }
    },
    DB: 'storefront'
}

xoDs.config(config.xoDsConfig);

const DB = 'storefront';

const findStorefrontId = async (loc, cat) => {
    const sql = `select data->>'id' as id,
        data->>'statusCode' as st,
        data->>'isPurchased' as pur,
        data->>'winningStorefrontId' as winid,
        data->>'locationId' as loc,
        data->>'salesProfileStartDate' as spsd
    from storefronts
    where data->>'locationId' = '${loc}' AND data->>'categoryCode' = '${cat}';`

    const r = await xoDs.pg.execute(DB, sql)
    if (r.length === 0) {
        console.log(`>>>>>>>>>>>>>>>>>>>>`)
        console.log(`${loc} ${cat} not exist !!!!`)
        console.log('<<<<<<<<<<<<<<<<<<<<');

        return null
    }

    if (r.length === 1) {
        return r[0].id
    }

    const winIds = r.filter(sf => sf.winid === '00000000-0000-0000-0000-000000000000')
    if (winIds.length === 0) {
        console.log(`++++++++++++++++++++`)
        console.log(`${loc} ${cat} exist many but no winning storefront !!!!`)
        console.log('++++++++++++++++++++');

        return null
    }

    if (winIds.length > 1) {

        const notRemovedSF = r.filter(sf => sf.st !== 'REMOVED')
        if (notRemovedSF.length === 0) {
            console.log(`====================`)
            console.log(`${loc} ${cat} all REMOVED !!!!`)
            console.log('====================');

            return null
        }
        if (notRemovedSF.length > 1) {
            console.log(`====================`)
            console.log(`${loc} ${cat} exist multi not REMOVED storefront !!!!`)
            console.log('====================');
            return null
        }

        return notRemovedSF[0].id
    }

    return winIds[0].id
}

const updateSales = async (storefrontId, updateArr) => {
    if (!storefrontId) { return }
    const sql = `select * from sales_profiles where data->>'storefrontId' = '${storefrontId}'`;

    let [sales] = await xoDs.pg.execute(DB, sql);
    sales = sales.data;
    updateArr.forEach(updateItem => {
        let getRealItem = false;

        for (let i = 0; i < sales.services.length; i++) {
            const srv = sales.services[i];

            if (srv.marketCode !== updateItem.MarketCode) { continue }

            if (srv.sku === updateItem.SKU) {
                if (!srv.subscriptionId) {
                    console.log(`${updateItem.LocationID} ${updateItem.CategoryCode} ${updateItem.MarketCode} ${updateItem.SKU} ${storefrontId} updated by GP.`)
                    return
                }

                srv.endDate = new Date(updateItem.SubscriptionEndDate).toISOString()
                getRealItem = true
            } else if (srv.addOns.length){
                const aoMatch = srv.addOns.find(ao => ao.sku === updateItem.SKU)
                if (aoMatch) {
                    if (!aoMatch.subscriptionId) {
                        console.log(`${updateItem.LocationID} ${updateItem.CategoryCode} ${updateItem.MarketCode} ${updateItem.SKU} ${storefrontId} updated by GP.`)
                        return
                    }

                    aoMatch.endDate = new Date(updateItem.SubscriptionEndDate).toISOString()
                    getRealItem = true
                }
            }

            if (updateItem.Product === 'Storefront' && !getRealItem && !srv.sku) {
                srv.endDate = new Date(updateItem.SubscriptionEndDate).toISOString()
                getRealItem = true
            }

            break;
        }

        if (!getRealItem) {
            console.log('||||||||||||||')
            console.log(`${updateItem.LocationID} ${updateItem.CategoryCode} ${updateItem.MarketCode} ${updateItem.SKU} ${storefrontId} not found.`)
        }
    })

    // req(sales.service)
}

const execute = async (updateArr) => {
    if (!updateArr.length) { return }
    // if (updateArr.length > 2) {
    //     console.log('==========')
    //     console.dir(updateArr.map(d => ({
    //         loc: d.LocationID,
    //         cat: d.CategoryCode,
    //         mar: d.MarketCode,
    //         sku: d.SKU,
    //         pro: d.Product
    //     })), {depth:9});
    //     console.log('==========')
    // }
    return findStorefrontId(updateArr[0].LocationID, updateArr[0].CategoryCode)
        .then((sfId) => updateSales(sfId, updateArr));
}

const executer = async (updateArr, isLatsOne = false) => {
    let jobs = []
    const max = 30;

    jobs.push(execute(updateArr))

    if (jobs.length === max || isLatsOne) {
        await Promise.all(jobs)
        jobs = []
    }
}

;(async function() {

    let updateList = await csv().fromFile(`${__dirname}/list2.csv`);
    updateList = updateList.map(d => ({
        ...d,
        LocationID: d.LocationID.toLowerCase(),
    })),
    updateList = _.orderBy(updateList, ['LocationID', 'CategoryCode', 'MarketCode']);

    // console.dir(updateList.map(d => ({
    //     loc: d.LocationID,
    //     cat: d.CategoryCode,
    //     mar: d.MarketCode
    // })), {depth:9});

    const total = updateList.length

    let updateGrp = [];
    let preMarket, preCat, preLoc

    for (let i = 0; i < total; i++) {
        const isLatsOne = i === (total - 1);
        const { LocationID, MarketCode, CategoryCode } = updateList[i];
        if (LocationID === preLoc && MarketCode === preMarket && CategoryCode === preCat) {
            updateGrp.push(updateList[i])

            // The last one
            if (isLatsOne) {
                await executer(updateGrp, isLatsOne);
            }

        } else {
            await executer(updateGrp, isLatsOne);
            updateGrp = [];
            updateGrp.push(updateList[i])
            preLoc = LocationID
            preMarket = MarketCode
            preCat = CategoryCode
        }
    }
})();