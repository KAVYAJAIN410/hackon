// PM2 process config for the ReLoop backend on EC2.
// Usage: pm2 start ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'reloop-api',
      script: 'src/index.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '400M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
