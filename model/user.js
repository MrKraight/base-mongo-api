import mongoose from 'mongoose';
import {mongooseQuery} from '../services/mongoose.js'

const userSchema = new mongoose.Schema({
  login: String,
  passwordHash: String,
});

const User = mongoose.model('User', userSchema);

let userQueries = {getUserByLogin, getUserById, addUser};

export { User, userQueries };

async function getUserByLogin(login) {
    const queryResponse = await mongooseQuery(async () => {
        return await User.findOne({ login });
    })
    return queryResponse
};

async function getUserById(id) {
  const queryResponse = await mongooseQuery(async () => {
      return await User.findById(id);
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