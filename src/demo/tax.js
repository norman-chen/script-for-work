const xoRequest = new (require('xo-request'))()
const JWT = require('jsonwebtoken')

const taxonomyIss = 'cIbIxkTTGdnLwfHTCjcRv0qsxh7WHJsa'
const taxonomyApi = 'https://api-qa.dataintel.xogrp.com/taxonomy/knot/vendor_categories'
const taxonomySecret = 'Vw46ZrIoB9aahl9JkvrPnunbahjJBhyC'

const jwtPayload = {
    iss: taxonomyIss,
    exp: parseInt(new Date().getTime() / 1000) + 36000
};
const token = JWT.sign(jwtPayload, taxonomySecret);

console.log(token)
;(async () => {
    // const r = await xoRequest.get(taxonomyApi, {headers: {authorization: `Bearer ${token}`}})
    //     .then((response) => response.getBody().data, (error) => {

    //         console.log('-----------')
    //         console.log(error)

    //         throw new Error(error.getBody().message);
    //     });

    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1ODA5ODA2OTUsImV4cCI6MTU4MTA2NzA5NSwidXNlcklkIjoiMDYxODYwYmYtNmRiOS00NGUyLTkzYjctYWU3Y2ZjMjdlMGE5Iiwic2Vzc2lvbklkIjoiNWZkNWFiZDMtNWQ0Zi00NGMxLTk2YzAtYTExOTE5ZjcxMzUzIiwiYXBwbGljYXRpb25zIjpbInNlcnZpY2UtY29udmVyc2F0aW9uLWFwaSJdLCJ0b2tlbklkIjoiYThlYTViN2EtODJlNy00YzEzLThiZWQtMmFkMGU4ZWI0NGQ2IiwicmVxdWVzdFVzZXJJZCI6IjA2MTg2MGJmLTZkYjktNDRlMi05M2I3LWFlN2NmYzI3ZTBhOSIsImlkIjpbXSwiYWNjb3VudElkIjoiMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwIiwiaXNzIjoiVGhlIEtub3QgUHJvIFFBIiwiYXVkIjoicWEudGhla25vdHByby5jb20iLCJzdWIiOiJ2MSBzZWN1cml0eSIsInNjb3BlIjpbIlN1cGVyQWRtaW4iXX0.npRhUceinQ2RoYS7Gw2wSlJ6maA9_rC_fD-pgtIfCBA'

    // const r = await xoRequest.get('localhost/storefronts/5865d5d4-32eb-41d5-87bf-a38700f78f54/details/search-filters',
    //  {headers: {authorization: `Bearer ${token}`}})
    //     .then((response) => response.getBody().data, (error) => {

    //         console.log('-----------')
    //         console.log(error)

    //         throw new Error(error.getBody().message);
    //     });
    console.log('out')
})()
