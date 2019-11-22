NAME=xolocalvendors/fix-gallery-over-500
VERSION=latest
OSTYPE := $(shell uname)

test:
	@istanbul cover node_modules/.bin/_mocha -- --recursive

debug-test:
	node_modules/.bin/mocha --debug-brk --recursive

install:
	@rm -rf ./node_modules
	npm install

lint:
	node_modules/.bin/eslint --fix src/lib/

update-enddate:
	node src/lib/update-enddate/index.js >> log.txt

