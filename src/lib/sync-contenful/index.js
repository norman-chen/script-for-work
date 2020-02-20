const contentful = require("contentful");
const contentfulMgr = require('contentful-management')

// write key
const key = 'CFPAT-ILaUO0N2TFy3ITjtBXYOJgiEPPS0GNSW8RLP2dhTcAA';
const production = {
    space: '6m9bd13t776q',
    accessToken: 'd8e104fa7d1bbb143f36695ad78266603d729948013e79c44fa7f47c59c8ce7e'
}
const qa = {
    space: '4xfyjz8unk0s',
    accessToken: '4273cfbf5ca81735b815a73ef3340fbee75577f699a8b83810751f1da5a33a4b'
}

// client
const prodClient = contentful.createClient({
    space: production.space,
    accessToken: production.accessToken
});
const qaClient = contentful.createClient({
    space: qa.space,
    accessToken: qa.accessToken
});

// config
const contentType = 'stageTopic'

// main
;(async () => {
    const { items: prodEntries } = await prodClient.getEntries({
        content_type: contentType
    })

    const { items: qaEntries } = await qaClient.getEntries({
        content_type: contentType
    })

    const needToSysToQaEntrs = [];

    prodEntries.forEach((prodEntr) => {
        // const isNameExisted = !!qaEntries.find((qaEntr) => qaEntr.sys.id === prodEntr.sys.id)
        const isNameExisted = !!qaEntries.find((qaEntr) => qaEntr.fields.name === prodEntr.fields.name)

        if (isNameExisted) { console.log(prodEntr.fields.name); return; }

        needToSysToQaEntrs.push({
            id: prodEntr.sys.id,
            fields: prodEntr.fields
        })
    })

    console.log('-------');

    const writeClient = await contentfulMgr.createClient({
        accessToken: key
    })

    const space = await writeClient.getSpace(qa.space)
    const envr = await space.getEnvironment('master')

    for (let i = 0; i < needToSysToQaEntrs.length; i++) {
        const prodEntr = needToSysToQaEntrs[i];
        try {
            await envr.createEntryWithId(
                'stageTopic',
                prodEntr.id,
                {
                    fields: {
                        name: {
                            'en-US': prodEntr.fields.name
                        },
                        stage_topic_slug: {
                            'en-US': prodEntr.fields.stage_topic_slug
                        }
                    }
                }
            )

            console.log(`"${prodEntr.id}",`)
        } catch (error) {
            console.log('====ERROR')
            console.log(error.message)
            console.log(`"${prodEntr.id}",`)
            console.log('====ERROR')
        }
    }

    console.log('---pub---');

    for (let i = 0; i < needToSysToQaEntrs.length; i++) {
        const prodEntr = needToSysToQaEntrs[i];
        try {
            const entry = await envr.getEntry(prodEntr.id)
            await entry.publish()
        } catch (error) {
            console.log('====ERROR')
            console.log(error.message)
            console.log(`"${prodEntr.id}",`)
            console.log('====ERROR')
        }
    }

    console.log('----done')
})()

// ;(async () => {
//     const contentfulMgr = require('contentful-management')
//     const key = 'CFPAT-ILaUO0N2TFy3ITjtBXYOJgiEPPS0GNSW8RLP2dhTcAA';

//     const writeClient = await contentfulMgr.createClient({
//         accessToken: key
//     })

//     const space = await writeClient.getSpace('4xfyjz8unk0s')
//     const envr = await space.getEnvironment('master')
//     // const entry = await envr.createEntryWithId(
//     //     'topic',
//     //     '6IxuGi8HDagFTEeTJxwgob',
//     //     {
//     //         fields: {
//     //             name: {
//     //                 'en-US': 'sync from prod test'
//     //             },
//     //             slug: {
//     //                 'en-US': 'sync-from-prod-test'
//     //             }
//     //         }
//     //     }
//     // )

//     const entry = await envr.getEntry('6IxuGi8HDagFTEeTJxwgob')
//     await entry.publish()
//     console.dir(entry)
// })()