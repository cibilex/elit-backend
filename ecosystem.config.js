module.exports = {
  apps: [
    {
      instances: 2,
      exec_mode: 'cluster',
      name: 'elit-backend',
      script: 'dist/main.js',
      env_dev: {
        NODE_ENV: 'dev',
        watch: ['dist'],
      },
      env_prod: {
        NODE_ENV: 'prod',
        watch: false,
      },
    },
  ],
};
