require('proof')(3, prove)

function prove (okay) {
    var Cubbyhole = require('../cubbyhole')
    var cubbyhole = new Cubbyhole
    cubbyhole.wait('x', function (error, result) {
        okay(error, null, 'no error')
        okay(result, 1, 'result')
        okay(cubbyhole.keys(), [ 'x' ], 'keys')
        cubbyhole.remove('x')
    })
    cubbyhole.set('x', null, 1)
}
