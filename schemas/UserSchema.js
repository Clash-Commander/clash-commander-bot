const { model, Schema } = require('mongoose');

module.exports = model('UserSchema',
    new Schema({
        userID: { type: String, required: true, unique: true },
        coc_tag: { type: String, unique: true },
    })
);