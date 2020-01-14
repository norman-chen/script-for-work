const XoDs = require('xo-ds-handler');
const xoDs = new XoDs();

;(async() => {
    // delete library media by id
    const list = require('./qa-0114-upload-to-library.json');
    const sql = [];
    list.forEach(({ mediaId }) => {
        sql.push(`delete from media where data->>'id' = '${mediaId}';`);
    });

    const DB_CONFIG = {
        xoDsConfig: {
            'write-store': {
                storefront: 'postgres://localservices:!q2w3e4r5t6y7@storefronts-pg-qa.cfjnafc8bsrz.us-east-1.rds.amazonaws.com/storefront'
            }
        }

        // xoDsConfig: {
        //         'write-store': {
        //             storefront: 'postgres://localservices:XvkTraVU94enXcud@storefronts-pg-prod.cfjnafc8bsrz.us-east-1.rds.amazonaws.com/storefront'
        //         }
        //     },
    };
    xoDs.config(DB_CONFIG.xoDsConfig);
    await xoDs.pg.execute('storefront', sql.join('\n'));


    //  // delete library media by sourceId
    //  const list = require('./qa-0114-upload-to-library.json')
    //  const sql = []
    //  list.forEach(({ sourceId }) => {
    //      sql.push(`delete from media where data->>'sourceId' = '${sourceId}';`)
    //  });

    //  const DB_CONFIG = {
    //      xoDsConfig: {
    //          'write-store': {
    //              storefront: 'postgres://localservices:!q2w3e4r5t6y7@storefronts-pg-qa.cfjnafc8bsrz.us-east-1.rds.amazonaws.com/storefront'
    //          }
    //      },

    //      // xoDsConfig: {
    //      //         'write-store': {
    //      //             storefront: 'postgres://localservices:XvkTraVU94enXcud@storefronts-pg-prod.cfjnafc8bsrz.us-east-1.rds.amazonaws.com/storefront'
    //      //         }
    //      //     },
    //  };
    //  xoDs.config(DB_CONFIG.xoDsConfig);
    //  await xoDs.pg.execute('storefront', sql.join('\n'))
})();
