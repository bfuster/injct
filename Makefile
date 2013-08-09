test:

	@./node_modules/.bin/mocha \
		--reporter spec \
		--recursive

.PHONY: test