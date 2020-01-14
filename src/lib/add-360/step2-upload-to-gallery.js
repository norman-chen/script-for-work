
const Promise = require('bluebird');
const fs = require('fs');
const xoReq = new(require('xo-request'))();

const realReq = ({reqBody, url, storefrontId}, succeedStorefrontIdLogPath) =>
    xoReq.patch(url, reqBody)
        .then(() => fs.appendFileSync(`${__dirname}/${succeedStorefrontIdLogPath}.json`, `"${storefrontId}",\n`));

module.exports = async(targetList, Config, succeedStorefrontIdLogPath) => {
    // add to front
    // PATCH https://qa-media-api.localsolutions.theknot.com/storefronts/495a7679-cb41-4f88-bdd1-a62f00e2b0d3/gallery

    // ids: ["5d5c623c-d5fc-47ac-824d-07d3a75d5bad"]
    // position: 0

    const len = targetList.length;
    console.log('Upload to Gallery len: ', len);

    let reqBodies = [];
    const laterReq = [];

    for (let i = 0; i < len; i++) {
        const ele = targetList[i];

        const reqBody = {
            payload: {
                ids     : [ele.mediaId],
                position: 0
            },
            ...Config.reqOps
        };
        const storefrontId = ele.storefrontId;
        const url = `${Config.mediaApi}/storefronts/${storefrontId}/gallery`;

        if (reqBodies.length === 0 || reqBodies.find((item) => item.reqBody.payload.ids[0] !== ele.mediaId)) {
            reqBodies.push({ reqBody, url, storefrontId });
        } else {
            laterReq.push({ reqBody, url, storefrontId });
        }

        if (reqBodies.length === 30 || (i + 1) === len) {
            await Promise.all(
                reqBodies.map((reqBody) =>
                    realReq(reqBody, succeedStorefrontIdLogPath).catch(() => laterReq.push(reqBody))
                )
            );

            reqBodies = [];
        }

        if (i % 200 === 0) {
            console.log(`upload to gallery done: ${i}`);
        }
    }

    for (let i = 0; i < laterReq.length; i++) {
        console.log(`later-upload: ${laterReq.length} ${i}`);
        const ele = laterReq[i];

        await realReq(ele, succeedStorefrontIdLogPath)
            .catch((error) => {
                console.log('=====================================');
                console.log('error: ', error.message);
                console.log('url: ', ele.url);
                console.log('payload: ', ele.reqBody.payload);
                console.log('=====================================');
            });
    }
};
