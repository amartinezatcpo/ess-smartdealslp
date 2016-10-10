/* eslint no-loop-func: 0, dot-location: 0, no-warning-comments: 0, no-inline-comments: 0, no-ternary: 0, no-plusplus: 0, id-length: 0, multiline-ternary: ["warn", "never"], no-multiple-empty-lines: "off", no-implicit-globals: 0, no-tabs: "warn"*/

/** **********************************************************
 * Configs
 ***********************************************************/

// jQuery no-conflict

  var j$ = $.noConflict();

// App configs

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

var templateSwpr = '<li class="swiper-slide"><div class="card"><a class="card-link" href="#"><div class="card-media"></div><div class="item-info"><div class="item-name"><span class="bold">{{description}}</span></div><div class="item-sku"><span class="font_small uppercase">{{skuid}}</span></div><div class="item-price"><span class="bold">j${{price}} /EA</span></div></div></a></div></li>';
var templateGrid = '<li class="prod-grid__item" data-brand="{{brand}}" data-price="{{price}}"><div class="card"><a class="card-link" href="#"><div class="card-media"></div><div class="item-info"><div class="item-name"><span class="bold">{{description}}</span></div><div class="item-sku"><span class="font_small uppercase">{{skuid}}</span></div><div class="item-price"><span class="bold">j${{price}} /EA</span></div></div></a></div></li>';

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

    sections.push(section);
  }

  return sections;
}


var renderTmp = function(data, template) {
  var j$output = [],
      j$member;

  data.forEach(function(val) {
   rendering = Mustache.render(j$.isArray(template) ? template[0] : template, val);
   j$member = addBgImg(rendering, val);
   j$output.push(j$member);
 })

 return j$output;
}

var addBgImg = function(elem, data) {
  var j$elem = j$(elem);
  j$elem
    .find('.card-media')
    .css('background-image', 'url(' + data.imgURL + ')');

  return j$elem;
}


/** ******************************************************************
 * Dom manipulation
 *******************************************************************/

var initTrg = [
  j$(cfg.domTrg[0]),
  j$(cfg.domTrg[1])
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
 var prev = j$(items[0]).height();
 for (var i = 0; i < items.length; i++) {
   var height = j$(items[i]).height();
   if (height > prev) {
     prev = height
   }
 }
 return prev;
}

var findGreatestPB = function(items) {
 return parseInt(j$(items[0]).css('padding-bottom'));
}

var setSlideHeight = function(j$selector) {
  setTimeout(function() {
    var slides = j$(j$selector);
    var cards = j$(slides).find('.card');
    var totalPadding = 32;
    var cardMedia = j$(j$selector).find('.card-media');
    var cardInfo = j$(j$selector).find('.item-info');
    var cardMediaHt = findGreatestPB(cardMedia);
    var cardInfoHt = findGreatest(cardInfo)
    var tallest = +cardMediaHt + cardInfoHt + totalPadding;
    // var slidesHeight = findGreatest(slides);
    // var cardsHeight = findGreatest(cards);
    for (var i = 0; i < cards.length; i++) {
      j$(cards[i]).height(tallest);
    }
  }, 100)
}


/** *****************************************************************
 * Event Listeners
 ******************************************************************/

var registerEvents = function() {

  j$('.view-more').on('click', function(event) {
    j$.get(cfg.ajx.url, function(data, clicked) {
      var models = dataOps(data, cfg.ajx.prodCtg[1], 45, cfg.domTrg[0]);
      var tmps = renderSct(models, cfg.tmps[1]);
      var htmlEls = [];
      for (var i = 0; i < tmps[0].length; i++) {
        htmlEls.push(tmps[0][i][0]);
      }
      j$('.list-wrapper').imagesLoaded({background: '.card-media'}, function(imgLoad) {
        gridIso.append(htmlEls)
          .isotope('appended', htmlEls);
      })
    }, 'json')
  })

  j$('.filter-select').on('change', function() {
    // Isotope filter
    var str = this.value;
    if (str === '*') {
      gridIso.isotope({filter: str})
    } else {
      var str = this.value.match(/\w+/)[0];
      gridIso.isotope({
        filter: function() {
          return j$(this).data().brand === str;
        }
      })
    }
  })

  j$('.sort-select').on('change', function() {
    var sortByValue = this.value;
    gridIso.isotope({sortBy: sortByValue});
  })

  j$(window).resize(function() {
    var rules = j$('.prod-grid__rule');
    var slides = j$('.swiper-slide');
    setSlideHeight(slides);
    rules.css('opacity', 0);
    offsetHr(j$('.prod-grid__item'));
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
  j$('.list-wrapper').imagesLoaded({background: '.card-media'}, function(imgLoad) {
    gridIso = j$('.list-wrapper').isotope({
      itemSelector: '.prod-grid__item',
      layoutMode: 'fitRows',
      getSortData: {
        name: '.item-name',
        price: '.item-price > span parseFloat'
      }
    })
  })
  mySwiper = new Swiper('.swiper-container', cfg.swiper);
  setSlideHeight('.swiper-slide');
}

/** *****************************************************************
 * init
 ******************************************************************/

j$(document).ready(function () {
  j$.get(cfg.ajx.url, function(data) {
    init(data);
  }, 'json')
  registerEvents();
})
