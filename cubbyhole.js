var Vivifyer = require('vivifyer')
var Signal = require('signal')

function Cubbyhole () {
    this._signals = {}
}

Cubbyhole.prototype._vivify = function (key) {
    var signal = this._signals[key]
    if (signal == null) {
        signal = this._signals[key] = new Signal
    }
    return signal
}

Cubbyhole.prototype.get = function (key, callback) {
    this._vivify(key).wait(callback)
}

Cubbyhole.prototype.set = function (key) {
    var vargs = Array.prototype.slice.call(arguments, 1)
    var signal = this._vivify(key)
    signal.unlatch.apply(signal, vargs)
}

Cubbyhole.prototype.remove = function (key) {
    delete this._signals[key]
}

module.exports = Cubbyhole
