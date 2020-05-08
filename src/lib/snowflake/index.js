const snowflakeSDK = require('snowflake-sdk');

class Snowflake {
    constructor({ options }) {
        this._options = options;
    }

    _getConnection() {
        return snowflakeSDK.createConnection(this._options);
    }

    _connect() {
        const connection = this._getConnection();

        return new Promise((resolve, reject) => {
            connection.connect((error) => {
                if (error) {
                    return reject(new ConnectSnowflakeError(error.message));
                }

                resolve(connection);
            });
        });
    }

    execute(sql) {
        return this._connect()
            .then(function(connection) {
                return new Promise((resolve, reject) => {
                    connection.execute({
                        sqlText : sql,
                        complete: function(error, stmt, rows) {
                            connection.destroy();

                            if (error) {
                                return reject(new QuerySnowflakeError(error.message));
                            }

                            resolve(rows);
                        }
                    });
                });
            });
    }

    static get errors() {
        return {
            ConnectSnowflakeError,
            QuerySnowflakeError
        };
    }
}

;(async () => {
    const snow = new Snowflake({options: {
        "account": "xo",
        "username": "svcprdsfmyacct",
        "password": "YVUZmMva7t_m",
        "warehouse": "LOCAL_LOAD_WH"
    }})

    const s = await snow.execute(`select accountId, STOREFRONTID, MARKETCODE, MEMBER, CITY, STATE,ACTUALDATE, MEASURETYPE, USERID from VTR.USERACTIVITY
    where MEASURETYPE = 'Reviewed' and storefrontid = '5f0335c9-5508-49b0-ac3e-a2220170b937' and year = 2019
    limit 100`)

    console.log(s)
})()