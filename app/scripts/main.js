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
  //  slidesOffsetBefore: 48,
  //  slidesOffsetAfter: 48,
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
 }

var templateSwpr = '<li class="swiper-slide"><div class="card"><a class="card-link" href="#"><div class="card-media"></div><div class="item-info"><div class="item-name"><span class="bold">{{description}}</span></div><div class="item-sku"><span class="font_small uppercase">{{skuid}}</span></div><div class="item-price"><span class="bold">${{price}} /EA</span></div></div></a></div></li>';
var templateGrid = '<li class="prod-grid__item"><div class="card"><a class="card-link" href="#"><div class="card-media"></div><div class="item-info"><div class="item-name"><span class="bold">{{description}}</span></div><div class="item-sku"><span class="font_small uppercase">{{skuid}}</span></div><div class="item-price"><span class="bold">${{price}} /EA</span></div></div></a></div></li>';

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

    if (section[0].attr('class') === 'prod-grid__item') {
      every5(section);
    }

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

var every5 = function(arr) {
  for (var i = arr.length; i > 0; i--) {
    if (i % 5 === 0) {
      addHorzRule(arr, i);
    }
  }

  return arr;
}

var addHorzRule = function(arr, idx) {
  return arr.splice(idx, 0, $('<hr class="prod-grid__rule">'))
}


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
 * Isotope
 */



/** *****************************************************************
 * Event Listeners
 ******************************************************************/
var registerEvents = function() {

  $('.view-more').on('click', function(event) {
    $.get(cfg.ajx.url, function(data, clicked) {
      var models = dataOps(data, cfg.ajx.prodCtg[1], 45, cfg.domTrg[0]);
      var tmps = renderSct(models, cfg.tmps[1]);
      var htmlEls = []
      for (var i = 0; i < tmps[0].length; i++) {
        htmlEls.push(tmps[0][i][0]);
      }
      $('.list-wrapper').imagesLoaded({background: '.card-media'}, function(imgLoad) {
        gridIso.append(htmlEls).isotope('appended', htmlEls);
      })
    }, 'json')
  })

}

/** *****************************************************************
 * init
 ******************************************************************/

var gridIso = null;

var init = function(data) {
  var models = dataOps(data, cfg.ajx.prodCtg, 45, cfg.domTrg);
  var tmps = renderSct(models, cfg.tmps);
  var domEls = insertTmp(tmps, initTrg);
  $('.list-wrapper').imagesLoaded({background: '.card-media'}, function(imgLoad) {
    console.log(imgLoad.images.length);
    gridIso = $('.list-wrapper').isotope({
      itemSelector: '.prod-grid__item',
      layoutMode: 'fitRows'
    })
    var rules = $('.prod-grid__rule');
    var items = $('.prod-grid__item');
    for (var i = 0; i < items.length; i++) {
      if (i % 5 === 0) {
        var offset = $(items[i]).offset().top;
        var height = $(items[i]).height();
        console.log(i, i / 5, $(rules[i / 5]), $(items[i]).offset());
        $(rules[i / 5]).offset({top: offset + height + 48 + 32});
      }
    }
  })
}


$(document).ready(function () {
  $.get(cfg.ajx.url, function(data) {
    init(data);
    return mySwiper = new Swiper('.swiper-container', cfg.swiper);
  }, 'json')
  registerEvents();
})
