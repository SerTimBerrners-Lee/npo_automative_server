module.exports = {
  apps : [
      {
        name: "server",
        script: "./dist/main.js",
        watch: true,
        instances: 8,
        exec_mode: 'cluster',
        node_args: '--max_old_space_size=4096',
        autorestart: true,
        max_memory_restart: '1G',
        exp_backoff_restart_delay: 100,
        time: true,
        env: {
          "PORT": 5000,
          "NODE_ENV": "dev"
        },
        env_production: {
          "PORT": 5000,
          "NODE_ENV": "prod",
        }
      }
  ],
  deploy: {
    prod: {
      user: 'npo',
      host: [{
        host: '89.23.4.133',
        port: '22',
      }],
      repo: 'https://github.com/SerTimBerrners-Lee/npo_automative_server',
      ref: 'origin/master',
      path: '/home/npo/Desktop/npo_automative_server',
      'post-deploy': 'npm install && pm2 startOrReload ecosystem.config.js --env production'
    }
  }
}