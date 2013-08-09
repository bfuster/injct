## injct

### extremely simple dependency injection for nodejs

```
var injct = require('injct');

function UserRepository() {}
injct.register('userRepository', UserRepository);

function UserService(userRepository) {
    this.userRepository = userRepository;
    injct.apply(this);
}

var userService = new UserService();
assert.equal(userService.userRepository instanceof UserRepository);
```

### two scopes: prototype and unique

* prototype: always create a new object (injct.register(name, class))
* unique: reuse the same object         (injct.unique(name, class))

### mocking

Say you have a user repository class like this:
```
var injct = require('injct');
injct.register('userRepository', UserRepository);
function UserRepository() {

}
module.exports = UserRepository;
```

And a user service that expects that user repository to be injected
```
function UserService(userRepository) {
    this.userRepository = userRepository;
    injct.apply(this);
}
```

You can mock the repository behavior, no matter the scope

```
injct.register('userRepository', function AnotherRepository(){});
var userService = new UserService();
assert.ok(userService.userRepository instanceof AnotherRepository);
```

