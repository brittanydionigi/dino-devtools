import moment from 'moment';
import { 
  loadOfflineArticles,
  checkOfflineAvailability,
  saveOfflineArticle,
  removeOfflineArticle } from './indexedDB';
import { sendMessage } from './sendMessage';

const fetchLatestHeadlines = () => {
  fetch('/api/v1/articles')
  .then(response => response.json())
  .then(articles => appendArticles(articles))
  .catch(error => loadOfflineArticles());
};

const showNotification = (note) => {
  $('body').append(`<p class="notification ${note.status}">${note.message}</p>`);
}

const handleOnlineState = () => {
  updateConnectionStatus('online');
  fetchLatestHeadlines();
};

const handleOfflineState = () => {
  updateConnectionStatus('offline');
  loadOfflineArticles();
};

window.addEventListener('online', event => {
  console.log('online!');
  handleOnlineState();
});

window.addEventListener('offline', event => {
  console.log('offline!');
  handleOfflineState();
});

const updateConnectionStatus = (status) => {
  const $connectionStatus = $('#connectionStatus');
 
  if (status === 'offline') {
    $connectionStatus.addClass('offline').text(status);
  } else {
    $connectionStatus.removeClass('offline').text(status);
  }
}

// Add edit handler
$('#latest-headlines').on('keydown', '.byline', function(event) {
  const $articleElem = $(this).parent();
  const id = $articleElem.data('id');

  if (event.keyCode === 13) {
    $(this).blur();
    $.ajax({
      method: 'PUT',
      dataType: 'json',
      url: `/api/v1/articles/${id}`,
      data: $(this).text(),
      success: function() {
        showNotification({
          message: 'Byline Updated Successfully'
        });
      },
      error: function() {
        showNotification({
          status: 'error',
          message: 'Error Updating Byline'
        });
      }
    });
    return false;
  }
});

const highlightHeadline = (color, tag) => {
  $(`#latest-headlines li.${tagName}`).css('background-color', color);
}

$('#filterHeadlines li').click(function(event) {
  let tagName = $(this).data('tagName');
  let color = $(this).css('background-color');
  highlightHeadline(tagName);
});

export const appendArticles = (articles) => {
  let articlesFrag = document.createDocumentFragment();

  articles.forEach(article => {
    let articleElem = document.createElement('li');
    articleElem.dataset.articleId = article.id;

    article.tags.forEach(tag => {
      articleElem.classList.add(tag);
    });

    let headline = document.createElement('p');
    headline.innerText = article.headline;
    headline.dataset.articleId = article.id;

    let saveLink = document.createElement('a');
    saveLink.innerText = 'Save for Offline Reading';
    saveLink.classList.add('saveOffline');

    checkOfflineAvailability(article.id)
    .then(article => {
      if (article) { 
        headline.classList.add('starred');
      } else {
        headline.appendChild(saveLink);
      }
    });

    let byline = document.createElement('span');
    byline.innerText = article.byline;
    byline.classList.add('byline');
    byline.setAttribute('contentEditable', true);

    let datestamp = document.createElement('span');
    datestamp.classList.add('datestamp');
    datestamp.innerText = moment(article.datestamp).format('MMMM Do YYYY, h:mm:ss a');

    articleElem.appendChild(headline);
    articleElem.appendChild(byline);
    articleElem.appendChild(datestamp);
    articlesFrag.appendChild(articleElem);
  });

  $('#latest-headlines').append(articlesFrag);
};

// $('#latest-headlines').on('click', 'span.datestamp', function(event) {
//   let what = 'Thu Jusehsn 15 201tehsregse7 12:49:22 GsethrgserfsMT-0600 (MDT)'
//   let elem = event.currentTarget;
//   elem.innerText = moment(elem.innerText).format('dddd');
// });

$('#latest-headlines').on('click', 'p', function(event) {
  let elem = event.currentTarget;
  let headlineText = elem.innerText;
  headlineText = headlineText.replace('Save for Offline Reading', '');

  let id = elem.dataset.articleId;
  let headline = headlineText;
  let byline = elem.nextSibling.innerText;

  if (elem.classList.contains('starred')) {
    removeOfflineArticle(id)
      .then(() => console.log('successfully removed from idb'))
      .catch(error => {
        throw new Error('Error removing article from DB');
      });
  } else {
    saveOfflineArticle({ id, headline, byline })
      .then(() => console.log('successfully added to indexedDB'))
      .catch(error => {
        throw new Error('Error adding article to DB');
      })
  }

  elem.classList.toggle('starred');
});

const addArticle = (article) => {
  fetch('/api/v1/articles', {
    method: 'POST',
    body: JSON.stringify(article),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(response => response.json())
  .then(articles => appendArticles(articles))
  .catch(error => {
    throw new Error('Error adding article')
  });

}

if ('serviceWorker' in navigator && 'SyncManager' in window && 'Notification' in window) {
  window.addEventListener('load', () => {
    fetchLatestHeadlines();
    navigator.serviceWorker.register('./service-worker.js')
      .then(registration => navigator.serviceWorker.ready)
      .then(registration => {
        Notification.requestPermission();
        $('#submitArticle').on('click', function(event) {
          let headline = $('#headline-input').val();
          let byline = $('#byline-input').val();

          addArticle({ headline, byline, id: new Date() });
          // sendMessage({ 
          //   type: 'add-article',
          //   article: { headline, byline, id: new Date() }
          // });
        });

      }).catch(err => {
        // registration failed :(
        console.log(`ServiceWorker registration failed: ${err}`);
      });
  });
}

navigator.serviceWorker.addEventListener('message', function(event) {
  if (event.data.articles) {
    appendArticles(event.data.articles);
  }
});