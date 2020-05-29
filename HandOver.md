# script
#### monthly renew
get the csv file from saleForce and put it in ./src/lib/update-enddate/
and change the csv file to like list10.csv
open file ./src/lib/update-enddate/constants.js
change config
```
global.NODE_ENV = 'production'; // production // qa

// if you want a real update then is 'true'
// if check want to check the csv then is 'false'

global.shouldUpdate = 'true'; // 'false' || 'true'

global.fileName = 'list10';
```
run command
```
node ./src/lib/update-enddate/index.js
```

IF you run shouldUpdate = 'false', then check under ./src/lib/update-enddate/ you would see a **folder** name is
`list10-prodction-check-day-month`
in this folder
check
`list10-free-addon`
`list10-free-srv`
`list10-updated-by-GP`
and copy the result for the salesForce team to see if them want to make some change

IF you run shouldUpdate = 'true', then check under ./src/lib/update-enddate/ you would see a **folder** name is
`list10-prodction-run-day-month`
in this folder
check
`list10-fail` to make sure is empty
check
`list10-free-addon`
`list10-free-srv`
`list10-updated-by-GP`
and copy the result to the ticket
and attach the file
`list10-map` to the ticket as well

#### gallery position fix
`node src/lib/reset-position/index.js --NODE_ENV=production`
`node src/lib/reset-position/index.js --NODE_ENV=qa`

#### some token generate
GET a integration token
`node src/demo/v2-token.js`


##### ES relative

##### taxonomy
GET a taxnomy api response
`node src/demo/tax.js`

##### publish sales
`src/lib/bulk-publish/publish-sales-with-services.js`

need to check the configuation in the file first


# business
#### stats daily sync
 - business login
    1. stats-publihser run at 7:300 pm every day, emit storefrontId and new_index and switch_index_event
    2. stats-indexer received the event and get the data from snowflake and sync to ES, if getting the switch_index_event then it will switch the index and delete the old one

    NOTE:
    1. qa and production stats ES are same
    2. stats-indexer didn't run on QA, the development branch merge to production directly
    3. stats-publishe didn't run on QA, development branch merge to production directly
 - some api change
 - es issue and monitor
#### the new v2 api
 - get sales
    for GP get sales to build thire fulfillment
 - accounts
    v2/accounts get by crmAccount
 - lead
    1. get 36 months lead data from sonwflake directly
    2. by locations or crmAccount
 - search storefront by location or crmAccount

### conversation
    segmentIO-worker -> hapi-segment -> conversation_created

    the receivedAt is not support by the segment, so it not correct


