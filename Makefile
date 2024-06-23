build:
	rm -rf frontend/build
	npm run build

start-backend:
	npx start-server

start:
	make start-backend

