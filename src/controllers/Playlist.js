const axios = require('../utils/Axios');
const querystring = require('querystring');

const { generateRandomString } = require('../utils/StringUtils');
const { client_id, redirect_uri, basicHeader, token_uri } = require('../utils/Spotify');

const stateKey = 'spotify_auth_state';

module.exports = {

    async index(req, res) {
        const { access_token, limit, offset, url } = req.query;

        try {
            const playlistOptions = {
                method: 'GET',
                url: url || ('https://api.spotify.com/v1/me/playlists?' + querystring.stringify({ limit, offset })),
                headers: { 'Authorization': 'Bearer ' + access_token },
            };
            const playlistResponse = await axios(playlistOptions);
            const { items, total, next } = playlistResponse.data;
    
            res.json({ items, total, next })

        } catch{
            res.json({error:'invalid token'});
        }



    },

    async tracks(req, res) {
        var { url ,access_token, playlist_id } = req.query;

        if(url){
            url = Buffer.from(url,'base64').toString();
        }

        const tracksOptions = {
            method: 'GET',
            url: url || ('	https://api.spotify.com/v1/playlists/' + playlist_id + '/tracks'),
            headers: { 'Authorization': 'Bearer ' + access_token },
        };


        const tracksResponse = await axios(tracksOptions);
        const { items, total, next } = tracksResponse.data;

        res.json({ items, total, next });

    }

}