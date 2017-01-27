var Mongoose = require('Mongoose');
var Schema   = Mongoose.Schema;

var playerSchema = new Schema({
	nickname: String,
	password: String,
	picture: String
});

var Player = Mongoose.model('Player', playerSchema);
module.exports = Player;