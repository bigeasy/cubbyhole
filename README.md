[![Actions Status](https://github.com/bigeasy/cubbyhole/workflows/Node%20CI/badge.svg)](https://github.com/bigeasy/cubbyhole/actions)
[![codecov](https://codecov.io/gh/bigeasy/cubbyhole/branch/master/graph/badge.svg)](https://codecov.io/gh/bigeasy/cubbyhole)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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
