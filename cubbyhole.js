const Vivifyer = require('vivifyer')

class Latch {
    constructor () {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve
            this.reject = reject
        })
        this.unlatched = false
    }

    unlatch (value) {
        if (!this.unlatched) {
            this.unlatched = true
            if (value instanceof Error) {
                this.reject.call(null, value)
            } else {
                this.resolve.call(null, value)
            }
        }
    }
}

class Cubbyhole {
    constructor () {
        this._latches = new Vivifyer(() => new Latch)
        this._terminator = null
        this.destroyed = false
    }

    get latched () {
        const latched = []
        for (const key in this._latches.map) {
            if (!this._latches.map[key].unlatched) {
                latched.push(key)
            }
        }
        return latched
    }

    get keys () {
        return Object.keys(this._latches.map)
    }

    async get(key) {
        const latch = this._terminator || this._latches.get(key)
        return await latch.promise
    }

    set (key, value) {
        if (!this.destroyed) {
            this._latches.get(key).unlatch(value)
        }
    }

    remove (key) {
        delete this._latches.map[key]
    }

    destroy () {
        const value = arguments.length == 0 ? null : arguments[0]
        this.destroyed = true
        this._terminator = new Latch()
        this._terminator.unlatch(value)
        for (let key in this._latches.map) {
            this._latches.map[key].unlatch(value)
            delete this._latches.map[key]
        }
    }
}

module.exports = Cubbyhole
