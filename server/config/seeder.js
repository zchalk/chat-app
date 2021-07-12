const db = require('./config');
const {User} = require('../models')
const userData = require('./users.json');

db.once('open', async () => {
    await User.deleteMany();

    await User.create(userData);
    console.log('Users inserted! :)');


    // simple test case
    await User.create(    {
        "username": "test1",
        "email": "test1@test.com"
    },
    {
        "username": "test2",
        "email": "test2@test.com"
    });
    
    process.exit();
})