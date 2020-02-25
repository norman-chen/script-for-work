const XoDs = require('xo-ds-handler');
const xoDs = new XoDs();

const config = {
    xoDsConfig: {
        "read-store": {
            // "admin": {
            //     "host": "https://search-xo-local-partners-qa-wb6kullmuwb25jie2d735peq6i.us-east-1.es.amazonaws.com"
            // }

            "admin": {
                "host": "https://search-xo-local-partners-prod-ap25bstxjtk5xaxpvu3jxmajh4.us-east-1.es.amazonaws.com"
            }
        }
    },
    DB: 'storefront'
};

xoDs.config(config.xoDsConfig);


;(async () => {
    // salesProfiles

    const a = await xoDs.es.api(
        'admin',
        'search',
        {
            index: 'admin',
            type : 'profiles',
            body: {
                query: {
                    bool: {
                        must_not: {
                            exists: {
                                field: 'salesProfiles'
                            }
                        }
                    }
                }
            },
            _source: ['salesProfiles'],
            size: 100
        }
    );

    const storefrontIds = []
    a.hits.hits.forEach(hh => {
        // console.log(hh._id)
        hh._id.length === 36 && storefrontIds.push(hh._id)
    });

    // console.log(a.hits.total)
    console.dir(storefrontIds, {depth: 9})

    return
    for (let i = 0; i < storefrontIds.length; i++) {
        const id = storefrontIds[i];

        await xoDs.es.api(
            'admin',
            'delete',
            {
                index: 'admin',
                type : 'profiles',
                id,
            }
        );
    }
})()