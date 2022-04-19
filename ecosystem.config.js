module.exports = {
  apps : [
      {
        name: "server",
        script: "./dist/main.js",
        watch: true,
        env: {
            "PORT": 5000,
            "NODE_ENV": "dev"
        },
        env_production: {
            "PORT": 5000,
            "NODE_ENV": "prod",
        }
      }
  ]
}