# create index
echo '{
  "settings":{
    "index":{
      "max_result_window":"10000000"
    }
  },
  "mappings":{
    "storefronts":{
      "properties":{
        "leads":{
          "type":"long"
        },
        "marketCode":{
          "type":"text",
          "fields":{
            "keyword":{
              "type":"keyword",
              "ignore_above":256
            }
          },
          "fielddata":true
        },
        "month":{
          "type":"long"
        },
        "monthKey":{
          "type":"text",
          "fields":{
            "keyword":{
              "type":"keyword",
              "ignore_above":256
            }
          },
          "fielddata":true
        },
        "storefrontId":{
          "type":"keyword"
        },
        "uniqueViews":{
          "type":"long"
        },
        "year":{
          "type":"long"
        }
      }
    }
  }
}' | aws-es-curl --region=us-east-1 -X PUT https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/stats_v1

# add alias stats_v1 to stats
echo '{"actions":[{"add":{"index":"stats_v1","alias":"stats"}}]}' | aws-es-curl --region=us-east-1 -X POST https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/_aliases

# add v1_2 to alias
echo '{"actions":[{"add":{"index":"stats_v1_2","alias":"stats"}}]}' | aws-es-curl --region=us-east-1 -d -X POST  https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/_aliases

# check list
aws-es-curl --region=us-east-1 -X GET 'https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/_cat/indices?v'

# delete index
aws-es-curl --region=us-east-1 -X DELETE 'https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/stats_2019_01_29_1?pretty'

# check alias
aws-es-curl --region=us-east-1 -d -X GET  https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/_cat/aliases/stats
