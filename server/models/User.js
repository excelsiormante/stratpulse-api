var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var userSchema = new Schema(
    {
        firstName: {type:String},
        lastName: {type:String},
        displayName: {type:String},
        email: {type:String},
        password: {type:String},
        picture:{type:String},
        facebook: { 
            id: String,
            token: String,
            email: String,
            name: String
        },
        twitter: {
            id: String,
            token: String,
            displayName: String,
            username: String
        },
        google: {
            id: String,
            token: String,
            email: String,
            name: String
        }
        /*
        positionId:{type:String, required:true},
        votingPoints:{type:Number}
        */

    },
    { timestamps: true }
);

userSchema.pre('save', function(next) {
    var user = this;
    user.username=user.email;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    if(this.password==candidatePassword){
        cb(null, true);
    }else{
        bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
            if (err) return cb(err);
            cb(null, isMatch);
        });
    }
};

module.exports = mongoose.model('User', userSchema);
