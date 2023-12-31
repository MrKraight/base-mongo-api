import {mongoConnect, mongoDisconnect} from './services/mongoose.js'
import {hashPassword} from './services/passwordHash.js'

import {News} from './model/news.js';
import {User} from './model/user.js';

// Define your test data
const userData = [
  { login: 'user3', passwordHash: (await hashPassword('password333')) },
  { login: 'user4', passwordHash: (await hashPassword('password444')) },
];

const newsData = [
  {
    creator_id: null, // You can set this to a valid User ID later
    title: 'News Title 3',
    content: 'News Content 55555555!![Красивая природа](https://i.pinimg.com/originals/6e/d8/c0/6ed8c02d90638726c33b36f8777cbb90.jpg)',
    publicationDate: new Date(),
  },
  {
    creator_id: null, // You can set this to a valid User ID later
    title: 'News Title 4',
    content: '<u>News Content 6</u> Hello world ss ``` language let variable = some interesting content ```',
    publicationDate: new Date(),
  },
];

// Function to seed the User collection
async function seedUsers() {
  try {
    await User.deleteMany(); // Remove existing users
    const users = await User.create(userData);
    console.log('Users seeded:', users);
  } catch (error) {
    console.error('Error seeding users:', error);
  }
}

// Function to seed the News collection
async function seedNews() {
  try {
    await News.deleteMany(); // Remove existing news
    const news = await News.create(newsData);
    console.log('News seeded:', news);
  } catch (error) {
    console.error('Error seeding news:', error);
  }
}

// Seed data in sequence
async function seedData() {
  await mongoConnect();
  await seedUsers();
  await seedNews();
  await mongoDisconnect();
}

seedData().catch((error) => {
  console.error('Error:', error);
});