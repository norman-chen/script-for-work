const targetListPROD = [
    // {
    //     oldTopic: 'c1qZumRx6gOUkmC4I8eMw',
    //     newTopic: '',
    //     name    : 'ttc-adoption'
    // },
    // {
    //     oldTopic: '2TWXoSZNOMkyCocQUoiKO6',
    //     newTopic: '',
    //     name    : 'ttc-surrogacy'
    // },

    {
        oldTopic: '324Ztwd6Kk8Eyimk2WSwGO',
        newTopic: '6B5uOwOcZGk0S2yEeG2iQg',
        name    : 'parenting-penis-care'
    },
    {
        oldTopic: '2gnSgckaGoooc0oWYS6eWm',
        newTopic: '6B5uOwOcZGk0S2yEeG2iQg',
        name    : 'parenting-head-hair'
    },
    {
        oldTopic: '2x7mhrjRxCuCIuoYcww4qC',
        newTopic: '6B5uOwOcZGk0S2yEeG2iQg',
        name    : 'parenting-rashes-skin-conditions'
    },

    {
        oldTopic: 'dWHt654LLiAKUgKm2wSKa',
        newTopic: '4fge0yWregqWMIaGysIoWS',
        name    : 'parenting-sun-safety'
    },

    // {
    //     oldTopic: '4HusAMxvDy8aqC482U8IYY',
    //     newTopic: '',
    //     name    : 'parenting-sids'
    // },
    // {
    //     oldTopic: 'xQ3nHSKPe0wooSau8AMGK',
    //     newTopic: '',
    //     name    : 'parenting-cosleeping'
    // },

    {
        oldTopic: '5a3hfp3CrmowC0yGGuocY4',
        newTopic: '3DJBwwCaooUkaesgk8OwkO',
        name    : 'parenting-infections'
    },

    {
        oldTopic: '2y7iuSrFheMgAqWCIsEkI6',
        newTopic: '5DfUCW5gGsWOsc8q6aSWY8',
        name    : 'parenting-constipation-diarrhea'
    }
];

let targetListQA = [
    // {
    //     oldTopic: '4U9ndR0LMISiOkU4OSaICS',
    //     newTopic: ''
    // },
    // {
    //     oldTopic: '5JW7sYySkgGq4WIIg2IsOo',
    //     newTopic: ''
    // },

    {
        oldTopic: '61iE6kUuD6GQcOKoiMw00s',
        newTopic: '2Yf9Cv4njiIwukuSiG0moC'
    },
    {
        oldTopic: '3MiQyDrqPei6U2ggm68eI6',
        newTopic: '2Yf9Cv4njiIwukuSiG0moC'
    },
    {
        oldTopic: '2q4gLvts2AO4cMsQAE8OGE',
        newTopic: '2Yf9Cv4njiIwukuSiG0moC'
    },

    {
        oldTopic: '6oTwWtzqRG6eo8mA88yEQs',
        newTopic: '4fge0yWregqWMIaGysIoWS'
    },

    // {
    //     oldTopic: '4HusAMxvDy8aqC482U8IYY',
    //     newTopic: ''
    // },
    // {
    //     oldTopic: 'xQ3nHSKPe0wooSau8AMGK',
    //     newTopic: ''
    // },

    {
        oldTopic: '11zUdCIs6oUqcYOmkYeicw',
        newTopic: 'ennyiRH1FmsmaWIcmqsmG'
    },

    {
        oldTopic: 'dtWY2HlkOcy8As6m0MY0m',
        newTopic: '205igcxJYswwekOaO0CciK'
    }
]

targetListQA = targetListQA.map((item, index) => ({
    ...item,
    name: targetListPROD[index].name
}));

module.exports = {
    targetListPROD,
    targetListQA
};
