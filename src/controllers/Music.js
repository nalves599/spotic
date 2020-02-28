const axios = require('../utils/Axios');
const yts = require('../utils/Search');
const dwn = require('../utils/DownloadUtil');
const fs = require('fs');
const Music = require('../models/Music');

const { cleanString } = require('../utils/StringUtils');


module.exports = {

    async index(req, res) {
        const { access_token, id } = req.query;

        const musicOptions = {
            method: 'GET',
            url: ('https://api.spotify.com/v1/tracks/' + id),
            headers: { 'Authorization': 'Bearer ' + access_token },
        };

        const musicResponse = await axios(musicOptions);

        const { album, name, artists } = musicResponse.data;

        const videos = await yts.search(name + ' ' + artists[0].name + ' audio');

        res.json({ videos, album, name, artists })

    },

    async download(req, res) {
        var { yt_id, spt_id, name, artist, album, dir } = req.query;

        name = cleanString(name);
        artist = cleanString(artist);
        album = cleanString(album);

        const music = {
            yt_id,
            spt_id,
            name,
            artist,
            album,
            dir
        };

        if (await Music.exists(music)) {
            console.log('Already Exist on Db')
            res.json({ status: 0 });
        } else {

            try {
                if (!fs.existsSync(`${dir}/${name}.mp3`)) {
                    const status = await dwn.download(yt_id, dir, name, artist, album);
                    if (status == 1) {
                        await Music.create(music);
                    }
                    res.json({ status });
                } else {
                    await Music.create(music);
                    res.json({ status: 0 });
                }
            } catch (err) {
                console.log(err)
                res.json({ status: -1 })
            }
        }

        // TODO : Validate if already downloaded on database
        // TODO : If Not Download Music
        // TODO : Set Name, Artist and Album




    }

}