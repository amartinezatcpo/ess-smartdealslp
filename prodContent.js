/********* Build Product Tile Content *********/
var navCount = 0; //Setup count for navigation
for (var category in prodData) {
	var html = ''; //Prepare HTML var for prod elements
	var nav = '' //Prepare HTML for title link
	var index = 1; //Set count for product
	var skus = prodData[category]; 
	
	html += '<div class="swiper-slide prodgroup" data-hash="' + category.replace(/\s/g, "").toLowerCase() + '">'

	for (var prod in skus) {
		var sku = skus[prod].skuid;
		var img = skus[prod].imgURL;
		var desc = skus[prod].description;

		//Build Product Tile
		html += '<div class="ess-link prodTile ess-product" data-itemName="' + sku + '" data-itemPosition="' + index++ + '">';
			html += '<a href="#" class="ess-link">';
				html += '<img width="300" src="' + img + '"/>';
				html += '<div class="prodCopy">'
					html += '<div class="pname">' + desc + '</div>';		
					html += '<div class="psku clsidProdItemIdES">' + sku + '</div>';
					html += '<div class="pprice clsidProdItemPriceES">PRICE</div>';		
				html += '</div>'
			html += '</a>';
		html += '</div>';
	}
	
	html += '</div>';
	
	// Create product tiles Nav
	var navClass = (navCount === 0) ? "titleLink active" : "titleLink" //Add active to first Nav link
	nav += '<div class="' + navClass + '" data-index="' + navCount++ + '">' + category  + '</div>'

	/********* Append to DOM *********/
	//Product Tiles
	var prodTiles = document.getElementById('prodTileCont');
	prodTiles.innerHTML += html;
	
	//Product Navigation
	var titleLinks = document.getElementById('titleLinkCont')
	titleLinks.innerHTML += nav;
}