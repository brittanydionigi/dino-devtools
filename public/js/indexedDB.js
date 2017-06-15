import Dexie from 'dexie';
import { appendArticles } from './main.js';

let db = new Dexie('fakeNews');

db.version(1).stores({
  articles: 'id, headline, byline'
});

export const saveOfflineArticle = (article) => {
  return db.articles.put(article);
}

export const checkOfflineAvailability = (id) => {
  return db.articles.get(id.toString())
}

export const removeOfflineArticle = (id) => {
  return db.articles.delete(id);
}

export const loadOfflineArticles = () => {
  db.articles.toArray()
  .then(articles => appendArticles(articles))
  .catch(error => console.log('error: ', error));
}; 