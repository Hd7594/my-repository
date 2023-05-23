const mongoose = require('mongoose')

const VintedUser = mongoose.model("Publication", {

    email: String,
    account: {
      username: String,
      avatar: Object, 
    },
    newsletter: Boolean,
    token: String,
    hash: String,
    salt: String,

});

module.exports = VintedUser;