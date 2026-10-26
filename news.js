/* Shared renderer: both the home News carousel and full articles use news-data.js. */
(function () {
  'use strict';

  var data = window.YuqiNewsData;
  if (!data || !Array.isArray(data.posts) || data.posts.length === 0) {
    throw new Error('News cannot render: YuqiNewsData is missing or has no published posts.');
  }
  var ids = new Set();
  ['en', 'de', 'ct'].forEach(function (lang) {
    if (!data.translations || !data.translations[lang]) {
      throw new Error('News cannot render: missing translation set for ' + lang + '.');
    }
  });
  data.posts.forEach(function (post) {
    if (!post || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.id) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(post.sortDate) ||
        !post.titleKey || !post.dateKey || !Array.isArray(post.paragraphs) ||
        !post.paragraphs.length || !Array.isArray(post.images) || !post.images.length ||
        post.images.some(function (image) { return !image || !image.src || !image.alt; }) ||
        ids.has(post.id)) {
      throw new Error('News cannot render: invalid or duplicate published post data.');
    }
    var parsedDate = new Date(post.sortDate + 'T00:00:00Z');
    if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== post.sortDate) {
      throw new Error('News cannot render: invalid ISO sort date for ' + post.id + '.');
    }
    ['en', 'de', 'ct'].forEach(function (lang) {
      [post.titleKey, post.dateKey].concat(post.paragraphs).forEach(function (key) {
        if (!data.translations[lang][key]) {
          throw new Error('News cannot render: missing ' + lang + ' text for ' + key + '.');
        }
      });
    });
    ids.add(post.id);
  });

  var posts = data.posts.slice().sort(function (a, b) {
    return b.sortDate.localeCompare(a.sortDate);
  });
  var homeTrack = document.getElementById('gallery-track');
  var blogRoot = document.getElementById('news-posts');
  var currentLanguage = window.SiteI18n && window.SiteI18n.getLanguage
    ? window.SiteI18n.getLanguage() : 'en';

  function translation(lang, key) {
    var value = data.get(lang, key);
    if (!value) throw new Error('News translation is missing: ' + lang + '/' + key);
    return value;
  }

  function plainText(markup) {
    var node = document.createElement('div');
    node.innerHTML = markup;
    return (node.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function renderHome() {
    if (!homeTrack) return;
    var existing = Array.from(homeTrack.querySelectorAll('.news-slide'));
    if (existing.length !== posts.length) {
      homeTrack.replaceChildren();
      existing = posts.map(function () {
        var figure = document.createElement('figure');
        figure.className = 'gallery-slide news-slide';
        figure.setAttribute('role', 'group');
        var imageArea = document.createElement('div');
        imageArea.className = 'gallery-image-area news-image-area';
        var link = document.createElement('a');
        link.className = 'news-image-link';
        var image = document.createElement('img');
        image.decoding = 'async';
        link.appendChild(image);
        imageArea.appendChild(link);
        figure.appendChild(imageArea);
        var date = document.createElement('time');
        date.className = 'news-card-date';
        figure.appendChild(date);
        var caption = document.createElement('figcaption');
        figure.appendChild(caption);
        homeTrack.appendChild(figure);
        return figure;
      });
    }
    posts.forEach(function (post, index) {
      var title = translation(currentLanguage, post.titleKey);
      var dateText = translation(currentLanguage, post.dateKey);
      var figure = existing[index];
      var captionId = 'news-caption-' + index;
      var dateId = 'news-date-' + index;
      figure.setAttribute('aria-labelledby', dateId + ' ' + captionId);
      var link = figure.querySelector('.news-image-link');
      link.href = 'blog.html#' + post.id;
      link.setAttribute('aria-label', title);
      link.title = title;
      var image = link.querySelector('img');
      image.src = post.images[0].src;
      image.alt = post.images[0].alt;
      image.loading = index < 2 ? 'eager' : 'lazy';
      var date = figure.querySelector('.news-card-date');
      date.id = dateId;
      date.dateTime = post.sortDate;
      date.textContent = dateText;
      var caption = figure.querySelector('figcaption');
      caption.id = captionId;
      caption.textContent = post.paragraphs.map(function (key) {
        return plainText(translation(currentLanguage, key));
      }).filter(Boolean).join(' ');
    });
    homeTrack.dataset.newsReady = 'true';
  }

  function renderBlog() {
    if (!blogRoot) return;
    posts.forEach(function (post) {
      var article = document.getElementById(post.id);
      if (!article) {
        article = document.createElement('article');
        article.className = 'blog-post';
        article.id = post.id;
        var heading = document.createElement('h2');
        article.appendChild(heading);
        var date = document.createElement('p');
        date.className = 'blog-date';
        date.appendChild(document.createElement('time'));
        article.appendChild(date);

        if (post.images.length > 1) {
          var carousel = document.createElement('div');
          carousel.className = 'carousel-container news-image-carousel';
          carousel.setAttribute('role', 'group');
          var previous = document.createElement('button');
          previous.className = 'carousel-btn prev';
          previous.type = 'button';
          previous.textContent = '←';
          previous.addEventListener('click', function () { changeNewsImage(carousel, -1); });
          carousel.appendChild(previous);
          post.images.forEach(function (item, index) {
            var image = document.createElement('img');
            image.src = item.src;
            image.alt = item.alt;
            image.className = 'blog-image carousel-image' + (index === 0 ? ' active' : '');
            image.hidden = index !== 0;
            image.dataset.imageIndex = String(index);
            carousel.appendChild(image);
          });
          var next = document.createElement('button');
          next.className = 'carousel-btn next';
          next.type = 'button';
          next.textContent = '→';
          next.addEventListener('click', function () { changeNewsImage(carousel, 1); });
          carousel.appendChild(next);
          var status = document.createElement('span');
          status.className = 'news-image-status';
          status.setAttribute('aria-live', 'polite');
          status.setAttribute('aria-atomic', 'true');
          status.textContent = '1 / ' + post.images.length;
          carousel.appendChild(status);
          article.appendChild(carousel);
        } else {
          var image = document.createElement('img');
          image.src = post.images[0].src;
          image.alt = post.images[0].alt;
          image.className = 'blog-image';
          article.appendChild(image);
        }
        post.paragraphs.forEach(function () {
          article.appendChild(document.createElement('p'));
        });
        blogRoot.appendChild(article);
      }

      article.querySelector('h2').innerHTML = translation(currentLanguage, post.titleKey);
      var date = article.querySelector('.blog-date time');
      date.dateTime = post.sortDate;
      date.textContent = translation(currentLanguage, post.dateKey);
      var carousel = article.querySelector('.news-image-carousel');
      if (carousel) {
        carousel.setAttribute('aria-label', translation(currentLanguage, post.titleKey));
        var labels = data.controls[currentLanguage] || data.controls.en;
        carousel.querySelector('.prev').setAttribute('aria-label', labels.previous);
        carousel.querySelector('.next').setAttribute('aria-label', labels.next);
      }
      Array.from(article.querySelectorAll(':scope > p:not(.blog-date)')).forEach(function (paragraph, index) {
        paragraph.innerHTML = translation(currentLanguage, post.paragraphs[index]);
      });
    });
  }

  function changeNewsImage(carousel, direction) {
    var images = Array.from(carousel.querySelectorAll('.carousel-image'));
    var active = images.findIndex(function (image) { return !image.hidden; });
    var nextIndex = (active + direction + images.length) % images.length;
    images.forEach(function (image, index) {
      image.hidden = index !== nextIndex;
      image.classList.toggle('active', index === nextIndex);
    });
    carousel.querySelector('.news-image-status').textContent =
      (nextIndex + 1) + ' / ' + images.length;
  }

  function render() {
    renderHome();
    renderBlog();
  }

  render();
  document.addEventListener('languagechange', function (event) {
    currentLanguage = event.detail && event.detail.language
      ? event.detail.language : (window.SiteI18n.getLanguage() || 'en');
    render();
  });
})();
