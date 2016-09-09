'use strict';

function getPayment_service_providers() {
	return {
		"PayPal" : {
			"name" : {
				"en" : "Secure payment via credit card or PayPal",
				"ru" : "проверка языка"
			},
			"currencies" : [ "USD", "EUR", "RUB" ],
			"handler" : function(formEl, psData) {
				formEl.setAttribute('action', 'https://www.paypal.com/cgi-bin/webscr');
				//
				inputEl = document.createElement('input');
				inputEl.setAttribute('type', 'hidden');
				inputEl.setAttribute('name', 'charset');
				inputEl.setAttribute('value', 'utf-8');
				formEl.appendChild(inputEl);
				//
				inputEl = document.createElement('input');
				inputEl.setAttribute('type', 'hidden');
				inputEl.setAttribute('name', 'cmd');
				inputEl.setAttribute('value', '_cart');
				formEl.appendChild(inputEl);
				//
				inputEl = document.createElement('input');
				inputEl.setAttribute('type', 'hidden');
				inputEl.setAttribute('name', 'upload');
				inputEl.setAttribute('value', '1');
				formEl.appendChild(inputEl);
				//
				inputEl = document.createElement('input');
				inputEl.setAttribute('type', 'hidden');
				inputEl.setAttribute('name', 'currency_code');
				inputEl.setAttribute('value', _currencyKey);
				formEl.appendChild(inputEl);
				//
				if (_shipping !== 0) {
					inputEl = document.createElement('input');
					inputEl.setAttribute('type', 'hidden');
					inputEl.setAttribute('name', 'handling_cart');
					inputEl.setAttribute('value', _shipping);
					formEl.appendChild(inputEl);
				}
				//
				for ( var key in psData) {
					if (!psData.hasOwnProperty(key))
						continue;
					var value = psData[key];
					inputEl = document.createElement('input');
					inputEl.setAttribute('type', 'hidden');
					inputEl.setAttribute('name', key);
					inputEl.setAttribute('value', psData[key]);
					formEl.appendChild(inputEl);
				}
				//
				var n = 1;
				for ( var itemKey in _cartItems) {
					if (!_cartItems.hasOwnProperty(itemKey))
						continue;
					var item = _cartItems[itemKey];
					//
					inputEl = document.createElement('input');
					inputEl.setAttribute('type', 'hidden');
					inputEl.setAttribute('name', 'item_number_' + n);
					inputEl.setAttribute('value', itemKey);
					formEl.appendChild(inputEl);
					//
					var inputEl = document.createElement('input');
					inputEl.setAttribute('type', 'hidden');
					inputEl.setAttribute('name', 'item_name_' + n);
					inputEl.setAttribute('value', getText(item, 'name'));
					formEl.appendChild(inputEl);
					//
					inputEl = document.createElement('input');
					inputEl.setAttribute('type', 'hidden');
					inputEl.setAttribute('name', 'quantity_' + n);
					inputEl.setAttribute('value', item['quantity']);
					formEl.appendChild(inputEl);
					//
					inputEl = document.createElement('input');
					inputEl.setAttribute('type', 'hidden');
					inputEl.setAttribute('name', 'amount_' + n);
					inputEl.setAttribute('value', getMoney(item, 'price'));
					formEl.appendChild(inputEl);
					//
					n++;
				}
				formEl.submit();
			},
			"data" : {
				"lc" : "RU",
				"business" : "example@minicartjs.com",
				"currency_code" : "EUR",
				"image_url" : "http://www.gdenney.co.uk/images/gdenney_mini.gif",
				"cpp_header_image" : "http://www.gooodfabrics.com/main/skin/frontend/gooodfabrics/default/images/GF_storeheaderimg.png"
			}
		},
		"GenericForm" : {
			"name" : {
				"en" : "Send via GoogleForms",
				"ru" : "проверка языка GoogleForms"
			},
			"currencies" : [ "USD", "EUR" ],
			"handler" : function(formEl, psData) {
				var orderUrl = getOrderUrl();
				var fieldName = psData['fieldName'];
				if (fieldName == undefined)
					fieldName = 'orderUrl';
				ajaxPost(psData['formActionUrl'], fieldName, orderUrl, function() {
					var text = getText(psData, 'completeText');
					alert(text);
					clearCart();
					var url = location.href.split("?")[0];
					location.href = url;
				}, function(status) {
					alert('Error: ' + statusText);
				});
			},
			"data" : {
				"stunUrl" : "stun:stun.services.mozilla.com",
				"formActionUrl" : "https://www.briskforms.com/go/dd5bd7f357f18377452a5413739a22cd",
				//"formActionUrl": "https://docs.google.com/forms/d/1y-Muf9bPZTsTU6eR0K9TBMH4bHwz6h54y9L-QMvmCaw/formResponse",
				"fieldName" : "entry.1049262906",
				"completeText" : {
					"en" : "Order submitted",
					"ru" : "Order проверка языка"
				}
			}
		},

		"robokassa" : {
			"name" : {
				"en" : "robokassa Secure payment: robokassa",
				"ru" : "robokassa проверка языка"
			},
			"currencies" : [ "EUR" ],
			"data" : {
				"business" : "example@minicartjs.com",
				"currency_code" : "US"
			}
		},
		"ZPayPal" : {
			"name" : "ZSecure payment via credit card or PayPal",
			"currencies" : [],
			"data" : {
				"business" : "example@minicartjs.com",
				"currency_code" : "US"
			}
		}
	};
}
