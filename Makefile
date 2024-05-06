config-default:
	ruby build.rb default release.yml
config-admin:
	ruby build.rb admin release.yml

build-default: config-default
	npm run build:default
build-admin: config-admin
	npm run build:admin

config-default-dev:
	ruby build.rb default production.yml
config-admin-dev:
	ruby build.rb admin production.yml

build-default-dev: config-default-dev
	npm run build:default
build-admin-dev: config-admin-dev
	npm run build:admin
