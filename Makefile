install:
	npm ci
build:
	rm -rf frontend/build
	make install & make -C frontend install 
	npm run build

start-backend:
	npx start-server

start:
	make start-backend