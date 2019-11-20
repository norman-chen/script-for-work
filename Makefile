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

docker-build:
	@docker build -t $(NAME) -f docker/Dockerfile .

docker-clean:
	@echo "Removing images"
ifeq ($(OSTYPE),Darwin)
	docker ps -aq | xargs docker rm -f
	docker images -f "dangling=true" -q | xargs docker rmi
else
	docker ps -aq | xargs -r docker rm -f
	docker images -f "dangling=true" -q | xargs -r docker rmi
endif

run: docker-build
	@docker-compose -f docker/docker-compose.yml run --rm pluginDev

run-debug-test: docker-build
	@docker-compose -f docker/docker-compose.yml run --service-ports --rm pluginDebug

jenkins-run:
	make docker-clean ; \
	make docker-build && \
	docker-compose -f docker/docker-compose.yml run --rm pluginJenkins

jenkins-build:
	make jenkins-cover && \
	gulp build

jenkins-cover:
	istanbul cover node_modules/.bin/_mocha -- --debug --recursive && \
	CODECLIMATE_REPO_TOKEN=abcXYZ123 codeclimate-test-reporter < coverage/lcov.info

lint:
	node_modules/.bin/eslint --fix src/ test/

.PHONY: test debug-test clean install docker-build run run-debug-test jenkins-run jenkins-build jenkins-cover lint docker-clean
