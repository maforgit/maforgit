'use strict';

function getItems() {
	return {
		"ART-1021" : {
			"name" : {
				ru : "ПЛАЩ С КРУЖЕВОМ"
			},
			"longName" : "Плащ с коротким рукавом и кружевом ART-1021",
			"description" : "Плащ женский (с кружевом) пошит из блестящих тканей разных цветов. В модных коллекциях на весну присутствуют и однотонные блестящие модели, и комбинированные с наличием декоративных вставок, и варианты с принтами.",
			"tags" : [ "JENSKAYA_ODEJDA", "PLASHI", "KRASNIY" ],
			"supplier" : "СКЛАД 1",
			"images" : [ "@ART1021[0]", "@ART1021[1]" ],
			"price" : {
				"RUB" : 600.00
			},
			"supplierPrice" : function(options) {
				return {
					"USD" : 122.50,
					"EUR" : 131.00,
					"RUB" : 1600.00
				};
			},
			"sections" : [ "RAINCOATS" ],
			"info" : {
				"en" : "file:///custom/items/plash2_en.html",
				"ru222" : "file:///custom/items/plash2_en.html"
			},
			"options" : {
				"size" : null,
				"color" : null
			},
			"colorAndSize" : {
				red : {
					"40" : false,
					"42" : true,
					"44" : true,
					"46" : true,
					"48" : true,
					"50" : true,
					"52" : true,
					"54" : false,
					"56" : false
				},
				blue : {
					"40" : false,
					"42" : true,
					"44" : true,
					"46" : true,
					"48" : true,
					"50" : false,
					"52" : true,
					"54" : false,
					"56" : false
				},
				green : {
					"40" : true,
					"42" : true,
					"44" : false,
					"46" : true,
					"48" : true,
					"50" : true,
					"52" : true,
					"54" : false,
					"56" : false
				},
				"orange-tkan" : {
					"40" : false,
					"42" : true,
					"44" : false,
					"46" : true,
					"48" : false,
					"50" : true,
					"52" : true,
					"54" : false,
					"56" : false
				}
			},
			"productDataSheet" : {
				"articul" : "ART-1021",
				"sostav" : {
					"ru" : "100% ​Итальянский полированный хлопок, Турецкое кружево",
				},
				"sezon" : {
					ru : "Весна - Лето"
				},
				"prokladka" : {
					ru : "Подкладка: 100% полиэстер"
				},
				"molniya" : {
					ru : "Производство Корея"
				},
				"izgotovitel" : {
					ru : "Москва (Россия)"
				},
				"ostatok" : "251"
			},
			"minCount" : 0,
			"maxCount" : 1251
		},
		"ART-1022" : {
			"name" : "ПЛАЩ",
			"longName" : "Плащ женский, с укороченным рукавом ART-1022",
			"description" : "Плащ женский пошит из блестящих тканей разных цветов. В модных коллекциях на весну присутствуют и однотонные блестящие модели, и комбинированные с наличием декоративных вставок, и варианты с принтами.",
			"tags" : [ "JENSKAYA_ODEJDA", "PLASHI", "KRASNIY" ],
			"supplier" : "СКЛАД 1",
			"images" : [ "custom/img/items/ART-1022/1.jpg" ],
			"price" : function(options) {
				return {
					"USD" : 22.50,
					"EUR" : 31.00,
					"RUB" : 600.00
				};
			},
			"supplierPrice" : function(options) {
				return {
					"USD" : 122.50,
					"EUR" : 131.00,
					"RUB" : 1600.00
				};
			},
			"sections" : [ "RAINCOATS" ],
			"info" : {
				"en" : "file:///custom/items/plash2_en.html",
				"ru222" : "file:///custom/items/plash2_en.html"
			},
			"options" : {
				"size" : null,
				"color" : null
			},
			"colorAndSize" : {
				red : {
					"40" : false,
					"42" : true,
					"44" : true
				},
				blue : {
					"40" : false,
					"42" : true,
					"44" : true
				},
				green : {
					"40" : true,
					"42" : true,
					"44" : false
				},
			},
			"productDataSheet" : {
				"articul" : "ART-1022",
				"sostav" : {
					"ru" : "100% ​Итальянский полированный хлопок, Турецкое кружево",
					"en" : "100% ​Итальянский полированный хлопок, Турецкое кружево",
					"fr" : "100% ​Итальянский полированный хлопок, Турецкое кружево"
				},
				"sezon" : {
					ru : "Весна - Лето",
					en : "Весна - Лето",
					fr : "Весна - Лето"
				},
				"prokladka" : {
					ru : "Подкладка: 100% полиэстер",
					en : "Подкладка: 100% полиэстер",
					fr : "Подкладка: 100% полиэстер"
				},
				"molniya" : {
					ru : "Производство Корея"
				},
				"izgotovitel" : {
					ru : "Москва (Россия)"
				},
				"ostatok" : "220"
			},
			"minCount" : 0,
			"maxCount" : 1251
		},
	};
}
