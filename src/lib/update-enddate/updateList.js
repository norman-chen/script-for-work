'use strict';

const fs = require('fs');
const xoReq = new(require('xo-request'))();

const {
    notMatchMarketPath,
    updatedByGPPath,
    freeSrvPath,
    freeAddonPath,
    requestInfo,
    failToUpdatePath,
    isUpdateByApi,
    succeedToUpdatePath
} = require('./constants');

const { updateMappedSrv, updateMappedAddon } = require('./updateMapped');

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
    // console.dir(options, {depth: 9})
    if (isUpdateByApi) {
        return xoReq.put(`${url}/sales/${sales.id}?apikey=${apikey}`, options)
            .then(() => {
                updateArr.forEach((item) => {
                    fs.appendFileSync(succeedToUpdatePath, `${item.LocationID},${item.SubscriptionEndDate},${item.MarketCode},${item.SKU},${item.Product},${item.CategoryCode},${sales.id}\n`);
                });
            })
            .catch((error) => {
                updateArr.forEach((item) => {
                    fs.appendFileSync(failToUpdatePath, `${item.LocationID},${item.SubscriptionEndDate},${item.MarketCode},${item.SKU},${item.Product},${item.CategoryCode},${sales.id},${error.message}\n`);
                });
            });
    }
};

const shouldUpdateSrv = (srv, updateItem, storefrontId) => {
    if (srv.purchaseStatusCode === 'FREEMIUM') {
        fs.appendFileSync(freeSrvPath, `${updateItem.LocationID},${updateItem.CategoryCode},${updateItem.MarketCode},${updateItem.SKU},${storefrontId}\n`);

        return false;
    }

    return true;
};

const shouldUpdateAddon = (aoMatch, updateItem, storefrontId) => {
    if (aoMatch.status === 'INACTIVE') {
        fs.appendFileSync(freeAddonPath, `${updateItem.LocationID},${updateItem.CategoryCode},${updateItem.MarketCode},${updateItem.SKU},${storefrontId}\n`);

        return false;
    }

    return true;
};

module.exports = async(sales, updateArr) => {
    if (!sales) { return; }

    const storefrontId = sales.storefrontId;

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

                const shouldUpdate = shouldUpdateSrv(srv, updateItem, storefrontId);

                await updateMappedSrv(sales, storefrontId, i, updateItem, !shouldUpdate);

                if (shouldUpdate) {
                    srv.endDate = new Date(updateItem.SubscriptionEndDate).toISOString();
                    getRealItem = true;
                }
            }

            if (srv.addOns.length) {
                const aoMatchIdx = srv.addOns.findIndex((ao) => ao.sku === updateItem.SKU);

                if (aoMatchIdx !== -1) {
                    const aoMatch = srv.addOns[aoMatchIdx];

                    if (!aoMatch.subscriptionId) {
                        fs.appendFileSync(updatedByGPPath, `${updateItem.LocationID},${updateItem.CategoryCode},${updateItem.MarketCode},${updateItem.SKU},${storefrontId}\n`);

                        return;
                    }

                    const shouldUpdate = shouldUpdateAddon(aoMatch, updateItem, storefrontId);

                    await updateMappedAddon(sales, storefrontId, updateItem.MarketCode, i, aoMatchIdx, updateItem, !shouldUpdate);

                    if (shouldUpdate) {
                        aoMatch.endDate = new Date(updateItem.SubscriptionEndDate).toISOString();
                        getRealItem = true;
                    }
                }
            }

            if (!getRealItem && updateItem.Product === 'Storefront' && !srv.sku) {
                if (!srv.subscriptionId) {
                    fs.appendFileSync(updatedByGPPath, `${updateItem.LocationID},${updateItem.CategoryCode},${updateItem.MarketCode},${updateItem.SKU},${storefrontId}\n`);

                    return;
                }

                const shouldUpdate = shouldUpdateSrv(srv, updateItem, storefrontId);

                await updateMappedSrv(sales, storefrontId, i, updateItem, !shouldUpdate);

                if (shouldUpdate) {
                    srv.endDate = new Date(updateItem.SubscriptionEndDate).toISOString();
                    getRealItem = true;
                }
            }

            break;
        }

        if (!getRealItem) {
            fs.appendFileSync(notMatchMarketPath, `${updateItem.LocationID},${updateItem.CategoryCode},${updateItem.MarketCode},${updateItem.SKU},${storefrontId}\n`);
        }
    }

    return req(sales, updateArr);
    // console.dir(sales, {depth: 99})
    // console.log('=========================')
};
