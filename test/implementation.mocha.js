'use strict';

const XoTestHelper = require('xo-test-helper');
const xoTH         = new XoTestHelper();
let server;

describe('INSTANCE ', function() {
    before(function() {
        server = new xoTH.server({
            pluginPath : __dirname + '/..',
            stubsPath  : __dirname + '/stubs',
            useStubs   : true,
            optionsPath: __dirname + '/mocks/options'
        });

        return server.start();
    });

    after(function() {
        return server.stop();
    });

    it('should respond with a text "hey" on route /plugin/say-hey', function() {
        return server.inject({
            method: 'GET',
            url   : '/plugin/say-hey'
        }).then(function(response) {
            (response.statusCode).should.equal(200);
            (response.result).should.have.property('text').which.equals('hey');
            (response.result).should.have.property('event');
        });
    });
});
