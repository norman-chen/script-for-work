
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

    // const entry = await envr.getEntries({'content_type': 'guide_article'})
    const entry = await envr.getEntry('5uRNtApaUcLPfJPa77ozyE')
    console.dir(entry, {depth: 9})

    return

    entry.fields.secondary_stage_topics = {
        'en-US': [
            ...entry.fields.secondary_stage_topics['en-US'],
            {
                sys: {
                    type: 'Link',
                    linkType: 'Entry',
                    id: '2GaVVJZpQIqQKY4KmMkw2C'
                }
            }
        ]
    }

    await entry.update()


    // 5uRNtApaUcLPfJPa77ozyE How to test jwplayer
})()