const yts = require('yt-search');



module.exports = {
    search: async function (srch) {
        const r = await yts(srch);

        const { videos } = r;

        return videos;

    },
};
