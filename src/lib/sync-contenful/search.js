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

// // client
const prodClient = contentful.createClient({
    space: production.space,
    accessToken: production.accessToken
});
const qaClient = contentful.createClient({
    space: qa.space,
    accessToken: qa.accessToken
});

const Client = qaClient;

// config
const contentType = 'guide_article'

// main
;(async () => {

    let { items: entries } = await Client.getEntries({
        content_type: contentType,
        // limit: 100,
        // 'fields.stage_topic_slug[match]': 'ttc-surrogacy',
        'fields.primary_stage_topic.sys.id[match]': '1Y2YrfgaZeoOIiKmycew0q',
        // 'fields.secondary_stage_topics[in]': '6Qjl5KiotyWX1I6vBDRcsz',
    })



    entries[0].fields.body_images = [];
    entries[0].fields.body = 'body';
    entries[0].fields.authors = [];
    entries[0].fields.hero_image = {};
    entries[0].fields.body_videos = []

    console.dir(entries[0], {depth: 9})
    console.log(entries.length)

    return
    // entries = entries.sort((x, y) => x.fields.name > y.fields.name ? 1 : -1);

    // entries.forEach((r) => {
    //     // console.log(r.fields.name)
    //     if (r.fields.stage_topic_slug === 'ttc-surrogacy') {
    //         console.log(`${r.fields.name}, ${r.sys.id}, ${r.fields.stage_topic_slug}`)
    //     }
    // })
})()

