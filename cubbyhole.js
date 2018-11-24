var Vivifyer = require('vivifyer')
var Signal = require('signal')

function Cubbyhole () {
    this._signals = new Vivifyer(function () { return new Signal })
    this._terminator = null
    this.destroyed = false
}

Cubbyhole.prototype.keys = function() {
    return Object.keys(this._signals.map)
}

Cubbyhole.prototype.get = function (key) {
    var signal = this._signals.map[key]
    if (signal != null && signal.open != null) {
        return signal.open.slice(1)
    }
    return null
}

Cubbyhole.prototype.wait = function (key, callback) {
    this._signals.get(key).wait(callback)
    if (this._terminator != null) {
        var signal = this._signals.get(key)
        signal.unlatch.apply(signal, this._terminator)
    }
}

Cubbyhole.prototype.set = function () {
    var vargs = []
    vargs.push.apply(vargs, arguments)
    var signal = this._signals.get(vargs.shift())
    signal.unlatch.apply(signal, vargs)
}

Cubbyhole.prototype.remove = function (key) {
    delete this._signals.map[key]
}

Cubbyhole.prototype.destroy = function () {
    this.destroyed = true
    this._terminator = []
    this._terminator.push.apply(this._terminator, arguments)
    for (var key in this._signals.map) {
        var signal = this._signals.map[key]
        signal.unlatch.apply(signal, this._terminator)
    }
}

module.exports = Cubbyhole
