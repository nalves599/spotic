const mongoose = require('mongoose');

const MusicSchema = new mongoose.Schema({
    name: String,
    album: String,
    artist: String,
    cover: String,
    yt_id: String,
    spt_id: String,
    dir: String,
});

module.exports = mongoose.model('Music', MusicSchema);