const Promise = require('bluebird');
const fs = require('fs');
const xoReq = new(require('xo-request'))();

const realReq = (Config, ele, uploadToLibraryLogPath) => {
    const payload = {
        accountId   : ele.accountId,
        embedFormat : ele.embedFormat,
        name        : ele.name,
        sourceId    : ele.sourceId,
        thumbnailUrl: ele.thumbnailUrl,
        typeCode    : ele.typeCode
    };

    return xoReq.post(`${Config.mediaApi}/library`, payload, Config.reqOps)
        .then((resp) => {
            ele.mediaId = resp.getBody().id;
            ele.sourceId = resp.getBody().sourceId;
        })
        .then(() => fs.appendFileSync(`${__dirname}/${uploadToLibraryLogPath}.json`, `${JSON.stringify(ele)},\n`));
};


module.exports = async(targetList, Config, uploadToLibraryLogPath) => {
    // upload 360tour to account first
    // POST https://qa-media-api.localsolutions.theknot.com/library
    //
    // accountId: "6387b775-ff76-4f79-9601-8c63b89809fc"
    // embedFormat: "<iframe width="500" height="390" src="https://my.matterport.com/show/?m=5JdaHUKU1h8" frameborder="0" allowfullscreen=""></iframe>"
    // name: "360Tour"
    // sourceId: "5JdaHUKU1h8"
    // thumbnailUrl: "https://my.matterport.com/api/v1/player/models/5JdaHUKU1h8/thumb"
    // typeCode: "360Tour"
    const len = targetList.length;
    console.log('upload to library num: ', len);

    let concurrencyReq = [];
    const reTry = [];

    // Upload to library request
    // Upload to library request
    // Upload to library request
    // Upload to library request
    // Upload to library request

    for (let i = 0; i < len; i++) {
        const ele = targetList[i];

        concurrencyReq.push(
            realReq(Config, ele, uploadToLibraryLogPath)
                .catch(() => {
                    reTry.push(ele);
                })
        );

        if (concurrencyReq.length === 30 || (i + 1) === len) {
            await Promise.all(concurrencyReq);
            concurrencyReq = [];
        }

        if (i % 200 === 0) {
            console.log(`upload to library done: ${i}`);
        }
    }

    // Retry upload if error
    // Retry upload if error
    // Retry upload if error
    // Retry upload if error
    // Retry upload if error

    const reTryLen = reTry.length;
    if (reTryLen) {
        console.log('upload to library reTryLen: ', reTryLen);

        for (let i = 0; i < reTryLen; i++) {
            const ele = reTry[i];

            await realReq(Config, ele, uploadToLibraryLogPath)
                .catch((error) => {
                    console.log('=====================================');
                    console.log('error: ', error.message);
                    console.log('Fail account: ', ele.accountId);
                    console.log(JSON.stringify(ele));
                    console.log('=====================================');
                });
        }
    }
};
