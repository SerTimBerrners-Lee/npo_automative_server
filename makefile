git:
	git reset --hard HEAD 
	git pull
	git status
build:
	nest build
start:
	pm2 start dist/main.js --name npo-server --node-args="--max-old-space-size=4096" -i max
all:
	sudo make git
	sudo make build
	sudo make start