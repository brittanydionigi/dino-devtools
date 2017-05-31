/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__main_js__ = __webpack_require__(1);


// IndexedDB Variables
const DB_NAME = 'offlineArticles';
const DB_VERSION = 2;
const DB_STORE_NAME = 'articles';

let db;

// Set up our IndexedDB Database
function setupIndexedDB() {
  let req = indexedDB.open(DB_NAME, DB_VERSION);

  req.onsuccess = function (event) {
    console.log("IndexedDB opened successfully");
    db = this.result;
  };

  req.onerror = function (event) {
    console.error("DB could not open: ", event);
  };

  req.onupgradeneeded = function (event) {
    let dataB = event.target.result;

    if (dataB.objectStoreNames.contains(DB_STORE_NAME)) {
      dataB.deleteObjectStore(DB_STORE_NAME);
    }

    let store = dataB.createObjectStore(DB_STORE_NAME, { keyPath: 'id' });

    store.createIndex('headline', 'headline', { unique: false });
    store.createIndex('byline', 'byline', { unique: false });
    store.createIndex('id', 'id', { unique: true });
  };
};

// Cycle through IndexedDB Records and log values
const loadOfflineArticles = () => {
  console.log('Logging DB Records!');
  let objectStore = db.transaction(DB_STORE_NAME, 'readwrite').objectStore(DB_STORE_NAME);
  let headlineIndex = objectStore.index('headline');
  let articles = [];

  objectStore.openCursor().onsuccess = event => {
    console.log("Opened cursor...");
    let cursor = event.target.result;
    if (cursor) {
      console.log('cursor: ', cursor.value);
      articles.push(cursor.value);
      cursor.continue();
    } else {
      console.log('appending articles: ', articles);
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__main_js__["appendArticles"])(articles);
    }
  };
};
/* harmony export (immutable) */ __webpack_exports__["a"] = loadOfflineArticles;


const checkOfflineArticle = articleId => {
  let dbReq = indexedDB.open('offlineArticles');

  dbReq.onsuccess = event => {
    console.log('DB opened from service worker');

    let db = event.target.result;
    let transaction = db.transaction(['articles'], 'readwrite');

    let objectStore = transaction.objectStore("articles");
    let objectStoreReq = objectStore.get(articleId);

    objectStoreReq.onsuccess = event => {
      console.log('it exists!');
      return true;
    };

    objectStoreReq.onerror = event => {
      return false;
    };
  };
};
/* unused harmony export checkOfflineArticle */


const saveForOfflineReading = article => {
  console.log("ARTICLE: ", article);
  let dbReq = indexedDB.open('offlineArticles');

  dbReq.onsuccess = event => {
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

    objectStoreReq.onsuccess = event => {
      console.log('objectStore request succeeded');
      $(`li#article-${article.id}`).addClass('starred');
    };
  };
};
/* harmony export (immutable) */ __webpack_exports__["b"] = saveForOfflineReading;


setupIndexedDB();

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__indexedDB__ = __webpack_require__(0);


const fetchLatestHeadlines = () => {
  fetch('/api/v1/news').then(response => response.json()).then(articles => {
    appendArticles(articles);
  }).catch(error => {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__indexedDB__["a" /* loadOfflineArticles */])();
  });
};

const handleOfflineState = () => {
  updateConnectionStatus('offline');
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__indexedDB__["a" /* loadOfflineArticles */])();
};

const handleOnlineState = () => {
  updateConnectionStatus('online');
  fetchLatestHeadlines();
};

fetchLatestHeadlines();

window.addEventListener('online', event => {
  console.log('online again!');
  handleOnlineState();
});

window.addEventListener('offline', event => {
  console.log('offline!');
  handleOfflineState();
});

const updateConnectionStatus = status => {
  const $connectionStatus = $('#connection-status');

  if (status === 'offline') {
    $connectionStatus.addClass('offline').text(status);
  } else {
    $connectionStatus.removeClass('offline').text(status);
  }
};

const appendArticles = articles => {
  $('#latest-headlines').html('');
  let articlesFrag = document.createDocumentFragment();

  articles.forEach(article => {
    let articleElem = document.createElement('li');
    articleElem.id = `article-${article.id}`;

    let headline = document.createElement('p');
    headline.innerText = article.headline;

    let byline = document.createElement('span');
    byline.innerText = article.byline;

    articleElem.appendChild(headline);
    articleElem.appendChild(byline);
    articlesFrag.appendChild(articleElem);
  });

  $('#latest-headlines').append(articlesFrag);
};
/* harmony export (immutable) */ __webpack_exports__["appendArticles"] = appendArticles;


$('#latest-headlines').on('click', 'li', function (event) {
  let article = $(this)[0];
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__indexedDB__["b" /* saveForOfflineReading */])({
    id: $(article).attr('id').split('-')[1],
    headline: $(article).find('p').text(),
    byline: $(article).find('span').text()
  });

  $(article).addClass('starred');
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').then(registration => {
      // Registration was successful
      console.log('ServiceWorker registration successful');
    }).catch(err => {
      // registration failed :(
      console.log(`ServiceWorker registration failed: ${err}`);
    });
  });
}

/***/ })
/******/ ]);