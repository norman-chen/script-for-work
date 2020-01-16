
const xoReq = new(require('xo-request'))();
const fs = require('fs');
const csv = require('csvtojson');
const XoDs = require('xo-ds-handler');
const xoDs = new XoDs();
const checkAccNum = require('./checkListInDB');

const uploadToLibraryMethod = require('./step1-upload-to-library');
const uploadToGalleryMethod = require('./step2-upload-to-gallery');

const DB_CONFIG = {
    // xoDsConfig: {
    //     'write-store': {
    //         storefront: 'postgres://localservices:!q2w3e4r5t6y7@storefronts-pg-qa.cfjnafc8bsrz.us-east-1.rds.amazonaws.com/storefront'
    //     }
    // }

    xoDsConfig: {
        'write-store': {
            storefront: 'postgres://localservices:XvkTraVU94enXcud@storefronts-pg-prod.cfjnafc8bsrz.us-east-1.rds.amazonaws.com/storefront'
        }
    },
};

xoDs.config(DB_CONFIG.xoDsConfig);

const Config = {
    type           : '360Tour',
    urlPattern     : '^(?:https|http)\\:\\/\\/my\\.matterport\\.com\\/show\\/\\?m=(.{11})(\\&|$)',
    thumbnailFormat: 'https://my.matterport.com/api/v1/player/models/{0}/thumb',
    iframeFormat   : '<iframe width="500" height="390" src="https://my.matterport.com/show/?m={0}&brand=0" frameborder="0" allowfullscreen=""></iframe>',

    // mediaApi: 'https://qa-media-api.localsolutions.theknot.com',
    // reqOps  : {
    //     headers: {
    //         // NEED CHANGE
    //         authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1Nzg5Njk0OTcsImV4cCI6MTU3OTA1NTg5NywidXNlcklkIjoiMDYxODYwYmYtNmRiOS00NGUyLTkzYjctYWU3Y2ZjMjdlMGE5Iiwic2Vzc2lvbklkIjoiMGVhY2FlODgtNmU1Ny00OTMxLWJjOGEtY2I5MTdlMTdiMDZlIiwiYXBwbGljYXRpb25zIjpbInNlcnZpY2UtY29udmVyc2F0aW9uLWFwaSJdLCJ0b2tlbklkIjoiMDdkNmMyN2QtYzU1Yy00ZTJlLWJkMmItZDRmYjNmMTMwMDUzIiwicmVxdWVzdFVzZXJJZCI6IjA2MTg2MGJmLTZkYjktNDRlMi05M2I3LWFlN2NmYzI3ZTBhOSIsImlkIjpbXSwiYWNjb3VudElkIjoiMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwIiwiaXNzIjoiVGhlIEtub3QgUHJvIFFBIiwiYXVkIjoicWEudGhla25vdHByby5jb20iLCJzdWIiOiJ2MSBzZWN1cml0eSIsInNjb3BlIjpbIlN1cGVyQWRtaW4iXX0.OptfVEjM0JvDUnJLqbw6henM3x4ki9QpNF9pd6gre8s' // NEED CHANGED
    //     }
    // }

    mediaApi: 'https://prod-media-api.localsolutions.theknot.com',
    reqOps: {
        headers: {
            authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NzkxNDMyODUsImV4cCI6MTU3OTIyOTY4NSwidXNlcklkIjoiMTY4ZGIwNjMtZDY4Mi00ODlkLTg0NTctZTAxNjZmYmU5ODk1Iiwic2Vzc2lvbklkIjoiNGM4ZGE3YzQtMjg1YS00OGQzLWJmMjEtZTc1ZWZmNzVjZmRhIiwiYXBwbGljYXRpb25zIjpbInNlcnZpY2UtY29udmVyc2F0aW9uLWFwaSJdLCJ0b2tlbklkIjoiYjhlZWE0ZDItOTM4Ni00ZjA1LTkxOTQtNGNmYWViYWZjM2YxIiwicmVxdWVzdFVzZXJJZCI6IjE2OGRiMDYzLWQ2ODItNDg5ZC04NDU3LWUwMTY2ZmJlOTg5NSIsImlkIjpbXSwiYWNjb3VudElkIjoiMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwIiwiaXNzIjoiVGhlIEtub3QgUHJvIFByb2R1Y3Rpb24iLCJhdWQiOiJ3d3cudGhla25vdHByby5jb20iLCJzdWIiOiJ2MSBzZWN1cml0eSIsInNjb3BlIjpbIlN1cGVyQWRtaW4iXX0.wmYpEqbq5Y4d-RI2dAaS3U0WOoX2QYY4MpZ-qHX3K_I` // NEED CHANGED
        }
    }
};

const targetFile = 'list0116.csv';
const prefix = 'prod-0116-1';

const uploadToLibraryLogPath = `${prefix}-upload-to-library`;
const uploadToGalleryLogPath = `${prefix}-upload-to-gallery`;
const succeedStorefrontIdLogPath = `${prefix}-succeed-sf-id`;

;(async() => {
    const updateList = await csv().fromFile(`${__dirname}/${targetFile}`);
    console.log('updateList: ', updateList.length);

    // format
    let uploadToLibrary = updateList.map((item) => ({
        url       : item.URL,
        accountId : item.AccountID,
        locationId: item.LocationID
    }));

    // ------------ UPLOAD TO LIBRARY ----------------
    // ------------ UPLOAD TO LIBRARY ----------------
    // ------------ UPLOAD TO LIBRARY ----------------
    // ------------ UPLOAD TO LIBRARY ----------------
    // ------------ UPLOAD TO LIBRARY ----------------

    uploadToLibrary = uploadToLibrary.map((list) => {
        try {
            //
            // VALID::
            // https://my.matterport.com/show/?m=bYxhM9YHv4C&brand=0
            //
            // INVALID:
            // https://my.matterport.com/show?m=VpgwytJpDt9&brand=0 -> https://my.matterport.com/show/?m=VpgwytJpDt9&brand=0
            // https://my.matterport.com/models/Q9DmizeQUmq&brand=0 -> https://my.matterport.com/show/?m=Q9DmizeQUmq&brand=0
            const sourceId = new RegExp(Config.urlPattern).exec(list.url)[1];

            return {
                ...list,
                sourceId,
                typeCode    : '360Tour',
                name        : '360Tour',
                embedFormat : Config.iframeFormat.replace(/\{0\}/, sourceId),
                thumbnailUrl: Config.thumbnailFormat.replace(/\{0\}/, sourceId)
            };
        } catch (error) {
            console.log(`INVALID_URL: ${list.url}`);

            return null;
        }
    }).filter((item) => item);

    // sort by accountId
    uploadToLibrary = uploadToLibrary.sort((x, y) => x.accountId > y.accountId ? 1 : -1);
    // upload to library
    await uploadToLibraryMethod(uploadToLibrary, Config, uploadToLibraryLogPath);

    console.log('Done to write a final list..');

    // ------------ UPLOAD TO GALLERY ----------------
    // ------------ UPLOAD TO GALLERY ----------------
    // ------------ UPLOAD TO GALLERY ----------------
    // ------------ UPLOAD TO GALLERY ----------------
    // ------------ UPLOAD TO GALLERY ----------------

    const whereSQLS = [];
    uploadToLibrary.forEach((item) => {
        whereSQLS.push(`(data->>'accountId'='${item.accountId}' and data->>'locationId'='${item.locationId}' and data->>'statusCode'='LIVE' and data->>'isPurchased' = 'true')`);
    });

    const sql = `select
        data->>'id' as id,
        data->>'categoryCode' as cat,
        data->>'accountId' as "accountId"
    from storefronts
    where ${whereSQLS.join(' OR ')}`;


    const uploadToGalleryList = (await xoDs.pg.execute('storefront', sql))
        .map((dd) => {
            const acc = uploadToLibrary.find((item) => item.accountId === dd.accountId);

            return ({
                ...dd,
                url         : acc.url,
                locationId  : acc.locationId,
                mediaId     : acc.mediaId,
                storefrontId: dd.id
            });
        });

    const len1 = uploadToGalleryList.length;

    for (let i = 0; i < len1; i++) {
        fs.appendFileSync(`${__dirname}/${uploadToGalleryLogPath}.json`, `${JSON.stringify(uploadToGalleryList[i])},\n`);
    }
    console.log('Done to write a gallery list..');

    await uploadToGalleryMethod(uploadToGalleryList, Config, succeedStorefrontIdLogPath);

    // console.log(uploadToGalleryList[0])
    // {
    //     id: '60c1a5e1-d20c-440d-8124-9deb00f4ec23',
    //     cat: 'REC',
    //     accountId: 'b2bcb804-2761-4b18-a22c-a3ca00f04989',
    //     url: 'https://my.matterport.com/show/?m=Lz3JPXnRkAh&brand=0',
    //     locationId: '35e38836-cd3c-4a3d-bba3-cb32c2e8bfff'
    // }
})();


/* <a target="_blank"
href="https://www.theknot.com/marketplace/redirect-981882">
<div style="display: inline-block; font-size: 10px; text-align: center;">
<img src="//s3.amazonaws.com/tkpro-assets/bow_2020/bow_2020_badges(70x70).png"
width="70" height="70" alt="The Knot Best of Weddings - 2020 Pick" border="0"
style="margin:0 auto; display:block;"><span>Perks bridal salons RTP 2</span></div></a>


https://pricing-sheets.s3.amazonaws.com/a4f17971-3c25-44f1-8473-a62f00e2b0ef/7baea51534b4da04570906a20c45a697fd16ecc2/1ce95944-4e33-4b12-8f72-5035abb18571 */
