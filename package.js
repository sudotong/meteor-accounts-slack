Package.describe({
  summary: "Login service for Slack accounts",
  version: "1.0.8",
  git: "https://github.com/sudotong/meteor-accounts-slack.git",
  name: "sudotong:accounts-slack"
});

Package.on_use(function(api) {
  api.versionsFrom("METEOR@0.9.0");
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('templating', 'client');
  api.use('underscore', 'client');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);
  api.use('accounts-base', ['client', 'server']);
  api.use('accounts-oauth', ['client', 'server']);

  api.add_files('slack_server.js', 'server');

  api.add_files(
    ['slack_login_button.css', 'slack_client.js', 'slack_configure.html', 'slack_configure.js'],
    'client');

  api.add_files("slack.js");
  api.export('Slack');
});
