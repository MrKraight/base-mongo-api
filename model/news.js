import mongoose from 'mongoose';
import {mongooseQuery} from '../services/mongoose.js'

const newsSchema = new mongoose.Schema({
  creator_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  title: String,
  content: String,
  publicationDate: Date,
});

const News = mongoose.model('News', newsSchema);

let newsQueries = {addNews, updateNews, removeNews, getAllNews};

export { News, newsQueries };

async function addNews(creator_id, title, content, publicationDate) {
    const queryResponse = await mongooseQuery(async () => {
      const news = new News({ creator_id, title, content, publicationDate });
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
        return await News.find()
    });
    return queryResponse;
}