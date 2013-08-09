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

### two scopes: prototype and unique

* prototype: new instance when the class is requested
```
injct.register({propertyName:Class})
```
* unique: reuse the instance
```
injct.unique({propertyName:Class})
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

You can mock the repository behavior, no matter the scope

```
injct.register({userRepository: function AnotherRepository(){}});

var userService = new UserService();
assert.ok(userService.userRepository instanceof AnotherRepository);
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

