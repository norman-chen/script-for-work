
'use strict';

const contentfulMgr = require('contentful-management');
// write key
const key = 'CFPAT-ILaUO0N2TFy3ITjtBXYOJgiEPPS0GNSW8RLP2dhTcAA';

const env = 'qa';
const limit = 200;
const bulkUpdateLen = 30;
const isUpdate = true;

const { targetListPROD, targetListQA } = require('./constants');
const targetList = env === 'production' ? targetListPROD : targetListQA;
const contentTypes = [
    'guide_article',
    'guide_qa', // no secondary
    'guide_slideshow',
    'news',
    'news_slideshow',
    'guideWeekByWeek',
    // 'guideBabyMonthByMonth', // no
    'tools_article'
];

let bulkBuffer = [];
const bulkUpdateEntries = async(entry, isLast = false) => {
    if (!isUpdate) { return; }

    bulkBuffer.push(entry.update().catch((err) => {
        console.log(err)
    }));

    if (bulkBuffer.length === bulkUpdateLen || isLast) {
        await Promise.all(bulkBuffer);
        bulkBuffer = [];

        await Promise.delay(1000);
    }
};

const counting = {};
const countingNum = (contentType, topic, num,  ids) => {
    if (!counting[topic]) {
        counting[topic] = {
            [contentType]: ids
        };

        return;
    }

    if (counting[topic][contentType] === undefined) {
        counting[topic][contentType] = ids;

        return;
    }

    counting[topic][contentType].push(...ids);
};

const mappingNum = () => {
    const mapCount = {};
    let sum = 0;

    Object.keys(counting).forEach((k) => {
        const name = targetList.find((tar) => tar.oldTopic === k).name;

        mapCount[name] = {};

        Object.keys(counting[k]).forEach((kk) => {
            const list = Array.from(new Set((counting[k][kk])))
            const len = list.length;
            mapCount[name][kk] = len;
            sum += len;

            len && console.log(`${[name]},${k},${kk},${len}`)
        });
    });

    // console.dir(mapCount);
    console.log(sum);

};

const primaryUpdateForLimit = async(Envr, contentType, oldTopic, newTopic) => {
    const { items: entries } = await Envr.getEntries({
        content_type                              : contentType,
        'fields.primary_stage_topic.sys.id[match]': oldTopic,
        limit
    });

    if (!isUpdate) {
        // console.log(`primary ${contentType} ${oldTopic} ${entries.length}`);
        countingNum(contentType, oldTopic, entries.length, entries.map((e) => e.sys.id));

        return;
    }

    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];

        entry.fields.primary_stage_topic['en-US'] = {
            sys: {
                type    : 'Link',
                linkType: 'Entry',
                id      : newTopic
            }
        };

        await bulkUpdateEntries(entry, i === (entries.length - 1));
    }

    if (entries.length === limit) {
        await primaryUpdateForLimit(contentType, oldTopic, newTopic);
    }
};

const secondaryUpdateForLimit = async(Envr, contentType, oldTopic, newTopic) => {
    const { items: entries } = await Envr.getEntries({
        content_type                                 : contentType,
        'fields.secondary_stage_topics.sys.id[match]': oldTopic,
        limit
    });

    if (!isUpdate) {
        // console.log(`secondary ${contentType} ${oldTopic} ${entries.length}`);
        countingNum(contentType, oldTopic, entries.length, entries.map((e) => e.sys.id));

        return;
    }

    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];

        const topicIdx = entry.fields.secondary_stage_topics['en-US']
            .findIndex((item) => item.sys.id === oldTopic);

        if (topicIdx === -1) {
            continue
        }

        entry.fields.secondary_stage_topics['en-US'][topicIdx].sys.id = newTopic;

        await bulkUpdateEntries(entry, i === (entries.length - 1));
    }

    if (entries.length === limit) {
        await secondaryUpdateForLimit(contentType, oldTopic, newTopic);
    }
}

;(async() => {
    const writeClient = await contentfulMgr.createClient({
        accessToken: key
    });

    const space = env === 'production' ?
        await writeClient.getSpace('6m9bd13t776q') :
        await writeClient.getSpace('4xfyjz8unk0s');

    const Envr = await space.getEnvironment('master');

    for (let i = 0; i < targetList.length; i++) {
        const { oldTopic, newTopic } = targetList[i];

        for (let j = 0; j < contentTypes.length; j++) {
            const contentType = contentTypes[j];

            try {
                await primaryUpdateForLimit(Envr, contentType, oldTopic, newTopic);
                await secondaryUpdateForLimit(Envr, contentType, oldTopic, newTopic);
            } catch (error) {
                // console.log('====ERROR====');
                // console.log(`${contentType},${oldTopic},${newTopic},${error.message}`);
                // console.log('====ERROR====');
            }

            // console.log(`-----Done for contentType ${contentType} in topic ${oldTopic}`);
        }
    }

    // console.dir(counting);

    mappingNum();
})();
