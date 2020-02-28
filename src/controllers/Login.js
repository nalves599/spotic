const axios = require('../utils/Axios');
const querystring = require('querystring');

const { generateRandomString } = require('../utils/StringUtils');
const { client_id, redirect_uri, basicHeader, token_uri } = require('../utils/Spotify');

const stateKey = 'spotify_auth_state';

module.exports = {

  async login(req, res) {
    var state = generateRandomString(16);
    res.cookie(stateKey, state);

    // your application requests authorization
    var scope = 'playlist-read-private user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id,
        scope: scope,
        redirect_uri,
        state: state
      }));

  },

  async callback(req, res) {
    // your application requests refresh and access tokens
    // after checking the state parameter

    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    console.log('Login', state);

    if (state === null || state !== storedState) {
      res.redirect('/#' +
        querystring.stringify({
          error: 'state_mismatch'
        }));
    } else {
      res.clearCookie(stateKey);
      var authOptions = {
        method: 'POST',
        url: token_uri,
        data: querystring.stringify({
          code,
          redirect_uri,
          grant_type: 'authorization_code'
        }),
        headers: basicHeader,
      };

      try {
        const authenticationResponse = await axios(authOptions);

        const {access_token, refresh_token} = authenticationResponse.data;

        res.redirect('/#' +
        querystring.stringify({
          access_token, refresh_token
        }));

        

      } catch{
        console.log('exception')
        res.json({});
      }

    }



  },
}