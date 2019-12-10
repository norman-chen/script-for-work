'use strict';

const Promise = require('bluebird');
const fs = require('fs');

const {
    xoDs,
    DB,
    mapListPath
} = require('./constants');

const getSrvSQL = (locationId, categoryCode, marketCode) => `with tmp_services as (
    select
        srv as data,
        sp.data->>'storefrontId' as sfid,
        srv ->> 'marketCode' as mc
    from sales_profiles sp, jsonb_array_elements(sp.data->'services') as srv
    where sp.data->>'locationId' = '${locationId}'and sp.data->'services'->0->>'categoryCode' = '${categoryCode}' and srv ->> 'marketCode' = '${marketCode}'
)
select ps.data->>'storefrontId' as "storefrontId",
    ps.data->>'crmAccountId' as "crmAccountId",
    ps.data->>'locationId' as "locationId",
    ps.data->>'newMarketCode' as "marketCode",
    ps.data->>'categoryCode' as "categoryCode",
    sp.data as "preSalesProfiles"
from paid_storefront_market_map ps
inner join tmp_services ts on ps.data->>'storefrontId' = ts.sfid and (case when ps.data->>'legacyMarketCode' is not null then ps.data->>'legacyMarketCode' else ps.data->>'mappedLegacyMarketCode' end)=ts.data->>'marketCode'
inner join sales_profiles sp on ps.data->>'storefrontId' = sp.data->>'storefrontId', jsonb_array_elements(sp.data->'services') as service
where ps.data->>'marketStatus' <> 'UNCHANGED'
and service->>'id'=ps.data->>'salesProfileId'
and service->>'purchaseStatusCode'='PAID'
and coalesce(service->>'subscriptionId','') <> '';`;

const getAddOnSQL = (locationId, categoryCode, marketCode, sku) => `with tmp_addons as (
	select
    	addOn as data,
    	srv ->> 'marketCode' as mc,
    	sp.data->>'storefrontId' as sfid
    from sales_profiles sp, jsonb_array_elements(sp.data->'services') as srv, jsonb_array_elements(srv->'addOns') as addOn
	where sp.data->>'locationId' = '${locationId}'and sp.data->'services'->0->>'categoryCode' = '${categoryCode}' and srv ->> 'marketCode' = '${marketCode}' and addOn->>'sku' = '${sku}'
)
select
    addonmap.data->>'locationId' as "locationId",
    addonmap.data->>'storefrontId' as "storefrontId",
    addonmap.data->>'newMarketCode' as "marketCode",
    addonmap.data->>'categoryCode' as "categoryCode",
    addonmap.data->>'newAddOnCode' as "sku"
from addon_market_map addonmap
inner join tmp_addons ta on addonmap.data->>'storefrontId' = ta.sfid
and (case when addonmap.data->>'legacyMarketCode' is not null then addonmap.data->>'legacyMarketCode' else addonmap.data->>'mappedLegacyMarketCode' end) = ta.mc
and addonmap.data->>'addOnCode' = ta.data->>'sku'
inner join sales_profiles sp on addonmap.data->>'storefrontId' = sp.data->>'storefrontId',
jsonb_array_elements(sp.data->'services') as service,
jsonb_array_elements(service->'addOns') as addOn
where addonmap.data->>'marketStatus' <> 'UNCHANGED'
and addonmap.data->>'salesProfileId' = service->>'id'
and addonmap.data->>'newAddOnCode' = addOn->>'sku'
and addOn->>'status' <> 'INACTIVE'
and coalesce(addOn->>'subscriptionId','') <> '';`;

module.exports = async(updateList) => {
    const scriptedList = [];

    let promiseArr = [];

    const getScriptedMarket = async({ isSrv, LocationId, CategoryCode, MarketCode, SKU }) => {
        if (isSrv) {
            const scriptedMarkets = await xoDs.pg.execute(DB, getSrvSQL(LocationId, CategoryCode, MarketCode));
            scriptedMarkets.forEach((scriptMarket) => {
                scriptedList.push({
                    LocationID: LocationId,
                    CategoryCode,
                    SKU,
                    MarketCode: scriptMarket.marketCode
                });


                fs.appendFileSync(mapListPath, `${LocationId},${CategoryCode},${SKU},${MarketCode},${scriptMarket.marketCode}\n`);
            });
        } else {
            const scriptedAddons = await xoDs.pg.execute(DB, getAddOnSQL(LocationId, CategoryCode, MarketCode, SKU));
            scriptedAddons.forEach((scriptedAddon) => {
                scriptedList.push({
                    LocationID: LocationId,
                    CategoryCode,
                    SKU,
                    MarketCode: scriptedAddon.marketCode
                });

                fs.appendFileSync(mapListPath, `${LocationId},${CategoryCode},${SKU},${MarketCode},${scriptedAddon.marketCode}\n`);
            });
        }
    };

    for (let i = 0; i < updateList.length; i++) {
        const { LocationID: LocationId, MarketCode, SKU, CategoryCode } = updateList[i];

        SKU === 'SKU-00000034' ?
            promiseArr.push(getScriptedMarket({ isSrv: false, LocationId, CategoryCode, MarketCode, SKU })) :
            promiseArr.push(getScriptedMarket({ isSrv: true, LocationId, CategoryCode, MarketCode, SKU }));

        if (promiseArr.length >= 30 || i === updateList.length - 1) {
            await Promise.all(promiseArr);
            promiseArr = [];
        }
    }

    return scriptedList;
};
