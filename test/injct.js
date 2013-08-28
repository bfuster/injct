var injct = require('../lib/injct.js')
    , assert = require('assert')
    , Foo = require('./fixture/foo.js')
    , Bar = require('./fixture/bar.js')
    , Unique = require('./fixture/unique.js')
    , Static = require('./fixture/static.js');

describe('injct', function() {

    describe('#register', function() {

        it('should be able to register a new dependency', function() {

            var count = 0;
            function UserRepository() {
                count++;
            }
            injct.register({userRepository:UserRepository});

            function UserService(userRepository) {
                this.userRepository = userRepository;
                injct.apply(this);
            }

            assert.ok(new UserService().userRepository instanceof UserRepository);

            new UserService();
            new UserService();
            new UserService();

            assert.equal(count, 4);
        });

        it('should be able to inject using json', function() {

            function Nice() {}
            injct.register({
                nice: Nice
            });

            function Bla(nice) {
                this.nice = nice;
                injct.apply(this);
            }

            assert.ok(new Bla().nice instanceof Nice);

        });

    });

    describe('#unique', function() {

        it('should be able to create a dependency that is instantiated only once', function() {

            var count = 0;
            function UserRepository() {
                count++;
            }

            injct.unique({userRepository: UserRepository});

            function UserService(ur) {
                this.userRepository = ur;
                injct.apply(this);
            }

            new UserService();
            new UserService();
            new UserService();

            assert.equal(count, 1);

        });

        it('should throw an error if the property is not an object', function() {

            assert.throws(function() {
                injct.unique({static: Static});
                new UserService();
            }, Error);

        });

    });

    describe('#static', function() {

        it('should be able to use static modules', function() {

            function FakeService(_static) {
                this._static = _static;
                injct.apply(this);
            }

            injct.static({_static: Static});

            var service = new FakeService();
            assert.ok(service._static.doSomething());

        });

    });

    describe('mocking', function() {

        it('should be able to mock behavior', function() {

            var foo = new Foo();
            assert.ok(foo.bar instanceof Bar);

            function FakeBar(){}

            injct.register({bar:FakeBar});
            foo = new Foo();
            assert.ok(foo.bar instanceof FakeBar);

        });

        it('should be able to mock unique scoped behavior', function() {

            var foo = new Foo();
            assert.ok(foo.unique instanceof Unique);

            function FakeUnique(){}
            injct.unique({unique: FakeUnique});

            foo = new Foo();
            assert.ok(foo.unique instanceof FakeUnique);
        });

        it('should be able to use a constructor and ignore injected properties', function() {

            function Foo(bar) {
                this.bar = bar;
                injct.apply(this);
            }

            function Bar() {}

            injct.register({bar: Bar});

            function FakeBar() {}

            var fakeFoo = new Foo(new FakeBar());
            assert.ok(fakeFoo.bar instanceof FakeBar);

            var foo = new Foo();
            assert.ok(foo.bar instanceof Bar);

        });

    });

    describe('unregisterAll', function() {

       it('should remove all injections', function() {
           injct.unregisterAll();
           assert.deepEqual(injct.injections().unique, {});
           assert.deepEqual(injct.injections().static, {});
           assert.deepEqual(injct.injections().prototype, {});
       });

    });

    describe('order does not matter', function() {
        //TODO
    });

});