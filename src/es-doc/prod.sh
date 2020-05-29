# prod
export AWS_ACCESS_KEY_ID=AKIAJLYS6NZ5LPWW6QNQ
export AWS_SECRET_ACCESS_KEY=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

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
}' | aws-es-curl --region=us-east-1 -X PUT https://search-xo-local-stats-prod-w75vhtapdmv3unq4dezkrxpiea.us-east-1.es.amazonaws.com/stats_v1

# add alias stats_v1 to stats
echo '{"actions":[{"add":{"index":"stats_v1","alias":"stats"}}]}' | aws-es-curl --region=us-east-1 -X POST https://search-xo-local-stats-prod-w75vhtapdmv3unq4dezkrxpiea.us-east-1.es.amazonaws.com/_aliases

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
}' | aws-es-curl --region=us-east-1 -X PUT https://search-xo-local-stats-prod-w75vhtapdmv3unq4dezkrxpiea.us-east-1.es.amazonaws.com/benchmarks_v1

# add alias benchmarks_v1 to benchmarks
echo '{"actions":[{"add":{"index":"benchmarks_v1","alias":"benchmarks"}}]}' | aws-es-curl --region=us-east-1 -X POST https://search-xo-local-stats-prod-w75vhtapdmv3unq4dezkrxpiea.us-east-1.es.amazonaws.com/_aliases

# create index
echo '{
  "settings":{
    "index":{
      "max_result_window":"100000000",
      "analysis":{
        "analyzer":{
          "case_insensitive_keyword":{
            "filter":[
              "lowercase"
            ],
            "tokenizer":"keyword"
          }
        }
      }
    }
  },
  "mappings":{
    "storefronts":{
      "properties":{
        "action":{
          "type":"text",
          "analyzer":"case_insensitive_keyword",
          "fielddata":true
        },
        "city":{
          "type":"text",
          "analyzer":"case_insensitive_keyword",
          "fielddata":true
        },
        "marketCode":{
          "type":"text",
          "fielddata":true
        },
        "state":{
          "type":"text",
          "analyzer":"case_insensitive_keyword",
          "fielddata":true
        },
        "storefrontId":{
          "type":"keyword"
        },
        "visitorDate":{
          "type":"date"
        },
        "visitorName":{
          "type":"text",
          "analyzer":"case_insensitive_keyword",
          "fielddata":true
        },
        "userId": {
          "type":"keyword"
        }
      }
    }
  }
}' | aws-es-curl --region=us-east-1 -X PUT https://search-xo-local-stats-prod-w75vhtapdmv3unq4dezkrxpiea.us-east-1.es.amazonaws.com/activities_v1

# add alias activities_v1 to activities
echo '{"actions":[{"add":{"index":"activities_v1","alias":"activities"}}]}' | aws-es-curl --region=us-east-1 -X POST https://search-xo-local-stats-prod-w75vhtapdmv3unq4dezkrxpiea.us-east-1.es.amazonaws.com/_aliases

# get index list
aws-es-curl --region=us-east-1 -X GET 'https://search-xo-local-stats-prod-w75vhtapdmv3unq4dezkrxpiea.us-east-1.es.amazonaws.com/_cat/indices?v'

# delete index
aws-es-curl --region=us-east-1 -X DELETE 'https://search-xo-local-stats-prod-w75vhtapdmv3unq4dezkrxpiea.us-east-1.es.amazonaws.com/stats_v1?pretty'

aws-es-curl --region=us-east-1 -X DELETE 'https://search-xo-local-stats-prod-w75vhtapdmv3unq4dezkrxpiea.us-east-1.es.amazonaws.com/benchmarks_v1?pretty'

#
echo '{ "transient" : { "threadpool.bulk.queue_size" : 500 } }' | aws-es-curl --region=us-east-1 -X PUT https://search-xo-local-stats-prod-w75vhtapdmv3unq4dezkrxpiea.us-east-1.es.amazonaws.com/_cluster/settings


aws-es-curl --region=us-east-1 -X GET 'https://search-xo-local-stats-prod-w75vhtapdmv3unq4dezkrxpiea.us-east-1.es.amazonaws.com/_cat/thread_pool?v'

# get setting
aws-es-curl --region=us-east-1 -X GET 'https://search-xo-local-stats-prod-w75vhtapdmv3unq4dezkrxpiea.us-east-1.es.amazonaws.com/activities/_settings?pretty'

# update setting
echo '{"index":{"max_result_window":10000000}}' | aws-es-curl --region=us-east-1 -X PUT 'https://search-xo-local-stats-prod-w75vhtapdmv3unq4dezkrxpiea.us-east-1.es.amazonaws.com/activities/_settings'
{"acknowledged":true}