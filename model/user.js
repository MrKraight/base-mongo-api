import mongoose from 'mongoose';
import {mongooseQuery} from '../services/mongoose.js'

const userSchema = new mongoose.Schema({
  login: String,
  passwordHash: String,
});

const User = mongoose.model('User', userSchema);

let userQueries = {getUserByLogin, addUser};

export { User, userQueries };

async function getUserByLogin() {
    const queryResponse = await mongooseQuery(async () => {
        return await User.findOne({ login });
    })
    return queryResponse
};

async function addUser(login, passwordHash) {
    const queryResponse = await mongooseQuery(async () => {
      const user = new User({ login, passwordHash });
      return await user.save();
    });
    return queryResponse
}