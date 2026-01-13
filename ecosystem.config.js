module.exports = {
  apps: [
    {
      name: 'navegar-sistemas',
      script: 'npm',
      args: 'run dev',
      cwd: '/Users/matheus._.coelho/Documents/iuri/1.carento_nextjs_template',
      watch: false,
      env: {
        NODE_ENV: 'development',
        PORT: 3050
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      merge_logs: true,
      max_restarts: 10,
      restart_delay: 1000,
    }
  ]
}
