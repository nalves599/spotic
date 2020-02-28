const CLIENT_ID = '{CLIENT_ID}';
const CLIENT_SECRET = '{CLIENT_SECRET}';

module.exports = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: 'http://{MY_IP}/callback',
    token_uri: 'https://accounts.spotify.com/api/token',
    basicHeader: {
        'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
    },
    directory : './musics'
}
