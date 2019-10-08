require('proof')(13, async (okay) => {
    const Cubbyhole = require('..')
    {
        const cubbyhole = new Cubbyhole
        cubbyhole.destroy()
        okay('constructed')
    }
    {
        const cubbyhole = new Cubbyhole
        const got = cubbyhole.get('x')
        cubbyhole.set('x', 1)
        okay({
            got: await got,
            keys: cubbyhole.keys
        }, {
            got: 1,
            keys: [ 'x' ]
        }, 'get a value')
    }
    {
        const cubbyhole = new Cubbyhole
        cubbyhole.set('x', 1)
        okay(cubbyhole.keys, [ 'x' ], 'keys before remove')
        cubbyhole.remove('x')
        okay(cubbyhole.keys, [], 'keys after removed')
    }
    {
        const test = []
        const cubbyhole = new Cubbyhole
        cubbyhole.set('x', new Error('reject'))
        try {
            await cubbyhole.get('x')
        } catch (error) {
            test.push(error.message)
        }
        okay(test, [ 'reject' ], 'rejected')
    }
    {
        const cubbyhole = new Cubbyhole
        cubbyhole.set('x', 1)
        okay(cubbyhole.keys, [ 'x' ], 'keys before destroyed')
        const promise = cubbyhole.get('y')
        okay(cubbyhole.latched, [ 'y' ], 'latched before destroyed')
        cubbyhole.destroy(2)
        cubbyhole.set('x', 1)
        okay(cubbyhole.latched, [], 'latched after destroyed')
        okay(cubbyhole.keys, [], 'keys after destroyed')
        okay(await promise, 2, 'get when destroyed resolves to destruction value')
        okay(await cubbyhole.get('z'), 2, 'get after destroyed resolve to destruction value')
    }
    {
        const cubbyhole = new Cubbyhole
        cubbyhole.destroy(new Error)
        okay('reject cancel when no one awaits the terminal error')
    }
    {
        const cubbyhole = new Cubbyhole
        cubbyhole.set('x', new Error)
        okay('reject a key when no one awaits the error')
    }
})
