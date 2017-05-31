import { appendArticles } from './main.js';

// IndexedDB Variables
const DB_NAME = 'offlineArticles';
const DB_VERSION = 2;
const DB_STORE_NAME = 'articles';

let db;

// Set up our IndexedDB Database
function setupIndexedDB() {
  let req = indexedDB.open(DB_NAME, DB_VERSION);

  req.onsuccess = function(event) {
    console.log("IndexedDB opened successfully");
    db = this.result;
  };

  req.onerror = function(event) {
    console.error("DB could not open: ", event);
  };

  req.onupgradeneeded = function(event) {
    let dataB = event.target.result;

    if (dataB.objectStoreNames.contains(DB_STORE_NAME)) {
      dataB.deleteObjectStore(DB_STORE_NAME);
    }

    let store = dataB.createObjectStore(
      DB_STORE_NAME, { keyPath: 'id' }
    );

    store.createIndex('headline', 'headline', { unique: false });
    store.createIndex('byline', 'byline', { unique: false });
    store.createIndex('id', 'id', { unique: true });
  };
};

// Cycle through IndexedDB Records and log values
export const loadOfflineArticles = () => {
  console.log('Logging DB Records!');
  let objectStore = db.transaction(DB_STORE_NAME, 'readwrite').objectStore(DB_STORE_NAME);
  let headlineIndex = objectStore.index('headline');
  let articles = [];

  objectStore.openCursor().onsuccess = (event) => {
    console.log("Opened cursor...");
    let cursor = event.target.result;
    if (cursor) {
      console.log('cursor: ', cursor.value);
      articles.push(cursor.value);
      cursor.continue();
    } else {
      console.log('appending articles: ', articles);
      appendArticles(articles);
    }
  }
}

export const checkOfflineArticle = (articleId) => {
  let dbReq = indexedDB.open('offlineArticles');

  dbReq.onsuccess = (event) => {
    console.log('DB opened from service worker');
    
    let db = event.target.result;
    let transaction = db.transaction(['articles'], 'readwrite');

    let objectStore = transaction.objectStore("articles");
    let objectStoreReq = objectStore.get(articleId);

    objectStoreReq.onsuccess = (event) => {
      console.log('it exists!');
      return true;
    }

    objectStoreReq.onerror = (event) => {
      return false;
    }
  };
}

export const saveForOfflineReading = (article) => {
  console.log("ARTICLE: ", article);
  let dbReq = indexedDB.open('offlineArticles');

  dbReq.onsuccess = (event) => {
    console.log('DB opened from service worker');
    
    let db = event.target.result;
    let transaction = db.transaction(['articles'], 'readwrite');

    // transaction.oncomplete = (event) => {
    //   console.log('Transaction Success');
    // }

    // transaction.onerror = (event) => {
    //   console.log('Transaction Error');
    // }

    let objectStore = transaction.objectStore("articles");
    let objectStoreReq = objectStore.add(article);

    objectStoreReq.onsuccess = (event) => {
      console.log('objectStore request succeeded');    
      $(`li#article-${article.id}`).addClass('starred');
    }
  };
}

setupIndexedDB();