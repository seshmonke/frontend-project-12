build:
	rm -rf frontend/build
	make install
	npm run build

start-backend:
	npx start-server

start:
	make start-backend

install:
	npm ci