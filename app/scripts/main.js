/* eslint no-loop-func: 0, dot-location: 0, no-warning-comments: 0, no-inline-comments: 0, no-ternary: 0, no-plusplus: 0, id-length: 0, multiline-ternary: ["warn", "never"], no-multiple-empty-lines: "off", no-implicit-globals: 0, no-tabs: "warn"*/

/** **********************************************************
 * Configs
 ***********************************************************/

 var swiperOpts = {
   grabCursor: true,
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
    },
    1440: {
      slidesPerView: 3,
      slidesPerGroup: 3
    }
   }
 }

var templateSwpr = '<li class="swiper-slide"><div class="card"><a class="card-link" href="#"><div class="card-media"></div><div class="item-info"><div class="item-name"><span class="bold">{{description}}</span></div><div class="item-sku"><span class="font_small uppercase">{{skuid}}</span></div><div class="item-price"><span class="bold">${{price}} /EA</span></div></div></a></div></li>';
var templateGrid = '<li class="prod-grid__item" data-brand="{{brand}}" data-price="{{price}}"><div class="card"><a class="card-link" href="#"><div class="card-media"></div><div class="item-info"><div class="item-name"><span class="bold">{{description}}</span></div><div class="item-sku"><span class="font_small uppercase">{{skuid}}</span></div><div class="item-price"><span class="bold">${{price}} /EA</span></div></div></a></div></li>';

var cfg = {
  swiper: swiperOpts,
  ajx: {
    url: 'data/smartDeals_sample.json',
    prodCtg: [
      'Save on Craves',
      'Sweet Deals'
    ]
  },
  domTrg: [
    '.swiper-wrapper',
    '.list-wrapper'
  ],
  tmps: [
    templateSwpr,
    templateGrid
  ]
}

/** ***********************************************************
 * Data operations
 *************************************************************/

var dataOps = function(data, categories, limiter, selectors) {
  var chunk = data.slice(1, limiter);

  var filterDATA = function(key) {
     return chunk.filter(function(elem) {
       return elem.category === key;
     })
  }

  var iterator = function(keys) {
    var models = []
    for (var i = 0; i < (typeof keys === 'string' ? 1 : keys.length); i++) {
      models.push(filterDATA(typeof keys === 'string' ? keys : keys[i]));
    }

    return models;
  }

  return iterator(categories);
}


/** ***********************************************************
* templating
*************************************************************/

var renderSct = function(model, tmps) {
  var sections = [],
      section;

  for (var i = 0; i < model.length; i++) {

    section = renderTmp(model[i], typeof tmps === 'string' ? tmps : tmps[i]);

    // if (section[0].attr('class') === 'prod-grid__item') {
    //   every5(section);
    // }

    sections.push(section);
  }

  return sections;
}


var renderTmp = function(data, template) {
  var $output = [],
      $member;

  data.forEach(function(val) {
   rendering = Mustache.render($.isArray(template) ? template[0] : template, val);
   $member = addBgImg(rendering, val);
   $output.push($member);
 })

 return $output;
}

var addBgImg = function(elem, data) {
  var $elem = $(elem);
  $elem
    .find('.card-media')
    .css('background-image', 'url(' + data.imgURL + ')');

  return $elem;
}

// var every5 = function(arr) {
//   for (var i = arr.length; i > 0; i--) {
//     if (i % 5 === 0) {
//       addHorzRule(arr, i);
//     }
//   }
//
//   return arr;
// }
//
// var addHorzRule = function(arr, idx) {
//   return arr.splice(idx, 0, $('<hr class="prod-grid__rule">'))
// }


/** ******************************************************************
 * Dom manipulation
 *******************************************************************/

var initTrg = [
  $(cfg.domTrg[0]),
  $(cfg.domTrg[1])
];

var insertTmp = function(input, targets) {

  for (var i = 0; i < ((typeof targets === 'string') ? 1 : targets.length); i++) {
    input[i].forEach(function(val) {
      val.appendTo(typeof targets === 'string' ? targets : targets[i]);
    })
  }

  return targets;
}

/**
 * offset horizontal rules
 */

var findGreatest = function(items) {
 var prev = $(items[0]).height();
 for (var i = 0; i < items.length; i++) {
   var height = $(items[i]).height();
   if (height > prev) {
     prev = height
   }
 }
 return prev;
}

var findGreatestPB = function(items) {
 return parseInt($(items[0]).css('padding-bottom'));
}

var setSlideHeight = function($selector) {
  setTimeout(function() {
    var slides = $($selector);
    var cards = $(slides).find('.card');
    var totalPadding = 32;
    var cardMedia = $($selector).find('.card-media');
    var cardInfo = $($selector).find('.item-info');
    var cardMediaHt = findGreatestPB(cardMedia);
    var cardInfoHt = findGreatest(cardInfo)
    var tallest = +cardMediaHt + cardInfoHt + totalPadding;
    // var slidesHeight = findGreatest(slides);
    // var cardsHeight = findGreatest(cards);
    for (var i = 0; i < cards.length; i++) {
      $(cards[i]).height(tallest);
    }
  }, 100)
}


/** *****************************************************************
 * Event Listeners
 ******************************************************************/

var registerEvents = function() {

  $('.view-more').on('click', function(event) {
    $.get(cfg.ajx.url, function(data, clicked) {
      var models = dataOps(data, cfg.ajx.prodCtg[1], 45, cfg.domTrg[0]);
      var tmps = renderSct(models, cfg.tmps[1]);
      var htmlEls = [];
      for (var i = 0; i < tmps[0].length; i++) {
        htmlEls.push(tmps[0][i][0]);
      }
      $('.list-wrapper').imagesLoaded({background: '.card-media'}, function(imgLoad) {
        gridIso.append(htmlEls)
          .isotope('appended', htmlEls);
      })
    }, 'json')
  })

  $('.filter-select').on('change', function() {
    // Isotope filter
    var str = this.value;
    if (str === '*') {
      gridIso.isotope({
        filter: str
      })
    } else {
      var str = this.value.match(/\w+/)[0];
      gridIso.isotope({
        filter() {
          return $(this).data().brand ===  str;
        }
      })
    }
  })

  $('.sort-select').on('change', function() {
    var sortByValue = this.value;
    gridIso.isotope({ sortBy: sortByValue });
  })

  $(window).resize(function() {
    var rules = $('.prod-grid__rule');
    var slides = $('.swiper-slide');
    setSlideHeight(slides);
    rules.css('opacity', 0);
    offsetHr($('.prod-grid__item'));
    setTimeout(rules.css('opacity', 1), 1000);
  })
}

/** *****************************************************************
 * setup
 ******************************************************************/

var gridIso = null;
var mySwiper = null;

var init = function(data) {
  var models = dataOps(data, cfg.ajx.prodCtg, 45, cfg.domTrg);
  var tmps = renderSct(models, cfg.tmps);
  var domEls = insertTmp(tmps, initTrg);
  $('.list-wrapper').imagesLoaded({background: '.card-media'}, function(imgLoad) {
    gridIso = $('.list-wrapper').isotope({
      itemSelector: '.prod-grid__item',
      layoutMode: 'fitRows',
      getSortData: {
        name: '.item-name',
        price: '.item-price > span parseFloat',
      }
    })
  })
  mySwiper = new Swiper('.swiper-container', cfg.swiper);
  setSlideHeight('.swiper-slide');
}

/** *****************************************************************
 * init
 ******************************************************************/

$(document).ready(function () {
  $.get(cfg.ajx.url, function(data) {
    init(data);
  }, 'json')
  registerEvents();
})
