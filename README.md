Asynchronous cubbyholes used to wait for a future value by name.

```
const cubby = new Cubbyhole

async main () {
    const value = await cubby.get('3.0')
    assert.equal(value, 1)
    cubby.remove('3.0')
}

main()

cubby.put('3.0', 1)
```
