// grab the mongoose module
var mongoose = require('mongoose');
// define our nerd model
// module.exports allows us to pass this to other files when it is called
var nodeSchema = mongoose.Schema({
	name: String,
	content: String,
	keywords: [String]
});
module.exports = mongoose.model('Node', nodeSchema);
