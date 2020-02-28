const { Router } = require('express')

const Login = require('./controllers/Login');
const Playlist = require('./controllers/Playlist');
const Music = require('./controllers/Music');

const routes = Router();

routes.get('/login', Login.login);
routes.get('/callback', Login.callback);
routes.get('/playlist', Playlist.index);
routes.get('/tracks', Playlist.tracks);
routes.get('/music', Music.index);
routes.get('/download', Music.download);

module.exports = routes;