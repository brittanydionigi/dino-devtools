import Dexie from 'dexie';
import { appendArticles } from './main.js';

let db = new Dexie('fakeNews');

db.version(1).stores({
  articles: 'id, headline, byline'
});

export const saveForOfflineReading = (article) => {
  db.articles.put(article).then(id => {
    console.log('id: ', id); 
    $(`li#article-${id}`).addClass('starred');
  })
}

export const loadOfflineArticles = () => {
  db.articles.toArray()
  .then(articles => {
    appendArticles(articles);
  })
  .catch(error => {
    console.log('error: ', error);
  })
};