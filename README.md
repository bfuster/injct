## injct

```
npm install injct --save
```

### extremely simple dependency injection for nodejs

```
var injct = require('injct');

function UserRepository() {}
injct.register({userRepository: UserRepository});

function UserService(userRepository) {
    this.userRepository = userRepository;
    injct.apply(this);
}

var userService = new UserService();
assert.equal(userService.userRepository instanceof UserRepository);
```

### three types: prototype, unique and static

* prototype: new instance when the class is requested
```
injct.register({propertyName:Class})
```
* unique: reuse the same instance (application scoped)
```
injct.unique({propertyName:Class})
```
* static: for non-objects when using just exports.function in a module
```
inject.static({propertyName:Module})
```

### mocking

Say you have a registered UserRepository class like this:
```
var injct = require('injct');
injct.register({userRepository: UserRepository});

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

You can mock the repository behavior by redefining the injected property:

```
injct.register({userRepository: function AnotherRepository(){}});

var userService = new UserService();
assert.ok(userService.userRepository instanceof AnotherRepository);
```

or by setting your mock in the constructor:

```
new UserService(new FakeUserRepository());
```

### using with express and mocha

Create a dependency injection provider to not spread injct.register()

```
// load-dependencies.js
var injct = require('injct');

injct.register({
    userRepository: require('./UserRepository.js'),
    userService: require('./UserService.js');
});

//from app.js
require('./load-dependencies.js');
```

From mocha you can register the dependencies you need for each test

```
var injct = require('injct');
function FakeRepository() {
    this.fake = true;
    this.save = function() {}
}
injct.register({userRepository: FakeRepository});

```

### test

```
make test
```
