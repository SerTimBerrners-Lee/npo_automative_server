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
        max_memory_restart: '4G',
        exp_backoff_restart_delay: 100,
        time: true,
        env: {
          "PORT": 3000,
          "NODE_ENV": "dev"
        },
        env_production: {
          "PORT": 3000,
          "NODE_ENV": "prod",
        }
      }
  ]
}