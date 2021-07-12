const { Schema, model } = require('mongoose');

const validEmail = (email) => {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: 'Please provide an email',
        email: true,
        unique: true,
        validate: [validEmail, 'Please fill in a valid email.'],
        trim: true,
        lowercase: true
    },
    });


const User = model('User', userSchema);

module.exports = User;