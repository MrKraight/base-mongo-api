import mongoose from 'mongoose';
import {mongooseQuery} from '../services/mongoose.js'

const newsSchema = new mongoose.Schema({
  creator_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  title: String,
  content: String,
  htmlContent: String,
  publicationDate: Date,
  file: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File' 
  }
});

const News = mongoose.model('News', newsSchema);

let newsQueries = {addNews, updateNews, removeNews, getAllNews, addFileIdToNews, removeFileIdToNews};

export { News, newsQueries };

async function addNews(creator_id, title, content, htmlContent, publicationDate) {
    const queryResponse = await mongooseQuery(async () => {
      const news = new News({ creator_id, title, content, htmlContent, publicationDate });
      await news.save();
      return news;
    });
    return queryResponse;
  }
  
async function updateNews(newsId, updates) {
    const queryResponse = await mongooseQuery(async () => {
        return await News.findByIdAndUpdate(newsId, updates, { new: true });
    });
    return queryResponse;
}

async function removeNews(newsId) {
    const queryResponse = await mongooseQuery(async () => {
        return await News.findByIdAndRemove(newsId);
    });
    return queryResponse;
}

async function getAllNews() {
    const queryResponse = await mongooseQuery(async () => {
        return await News.find().populate('file').exec();
    });
    return queryResponse;
}

async function addFileIdToNews(newsId, fileId) {
  try {
    const news = await News.findById(newsId);
    if (!news) {
      console.log('News not found');
      return;
    }

    news.file = fileId; // Add the new file's ObjectID to the array
    await news.save();

    console.log('File added to News:', news);
  } catch (err) {
    console.error('Error:', err);
  }
}

async function removeFileIdToNews(newsId, fileId) {
  try {
    const news = await News.findById(newsId);
    if (!news) {
      console.log('News not found');
      return;
    }
    news.file = null;
    await news.save();

    console.log('File added to News:', news);
  } catch (err) {
    console.error('Error:', err);
  }
}