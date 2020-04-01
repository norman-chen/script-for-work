
'use strict';

const contentfulMgr = require('contentful-management');
const Promise = require('bluebird');
// write key
const key = 'CFPAT-ILaUO0N2TFy3ITjtBXYOJgiEPPS0GNSW8RLP2dhTcAA';

const env = 'production';

// const rows = require('./log1.js');

const entryIds = require('./newTopicEntryIDs');
// const getIds = () => {
//     rows.forEach(r => {
//         entryIds.push(...r)
//     })
// }

;(async() => {
    // getIds();

    const writeClient = await contentfulMgr.createClient({
        accessToken: key
    });

    const space = env === 'production' ?
        await writeClient.getSpace('6m9bd13t776q') :
        await writeClient.getSpace('4xfyjz8unk0s');

    const Envr = await space.getEnvironment('master');

    const primaryIds = [];
    const res = [];


    for (let i = 0; i < entryIds.length; i++) {
        const entryId = entryIds[i];
        const enrtry = await Envr.getEntry(entryId)
        const slug = enrtry.fields.slug['en-US'];

        const primaryId = enrtry.fields.primary_stage_topic['en-US'].sys.id;
        // continue;

        // console.log(`"${entryId}",${slug},${primaryId}`)
        let headline = ''
        try {
            headline = enrtry.fields.headline['en-US'];
        } catch (error) {
            console.log(`***,${i},${entryId},${slug},${primaryId}`)
            res.push({
                entryId, slug, primaryId
            })
            continue
        }

        // console.log(headline);

        // console.dir(, {depth: 9})
        // continue;

        if (enrtry.sys.publishedCounter === 0 || !enrtry.sys.publishedAt) {
            console.log(`***,${i},${entryId},${slug},${primaryId}`)
            res.push({
                entryId, slug, primaryId
            })
            continue
        }

        // if (i === 5) { break }
        // continue
        if (!primaryIds.includes(primaryId)) {
            primaryIds.push(primaryId)
        }
        // continue;

        try {
            await enrtry.publish()
            console.log(`---,${i},${entryId},${headline}`)
            await Promise.delay(60 * 2 * 1000);

        } catch (error) {
            console.log(`***,${i},${entryId},${slug},${primaryId}`)
            res.push({
                entryId, slug, primaryId
            })
        }
    }

    // return;

    const nameMap = {}
    for (let i = 0; i < primaryIds.length; i++) {
        const topicId = primaryIds[i];
        const enrtry = await Envr.getEntry(topicId)

        nameMap[topicId] = {
            topicName: enrtry.fields.name && enrtry.fields.name['en-US'],
            topicSlug: enrtry.fields.stage_topic_slug && enrtry.fields.stage_topic_slug['en-US']
        }
    }

    res.map(r => ({
        ...r,
        topicName: nameMap[r.primaryId] && nameMap[r.primaryId].topicName,
        topicSlug: nameMap[r.primaryId] && nameMap[r.primaryId].topicSlug,
    })).forEach(r => console.log(`"${r.entryId}",${r.slug},${r.primaryId},${r.topicSlug},${r.topicName}`))

})()