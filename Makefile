install:
	npm ci
build:
	rm -rf frontend/build
	make install & make -C frontend install 
	npm run build

start:
	npx start-server -s ./frontend/build
	npm start --prefix frontend