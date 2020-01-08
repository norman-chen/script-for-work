const csv = require('csvtojson');
const XoDs = require('xo-ds-handler');
const xoDs = new XoDs();
const fs = require('fs');
const Promise = require('bluebird');
const _ = require('lodash');

const xoReq = new(require('xo-request'))();

// ;(async () => {
//     const needToFix = require('./log-prod-0108-check/need-to-fix');

//     const sqls = [];

//     needToFix.forEach(item => {
//         sqls.push(`INSERT INTO need_to_correct_live_srv_0108 (id, market, ori) values ('${item[0]}', '${item[1]}', '${item[2]}');`)
//     });

//     xoDs.config({
//         // 'write-store': {
//         //     storefront: 'postgres://localservices:!q2w3e4r5t6y7@storefronts-pg-qa.cfjnafc8bsrz.us-east-1.rds.amazonaws.com/storefront'
//         // },
//         'write-store': {
//             storefront: 'postgres://localservices:XvkTraVU94enXcud@storefronts-pg-prod.cfjnafc8bsrz.us-east-1.rds.amazonaws.com/storefront'
//         }
//     });

//     await xoDs.pg.execute('storefront', sqls.join(' '));
// })();

// ;(async () => {
//     const listOld = require('./log-qa-1225/already-correct');
//     const listNew = require('./log-qa-1225-1/already-correct');

//     listNew.forEach(id => {
//         if (!listOld.includes(id)) {
//             fs.appendFileSync(`${__dirname}/id.log`, `'${id}',\n`)
//         }
//     });
// })();

// ;(async () => {

//     const ids = require('./log-qa-1226-2/need-to-fix');

//     const sql = []
//     ids.forEach(id => {
//         sql.push(`INSERT INTO roll_up_1226 (id) values ('${id}');`)
//     })

//     xoDs.config({
//         'write-store': {
//             storefront: 'postgres://localservices:!q2w3e4r5t6y7@storefronts-pg-qa.cfjnafc8bsrz.us-east-1.rds.amazonaws.com/storefront'
//         }
//     });

//     await xoDs.pg.execute('storefront', sql.join(' '));

// })();


// ;(async () => {
//     const sql1 = `select t2.* from roll_up_1226 t1
//     inner join sales_profiles_1226 t2 on t1.id = t2.data->>'storefrontId'`

//     xoDs.config({
//         'write-store': {
//             storefront: 'postgres://localservices:!q2w3e4r5t6y7@storefronts-pg-qa.cfjnafc8bsrz.us-east-1.rds.amazonaws.com/storefront'
//         }
//     });

//     const s = await xoDs.pg.execute('storefront', sql1)
//     // console.dir(s[0])

//     const sqls = []
//     s.forEach(sales => {
//         sqls.push(`UPDATE sales_profiles set data='${JSON.stringify(sales.data)}' where data->>'storefrontId' = '${sales.data.storefrontId}';`)
//     })
//     // console.dir(s)

//     await xoDs.pg.execute('storefront', sqls.join(' '))
// })()


// ;(async () => {
//     // const sql = `select * from sales_profiles where data->>'storefrontId' in (select * from should_roll_back_sf)`

//     // const sql = `select * from sales_profiles where data->>'storefrontId' in (select * from roll_up_1226)`

//     const sql = `select * from sales_profiles where data->>'storefrontId' in (
//         '8526a367-de0a-436c-ae4a-61af8e6a1293',
//         '2abf4729-6ff5-4d08-9ee0-36e78c22508b',
//         '59739b73-36dd-4787-8f5f-a1fc00b123b1',
//         'b3146689-a51f-4307-a755-a71a00d35d20',
//         '5cf894bd-ca38-449c-a0d8-a80f00fac014',
//         'd55b7942-e08d-4cac-89d5-a80800b22d4c',
//         '9970a722-4034-471b-ba7b-7dbfcceb6f62'
//     )`

//     xoDs.config({
//         'write-store': {
//             storefront: 'postgres://localservices:!q2w3e4r5t6y7@storefronts-pg-qa.cfjnafc8bsrz.us-east-1.rds.amazonaws.com/storefront'
//         }
//     });
//     console.log('---')
//     const s = await xoDs.pg.execute('storefront', sql)
//     console.log('---1')
//     const total = s.length;
//     console.log('total: ', total);

//     // const salesProfileApi = "https://qa-sales-api.localsolutions.theknot.com"
//     // const apiKey =  "2c3e706eec474381a58aef482a5cff68"
//     // const jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJNeUFjY291bnQgQWRtaW4gQXBwbGljYXRpb24iLCJpYXQiOjE0OTk0MTc4MDEsImV4cCI6NDY1NTA5MDkxNywiYXVkIjoiaHR0cDovL3BhcnRuZXJzYWRtaW4udGhla25vdC5jb20iLCJzdWIiOiJ2MSBzZWN1cml0eSIsImNsaWVudElkIjoiNTQ5MTUzM2ItNTI2Ny00NzhmLThlOWItNTNkNzUyYWQ5ZTRhIn0.jF218AKdaS8q3gFa_ixn5KZA0wht9xgzR-MVNdeizqY";

//     // const publishList = [];
//     // s.forEach(sales => {
//     //     if (sales.data.services.find(srv => srv.purchaseStatusCode === 'PAID')) {
//     //         publishList.push(sales.data)
//     //     }
//     // });

//     // console.log(publishList.length);

//     const requestInfo = {
//         url   : 'https://qa-sales-api.localsolutions.theknot.com',
//         token : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJNeUFjY291bnQgQWRtaW4gQXBwbGljYXRpb24iLCJpYXQiOjE0OTk0MTc4MDEsImV4cCI6NDY1NTA5MDkxNywiYXVkIjoicWEucGFydG5lcnNhZG1pbi50aGVrbm90LmNvbSIsInN1YiI6InYxIHNlY3VyaXR5IiwiY2xpZW50SWQiOiI5ZDlkM2ZjMy03OWUxLTRiYTUtYjE2Ny01ZjA1ODE5NmYxZjUifQ.BK5-8gkpUK9zOosfLRFzNj54r9LdvbbvoUypd3yc44M',
//         apikey: '2f40b70d252548e79f5b62cda387c8e0'
//     };

//     const salesProfileApi = requestInfo.url;
//     const apiKey = requestInfo.apikey;
//     const jwtToken = requestInfo.token;

//     let all = [];

//     for (let i = 0; i < total; i++) {
//         const sales = s[i].data;

//         all.push(
//             xoReq.put(`${salesProfileApi}/sales/${sales.id}?apikey=${apiKey}`, {
//                 payload: {
//                     services: sales.services
//                 },
//                 headers: {
//                     Authorization: `Bearer ${jwtToken}`
//                 }
//             }).catch((err) => {
//                 // console.log(err.message)
//                 console.log(sales.storefrontId)
//             })
//         );

//         if (all.length === 50 || i === (total-1)) {
//             await Promise.all(all)
//             all = []
//         }

//         if (i % 100 === 0) {
//             console.log(i)
//         }
//     }
// })()
