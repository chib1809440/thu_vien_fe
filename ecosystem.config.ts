module.exports = {
  apps: [
    {
      name: "fe_lib_anlong",
      script: "npm",
      args: "run preview -- --host 0.0.0.0 --port 28040",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
