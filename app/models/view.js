// grab the mongoose module
var mongoose = require('mongoose');
//var Node = require('node');
// define our nerd model
// module.exports allows us to pass this to other files when it is called
var viewSchema = mongoose.Schema({
	name: String,
	nodes: []
});
module.exports = mongoose.model('View', viewSchema);
