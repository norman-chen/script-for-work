
'use strict';

const csv = require('csvtojson');
const XoDs = require('xo-ds-handler');
const xoDs = new XoDs();
const fs = require('fs');
const Promise = require('bluebird')
const _ = require('lodash')

const xoReq = new(require('xo-request'))();


// const _ = require('./list1221-log-qa-1123/list1221-succeed.csv')
// ;(async () => {
//     // let updateList = await csv().fromFile(`${__dirname}/list1221-log-qa-1123/list1221-succeed.csv`);
//     // const ids = updateList.map((d) => d.id);


//     // ids.forEach(id => {
//     //     fs.appendFileSync(`${__dirname}/ids.log`, `'${id}',\n`)
//     // })

//     xoDs.config({
//         'write-store': {
//             storefront: 'postgres://localservices:XvkTraVU94enXcud@storefronts-pg-prod-20191222.cfjnafc8bsrz.us-east-1.rds.amazonaws.com/storefront'
//         }
//     });

//     const sql1 = `select t2.* from should_roll_back_sf_1 t1 inner join sales_profiles t2 on t1.id = t2.data->>'storefrontId'`
//     const s = await xoDs.pg.execute('storefront', sql1)
//     // console.dir(s[0])

//     const sqls = []
//     s.forEach(sales => {
//         sqls.push(`UPDATE sales_profiles set data='${JSON.stringify(sales.data)}' where data->>'storefrontId' = '${sales.data.storefrontId}';`)
//     })
//     // console.dir(s)

//     xoDs.config({
//         'write-store': {
//             storefront: 'postgres://localservices:XvkTraVU94enXcud@storefronts-pg-prod.cfjnafc8bsrz.us-east-1.rds.amazonaws.com/storefront'
//         }
//     });

//     await xoDs.pg.execute('storefront', sqls.join(' '))
// })()

// ;(async () => {
//     let updateList = await csv().fromFile(`${__dirname}/list1221-log-qa-1123/list1221-succeed.csv`);
//     const list = updateList.map((d) => d.id);

//     xoDs.config({
//         'write-store': {
//             storefront: 'postgres://localservices:XvkTraVU94enXcud@storefronts-pg-prod-20191222.cfjnafc8bsrz.us-east-1.rds.amazonaws.com/storefront'
//         }
//     });

//     const sqls = []
//     ids.forEach(id => {
//         sqls.push(`insert into should_roll_back_sf (id) values ('${id}');`)
//     })

//     await xoDs.pg.execute('storefront', sqls.join(' '))
// })()

// ;(async () => {
//     // const sql = `select * from sales_profiles where data->>'storefrontId' in (select * from should_roll_back_sf)`

//     const sql = `select * from sales_profiles where data->>'storefrontId' in (select * from should_roll_back_sf_1)`

//     xoDs.config({
//         'write-store': {
//             storefront: 'postgres://localservices:XvkTraVU94enXcud@storefronts-pg-prod.cfjnafc8bsrz.us-east-1.rds.amazonaws.com/storefront'
//         }
//     });
//     console.log('---')
//     const s = await xoDs.pg.execute('storefront', sql)
//     console.log('---1')
//     const total = s.length;

//     const salesProfileApi = "https://prod-sales-api.localsolutions.theknot.com"
//     const apiKey =  "2c3e706eec474381a58aef482a5cff68"
//     const jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJNeUFjY291bnQgQWRtaW4gQXBwbGljYXRpb24iLCJpYXQiOjE0OTk0MTc4MDEsImV4cCI6NDY1NTA5MDkxNywiYXVkIjoiaHR0cDovL3BhcnRuZXJzYWRtaW4udGhla25vdC5jb20iLCJzdWIiOiJ2MSBzZWN1cml0eSIsImNsaWVudElkIjoiNTQ5MTUzM2ItNTI2Ny00NzhmLThlOWItNTNkNzUyYWQ5ZTRhIn0.jF218AKdaS8q3gFa_ixn5KZA0wht9xgzR-MVNdeizqY";

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
//             }).catch(() => console.log(sales.id))
//         );

//         if (all.length === 30 || i === (total-1)) {
//             await Promise.all(all)
//             all = []
//         }

//         if (i % 100 === 0) {
//             console.log(i)
//         }
//     }
// })()

// d93d4457-1032-4fd4-a560-9efad020417c
// 16208786-3a0e-444b-9e3d-a86a00f9d105

// ;(async () => {
//     let updateList = await csv().fromFile(`${__dirname}/list1224.csv`);
//     const list = updateList.map((d) => `${d.LocationID.toLowerCase()}=${d.CategoryCode}`)
//         .sort((x, y) => x > y ? 1 : -1);
//     // console.log('list: ', list);

//     const list1 = Array.from(new Set(list)).map((item) => ({
//         locationId: item.split('=')[0],
//         categoryCode: item.split('=')[1]
//     })).map(item => `(data->>'locationId'='${item.locationId}' AND data->>'categoryCode'='${item.categoryCode}')`)

//     // console.log(list1.length)

//     const sql = `
//     select data->>'id' as "storefrontId" from storefronts
//     where ${list1.join(' OR ')} AND data->>'statusCode' = 'LIVE'
//     `;

//     // console.log(sql);
//     // const getSfIdsSQL = `
//     // select data->>'id' as id from storefronts
//     // where data->>'locationId' = ''
//     // `

//     xoDs.config({
//         'write-store': {
//             storefront: 'postgres://localservices:XvkTraVU94enXcud@storefronts-pg-prod-20191222.cfjnafc8bsrz.us-east-1.rds.amazonaws.com/storefront'
//         }
//     });

//     const r = await xoDs.pg.execute('storefront', sql)
//     r.forEach(({storefrontId}) => {
//         fs.appendFileSync(`${__dirname}/ids-bak4.log`, `'${storefrontId}',\n`)
//     })
// })()

// ;(async () => {
//     const ids = require('./fixData/new-ids');

//     const sqls = [];
//     ids.forEach(id => {
//         sqls.push(`insert into should_roll_back_sf_1 (id) values ('${id}');`)
//     })

//     xoDs.config({
//         'write-store': {
//             storefront: 'postgres://localservices:XvkTraVU94enXcud@storefronts-pg-prod.cfjnafc8bsrz.us-east-1.rds.amazonaws.com/storefront'
//         }
//     });

//     await xoDs.pg.execute('storefront', sqls.join(' '))
// })()