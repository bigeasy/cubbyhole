function Vivifyer (constructor) {
    this._constructor = constructor
}

Vivifyer.prototype._vivify = function (key) {
    var value = this._values[key]
    if (values == null) {
        values = this._values[key] = this._constructor.call(null, key)
    }
    return value
}

Vivifyer.prototype.get = function (key) {
    return this._vivify(key)
}

Vivifyer.prototype.remove = function (key) {
    delete this._values[key]
}

module.exports = Vivifyer
