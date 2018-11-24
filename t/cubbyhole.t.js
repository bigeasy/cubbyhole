require('proof')(7, prove)

function prove (okay) {
    var Cubbyhole = require('../cubbyhole')
    var cubbyhole = new Cubbyhole
    cubbyhole.wait('x', function (error, result) {
        okay(cubbyhole.get('x'), [ 1 ], 'get')
        okay(error, null, 'no error')
        okay(result, 1, 'result')
        okay(cubbyhole.keys(), [ 'x' ], 'keys')
        cubbyhole.remove('x')
    })
    okay(cubbyhole.get('x'), null, 'get missing')
    cubbyhole.set('x', null, 1)
    cubbyhole.wait('y', function (error) {
        okay(error.message, 'destroyed', 'destroy')
    })
    cubbyhole.destroy(new Error('destroyed'))
    cubbyhole.wait('y', function (error) {
        okay(error.message, 'destroyed', 'destroyed')
    })
}
