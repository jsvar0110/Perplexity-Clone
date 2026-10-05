import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        }
        ,
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
        }
        ,
        password: {
            type: String,
            required: function () { return !this.googleId },
            minlength: 6,
        }
        ,
        verified: {
            type: Boolean,
            default: false
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true,
        }
    },
    { timestamps: true }
);

userSchema.pre('save', async function () {

    if (!this.password || !this.isModified("password")) return
    this.password = await bcrypt.hash(this.password, 10)

})

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password)
}


const userModel = mongoose.model('User', userSchema)

export default userModel