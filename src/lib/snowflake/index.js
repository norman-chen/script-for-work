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
                    console.log(error)
                    return reject(error.message);
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
                                return reject(error.message);
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
        "username": "SVCPRDSFMYACCT".toUpperCase(),
        "password": "canner-MtfDEEk2VxA",
        "warehouse": "LOCAL_LOAD_WH"
    }})

    for (let i = 0; i < 15; i++) {
        const s = await snow.execute(`select accountId, STOREFRONTID, MARKETCODE, MEMBER, CITY, STATE,ACTUALDATE, MEASURETYPE, USERID from VTR.USERACTIVITY
        where MEASURETYPE = 'Reviewed' and storefrontid = '5f0335c9-5508-49b0-ac3e-a2220170b937' and year = 2019
        limit 1`)

        console.log(s)
    }

})()