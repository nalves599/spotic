const fs = require('fs');
const ytdl = require('ytdl-core');

const ff = require('fluent-ffmpeg');
const ffm = require('ffmetadata');

const ffmpegPath = __dirname + "\\ffmpeg.exe";
// ff.setFfmpegPath(ffmpegPath);



module.exports = {
    download: async function (yt_id, directory, name, artist, album) {

        const folderPath = `${directory}/`;
        const folderPathTemp = `./tmp/`;
        const musicPathTemp = `${folderPathTemp}${name}.tmp.mp3`;
        const musicPath = folderPath + `${name}.mp3`;

        fs.mkdirSync(folderPathTemp, { recursive: true });
        fs.mkdirSync(folderPath, { recursive: true });


        return new Promise((resolve, reject) => {
            ytdl('http://www.youtube.com/watch?v=' + yt_id)
                .pipe(fs.createWriteStream(musicPathTemp)).on('close', () => {
                    console.log('Closed Stream ' +  musicPath);
                    new ff({ source: musicPathTemp })
                        .on('end', () => {
                            console.log('End stream');
                            try {
                                fs.unlinkSync(musicPathTemp);

                                var data = {
                                    artist,
                                    title: `${artist.charAt(0).toUpperCase() + artist.slice(1)} - ${name.charAt(0).toUpperCase() + name.slice(1)}`,
                                    album,
                                };

                                ffm.write(musicPath, data, function (err) {
                                    if (err) {
                                        return resolve(-1);
                                    }
                                    console.log(`Downloaded ${name} | Path: ${musicPath}`);
                                    return resolve(1);
                                });
                            } catch{
                                return resolve(-1);
                            }
                        })
                        .saveToFile(musicPath);
                });
        });

    },
}