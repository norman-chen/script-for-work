
const contentfulMgr = require('contentful-management')
// write key
const key = 'CFPAT-ILaUO0N2TFy3ITjtBXYOJgiEPPS0GNSW8RLP2dhTcAA';

const writeClient = await contentfulMgr.createClient({
    accessToken: key
})

const space = await writeClient.getSpace('4xfyjz8unk0s') // prod: 6m9bd13t776q
const Envr = await space.getEnvironment('master')
const limit = 200;
const bulkUpdateLen = 30;

const targetList = [
    {
        oldTopic: 'id1',
        newTopic: 'id2'
    }
];
const contentTypes = [
    'guide_article',
    'guide_qa', // no secondary
    'guide_slideshow',
    'news',
    'news_slideshow',
    'guideWeekByWeek',
    'guideBabyMonthByMonth', // no
    'tools_article'
];

let bulkBuffer = [];
const bulkUpdateEntries = (entry, isLast = false) => {
    bulkBuffer.push(entry.update().catch(() => {}))

    if (bulkBuffer.length === bulkUpdateLen || isLast) {
        await Promise.all(bulkBuffer)
        bulkBuffer = [];
    }
}


const primaryUpdateForLimit = async (contentType, oldTopic, newTopic) => {
    const { items: entries } = await Envr.getEntries({
        'content_type': contentType,
        'fields.primary_stage_topic.sys.id[match]': oldTopic,
        limit
    })

    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];

        entry.fields.primary_stage_topic['en-US'] = {
            sys: {
                type: 'Link',
                linkType: 'Entry',
                id: newTopic
            }
        }

        await bulkUpdateEntries(entry, i === (length - 1))
    }

    if (entries.length === limit) {
        await primaryUpdateForLimit(contentType, oldTopic, newTopic)
    }
}

const secondaryUpdateForLimit = async(contentType, oldTopic, newTopic) => {
    const { items: entries } = await Envr.getEntries({
        'content_type': contentType,
        'fields.secondary_stage_topics.sys.id[match]': oldTopic,
        limit
    })

    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];

        topicIdx = entry.fields.secondary_stage_topics['en-US']
            .find(item => item.sys.id === oldTopic)

        entry.fields.secondary_stage_topics['en-US'][topicIdx].sys.id = newTopic;

        await bulkUpdateEntries(entry, i === (length - 1))
    }

    if (entries.length === limit) {
        await secondaryUpdateForLimit(contentType, oldTopic, newTopic)
    }
}

;(async () => {

    for (let i = 0; i < targetList.length; i++) {
        const { oldTopic, newTopic } = targetList[i];

        for (let j = 0; j < contentTypes.length; j++) {
            const contentType = contentTypes[j];

            try {
                await primaryUpdateForLimit(contentType, oldTopic, newTopic);
                await secondaryUpdateForLimit(contentType, oldTopic, newTopic);
            } catch (error) {
                console.log('====ERROR====');
                console.log(`${contentType},${oldTopic},${newTopic}`)
                console.log('====ERROR====');
            }

            console.log(`Done for contentType ${contentType} in topic ${oldTopic}`);
        }

    }
})()