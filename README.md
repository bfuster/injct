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