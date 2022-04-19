git:
	git reset --hard HEAD 
	git pull
	git status
build:
	nest build
start:
	pm2 start dist/main.js --name server --node-args="--max-old-space-size=4096" -i max
all:
	sudo make git
	sudo make build
	pm2 restart server