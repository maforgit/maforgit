'use strict';

function getOrderOptions() {
    var orderOptions = [];
    orderOptions.push({
        "key": "TAX",
        "text": {
            "en": "Tax",
            "ru": "Nalog"
        },
        "amount": {
            "USD": 19.30,
            "EUR": 12.32
        }
    });
    orderOptions.push({
        "key": "PACK",
        "text": {
            "en": "Packing",
            "ru": "Упаковка"
        },
        "amount": {
            "USD": 9.30,
            "EUR": 10.32
        }
    });
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
