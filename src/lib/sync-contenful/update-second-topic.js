
;(async () => {
    const contentfulMgr = require('contentful-management')
    const key = 'CFPAT-ILaUO0N2TFy3ITjtBXYOJgiEPPS0GNSW8RLP2dhTcAA';

    const writeClient = await contentfulMgr.createClient({
        accessToken: key
    })

    const space = await writeClient.getSpace('4xfyjz8unk0s')
    const envr = await space.getEnvironment('master')

    // const contentType = await envr.getContentType('guide_article');
    // console.dir(contentType, {depth: 9})
    // contentType.items.forEach(c => {
    //     console.log(c.sys.id)
    // })
    // console.log('=================')

    const { items: entry } = await envr.getEntries({
        'content_type': 'guide_article',
        'fields.primary_stage_topic.sys.id[match]': '1Y2YrfgaZeoOIiKmycew0q',
        'fields.secondary_stage_topics.sys.id[match]': '6Qjl5KiotyWX1I6vBDRcsz'
    })
    // const entry = await envr.getEntry('5uRNtApaUcLPfJPa77ozyE')
    console.dir(entry[0], {depth: 9})
    console.log(entry.length)

    // return

    // entry.fields.secondary_stage_topics = {
    //     'en-US': [
    //         ...entry.fields.secondary_stage_topics['en-US'],
    //         {
    //             sys: {
    //                 type: 'Link',
    //                 linkType: 'Entry',
    //                 id: '2GaVVJZpQIqQKY4KmMkw2C'
    //             }
    //         }
    //     ]
    // }

    console.log(entry[0].update().catch(() => {}))

    // await entry.update()


    // 5uRNtApaUcLPfJPa77ozyE How to test jwplayer
})()