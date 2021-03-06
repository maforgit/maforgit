'use strict';

function getItems() {
	var items = {
		"OLY_8879" : {
			"name" : {
				ru : "ПЛАЩ С КРУЖЕВОМ"
			},
			"longName" : "Плащ с коротким рукавом и кружевом ART-1021",
			"description" : "Плащ женский (с кружевом) пошит из блестящих тканей разных цветов. В модных коллекциях на весну присутствуют и однотонные блестящие модели, и комбинированные с наличием декоративных вставок, и варианты с принтами.",
			"tags" : [ "JENSKAYA_ODEJDA", "PLASHI", "2KRASNIY" ],
			"supplier" : "СКЛАД 1",
//			             "settings/custom/img/items/01/1.jpg"
			"images" : [ "settings/custom/img/items/OLY_8879/1.jpg" ],
			"price" : {
				"RUB" : 600.00
			},
			"sections" : ["NEW", "RAINCOATS" ],
			addToCartButton: true,
			"productDataSheet" : {
				"articul" : "ART-1021",
				"sostav" : {
					"ru" : "100% Итальянский полированный хлопок, Турецкое кружево",
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
			addToCartDefaultCount : 10,
			ribbonLeft: "-10%"
		},
		"ART-1021" : {
			"name" : {
				ru : "ПЛАЩ С КРУЖЕВОМ"
			},
			"longName" : "Плащ с коротким рукавом и кружевом ART-1021",
			"description" : "Плащ женский (с кружевом) пошит из блестящих тканей разных цветов. В модных коллекциях на весну присутствуют и однотонные блестящие модели, и комбинированные с наличием декоративных вставок, и варианты с принтами.",
			"tags" : [ "JENSKAYA_ODEJDA", "PLASHI", "2KRASNIY" ],
			"supplier" : "СКЛАД 1",
			"images" : [ "@ART1021[0]", "@ART1021[1]" ],
			"price" : {
				"RUB" : 600.00
			},
			"sections" : [ "RAINCOATS" ],
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
			"maxCount" : 1251,
			ribbonRight: "NEW"
		},
		"ART-1022" : {
			"name" : "ПЛАЩ",
			"longName" : "Плащ женский, с укороченным рукавом ART-1022",
			"description" : "Плащ женский пошит из блестящих тканей разных цветов. В модных коллекциях на весну присутствуют и однотонные блестящие модели, и комбинированные с наличием декоративных вставок, и варианты с принтами.",
			"tags" : [ "JENSKAYA_ODEJDA", "PLASHI", "KRASNIY" ],
			"supplier" : "СКЛАД 2",
			//"images" : [ "@ITM02[0]", "@ITM02[1]", "@ITM02[2]" ],
			"images" : [ "@ITM03[0]" ],
			"price" : function(options) {
				return {
					"USD" : 22.50,
					"EUR" : 31.00,
					"RUB" : 600.00
				};
			},
			"sections" : [ "RAINCOATS" ],
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
			"maxCount" : 1251,
			stamp: "SOLD"
		},
		////////////////////////////////////////////////////////////////////////////////////////////////////
		"ART-1023" : {
			"name" : "ПЛАЩ",
			"longName" : "Плащ женский, с укороченным рукавом ART-1022",
			"description" : "Плащ женский пошит из блестящих тканей разных цветов. В модных коллекциях на весну присутствуют и однотонные блестящие модели, и комбинированные с наличием декоративных вставок, и варианты с принтами.",
			"tags" : [ "JENSKAYA_ODEJDA", "PLASHI", "KRASNIY" ],
			"supplier" : "СКЛАД 2",
			//"images" : [ "@ITM02[0]", "@ITM02[1]", "@ITM02[2]" ],
			"images" : [ "settings/custom/img/items/01/1.jpg", "settings/custom/img/items/01/2.jpg" ],
			"price" : function(options) {
				return {
					"USD" : 22.50,
					"EUR" : 31.00,
					"RUB" : 600.00
				};
			},
			"sections" : [ "RAINCOATS" ],
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
		////////////////////////////////////////////////////////////////////////////////////////////////////
		"R10001" : {
			"name" : {
				ru : "ПЛАЩ С КРУЖЕВОМ"
			},
			"longName" : "Плащ с коротким рукавом и кружевом ART-1021",
			"description" : "Плащ женский (с кружевом) пошит из блестящих тканей разных цветов. В модных коллекциях на весну присутствуют и однотонные блестящие модели, и комбинированные с наличием декоративных вставок, и варианты с принтами.",
			"tags" : [ "JENSKAYA_ODEJDA", "PLASHI", "2KRASNIY" ],
			"supplier" : "СКЛАД 1",
			"images" : [ "@R10001[0]", "@R10001[1]" ],
			"price" : {
				"RUB" : 600.00
			},
			"sections" : [ "RAINCOATS" ],
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
					"ru" : "100% Итальянский полированный хлопок, Турецкое кружево",
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
////////////////////////////////////////////////////////////////////////////////////////////////////
		"R10011" : {
			"name" : {
				ru : "ПЛАЩ С КРУЖЕВОМ"
			},
			"longName" : "Плащ с коротким рукавом и кружевом ART-1021",
			"description" : "Плащ женский (с кружевом) пошит из блестящих тканей разных цветов. В модных коллекциях на весну присутствуют и однотонные блестящие модели, и комбинированные с наличием декоративных вставок, и варианты с принтами.",
			"tags" : [ "JENSKAYA_ODEJDA", "PLASHI", "2KRASNIY" ],
			"supplier" : "СКЛАД 1",
			"images" : [ "@R10011[0]", "@R10011[1]" ],
			"price" : {
				"RUB" : 600.00
			},
			"sections" : [ "RAINCOATS" ],
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
////////////////////////////////////////////////////////////////////////////////////////////////////
				"М5136" : {
			"name" : {
				ru : "ПЛАТЬЕ ДОМАШНЕЕ"
			},
			"longName" : "Платье домашнее с принтом ART-М5136",
			"description" : "Платье домашнее (с принтом) изготовлено из натуральных тканей разных цветов. В коллекциях присутствуют и однотонные модели, и варианты с принтами.",
			"tags" : [ "JENSKAYA_ODEJDA", "PLASHI", "2KRASNIY" ],
			"supplier" : "СКЛАД 6",
			"images" : [ "@R10001[0]", "@R10001[1]" ],
			"price" : {
				"RUB" : 349.00
			},
			"sections" : [ "NEW", "HOME CLOTHING" ],
			"options" : {
				"size" : null,
				"color" : null
				},
			"colorAndSize" : { // Геннадий, эта строка отсутствовала
				blue : {
					"48" : true,
					"50" : false,
					"52" : true,
					"54" : false,
					"56" : true
				},
				green : {
					"48" : true,
					"50" : true,
					"52" : true,
					"54" : false,
					"56" : true
				},
				"orange-tkan" : {
					"48" : false,
					"50" : true,
					"52" : true,
					"54" : false,
					"56" : true
				}
			},
			"productDataSheet" : {
				"articul" : "ART-М5136",
				"sostav" : {
					"ru" : "95% хлопок, 5% эластан",
				},
				"sezon" : {
					ru : "Лето"
				},
				"izgotovitel" : {
					ru : "Oztas, Turkey"
				},
				"ostatok" : "301"
			},
			"minCount" : 0,
			"maxCount" : 1251
		},
	};
	//
	return items;
}
