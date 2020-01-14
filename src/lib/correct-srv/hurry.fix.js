const csv = require('csvtojson');
const XoDs = require('xo-ds-handler');
const xoDs = new XoDs();
const fs = require('fs');
const Promise = require('bluebird');
const _ = require('lodash');

const xoReq = new(require('xo-request'))();

// ;(async () => {
//     const needToFix = require('./log-prod-0109/need-to-fix');

//     const sqls = [];

//     needToFix.forEach(item => {
//         sqls.push(`INSERT INTO need_to_correct_live_srv_0109 (id, market, ori) values ('${item[0]}', '${item[1]}', '${item[2]}');`)
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


;(async() => {
    const sales = {
        id    : '202b95d0-c312-49f5-8cd4-b73d902a6a21',
        actors: {
            createdBy      : '00000000-0000-0000-0000-000000000000',
            updatedBy      : 'b258fe63-69ef-4600-a604-52904668c2d0',
            sourceCreatedBy: '6e6a18da-29b6-4def-9785-0e66d171c788',
            sourceUpdatedBy: '6e6a18da-29b6-4def-9785-0e66d171c788'
        },
        adTier: 'GOLD',
        source: {
            application: 'MyAccount Application'
        },
        services: [
            {
                id                : '87c620b2-7f8d-4a87-95c8-9646c3cbc5d4',
                sku               : '',
                adTier            : 'LIMITED',
                addOns            : [],
                endDate           : '',
                isPrimary         : false,
                startDate         : '',
                marketCode        : '065',
                ratePlanId        : '',
                statusCode        : 'REMOVED',
                vendorTier        : 'UNPAID',
                categoryCode      : 'WPH',
                salesRecordId     : '',
                subscriptionId    : '',
                purchaseStatusCode: 'FREEMIUM'
            },
            {
                id                : '1a1a7096-2b6b-4f02-ab81-687c9ecebd3e',
                sku               : 'SKU-00000092',
                adTier            : 'LIMITED',
                addOns            : [],
                endDate           : '2020-01-07T20:54:45.419Z',
                isPrimary         : false,
                startDate         : '2018-12-14T06:00:00.000Z',
                marketCode        : '107',
                ratePlanId        : '',
                statusCode        : 'REMOVED',
                vendorTier        : 'UNPAID',
                categoryCode      : 'WPH',
                salesRecordId     : 'C-01526513',
                subscriptionId    : 'A-S00206669',
                purchaseStatusCode: 'FREEMIUM'
            },
            {
                id                : '661ec8f6-bc2a-4cb9-b6c7-518a6cb00538',
                sku               : 'SKU-00000092',
                adTier            : 'GOLD',
                addOns            : [],
                endDate           : '2020-12-14T00:00:00.000Z',
                isPrimary         : true,
                startDate         : '2018-12-14T06:00:00.000Z',
                marketCode        : '335',
                ratePlanId        : '',
                statusCode        : 'LIVE',
                vendorTier        : 'STANDARD',
                categoryCode      : 'WPH',
                salesRecordId     : 'C-01526513',
                subscriptionId    : 'A-S00206669',
                purchaseStatusCode: 'PAID'
            },
            {
                id                : '3893bd9e-c774-4cb6-ad3e-e84a875cfd7c',
                sku               : 'SKU-00000092',
                adTier            : 'GOLD',
                addOns            : [],
                endDate           : '2020-12-14T00:00:00.000Z',
                isPrimary         : false,
                startDate         : '2018-12-14T06:00:00.000Z',
                marketCode        : '337',
                ratePlanId        : '',
                statusCode        : 'LIVE',
                vendorTier        : 'STANDARD',
                categoryCode      : 'WPH',
                salesRecordId     : 'C-01526513',
                subscriptionId    : 'A-S00206669',
                purchaseStatusCode: 'PAID'
            },
            {
                id                : '01910bb7-3017-47a3-be58-864f96c5b506',
                sku               : 'SKU-00000092',
                adTier            : 'GOLD',
                addOns            : [],
                endDate           : '2020-12-14T00:00:00.000Z',
                isPrimary         : false,
                startDate         : '2018-12-14T06:00:00.000Z',
                marketCode        : '336',
                ratePlanId        : '',
                statusCode        : 'LIVE',
                vendorTier        : 'STANDARD',
                categoryCode      : 'WPH',
                salesRecordId     : 'C-01526513',
                subscriptionId    : 'A-S00206669',
                purchaseStatusCode: 'PAID'
            }
        ],
        vendorId : 'bc36b7b0-e60b-49c1-a351-a68e00c993fb',
        accountId: 'b3a8cdc5-7dda-4a2a-ba1b-a68e00c993ed',
        timestamp: {
            createdAt      : '2018-04-02T22:37:22.9941272-05:00',
            updatedAt      : '2020-01-07T20:54:45.498Z',
            sourceCreatedAt: '2015-07-09T20:27:47',
            sourceUpdatedAt: '2016-09-27T17:13:56'
        },
        locationId  : 'ce42193b-362c-4266-9dbe-73dfbbbdebab',
        vendorTier  : 'STANDARD',
        storefrontId: '202b95d0-c312-49f5-8cd4-b73d902a6a21'
    };

    const stf = {
        id : '202b95d0-c312-49f5-8cd4-b73d902a6a21',
        bio: {
            role       : 'Owner',
            contactName: 'Margeaux',
            description: ''
        },
        name : 'Margeaux Boles Photography',
        email: 'margeauxphoto@gmail.com',
        phone: {
            number   : '3059231136',
            extension: ''
        },
        actors: {
            createdBy      : '00000000-0000-0000-0000-000000000000',
            updatedBy      : '777f9d96-34b6-4c55-a0d2-f2e7a7a5e262',
            sourceCreatedBy: 'c5ef2654-86d4-4a75-bd3b-fe01fb91b300',
            sourceUpdatedBy: '27f8e6b9-1769-4c21-adbc-a68e00c99527'
        },
        source: {
            originalId         : '00000000-0000-0000-0000-000000000000',
            application        : 'MyAccount Application',
            originalCode       : 'XO-Internal',
            originalApplication: '00000000-0000-0000-0000-000000000000'
        },
        address: {
            city           : 'Maggie Valley',
            country        : 'US',
            street1        : '30 Elm Dr',
            street2        : '',
            latitude       : 35.523564,
            longitude      : -83.108976,
            stateCode      : 'NC',
            postalCode     : '28751',
            servingArea    : 'Key Largo, Key West, Asheville, North Carolina',
            displayAddress : false,
            geoCodeOverride: false
        },
        extinct  : false,
        accountId: 'b3a8cdc5-7dda-4a2a-ba1b-a68e00c993ed',
        displayId: 379301,
        timestamp: {
            createdAt      : '2018-04-02T22:47:16.829Z',
            updatedAt      : '2020-01-09T03:09:02.676Z',
            sourceCreatedAt: '2011-03-28T19:02:07.000Z',
            sourceUpdatedAt: '2018-02-20T23:41:31.000Z'
        },
        isTestData               : false,
        locationId               : 'ce42193b-362c-4266-9dbe-73dfbbbdebab',
        statusCode               : 'LIVE',
        claimedDate              : '2018-04-02T22:47:16.829Z',
        isPurchased              : false,
        categoryCode             : 'WPH',
        isTransaction            : false,
        displayWebsite           : 'margeauxphoto.com',
        disableTracking          : false,
        qualityTierCode          : 'NONE',
        claimedStatusCode        : 'CLAIMED',
        editorialContent1        : '',
        editorialContent2        : '',
        editorialContent3        : '',
        winningStorefrontId      : '00000000-0000-0000-0000-000000000000',
        salesProfileStartDate    : '2018-12-14T06:00:00.000Z',
        profileExternalReferences: [
            {
                code : 'TwoBrightLights',
                value: '51fe5a14-c6b2-11e4-be0a-22000aa61a3e'
            },
            {
                code : 'TwoBrightLights',
                value: '58be628c-124d-11e4-843f-22000aa61a3e'
            }
        ]
    };

    const sql = `INSERT INTO sales_profiles (data) values ('${JSON.stringify(sales)}');`;
    const sql1 = `INSERT INTO storefronts (data) values ('${JSON.stringify(stf)}');`;

    xoDs.config({
        'write-store': {
            storefront: 'postgres://localservices:!q2w3e4r5t6y7@storefronts-pg-qa.cfjnafc8bsrz.us-east-1.rds.amazonaws.com/storefront'
        }
    });

    // try {
    //     await xoDs.pg.execute('storefront', sql);
    // } catch (error) {
    //     console.log('======')
    //     console.log('error: ', error);

    // }

    try {
        console.log(sql1);
        await xoDs.pg.execute('storefront', sql1);
    } catch (error) {
        console.log('======111');
        console.log('error: ', error);
    }
})();
