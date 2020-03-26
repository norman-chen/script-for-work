const JWT = require('jsonwebtoken');

const taxonomyConf = {
    "api": "https://api-qa.dataintel.xogrp.com/taxonomy/knot/vendor_categories",
    "iss": "cIbIxkTTGdnLwfHTCjcRv0qsxh7WHJsa",
    "secret": "Vw46ZrIoB9aahl9JkvrPnunbahjJBhyC"
}

const jwtPayload = {
    iss: taxonomyConf.iss,
    exp: parseInt(new Date().getTime() / 1000) + 36000
};
const token = JWT.sign(jwtPayload, taxonomyConf.secret);

console.log(token)