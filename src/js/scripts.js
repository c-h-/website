// https://github.com/GoogleChrome/sw-precache
/**
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-env browser */
'use strict';

if ('serviceWorker' in navigator) {
  // Your service-worker.js *must* be located at the top-level directory relative to your site.
  // It won't be able to control pages unless it's located at the same level or higher than them.
  // *Don't* register service worker file in, e.g., a scripts/ sub-directory!
  // See https://github.com/slightlyoff/ServiceWorker/issues/468
  navigator.serviceWorker.register('service-worker.js').then(function(reg) {
    // updatefound is fired if service-worker.js changes.
    reg.onupdatefound = function() {
      // The updatefound event implies that reg.installing is set; see
      // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
      var installingWorker = reg.installing;

      installingWorker.onstatechange = function() {
        switch (installingWorker.state) {
          case 'installed':
            if (navigator.serviceWorker.controller) {
              // At this point, the old content will have been purged and the fresh content will
              // have been added to the cache.
              // It's the perfect time to display a "New content is available; please refresh."
              // message in the page's interface.
              console.log('New or updated content is available.');
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a "Content is cached for offline use." message.
              console.log('Content is now available offline!');
            }
            break;

          case 'redundant':
            console.error('The installing service worker became redundant.');
            break;
        }
      };
    };
  }).catch(function(e) {
    console.error('Error during service worker registration:', e);
  });
}

(function ($, window, document, undefined) {

  var IMG_INTERVAL = 5000;
  var OTHER_INTERVAL = 10000;
  var ACTIVE_CLASS = 'active';
  var ENABLED_CLASS = 'enabled';

  // advances the slide after an interval
  function nextSlide(slideshow, nextUp) {
    var children = $(slideshow).children();
    var currIndex = 0;
    var nextSlide = children[currIndex + 1] ? children[currIndex + 1] : children[currIndex];
    var currChild = children[currIndex];
    for (var i in children) {
      var child = children[i];
      if ($(child).hasClass(ACTIVE_CLASS)) {
        currChild = child;
        currIndex = parseInt(i, 10);
        nextSlide = children[currIndex + 1] ? children[currIndex + 1] : children[0];
        break;
      }
    }
    var interval = $(currChild).is('iframe') ? OTHER_INTERVAL : IMG_INTERVAL;
    setTimeout(function() {
      $(currChild).removeClass(ACTIVE_CLASS);
      $(nextSlide).addClass(ACTIVE_CLASS);
      if (typeof nextUp === 'function') {
        nextUp(slideshow, nextUp);
      }
    }, interval);
  }

  // starts the slideshow
  function startSlideshow(i, slideshow) {
    if ($(slideshow).children().length > 1) {
      $(slideshow).addClass(ENABLED_CLASS);
      $($(slideshow).children()[0]).addClass(ACTIVE_CLASS);
      nextSlide(slideshow, nextSlide);
    }
  }

  // handles moving the shadows according to scroll position
  function updateScrollContainer(scrollTarget, scrollContainer) {
    var leftPosition = $(scrollTarget).scrollLeft();
    var targetWidth = $(scrollTarget)[0].scrollWidth;
    var containerWidth = $(scrollContainer).width();
    if (leftPosition === targetWidth - containerWidth) {
      // don't show right shadow
      $(scrollContainer).addClass('hide-right');
    }
    else {
      $(scrollContainer).removeClass('hide-right');
    }
    if (leftPosition === 0) {
      // don't show left shadow
      $(scrollContainer).addClass('hide-left');
    }
    else {
      $(scrollContainer).removeClass('hide-left');
    }
  }

  // sets up shadows for scrolling containers
  function startCardScollers() {
    var scrollers = [
      ['.card-container', '.card-container-outer']
    ];
    for (var i in scrollers) {
      if ($(scrollers[i][0])[0].scrollWidth === $(scrollers[i][0]).outerWidth()) {
        $(scrollers[i][1]).addClass('hide-left hide-right');
      }
      $(scrollers[i][0]).on('scroll', function() {
        updateScrollContainer(scrollers[i][0], scrollers[i][1]);
      });
    }
  }

  function prepareVideos() {
    if (!window.YT) {
      // Load the IFrame Player API code asynchronously.
      var tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/player_api';
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      var player = {};
      var onReady = function(e) {
        e.target.playVideo();
        e.target.mute();
      };
      window.onYouTubePlayerAPIReady = function() {
        for (var id in player) {
          player[id] = new window.YT.Player(id, {
            height: Math.round(player[id].h).toString(),
            width: Math.round(player[id].w).toString(),
            videoId: id,
            events: {
              onReady: onReady,
            },
            playerVars: {
              modestbranding: 1,
              loop: 1,
              showinfo: 0,
              theme: 'light',
              enablejsapi: 1,
              color: 'white',
              controls: 0,
              disablekb: 1,
              playlist: id,
            }
          });
        }
      };
    }
    $('.vid').each(function(i, elem) {
      var w = $(elem).width();
      var ratioH = (278 * w) / 495;
      // $($(elem).children()[0]).attr('width', w);
      // $($(elem).children()[0]).attr('height', ratioH);
      $(elem).css('height', ratioH);

      var id = $(elem).data('id');
      if (typeof id === 'string') {
        player[id] = { w: w, h: ratioH };
        $(elem).attr('id', id);
      }
    });
  }

  function startGifs() {
    window._giphy = window._giphy || [];
    if (window._giphy.length < 1) {
      window._giphy.push({id: '3oz8xC3irvW5bohdAY',w: 480, h: 270});
      var g = document.createElement('script');
      g.type = 'text/javascript';
      g.async = true;
      g.src = './assets/components/giphy/giphy.js';
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(g, s);
    }
  }

  $(function () {
    prepareVideos();
    startCardScollers();
    startGifs();
    $('.slideshow').each(function(i, slideshow) {
      setTimeout(function() {
        startSlideshow(i, slideshow);
      }, i * 800);
    });
  });

})(jQuery, window, document);
