// Map that generates an entry if missing.
const Vivifyer = require('vivifyer')

// An implementation of a future. Not using `prospective/future` because I need
// to swallow any rejections and `prospective/future` doesn't do that. We want
// the user to be able to `get` a value from the `Cubbyhole` at their leisure.
// We do not want to obligate them to handle rejections for all the possible
// keys in the `Cubbyhole`.

//
class Latch {
    // Construct a `Latch`. Ensure that we'll not raise an unhandled rejection
    // if no one is currently waiting on the latch.
    constructor () {
        // Mark as currently unlatched.
        this.unlatched = false
        // Advertise a `Promise` that contains the value of the `Latch`.
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve
            this.reject = reject
        })
        // Ensure that there are no unhandled rejections.
        this.promise.catch(() => {})
    }

    // Unlatch the `Latch` with the given value. If the `value` is an `Error`,
    // reject the promise with the `Error`, otherwise resolve the `Promise` with
    // the `value`.
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
    // Construct an empty `Cubbyhole`.
    constructor () {
        this._latches = new Vivifyer(() => new Latch)
        this._terminator = null
        // When true, the `Cubbyhole` has been destroyed and all keys will
        // resolve with an error.
        this.destroyed = false
    }

    // **TODO** Maybe rename to `unresolved`.
    // An array of all the unresolved entries in the `Cubbyhole`.
    get latched () {
        const latched = []
        for (const key in this._latches.map) {
            if (!this._latches.map[key].unlatched) {
                latched.push(key)
            }
        }
        return latched
    }

    // An array of all the keys in the `Cubbyhole`.
    get keys () {
        return Object.keys(this._latches.map)
    }

    // Get the value for the given `key` in the `Cubbyhole`. Returns a promise
    // that resolves to the value or rejects if the value is rejected.
    async get(key) {
        const latch = this._terminator || this._latches.get(key)
        return await latch.promise
    }

    // **TODO** Maybe we explicitly name this `resolve` and have a separate
    // explicit `reject`. Would make `destroy` require a separate definition,
    // `destroyAllResolve` or `destroyAllReject()`.
    // Set the value of the `key` to the given `value`.
    set (key, value) {
        if (!this.destroyed) {
            this._latches.get(key).unlatch(value)
        }
    }

    // Remove the entry for the given `key` from the `Cubbyhole`.
    remove (key) {
        delete this._latches.map[key]
    }

    // Destroy the `Cubbyhole`.  If the given `value` is an `Error`, reject the
    // outstanding and future keys with the `Error`, otherwise resolve the
    // outstanding and future keys with the `value`. If no `value` is given the
    // outstanding and future keys are resolved with `null`.
    destroy () {
        const value = arguments.length == 0 ? null : arguments[0]
        this.destroyed = true
        this._terminator = new Latch()
        this._terminator.unlatch(value)
        for (const key in this._latches.map) {
            this._latches.map[key].unlatch(value)
            delete this._latches.map[key]
        }
    }
}

// Export the `Cubbyhole`.
module.exports = Cubbyhole
