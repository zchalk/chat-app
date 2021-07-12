const { Schema, model } = require('mongoose');

const messageSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    postUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
},
{
    timestamps: true
});

const Message = model('Message', messageSchema);

module.exports = Message;
