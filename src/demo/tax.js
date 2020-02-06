const xoRequest = new (require('xo-request'))()
const JWT = require('jsonwebtoken')

const taxonomyIss = 'cIbIxkTTGdnLwfHTCjcRv0qsxh7WHJsa'
const taxonomyApi = 'https://api-qa.dataintel.xogrp.com/taxonomy/knot/vendor_categories'
const taxonomySecret = 'Vw46ZrIoB9aahl9JkvrPnunbahjJBhyC'

const jwtPayload = {
    iss: taxonomyIss,
    exp: parseInt(new Date().getTime() / 1000) + 3600
};
const token = JWT.sign(jwtPayload, taxonomySecret);

console.log(token)
;(async () => {
    const r = await xoRequest.get(taxonomyApi, {headers: {authorization: `Bearer ${token}`}})
        .then((response) => response.getBody().data, (error) => {

            console.log('-----------')
            console.log(error)

            throw new Error(error.getBody().message);
        });

        console.log('out')
})()
