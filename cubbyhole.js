var Vivifyer = require('vivifyer')
var Signal = require('signal')

function Cubbyhole () {
    this._signals = new Vivifyer(function () { return new Signal })
}

Cubbyhole.prototype.keys = function() {
    return Object.keys(this._signals.map)
}

Cubbyhole.prototype.wait = function (key, callback) {
    this._signals.get(key).wait(callback)
}

Cubbyhole.prototype.set = function (key) {
    var vargs = Array.prototype.slice.call(arguments, 1)
    var signal = this._signals.get(key)
    signal.unlatch.apply(signal, vargs)
}

Cubbyhole.prototype.remove = function (key) {
    delete this._signals.map[key]
}

module.exports = Cubbyhole
