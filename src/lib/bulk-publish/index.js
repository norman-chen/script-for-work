const rp = require('request-promise');

const constants = {
    sfUri : 'https://qa-storefront-api.localsolutions.theknot.com',
    token : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJNeUFjY291bnQgQWRtaW4gQXBwbGljYXRpb24iLCJpYXQiOjE0OTk0MTc4MDEsImV4cCI6NDY1NTA5MDkxNywiYXVkIjoicWEucGFydG5lcnNhZG1pbi50aGVrbm90LmNvbSIsInN1YiI6InYxIHNlY3VyaXR5IiwiY2xpZW50SWQiOiI5ZDlkM2ZjMy03OWUxLTRiYTUtYjE2Ny01ZjA1ODE5NmYxZjUifQ.BK5-8gkpUK9zOosfLRFzNj54r9LdvbbvoUypd3yc44M',
    apikey: '2f40b70d252548e79f5b62cda387c8e0'

    // sfUri        : 'https://prod-storefront-api.localsolutions.theknot.com',
    // token        : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJNeUFjY291bnQgQWRtaW4gQXBwbGljYXRpb24iLCJpYXQiOjE0OTk0MTc4MDEsImV4cCI6NDY1NTA5MDkxNywiYXVkIjoiaHR0cDovL3BhcnRuZXJzYWRtaW4udGhla25vdC5jb20iLCJzdWIiOiJ2MSBzZWN1cml0eSIsImNsaWVudElkIjoiNTQ5MTUzM2ItNTI2Ny00NzhmLThlOWItNTNkNzUyYWQ5ZTRhIn0.jF218AKdaS8q3gFa_ixn5KZA0wht9xgzR-MVNdeizqY',
    // apikey       : '2c3e706eec474381a58aef482a5cff68',
};

const storefrontIds = [

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
