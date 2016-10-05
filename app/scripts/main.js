/* eslint multiline-ternary: ["warn", "always"], no-multiple-empty-lines: "off", no-implicit-globals: 0, no-tabs: "warn"*/

/** **********************************************************
 * Configs
 ***********************************************************/

 var swiperOpts = {
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

// DOING:0 change to be able to request amount dynamically

var dataOps = function(data, keys, iterator, selectors) {
  var chunk = data.slice(1, iterator);

  var filterDATA = function(key) {
     return chunk.filter(function(elem) {
       return elem.category === key;
     })
  }

  var iterator = function(keys) {
    var models = []
    if (typeof keys === 'string') {
      models.push(filterDATA(keys));
    } else {
      for (var i = 0; i < keys.length; i++) {
        models.push(filterDATA(keys[i]));
      }
    }
    return models;
  }

  return iterator(keys);
}


/** ***********************************************************
* templating
*************************************************************/

var renderSct = function(model, tmps) {
  var sections = [],
      section;

  for (var i = 0; i < model.length; i++) {

    section = renderTmp(model[i], (typeof tmps === 'string' ? tmps : tmps[i]));

    if (i === 1) {
      every5(section);
    }

    sections.push(section);
  }

  return sections;
}


var renderTmp = function(data, template) { // TODO:10 refactor
  var output = {},
      $arr = [],
      $instance;

  data.forEach(function(val) {
   rendering = Mustache.render($.isArray(template) ? template[0] : template, val);
   $instance = addBgImg(rendering, val);
   $arr.push($instance);
 })

 output[data['key']] = $arr;
 output.key = data.key;
 output.selector = data.selector;

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
    if ((i !== arr.length) && (i % 5 === 0)) {
      addHorzRule(arr, i);
    }
  }

  return arr;
}

var addHorzRule = function(arr, idx) {
  return arr[arr.key].splice(idx, 0, $('<hr class="prod-grid__rule">'))
}


/** ******************************************************************
 * Dom manipulation
 *******************************************************************/
 var initTrg = [
   $(cfg.domTrg[0]),
   $(cfg.domTrg[1])
 ];

var insertTmp = function(input, targets) { // TODO:20 refactor

  for (var i = 0; i < targets.length; i++) {
    input[i][input[i]['key']].forEach(function(val) {
      val.appendTo(typeof targets === 'string' ? targets : targets[i]);
    })
  }

  return targets;
}

/** *****************************************************************
 * Event Listeners
 ******************************************************************/
var registerEvents = function() {

  $('.view-more').on('click', function(event) {
    var clicked = this;
    console.log(clicked);
    $.get(cfg.ajx.url, function(data, clicked) {
      var models = dataOps(data, cfg.ajx.prodCtg[1], 45, cfg.domTrg[1]);
      var tmps = renderSct(models, cfg.tmps[1]);
      var domeEls = insertTmp(tmps, cfg.domTrg[1]);
    }, 'json')
  })

}

/** *****************************************************************
 * init
 ******************************************************************/

var init = function(data) {
  var models = dataOps(data, cfg.ajx.prodCtg, 45, cfg.domTrg);
  var tmps = renderSct(models, cfg.tmps);
  var domEls = insertTmp(tmps, initTrg);
}


$(document).ready(function () {
  $.get(cfg.ajx.url, function(data) {
    init(data);
    return mySwiper = new Swiper('.swiper-container', cfg.swiper);
  }, 'json')
  registerEvents();
})
