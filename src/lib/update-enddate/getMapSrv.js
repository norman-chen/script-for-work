const getSrvSQL = (storefrontId)`with tmp_services as (
	select data->'services'->0 as data from sales_profiles
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

const getAddOnSQL = (storefrontId, markCode, srvIdx, addonIdx)`with tmp_addons as (
	select data->'services'->${srvIdx}->'addOns'->${addonIdx} as data from sales_profiles
	where data->>'storefrontId' = '${storefrontId}'
)
select
    addonmap.data->>'crmAccountId' as "crmAccountId",
    addonmap.data->>'locationId' as "locationId",
    addonmap.data->>'storefrontId' as "storefrontId",
    addonmap.data->>'newMarketCode' as "marketCode",
    addonmap.data->>'categoryCode' as "categoryCode",
    addonmap.data->>'newAddOnCode' as "sku",
    sp.data as "preSalesProfiles"
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