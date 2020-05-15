queryPayload = {
    dataSource: 'conversation.messages',
    // native    : `data->>'conversationId' = '111111_id'`,
    // query: {
    //     'data->>conversationId': '1111'
    // },
    // limit     : 1,
    // sort: {
    //     "(data->timestamp->>createdAt')::timestamp": 'asc'
    // },
    logQuery: true,
    // native: `data->>'conversationId' = 'ffb17f6f-b670-4182-bdb2-ff5ae84c698d' order by (data->'timestamp'->>'createdAt')::timestamp asc limit 1`
};

const XoDs = require('xo-ds-handler');
const xoDs = new XoDs();

const config = {
    xoDsConfig: {
        // NEED CHANGED
        // 'write-store': {
        //     storefront: 'postgres://localservices:!q2w3e4r5t6y7@storefronts-pg-qa.cfjnafc8bsrz.us-east-1.rds.amazonaws.com/storefront'
        // }
        // NEED CHANGED
        'write-store': {
            storefront: 'postgres://localservices:XvkTraVU94enXcud@storefronts-pg-prod.cfjnafc8bsrz.us-east-1.rds.amazonaws.com/storefront',
            "conversation": "postgres://localservices:XvkTraVU94enXcud@conversations-pg-prod.cfjnafc8bsrz.us-east-1.rds.amazonaws.com:5432/conversation",
        }
    },
    DB: 'storefront'
};

;(async () => {
    xoDs.config(config.xoDsConfig)

    const sql = `
    SELECT * FROM messages WHERE
    data->>'conversationId' = 'ffb17f6f-b670-4182-bdb2-ff5ae84c698d' order by (data->'timestamp'->>'createdAt')::timestamp asc limit 1
    `
    console.log((await xoDs.pg.execute('conversation', sql))[0].data)
})()