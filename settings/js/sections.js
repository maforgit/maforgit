'use strict';

function getSections() {
    return {
        "ID_CATALOG": {
            "name": {
                "en": "CATALOG",
                "fr": "CATALOG",
                "ru": "КАТАЛОГ"
            },
            showInMenu: true
        },
        "NEW": {
            "name": {
                "en": "NEW",
                "fr": "NOUVEAU",
                "ru": "НОВЫЕ ПОСТУПЛЕНИЯ"
            },
            "description": {
                "en": "Newest things here (%1 items)",
                "fr": "Nouveaux choses (%1 articles)",
                "ru": "сезон зима-лето 2017 (товаров: %1)"
            },
            showInMenu: true,
            showInCatalog: true
        },
        "RAINCOATS": {
            "name": {
                "en": "RAINCOATS",
                "fr": "IMPERMÉABLES",
                "ru": "ПЛАЩИ"
            },
            "description": {
                "en": "%1 item(s)",
                "fr": "%1 article(s)",
                "ru": "товаров: %1"
            },
            showInMenu: true,
            showInCatalog: true
        },
        "WHOLESALE": {
            "name": {
                "en": "WHOLESALE",
                "fr": "DE GROS",
                "ru": "РАСПРОДАЖА"
            },
            "description": {
                "en": "%1 item(s)",
                "fr": "%1 article(s)",
                "ru": "фабричные остатки по низким ценам (товаров: %1)"
            },
            showInMenu: true,
            showInCatalog: true
        },
        "ABOUT": {
            "name": {
                "en": "ABOUT US",
                "fr": "À PROPOS DE NOUS",
                "ru": "УСЛОВИЯ СОТРУДНИЧЕСТВА"
            },
            "description": {
                "en": "Welcome to our store!",
                "fr": "Bienvenue dans notre magasin!",
                "ru": "ЮР. ЛИЦА • ИП • ФИЗ. ЛИЦА | ОПТ • МЕЛКИЙ ОПТ"
            },
            "header": {
                en: "file:///settings/custom/about/about_en.html",
                fr: "file:///settings/custom/about/about_fr.html",
                ru: "file:///settings/custom/about/about_ru.html"
            }
        },
        "ID_CART": {
            "name": {
                en: "CART (%1) %2",
                fr: "MON PANIER (%1) %2",
                ru: "КОРЗИНА (%1) %2"
            },
            "description": {
                "en": "%1 item(s)",
                "fr": "%1 article(s)",
                "ru": "товаров: %1"
            },
            showInMenu: true
        },
        "ID_ORDER": {
            "name": "ORDER",
            "description": "Print Order",
            showInMenu: false,
            "header": "file:///settings/custom/order_options/order_options.html",
            "footer": ""
        },
        "ID_CHECKOUT": {
            "name": "CHECKOUT",
            "description": "Checkout",
            showInMenu: false
        },
        "ID_AFTER_THE_PURCHASE": {
            "name": "AFTER THE PURCHASE",
            "description": "",
            showInMenu: false,
            "header": {
                "en": 'file:///settings/custom/afterThePurchase/afterThePurchase_en.html',
                "fr": 'file:///settings/custom/afterThePurchase/afterThePurchase_fr.html',
                "ru": 'file:///settings/custom/afterThePurchase/afterThePurchase_ru.html'
            }
        }
    };
}
