describe('cubbyhole', async () => {
    const Cubbyhole = require('..')
    const assert = require('assert')
    it('can be constructed', () => {
        const cubbyhole = new Cubbyhole
        cubbyhole.destroy()
    })
    it('can get a value', async () => {
        const cubbyhole = new Cubbyhole
        const got = cubbyhole.get('x')
        cubbyhole.set('x', 1)
        assert.equal(await got, 1, 'got')
        assert.deepStrictEqual(cubbyhole.keys, [ 'x' ], 'keys')
    })
    it('can remove a key', async () => {
        const cubbyhole = new Cubbyhole
        cubbyhole.set('x', 1)
        assert.deepStrictEqual(cubbyhole.keys, [ 'x' ], 'keys')
        cubbyhole.remove('x')
        assert.deepStrictEqual(cubbyhole.keys, [], 'removed')
    })
    it('can reject', async () => {
        const test = []
        const cubbyhole = new Cubbyhole
        cubbyhole.set('x', new Error('reject'))
        try {
            await cubbyhole.get('x')
        } catch (error) {
            test.push(error.message)
        }
        assert.deepStrictEqual(test, [ 'reject' ], 'rejected')
    })
    it('can be destroyed', async () => {
        const cubbyhole = new Cubbyhole
        cubbyhole.set('x', 1)
        assert.deepStrictEqual(cubbyhole.keys, [ 'x' ], 'keys')
        const promise = cubbyhole.get('y')
        assert.deepStrictEqual(cubbyhole.latched, [ 'y' ], 'latched')
        cubbyhole.destroy(2)
        cubbyhole.set('x', 1)
        assert.deepStrictEqual(cubbyhole.latched, [], 'unlatched')
        assert.deepStrictEqual(cubbyhole.keys, [], 'removed')
        assert.equal(await promise, 2, 'destroyed get')
        assert.equal(await cubbyhole.get('z'), 2, 'get after destroyed')
    })
    it('can reject cancel when no one awaits the terminal error', () => {
        const cubbyhole = new Cubbyhole
        cubbyhole.destroy(new Error)
    })
})
