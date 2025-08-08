const User = require('../models/User');

const seedUsers = async () => {
    const users = [
        { username: 'admin', password: 'admin123' },
        { username: 'user1', password: 'user123' },
        { username: 'user2', password: 'user123' },
        { username: 'user3', password: 'user123' },
        { username: 'user4', password: 'user123' },

    ];
    await User.deleteMany({});
    await User.insertMany(users);
    console.log('Users seeded');
};

module.exports = seedUsers;
