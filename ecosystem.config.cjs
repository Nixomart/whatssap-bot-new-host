module.exports = {
  apps : [{
    script: './dist/app.js',
     /* script: './src/app.ts',  */
    
    instances: 1,          
    autorestart: true,     
    watch: false,          
    max_memory_restart: '1G',
  }],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
