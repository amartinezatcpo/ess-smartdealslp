/* eslint multiline-ternary: ["warn", "always"], no-tabs: "warn"*/

$(document).ready(function () {

/**
 * Get data…
 */

  var xhr = new XMLHttpRequest(),
     method = 'GET',
     url = 'data/smartDeals_sample.json';

  xhr.open(method, url, true);
  xhr.onreadystatechange = function () {
    var xhrData;

    if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      xhrData = JSON.parse(xhr.responseText);
      var a = dataOps(xhrData, ['Save on Craves', 'Sweet Deals']);
      var b = insertTmp(a);
    }
  };
  xhr.send();

  /**
   * Data operations
   */

  // var models = [];

  var dataOps = function(data, keys) {
    var model = [],
        filtered;

    for (var i = 0; i < keys.length; i++) {
      filtered = data.filter(function(elem) {
                  return elem.category === keys[i];
                });

      model.push(filtered);
    }

    return renderSct(model);
  }

  /**
   * templating
   */

  var templateCard = '<li class="prod-grid__item"<div class="card"><a class="card-link" href="#"><div class="card-media"></div><div class="item-info"><div class="item-name"><span class="bold">{{description}}</span></div><div class="item-sku"><span class="font_small uppercase">{{skuid}}</span></div><div class="item-price"><span class="bold">{{price}}</span></div></div></a></div></li>';

  var renderSct = function(model) {
    var sections = [],
        section;

    for (var i = 0; i < model.length; i++) {
      section = renderTmp(model[i], templateCard);

      if (i === 1) {
        every5(section);
      }

      sections.push(section);
    }

    return sections;
  }

  var renderTmp = function(data, template) {
    var output = [],
        instance;

    data.forEach(function(val) {
     rendering = Mustache.render(template, val);
     instance = addBgImg(rendering, val);
     output.push(instance);
   })

   return output;
  }

  var addBgImg = function(elem, data) {
    var $elem = $(elem);
    $elem
      .find('.card-media')
      .css('background-image', 'url(' + data.imgURL + ')');

    return $elem;
  }

  var every5 = function(arr) {
    for (var i = arr.length; i > 0; i--) {
      if ((i !== 20) && (i % 5 === 0)) {
        addHorRule(arr, i);
      }
    }

    return arr;
  }

  var addHorRule = function(arr, idx) {
    return arr.splice(idx, 0, $('<hr class="prod-grid__rule">'))
  }


  /**
   * Dom manipulation
   */

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
