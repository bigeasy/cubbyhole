const assert = require('assert')

// Map that generates an entry if missing.
const Future = require('perhaps')
const Vivifyer = require('vivifyer')

//
class Cubbyhole {
    // Construct an empty `Cubbyhole`.
    constructor () {
        this._futures = new Vivifyer(() => new Future)
        this._terminator = null
        // When true, the `Cubbyhole` has been destroyed and all keys will
        // resolve with an error.
        this.destroyed = false
    }

    // An array of all the unfulfilled entries in the `Cubbyhole`.
    get unfulfilled () {
        const unfulfilled = []
        for (const key in this._futures.map) {
            if (! this._futures.map[key].fulfilled) {
                unfulfilled.push(key)
            }
        }
        return unfulfilled
    }

    // An array of all the keys in the `Cubbyhole`.
    get keys () {
        return Object.keys(this._futures.map)
    }

    // Get the value for the given `key` in the `Cubbyhole`. Returns a promise
    // that resolves to the value or rejects if the value is rejected.
    get(key) {
        const future = this._terminator || this._futures.get(key)
        return future.promise
    }

    // **TODO** Maybe we explicitly name this `resolve` and have a separate
    // explicit `reject`. Would make `destroy` require a separate definition,
    // `destroyAllResolve` or `destroyAllReject()`.
    // Set the value of the `key` to the given `value`.
    resolve (key, ...vargs) {
        if (! this.destroyed) {
            const future = this._futures.get(key)
            future.resolve.apply(future, vargs)
        }
    }

    reject (key, error) {
        if (! this.destroyed) {
            this._futures.get(key).reject(error)
        }
    }

    // Remove the entry for the given `key` from the `Cubbyhole`.
    remove (key) {
        delete this._futures.map[key]
    }

    // Destroy the `Cubbyhole`.  If the given `value` is an `Error`, reject the
    // outstanding and future keys with the `Error`, otherwise resolve the
    // outstanding and future keys with the `value`. If no `value` is given the
    // outstanding and future keys are resolved with `null`.
    destroy (future = Future.resolve()) {
        assert(future.fulfilled)
        this.destroyed = true
        this._terminator = future
        for (const key in this._futures.map) {
            if (future.rejection == null) {
                this._futures.map[key].resolve.apply(this._futures.map[key], future.resolution)
            } else {
                this._futures.map[key].reject(future.rejection)
            }
        }
    }
}

// Export the `Cubbyhole`.
module.exports = Cubbyhole
