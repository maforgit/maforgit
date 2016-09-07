'use strict';

function getOrderOptions() {
    var orderOptions = [];
    //
    var skidka = 0;
    if (_total >= 20000 && _total <= 50000) {
        skidka = -_total * 1 / 100;
        orderOptions.push({
            "key": "SKIDKA",
            "text": {
                en: '1%-я скидка на сумму заказа свыше 20 000 руб.',
                ru: '1%-я скидка на сумму заказа свыше 20 000 руб.'
            },
            "amount": {
                "RUB": skidka,
                "USD": 0,
                "EUR": 0
            }
        });
    } else if (_total >= 50001 && _total <= 100000) {
        skidka = -_total * 3 / 100;
        orderOptions.push({
            "key": "SKIDKA",
            "text": {
                en: '3%-я скидка на сумму заказа свыше 50 000 руб.',
                ru: '3%-я скидка на сумму заказа свыше 50 000 руб.'
            },
            "amount": {
                "RUB": skidka,
                "USD": 0,
                "EUR": 0
            }
        });
    } else if (_total >= 100001 && _total <= 200000) {
        skidka = -_total * 5 / 100;
        orderOptions.push({
            "key": "SKIDKA",
            "text": {
                en: '5%-я скидка на сумму заказа свыше 100 000 руб.',
                ru: '5%-я скидка на сумму заказа свыше 100 000 руб.'
            },
            "amount": {
                "RUB": skidka,
                "USD": 0,
                "EUR": 0
            }
        });
    }
    //
    var vat = 18;
    orderOptions.push({
        "key": "VAT",
        "text": {
            en: 'VAT',
            ru: 'НДС (' + vat + '%)'
        },
        "amount": {
            "RUB": (_total + skidka) * vat / 100,
            "USD": 0,
            "EUR": 0
        }
    });
    //
    orderOptions.push({
        "key": "PACK",
        "text": {
            "en": "Packing",
            "ru": "Оформление и подотовка заказа"
        },
        "amount": {
            "RUB": 0,
            "USD": 9.30,
            "EUR": 10.32
        }
    });
    //
    if (document.getElementById('delivery_FedEx').checked)
        orderOptions.push({
            "key": "FedEx",
            "text": "Самовывоз",
            "amount": {
                "RUB": 0,
                "USD": 22.50,
                "EUR": 200.00
            }
        });
    if (document.getElementById('delivery_DHL').checked)
        orderOptions.push({
            "key": "DHL",
            "text": "Доставка по Москве (в пределах МКАД)",
            "amount": {
                "RUB": _total > 10000 ? 0 : 400,
                "USD": 30.20,
                "EUR": 710.40
            }
        });
    if (document.getElementById('delivery_DostavakPoMoskveDoTk').checked)
        orderOptions.push({
            "key": "DostavakPoMoskveDoTk",
            "text": {
                ru: "Доставка по Москве (в пределах МКАД) до ТК"
            },
            "amount": {
                "RUB": _total > 10000 ? 0 : 500,
                "USD": 30.20,
                "EUR": 710.40
            }
        });
    //
    return orderOptions;
}
