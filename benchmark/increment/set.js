var Cubbyhole = require('../../cubbyhole')
var Cubbyhole_ = require('../../_cubbyhole')
var Benchmark = require('benchmark')

var suite = new Benchmark.Suite('call')

function body () { return 1 }

function fn () {
    var cubbyhole = new Cubbyhole
    return function () {
        cubbyhole.set('key', 1)
    }
}

function fn_ () {
    var cubbyhole = new Cubbyhole_
    return function () {
        cubbyhole.set('key', 1)
    }
}

for (var i = 1; i <= 4; i++)  {
    suite.add({
        name: ' cubbyhole set ' + i,
        fn: fn()
    })

    suite.add({
        name: '_cubbyhole set ' + i,
        fn: fn_()
    })
}

suite.on('cycle', function(event) {
    console.log(String(event.target));
})

suite.on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
})

suite.run()
