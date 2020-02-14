const JWT = require('jsonwebtoken');

// This is the data we will pass to every client(application) that need to call our endpoints.
const client = {
    id         : 'ee49b84a-397c-4505-9616-d7693b6c1124',
    apikey     : '894b79048c13448e8240d2e55ce33337',
    application: 'Global Platform',
    description: 'production',
    secret     : '8715368fa255451f965506195b0aec80',
    timestamp  : {
        updatedAt: '2020-02-13T06:15:45.360Z',
        createdAt: '2020-02-13T06:15:45.360Z'
    }
};

// This is the token payload we accepted
const iat = Math.floor(new Date().getTime() / 1000); // 1530620015
const exp = Math.floor(new Date(2148, 10, 1).getTime() / 1000); // 2487772800
const tokenPayload = {
  "iss": client.application, // Your application information
  "iat": iat, // Timestamp that token has been generated
  "exp": exp, // Expiration date that token will be expired
  "aud": "theknotpro.com", // your website domain
  "sub": "v1 security", // no need to change
  "clientId": client.id // Your client id that we have passed related client information
};

const token = JWT.sign(tokenPayload, client.secret, {
    algorithm: 'HS256'
});

console.log(`token: ${token}`)
console.log(`apikey: ${client.apikey}`)