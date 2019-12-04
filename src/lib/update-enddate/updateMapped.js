'use strict';

const fs = require('fs');

const {
    xoDs,
    DB,
    mapListPath,
    mappedAbnormal
} = require('./constants');

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
and service->>'purchaseStatusCode'='PAID'
and coalesce(service->>'subscriptionId','') <> ''`;

const getAddOnSQL = (storefrontId, markCode, srvIdx, addonIdx) => `with tmp_addons as (
	select data->'services'->${srvIdx}->'addOns'->${addonIdx} as data from sales_profiles
	where data->>'storefrontId' = '${storefrontId}'
)
select
    addonmap.data->>'locationId' as "locationId",
    addonmap.data->>'storefrontId' as "storefrontId",
    addonmap.data->>'newMarketCode' as "marketCode",
    addonmap.data->>'categoryCode' as "categoryCode",
    addonmap.data->>'newAddOnCode' as "sku"
from addon_market_map addonmap
inner join tmp_addons ta on addonmap.data->>'storefrontId' = '${storefrontId}'
and (case when addonmap.data->>'legacyMarketCode' is not null then addonmap.data->>'legacyMarketCode' else addonmap.data->>'mappedLegacyMarketCode' end) = '${markCode}'
and addonmap.data->>'addOnCode' = ta.data->>'sku'
inner join sales_profiles sp on addonmap.data->>'storefrontId' = sp.data->>'storefrontId',
jsonb_array_elements(sp.data->'services') as service,
jsonb_array_elements(service->'addOns') as addOn
where addonmap.data->>'marketStatus' <> 'UNCHANGED'
and addonmap.data->>'salesProfileId' = service->>'id'
and addonmap.data->>'newAddOnCode' = addOn->>'sku'
and addOn->>'status' <> 'INACTIVE'
and coalesce(addOn->>'subscriptionId','') <> ''`;

const getMapSrv = async(storefrontId, srvIdx, updateItem) => {
    const mapItem = await xoDs.pg.execute(DB, getSrvSQL(storefrontId, srvIdx));

    mapItem.forEach((item) => {
        fs.appendFileSync(mapListPath, `${updateItem.LocationID},${updateItem.CategoryCode},${updateItem.MarketCode},${updateItem.SKU},${item.marketCode},${storefrontId}\n`);
    });

    return mapItem.map((item) => ({
        marketCode: item.marketCode
        // sku: item.sku
    }));
};

const getMapAddOn = async(storefrontId, markCode, srvIdx, addonIdx, updateItem) => {
    const mapItem = await xoDs.pg.execute(DB, getAddOnSQL(storefrontId, markCode, srvIdx, addonIdx));

    mapItem.forEach((item) => {
        fs.appendFileSync(mapListPath, `${updateItem.LocationID},${updateItem.CategoryCode},${updateItem.MarketCode},${updateItem.SKU},${item.marketCode},${storefrontId}\n`);
    });

    return mapItem.map((item) => ({
        marketCode: item.marketCode,
        sku       : item.sku
    }));
};

const setMappedSrv = (sp, newEndDate, marketCode, oldIsFree, updateItem, storefrontId) => {
    const mapSrv = sp.services.find((srv) => srv.marketCode === marketCode);
    if (!mapSrv) { return; }
    if (mapSrv.purchaseStatusCode === 'FREEMIUM') { return; }
    if (!mapSrv.subscriptionId) { return; }

    if (oldIsFree) {
        fs.appendFileSync(mappedAbnormal, `${updateItem.LocationID},${updateItem.CategoryCode},${updateItem.MarketCode},${updateItem.SKU},${marketCode},${storefrontId}\n`);

        return;
    }

    mapSrv.endDate = new Date(newEndDate).toISOString();
};

const setMappedAddon = (sp, newEndDate, marketCode, sku, oldIsInactive, updateItem, storefrontId) => {
    const mapSrv = sp.services.find((srv) => srv.marketCode === marketCode);
    if (!mapSrv) { return; }
    if (mapSrv.purchaseStatusCode === 'FREEMIUM') { return; }

    const mappedAddon = mapSrv.addOns.find((ao) => ao.sku === sku);
    if (!mappedAddon) { return; }
    if (mappedAddon.status === 'INACTIVE') { return; }
    if (!mappedAddon.subscriptionId) { return; }

    if (oldIsInactive) {
        fs.appendFileSync(mappedAbnormal, `${updateItem.LocationID},${updateItem.CategoryCode},${updateItem.MarketCode},${updateItem.SKU},${marketCode},${storefrontId}\n`);

        return;
    }

    mappedAddon.endDate = new Date(newEndDate).toISOString();
};

const updateMappedSrv = async(sp, storefrontId, srvIdx, updateItem, oldIsFree) => {
    const R = await getMapSrv(storefrontId, srvIdx, updateItem);

    R.forEach((r) => {
        setMappedSrv(sp, updateItem.SubscriptionEndDate, r.marketCode, oldIsFree, updateItem, storefrontId);
    });
};

const updateMappedAddon = async(sp, storefrontId, markCode, srvIdx, addonIdx, updateItem, oldIsInactive) => {
    const R = await getMapAddOn(storefrontId, markCode, srvIdx, addonIdx, updateItem);

    R.forEach((r) => {
        setMappedAddon(sp, updateItem.SubscriptionEndDate, r.marketCode, r.sku, oldIsInactive, updateItem, storefrontId);
    });
};

module.exports = {
    updateMappedSrv,
    updateMappedAddon
};
