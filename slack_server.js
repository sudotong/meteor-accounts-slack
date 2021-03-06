Slack = {};

OAuth.registerService('slack', 2, null, function(query) {
  var tokens = getTokens(query);
  var identity = getIdentity(tokens.access_token);

  var botAccessToken = getBotAccessToken(tokens);

  var user_id = identity.user_id || tokens.user.id;
  var team_id = identity.team_id || tokens.team.id;

  var user_name = identity.user || tokens.user.name;
  var team_name = identity.team || tokens.team.name;

  var ret = {
    serviceData: {
      id: user_id,
      accessToken: tokens.access_token,
      profile: {
        name: identity.user,
        url: identity.url,
        team: identity.team,
        user_id: identity.user_id,
        team_id: identity.team_id,
      },
      tokens: tokens
    },
    options: {
      profile: {
        name: user_name,
        url: identity.url,
        team: team_name,
        user_id: user_id,
        team_id: team_id
      },
      slack: {
        tokens: tokens,
        identity: identity,
      }
    }
  };

  if (botAccessToken) {
    ret['serviceData']['botAccessToken'] = botAccessToken;
  }

  return ret;
});

var getTokens = function (query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'slack'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var response;
  try {
    response = HTTP.post(
      "https://slack.com/api/oauth.access", {
        headers: {
          Accept: 'application/json'
        },
        params: {
          code: query.code,
          client_id: config.clientId,
          client_secret: OAuth.openSecret(config.secret),
          redirect_uri: OAuth._redirectUri('slack', config),
          state: query.state
        }
      });
  } catch (err) {
    throw _.extend(new Error("Failed to complete OAuth handshake with Slack. " + err.message),
                   {response: err.response});
  }

  if (!response.data.ok) { // if the http response was a json object with an error attribute
    throw new Error("Failed to complete OAuth handshake with Slack. " + response.data.error);
  } else {
    return response.data;
  }
};

var getBotAccessToken = function (data) {
  if (!data.bot || !data.bot.bot_access_token) {
    return false;
  } else {
    return data.bot.bot_access_token;
  }
};

var getIdentity = function (accessToken) {
  try {
    var response = HTTP.get(
      "https://slack.com/api/auth.test",
      {params: {token: accessToken}});

    return response.data.ok && response.data;
  } catch (err) {
    throw _.extend(new Error("Failed to fetch identity from Slack. " + err.message),
                   {response: err.response});
  }
};


Slack.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
