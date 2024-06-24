install:
	npm ci
build:
	rm -rf frontend/build
	make install & make -C frontend install 
	npm run build

start-backend:
	npx start-server ./frontend/build

start:
	make start-backend
	npm run start --prefix frontend