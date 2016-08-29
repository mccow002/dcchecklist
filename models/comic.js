var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var comicSchema = new Schema({
    FirstChar: String,
    Title: String,
    Series: String,
    Issues: String,
    Dates: String,
    Notes: String,
    Owned: Boolean
});
comicSchema.index({'$**': 'text'});

var Comic = mongoose.model('series', comicSchema);

module.exports = Comic;