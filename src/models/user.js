
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema, model } = mongoose;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    token: { type: String },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        console.log('Hashing password for user:', this.email);
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const User = model('User', userSchema);

export default User;