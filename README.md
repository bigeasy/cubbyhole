[![Build Status](https://travis-ci.org/bigeasy/cubbyhole.svg?branch=master)](https://travis-ci.org/bigeasy/cubbyhole) [![Coverage Status](https://coveralls.io/repos/bigeasy/cubbyhole/badge.svg?branch=master&service=github)](https://coveralls.io/github/bigeasy/cubbyhole?branch=master)

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
