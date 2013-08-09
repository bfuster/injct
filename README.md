## injct

```
npm install injct --save
```

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

* prototype: your dependency will be a fresh instance
```
injct.register(name, class))
```
* unique: reuse the instance
```
(injct.unique(name, class))
```

### mocking

Say you have a registered UserRepository class like this:
```
var injct = require('injct');
injct.register('userRepository', UserRepository);

function UserRepository() {}
module.exports = UserRepository;
```

And an user service that expects that UserRepository to be injected
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

