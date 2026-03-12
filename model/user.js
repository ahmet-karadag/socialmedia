
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 4
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true 
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
  
},{ timestamps: true});

userSchema.pre('save', async function(next){
    const user = this;

    if(user.isModified('password')){
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password,salt);
    }
    next();
});

userSchema.statics.registerUser = async function (data) {
    const User = this;
    if (!data.username || !data.email || !data.password) {
        throw new Error('missing fields');
    }
    const newUser = new User({
        username: data.username,
        email: data.email,
        password: data.password //pre save sayesinde otomotik hasliyorum.
    });
    return await newUser.save();
};

userSchema.statics.findByCredentials = async function(data){
const User = this;
    if(!data.email || !data.password ){
        throw new Error('missing fields');
    }
    const user = await User.findOne({email: data.email});
    if (!user) throw new Error('user not found');

    const isMatch = await bcrypt.compare(data.password,user.password);
    if(!isMatch) throw new Error('wrong password');

    return user;
};

userSchema.methods.generateAuthToken = function () {
    const user = this;
    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
    return token;
};
//güvenlik için json çıktısından şifreyi gizledik.
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password; // API yanıtlarında şifre asla gözükmez
    return userObject;
};


const User = mongoose.model('User',userSchema);

module.exports = User;