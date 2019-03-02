Asynchronous cubbyholes used to wait for a future value by name.

```
var cubby = new Cubbyhole

cubby.get('3.0', function (error, value) {
    if (error) throw error
    assert.equal(value, 1)
    cubby.remove('3.0')
})


cubby.put('3.0', 1)
```
