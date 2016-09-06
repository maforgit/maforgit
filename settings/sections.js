'use strict';

function getSections() {
	return {
		"ABOUT" : {
			"name" : {
				"en" : "ABOUT US",
				"fr" : "À PROPOS DE NOUS",
				"ru" : "ОДЕЖДА: ОПТ/МЕЛКИЙ ОПТ"
			},
			"description" : {
				"en" : "Welcome to our store!",
				"fr" : "Bienvenue dans notre magasin!",
				"ru" : "<br>РОССИЯ • БЕЛОРУССИЯ • ТУРЦИЯ • КИТАЙ"
			},
			"header" : {
				en : "file:///custom/about/about_en.html",
				fr : "file:///custom/about/about_fr.html",
				ru : "file:///custom/about/about_ru.html"
			}
		},
		"NEW" : {
			"name" : {
				"en" : "NEW",
				"fr" : "NOUVEAU",
				"ru" : "НОВЫЕ ПОСТУПЛЕНИЯ"
			},
			"description" : {
				"en" : "Newest things here (%1 items)",
				"fr" : "Nouveaux choses (%1 articles)",
				"ru" : "сезон зима-лето 2017 (товаров: %1)"
			},
			menu : true
		},
		"RAINCOATS" : {
			"name" : {
				"en" : "RAINCOATS",
				"fr" : "IMPERMÉABLES",
				"ru" : "ПЛАЩИ"
			},
			"description" : {
				"en" : "%1 item(s)",
				"fr" : "%1 article(s)",
				"ru" : "товаров: %1"
			},
			menu : true
		},
		"WHOLESALE" : {
			"name" : {
				"en" : "WHOLESALE",
				"fr" : "DE GROS",
				"ru" : "РАСПРОДАЖА"
			},
			"description" : {
				"en" : "%1 item(s)",
				"fr" : "%1 article(s)",
				"ru" : "фабричные остатки по низким ценам (товаров: %1)"
			},
			menu : true
		},
		"ID_CART" : {
			"name" : {
				en : "CART (%1) %2",
				fr : "MON PANIER (%1) %2",
				ru : "КОРЗИНА (%1) %2"
			},
			"description" : {
				"en" : "%1 item(s)",
				"fr" : "%1 article(s)",
				"ru" : "товаров: %1"
			},
			menu : true
		},
		"ID_ORDER" : {
			"name" : "ORDER",
			"description" : "Print Order",
			menu : false,
			"header" : "file:///custom/order_options/order_options.html",
			"footer" : ""
		},
		"ID_CHECKOUT" : {
			"name" : "CHECKOUT",
			"description" : "Checkout",
			menu : false
		},
		"ID_AFTER_THE_PURCHASE" : {
			"name" : "AFTER THE PURCHASE",
			"description" : "",
			menu : false,
			"header" : {
				"en" : 'file:///custom/afterThePurchase/afterThePurchase_en.html',
				"fr" : 'file:///custom/afterThePurchase/afterThePurchase_fr.html',
				"ru" : 'file:///custom/afterThePurchase/afterThePurchase_ru.html'
			}
		}
	};
}
