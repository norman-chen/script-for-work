const contentful = require('contentful');
const contentfulMgr = require('contentful-management');

// write key
const key = 'CFPAT-ILaUO0N2TFy3ITjtBXYOJgiEPPS0GNSW8RLP2dhTcAA';
const production = {
    space      : '6m9bd13t776q',
    accessToken: 'd8e104fa7d1bbb143f36695ad78266603d729948013e79c44fa7f47c59c8ce7e'
};
const qa = {
    space      : '4xfyjz8unk0s',
    accessToken: '4273cfbf5ca81735b815a73ef3340fbee75577f699a8b83810751f1da5a33a4b'
};

// // client
const prodClient = contentful.createClient({
    space      : production.space,
    accessToken: production.accessToken
});
const qaClient = contentful.createClient({
    space      : qa.space,
    accessToken: qa.accessToken
});

const Client = prodClient;

// config
const contentType = 'stageTopic'

// main
;(async() => {
    const slugs = [
        'ttc-adoption',
        'ttc-surrogacy',
        'parenting-body-care',
        'parenting-penis-care',
        'parenting-head-hair',
        'parenting-rashes-skin-conditions',
        'parenting-baby-safety',
        'parenting-sun-safety',
        'parenting-safe-sleep',
        'parenting-sids',
        'parenting-cosleeping',
        'parenting-illness-cold-flu',
        'parenting-infections',
        'parenting-baby-poop',
        'parenting-constipation-diarrhea'
    ];

    for (let i = 0; i < slugs.length; i++) {
        const slug = slugs[i];

        const { items: entries } = await Client.getEntries({
            content_type                    : contentType,
            'fields.stage_topic_slug[match]': slug
        });

        // console.dir(entries[0], {depth: 9})
        // console.log(entries.length)

        console.log(`${slug}, ${entries.length}, ${entries.length && entries[0].sys.id}`);
    }


    // entries[0].fields.body_images = [];
    // entries[0].fields.body = 'body';
    // entries[0].fields.authors = [];
    // entries[0].fields.hero_image = {};
    // entries[0].fields.body_videos = []


    return;
    // entries = entries.sort((x, y) => x.fields.name > y.fields.name ? 1 : -1);

    // entries.forEach((r) => {
    //     // console.log(r.fields.name)
    //     if (r.fields.stage_topic_slug === 'ttc-surrogacy') {
    //         console.log(`${r.fields.name}, ${r.sys.id}, ${r.fields.stage_topic_slug}`)
    //     }
    // })
})();
