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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
const fetchLatestHeadlines = () => {
  fetch('/api/v1/articles').then(response => response.json()).then(articles => appendArticles(articles)).catch(error => console.log('error: ', error));
};

const handleOnlineState = () => {
  updateConnectionStatus('online');
};

const handleOfflineState = () => {
  updateConnectionStatus('offline');
};

window.addEventListener('online', event => {
  console.log('online!');
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

    let headline = document.createElement('p');
    headline.innerText = article.headline;
    headline.dataset.articleId = article.id;

    let byline = document.createElement('span');
    byline.innerText = article.byline;

    articleElem.appendChild(headline);
    articleElem.appendChild(byline);
    articlesFrag.appendChild(articleElem);
  });

  $('#latest-headlines').append(articlesFrag);
};
/* harmony export (immutable) */ __webpack_exports__["appendArticles"] = appendArticles;


$('#latest-headlines').on('click', 'p', function (event) {
  let elem = event.currentTarget;

  let id = elem.dataset.articleId;
  let headline = elem.innerText;
  let byline = elem.nextSibling.innerText;

  elem.classList.toggle('starred');
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    fetchLatestHeadlines();
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