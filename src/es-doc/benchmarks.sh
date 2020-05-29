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
        "calls":{
          "type":"float"
        },
        "clicks":{
          "type":"float"
        },
        "emails":{
          "type":"float"
        },
        "engagements":{
          "type":"float"
        },
        "saves":{
          "type":"float"
        },
        "uniqueViews":{
          "type":"float"
        },
        "year":{
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
        "categoryCode":{
          "type":"text",
          "fields":{
            "keyword":{
              "type":"keyword",
              "ignore_above":256
            }
          },
          "fielddata":true
        }
      }
    }
  }
}' | aws-es-curl --region=us-east-1 -X PUT https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/benchmarks_v1

# add alias benchmarks_v1 to benchmarks
echo '{"actions":[{"add":{"index":"benchmarks_v1","alias":"benchmarks"}}]}' | aws-es-curl --region=us-east-1 -X POST https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/_aliases
