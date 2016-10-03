/* eslint multiline-ternary: ["warn", "always"], no-multiple-empty-lines: "off", no-implicit-globals: 0, no-tabs: "warn"*/

/**
 * Configs
 */

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

var cfg = {
  swiper: swiperOpts,
  ajx: {
    url: 'data/smartDeals_sample.json',
    prodCtg: [
      'Save on Craves',
      'Sweet Deals'
    ]
  }
}

/**
 * Data operations
 */

var dataOps = function(data, keys) { // DOING:0 change to be able to request amount dynamically
  console.log(data);
  console.log(keys);

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

// TODO break tmps off into seperate files

var templateSwpr = '<li class="swiper-slide"><div class="card"><a class="card-link" href="#"><div class="card-media"></div><div class="item-info"><div class="item-name"><span class="bold">{{description}}</span></div><div class="item-sku"><span class="font_small uppercase">{{skuid}}</span></div><div class="item-price"><span class="bold">${{price}} /EA</span></div></div></a></div></li>';
var templateGrid = '<li class="prod-grid__item"><div class="card"><a class="card-link" href="#"><div class="card-media"></div><div class="item-info"><div class="item-name"><span class="bold">{{description}}</span></div><div class="item-sku"><span class="font_small uppercase">{{skuid}}</span></div><div class="item-price"><span class="bold">${{price}} /EA</span></div></div></a></div></li>'

var templatesArr = [templateSwpr, templateGrid];

var renderSct = function(model) {
  var sections = [],
      section;

  for (var i = 0; i < model.length; i++) {
    section = renderTmp(model[i], templatesArr[i]);

    if (i === 1) {
      every5(section);
    }

    sections.push(section);
  }

  return sections;
}


var renderTmp = function(data, template) { // TODO:10 refactor
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
      addHorzRule(arr, i);
    }
  }

  return arr;
}

var addHorzRule = function(arr, idx) {
  return arr.splice(idx, 0, $('<hr class="prod-grid__rule">'))
}


/**
 * Dom manipulation
 */

var insertTmp = function(input) { // TODO:20 refactor
  var targets = [
    $('.swiper-wrapper'),
    $('.list-wrapper')
  ];

  for (var i = 0; i < targets.length; i++) {
    input[i].forEach(function(val) {
      val.appendTo(targets[i]);
    })
  }

  return targets;
}

/**
 * Event Listeners
 */

$(document).ready(function () {
  $.get(cfg.ajx.url, function(data) {
    insertTmp(dataOps(data, cfg.ajx.prodCtg));
    return mySwiper = new Swiper('.swiper-container', cfg.swiper);
  }, 'json')
})
