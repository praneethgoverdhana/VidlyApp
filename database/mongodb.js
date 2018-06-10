
const connectionUrl = 'mongodb://localhost/vidly';
const mongoose = require('mongoose');
const dbDebugger = require('debug')('app:db');

mongoose.connect(connectionUrl, ()=> {
    dbDebugger('Connected to MongoDB successfully....');
});

const genreSchema = mongoose.Schema({
    genre_id: {
        type: Number
    },
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    }
});

const Genre = mongoose.model('Genre', genreSchema);

async function getAllGenres() {
    return await Genre.find();
}

async function getGenreById(genre_id){
    return await Genre.find({genre_id: genre_id });
}

async function saveGenre(genre) {
    try {
        await genre.validate();
        const count = await Genre.find().count();
        genre.genre_id = count+1;
        return await genre.save();
    } catch(err) {
        dbDebugger(err.message);
    }
}

async function updateGenre(genre, genre_id) {
    try {
        await genre.validate();
        const genres = await Genre.find({genre_id: genre_id});
        if(genres.length === 0){
            return null;
        }
        return await Genre.findOneAndUpdate({genre_id: genre_id}, {
            name: genre.name
        })
    } catch(err) {
        dbDebugger(err.message);
        return null;
    }
}

async function deleteGenre(genre_id) {
    const genres = await Genre.find({genre_id: genre_id});
    if(genres.length === 0){
        return null;
    }
    return await Genre.findOneAndRemove({genre_id: genre_id})
}

function updateModelFromRequest(request) {
    const genre = new Genre();
    genre.name = request.name;
    return genre;
}

module.exports.getAllGenres = getAllGenres;
module.exports.saveGenre = saveGenre;
module.exports.updateModelFromRequest = updateModelFromRequest;
module.exports.getGenreById = getGenreById;
module.exports.updateGenre = updateGenre;
module.exports.deleteGenre = deleteGenre;