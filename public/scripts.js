$(() => {
    function getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while (e = r.exec(q)) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    }

    const { access_token, refresh_token } = getHashParams();
    var id;

    $("#definitions").click(() => {
        const dir = localStorage.getItem('directory');
        if (dir) {
            $("#directory").val(dir);
        }
        $("#definitions-container").css('display', 'flex');
        $("#definitions-container").fadeIn(300);
    });

    $("#save").click(() => {
        var dir = $("#directory").val();
        dir = dir.replace(/\\/g, "/");
        localStorage.setItem('directory', dir || "./musics");
        $("#definitions-container").fadeOut(70);
    });

    if (access_token) {

        $.ajax({
            url: 'playlist?access_token=' + access_token + '&limit=50&offset=0',
            success: function (response) {

                if (response.error) {
                    return;
                }

                $('#login-container').hide();
                $('#logged-in-container').show();

                const playlists = response.items;

                var musicNames = [];

                playlists.forEach((elm, index) => {
                    const appendInput = '<div><input type="radio" name="playlist" value="' + index + '"/><p class="inline">' + elm.name + '</p></div>';
                    $("#playlists").append(appendInput)
                });

                $("#first-step").removeClass("hide");


                $("#submit-playlist").click((evt) => {
                    evt.preventDefault();
                    if ($("input[name='playlist']:checked").length > 0) {
                        const playlist = playlists[$("input[name='playlist']:checked").val()];
                        console.log('Playlist', playlist);

                        id = playlist.id;

                        $.ajax({
                            url: 'tracks?playlist_id=' + id + '&access_token=' + access_token,
                            success: (res) => {
                                const { items, next } = res;

                                if (next) {
                                    console.log('next', next)
                                    $("#next").val(next);
                                    $("#next").show();
                                }

                                items.forEach((elm, index) => {
                                    const { track } = elm;
                                    const { album, name, artists } = track;
                                    const graphURL = album.images[0].url;

                                    const musicToAppend = `<div class="music" id="${track.id}"><img class="cover" src="${graphURL}" /><p class="artist">${artists[0].name}</p><p class="name">${name}</p></div>`;

                                    $("#musics").append(musicToAppend);


                                });

                                $("#playlist-name").append($("input[name='playlist']:checked").next().html());
                                $("#total").append(res.total);
                                $("#first-step").hide();
                                $("#second-step").removeClass("hide");
                                $("#logged-in-container").css("display", "block");

                                $("#download-playlist-lg").click((evt) => {
                                    $("#download-playlist-lg").addClass("disabled");
                                    const elms = $(".music").toArray();
                                    elms.forEach((elm) => {
                                        if (!$(`#${elm.id}`).hasClass('cover-waiting') && !$(`#${elm.id}`).hasClass('cover-downloaded')) {
                                            $(`#${elm.id}`).addClass('cover-waiting');
                                        }
                                    });

                                    downloadAllMusics(access_token, elms);
                                });

                                $("#download-playlist-sm").click((evt) => {
                                    $("#download-playlist-sm").addClass("disabled");
                                    const elms = $(".music").toArray();
                                    elms.forEach((elm) => {
                                        if (!$(`#${elm.id}`).hasClass('cover-waiting') && !$(`#${elm.id}`).hasClass('cover-downloaded')) {
                                            $(`#${elm.id}`).addClass('cover-waiting');
                                        }
                                    });

                                    downloadAllMusics(access_token, elms);
                                });

                                $(".music").click((evt) => {
                                    const m = evt.currentTarget.id;
                                    $(`#${m}`).addClass('cover-waiting');
                                    doValidationToDownloadMusic(access_token, m);
                                });
                            }
                        });
                    }
                    else {
                        alert('Please Select a Playlist');
                    }
                });

            }
        });
    } else {
        $('#login-container').show();
        $('#logged-in-container').hide();
    }

    $("#next").click((evt) => {
        $("#next").hide();
        console.log
        const nxt = $("#next").val();
        console.log('nxt', nxt);
        console.log(btoa(nxt));
        appendMusics(nxt);
    })

    function appendMusics(nxt) {
        $.ajax({
            url: 'tracks?playlist_id=' + id + '&access_token=' + access_token + '&url=' + btoa(nxt),
            success: (res) => {
                const { items, next } = res;

                items.forEach((elm, index) => {
                    const { track } = elm;
                    const { album, name, artists } = track;
                    const graphURL = album.images[0].url;

                    const musicToAppend = `<div class="music" id="${track.id}"><img class="cover" src="${graphURL}" /><p class="artist">${artists[0].name}</p><p class="name">${name}</p></div>`;

                    $("#musics").append(musicToAppend);
                });

                $(".music").click((evt) => {
                    const m = evt.currentTarget.id;
                    $(`#${m}`).addClass('cover-waiting');
                    doValidationToDownloadMusic(access_token, m);
                });

                if (next) {
                    $("#next").val(next);
                    $("#next").show();
                }
            }
        });
    }

    async function downloadAllMusics(access_token, elms) {
        for (var i = 0; i < elms.length; i++) {
            console.log('elm[i]', elms[i])
            await doValidationToDownloadMusic(access_token, elms[i].id);
        }
    }


    function doValidationToDownloadMusic(access_token, m) {
        return new Promise((resolve) => {
            $.ajax({
                url: '/music?access_token=' + access_token + '&id=' + m,
                success: (res) => {
                    console.log('Search', res);

                    const { videos, album, name, artists } = res;

                    if (videos.length > 0) {
                        downloadMusic(m, videos, 0, name, artists[0].name, album).then((status) => {

                            /*
            STATUS:
            0  - Já Baixado
            1  - Baixado Com Sucesso
            2  - Baixar Outro
            -1 - Erro ao Baixar
            */
                            if (status == 0 || status == 1) {
                                $(`#${m} .cover`).addClass('cover-downloaded');
                                resolve();
                            }
                            else if (status == 2) {
                                downloadMusic(m, videos, 1, name, artist, album).then((st) => {
                                    if (st == 0 || st == 1) {
                                        $(`#${m} .cover`).addClass('cover-downloaded');
                                        resolve();
                                    } else {
                                        resolve();
                                        console.error('Erro ao Baixar a Musica ' + videos[1].videoId);
                                    }
                                });
                            }
                            else if (status == -1) {
                                resolve();
                                console.error('Erro ao Baixar a Musica ' + videos[1].videoId);
                            }
                        });
                    } else {
                        resolve();
                    }
                }
            });
        });
    }

    function downloadMusic(spt_id, videos, pos, name, artist, album) {
        return new Promise((resolve, reject) => {

            const dir = localStorage.getItem('directory') || './musics';

            $.ajax({
                url: '/download?dir=' + dir + '&name=' + name + '&artist=' + artist + '&album=' + album.name + '&yt_id=' + videos[pos].videoId + '&spt_id=' + spt_id,
                success: (res) => {
                    resolve(res.status);

                }
            });

        });
    }

});