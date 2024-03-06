const Playlist = requires('../models/playlistModel.js');

const getPlaylist = (req, res) => {
    if (req.params.name && req.params.ref) {
        Playlist.find()
            .then(playlistes => {
                for(x = 0; x <= playlistes.length; x++){
                    if(playlistes[x].name === req.params.name && playlistes[x].father === req.params.ref){
                        res.json(playlistes[x]);
                    };
                };
            })
            .catch(err => {
                res.status(422);
                console.log('Internal error while get the playlist',err )
                res.json({ "error": 422});
            });
    } else {
        res.status(422);
        console.log('Error with the data in the request')
        res.json({"error":422});
    };
};

const postPlaylist = async (req, res) => {
    let playlist = new Father();

    //Pasar los datos del request al modelo
    playlist.name = req.body.name;
    playlist.father = req.body.ref;
    playlist.videos = req.body.videos;
    

    // Validar que los datos no sean null
    if (playlist.name && playlist.father && playlist.videos) {
        await playlist.save()
            .then(data => {
                res.status(201);
                res.header({ 'location': `/api/playlist/?id=${data.id}`});
                res.json();
            })
            .catch(error => {
                res.status(422);
                console.log('Server error while saving the playlist', error);
                res.json({ errorSend: 422 });
            });
    } else {
        res.status(422);
        console.log('Data error while saving the playlist');
        res.json({ errorSend: 422 });
    }
};



const patchPlaylist = (req, res) => {
    //Buscar el usuario en la BD
    if (req.params && req.params.id) {
        Playlist.findById(req.params.id, async (error, playlist) => {
            if (err) {
                res.status(404);
                console.log('Error while search the playlist to patch', err);
                res.json({ error: 404 })
            }
            await Father.findByIdAndUpdate(req.params.id, playlist)
                .then(answer => {
                    res.json(answer);
                })
                .catch(err => {
                    res.status(422);
                    console.log('Error update the playlist');
                    res.json({ error:422});
                });
            playlist.save((err) => {
                if(err){
                    res.status(422);
                    console.log('Server error while saving the playlist updates',err);
                    res.json({error:422});
                }
                res.status(200);
                res.json(father);
            })
        });
    } else {
        res.status(404);
        console.log('Internal error with the data');
        res.json({error:404});
    };
};