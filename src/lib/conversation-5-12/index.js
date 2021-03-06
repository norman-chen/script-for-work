'use strict';

const XoDs = require('xo-ds-handler');
const xoDs = new XoDs()
var Rabbit         = require('xo-rabbit');
var rab       = new Rabbit();
const Promise = require('bluebird')

const config = {
    xoDsConfig: {
        // "write-store": {
        //     "conversation": "postgres://localservices:!q2w3e4r5t6y7@conversations-pg-qa.cfjnafc8bsrz.us-east-1.rds.amazonaws.com:5432/conversation",
        //     "identity": "postgres://localservices:!q2w3e4r5t6y7@identities-pg-qa.cfjnafc8bsrz.us-east-1.rds.amazonaws.com:5432/identity"
        //   }

          "write-store": {
            "conversation": "postgres://localservices:XvkTraVU94enXcud@conversations-pg-prod.cfjnafc8bsrz.us-east-1.rds.amazonaws.com:5432/conversation",
            "identity": "postgres://localservices:eU89MuEzSALZrAEX@identities-pg-prod.cfjnafc8bsrz.us-east-1.rds.amazonaws.com:5432/identity"
          }
    },

    // "xoRab": {
    //     "ssl": false,
    //     "user": "local-vx",
    //     "password": "k6A8qN8fAjEnbYmzgfmjSy58H56vGDsr",
    //     "server": "advanced-sheep.rmq.cloudamqp.com",
    //     "vhost": "xtxfrjwu",
    //     "globalExchange": "local-vx"
    // }

    xoRab: {
        "ssl": false,
        "user": "local-comms",
        "password": "YmFnq2GCLHtk7urJ5eAhKVyb",
        "server": "sprightly-chimpanzee.rmq.cloudamqp.com",
        "vhost": "kxlhkxqc",
        "globalExchange": "local-global"
    }

    // xoRab: {
    //     "user": "guest",
    //     "password": "guest",
    //     "server": "rabbitbox",
    //     "globalExchange": "local-global"
    // }
};

;(async () => {
    xoDs.config(config.xoDsConfig);
    rab.config(config.xoRab);

    const sql = `select * from conversations
    where data->'timestamp'->>'createdAt' >= '2020-05-13'
    and (data->'timestamp'->>'createdAt')::timestamp < '2020-05-13 11:00'
    `

    const convers = await xoDs.pg.execute('conversation', sql)

    let all = []
    const last = (convers.length-1);
    for (let i = 0; i < convers.length; i++) {
        const { data: conver } = convers[i];

        const message = {
            event: 'conversation.conversation_created',
            'initial-payload': conver,
            'result-payload': conver,
            'db-payload': conver
        }

        all.push(
            rab.emit(message, {
                queueName: 'hapi-segmentio'
            })
        )

        if (all.length === 300 || i === last) {
            await Promise.all(all)
            all = []
            console.log(`---------${i}`)
        }
    }

    console.log('--done')
})();