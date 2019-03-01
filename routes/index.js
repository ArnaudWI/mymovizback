const router = require('express').Router();
const mongoose = require('mongoose')
const request = require('request');

const options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true
};
mongoose.connect('mongodb://nono:capsule26@ds155825.mlab.com:55825/mymovizapp',
    options,
    function(err) {
     console.log(err);
    }
);

var movieSchema = mongoose.Schema({
    title: String,
    overview: String,
    poster_path: String,
    idMovieDB: Number
});

var movieModel = mongoose.model('movies', movieSchema);

/* GET home page. */
router.get('/movies', function(req, res, next) {
  request("https://api.themoviedb.org/3/discover/movie?api_key=324c59a1ceb0c2d56acf54c5f4c2f498&language=fr-FR&region=fr&sort_by=popularity.desc&include_adult=false&include_video=false&page=1", function(error, response, body) {
    body = JSON.parse(body);
    res.json({body});
  });
});

router.get('/mymovies', function(req, res, next) {
  movieModel.find (
      function (err, movies) {
        res.json({movies});
      }
  );
});

router.post('/mymovies', function(req, res) {

    var newMovie = new movieModel ({
      title: req.body.title,
      overview: req.body.overview,
      poster_path: req.body.poster_path,
      idMovieDB: req.body.idMovieDB
    })

    newMovie.save(
      function (error, movie){
        res.json({movie});
      }
    );
});

router.delete('/mymovies/:movieId', function(req, res, next) {
  movieModel.deleteOne(
  { idMovieDB: req.params.movieId},
      function (err, response) {
        res.json({result: true});
      }
  );
});

module.exports = router;
