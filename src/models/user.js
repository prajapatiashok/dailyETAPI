const mongoose  = require('mongoose');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    gmail_id: {
        type: String,
        unique: true,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.virtual('expenses', {
    ref: 'Expense',
    localField: '_id',
    foreignField: 'owner'
})

//filter response before send to client
userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject()

    delete userObject.tokens;
    return userObject;
}


userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'thisissecretkey', { expiresIn: '1 weeks' })

    user.tokens = user.tokens.concat({ token })
    user.save()

    return token

}

//function defining
userSchema.statics.findByCredentials = async (email, gmail_id) => {
    const user = await User.findOne({ email, gmail_id });
    if(!user) {
        throw new Error("Unable to login")
    }

    return user;
}

const User = mongoose.model('User', userSchema);
module.exports = User;