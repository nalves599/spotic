const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

module.exports = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: `http://${process.env.IP}/callback`,
    token_uri: 'https://accounts.spotify.com/api/token',
    basicHeader: {
        'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
    },
    directory : './musics'
}
