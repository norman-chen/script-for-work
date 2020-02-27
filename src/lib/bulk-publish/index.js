const rp = require('request-promise');

const constants = {
    // sfUri : 'https://qa-storefront-api.localsolutions.theknot.com',
    // token : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJNeUFjY291bnQgQWRtaW4gQXBwbGljYXRpb24iLCJpYXQiOjE0OTk0MTc4MDEsImV4cCI6NDY1NTA5MDkxNywiYXVkIjoicWEucGFydG5lcnNhZG1pbi50aGVrbm90LmNvbSIsInN1YiI6InYxIHNlY3VyaXR5IiwiY2xpZW50SWQiOiI5ZDlkM2ZjMy03OWUxLTRiYTUtYjE2Ny01ZjA1ODE5NmYxZjUifQ.BK5-8gkpUK9zOosfLRFzNj54r9LdvbbvoUypd3yc44M',
    // apikey: '2f40b70d252548e79f5b62cda387c8e0'

    sfUri : 'https://prod-storefront-api.localsolutions.theknot.com',
    token : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJNeUFjY291bnQgQWRtaW4gQXBwbGljYXRpb24iLCJpYXQiOjE0OTk0MTc4MDEsImV4cCI6NDY1NTA5MDkxNywiYXVkIjoiaHR0cDovL3BhcnRuZXJzYWRtaW4udGhla25vdC5jb20iLCJzdWIiOiJ2MSBzZWN1cml0eSIsImNsaWVudElkIjoiNTQ5MTUzM2ItNTI2Ny00NzhmLThlOWItNTNkNzUyYWQ5ZTRhIn0.jF218AKdaS8q3gFa_ixn5KZA0wht9xgzR-MVNdeizqY',
    apikey: '2c3e706eec474381a58aef482a5cff68'
};

const storefrontIds = [
    '6b9cefc6-8f1d-4320-b83a-a33d00a082ca',
    '2ed81d50-245d-41e9-ae18-a1b2010b503f',
    '44db4df4-50a9-4f18-a5e7-a1ad000ec84d',
    '5809363e-9cb9-4e18-aa21-a1ac00ce8b3b',
    'bc56df51-5bb9-4b9f-960b-33e83b20c334',
    '90c119eb-be70-454a-9b79-a1b2013f12b2',
    '9a505ed5-118e-46a0-a861-a1ad01780ff5',
    'aa795d42-5671-497f-8ddd-a1b90112bd5f',
    'f435faa5-2c92-4018-a32e-a1800145d0b9',
    'a22fdb45-fc1d-42d9-90f8-a1a800538c56',
    '9f269cc5-1633-4dc6-8415-a1b900fd7064',
    '62013d60-01ea-4240-96a6-a18500f435e8',
    '0d775ffe-0add-4c4a-8d4a-a1b701854d6a',
    'c71511d5-c2f7-4926-ba72-a1b70132f1b6',
    '872dc1ac-4298-4f16-aff6-a662ff9e6233',
    'ba8665d8-1c10-464c-8422-a1b700db59db',
    'dc57c92f-5942-4240-a458-a1ad00aa6117',
    'da4dee0a-65f6-567b-ba50-d7b7f4e06205',
    'd44534ba-d6a6-4311-9aea-7980ab8117cc',
    '150bc6f3-94f1-48d9-b7a0-a1b2013ccfdb',
    'd528d8d8-0a06-4875-b2f8-a1bb0004540e',
    'e614159e-1f31-49c3-9ba6-a1aa00fdd500',
    'ed109c0d-f9e1-4d0d-9755-a1ac014342dc',
    'cf522812-369e-4b5e-9bad-a1bc0025cff9',
    '1ab8bdc3-e573-4002-b7d6-a1ba01606718',
    'd2d864b9-9528-4b5f-9904-e86e3ec6c793'
]

;(async() => {
    await rp({
        method : 'POST',
        uri    : `${constants.sfUri}/storefronts/bulk-publish?apikey=${constants.apikey}`,
        headers: {
            authorization: `Bearer ${constants.token}`
        },
        body: {
            storefrontIds,
            sections: ['detail']
        },
        json: true
    });
})();
