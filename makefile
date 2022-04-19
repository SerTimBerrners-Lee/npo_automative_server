git:
	git reset --hard HEAD 
	git pull
	git status
build:
	nest build
start:
	pm2 start ecosystem.config.js --env production
all:
	sudo make git
	sudo make build
	pm2 restart server