'use strict';

const XoDsHandler = require('xo-ds-handler');
const xoDsHandler = new XoDsHandler();
const constants = require('./constants');
const Promise = require('bluebird');
const rp = require('request-promise');

;(async() => {
    xoDsHandler.config(constants['xo-ds-handler']);

    const getTargetSfSql = `SELECT
    map->>'storefrontId' as "storefrontId"
    FROM (
        SELECT * FROM media m
        WHERE (data->'storefronts' @> '[{"section":"PORTFOLIO"}]')
    ) as target, jsonb_array_elements(target.data->'storefronts') map
    WHERE map->>'section' = 'PORTFOLIO' AND (map->>'position')::float <= ${constants.positionMax}
    GROUP BY map->>'storefrontId'`;

    const targetSfIds = constants.targetSfs.length ?
        constants.targetSfs.map((id) => {
            return { storefrontId: id };
        }) :
        await xoDsHandler.pg.execute(constants.DB, getTargetSfSql);
    const total = targetSfIds.length;

    for (let i = 0; i < total; i++) {
        const sfId = targetSfIds[i].storefrontId;

        const getGallerySql = `SELECT
            data->>'id' as "id",
            data->>'storefronts' as "sfs"
        FROM (
            SELECT * FROM media m
            WHERE (data->'storefronts' @> '[{"section":"PORTFOLIO", "storefrontId":"${sfId}"}]')
        ) as target, jsonb_array_elements(target.data->'storefronts') map
        WHERE map->>'section' = 'PORTFOLIO' AND map->>'storefrontId' = '${sfId}'
        order by (map->>'position')::float asc`;

        const gallery = await xoDsHandler.pg.execute(constants.DB, getGallerySql);
        const len = gallery.length;

        const allUpdates = [];

        for (let j = 0; j < len; j++) {
            const sfs = JSON.parse(gallery[j].sfs);
            const mediaId = gallery[j].id;
            const targetIdx = sfs.findIndex((item) => item.storefrontId === sfId && item.section === 'PORTFOLIO');

            sfs[targetIdx].position = (j + 1) * constants.positionGap;

            const updateSql = `UPDATE media SET data = jsonb_set(data, '{storefronts}', '${JSON.stringify(sfs)}') WHERE data->>'id' = '${mediaId}';`;
            allUpdates.push( updateSql );
        }

        try {
            await xoDsHandler.pg.execute(constants.DB, allUpdates.join('\n'));

            constants.autoPublish && await rp({
                method : 'POST',
                uri    : `${constants.sfUri}/storefronts/${sfId}/publish?apikey=${constants.apikey}`,
                headers: {
                    authorization: `Bearer ${constants.token}`
                },
                body: {
                    sections: ['gallery']
                },
                json: true
            });
        } catch (error) {
            console.log(error);
            console.log(`Error - ${sfId}`);
            console.log(`Error - ${sfId}`);
            console.log(`Error - ${sfId}`);
        }
        console.log(`storefrontId:${sfId} total:${total} idx:${i}`);
    }

    await Promise.delay(10 * 1000);
    process.exit(0);
})();
