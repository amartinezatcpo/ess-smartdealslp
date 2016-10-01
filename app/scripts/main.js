/* eslint multiline-ternary: ["warn", "always"], no-tabs: "warn"*/

$(document).ready(function () {
  var templateCard = '<li class="prod-grid__item"><div class="card"><a class="card-link" href="#"><div class="card-media"></div><div class="item-info"><div class="item-name"><span class="bold">{{name}}</span></div><div class="item-sku"><span class="font_small uppercase">{{sku}}</span></div><div class="item-price"><span class="bold">{{price}}</span></div></div></a></div></li>';
  var templateCard2 = '<div class="card"><a class="card-link" href="#"><div class="card-media"></div><div class="item-info"><div class="item-name"><span class="bold">{{name}}</span></div><div class="item-sku"><span class="font_small uppercase">{{sku}}</span></div><div class="item-price"><span class="bold">{{price}}</span></div></div></a></div>';
  var target = $('#list-wrapper');

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
      insertTmp(renderTmp(xhrData, templateCard));
    }
  };
  xhr.send();


  /**
   * templating
   */

  var renderTmp = function(data, template) {
    var output = '';

    data.forEach(function(val, idx) {
     output += Mustache.render(template, val);
     if ((idx + 1) % 5 === 0) {
       console.log(idx);
       output += '<hr class="prod-grid__rule">';
     }
    })

    return output;
  }

  var insertTmp = function(input) {
    $(input).appendTo(target);
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
