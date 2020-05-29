// qa
export AWS_ACCESS_KEY_ID=AKIAIWCZFDTHS2JCXAJA
export AWS_SECRET_ACCESS_KEY=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


export AWS_ACCESS_KEY_ID=AKIAJ7CT2YKFWAMKBG7Q
export AWS_SECRET_ACCESS_KEY=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

// prod
export AWS_ACCESS_KEY_ID=AKIAJLYS6NZ5LPWW6QNQ
export AWS_SECRET_ACCESS_KEY=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

aws-es-curl --region=us-east-1 -X GET 'https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/admin/profiles/_search' -d '{"query":{"bool":{"must":[{"match_all":{}}],"must_not":[],"should":[]}},"from":0,"size":10,"sort":[],"aggs":{}}'



aws-es-curl --region=us-east-1 -X GET 'https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/admin/profiles/_search' -d '{"query":{"bool":{"must":[{"match_all":{}}],"must_not":[],"should":[]}},"from":0,"size":10,"sort":[],"aggs":{}}'

aws-es-curl --region=us-east-1 -X GET 'https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/admin'

aws-es-curl --region=us-east-1 -X GET 'https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/admin/profiles/_search?q=id:46721841-5c1c-4c37-9984-6ad494ab5fab'

curl --region=us-east-1 -XGET 'https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/admin/profiles/_count?pretty' -d '
{
    "query": {
        "match_all": {}
    }
}
'

// count
aws-es-curl --region=us-east-1 -X GET 'https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/admin/profiles/_count?pretty'
--prod
aws-es-curl --region=us-east-1 -X GET 'https://search-xo-local-partners-prod-ap25bstxjtk5xaxpvu3jxmajh4.us-east-1.es.amazonaws.com/admin/profiles/_count?pretty'


// accountId
aws-es-curl --region=us-east-1 -X GET 'https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/admin/profiles/_search?q=accountId:408549a7-4f34-4baa-84e6-a1a100e96ca0&pretty'

// displayId
aws-es-curl --region=us-east-1 -X GET 'https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/admin/profiles/_search?q=displayId:628263&pretty'

// unclaim
aws-es-curl --region=us-east-1 -X GET 'https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/admin/profiles/_search?q=claimedStatus:UNCLAIMED&pretty'

// id
aws-es-curl --region=us-east-1 -X GET 'https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/admin/profiles/b343e7bd-5acd-4bf0-8d57-a591010635b7?pretty'

aws-es-curl --region=us-east-1 -X GET 'search-xo-local-reviews-qa-fzv5pybwwbcqmjw7llpa43k4lq.us-east-1.es.amazonaws.com/reviews_v3/review/d7588bad-534a-4564-a709-aff9b457eb04?pretty'


SELECT data->>'id' as id FROM storefronts
ORDER BY data->>'id'ls

OFFSET 0
LIMIT 100

746cdc12-80cd-48db-ad7b-bf6373eda633

b3f56030-575e-41c7-a5c7-ff2eab0fcbc7

408549a7-4f34-4baa-84e6-a1a100e96ca0
180fc350-d290-4d3d-91a6-a2e5010fb779
180fc350-d290-4d3d-91a6-a2e5010fb779
180fc350-d290-4d3d-91a6-a2e5010fb779

14567215-a846-4699-b04f-a3f682221a36


628263
628263
964616

// ISSUE STOREFRONTID
// 22000-22099 IN LOG
00fcfb66-2d1d-47b9-8a49-a6ce00d31f0a


echo '{"settings":{"index":{"max_result_window":"10000000","analysis":{"filter":{"substring_filter":{"min_gram":"3","type":"ngram","max_gram":"50"}},"analyzer":{"autocomplete":{"type":"custom","filter":["trim","lowercase","substring_filter"],"tokenizer":"keyword"},"case_insensitive_keyword":{"filter":["lowercase"],"tokenizer":"keyword"}}}}},"mappings":{"profiles":{"properties":{"accountId":{"type":"keyword"},"crmAccountId":{"type":"keyword"},"accountName":{"type":"text","fielddata":true,"fields":{"autocomplete":{"type":"text","analyzer":"autocomplete"},"raw":{"type":"text","fielddata":true,"analyzer":"keyword"}}},"address":{"properties":{"address1":{"type":"text"},"address2":{"type":"text"},"city":{"type":"text"},"isPublic":{"type":"boolean"},"isTransaction":{"type":"boolean"},"isPurchased":{"type":"boolean"},"postalCode":{"type":"text"},"state":{"type":"text"}}},"categoryCodesDenormalized":{"type":"text"},"categoryNamesDenormalized":{"type":"text","fielddata":true},"claimedStatus":{"type":"text"},"createdDate":{"type":"date","index":false,"format":"dateOptionalTime"},"description":{"type":"text"},"displayId":{"type":"long"},"emails":{"properties":{"address":{"type":"text"},"type":{"type":"text"}}},"headline":{"type":"text"},"id":{"type":"keyword"},"locationId":{"type":"keyword"},"marketCodesDenormalized":{"type":"text"},"modifiedDate":{"type":"date","index":false,"format":"dateOptionalTime"},"name":{"type":"text","fielddata":true,"fields":{"autocomplete":{"type":"text","analyzer":"autocomplete"},"raw":{"type":"text","fielddata":true,"analyzer":"case_insensitive_keyword"}}},"phones":{"properties":{"extension":{"type":"text"},"number":{"type":"text"},"type":{"type":"text"}}},"profileStatus":{"type":"text"},"profileStatusCodesDenormalized":{"type":"text","fielddata":true},"purchaseStatusCodesDenormalized":{"type":"text","fielddata":true},"qualityTier":{"type":"text"},"salesProfiles":{"properties":{"categoryCode":{"type":"text"},"categoryName":{"type":"text"},"endDate":{"type":"text"},"id":{"type":"keyword"},"marketCode":{"type":"text"},"marketName":{"type":"text"},"purchaseStatusCode":{"type":"text"},"statusCode":{"type":"text"},"startDate":{"type":"text"}}},"settings":{"properties":{"name":{"type":"text"},"position":{"type":"long"},"value":{"type":"boolean"}}},"sortOrders":{"properties":{"sortOrder_purchaseStatus":{"type":"long"}}},"subscriptionIdsDenormalized":{"type":"text"},"emailsDenormalized":{"type":"text","analyzer":"autocomplete"},"userIdsDenormalized":{"type":"keyword"},"users":{"properties":{"email":{"type":"text","index":false},"firstName":{"type":"text","index":false},"id":{"type":"keyword","index":false},"isActive":{"type":"boolean","index":false},"lastLogin":{"type":"date","format":"dateOptionalTime"},"lastName":{"type":"text","index":false},"type":{"type":"text","index":false},"username":{"type":"text","fields":{"text":{"type":"text","analyzer":"standard"}}}}},"vendorId":{"type":"keyword"},"verificationStatus":{"type":"text"},"website":{"type":"text"},"winningProfileId":{"type":"keyword"}}}}}' | aws-es-curl --region=us-east-1 -X PUT https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/admin_v1

echo ‘{query:{match:{accountId:4550dc4d-170f-4c6a-9e33-a212011c6fad}}}’ | aws-es-curl --region=us-east-1 -X DELETE https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/admin_v1


// remove alias
echo '{"actions":[{"remove":{"index":"admin_v1","alias":"admin"}}]}' | aws-es-curl --region=us-east-1 -d -X POST  https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/_aliases

-- prod
echo '{"actions":[{"add":{"index":"admin_v1","alias":"admin"}}]}' | aws-es-curl --region=us-east-1 -d -X POST  https://search-xo-local-partners-prod-ap25bstxjtk5xaxpvu3jxmajh4.us-east-1.es.amazonaws.com/_aliases

95fd1a9d-d20b-4f65-abda-62058d14d61d
o
34
--insert mapping
echo '{"settings":{"index":{"max_result_window":"10000000","analysis":{"filter":{"substring_filter":{"min_gram":"3","type":"ngram","max_gram":"50"}},"analyzer":{"autocomplete":{"type":"custom","filter":["trim","lowercase","substring_filter"],"tokenizer":"keyword"},"case_insensitive_keyword":{"filter":["lowercase"],"tokenizer":"keyword"}}}}},"mappings":{"profiles":{"properties":{"accountId":{"type":"keyword"},"accountName":{"type":"text","fields":{"autocomplete":{"type":"text","analyzer":"autocomplete"},"raw":{"type":"text","analyzer":"keyword","fielddata":true}},"fielddata":true},"address":{"properties":{"address1":{"type":"text"},"address2":{"type":"text"},"city":{"type":"text"},"isPublic":{"type":"boolean"},"postalCode":{"type":"text"},"state":{"type":"text"}}},"categoryCodesDenormalized":{"type":"text"},"categoryNamesDenormalized":{"type":"text","analyzer":"keyword","fielddata":true},"claimedStatus":{"type":"text"},"createdDate":{"type":"date","index":false,"format":"dateOptionalTime"},"crmAccountId":{"type":"keyword"},"description":{"type":"text"},"displayId":{"type":"long"},"emails":{"properties":{"address":{"type":"text"},"type":{"type":"text"}}},"emailsDenormalized":{"type":"text","analyzer":"autocomplete"},"headline":{"type":"text"},"id":{"type":"keyword"},"isPurchased":{"type":"boolean"},"isTransaction":{"type":"boolean"},"locationId":{"type":"keyword"},"marketCodesDenormalized":{"type":"text"},"modifiedDate":{"type":"date","index":false,"format":"dateOptionalTime"},"name":{"type":"text","fields":{"autocomplete":{"type":"text","analyzer":"autocomplete"},"raw":{"type":"text","analyzer":"case_insensitive_keyword","fielddata":true}},"fielddata":true},"phones":{"properties":{"extension":{"type":"text"},"number":{"type":"text"},"type":{"type":"text"}}},"profileStatus":{"type":"text"},"profileStatusCodesDenormalized":{"type":"text","fielddata":true},"purchaseStatusCodesDenormalized":{"type":"text","fielddata":true},"qualityTier":{"type":"text"},"salesProfiles":{"properties":{"categoryCode":{"type":"text"},"categoryName":{"type":"text"},"endDate":{"type":"text"},"id":{"type":"keyword"},"marketCode":{"type":"text"},"marketName":{"type":"text"},"purchaseStatusCode":{"type":"text"},"salesProfileStatusCode":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},"startDate":{"type":"text"},"statusCode":{"type":"text"}}},"settings":{"properties":{"name":{"type":"text"},"position":{"type":"long"},"value":{"type":"boolean"}}},"sortOrders":{"properties":{"sortOrder_purchaseStatus":{"type":"long"}}},"subscriptionIdsDenormalized":{"type":"text"},"timestamp":{"properties":{"createdAt":{"type":"date"},"updatedAt":{"type":"date"}}},"userIdsDenormalized":{"type":"keyword"},"users":{"properties":{"email":{"type":"text","index":false},"firstName":{"type":"text","index":false},"id":{"type":"keyword","index":false},"isActive":{"type":"boolean","index":false},"lastLogin":{"type":"date","format":"dateOptionalTime"},"lastName":{"type":"text","index":false},"type":{"type":"text","index":false},"username":{"type":"text","fields":{"text":{"type":"text","analyzer":"standard"}}}}},"vendorId":{"type":"keyword"},"verificationStatus":{"type":"text"},"website":{"type":"text"},"winningProfileId":{"type":"keyword"}}}}}' | aws-es-curl --region=us-east-1 -X PUT https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/admin_v1
-- prod
echo '{"settings":{"index":{"max_result_window":"10000000","analysis":{"filter":{"substring_filter":{"min_gram":"3","type":"ngram","max_gram":"50"}},"analyzer":{"autocomplete":{"type":"custom","filter":["trim","lowercase","substring_filter"],"tokenizer":"keyword"},"case_insensitive_keyword":{"filter":["lowercase"],"tokenizer":"keyword"}}}}},"mappings":{"profiles":{"properties":{"accountId":{"type":"keyword"},"accountName":{"type":"text","fields":{"autocomplete":{"type":"text","analyzer":"autocomplete"},"raw":{"type":"text","analyzer":"keyword","fielddata":true}},"fielddata":true},"address":{"properties":{"address1":{"type":"text"},"address2":{"type":"text"},"city":{"type":"text"},"isPublic":{"type":"boolean"},"postalCode":{"type":"text"},"state":{"type":"text"}}},"categoryCodesDenormalized":{"type":"text"},"categoryNamesDenormalized":{"type":"text","analyzer":"keyword","fielddata":true},"claimedStatus":{"type":"text"},"createdDate":{"type":"date","index":false,"format":"dateOptionalTime"},"crmAccountId":{"type":"keyword"},"description":{"type":"text"},"displayId":{"type":"long"},"emails":{"properties":{"address":{"type":"text"},"type":{"type":"text"}}},"emailsDenormalized":{"type":"text","analyzer":"autocomplete"},"headline":{"type":"text"},"id":{"type":"keyword"},"isPurchased":{"type":"boolean"},"isTransaction":{"type":"boolean"},"locationId":{"type":"keyword"},"marketCodesDenormalized":{"type":"text"},"modifiedDate":{"type":"date","index":false,"format":"dateOptionalTime"},"name":{"type":"text","fields":{"autocomplete":{"type":"text","analyzer":"autocomplete"},"raw":{"type":"text","analyzer":"case_insensitive_keyword","fielddata":true}},"fielddata":true},"phones":{"properties":{"extension":{"type":"text"},"number":{"type":"text"},"type":{"type":"text"}}},"profileStatus":{"type":"text"},"profileStatusCodesDenormalized":{"type":"text","fielddata":true},"purchaseStatusCodesDenormalized":{"type":"text","fielddata":true},"qualityTier":{"type":"text"},"salesProfiles":{"properties":{"categoryCode":{"type":"text"},"categoryName":{"type":"text"},"endDate":{"type":"text"},"id":{"type":"keyword"},"marketCode":{"type":"text"},"marketName":{"type":"text"},"purchaseStatusCode":{"type":"text"},"salesProfileStatusCode":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},"startDate":{"type":"text"},"statusCode":{"type":"text"}}},"settings":{"properties":{"name":{"type":"text"},"position":{"type":"long"},"value":{"type":"boolean"}}},"sortOrders":{"properties":{"sortOrder_purchaseStatus":{"type":"long"}}},"subscriptionIdsDenormalized":{"type":"text"},"timestamp":{"properties":{"createdAt":{"type":"date"},"updatedAt":{"type":"date"}}},"userIdsDenormalized":{"type":"keyword"},"users":{"properties":{"email":{"type":"text","index":false},"firstName":{"type":"text","index":false},"id":{"type":"keyword","index":false},"isActive":{"type":"boolean","index":false},"lastLogin":{"type":"date","format":"dateOptionalTime"},"lastName":{"type":"text","index":false},"type":{"type":"text","index":false},"username":{"type":"text","fields":{"text":{"type":"text","analyzer":"standard"}}}}},"vendorId":{"type":"keyword"},"verificationStatus":{"type":"text"},"website":{"type":"text"},"winningProfileId":{"type":"keyword"}}}}}' | aws-es-curl --region=us-east-1 -X PUT https://search-xo-local-partners-prod-ap25bstxjtk5xaxpvu3jxmajh4.us-east-1.es.amazonaws.com/admin_v1


--search mapping
aws-es-curl --region=us-east-1 -X GET https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/admin/profiles/_mapping

--search profiles
aws-es-curl --region=us-east-1 -X GET https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/admin/profiles/_search?q=name:per

--dump admin to admin_v1
elasticdump \
    --awsAccessKeyId= \
    --awsSecretAccessKey=2s+MMc9tu1D86+74kqAGX1jOfWf2CFmAS9dcOa3l \
    --input=https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/admin \
    --output=https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/admin_v1 \
    --type=data \
    --limit=3000

--set the index.max_result_window to 10000000, the default is 10000
echo '{"index.max_result_window":"10000000"}' | aws-es-curl --region=us-east-1 -X PUT https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/_all/_settings?preserve_existing=true

--add aliases
echo '{"actions":[{"add":{"index":"admin_v1","alias":"admin"}}]}' | aws-es-curl --region=us-east-1 -X POST https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/_aliases

aws-es-curl --region=us-east-1 -X GET https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/_aliases

--prod
https://search-xo-local-partners-prod-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com
https://search-xo-local-partners-prod-ap25bstxjtk5xaxpvu3jxmajh4.us-east-1.es.amazonaws.com


-- new mapping
echo '{"settings":{"index":{"max_result_window":"10000000","analysis":{"filter":{"substring_filter":{"min_gram":"3","type":"ngram","max_gram":"50"}},"analyzer":{"autocomplete":{"type":"custom","filter":["trim","lowercase","substring_filter"],"tokenizer":"keyword"},"case_insensitive_keyword":{"filter":["lowercase"],"tokenizer":"keyword"}}}}},"mappings":{"profiles":{"properties":{"accountId":{"type":"keyword"},"accountName":{"type":"text","fields":{"autocomplete":{"type":"text","analyzer":"autocomplete"},"raw":{"type":"text","analyzer":"keyword","fielddata":true}},"fielddata":true},"address":{"properties":{"address1":{"type":"text"},"address2":{"type":"text"},"city":{"type":"text"},"country":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},"isPublic":{"type":"boolean"},"postalCode":{"type":"text"},"state":{"type":"text"}}},"affiliates":{"properties":{"abbreviation":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},"code":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},"endDate":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},"id":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},"taxonomyId":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},"name":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},"startDate":{"type":"text"},"typeCode":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}}}},"categoryCodesDenormalized":{"type":"text"},"categoryNamesDenormalized":{"type":"text","analyzer":"keyword","fielddata":true},"claimedStatus":{"type":"text"},"createdDate":{"type":"date","index":false,"format":"dateOptionalTime"},"crmAccountId":{"type":"keyword"},"description":{"type":"text"},"displayId":{"type":"long"},"emails":{"properties":{"address":{"type":"text"},"type":{"type":"text"}}},"emailsDenormalized":{"type":"text","analyzer":"autocomplete"},"headline":{"type":"text"},"id":{"type":"keyword"},"isPurchased":{"type":"boolean"},"isTransaction":{"type":"boolean"},"locationId":{"type":"keyword"},"marketCodesDenormalized":{"type":"text"},"media":{"properties":{"main":{"properties":{"credit":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},"height":{"type":"long"},"id":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},"name":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},"sourceId":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},"typeCode":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},"url":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},"width":{"type":"long"}}}}},"modifiedDate":{"type":"date","index":false,"format":"dateOptionalTime"},"name":{"type":"text","fields":{"autocomplete":{"type":"text","analyzer":"autocomplete"},"raw":{"type":"text","analyzer":"case_insensitive_keyword","fielddata":true}},"fielddata":true},"phones":{"properties":{"extension":{"type":"text"},"number":{"type":"text"},"type":{"type":"text"}}},"profileStatus":{"type":"text"},"profileStatusCodesDenormalized":{"type":"text","fielddata":true},"purchaseStatusCodesDenormalized":{"type":"text","fielddata":true},"qualityTier":{"type":"text"},"salesProfiles":{"properties":{"addOns":{"properties":{"code":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},"name":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},"status":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}}}},"categoryCode":{"type":"text"},"categoryName":{"type":"text"},"endDate":{"type":"text"},"id":{"type":"keyword"},"isPrimary":{"type":"boolean"},"marketCode":{"type":"text"},"marketName":{"type":"text"},"purchaseStatusCode":{"type":"text"},"salesProfileStatusCode":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},"startDate":{"type":"text"},"statusCode":{"type":"text"}}},"settings":{"properties":{"name":{"type":"text"},"position":{"type":"long"},"value":{"type":"boolean"}}},"sortOrders":{"properties":{"sortOrder_purchaseStatus":{"type":"long"}}},"subscriptionIdsDenormalized":{"type":"text"},"timestamp":{"properties":{"createdAt":{"type":"date"},"updatedAt":{"type":"date"}}},"userIdsDenormalized":{"type":"keyword"},"users":{"properties":{"email":{"type":"text","index":false},"firstName":{"type":"text","index":false},"id":{"type":"keyword","index":false},"isActive":{"type":"boolean","index":false},"lastLogin":{"type":"date","format":"dateOptionalTime"},"lastName":{"type":"text","index":false},"type":{"type":"text","index":false},"username":{"type":"text","fields":{"text":{"type":"text","analyzer":"standard"}}}}},"vendorId":{"type":"keyword"},"verificationStatus":{"type":"text"},"website":{"type":"text"},"winningProfileId":{"type":"keyword"}}}}}' | aws-es-curl —region=us-east-1 -X PUT https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/admin_v1_temp


-H 'Content-Type: application/json'

aws-es-curl --region=us-east-1 -X GET 'https://search-xo-local-partners-prod-ap25bstxjtk5xaxpvu3jxmajh4.us-east-1.es.amazonaws.com/admin/profiles/_search?_source=id' -H 'Content-Type: application/json' -d '{"query":{"bool":{"must_not":{"exists":{"field":"id"}}}}}'

echo '{"AWS_ACCESS_KEY_ID":"AKIAJLYS6NZ5LPWW6QNQ","AWS_SECRET_ACCESS_KEY":"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","query":{"bool":{"must_not":{"exists":{"field":"id"}}}}}' | aws-es-curl --region=us-east-1 -d -X GET 'https://search-xo-local-partners-prod-ap25bstxjtk5xaxpvu3jxmajh4.us-east-1.es.amazonaws.com/admin/profiles/_search?_source=id'

aws-es-curl --region=us-east-1 -H 'Content-Type: application/json' -X GET 'https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/admin/profiles/_search?_source=id&q="{"bool":{"must_not":{"exists":{"field":"id"}}}}"'


echo '{"query":{"match":{"accountId":"4550dc4d-170f-4c6a-9e33-a212011c6fad"}}}' | aws-es-curl --region=us-east-1 -X POST https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/admin/profiles/_delete_by_query\?conflicts\=proceed

========================stats===========================

// create index for stats
echo '{"settings":{"index":{"max_result_window":"10000000"}},"mappings":{"mappings":{"storefronts":{"properties":{"leads":{"type":"long"},"marketCode":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}}},"month":{"type":"long"},"monthKey":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}},"fielddata":true},"storefrontId":{"type":"keyword"},"uniqueViews":{"type":"long"},"year":{"type":"long"}}}}}}' | aws-es-curl --region=us-east-1 -X PUT https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/stats_v1

// create index for bench_mark
echo '{"settings":{"index":{"max_result_window":"10000000"}},"mappings":{"storefronts":{"properties":{"calls":{"type":"float"},"clicks":{"type":"float"},"emails":{"type":"float"},"engagements":{"type":"float"},"saves":{"type":"float"},"uniqueViews":{"type":"float"},"year":{"type":"long"},"monthKey":{"type":"text","fields":{"keyword":{"type":"keyword","ignore_above":256}},"fielddata":true}}}}}' | aws-es-curl --region=us-east-1 -X PUT https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/benchmarks_v1

// create index for activities
echo '{"settings":{"index":{"max_result_window":"100000000","analysis":{"analyzer":{"case_insensitive_keyword":{"filter":["lowercase"],"tokenizer":"keyword"}}}}},"mappings":{"storefronts":{"properties":{"action":{"type":"text","analyzer":"case_insensitive_keyword","fielddata":true},"city":{"type":"text","analyzer":"case_insensitive_keyword","fielddata":true},"marketCode":{"type":"text","fielddata":true},"state":{"type":"text","analyzer":"case_insensitive_keyword","fielddata":true},"storefrontId":{"type":"keyword"},"visitorDate":{"type":"date"},"visitorName":{"type":"text","analyzer":"case_insensitive_keyword","fielddata":true}}}}}' | aws-es-curl --region=us-east-1 -X PUT https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/activities_v1

// get index list
aws-es-curl --region=us-east-1 -X GET 'https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/_cat/indices?v'

// add alias
echo '{"actions":[{"add":{"index":"stats_v1","alias":"stats"}}]}' | aws-es-curl --region=us-east-1 -X POST https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/_aliases

echo '{"actions":[{"add":{"index":"benchmarks_v1","alias":"benchmarks"}}]}' | aws-es-curl --region=us-east-1 -X POST https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/_aliases

echo '{"actions":[{"add":{"index":"activities_v1","alias":"activities"}}]}' | aws-es-curl --region=us-east-1 -X POST https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/_aliases

## delete index
aws-es-curl --region=us-east-1 -X DELETE 'https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/activities_v11?pretty'

## get data by id
aws-es-curl --region=us-east-1 -X GET 'https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/stats/storefronts/012ff44a-6475-46df-b4a6-735b974b7ae7?pretty'

## count
aws-es-curl --region=us-east-1 -X GET 'https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/stats/storefronts/_count?pretty'

## search
aws-es-curl --region=us-east-1 -X GET 'https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/stats/storefronts/_search?q=storefrontId:012ff44a-6475-46df-b4a6-735b974b7ae7&pretty'

## update mapping
echo '{"properties":{"marketCode":{"type":"text","fielddata": true}}}' | aws-es-curl --region=us-east-1 -X PUT https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/stats_v1/_mapping/storefronts

## get mapping
aws-es-curl --region=us-east-1 -X GET https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/stats_v1/storefronts/_mapping

## dump stats to stats_v1
elasticdump \
    --awsAccessKeyId=AKIAIC6COCXKOPJHILHQ \
    --awsSecretAccessKey=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 \
    --input=https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/bench_marks_v1 \
    --output=https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/benchmarks_v1 \
    --type=data \
    --limit=10000


## delete field qa
echo '{
  "script": {
    "inline": "ctx._source.remove(\"createDate\")"
  },
  "query": {
    "bool": {
      "must": [
        {
          "exists": {
            "field": "createDate"
          }
        }
      ]
    }
  }
}' | aws-es-curl --region=us-east-1 -H 'Content-Type: application/json' -X POST 'https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/admin/profiles/_update_by_query?wait_for_completion=false&conflicts=proceed'

## prod
echo '{
  "script": {
    "inline": "ctx._source.remove(\"createDate\")"
  },
  "query": {
    "bool": {
      "must": [
        {
          "exists": {
            "field": "createDate"
          }
        }
      ]
    }
  }
}' | aws-es-curl --region=us-east-1 -H 'Content-Type: application/json' -X POST 'https://search-xo-local-partners-prod-ap25bstxjtk5xaxpvu3jxmajh4.us-east-1.es.amazonaws.com/admin/profiles/_update_by_query?wait_for_completion=false&conflicts=proceed'


echo '{"script":"ctx._source.remove(\"createDate\")","query":{"bool":{"must":[{"exists":{"field":"createDate"}}]}}}' | aws-es-curl --region=us-east-1 -H 'Content-Type: application/json' -X POST 'https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/admin/profiles/_update_by_query?wait_for_completion=false&conflicts=proceed'


echo '{
  "query": {
    "bool": {
      "must": [
        {
          "exists": {
            "field": "createDate"
          }
        }
      ]
    }
  }
}' | aws-es-curl --region=us-east-1 -X POST 'https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/stats/storefronts/_search?pretty'

aws-es-curl --region=us-east-1 -X GET 'https://search-xo-local-partners-prod-ap25bstxjtk5xaxpvu3jxmajh4.us-east-1.es.amazonaws.com/_cat/indices?v'

## update mapping
echo '{"properties":{"userId":{"type":"keyword"}}}' | aws-es-curl --region=us-east-1 -X PUT https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/activities_v1/_mapping/storefronts

echo '{
  "mappings":{
    "storefronts":{}
  }
}' | aws-es-curl --region=us-east-1 -X PUT https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/test_v1

## add uniqueViewForAll
echo '{"properties":{"uniqueViewForAll":{"type":"float"}}}' | aws-es-curl --region=us-east-1 -X PUT https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/activities_v1/_mapping/storefronts

# update admin mapping
echo '{
  "properties": {
    "logo": {
      "properties": {
        "mediaId": {
          "type": "keyword"
        },
        "sourceId": {
          "type": "keyword"
        },
        "url": {
          "type": "text"
        },
        "height": {
          "type": "integer"
        },
        "width": {
          "type": "integer"
        }
      }
    }
  }
}' | aws-es-curl --region=us-east-1 -X PUT https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/admin/_mapping/profiles
