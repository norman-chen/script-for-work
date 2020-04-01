

'use strict';

const contentfulMgr = require('contentful-management');
// write key
const key = 'CFPAT-ILaUO0N2TFy3ITjtBXYOJgiEPPS0GNSW8RLP2dhTcAA';
const env = 'production';
const slugs = [
    'parenting-toddler-health-wellness',
    'parenting-toddler-milestones',
    'parenting-toddler-childcare',
    'parenting-toddler-feeding',
    'parenting-toddler-sleep',
    'parenting-toddler-twins-multiples',
    'parenting-toddler-breastfeeding',
    'parenting-toddler',
    'parenting-baby-products',
    'ttc-early-pregnancy-to-dos',
]

;(async() => {
    const writeClient = await contentfulMgr.createClient({
        accessToken: key
    });

    const space = env === 'production' ?
        await writeClient.getSpace('6m9bd13t776q') :
        await writeClient.getSpace('4xfyjz8unk0s');

    const Envr = await space.getEnvironment('master');

    const res = []
    for (let i = 0; i < slugs.length; i++) {
        const slug = slugs[i];
        const { items: topic } = await Envr.getEntries({
            content_type         : 'stageTopic',
            'fields.stage_topic_slug[match]': slug
        });

        console.log(`${topic.length},${slug},${topic[0].sys.id}`)
        topic.forEach(t => {
            const id = t.sys.id;
            const name = t.fields.stage_topic_slug['en-US'];

            if (!res.find(r => r.name === name)) {
                res.push({
                    oldTopic: id,
                    name,
                })
            }
        })

    }

    console.dir(res, {depth: 9})
})()