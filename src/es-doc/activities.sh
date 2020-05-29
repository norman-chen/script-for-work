
# delete index
aws-es-curl --region=us-east-1 -X DELETE 'https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/activities_v1?pretty'

acrylic periodic table of elements
# add userId in mapping
echo '{"properties":{"userId":{"type":"keyword"}}}' | aws-es-curl --region=us-east-1 -X PUT https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/activities_v1/_mapping/storefronts


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
}' | aws-es-curl --region=us-east-1 -X PUT https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/activities_v1

# add alias activities_v1 to activities
echo '{"actions":[{"add":{"index":"activities_v2","alias":"activities"}}]}' | aws-es-curl --region=us-east-1 -X POST https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/_aliases

# remove alias
echo '{"actions":[{"remove":{"index":"activities_v1","alias":"activities"}}]}' | aws-es-curl --region=us-east-1 -d -X POST  https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com/_aliases
