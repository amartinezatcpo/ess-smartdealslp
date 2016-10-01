/* eslint multiline-ternary: ["warn", "always"], no-tabs: "warn"*/

$(document).ready(function () {
  var templateCard = '<li class="prod-grid__item"><div class="card"><a class="card-link" href="#"><div class="card-media"></div><div class="item-info"><div class="item-name"><span class="bold">{{name}}</span></div><div class="item-sku"><span class="font_small uppercase">{{sku}}</span></div><div class="item-price"><span class="bold">{{price}}</span></div></div></a></div></li>';

/**
 * Get data…
 */

  var xhr = new XMLHttpRequest(),
     method = 'GET',
    //  url = 'data/prodJsonTest.json';
     url = 'data/mock.json';

  xhr.open(method, url, true);
  xhr.onreadystatechange = function () {
    var xhrData;

    if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      xhrData = JSON.parse(xhr.responseText);
      var a = renderTmp(xhrData, templateCard);
      var b = addBgImg(a, xhrData);
      var c = every5(b);
      var d = insertTmp(c);
    }
  };
  xhr.send();


/**
 * templating
 */

  var renderTmp = function(data, template) {
    var output = [];

    data.forEach(function(val) {
     rendering = Mustache.render(template, val);
     output.push($(rendering));
   })

   return output;
  }

  var addBgImg = function(arr, data) {
    arr.forEach(function($val, idx) {
      console.log($val, data[idx].img);
      $val
        .find('.card-media')
        .css('background-image', 'url(' + data[idx].img + ')');
    })

    return arr;
  }

  var every5 = function(arr) {
    for (var i = 0; i < arr.length; i++) {
      if ((i) % 6 === 0) {
        addHorRule(arr, i);
      }
    }

    return arr;
  }

  var addHorRule = function(arr, idx) {
    return arr.splice(idx, 0, $('<hr class="prod-grid__rule">'))
  }

  var insertTmp = function(input) {
    var target = $('.list-wrapper');
    input.forEach(function(val, idx) {
      $(val).appendTo(target);
    })

    return target;
  }

/**
 * Swiper init & config
 */

  var mySwiper = new Swiper ('.swiper-container', {
   prevButton: '.swiper-button-prev',
   nextButton: '.swiper-button-next',
   slidesPerView: 4,
   slidesPerGroup: 4,
   spaceBetween: 24,
   breakpoints: {
     480: {
       slidesPerView: 1,
       slidesPerGroup: 1
     },
     768: {
       slidesPerView: 2,
       slidesPerGroup: 2
     }
   }
  })


  /**
   * Event Listeners
   */

 });
