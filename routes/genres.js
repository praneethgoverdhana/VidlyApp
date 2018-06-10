const express = require('express');
const router = express.Router();
const database = require('../database/mongodb');
const Joi = require('joi');

//get all genres
router.get('/', (req,res)=> {
    const genres = database.getAllGenres().then((response)=> {
        res.send(response);
    })
});

//get specific genre
router.get('/:id', (req,res)=> {
    try {
        const genre_id = parseInt(req.params.id);
        const genres = database.getGenreById(genre_id).then((response)=> {
            res.send(response);
        })
    } catch (err) {
        res.status(404).send(err.message);
    }
    
});

router.post('/',(req,res)=> {
    const result = validateSaveGenreRequest(req.body);
    console.log('Validate Result: ', result);
    if(result.error){
        console.log("Errors Found");
        res.status(404).send(result.error);
        return;
    }
    const genre = database.updateModelFromRequest(req.body);
    database.saveGenre(genre).then((dbResult)=> res.send(dbResult));
});

router.put('/:id',(req,res)=> {
    const result = validateSaveGenreRequest(req.body);
    console.log('Validate Result: ', result);
    if(result.error){
        console.log("Errors Found");
        res.status(404).send(result.error);
        return;
    }
    const genre_id = +req.params.id;
    const genre = database.updateModelFromRequest(req.body);
    const promise = database.updateGenre(genre, genre_id);
    if(!promise){
        res.status(404).send("Error updating document");
    }
    promise.then((dbResult)=> res.send(dbResult));
});

router.delete('/:id',(req,res)=> {
    const genre_id = +req.params.id;
    const promise = database.deleteGenre(genre_id);
    if(!promise){
        res.status(404).send("Error deleting document");
    }
    promise.then((dbResult)=> res.send(dbResult));
});


function validateSaveGenreRequest(request) {
    const schema = {
        genre_id: Joi.string(),
        name: Joi.string().min(3).max(100).required()
    }
    return Joi.validate(request, schema);
}



module.exports = router;