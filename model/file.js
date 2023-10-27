import mongoose from 'mongoose';
import {mongooseQuery} from '../services/mongoose.js'

const filesSchema = new mongoose.Schema({
  name: String,
  storageLink: String
});

const File = mongoose.model('File', filesSchema);

let filesQueries = {addFile, getFileById, updateFile, removeFile};

export { File, filesQueries };

async function addFile(name, storageLink) {
    const queryResponse = await mongooseQuery(async () => {
      const files = new File({ name, storageLink });
      await files.save();
      return files;
    });
    return queryResponse;
}

async function getFileById(id){
    const queryResponse = await mongooseQuery(async () => {
        return await File.findById(id);
    })
    return queryResponse
}
  
async function updateFile(filesId, updates) {
    const queryResponse = await mongooseQuery(async () => {
        return await File.findByIdAndUpdate(filesId, updates, { new: true });
    });
    return queryResponse;
}

async function removeFile(filesId) {
    const queryResponse = await mongooseQuery(async () => {
        return await File.findByIdAndRemove(filesId);
    });
    return queryResponse;
}
