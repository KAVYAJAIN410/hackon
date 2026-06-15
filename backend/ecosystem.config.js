// PM2 process config for the ReLoop backend on EC2.
// Cluster mode + `pm2 reload` = zero-downtime deploys.
// Usage: pm2 start ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'reloop-api',
      script: 'src/index.js',
      cwd: __dirname,
      instances: 2,
      exec_mode: 'cluster',
      autorestart: true,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
