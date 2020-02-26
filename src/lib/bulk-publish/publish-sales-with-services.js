/// DB
/// DB
/// DB
const XoDs = require('xo-ds-handler');
const xoDs = new XoDs();
const xoReq = new(require('xo-request'))();

const config = {
    xoDsConfig: {
        // NEED CHANGED
        // 'write-store': {
        //     storefront: 'postgres://localservices:!q2w3e4r5t6y7@storefronts-pg-qa.cfjnafc8bsrz.us-east-1.rds.amazonaws.com/storefront'
        // }
        // NEED CHANGED
        'write-store': {
            storefront: 'postgres://localservices:XvkTraVU94enXcud@storefronts-pg-prod.cfjnafc8bsrz.us-east-1.rds.amazonaws.com/storefront'
        }
    },
    DB: 'storefront'
};

xoDs.config(config.xoDsConfig);

// NEED CHANGED
// const requestInfo = {
//     url   : 'https://qa-sales-api.localsolutions.theknot.com',
//     token : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJNeUFjY291bnQgQWRtaW4gQXBwbGljYXRpb24iLCJpYXQiOjE0OTk0MTc4MDEsImV4cCI6NDY1NTA5MDkxNywiYXVkIjoicWEucGFydG5lcnNhZG1pbi50aGVrbm90LmNvbSIsInN1YiI6InYxIHNlY3VyaXR5IiwiY2xpZW50SWQiOiI5ZDlkM2ZjMy03OWUxLTRiYTUtYjE2Ny01ZjA1ODE5NmYxZjUifQ.BK5-8gkpUK9zOosfLRFzNj54r9LdvbbvoUypd3yc44M',
//     apikey: '2f40b70d252548e79f5b62cda387c8e0'
// };

// NEED CHANGED
const requestInfo = {
    url   : 'https://prod-sales-api.localsolutions.theknot.com',
    token : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJNeUFjY291bnQgQWRtaW4gQXBwbGljYXRpb24iLCJpYXQiOjE0OTk0MTc4MDEsImV4cCI6NDY1NTA5MDkxNywiYXVkIjoiaHR0cDovL3BhcnRuZXJzYWRtaW4udGhla25vdC5jb20iLCJzdWIiOiJ2MSBzZWN1cml0eSIsImNsaWVudElkIjoiNTQ5MTUzM2ItNTI2Ny00NzhmLThlOWItNTNkNzUyYWQ5ZTRhIn0.jF218AKdaS8q3gFa_ixn5KZA0wht9xgzR-MVNdeizqY',
    apikey: '2c3e706eec474381a58aef482a5cff68'
};

const storefrontIds = [
    '1a0aa9ee-44d1-4d7f-abc9-f283f6230e8b',
    '9bd40378-d9c0-4314-a084-0d5de4bbc4c4',
    '6ae0de47-21c9-4e7d-8bfa-ef4f494bfddf',
    '616bae78-13c0-4dac-99a8-a1ba00e72b92',
    '56f3240f-6cf4-4d6c-a0ea-a3b20001a143',
    '2f0e21b1-b74f-4ab0-b976-a3aa00fad917',
    'a4368b9d-fa69-4abc-bd10-a3b500fba979',
    'f18c69b7-fe4b-4ca3-96c4-a3b20001a102',
    'f27d3458-4c19-442e-95e8-2625d363cb0d',
    '4d402da8-5cb3-45e4-9557-a3b200019fbf',
    '5256d9a1-8c93-4329-b5a7-2cc86a90f692',
    '81915674-a557-4e27-8d70-4d55432cbfc5',
    '23bb39ec-0fbb-4248-842f-a3aa00fad991',
    'b036e940-7f3c-45b2-9c84-a3b20001a0ae',
    '4a082387-625d-4901-93b8-a3b500fba941',
    'f93496b6-6ef9-4796-8cc2-a1ba016107f2',
    '68622124-6e62-4979-a7a9-a40f059c3011',
    'a4a81af7-240d-4e0d-88f7-ce21d2765a7f',
    '247dd5d3-e622-4216-ab76-a1a8003e090d',
    '3f33d1c1-65e5-41ab-bd18-a1b900e64543',
    'eb94c08d-b1bf-4b43-a4f4-5a56e6e45cc1',
    'af7f367b-a4bd-4c83-8969-00c4383cef4b',
    '863b763c-f16d-4446-b8ad-61d009628748',
    '43071153-357d-4885-90be-a3aa00fae1a1',
    'd04135f3-674d-43d5-851e-a3b500fba8fb',
    '841c1586-2c2a-4d41-b915-a3aa00fae1d0',
    'ee980083-8c83-433f-b6cb-a1b900d90914',
    'e5c5a293-3c8e-4369-a123-a33f013266d0',
    '54b2667e-e3b4-434c-9723-a2e0f54c6913',
    '57e291d1-a44f-47b5-b619-a3b500fba8ab',
    '8aab53eb-db93-451f-9833-a3b20001a07a',
    '3779dbd5-8db2-4447-b7c8-92e981b3d4a4',
    'b521699e-7bf6-4c9f-9e0f-a3b500fba849'
];

;(async() => {
    const sql = `select
        data->>'id' as id,
        data->>'storefrontId' as sfid,
        data->'services' as srv,
        data->'accountId' as accid
    from sales_profiles
    where data->>'storefrontId' in (${storefrontIds.map((id) => `'${id}'`).join(',')})
    `;

    const sales = await xoDs.pg.execute('storefront', sql);

    for (let i = 0; i < sales.length; i++) {
        const sa = sales[i];

        const { url, apikey, token } = requestInfo;
        const options = {
            payload: {
                services : sa.srv,
                accountId: sa.accid
            },
            headers: {
                Authorization: token
            }
        };

        return xoReq.put(`${url}/sales/${sa.id}?apikey=${apikey}`, options)
            .catch((error) => {
                console.log(sa.storefrontId);
                console.log('error: ', error);
            });
    }
})();
