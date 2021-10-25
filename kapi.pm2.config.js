// pm2 config file 
// docs: https://pm2.keymetrics.io/docs/usage/application-declaration/

module.exports = {
  apps : [{
    name   : "KAPI - Kimchi API",
    script : "./app.js",
    watch  : true,
    restart_delay: 5000,
  }]
}