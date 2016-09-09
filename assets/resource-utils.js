'use strict';
//
var _translationLanguages = {};
var _translationCurrencies = {};
var _translationOptions = {};
//
var _parameters = {};
//

function formatMoneyValue(value) {
	var result;
	if (_currencyKey == 'RUB') {
		var fixed = 2; //isInt(value) ? 0 : 2;
		result = formatMoney(value, fixed, '.', ' ') + ' ' + (_langKey == 'ru' ? 'руб.' : 'RUB');
	} else
		result = value.toLocaleString(_langKey, {
			style : 'currency',
			currency : _currencyKey
		});
	return replaceAll(result, ' ', '&nbsp;')
}

function formatMoneyValueWithoutCurrencySymbol(value) {
	var v = formatMoneyValue(value);
	var pos1 = v.search(/\d/);
	var pos2 = v.length - reverse(v).search(/\d/);
	return (value < 0 ? '-' : '') + v.substring(pos1, pos2).trim();
}

function updateTextAll() {
	for ( var id in _translationLanguages) {
		if (!_translationLanguages.hasOwnProperty(id))
			continue;
		var el = document.getElementById(id);
		if (el === null)
			continue;
		var t = _translationLanguages[id];
		var parameters = _parameters[id];
		applyText(el, t, parameters);
	}
}

function updateMoneyAll() {
	for ( var id in _translationCurrencies) {
		if (!_translationCurrencies.hasOwnProperty(id))
			continue;
		var el = document.getElementById(id);
		if (el === null)
			continue;
		var t = _translationCurrencies[id];
		applyMoney(el, t);
	}
}

function updateOptionableNumAll() {
	for ( var id in _translationCurrencies) {
		if (!_translationCurrencies.hasOwnProperty(id))
			continue;
		var el = document.getElementById(id);
		if (el === null)
			continue;
		var t = _translationCurrencies[id];
		var options = _translationOptions[id];
		applyOptionableNum(el, t, options);
	}
}

function applyText(el, t, parameters) {
	var text;
	if (typeof t === 'object') {
		text = t[_langKey];
		if (text === undefined)
			text = t[_defaultLangKey];
	} else
		text = t;
	//
	if (text === undefined)
		text = '';
	//
	el.setAttribute('lang', _langKey);
	var PREFIX = 'file:///';
	if (text.startsWith(PREFIX)) {
		var file = text.substring(PREFIX.length);
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				text = xhr.responseText;
				putHTML(el, text, parameters);
			}
		}
		xhr.open("GET", file, true);
		xhr.send();
	} else
		putHTML(el, text, parameters);
}

function putHTML(el, text, parameters) {
	if (parameters !== undefined)
		for (var i = 0; i < parameters.length; i++)
			text = replaceAll(text, '%' + (i + 1).toString(), parameters[i]);
	el.innerHTML = text;
	var arr = el.getElementsByTagName('script');
	for (var i = 0; i < arr.length; i++)
		eval(arr[i].innerHTML);
}

function applyMoney(el, t) {
	var text;
	if (typeof t === 'object') {
		text = t[_currencyKey];
		if (text === undefined)
			text = 0;
	} else
		text = 0;
	//
	var noCurrencySymbol = el.dataset.nocurrencysymbol == "true";
	el.innerHTML = noCurrencySymbol ? formatMoneyValueWithoutCurrencySymbol(text) : formatMoneyValue(text);
}

function applyOptionableNum(el, t, options) {
	var text;
	if (typeof t === 'function')
		t = t(options);
	if (typeof t === 'object') {
		text = t[_currencyKey];
		if (text === undefined)
			text = 0;
	} else
		text = 0;
	//
	var noCurrencySymbol = el.dataset.nocurrencysymbol == "true";
	el.innerHTML = noCurrencySymbol ? formatMoneyValueWithoutCurrencySymbol(text) : formatMoneyValue(text);
}

function getMoney(obj, key) {
	var t = obj[key];
	var text;
	if (typeof t === 'object') {
		text = t[_currencyKey];
		if (text === undefined)
			text = 0;
	} else
		text = 0;
	return text;
}

function getOptionableNum(item, key, options) {
	if (options == undefined)
		options = item['options'];
	//
	var t = item[key];
	var text;
	if (typeof t === 'function')
		t = t(options);
	if (typeof t === 'object') {
		text = t[_currencyKey];
		if (text === undefined)
			text = 0;
	} else
		text = 0;
	return text;
}

function getText(obj, key, parameters) {
	var t = obj[key];
	var text;
	if (typeof t === 'object') {
		text = t[_langKey];
		if (text === undefined)
			text = t[_defaultLangKey];
	} else
		text = t;
	//
	if (text === undefined)
		text = '';
	//
	if (parameters !== undefined)
		for (var i = 0; i < parameters.length; i++)
			text = replaceAll(text, '%' + (i + 1).toString(), parameters[i]);
	//
	return text;
}

function getTextArray(array) {
	var arr = [];
	for (var i = 0; i < array.length; i++) {
		var t = array[i];
		var text;
		if (typeof t === 'object') {
			text = t[_langKey];
			if (text === undefined)
				text = t[_defaultLangKey];
		} else
			text = t;
		//
		if (text === undefined)
			text = '';
		//
		arr.push(text);
	}
	//
	return arr;
}

function txt(el, obj, key, parameters) {
	var t = obj[key];
	var id = el.getAttribute('id');
	_translationLanguages[id] = t;
	if (parameters !== undefined)
		_parameters[id] = parameters;
	applyText(el, t, parameters);
}

function man(el, obj, key) {
	var id = el.getAttribute('id');
	var t = obj[key];
	_translationCurrencies[id] = t;
	applyMoney(el, t);
}

function pan(el, item, key, options) {
	if (options == undefined)
		options = item['options'];
	//
	var id = el.getAttribute('id');
	var t = item[key];
	_translationCurrencies[id] = t;
	_translationOptions[id] = options;
	applyOptionableNum(el, t, options);
}

function getColor(colorKey, entryKey) {
	var color = _colors[colorKey + ':' + entryKey];
	if (color === undefined)
		color = _colors[colorKey];
	return color;
}

function getImage(str) {
	if (str.startsWith('@')) {
		var pos1 = str.indexOf('[');
		var key, index;
		if (pos1 == -1) {
			key = str.substring(1);
			index = 0;
		} else {
			var pos2 = str.indexOf(']');
			key = str.substring(1, pos1);
			index = parseInt(str.substring(pos1 + 1, pos2));
		}
        console.log(key);
		return _map[key][index];
	}
    return str;
}

function getBackground(str) {
	var imgStr = getImage(str);
	if (imgStr.startsWith('data:'))
		return "url('" + imgStr + "')";
	return imgStr;
}

function translate(el) {
	el.setAttribute('lang', _langKey);
	el.innerHTML = JSON.parse('{' + el.dataset.translate + '}')[_langKey];
}
