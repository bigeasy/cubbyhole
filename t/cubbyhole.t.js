require('proof')(1, prove)

function prove (assert) {
    var Cubbyhole = require('../cubbyhole')
    assert(Cubbyhole, 'require')
}
