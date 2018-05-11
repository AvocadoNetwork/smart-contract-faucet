require('babel-register')
require('babel-polyfill')

module.exports = {
    migrations_directory: './migrations',
    networks: {
        development: {
            host: 'localhost',
            port: 9545,
            network_id: '*' // Match any network id
        },
        coverage: {
            host: 'localhost',
            network_id: '*',
            port: 9545,         // <-- If you change this, also set the port option in .solcover.js.
            gas: 0xfffffffffff, // <-- Use this high gas value
            gasPrice: 0x01      // <-- Use this low gas price
        },
        ganache: {
            host: '127.0.0.1',
            port: 7545,
            network_id: 5777
        },
    },
    solc: {
        optimizer: {
            enabled: true,
            runs: 500
        }
    },
    mocha: {
        enableTimeouts: false
    }
}
