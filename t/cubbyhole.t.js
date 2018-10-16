require('proof')(3, prove)

function prove (assert) {
    var Cubbyhole = require('../cubbyhole')
    var cubbyhole = new Cubbyhole
    cubbyhole.wait('x', function (error, result) {
        assert(error, null, 'no error')
        assert(result, 1, 'result')
        assert(cubbyhole.keys(), [ 'x' ], 'keys')
        cubbyhole.remove('x')
    })
    cubbyhole.set('x', null, 1)
}
