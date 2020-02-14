const UUID = require('uuid')

const secret = UUID.v4().replace(/\-/g, '');
const apikey = UUID.v4().replace(/\-/g, '');

console.log({
    email    : `${apikey}@xogrp.com`,
    userType : 'APPLICATION',
    accountId: '00000000-0000-0000-0000-000000000000',
    secret   , // secret
    username : apikey, // apikey
    password : '',
    firstName: 'Global Platform', // iss,
    userId   : UUID.v4() // application id
})

// qa
// {
//     "email": "209fe6ce88194309b7a63e4a0f918283@xogrp.com",
//     "userType": "APPLICATION",
//     "accountId": "00000000-0000-0000-0000-000000000000",
//     "secret": "4555af51bbd44190b8c2cfbfa4758210",
//     "username": "209fe6ce88194309b7a63e4a0f918283",
//     "password": "",
//     "firstName": "Global Platform",
//     "userId": "bd245c12-8dbb-42b3-8b85-cdbffca4a6d7"
// }

// prod
// {
//     "email": "894b79048c13448e8240d2e55ce33337@xogrp.com",
//     "userType": "APPLICATION",
//     "accountId": "00000000-0000-0000-0000-000000000000",
//     "secret": "8715368fa255451f965506195b0aec80",
//     "username": "894b79048c13448e8240d2e55ce33337",
//     "password": "",
//     "firstName": "Global Platform",
//     "userId": "ee49b84a-397c-4505-9616-d7693b6c1124"
// }