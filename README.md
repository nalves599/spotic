# SpoTIC  🎶📥

## Overview
An application to download tracks from user's playlist spotify. And not allow repeated musics to the same folder.

## Get started
- Download Project `git clone https://github.com/nalves599/spotic.git`
-  `cd ./spotic`
- `npm install`
- Create your own [Spotify App](https://developer.spotify.com/documentation/web-api/quick-start/) and set callback URL.
- Set environment variables on `.env` file (Mongoose Connection and Spotify App Settings)
- Download [**FFmpeg**](https://www.ffmpeg.org/download.html "FFmpeg Download")
- Set environment variable `FFMPEG_PATH` to executable on Windows, when it's not defined on PATH.
- `npm start`
- Open your url and start using. Default: `localhost:8085` 
- 
## Using
- By default, when you start, your musics will be saved on `./musics` folder. You can change it on settings, setting up your path to folder.
- Select your spotify playlist.
- And then, you can download all musics form playlist or only the ones that you click. The music will be successfully downloaded when the border stop blinking and be green.

## Contributors
I ([Nuno Alves](https://github.com/nalves599 "nalves599")) developed this app according my personal needs, to get my musics from spotify to my computer without pay. This application also set the album and the authors of the music's, so it's more easier to search, and get the covers on itunes.

Any new feature can be added by a pull request.

## License
This project is licensed under the MIT License - see the  [LICENSE.md](https://github.com/nalves599/spotic/LICENSE.md)  file for details.

---

**SpoTIC - 2020**