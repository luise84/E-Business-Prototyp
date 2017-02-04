// grab the mongoose module
var mongoose = require('mongoose');

// define our nerd model
// module.exports allows us to pass this to other files when it is called
var nodeSchema = mongoose.Schema({
	name: { type: String, required: true, unique: true },
	content: String,
	visible: Boolean,
	url: String,
	childNodes: [{type: mongoose.Schema.ObjectId, ref: 'Node'}],
	parent: [{type: mongoose.Schema.ObjectId, ref: 'Node'}]
});
module.exports = mongoose.model('Node', nodeSchema);
