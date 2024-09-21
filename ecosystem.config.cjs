module.exports = {
  apps: [
    {
      script: "./dist/app.js",
      /* script: './src/app.ts',  */
      cron_restart: "0 */8 * * *",
      instances: 1,
      autorestart: true,
      watch: false,
      restart_delay: 1000,
      max_memory_restart: "1G",
      out_file: './logs/out.log',  
      error_file: './logs/error.log',
      exec_mode: "cluster"
    },
  ],

  deploy: {
    production: {
      user: "SSH_USERNAME",
      host: "SSH_HOSTMACHINE",
      ref: "origin/master",
      repo: "GIT_REPOSITORY",
      path: "DESTINATION_PATH",
      "pre-deploy-local": "",
      "post-deploy":
        "npm install && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
    },
  },
};
