import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
        googleId: { type: String, required: true, unique: true },
        email: { type: String, required: true },
        displayName: String,
        image: String,
        // Your specific data fields
        favourites: [{ type: String }], // Array of strings (e.g., Movie IDs) or Objects
        watchlist: [{ type: String }]
});

const User = mongoose.model('User', userSchema);
export default User;