'use strict';

//
// TODO

// https://ru.wix.com/support/html5/ugc/af739607-8fbc-4259-99e8-43a1877d0031/02f9f23e-89b6-4031-9fa8-4cbafa884cbc
//https://nulled.in/threads/258727/

// vinesti nazvanie valuti v shapku ordera (price, sum)
// obyazatel'no dobavit kolonku price v tablice zakazkv tovara tak kak kajdaya opciya imeet svoy cenu
// delat img kvadratnimi s pomoshy canvas (dataURL)
// item view set options
// rekviziti magazina v ordere
// message o max quantity vmesto dialoga + ubrat' ADD to cart button, esli uje max. quantity
//
// fixirovannaya korzina v verhnem pravom uglu.
// ed izm i kol-vo vozle knopki addtocart
// site top & site bottom
// cena kak function ot options
// razrisovat addToCart button (sdelat pohojim po stily na checkout button)
// proverit i-- (remove in loop)
// add -js to classes
// addToCartErrorMessage
// - item: ribbonText, oldPrice
// -disable selections, where it no needed
//
var IMG_1x1 = 'data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
var _columnsCount = 12; // hardcoded in assets/grid12.css
var _headerBarHeight = 45; // hardcoded in assets/style.css
//
var _single_column_px;
//
var _color_list;
var _colors;
var _fonts;
var _currencies;
var _currencies_symbols;
var _items = {};
var _itemOptions;
var _itemOptionValues;
var _languages;
var _layout;
var _payment_service_providers;
var _resources;
var _sections;
var _orderStoreDetails;
//
var _languagesCount = 0;
var _currenciesCount = 0;
//
var _colSpan;
var _resized = false;
var _itemDetailsPageEl = null;
var _currentThumbnailEl = null;
var _savedInnerWidth = null;
var _sectionsKeysArray = [];
//
var _langKey;
var _defaultLangKey;
//
var _currencyKey;
var _defaultCurrencyKey;
//
var _cartItems = {};
var _total = 0;
var _totalQuantity = 0;
//
var _psKeys;
var _paymentSystemsCurrentKey;
//
var _urlParams;
var _pageYOffsetBeforeRemoveDetails;
//
var _shipping = 0;
//
var _orderNo = null;
var _orderDate = null;
//
var _storage;
//
var _customerDetails;
var _orderOptions;
//
var _magnify = null;
//
var _map = {};
//
var _colorWindowOpen = null;
//
var _headerImageEl;

function loadData() {
	var div = byId('itemsHtmlHolder');
	loadHtmlFile(div, 'settings/images.html', function () {
		var table = div.getElementsByTagName('table')[0];
		//
		for (var i = 0; i < table.rows.length; i++) {
			var cells = table.rows[i].cells;
			var array = [];
			for (var j = 0, col; col = cells[j]; j++) {
				if (j == 0)
					var key = strip2text(col.innerHTML);
				else {
					var imgs = col.getElementsByTagName('img');
					var value;
					if (imgs.length == 0)
						value = IMG_1x1;
					else {
						var img = imgs[0];
						var alt = img.getAttribute('alt');
						if (alt !== null && alt.startsWith('data:image/'))
							value = alt;
						else {
							var src = img.getAttribute('src');
							value = src;
						}
					}
					array.push(value);
				}
			}
			_map[key] = array;
		}
		load();
	});
}

function downloadSuppliersOrders() {
	var tbody = document.getElementById("orderTbody");
	var allProducts = {};
	for (var i = 0; i < tbody.rows.length; i++) {
		var tr = tbody.rows[i];
		var supplier = tr.getAttribute('data-supplier');
		if (allProducts[supplier] === undefined)
			allProducts[supplier] = {};
		var itemKey = parseInt(tr.getAttribute('data-itemkey'));
		var name = tr.getAttribute('data-name');
		var longName = tr.getAttribute('data-longname');
		var options = JSON.parse(tr.getAttribute('data-options'));
		var price = parseInt(tr.getAttribute('data-price'));
		var quantity = parseInt(tr.getAttribute('data-quantity'));
		var itemKey = tr.getAttribute('data-itemkey');
		//
		var product = {};
		product['itemKey'] = itemKey;
		product['name'] = name;
		product['longName'] = longName;
		product['options'] = options;
		product['quantity'] = quantity;
		//
		allProducts[supplier][i] = product;
	}
	//
	var html = '';
	for (var supplier in allProducts) {
		if (!allProducts.hasOwnProperty(supplier))
			continue;
		var products = allProducts[supplier];
		html += generateSupplierHtml(supplier, products);
	}
	downloadSupplierOrder(html);
}

function getAllOptionsKeys(products) {
	var obj = {};
	for (var itemKey in products) {
		if (!products.hasOwnProperty(itemKey))
			continue;
		var product = products[itemKey];
		//
		var options = product['options']
		for (var key in options) {
			if (!options.hasOwnProperty(key))
				continue;
			obj[key] = null;
		}
	}
	return Object.keys(obj);
}

function generateSupplierHtml(supplier, products) {
	var allOptionsKeys = getAllOptionsKeys(products);
	//
	const
		COL_SEPARATOR = '\t';
	//
	var lines = '';
	//
	var line = '';
	line += '"' + supplier + '"' + COL_SEPARATOR;
	line += COL_SEPARATOR;
	line += COL_SEPARATOR;
	line += COL_SEPARATOR;
	line += COL_SEPARATOR;
	for (var k = 0; k < allOptionsKeys.length; k++)
		line += '"' + getText(_itemOptions, allOptionsKeys[k]) + '"' + COL_SEPARATOR;
	line += '\r\n';
	//
	lines += line;
	//
	var n = 1;
	var savedItemKey = null;
	var quantityTotal = 0;
	for (var i in products) {
		if (!products.hasOwnProperty(i))
			continue;
		//
		var product = products[i];
		//
		var itemKey = product['itemKey'];
		var quantity = product['quantity'];
		var src = product['src'];
		var name = product['name'];
		var longName = product['longName'];
		var options = product['options'];
		//
		var line = '';
		//
		line += '"' + supplier + '"' + COL_SEPARATOR;
		line += n.toString() + COL_SEPARATOR;
		line += '"' + itemKey + '"' + COL_SEPARATOR;
		line += '"' + name + ' ' + longName + '"' + COL_SEPARATOR;
		line += quantity.toString() + COL_SEPARATOR;
		for (var k = 0; k < allOptionsKeys.length; k++) {
			var key = allOptionsKeys[k];
			var optionValue = options[key];
			var optionValueText = getText(_itemOptionValues, optionValue)
			if (optionValueText == '')
				optionValueText = optionValue;
			line += '"' + optionValueText + '"' + COL_SEPARATOR;
		}
		line += '\r\n';
		//
		quantityTotal += quantity;
		//
		n++;
		//
		lines += line;
	}
	line = '';
	line += '"' + supplier + '"' + COL_SEPARATOR;
	line += COL_SEPARATOR;
	line += COL_SEPARATOR;
	line += COL_SEPARATOR;
	line += quantityTotal.toString();
	for (var k = 0; k < allOptionsKeys.length; k++)
		line += COL_SEPARATOR;
	line += '\r\n';
	lines += line;
	return lines;
}

function downloadShortcutToOrder() {
	var orderUrl = getOrderUrl();
	//<!--
	var html = '<!DOCTYPE HTML><html><head><meta http-equiv="refresh" content="0;url=' + orderUrl + '"><script type="text/javascript">window.location.href="' + orderUrl + '"</script></head></html>';
	//-->
	var fileName = getFileNameDownloadShortcutToOrder();
	saveTextAsFile(html, fileName, "text/html");
}

function downloadSupplierOrder(html) {
	var fileName = getFileNameDownloadQuantityReport();
	var BOM = "\ufeff";
	saveTextAsFile(BOM + html, fileName, "text/csv;charset=utf-8");
}

function init() {
	//
	_single_column_px = _layout['singleColumnMaxWidthPx'];
	//
	byId('favicon').setAttribute('href', _resources['favicon'])
		//
	_storage = localStorage;
	//
	var orderDataStr = _urlParams['order'];
	if (orderDataStr !== undefined) {
		orderDataStr = orderDataStr.split('#')[0];
		var orderData = JSON.parse(LZString.decompressFromEncodedURIComponent(orderDataStr));

		save('no', orderData['no']);
		save('date', orderData['date']);
		save('customerDetails', orderData['customerDetails']);
		save('orderOptions', orderData['orderOptions']);
		//
		var orderItems = orderData['items'];
		for (var itemKey in orderItems) {
			if (!orderItems.hasOwnProperty(itemKey))
				continue;
			save('item' + '.' + itemKey, orderItems[itemKey]);
		}
	}
	//
	_customerDetails = JSON.parse(_storage.getItem('customerDetails'));
	//
	_orderOptions = JSON.parse(_storage.getItem('orderOptions'));
	//
	_colSpan = _layout['colSpan'];
	//
	/* Add internally used fields to all section objects */
	for (var sectionKey in _sections) {
		if (!_sections.hasOwnProperty(sectionKey))
			continue;
		_sectionsKeysArray.push(sectionKey);
		var section = _sections[sectionKey];
		// internally used fields:
		section['sectionKey'] = sectionKey;
		section['items'] = {};
	}
	//
	/* Populate section objects with items */
	for (var itemKey in _items) {
		if (!_items.hasOwnProperty(itemKey))
			continue;
		var item = _items[itemKey];
		//
		if (item['options'] == undefined)
			item['options'] = {};
		//
		if (item['tags'] == undefined)
			item['tags'] = [];
		//
		if (item['supplier'] == undefined)
			item['supplier'] = '';
		//
		item['itemKey'] = itemKey;
		//
		var instancesStr = _storage.getItem('item' + '.' + itemKey);
		//
		if (instancesStr == null) {
			item['instances'] = [];
			item['quantity'] = 0;
		} else {
			var instances = JSON.parse(instancesStr);
			item['instances'] = instances;
			//
			var itemQuantity = 0;
			for (var i = 0; i < instances.length; i++) {
				var instance = instances[i];
				var quantity = instance['quantity'];
				itemQuantity += quantity;
			}
			item['quantity'] = itemQuantity;
			//
			if (itemQuantity !== 0)
				changeCartWithItem(item);
			//_cartItems[itemKey] = item;
			//
			_totalQuantity += itemQuantity;
		}
		//
		var sectionKeys = item['sections'];
		for (var i = 0; i < sectionKeys.length; i++) {
			var sectionKey = sectionKeys[i];
			var section = _sections[sectionKey];
			if (section === undefined)
				continue;
			section['items'][itemKey] = item;
		}
	}
	//_cartItems = sortObj(_cartItems);
	//
	/* Languages */
	var langChooserEl = byId('langChooser');
	var holderDiv = document.createElement('div');
	langChooserEl.appendChild(holderDiv);
	var first = true;
	for (var langKey in _languages) {
		if (!_languages.hasOwnProperty(langKey))
			continue;
		//
		_languagesCount++;
		if (first) {
			first = false;
			_defaultLangKey = langKey;
		} else {
			var separator = document.createElement('span');
			separator.classList.add('menuSeparator');
			holderDiv.appendChild(separator);
			separator.innerHTML = '&nbsp;•&nbsp;';
		}
		var language = _languages[langKey];
		//
		var a = document.createElement('a');
		holderDiv.appendChild(a);
		a.innerHTML = language;
		a.classList.add('menuLink');
		a.setAttribute('id', 'lang_' + langKey);
		a.setAttribute('onclick', 'reloadWithLang("' + langKey + '")');
	}
	//
	var langKeyToSet = _urlParams['lang'];
	if (langKeyToSet === undefined)
		langKeyToSet = _storage.getItem('langKey');
	if (langKeyToSet === null)
		langKeyToSet = _defaultLangKey;
	setLang(langKeyToSet);
	if (_languagesCount > 1) {
		langChooserEl.style.visibility = 'visible';
		langChooserEl.style.display = 'block';
	}
	//
	/* Currencies */
	var currencyChooser = byId('currencyChooser');
	var holderDiv = document.createElement('div');
	currencyChooser.appendChild(holderDiv);
	//
	first = true;
	for (var currencyKey in _currencies) {
		if (!_currencies.hasOwnProperty(currencyKey))
			continue;
		//
		_currenciesCount++;
		if (first) {
			first = false;
			_defaultCurrencyKey = currencyKey;
		} else {
			var separator = document.createElement('span');
			separator.classList.add('menuSeparator');
			holderDiv.appendChild(separator);
			separator.innerHTML = '&nbsp;•&nbsp;';
		}
		var currency = _currencies[currencyKey];
		//
		var a = document.createElement('a');
		holderDiv.appendChild(a);
		a.innerHTML = currency;
		a.classList.add('menuLink');
		a.setAttribute('id', 'currency_' + currencyKey);
		a.setAttribute('onclick', 'reloadWithCurrency("' + currencyKey + '")');
	}
	//
	var currencyKeyToSet = _urlParams['currency'];
	if (currencyKeyToSet === undefined)
		currencyKeyToSet = _storage.getItem('currencyKey');
	if (currencyKeyToSet === null)
		currencyKeyToSet = _defaultCurrencyKey;
	if (_currencies[currencyKeyToSet] === undefined)
		currencyKeyToSet = _defaultCurrencyKey;
	//
	setCurrency(currencyKeyToSet);
	if (_currenciesCount > 1) {
		currencyChooser.style.visibility = 'visible';
		currencyChooser.style.display = 'block';
	}
	//
	if (_languagesCount > 1 || _currenciesCount > 1)
		byId('headerBarBottom').style.display = 'block';
	//
	if (_languagesCount < 2 || _currenciesCount < 2)
		langChooserEl.style.borderBottom = 'none';
	//
	//
	/* Restore order number */
	_orderNo = _storage.getItem('no');
	//
	/* Restore order date */
	_orderDate = _storage.getItem('date');
	//
	/* Brand HTML */
	var brandHTMLHolderEl = byId('brandHTMLHolder');
	txt(brandHTMLHolderEl, _resources, 'brandHTML');
	//
	var footerContentHolderEl = byId('footerContentHolder');
	txt(footerContentHolderEl, _resources, 'footer');
	//
	//
	_paymentSystemsCurrentKey = _storage.getItem('paymentService');
	loadPaymentSystems();
	if (_paymentSystemsCurrentKey === null)
		if (_psKeys.length !== 0)
			_paymentSystemsCurrentKey = _psKeys[0];
		//
	var options = {
		modifyVars: {
			"@colorHeaderLink": _colors['colorHeaderLink'],
			"@colorHeaderLinkSelected": _colors['colorHeaderLinkSelected'],
			//
			"@headerBarBackground": _colors['headerBarBackground'],
			"@headerBarDivider": _colors['headerBarDivider'],
			"@menuLinkSelectedColor": _colors['menuLinkSelectedColor'],
			"@menuLinkColor": _colors['menuLinkColor'],
			//
			"@itemBarCartColor": _colors['itemBarCartColor'],
			"@itemBarCartColorHover": _colors['itemBarCartColorHover'],
			"@itemBarBadgeBackground": _colors['itemBarBadgeBackground'],
			"@itemBarBadgeColor": _colors['itemBarBadgeColor'],
			"@itemBarArrowColor": _colors['itemBarArrowColor'],
			//
			"@verticalGapPx": _layout['verticalGapPx'] + 'px',
			"@multiColumnMaxWidthPx": _layout['multiColumnMaxWidthPx'] + 'px',
			"@singleColumnMaxWidthPx": _layout['singleColumnMaxWidthPx'] + 'px',
			"@multiColumnHorizontalGapPx": _layout['multiColumnHorizontalGapPx'] + 'px',
			"@singleColumnHorizontalMarginPx": _layout['singleColumnHorizontalMarginPx'] + 'px'
		}
	};

	var lessInlineEls = document.head.querySelectorAll("style[type='text/z-less']");
	if (lessInlineEls.length == 0) {
		less.modifyVars(options.modifyVars);
		less.refreshStyles();
	} else {
		var n = 0;
		for (var i = 0; i < lessInlineEls.length; i++) {
			var lessInlineEl = lessInlineEls[i];
			var lessInput = lessInlineEl.textContent;
			less.render(lessInput, options)
				.then(function (output) {
						var lessInlineEl = lessInlineEls[n];
						var styleEl = document.createElement('style');
						styleEl.textContent = output.css;
						styleEl.type = 'text/css';
						lessInlineEl.parentElement.replaceChild(styleEl, lessInlineEl);
						n++;
					},
					function (error) {
						console.log(error);
					});
		}
	}
	//
	_savedInnerWidth = innerWidth;
}

function redisplayMenu() {
	var first = true;
	var ul = byId('menuChooser');
	ul.innerHTML = '';
	for (var sectionKey in _sections) {
		if (!_sections.hasOwnProperty(sectionKey))
			continue;
		var section = _sections[sectionKey];
		var name = section['name'];
		var showInMenu = section['showInMenu'];
		if (showInMenu !== true)
			continue;
		var sectionId = 'section.' + sectionKey;
		var sectionEl = byId(sectionId);
		if (sectionEl == null)
			continue;
		if (sectionEl.style.display == 'none')
			continue;
		var a = document.createElement('a');
		if (first)
			first = false;
		else {
			var separator = document.createElement('span');
			separator.classList.add('menuSeparator');
			ul.appendChild(separator);
			separator.innerHTML = '&nbsp;•&nbsp;';
		}
		a.setAttribute('id', 'menu-item-a' + '.' + sectionKey);
		a.setAttribute('data-sectionkey', sectionKey);
		a.onclick = function (event) {
			var sectionKey = event.target.getAttribute('data-sectionkey');
			xopen(sectionKey);
		};
		a.classList.add('menuLink');
		ul.appendChild(a);
		txt(a, section, 'name');
		if (sectionKey == 'ID_CART')
			txt(a, section, 'name', [_totalQuantity, formatMoneyValue(_total)]);
		a.style.color = getColor('menuLinkColor', sectionKey);
	}
	if (ul.innerHTML !== '')
		byId('headerBarTop').style.display = 'block';
}

function jumpToSection(sectionKey) {
	var anchorId = 'sectionAnchor.' + sectionKey;
	var anchor = byId(anchorId);
	var checkBox = byId('checkboxShowSection.' + sectionKey);
	if (checkBox != null) {
		checkBox.checked = true;
		var event = document.createEvent("HTMLEvents");
		event.initEvent("change", false, true);
		checkBox.dispatchEvent(event);
	}
	//
	var top = anchor.offsetTop;
	window.scrollTo(0, top);
}

function getOrderData() {
	var orderData = {
		"no": _orderNo,
		"date": _orderDate,
		"customerDetails": _customerDetails,
		"orderOptions": _orderOptions,
		"items": {}
	};
	//
	for (var itemKey in _cartItems) {
		if (!_cartItems.hasOwnProperty(itemKey))
			continue;
		var item = _cartItems[itemKey];
		orderData['items'][itemKey] = item['instances'];
	}
	//
	return orderData;
}

function getOrderUrl() {
	var orderData = getOrderData();
	var orderDataStr = JSON.stringify(orderData, null, 0);
	var url = location.href.split("#")[0];
	url = url.split("?")[0];
	url += "?lang=" + _langKey + "&currency=" + _currencyKey + "&viewOrder&order=" + LZString.compressToEncodedURIComponent(orderDataStr) + '#' + 'ID_ORDER';
	return url;
}

function processUrlParameters() {
	var clearCartParam = _urlParams['clearCart'];
	if (clearCartParam !== undefined)
		clearCart();
	//
	var sectionKey = _urlParams['section'];
	if (sectionKey === undefined) {
		var pos = location.href.indexOf('#');
		if (pos != -1)
			sectionKey = location.href.substring(pos + 1);
	}
	if (sectionKey !== undefined) {
		var itemKey = _urlParams['item'];
		xopen(sectionKey, itemKey);
	}
}

function xopen(sectionKey, itemKey) {
	var ok = setSectionVisible(sectionKey, true);
	if (!ok)
		return;
	if (itemKey === undefined)
		jumpToSection(sectionKey);
	else {
		var needOpen = true;
		if (_currentThumbnailEl !== null) {
			var currentItemKey = _currentThumbnailEl.dataset.itemkey;
			var currentSectionKey = _currentThumbnailEl.dataset.sectionkey;
			if (currentItemKey == itemKey && currentSectionKey == sectionKey)
				needOpen = false;
		}
		if (needOpen) {
			var thumbnailId = 'thumbnail.' + sectionKey + '.' + itemKey;
			var thumbnailEl = byId(thumbnailId);
			if (thumbnailEl == null) {
				jumpToSection(sectionKey);
				return;
			}
			//
			var event = document.createEvent("HTMLEvents");
			event.initEvent("click", false, true);
			thumbnailEl.dispatchEvent(event);
		}
		//
		var productPageId = 'productPage.' + sectionKey + '.' + itemKey;
		var productPageEl = byId(productPageId);
		if (productPageEl != null)
			window.scroll(0, findPos(productPageEl));
	}
}

function findPos(obj) {
	var curtop = 0;
	if (obj.offsetParent) {
		do {
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
		return curtop - _headerBarHeight; // header bar height
	}
}

function setLang(langKeyToSet) {
	for (var langKey in _languages) {
		if (!_languages.hasOwnProperty(langKey))
			continue;
		var langSpan = byId('lang_' + langKey);
		langSpan.classList.remove('menuLinkSelected');
	}
	//
	_langKey = langKeyToSet;
	_fonts = getFonts(_langKey);
	setFonts();

	save('langKey', _langKey);
	//
	var langSpan = byId('lang_' + _langKey);
	langSpan.classList.add('menuLinkSelected');
	updateMenu();
	updateTitle();
}

function setCurrency(currencyKeyToSet) {
	for (var currencyKey in _currencies) {
		if (!_currencies.hasOwnProperty(currencyKey))
			continue;
		var currencySpan = byId('currency_' + currencyKey);
		currencySpan.classList.remove('menuLinkSelected');
	}
	//
	_currencyKey = currencyKeyToSet;
	save('currencyKey', _currencyKey);
	var currencySpan = byId('currency_' + _currencyKey);
	currencySpan.classList.add('menuLinkSelected');
	updateMenu();
}

function redisplayCartItems() {
	for (var itemKey in _cartItems) {
		if (!_cartItems.hasOwnProperty(itemKey))
			continue;
		var item = _cartItems[itemKey];
		updateItemUI(item);
	}
}

function reloadWithLang(langKey) {
	setLang(langKey);
	updateTextAll();
	redisplayCartItems();
	window.dispatchEvent(new Event('resize'));
}

function reloadWithCurrency(currencyKey) {
	setCurrency(currencyKey);
	updateMoneyAll();
	updateOptionableNumAll();
	redisplayOrderOptions();
	redisplayCartItems();
}

function setSectionVisible(sectionKey, visible) {
	var sectionAnchorEl = byId('sectionAnchor.' + sectionKey);
	if (sectionAnchorEl == null)
		return false;
	var sectionRowEl = byId('sectionRow.' + sectionKey);
	if (visible) {
		sectionAnchorEl.style.display = 'block';
		sectionRowEl.style.display = 'block';
	} else {
		sectionAnchorEl.style.display = 'none';
		sectionRowEl.style.display = 'none';
	}
	return true;
}

function goSection(sectionKey, n) {
	var i = _sectionsKeysArray.indexOf(sectionKey);
	var nextOrPrevSectionId = 'sectionAnchor.' + _sectionsKeysArray[i + n];
	var sectionAnchorEl = byId(nextOrPrevSectionId);
	if (sectionAnchorEl.style.display == 'none') {
		n = n + (n > 0 ? +1 : -1);
		goSection(sectionKey, n);
		return;
	}
	smoothScrollById(nextOrPrevSectionId);
}

function manageButtonsPrevNext() {
	var firstVisibleSectionId = 'section.' + _sectionsKeysArray[0];
	var firstVisibleSectionEl = byId(firstVisibleSectionId);
	var buttonPrev = firstVisibleSectionEl.getElementsByClassName('buttonPrev')[0];
	buttonPrev.style.visibility = 'hidden';
	//
	for (var i = 0; i < _sectionsKeysArray.length; i++) {
		var sectionId = 'section.' + _sectionsKeysArray[i];
		var sectionEl = byId(sectionId);
		var buttonNext = sectionEl.getElementsByClassName('buttonNext')[0];
		buttonNext.style.visibility = 'visible';
	}
	//
	var lastVisibleSectionId = null;
	for (var i = 0; i < _sectionsKeysArray.length; i++) {
		var sectionId = 'section.' + _sectionsKeysArray[i];
		var sectionEl = byId(sectionId);
		//
		if (sectionEl.style.display === 'none') {
			lastVisibleSectionId = 'section.' + _sectionsKeysArray[i - 1];
			break;
		}
	}
	//
	if (lastVisibleSectionId === null)
		lastVisibleSectionId = 'section.' + _sectionsKeysArray[_sectionsKeysArray.length - 1];
	//
	var lastVisibleSectionEl = byId(lastVisibleSectionId);
	//
	var buttonNext = lastVisibleSectionEl.getElementsByClassName('buttonNext')[0];
	buttonNext.style.visibility = 'hidden';
}

function updateInstances(el, item) {
	var itemKey = item['itemKey'];
	var instances = item['instances'];
	//
	if (el.getElementsByClassName('instancesTbody').length == 0)
		return;
	//
	var deleteAllItemInstancesEl = el.getElementsByClassName('deleteAllItemInstances')[0];
	deleteAllItemInstancesEl.innerHTML = _resources['iconDelete'];
	deleteAllItemInstancesEl.onclick = function (event) {
		clickDeleteAllItemInstancesHandler(event, itemKey);
	};
	//
	txt(el.getElementsByClassName('instancesListTitle')[0], _resources, 'instancesListTitle');
	//
	txt(el.getElementsByClassName('thInstanceColumnOptions')[0], _resources, 'thInstanceColumnOptions');
	txt(el.getElementsByClassName('thInstanceColumnPrice')[0], _resources, 'thInstanceColumnPrice');
	txt(el.getElementsByClassName('thInstanceColumnQuantity')[0], _resources, 'thInstanceColumnQuantity');
	txt(el.getElementsByClassName('thInstanceColumnTotal')[0], _resources, 'thInstanceColumnTotal');
	//
	var tbodyEl = el.getElementsByClassName('instancesTbody')[0];
	tbodyEl.innerHTML = '';
	var totalQuantity = 0;
	var total = 0;
	for (var i = 0; i < instances.length; i++) {
		var instance = instances[i];
		var instanceQuantity = instance['quantity'];
		var instanceOptions = instance['options'];
		//
		var price = getOptionableNum(item, 'price', instanceOptions);
		//
		var sum = instanceQuantity * price;
		total += sum;
		totalQuantity += instanceQuantity;
		//
		var trEl = document.createElement('tr');
		trEl.classList.add('tr_' + i);
		trEl.setAttribute('style', 'border-bottom: 1px solid #ccc');
		tbodyEl.appendChild(trEl);
		//
		var tdNoEl = document.createElement('td');

		var spanNoEl = document.createElement('span');
		spanNoEl.setAttribute('style', 'font-weight: bold');
		//
		appendDeleteIcon(tdNoEl, itemKey, i);
		//
		tdNoEl.appendChild(spanNoEl);
		trEl.appendChild(tdNoEl);
		//			}
		spanNoEl.innerHTML = i + 1;
		tdNoEl.setAttribute('style', "width: 50px; border-left: 1px solid #ccc; border-right: 1px solid #ccc; background: #eee; text-align: right; padding: 5px;");
		//
		var tdOptionsEl = document.createElement('td');
		tdOptionsEl.setAttribute('style', 'border-right: 1px solid #ccc; padding: 5px;');
		trEl.appendChild(tdOptionsEl);
		tdOptionsEl.innerHTML = buildItemOptionsString(instanceOptions);
		//
		var tdPriceId = 'instancesTdPrice.' + i + '.' + itemKey;
		var tdPrice = document.createElement('td');
		tdPrice.setAttribute('id', tdPriceId);
		tdPrice.setAttribute('data-nocurrencysymbol', true);
		tdPrice.setAttribute('style', "border-right: 1px solid #ccc; text-align: right; padding: 5px;");
		trEl.appendChild(tdPrice);
		pan(tdPrice, item, 'price', instanceOptions);
		//
		var tdQuantityEl = document.createElement('td');
		tdQuantityEl.setAttribute('style', 'border-right: 1px solid #ccc; text-align: right; padding: 5px;');
		//
		trEl.appendChild(tdQuantityEl);
		//
		appendPlusMinusIcons(tdQuantityEl, itemKey, i);
		//
		var tdQuantityValEl = document.createElement('input');
		tdQuantityValEl.setAttribute('data-itemkey', itemKey);
		tdQuantityValEl.setAttribute('data-instanceindex', i);
		tdQuantityValEl.setAttribute('type', 'number');
		tdQuantityValEl.setAttribute('min', 0);
		tdQuantityValEl.classList.add('quantityInput');
		tdQuantityValEl.value = instanceQuantity;
		tdQuantityValEl.innerHTML = instanceQuantity;
		tdQuantityValEl.onchange = function (event) {
				quantityInputChanged(event);
			}
			//		tdQuantityValEl.onkeydown = function (e) {
			//			if (!((e.keyCode > 95 && e.keyCode < 106) || (e.keyCode > 47 && e.keyCode < 58) || e.keyCode == 8))
			//				return false;
			//		}
		tdQuantityEl.appendChild(tdQuantityValEl);
		//
		var tdTotalEl = document.createElement('td');
		tdTotalEl.setAttribute('style', 'text-align: right; padding: 5px;');
		tdTotalEl.innerHTML = formatMoneyValueWithoutCurrencySymbol(sum);
		trEl.appendChild(tdTotalEl);
	}
	var totalQuantityInputEl = el.getElementsByClassName('instancesTotalQuantity')[0];
	totalQuantityInputEl.innerHTML = totalQuantity;
	//
	var tdTotalEl = el.getElementsByClassName('instancesTotal')[0];
	tdTotalEl.innerHTML = formatMoneyValueWithoutCurrencySymbol(total);
	//
	var instancesHolderEl = el.getElementsByClassName('instancesHolder')[0];
	instancesHolderEl.style.display = totalQuantity == 0 ? 'none' : 'block';
	//
	var currencySymbol = _currencies_symbols[_currencyKey];
	var currencySymbolEls = el.getElementsByClassName('currencySymbol');
	for (var i = 0; i < currencySymbolEls.length; i++)
		currencySymbolEls[i].innerHTML = currencySymbol;
}

function appendDeleteIcon(parentEl, itemKey, instanceIndex) {
	var deleteIconEl = document.createElement('div');
	deleteIconEl.setAttribute('data-itemkey', itemKey);
	deleteIconEl.setAttribute('data-instanceindex', instanceIndex);
	deleteIconEl.classList.add('noPrint');
	deleteIconEl.classList.add('noSelect');
	deleteIconEl.classList.add('quantitySign');
	deleteIconEl.classList.add('fontawesome20px');
	deleteIconEl.setAttribute('style', 'float: left; display: inline; vertical-align: sub;');
	//
	deleteIconEl.innerHTML = _resources['iconDelete'];
	deleteIconEl.onclick = function (event) {
		clickDeleteHandler(event);
	};
	parentEl.appendChild(deleteIconEl);
}

function appendPlusMinusIcons(tdQuantityEl, itemKey, instanceIndex) {
	var holderEl = document.createElement('div');
	holderEl.setAttribute('style', 'position: absolute; float: left;');
	tdQuantityEl.appendChild(holderEl);

	var tdPlusEl = document.createElement('div');
	tdPlusEl.setAttribute('data-itemkey', itemKey);
	tdPlusEl.setAttribute('data-instanceindex', instanceIndex);
	tdPlusEl.classList.add('noPrint');
	tdPlusEl.classList.add('noSelect');
	tdPlusEl.classList.add('quantitySign');
	tdPlusEl.classList.add('fontawesome20px');
	tdPlusEl.setAttribute('style', 'display: inline; vertical-align: sub; margin-right: 5px;');
	//
	tdPlusEl.innerHTML = _resources['iconPlus'];
	tdPlusEl.onclick = function (event) {
		clickPlusMinusHandler(event, +1);
	};
	holderEl.appendChild(tdPlusEl);
	//
	var tdMinusEl = document.createElement('span');
	tdMinusEl.setAttribute('data-itemkey', itemKey);
	tdMinusEl.setAttribute('data-instanceindex', instanceIndex);
	tdMinusEl.classList.add('noPrint');
	tdMinusEl.classList.add('quantitySign');
	tdMinusEl.classList.add('fontawesome20px');
	tdMinusEl.setAttribute('style', 'display: inline; vertical-align: sub; margin-right: 5px;');
	//
	tdMinusEl.innerHTML = _resources['iconMinus'];
	tdMinusEl.onclick = function (event) {
		clickPlusMinusHandler(event, -1);
	};
	holderEl.appendChild(tdMinusEl);
}

function updateThumbnail(el, item) {
	var itemKey = item['itemKey'];
	var quantity = item['quantity'];
	//var price = getMoney(item, 'price');
	var price = getOptionableNum(item, 'price');
	var badgeEl = el.getElementsByClassName('badge')[0];
	var inCartEl = el.getElementsByClassName('inCart')[0];
	badgeEl.innerHTML = '&times;' + quantity;
	el.getElementsByClassName('cartChr')[0].innerHTML = _resources['iconCart'];
	inCartEl.style.visibility = quantity == 0 ? 'hidden' : 'visible';
	//
	updateInstances(el, item);
}

function onResizeHandler() {
	if (innerWidth <= _single_column_px && _savedInnerWidth > _single_column_px) { // to single-column mode
		if (_currentThumbnailEl != null) {
			var colEl = _itemDetailsPageEl.parentElement;
			var rowEl = colEl.parentElement;
			//
			rowEl.parentElement.removeChild(rowEl);
			_currentThumbnailEl.style.display = 'none';
			//
			var parent = _currentThumbnailEl.parentElement;
			parent.appendChild(_itemDetailsPageEl);
		}
	} else if (innerWidth > _single_column_px && _savedInnerWidth <= _single_column_px) { // to multi-column mode
		if (_currentThumbnailEl != null) {
			_itemDetailsPageEl.parentElement.removeChild(_itemDetailsPageEl);
			_currentThumbnailEl.style.display = 'block';
			//
			var colEl = _currentThumbnailEl.parentElement;
			var rowEl = colEl.parentElement;
			//
			var newRowEl = document.createElement('div');
			newRowEl.classList.add('row');
			var newColEl = document.createElement('div');
			newColEl.classList.add('col-12');
			//
			newColEl.appendChild(_itemDetailsPageEl);
			newRowEl.appendChild(newColEl);
			//
			var containerEl = rowEl.parentElement;
			var nextRowEl = rowEl.nextSibling;
			containerEl.insertBefore(newRowEl, nextRowEl);
		}
	}
	//
	var langChooserEl = byId('langChooser');
	var currencyChooserEl = byId('currencyChooser');
	if (isMultiColumnMode()) {
		langChooserEl.style.display = 'block';
		currencyChooserEl.style.display = 'block';
	} else {
		if (_languagesCount < 2)
			langChooserEl.style.display = 'none';
		if (_currenciesCount < 2)
			currencyChooserEl.style.display = 'none';
	}
	//
	_savedInnerWidth = innerWidth;
}

function thumbnailClickHandler(thumbnailEl, sectionKey) {
	var itemKey = thumbnailEl.dataset.itemkey;
	var item = _items[itemKey];
	//
	if (isMultiColumnMode()) {
		if (_currentThumbnailEl == thumbnailEl)
			productPageClickHandler();
		else {
			if (_itemDetailsPageEl !== null)
				removeDetailsPage();
			createItemDetailPage(thumbnailEl, sectionKey, true);
			_currentThumbnailEl = thumbnailEl;
		}
	} else {
		if (_currentThumbnailEl == thumbnailEl)
			productPageClickHandler();
		else {
			if (_itemDetailsPageEl !== null) {
				removeDetailsPage();
				_currentThumbnailEl.style.display = 'block';
			}
			createItemDetailPage(thumbnailEl, sectionKey, false);
			_currentThumbnailEl = thumbnailEl;
		}
	}
}

function removeDetailsPage() {
	_pageYOffsetBeforeRemoveDetails = _itemDetailsPageEl.getBoundingClientRect().top;
	//
	setVerticalVisible(_currentThumbnailEl, false);
	if (isMultiColumnMode()) {
		var colEl = _itemDetailsPageEl.parentElement;
		var rowEl = colEl.parentElement;
		rowEl.parentElement.removeChild(rowEl);
	} else
		_itemDetailsPageEl.parentElement.removeChild(_itemDetailsPageEl);
}

function createItemDetailPage(thumbnailEl, sectionKey, multiColumnMode) {
	var itemKey = thumbnailEl.dataset.itemkey;
	//
	var item = _items[itemKey];
	//
	var colEl = thumbnailEl.parentElement;
	var rowEl = colEl.parentElement;
	//
	_itemDetailsPageEl = customCreateItemDetailsPage(item, sectionKey);

	_itemDetailsPageEl.setAttribute('data-itemkey', itemKey);
	updateThumbnail(_itemDetailsPageEl, item);
	//
	if (multiColumnMode) {
		var newRowEl = document.createElement('div');
		newRowEl.classList.add('row');
		var newColEl = document.createElement('div');
		newColEl.classList.add('col-12');
		newColEl.appendChild(_itemDetailsPageEl);
		newRowEl.appendChild(newColEl);
		//
		var containerEl = rowEl.parentElement;
		var nextRowEl = rowEl.nextSibling;
		containerEl.insertBefore(newRowEl, nextRowEl);
		//
		var needScroll = _pageYOffsetBeforeRemoveDetails !== _itemDetailsPageEl.getBoundingClientRect().top;
		if (_currentThumbnailEl == null || needScroll) {
			var slideDuration = 500;
			$(_itemDetailsPageEl).stop(true, true).fadeIn({
				duration: slideDuration,
				queue: false
			}).css('display', 'none').slideDown(slideDuration);
		}
	} else {
		var colEl = thumbnailEl.parentElement;
		colEl.appendChild(_itemDetailsPageEl);
		_itemDetailsPageEl.style.display = 'block';
		thumbnailEl.style.display = 'none';
	}
	setVerticalVisible(thumbnailEl, true);
}

function setVerticalVisible(thumbnailEl, visible) {
	thumbnailEl.getElementsByClassName('vertical')[0].style.display = visible ? 'block' : 'none';
}

function productPageClickHandler() {
	closeColorWindow();
	setVerticalVisible(_currentThumbnailEl, false);
	if (isMultiColumnMode()) {
		var slideDuration = 500;
		$(_itemDetailsPageEl).stop(true, true).fadeOut({
			duration: slideDuration,
			queue: false
		}).slideUp(slideDuration, function () {
			if (_itemDetailsPageEl !== null) {
				removeDetailsPage();
				_itemDetailsPageEl = null;
			}
			_currentThumbnailEl = null;
		});
	} else {
		if (_itemDetailsPageEl !== null) {
			removeDetailsPage();
			_itemDetailsPageEl = null;
			_currentThumbnailEl.style.display = 'block';
			_currentThumbnailEl = null;
		}

	}
}

function createList(customCreateThumbnail) {
	var listEl = document.createElement('div');
	listEl.classList.add('container');
	for (var sectionKey in _sections) {
		if (!_sections.hasOwnProperty(sectionKey))
			continue;
		var section = _sections[sectionKey];
		//
		var sectionAnchorEl = document.createElement('a');
		sectionAnchorEl.setAttribute('id', 'sectionAnchor.' + sectionKey);
		sectionAnchorEl.setAttribute('name', sectionKey);
		sectionAnchorEl.classList.add('sectionAnchor');
		listEl.appendChild(sectionAnchorEl);
		//
		var rowEl = document.createElement('div');
		rowEl.setAttribute('id', 'sectionRow.' + sectionKey);
		rowEl.classList.add('row');
		listEl.appendChild(rowEl);
		//
		var colEl = document.createElement('div');
		colEl.classList.add('col-' + _columnsCount);
		rowEl.appendChild(colEl);
		//
		var sectionEl = createSection(sectionKey, section, customCreateThumbnail);
		colEl.appendChild(sectionEl);
		//
		if (section['showInCatalog']) {
			rowEl.style.display = 'none';
			sectionAnchorEl.style.display = 'none';
		}
	}
	return listEl;
}

function createSection(sectionKey, section, customCreateThumbnail) {
	var cart = JSON.parse(sectionKey == 'ID_CART');
	var order = JSON.parse(sectionKey == 'ID_ORDER');
	var checkout = JSON.parse(sectionKey == 'ID_CHECKOUT');
	var afterThePurchase = JSON.parse(sectionKey == 'ID_AFTER_THE_PURCHASE');
	//
	var sectionEl = document.createElement('div');
	sectionEl.classList.add('section');
	//
	sectionEl.innerHTML = htmlBlocks['section'];
	var sectionHeaderEl = sectionEl.getElementsByClassName('sectionHeader')[0];
	//
	sectionHeaderEl.style.background = getColor('sectionHeaderBackground', sectionKey);
	sectionHeaderEl.style.color = getColor('sectionHeaderForeground', sectionKey);
	//
	var sectionBodyHeaderEl = sectionEl.getElementsByClassName('sectionBodyHeader')[0];
	sectionBodyHeaderEl.setAttribute('id', 'sectionBodyHeader.' + sectionKey);
	if (sectionKey == 'ID_CATALOG') {
		sectionBodyHeaderEl.style.marginTop = '20px';
		for (var curSectionKey in _sections) {
			if (!_sections.hasOwnProperty(curSectionKey))
				continue;
			var curSection = _sections[curSectionKey];
			if (curSection['showInCatalog']) {
				//
				var curCheckBoxId = 'checkboxShowSection.' + curSectionKey;
				var curCheckBox = document.createElement('input');
				curCheckBox.setAttribute('id', curCheckBoxId);
				curCheckBox.setAttribute('data-sectionkey', curSectionKey);
				curCheckBox.setAttribute('type', 'checkbox');
				curCheckBox.classList.add('catalogCheckBox');
				//
				curCheckBox.onchange = function (event) {
					var checkBoxEl = event.target;
					var sectionkey = checkBoxEl.getAttribute('data-sectionkey');
					var checked = checkBoxEl.checked;
					setSectionVisible(sectionkey, checked);
				}
				sectionBodyHeaderEl.appendChild(curCheckBox);
				//
				var spanNameEl = document.createElement('span');
				spanNameEl.onclick = function (event) {
					var el = event.target;
					var sectionkey = el.getAttribute('data-sectionkey');
					xopen(sectionkey);
				};
				spanNameEl.classList.add('catalog');
				spanNameEl.setAttribute('data-sectionkey', curSectionKey);
				spanNameEl.setAttribute('id', 'checkboxShowSectionSpanName.' + curSectionKey);
				txt(spanNameEl, curSection, 'name');
				sectionBodyHeaderEl.appendChild(spanNameEl);
				//
				var count = Object.getOwnPropertyNames(curSection['items']).length;
				var spanCountEl = document.createElement('span');
				spanCountEl.classList.add('catalogItemCount');
				spanCountEl.innerHTML = '&nbsp;(' + count + ')<br>';
				sectionBodyHeaderEl.appendChild(spanCountEl);
			}
		}
	} else
		txt(sectionBodyHeaderEl, section, 'header');
	//
	var sectionBodyFooterEl = sectionEl.getElementsByClassName('sectionBodyFooter')[0];
	sectionBodyFooterEl.setAttribute('id', 'sectionBodyFooter.' + sectionKey);
	txt(sectionBodyFooterEl, section, 'footer');
	//
	var cartSectionIndex = _sectionsKeysArray.indexOf('ID_CART');
	var sectionIndex = _sectionsKeysArray.indexOf(sectionKey);
	var items;
	if (sectionIndex >= cartSectionIndex) {
		var cartSection = _sections['ID_CART'];
		items = cartSection['items'];
		sectionEl.style.display = Object.getOwnPropertyNames(items).length == 0 ? 'none' : 'block';
	} else
		items = section['items'];
	sectionEl.setAttribute('id', 'section.' + sectionKey);
	var sectionBodyEl = sectionEl.getElementsByClassName('sectionBody')[0];
	var containerEl;
	if (order)
		containerEl = createContainerForBlock('block_order');
	else if (checkout)
		containerEl = createContainerForBlock('block_checkout');
	else {
		containerEl = createContainer();
		fillContainer(containerEl, sectionKey, items);
	}
	//
	var sectionNameEl = sectionEl.getElementsByClassName('sectionName')[0];
	sectionNameEl.setAttribute('id', 'sectionName.' + sectionKey);
	txt(sectionNameEl, section, 'name');
	//
	if (sectionNameEl.innerHTML == '' && sectionDescriptionEl.innerHTML == '')
		sectionHeaderEl.style.display = 'none';
	//
	var sectionDescriptionEl = sectionEl.getElementsByClassName('sectionDescription')[0];
	sectionDescriptionEl.setAttribute('id', 'sectionDescription.' + sectionKey);
	var count = Object.getOwnPropertyNames(section['items']).length;
	txt(sectionDescriptionEl, section, 'description', [count]);
	//
	sectionBodyEl.appendChild(containerEl);
	//
	var buttonPrev = sectionEl.getElementsByClassName('buttonPrev')[0];
	buttonPrev.setAttribute('data-sectionkey', sectionKey);
	//
	buttonPrev.onclick = function () {
		var sectionKey = buttonPrev.dataset.sectionkey;
		goSection(sectionKey, -1);
	};
	//
	var buttonNext = sectionEl.getElementsByClassName('buttonNext')[0];
	buttonNext.setAttribute('data-sectionkey', sectionKey);
	//
	buttonNext.onclick = function () {
		var sectionKey = buttonNext.dataset.sectionkey;
		goSection(sectionKey, +1);
	};
	//
	return sectionEl;
}

function createContainerForBlock(blockId) {
	var containerEl = document.createElement('div');
	containerEl.classList.add('container');
	//
	var rowEl = document.createElement('div');
	rowEl.classList.add('row');
	containerEl.appendChild(rowEl);
	//
	var colEl = document.createElement('div');
	colEl.classList.add('col-' + _columnsCount);
	rowEl.appendChild(colEl);
	//
	colEl.innerHTML = htmlBlocks[blockId];
	//
	return containerEl;
}

function createContainer() {
	var containerEl = document.createElement('div');
	containerEl.classList.add('container');
	return containerEl;
}

function fillContainer(containerEl, sectionKey, items) {
	var section = _sections[sectionKey];
	var c = 0;
	var ri = 0;
	var ci = 0;
	var rowEl;
	for (var itemKey in items) {
		if (!items.hasOwnProperty(itemKey))
			continue;
		//
		var item = items[itemKey];
		//
		if (c == 0) {
			rowEl = document.createElement('div');
			rowEl.classList.add('row');
			rowEl.setAttribute('data-index', ri);
			containerEl.appendChild(rowEl);
			ri++;
		}
		//
		var colEl = document.createElement('div');
		colEl.classList.add('col-' + _colSpan);
		colEl.setAttribute('data-index', ci);
		var thumbnailEl = customCreateThumbnail(item, sectionKey);
		updateThumbnail(thumbnailEl, item);
		//
		colEl.appendChild(thumbnailEl);
		rowEl.appendChild(colEl);
		c += _colSpan;
		ci++;
		//
		if (c == _columnsCount) {
			c = 0;
			ci = 0;
		}
	}
}

function loadPaymentSystems() {
	_psKeys = [];
	//
	for (var psKey in _payment_service_providers) {
		if (!_payment_service_providers.hasOwnProperty(psKey))
			continue;
		if (_payment_service_providers[psKey]['currencies'].indexOf(_currencyKey) == -1)
			continue;
		_psKeys.push(psKey);
	}
}

/* called in HTML file of order options (See: sections.js -> "ID_ORDER" -> "header") (onchange) */
function redisplayOrderOptions() {
	var orderStoreDetails = getTextArray(_orderStoreDetails);
	var len = Math.max(orderStoreDetails.length, _customerDetails.length);

	var customerDetailsTbodyEl = byId('customerDetailsTbody');
	customerDetailsTbodyEl.innerHTML = '';
	for (var i = 0; i < len; i++) {
		var trEl = document.createElement('tr');
		customerDetailsTbodyEl.appendChild(trEl);
		//
		var tdStoreDetailsEl = document.createElement('td');
		//tdStoreDetailsEl.classList.add('storeDetailText');
		tdStoreDetailsEl.setAttribute('style', 'white-space: nowrap; font-weight: bold; border-right: 3px solid #000; padding-right: 15px;');
		trEl.appendChild(tdStoreDetailsEl);
		//
		var tdTextEl = document.createElement('td');
		tdTextEl.setAttribute('id', 'customer_detail' + '.' + i);
		//tdTextEl.classList.add('customerDetailText');
		tdTextEl.setAttribute('style', 'white-space: nowrap; padding-left: 15px; padding-right: 10px;');
		trEl.appendChild(tdTextEl);
		//
		var tdValueEl = document.createElement('td');
		trEl.appendChild(tdValueEl);
		//
		if (i < _customerDetails.length) {
			var customerDetail = _customerDetails[i];
			//
			txt(tdTextEl, customerDetail, 'text');
			//
			var customerDetailValue = customerDetail['value'];
			if (customerDetailValue == '')
				customerDetailValue == ' ';
			tdValueEl.innerHTML = customerDetailValue;
			//tdValueEl.classList.add('customerDetailValue');
			tdValueEl.setAttribute('style', 'width: 100%; font-weight: bold; border-bottom: 1px solid #ccc; white-space: nowrap;');
		}
		//
		if (i < orderStoreDetails.length) {
			var orderStoreDetail = orderStoreDetails[i];
			tdStoreDetailsEl.innerHTML = orderStoreDetail;
		}
	}
	//
	var checkoutTotalTrEl = byId('checkoutTotalTr');
	var parent = checkoutTotalTrEl.parentElement;
	var children = parent.children;
	for (var i = 0; i < children.length; i++) {
		var child = children[i];
		if (child.classList.contains('orderOptionTr')) {
			parent.removeChild(child);
			i--;
		}
	}
	//
	_shipping = 0;
	//
	_orderOptions = getOrderOptions();
	for (var i = 0; i < _orderOptions.length; i++) {
		var orderOption = _orderOptions[i];
		var trEl = document.createElement('tr');
		trEl.classList.add('orderOptionTr');
		trEl.setAttribute('style', 'border-bottom: 1px solid #ccc;');
		checkoutTotalTrEl.parentNode.insertBefore(trEl, checkoutTotalTrEl);
		//
		var tdTextEl = document.createElement('td');
		tdTextEl.setAttribute('id', 'order_option.' + i);
		tdTextEl.setAttribute('colspan', '5');
		tdTextEl.setAttribute('style', 'border-left: 2px solid #000; border-right: 2px solid #000; padding: 5px;');
		txt(tdTextEl, orderOption, 'text');
		trEl.appendChild(tdTextEl);
		//
		var tdAmountEl = document.createElement('td');
		tdAmountEl.setAttribute('style', 'border-right: 2px solid #000; text-align: right; padding: 5px;');
		tdAmountEl.setAttribute('data-nocurrencysymbol', true);
		man(tdAmountEl, orderOption, 'amount');
		trEl.appendChild(tdAmountEl);
		//
		_shipping += getMoney(orderOption, 'amount');
	}
	//
	var orderNoEl = byId('orderNo');
	if (_orderNo == null) {
		_orderNo = generateOrderNumber();
		save('no', _orderNo);
	}
	orderNoEl.innerHTML = _orderNo;
	//
	if (_orderDate == null) {
		_orderDate = generateOrderDate();
		save('date', _orderDate);
	}
	byId('orderDateYYYY').innerHTML = _orderDate.substring(0, 4);
	byId('orderDateMM').innerHTML = _orderDate.substring(5, 7);
	byId('orderDateDD').innerHTML = _orderDate.substring(8, 10);
	//
	updateCheckoutTotal();
}

function generateOrderDate() {
	var date = new Date();
	//
	var yyyy = date.getFullYear();
	var mm = leftPadNumWithZeros(date.getMonth() + 1, 2);
	var dd = leftPadNumWithZeros(date.getDate(), 2);
	//
	return yyyy + '-' + mm + '-' + dd;
}

function updateCheckoutTotal() {
	var checkoutTotal = _total + _shipping;
	byId('checkoutTotal').innerHTML = formatMoneyValueWithoutCurrencySymbol(checkoutTotal);
	//
	var priceEl = byId('buttonCheckoutPrice');
	priceEl.innerHTML = formatMoneyValue(checkoutTotal);
}

function paymentSystems() {
	var checkoutFormEl = byId('checkoutForm');
	var buttonCheckoutEl = checkoutFormEl.getElementsByClassName('buttonCheckout')[0];
	//
	var checkoutOptionsEl = byId('checkoutOptions');
	checkoutOptionsEl.innerHTML = '';
	var n = 0;
	for (var psKey in _payment_service_providers) {
		if (!_payment_service_providers.hasOwnProperty(psKey))
			continue;
		if (_payment_service_providers[psKey]['currencies'].indexOf(_currencyKey) == -1)
			continue;
		if (n == 0 && _paymentSystemsCurrentKey === null)
			_paymentSystemsCurrentKey = psKey;
		//
		n++;
		//
		var ps = _payment_service_providers[psKey];
		var psData = ps["data"];
		//
		var radioId = 'paymentSystemRadio.' + psKey;
		//
		var labelEl = document.createElement('label');
		labelEl.setAttribute('for', radioId);
		labelEl.classList.add('radioLabel');
		labelEl.classList.add('noSelect');
		checkoutOptionsEl.appendChild(labelEl);
		//
		var radioEl = document.createElement('input');
		radioEl.setAttribute('type', 'radio');
		radioEl.setAttribute('name', 'paymentSystemRadio');
		radioEl.setAttribute('id', radioId);
		radioEl.setAttribute('value', psKey);
		//
		radioEl.onchange = function (event) {
			var radioEl = event.target;
			var checked = radioEl.checked;
			if (!checked)
				return;
			var psKeyConst = radioEl.getAttribute('value');
			_paymentSystemsCurrentKey = psKeyConst;
			//
			var ps = _payment_service_providers[psKeyConst];
			buttonCheckoutEl.onclick = function () {
				var ps = _payment_service_providers[psKeyConst];
				var psData = ps["data"];
				//
				ps['handler'](checkoutFormEl, psData);
			};
			//
			var titleEl = byId('buttonCheckoutTitle');
			txt(titleEl, _resources, 'checkoutButton');
			//
			var detailsEl = byId('buttonCheckoutDetails');
			txt(detailsEl, ps, 'name');
			//
			save('paymentService', _paymentSystemsCurrentKey);
		};
		//
		if (_paymentSystemsCurrentKey === null || _paymentSystemsCurrentKey === psKey) {
			radioEl.setAttribute('checked', '');
			var event = document.createEvent("HTMLEvents");
			event.initEvent("change", false, true);
			radioEl.dispatchEvent(event);
		}
		//
		labelEl.appendChild(radioEl);
		//
		var spanEl = document.createElement('span');
		spanEl.setAttribute('id', 'paymentServiceName.' + psKey)
		spanEl.classList.add('paymentSystemSpan');
		txt(spanEl, ps, 'name');
		labelEl.appendChild(spanEl);
	}
	if (n < 2)
		checkoutOptionsEl.setAttribute('hidden', '');
	else
		checkoutOptionsEl.removeAttribute('hidden');
	//
	byId('iconPrint').innerHTML = _resources['iconPrint'];
	byId('iconFolder').innerHTML = _resources['iconFolder'];
	//
	byId('iconFileDownloadOrder').innerHTML = _resources['iconFile'];
	byId('iconFileDownloadQuantityReport').innerHTML = _resources['iconFile'];
	byId('iconFileDownloadShortcutToOrder').innerHTML = _resources['iconFile'];
	//
	byId('iconLink').innerHTML = _resources['iconLink'];
	txt(byId('printButtonText'), _resources, 'printButtonText');
	txt(byId('copyLinkToOrderText'), _resources, 'copyLinkToOrderText');
	//txt(byId('downloadButtonText'), _resources, 'downloadButtonText');
	txt(byId('textOrderTitle'), _resources, 'textOrderTitle');
	txt(byId('textOrderDateYYYY'), _resources, 'textOrderDateYYYY');
	txt(byId('textOrderDateMM'), _resources, 'textOrderDateMM');
	txt(byId('textOrderDateDD'), _resources, 'textOrderDateDD');
	txt(byId('textOrderDate'), _resources, 'textOrderDate');
	//	txt(byId('textOrderColumnID'), _resources, 'textOrderColumnID');
	txt(byId('textOrderColumnProduct'), _resources, 'textOrderColumnProduct');
	//	txt(byId('textOrderColumnOptions'), _resources, 'textOrderColumnOptions');
	txt(byId('textOrderColumnUnitPrice'), _resources, 'textOrderColumnUnitPrice');
	txt(byId('textOrderColumnQuantity'), _resources, 'textOrderColumnQuantity');
	txt(byId('textOrderColumnTotal'), _resources, 'textOrderColumnTotal');
	txt(byId('textOrderTotal'), _resources, 'textOrderTotal');
	//
	txt(byId('textFiles'), _resources, 'textFiles');
	//
	txt(byId('textDownloadOrder'), _resources, 'textDownloadOrder');
	txt(byId('textDownloadQuantityReport'), _resources, 'textDownloadQuantityReport');
	txt(byId('textDownloadShortcutToOrder'), _resources, 'textDownloadShortcutToOrder');
	//
	byId('linkDownloadOrder').innerHTML = getFileNameDownloadOrder();
	byId('linkDownloadQuantityReport').innerHTML = getFileNameDownloadQuantityReport();
	byId('linkDownloadShortcutToOrder').innerHTML = getFileNameDownloadShortcutToOrder();
}

function getFileNameDownloadOrder() {
	return _orderDate + '-' + _orderNo + '.html';
}

function getFileNameDownloadQuantityReport() {
	return _orderDate + '-' + _orderNo + '-list.csv';
}

function getFileNameDownloadShortcutToOrder() {
	return _orderDate + '-' + _orderNo + '-shortcut.html';
}

function updateTitle() {
	document.title = getText(_resources, 'title');
}

function updateMenu() {
	var sectionName;
	var curSectionKey;
	for (var sectionKey in _sections) {
		if (!_sections.hasOwnProperty(sectionKey))
			continue;
		//
		var anchor = byId('sectionAnchor.' + sectionKey);
		if (anchor == null || anchor.style.display == 'none')
			continue;
		//
		var section = _sections[sectionKey];
		//
		var sectionId = 'section.' + sectionKey;
		var sectionEl = byId(sectionId);
		var menuItemEl = document.getElementById('menu-item-a' + '.' + sectionKey);
		if (menuItemEl !== null) {
			menuItemEl.classList.remove('menuLinkSelected');
			menuItemEl.style.color = getColor('menuLinkColor', sectionKey);
		}
		if (sectionEl !== null)
			if (isElementInViewport(sectionEl)) {
				sectionName = getText(section, 'name');
				if (menuItemEl !== null) {
					menuItemEl.classList.add('menuLinkSelected');
					menuItemEl.style.color = getColor('menuLinkSelectedColor', sectionKey);
				}
			}
	}
}

function isElementInViewport(el) {
	var rect = el.getBoundingClientRect();
	var top = rect.top;
	var bottom = rect.bottom;
	return bottom >= -(_layout['verticalGapPx'] - 1) && top <= (_headerBarHeight + 1); // vertical gap && header bar height
}

function isMultiColumnMode() {
	return innerWidth > _single_column_px; // see CSS
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function copyLinkToOrder() {
	var orderUrl = getOrderUrl();
	copyText(orderUrl)
}

function downloadOrder() {
	var orderEl = byId('order');
	var imgs = orderEl.getElementsByTagName('img');
	for (var i = 0; i < imgs.length; i++) {
		var img = imgs[i];
		imgUrl2dataUrl(img);
	}
	//
	var quantityInputEls = orderEl.getElementsByClassName('quantityInput');
	var quantitySpanEls = orderEl.getElementsByClassName('quantitySpan');
	//
	for (var i = 0; i < quantityInputEls.length; i++) {
		var quantityInputEl = quantityInputEls[i];
		var quantitySpanEl = quantitySpanEls[i];
		//
		quantityInputEl.style.display = 'none';
		quantitySpanEl.style.display = 'inline';
	}
	//
	var quantitySignEls = orderEl.getElementsByClassName('quantitySign');
	//
	for (var i = 0; i < quantitySignEls.length; i++) {
		var quantitySignEl = quantitySignEls[i];
		quantitySignEl.style.display = 'none';
	}
	//<!--
	var s = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1"><title>' + _orderNo + ' - ' + _orderDate + '</title></head>';
	//-->
	s += orderEl.outerHTML;
	//<!--
	s += '</html>';
	//-->
	s = replaceAll(s, '<input', '<div');
	s = replaceAll(s, '</input', '</div');
	s = replaceAll(s, 'clickableText', '');
	//
	for (var i = 0; i < quantityInputEls.length; i++) {
		var quantityInputEl = quantityInputEls[i];
		var quantitySpanEl = quantitySpanEls[i];
		//
		quantityInputEl.style.display = 'inline';
		quantitySpanEl.style.display = 'none';
	}
	//
	for (var i = 0; i < quantitySignEls.length; i++) {
		var quantitySignEl = quantitySignEls[i];
		quantitySignEl.style.display = 'inline';
	}
	//
	var fileName = getFileNameDownloadOrder();
	//
	saveTextAsFile(s, fileName, "text/html");
}

function printOrder() {
	// add noPrint class
	byId('order').classList.add('orderPrint');
	byId('header').classList.add('noPrint');
	byId('footer').classList.add('noPrint');
	byId('deliveryOptions').classList.add('noPrint');
	for (var sectionKey in _sections) {
		if (!_sections.hasOwnProperty(sectionKey))
			continue;
		var sectionId = 'section.' + sectionKey;
		var sectionEl = byId(sectionId);
		if (sectionKey === 'ID_ORDER') {
			sectionEl.getElementsByClassName('sectionHeader')[0].classList.add('noPrint');
			sectionEl.getElementsByClassName('sectionBodyHeader')[0].classList.add('noPrint');
			sectionEl.getElementsByClassName('sectionBodyFooter')[0].classList.add('noPrint');
		} else
			sectionEl.classList.add('noPrint');
	}
	//
	print();
	//
	// remove noPrint class
	byId('order').classList.remove('orderPrint');
	byId('header').classList.remove('noPrint');
	byId('footer').classList.remove('noPrint');
	byId('deliveryOptions').classList.remove('noPrint');
	for (var sectionKey in _sections) {
		if (!_sections.hasOwnProperty(sectionKey))
			continue;
		var sectionId = 'section.' + sectionKey;
		var sectionEl = byId(sectionId);
		if (sectionKey === 'ID_ORDER') {
			sectionEl.getElementsByClassName('sectionHeader')[0].classList.remove('noPrint');
			sectionEl.getElementsByClassName('sectionBodyHeader')[0].classList.remove('noPrint');
			sectionEl.getElementsByClassName('sectionBodyFooter')[0].classList.remove('noPrint');
		} else
			sectionEl.classList.remove('noPrint');
	}
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function saveItem(item) {
	var itemKey = item['itemKey'];
	var instances = item['instances'];
	var key = 'item.' + itemKey;
	if (instances.length == 0)
		_storage.removeItem(key);
	else
		save(key, instances);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function changeAddItemByInstanceIndex(item, index, count) {
	var instances = item['instances'];
	var instance = instances[index];
	instance['quantity'] += count;
	item['quantity'] += count;
	if (instance['quantity'] == 0)
		instances.splice(index, 1);
	return instance;
}

function changeUpdateItemByInstanceIndex(item, instanceIndex, newInstanceQuantity) {
	var currentQuantity = item['quantity'];
	//
	var instances = item['instances'];
	var instance = instances[instanceIndex];
	var oldInstanceQuantity = instance['quantity'];
	//
	var newQuantity = currentQuantity - oldInstanceQuantity + newInstanceQuantity;
	//
	instance['quantity'] = newInstanceQuantity;
	item['quantity'] = newQuantity;
	if (newInstanceQuantity == 0)
		instances.splice(instanceIndex, 1);
	return instance;
}

function sortInstances(instances) {
	return instances.sort(function (instance1, instance2) {
		var s1 = JSON.stringify(instance1['options']);
		var s2 = JSON.stringify(instance2['options']);
		return strcmp(s1, s2);
	});
}

function addItemToCart(item, count) {
	var currentQuantity = item['quantity'];
	//
	//var options = sortObj(item['options']);
	var options = cloneObj(item['options']);
	///var options = item['options'];
	var optionsStr = JSON.stringify(sortObj(options));
	///var optionsStr = JSON.stringify(sortObj(options));
	var instances = item['instances'];
	var found = false;
	var instance;
	var i;
	//
	for (i = 0; i < instances.length; i++) {
		instance = instances[i];
		var instanceOptionsStr = JSON.stringify(sortObj(instance['options']));
		if (instanceOptionsStr == optionsStr) {
			instance['quantity'] += count;
			found = true;
			break;
		}
	}
	//
	// update instances
	//
	if (!found)
		instances.push({
			'quantity': count,
			'options': options
		});
	//
	// update item quantity
	//
	var instances = item['instances'];
	var itemQuantity = 0;
	for (var i = 0; i < instances.length; i++) {
		var instance = instances[i];
		var quantity = instance['quantity'];
		itemQuantity += quantity;
	}
	//
	item['quantity'] = itemQuantity;
	//
	item['instances'] = sortInstances(item['instances']);
	//
	return true;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function changeCartWithItem(item) {
	var itemKey = item['itemKey'];
	var quantity = item['quantity'];
	//
	if (quantity == 0)
		delete _cartItems[itemKey];
	else {
		_cartItems[itemKey] = item;
		_cartItems = sortObj(_cartItems);
	}
}

///////////////////////////////////////////////////////////////////////////////////////////////

function changeCartTotal(item, options, count) {
	_total += count * getOptionableNum(item, 'price', options);
	redisplayOrderOptions();
}

function changeCartQuantity(count) {
	_totalQuantity += count;
}

///////////////////////////////////////////////////////////////////////////////////////////////

function clearItem(item) {
	item['quantity'] = 0;
	item['instances'] = [];
}

function clearCart() {
	for (var itemKey in _cartItems) {
		if (!_cartItems.hasOwnProperty(itemKey))
			continue;
		var item = _cartItems[itemKey];
		clearItem(item);
		//
		saveItem(item);
	}
	//
	for (var i = 0; i < _storage.length; i++) {
		var key = _storage.key(i);
		if (key.startsWith('item' + '.')) {
			_storage.removeItem(key);
			i--;
		}
	}
	//
	_cartItems = [];
	_totalQuantity = 0;
	_total = 0;
	//
	_orderNo = null;
	_storage.removeItem('no');
	//
	_orderDate = null;
	_storage.removeItem('date');
}

///////////////////////////////////////////////////////////////////////////////////////////////
function updateItemUI(item) {
	var itemKey = item['itemKey'];
	var sectionKeys = item['sections'];
	//
	var thumbnailCartEl = byId('thumbnail.' + 'ID_CART' + '.' + itemKey);
	var cartProductPageEl = byId('productPage.' + 'ID_CART' + '.' + itemKey);
	var cartSectionEl = byId('section.' + 'ID_CART');
	var sectionBodyEl = cartSectionEl.getElementsByClassName('sectionBody')[0];
	var cartContainerEl = sectionBodyEl.getElementsByClassName('container')[0];
	var rowCount = cartContainerEl.children.length;
	var cartRowEl;
	if (rowCount == 0) {
		cartRowEl = document.createElement('div');
		cartRowEl.classList.add('row');
		cartContainerEl.appendChild(cartRowEl);
	} else {
		cartRowEl = cartContainerEl.getElementsByClassName('row')[rowCount - 1]; // last row
		var colCount = cartRowEl.children.length;
		var itemsInRow = _columnsCount / _colSpan;
		if (colCount == itemsInRow) { // full row
			cartRowEl = document.createElement('div');
			cartRowEl.classList.add('row');
			cartContainerEl.appendChild(cartRowEl);
		}
	}
	var orderSectionEl = byId('section.' + 'ID_ORDER');
	//
	var colElofOrderSection = orderSectionEl.parentElement;
	//
	var checkoutSectionEl = byId('section.' + 'ID_CHECKOUT');
	var colElofCheckoutSection = checkoutSectionEl.parentElement;
	//
	var afterThePurchaseSectionEl = byId('section.' + 'ID_AFTER_THE_PURCHASE');
	var colElofAfterThePurchaseSection = afterThePurchaseSectionEl.parentElement;
	//
	if (_cartItems[itemKey] == undefined) {
		var cartColEl = thumbnailCartEl.parentElement;
		var cartRowEl = cartColEl.parentElement;
		cartRowEl.removeChild(cartColEl);
		//
		if (_itemDetailsPageEl === cartProductPageEl)
			if (_itemDetailsPageEl !== null) {
				removeDetailsPage();
				_itemDetailsPageEl = null;
			}
			//
	} else {
		if (thumbnailCartEl === null) {
			thumbnailCartEl = customCreateThumbnail(item, 'ID_CART');
			//
			var cartColEl = document.createElement('div');
			cartColEl.classList.add('col-' + _colSpan);
			cartRowEl.appendChild(cartColEl);
			cartColEl.appendChild(thumbnailCartEl);
		}
	}
	//
	updateThumbnail(thumbnailCartEl, item);
	for (var i = 0; i < sectionKeys.length; i++) {
		var sectionKey = sectionKeys[i];
		var thumbnailEl = byId('thumbnail.' + sectionKey + '.' + itemKey);
		if (thumbnailEl !== null)
			updateThumbnail(thumbnailEl, item);
	}
	for (var i = 0; i < sectionKeys.length; i++) {
		var sectionKey = sectionKeys[i];
		var productPageEl = byId('productPage.' + sectionKey + '.' + itemKey);
		if (productPageEl !== null) {
			updateThumbnail(productPageEl, item);
			break;
		}
	}
	//
	if (cartProductPageEl !== null)
		updateThumbnail(cartProductPageEl, item);
	//
	var cartSection = _sections['ID_CART'];
	//
	var orderTbodyEl = byId('orderTbody');
	orderTbodyEl.innerHTML = '';
	//
	var deleteAllOrderItemsEl = byId('deleteAllOrderItems');
	deleteAllOrderItemsEl.innerHTML = _resources['iconDelete'];
	deleteAllOrderItemsEl.onclick = function (event) {
		clickDeleteAllHandler(event);
	};
	//
	var n = 0;
	_total = 0;
	var tr;
	for (var itemKey in _cartItems) {
		if (!_cartItems.hasOwnProperty(itemKey))
			continue;
		var item = _cartItems[itemKey];
		//
		var instances = item['instances'];
		//
		var first = true;
		for (var i = 0; i < instances.length; i++) {
			var instance = instances[i];
			//
			var instanceOptions = instance['options'];
			var instanceOptionsStr = buildItemOptionsString(instanceOptions)
			var price = getOptionableNum(item, 'price', instanceOptions);
			//
			var instanceQuantity = instance['quantity'];
			//var instanceOptionsStr = JSON.stringify(instanceOptions);
			//
			var sum = instanceQuantity * price;
			_total += sum;
			//
			n++;
			//
			var orderTrId = 'orderTr' + '.' + itemKey + '.' + i;
			tr = document.createElement('tr');
			tr.setAttribute('id', orderTrId);
			tr.setAttribute('data-itemkey', itemKey);
			tr.setAttribute('data-tags', JSON.stringify(item['tags']));
			tr.setAttribute('data-supplier', item['supplier']);
			tr.setAttribute('data-price', price);
			tr.setAttribute('data-name', getText(item, 'name'));
			tr.setAttribute('data-longname', getText(item, 'longName'));
			tr.setAttribute('data-options', JSON.stringify(instanceOptions));
			tr.setAttribute('data-quantity', instanceQuantity);
			//
			if (first) {
				first = false;
				tr.style.borderTop = '2px solid #000';
			}
			tr.style.borderBottom = '1px solid #ccc';
			tr.classList.add('orderTr');
			orderTbodyEl.appendChild(tr);
			//
			var tdNoId = 'orderTdNo.' + i + '.' + itemKey;
			var tdNo = document.createElement('td');
			var spanNo = document.createElement('span');
			spanNo.setAttribute('id', tdNoId);
			//
			appendDeleteIcon(tdNo, itemKey, i);
			//
			tdNo.appendChild(spanNo);
			tr.appendChild(tdNo);
			spanNo.innerHTML = n;
			spanNo.setAttribute('style', 'font-weight: bold');
			tdNo.setAttribute('style', "width: 50px; border-left: 2px solid #000; border-right: 2px solid #000; background: #eee; text-align: right; padding: 5px;");
			//
			var images = item['images'];
			var imgSrc = getImage(images[0]);

			var tdImage = document.createElement('td');
			tdImage.setAttribute('align', 'center');
			tdImage.setAttribute('style', "width: 50px; height: 50px; background-color: #fff;");
			//tdImage.setAttribute('style', "width: 50px; height: 50px; background-color: #fff; background-position: center; background-repeat: no-repeat; background-size: auto 100%; background-image: url('"+imgSrc+"')");
			tdImage.setAttribute('data-itemkey', itemKey);
			tdImage.classList.add('clickableText');
			tr.appendChild(tdImage);
			//
			var imgEl = document.createElement('img');
			imgEl.setAttribute('style', "cursor: pointer; height: 50px; margin-auto;");
			imgEl.setAttribute('onclick', "window.open(event.target.src, '_blank');");
			//loadImage(imgEl, imgSrc);
			imgEl.src = imgSrc;
			tdImage.appendChild(imgEl);
			//
			var tdProductId = 'orderTdProduct.' + i + '.' + itemKey;
			var tdProduct = document.createElement('td');
			tdProduct.setAttribute('id', tdProductId);
			tdProduct.setAttribute('data-itemkey', itemKey);
			tdProduct.setAttribute('style', "border-right: 1px solid #ccc; padding: 5px;");
			tr.appendChild(tdProduct);
			//
			var divProductID = document.createElement('span');
			divProductID.innerHTML = itemKey;
			divProductID.setAttribute('style', "white-space: nowrap; border-radius: 4px; margin-right: 10px; padding: 3px 6px 3px 6px; color: #fff; background: #000; font-weight: bold;");
			tdProduct.appendChild(divProductID);
			//
			var divProductName = document.createElement('span');
			var divProductNameId = 'divProductName.' + i + '.' + itemKey;
			divProductName.setAttribute('style', "font-weight: bold;");
			divProductName.setAttribute('id', divProductNameId);
			txt(divProductName, item, 'name');
			tdProduct.appendChild(divProductName);
			//
			var divProductLongName = document.createElement('div');
			var divProductNameId = 'divProductLongName.' + i + '.' + itemKey;
			divProductLongName.setAttribute('id', divProductNameId);
			divProductLongName.setAttribute('style', "margin-top: 6px;");
			txt(divProductLongName, item, 'longName');
			tdProduct.appendChild(divProductLongName);
			//
			var divProductOptions = document.createElement('div');
			var divProductOptionsId = 'divProductOptions.' + i + '.' + itemKey;
			divProductOptions.setAttribute('id', divProductOptionsId);
			divProductOptions.setAttribute('style', "font-style: italic;");
			divProductOptions.innerHTML = instanceOptionsStr;
			tdProduct.appendChild(divProductOptions);
			//
			tr.onclick = function (event) {
				var itemKey = event.target.parentElement.dataset.itemkey;
				xopen('ID_CART', itemKey);
				return false;
			};
			//
			var tdPriceId = 'orderTdPrice.' + i + '.' + itemKey;
			var tdPrice = document.createElement('td');
			tdPrice.setAttribute('id', tdPriceId);
			tdPrice.setAttribute('data-nocurrencysymbol', true);
			tdPrice.setAttribute('style', "border-right: 1px solid #ccc; text-align: right; padding: 5px;");
			tr.appendChild(tdPrice);
			//
			pan(tdPrice, item, 'price', instanceOptions);
			//
			var tdQuantityId = 'orderTdQuantity.' + i + '.' + itemKey;
			var tdQuantityEl = document.createElement('td');
			tdQuantityEl.setAttribute('id', tdQuantityId);
			tdQuantityEl.setAttribute('style', "text-align: right; padding: 5px;");
			tr.appendChild(tdQuantityEl);
			//
			appendPlusMinusIcons(tdQuantityEl, itemKey, i);
			//
			var tdQuantityValSpanId = 'orderTdQuantityValSpan.' + i + '.' + itemKey;
			var tdQuantityValSpanEl = document.createElement('span');
			tdQuantityValSpanEl.setAttribute('id', tdQuantityValSpanId);
			tdQuantityValSpanEl.innerHTML = instanceQuantity;
			tdQuantityValSpanEl.classList.add('quantitySpan');
			tdQuantityValSpanEl.style.display = 'none';
			tdQuantityEl.appendChild(tdQuantityValSpanEl);
			//
			var tdQuantityValId = 'orderTdQuantityVal.' + i + '.' + itemKey;
			var tdQuantityValEl = document.createElement('input');
			tdQuantityValEl.setAttribute('id', tdQuantityValId);
			tdQuantityValEl.setAttribute('data-itemkey', itemKey);
			tdQuantityValEl.setAttribute('data-instanceindex', i);
			tdQuantityValEl.setAttribute('type', 'number');
			tdQuantityValEl.setAttribute('min', 0);
			tdQuantityValEl.classList.add('quantityInput');
			tdQuantityValEl.onchange = function (event) {
				var newInstanceQuantity = quantityInputChanged(event);
				tr.setAttribute('data-quantity', newInstanceQuantity);
			};
			tdQuantityEl.appendChild(tdQuantityValEl);
			//
			tdQuantityValEl.value = instanceQuantity;
			//
			var tdSumId = 'orderTdSum.' + i + '.' + itemKey;
			var tdSum = document.createElement('td');
			tdSum.setAttribute('id', tdSumId);
			tdSum.setAttribute('style', "border-left: 2px solid #000; border-right: 2px solid #000; text-align: right; padding: 5px;");
			tr.appendChild(tdSum);
			//
			tdSum.innerHTML = formatMoneyValueWithoutCurrencySymbol(sum);
		}
	}
	if (tr !== undefined)
		tr.style.borderBottom = '2px solid #000';
	//
	var emptyCart = Object.getOwnPropertyNames(_cartItems).length == 0;
	cartSection['items'] = _cartItems;
	//
	var sectionNameEl = cartSectionEl.getElementsByClassName('sectionName')[0];
	txt(sectionNameEl, cartSection, 'name', [_totalQuantity, formatMoneyValue(_total)]);
	//
	var sectionDescriptionEl = cartSectionEl.getElementsByClassName('sectionDescription')[0];
	txt(sectionDescriptionEl, cartSection, 'description', [_totalQuantity, formatMoneyValue(_total)]);
	//
	var cartSectionIndex = _sectionsKeysArray.indexOf('ID_CART');
	for (var i = cartSectionIndex; i < _sectionsKeysArray.length; i++) {
		var sectionEl = byId('section.' + _sectionsKeysArray[i]);
		sectionEl.style.display = emptyCart ? 'none' : 'block';
	}
	//
	updateMenu();
	//
	var orderTotalQuantityEl = byId('orderTotalQuantity');
	orderTotalQuantityEl.innerHTML = _totalQuantity;
	//
	var orderTotalEl = byId('orderTotal');
	orderTotalEl.innerHTML = formatMoneyValueWithoutCurrencySymbol(_total);
	//
	updateCheckoutTotal();
	//
	redisplayMenu();
	//
	manageButtonsPrevNext();
	//
	var currencySymbol = _currencies_symbols[_currencyKey];
	var currencySymbolEls = byId('orderHolder').getElementsByClassName('currencySymbol');
	for (var i = 0; i < currencySymbolEls.length; i++)
		currencySymbolEls[i].innerHTML = currencySymbol;
}

///////////////////////////////////////////////////////////////////////////////////////////////

function buildItemOptionsString(options) {
	var s = '';
	var first = true;
	for (var key in options) {
		if (!options.hasOwnProperty(key))
			continue;
		var optionValue = options[key];
		var optionTextTranslated = getText(_itemOptions, key);
		if (optionTextTranslated == '')
			optionTextTranslated = key;
		var optionValueTranslated = getText(_itemOptionValues, optionValue);
		if (optionValueTranslated == '')
			optionValueTranslated = optionValue;
		if (first)
			first = false;
		else
			s += ', ';
		s += optionTextTranslated + ': ' + optionValueTranslated;
	}
	return s;
}

function save(key, obj) {
	_storage.setItem(key, obj instanceof Object ? JSON.stringify(obj, null, 0) : obj);
}

function displayAboutComment(d) {
	if (!d)
		return;
	if (d.nodeType == 8) {
		var el = document.createElement('pre');
		el.setAttribute('style', 'tab-size:4; -moz-tab-size:4;');
		el.innerHTML = d.data;
		var body = document.getElementsByTagName("html")[0];
		body.innerHTML = '';
		body.appendChild(el);
		return;
	}
	if (!d.childNodes)
		return;
	for (var i = 0; i < d.childNodes.length; i++)
		displayAboutComment(d.childNodes[i]);
}

/////////////////////////////////////  E N D  /////////////////////////////////////////////////
_urlParams = getUrlParams(location.search);
var aboutParam = _urlParams['about'];
if (aboutParam !== undefined)
	displayAboutComment(document);
//
_resources = getResources();
//
_headerImageEl = byId('headerImage');
_headerImageEl.src = getImage(_resources['headerImage']);
//
/* Load settings data */
_color_list = getColorList();
_colors = getColors();
_currencies = getCurrencies();
_currencies_symbols = getCurrenciesSymbols();
_itemOptions = getItemOptions();
_itemOptionValues = getItemOptionsValues();
_languages = getLanguages();
_layout = getLayout();
_payment_service_providers = getPayment_service_providers();
_sections = getSections();
_orderStoreDetails = getOrderStoreDetails();
_items = getItems();
//
//
addEventListener('click', function (event) {
	closeColorWindow();
}, false);

addEventListener("scroll", function (event) {
	updateMenu();
	//closeColorWindow();
}, false);
addEventListener("resize", function (event) {
	updateMenu();
	posColorWindow();
	//closeColorWindow();
}, false);

//
window.onload = function () {
	var site = byId('site');
	var loading = byId('loading');
	loading.style.display = 'none';
	site.style.display = 'block';
	window.dispatchEvent(new Event('resize'));
};
//
document.onkeydown = function (event) {
	event = event || window.event;
	var k = event.keyCode;
	if (k == 27) {
		if (_colorWindowOpen != null) {
			closeColorWindow();
			return;
		}
		if (isMultiColumnMode()) {
			if (_itemDetailsPageEl !== null)
				productPageClickHandler();
		} else {
			if (_currentel !== null) {
				changeThumbnailMode(_currentThumbnailEl, false);
				_currentThumbnailEl = null;
			}
		}
	} else if (k == 38) { // Up

	} else if (k == 40) { // Dn

	} else if (k == 33) { // PgUp

	} else if (k == 34) { // PgDn

	}
};
//
var htmlBlocksContainerEl = byId('htmlBlocksContainer');
var htmlBlocks = extractHtmlBlocks(htmlBlocksContainerEl);
//
loadData();

function load() {
	init();
	//
	var listEl = createList(customCreateThumbnail);
	//
	var products = byId('products');
	products.appendChild(listEl);
	//
	//
	processUrlParameters();
	//updateMenu();
	paymentSystems();
	//
	updateTextAll();
	updateMoneyAll();
	updateOptionableNumAll();
	//
	redisplayCartItems();
	//
	redisplayMenu();
	//
	manageButtonsPrevNext();
}

function clickAddToCartHandler(event, itemKey, sectionKey) {
	event.stopPropagation();
	//
	var item = _items[itemKey];
	//
	var options = item['options'];
	//
	var strVal = byId('addToCartCountInput' + '.' + itemKey + '.' + sectionKey).value;
	var count = parseInt(strVal);
	//
	var ok = addItemToCart(item, count);
	if (ok) {
		changeCartWithItem(item);
		changeCartQuantity(count);
		changeCartTotal(item, options, count);
		updateItemUI(item);
		saveItem(item);
	}
	return false;
}

function clickDeleteAllItemInstancesHandler(event, itemKey) {
	event.stopPropagation();
	var item = _cartItems[itemKey];
	var instances = item['instances'];
	for (var i = 0; i < instances.length; i++) {
		instance = instances[i];
		var count = -instance['quantity'];
		//
		var instance = changeAddItemByInstanceIndex(item, i, count);
		var options = instance['options'];
		//
		if (_itemDetailsPageEl != null)
			updateItemDetailsPageEl(item);
		//
		changeCartWithItem(item);
		changeCartQuantity(count);
		changeCartTotal(item, options, count);
		updateItemUI(item);
		saveItem(item);
		//
		i--;
	}
	return false;
}

function clickDeleteAllHandler(event) {
	event.stopPropagation();
	for (var itemKey in _cartItems) {
		if (!_cartItems.hasOwnProperty(itemKey))
			continue;
		var item = _cartItems[itemKey];
		var instances = item['instances'];
		for (var i = 0; i < instances.length; i++) {
			instance = instances[i];
			var count = -instance['quantity'];
			//
			var instance = changeAddItemByInstanceIndex(item, i, count);
			var options = instance['options'];
			//
			//
			if (_itemDetailsPageEl != null)
				updateItemDetailsPageEl(item);
			//
			changeCartWithItem(item);
			changeCartQuantity(count);
			changeCartTotal(item, options, count);
			updateItemUI(item);
			saveItem(item);
			//
			i--;
		}
	}
	//
	return false;
}

function clickDeleteHandler(event) {
	event.stopPropagation();
	//
	var iconEl = event.target;
	//
	var itemKey = iconEl.dataset.itemkey;
	var index = iconEl.dataset.instanceindex;
	//
	var item = _items[itemKey];
	//
	var instances = item['instances'];
	var count = -instances[index]['quantity'];
	//
	var instance = changeAddItemByInstanceIndex(item, index, count);
	var options = instance['options'];
	//
	if (_itemDetailsPageEl != null)
		updateItemDetailsPageEl(item);
	//
	changeCartWithItem(item);
	changeCartQuantity(count);
	changeCartTotal(item, options, count);
	updateItemUI(item);
	saveItem(item);
	//
	return false;
}

function simpleClickPlusMinusHandler(event, count) {
	var plusMinusEl = event.target;
	var el = plusMinusEl.parentElement.getElementsByClassName('addToCartCountInput')[0];
	var currentVal = Math.abs(parseInt(el.value));
	if (currentVal == 1 && count == -1)
		return;
	el.value = currentVal + count;
}

function addToCartCountInputHandler(event) {
	event.stopPropagation();
	//
	var el = event.target;
	var value = parseInt(el.value);
	if (isNaN(value) || value <= 0)
		el.value = 1;
}

function clickPlusMinusHandler(event, count) {
	event.stopPropagation();
	//
	var plusMinusEl = event.target;
	//
	var itemKey = plusMinusEl.dataset.itemkey;
	var index = plusMinusEl.dataset.instanceindex;
	//
	var item = _items[itemKey];
	//
	var currentQuantity = item['quantity'];
	//	var ok = checkItemQuantity(item, currentQuantity + count);
	//	if (!ok)
	//		return false;
	//
	var instance = changeAddItemByInstanceIndex(item, index, count);
	var options = instance['options'];
	//
	if (_itemDetailsPageEl != null)
		updateItemDetailsPageEl(item);
	//
	changeCartWithItem(item);
	changeCartQuantity(count);
	changeCartTotal(item, options, count);
	updateItemUI(item);
	saveItem(item);
	//
	return false;
}

function quantityInputChanged(event) {
	event.stopPropagation();
	//
	var quantityInputEl = event.target;
	//
	var strVal = quantityInputEl.value;
	//
	var itemKey = quantityInputEl.dataset.itemkey;
	var instanceIndex = quantityInputEl.dataset.instanceindex;
	//
	var item = _items[itemKey];
	var oldQuantity = item['quantity'];
	var instances = item['instances'];
	var instance = instances[instanceIndex];
	var oldInstanceQuantity = instance['quantity'];
	//
	var newInstanceQuantity = parseInt(strVal);
	if (isNaN(newInstanceQuantity))
		newInstanceQuantity = 1;
	else if (newInstanceQuantity < 0)
		newInstanceQuantity = -newInstanceQuantity;
	//
	quantityInputEl.value = newInstanceQuantity;
	//
	var instance = changeUpdateItemByInstanceIndex(item, instanceIndex, newInstanceQuantity);
	if (instance == null)
		return;
	//
	var options = instance['options'];
	var count = newInstanceQuantity - oldInstanceQuantity;
	//
	if (_itemDetailsPageEl != null)
		updateItemDetailsPageEl(item);
	//
	changeCartWithItem(item);
	changeCartQuantity(count);
	changeCartTotal(item, options, count);
	updateItemUI(item);
	saveItem(item);
	//
	return newInstanceQuantity;
}

function updateItemDetailsPageEl(item) {
	if (_itemDetailsPageEl == null)
		return;
	//
	if (_itemDetailsPageEl.dataset.itemkey != item['itemKey'])
		return;
	//
	var table = _itemDetailsPageEl.querySelector('.colorAndSizeTable');
	if (table.style.display == 'none')
		return;
	//
	clearTable(table);
	putInstancesToTable(table, item['instances']);
}

function createAbstractItemCard(cardType, item, sectionKey) {
	var itemKey = item['itemKey'];
	//
	var el = document.createElement('div');
	el.setAttribute('id', cardType + '.' + sectionKey + '.' + itemKey);
	el.setAttribute('data-itemkey', itemKey);
	el.setAttribute('data-sectionkey', sectionKey);
	//
	el.innerHTML = htmlBlocks['itemCardHTML'];
	//
	el.style.border = '1px solid ' + getColor('itemBorderColor', itemKey);
	//
	var productNameEl = el.getElementsByClassName('productName')[0];
	productNameEl.setAttribute('id', 'thumbnail.' + 'productName.' + sectionKey + '.' + itemKey);
	txt(productNameEl, item, 'name');
	//
	var inCartEl = el.getElementsByClassName('inCart')[0];
	inCartEl.style.color = getColor('itemBarBottomColor', itemKey);
	//
	// LEFT RIBBON
	var ribbonLeftEl = el.getElementsByClassName('ribbon-left')[0];
	ribbonLeftEl.setAttribute('id', 'thumbnail.' + 'ribbon-left.' + sectionKey + '.' + itemKey);
	txt(ribbonLeftEl, item, 'ribbonLeft');
	el.getElementsByClassName('ribbon-wrapper-left')[0].style.display = ribbonLeftEl.innerHTML == '' ? 'none' : 'block';
	ribbonLeftEl.style.background = getColor('ribbonLeftBackground', itemKey);
	ribbonLeftEl.style.color = getColor('ribbonLeftColor', itemKey);
	//
	// RIGHT RIBBON
	var ribbonRightEl = el.getElementsByClassName('ribbon-right')[0];
	ribbonRightEl.setAttribute('id', 'thumbnail.' + 'ribbon-right.' + sectionKey + '.' + itemKey);
	txt(ribbonRightEl, item, 'ribbonRight');
	el.getElementsByClassName('ribbon-wrapper-right')[0].style.display = ribbonRightEl.innerHTML == '' ? 'none' : 'block';
	ribbonRightEl.style.background = getColor('ribbonRightBackground', itemKey);
	ribbonRightEl.style.color = getColor('ribbonRightColor', itemKey);
	//
	// QUANTITY BADGE
	var badgeEl = el.getElementsByClassName('badge')[0];
	badgeEl.style.color = getColor('itemBarBadgeColor', itemKey);
	badgeEl.style.background = getColor('itemBarBadgeBackground', itemKey);
	//
	// BOTTOM BAR
	var priceHolderEl = el.getElementsByClassName('priceHolder')[0];
	priceHolderEl.style.color = getColor('itemBarBottomColor', itemKey);
	priceHolderEl.style.background = getColor('itemBarBottomBackground', itemKey);
	//
	// OLD PRICE
	var oldPriceEl = el.getElementsByClassName('oldPrice')[0];
	if (item['oldPrice'] !== undefined) {
		oldPriceEl.setAttribute('id', cardType + '.' + 'oldPrice' + '.' + sectionKey + '.' + itemKey);
		pan(oldPriceEl, item, 'oldPrice');
	}
	//
	// PRICE
	var productPriceEl = el.getElementsByClassName('productPrice')[0];
	productPriceEl.setAttribute('id', cardType + '.' + 'price' + '.' + sectionKey + '.' + itemKey);
	pan(productPriceEl, item, 'price');
	productPriceEl.style.color = getColor('priceColor', itemKey);
	productPriceEl.style.background = getColor('priceBackground', itemKey);
	//
	// PRODUCT NAME
	var productNameEl = el.getElementsByClassName('productName')[0];
	productNameEl.style.background = getColor('itemBarTopBackground', itemKey);
	productNameEl.style.color = getColor('itemBarTopColor', itemKey);
	//
	return el;
}

/**
 * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
 *
 * @param {String} text The text to be rendered.
 * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
 *
 * @see http://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 */
function getTextWidth(text, font, fontHeight) {
	// re-use canvas object for better performance
	var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
	var context = canvas.getContext("2d");
	context.font = fontHeight + 'px ' + font;

	var metrics = context.measureText(text);
	return metrics.width;
}

function manageStamp(stampHolderEl, img) {
	var text = stampHolderEl.textContent;
	//
	var fontHeight = Math.sqrt(Math.pow(img.height, 2) + Math.pow(img.width, 2)) / 8;
	var borderWidth = fontHeight / 6;
	var top = (img.height - fontHeight) / 2;
	var left = (img.width - getTextWidth(text, 'monospace', fontHeight)) / 2;
	//
	stampHolderEl.style.borderWidth = borderWidth + 'px';
	stampHolderEl.style.fontSize = fontHeight + 'px';
	stampHolderEl.style.top = top + 'px';
	stampHolderEl.style.left = left + 'px';
	stampHolderEl.style.display = 'block';
}

function customCreateThumbnail(item, sectionKey) {
	var itemKey = item['itemKey'];
	//
	var el = createAbstractItemCard('thumbnail', item, sectionKey);
	el.classList.add('thumbnail');
	el.setAttribute('onclick', 'thumbnailClickHandler(this,"' + sectionKey + '")');
	//
	var extraHTML = htmlBlocks['thumbnailExtraHTML'];
	el.innerHTML = el.innerHTML.replace('${extra}', extraHTML);
	//
	var verticalEl = el.getElementsByClassName('vertical')[0];
	verticalEl.style.color = getColor('itemBorderColor', itemKey);
	//
	var imgEl = el.getElementsByClassName('itemImage')[0];
	var stamp = getText(item, 'stamp');
	//
	var stampHolderEl = el.getElementsByClassName('stampHolder')[0];
	stampHolderEl.setAttribute('id', 'thumbnail' + '.' + 'stamp' + '.' + el.dataset.sectionkey + '.' + itemKey);
	txt(stampHolderEl, item, 'stamp');
	stampHolderEl.style.color = getColor('stampColor', itemKey);
	//
	if (stamp !== '') {
		imgEl.onload = function (event) {
			manageStamp(stampHolderEl, imgEl);
		};
		window.addEventListener("resize", function () {
			manageStamp(stampHolderEl, imgEl);
		});
	}
	if (item['images'].length !== 0) {
		imgEl.style.visibility = 'visible';
		//imgEl.setAttribute('src', getImage(item['images'][0]));
		loadImage(imgEl, getImage(item['images'][0]));
		imgEl.addEventListener('load', function (event) {
			var imgEl = event.target;
			resizeImg(imgEl, _single_column_px);
			imgEl.style.visibility = 'visible';
		});
	}
	//
	return el;
}

function findInsatanceIndex(instances, options) {
	var optionsStr = JSON.stringify(sortObj(options));
	for (var i = 0; i < instances.length; i++) {
		var instance = instances[i];
		var instanceOptionsStr = JSON.stringify(sortObj(instance['options']));
		if (instanceOptionsStr == optionsStr)
			return i;
	}
	return -1;
}

function displayDataSheetent(tableEl, dataSheet, itemKey, sectionKey) {
	tableEl.innerHTML = '';
	//
	var n = 0;
	for (var key in dataSheet) {
		if (!dataSheet.hasOwnProperty(key))
			continue;
		//
		var value = dataSheet[key];
		//
		var trEl = document.createElement('tr');
		trEl.classList.add('dataSheetTr');
		tableEl.appendChild(trEl);
		//
		var td1El = document.createElement('td');
		td1El.classList.add('dataSheetTd_1');
		td1El.setAttribute('id', 'productDataSheet.td.1.' + '.' + sectionKey + '.' + itemKey);
		trEl.appendChild(td1El);
		txt(td1El, _itemOptions, key);
		//
		var td2El = document.createElement('td');
		td2El.classList.add('dataSheetTd_2');
		td2El.setAttribute('id', 'productDataSheet.td.2.' + '.' + sectionKey + '.' + itemKey);
		trEl.appendChild(td2El);
		txt(td2El, dataSheet, key);
		//
		n++;
	}
}
//

function customCreateItemDetailsPage(item, sectionKey) {
	var itemKey = item['itemKey'];
	var dataSheet = item['productDataSheet'];
	//
	var el = createAbstractItemCard('productPage', item, sectionKey);
	el.classList.add('productPage');
	//
	var extraHTML = htmlBlocks['productPageExtraHTML'];
	el.innerHTML = el.innerHTML.replace('${extra}', extraHTML);
	//
	if (dataSheet !== undefined) {
		var tableEl = el.getElementsByClassName('productDataSheet')[0];
		tableEl.style.display = 'block';
		displayDataSheetent(tableEl, dataSheet, itemKey, sectionKey);
	}
	//
	var infoEl = el.getElementsByClassName('info')[0];
	var id = 'info' + '.' + (isMultiColumnMode() ? 'multicolumn' : 'singlecolumn') + '.' + sectionKey + '.' + itemKey;
	infoEl.setAttribute('id', id);
	txt(infoEl, item, 'info', [itemKey, sectionKey, id]);
	//
	var formEl = el.getElementsByClassName('addToCart')[0];
	formEl.onsubmit = function (event) {
		return clickAddToCartHandler(event, itemKey, sectionKey);
	};
	//
	window.addEventListener("resize", function () {
		if (_currentThumbnailEl !== null) {
			var itemKey = _currentThumbnailEl.dataset.itemkey;
			var sectionKey = _currentThumbnailEl.dataset.sectionkey;
			//
			var productPageId = 'productPage.' + sectionKey + '.' + itemKey;
			var productPageEl = byId(productPageId);
			//
			var productNameEl = productPageEl.getElementsByClassName('productName')[0];
			var productNameBigEl = productPageEl.getElementsByClassName('productNameBig')[0];
			var multicolumn = isMultiColumnMode();
			productNameEl.style.display = multicolumn ? 'none' : 'block';
		}
	});
	var productNameBigEl = el.getElementsByClassName('productNameBig')[0];
	productNameBigEl.setAttribute('id', 'productNameBig' + '.' + itemKey + '.' + sectionKey);
	productNameBigEl.setAttribute('onclick', 'productPageClickHandler()');
	txt(productNameBigEl, item, 'name');
	if (isMultiColumnMode()) {
		var productNameEl = el.getElementsByClassName('productName')[0];
		productNameEl.style.display = 'none';
	}
	//
	var productLongNameEl = el.getElementsByClassName('productLongName')[0];
	productLongNameEl.setAttribute('id', 'productLongName' + '.' + itemKey + '.' + sectionKey);
	productLongNameEl.setAttribute('onclick', 'productPageClickHandler()');
	txt(productLongNameEl, item, 'longName');
	//
	var productDescriptionEl = el.getElementsByClassName('productDescription')[0];
	productDescriptionEl.setAttribute('id', 'productDescription' + '.' + itemKey + '.' + sectionKey);
	productDescriptionEl.setAttribute('onclick', 'productPageClickHandler()');
	txt(productDescriptionEl, item, 'description');
	//
	var t = item['colorAndSize'];
	if (t !== undefined) {
		//
		var colorAndSizeTableTitleEl = el.getElementsByClassName('colorAndSizeTableTitle')[0];
		colorAndSizeTableTitleEl.setAttribute('id', 'colorAndSizeTableTitle' + '.' + itemKey + '.' + sectionKey);
		txt(colorAndSizeTableTitleEl, _resources, 'colorAndSizeTableTitle');
		//
		var table = el.getElementsByClassName('colorAndSizeTable')[0];
		table.style.display = 'block';
		createColorAndSizeTable(table, t, function (event) {
			var input = event.target;
			var size = input.getAttribute('data-size');
			var color = input.getAttribute('data-color');
			var options = {
				size: size,
				color: color
			};

			var index = findInsatanceIndex(item['instances'], options);
			var instance = item['instances'][index];
			//
			if (input.value == '' || parseInt(input.value) == 0) {
				//
				var options = instance['options'];
				var count = 0;
				//
				var instances = item['instances'];
				var count = -instances[index]['quantity'];
				//
				var instance = changeAddItemByInstanceIndex(item, index, count);
				var options = instance['options'];
				//
				changeCartWithItem(item);
				changeCartQuantity(count);
				changeCartTotal(item, options, count);
				updateItemUI(item);
				saveItem(item);
				//				}
			} else {
				var instances = extractInstancesFromTable(table);
				instances = sortInstances(instances);
				var count;
				if (index != -1) {
					var oldValue = instance['quantity'];
					var newValue = instances[index]['quantity'];
					count = newValue - oldValue;
				} else {
					count = parseInt(input.value);
					addItemToCart(item, count);
				}
				item['instances'] = instances;

				parseInt(input.value);
				changeCartWithItem(item);
				changeCartQuantity(count);
				changeCartTotal(item, options, count);
				updateItemUI(item);
				saveItem(item);
			}
		});

		putInstancesToTable(table, item['instances']);
	}
	//
	// ADD TO CART
	var addToCartDefaultCount = item['addToCartDefaultCount'];
	//
	var noInputField = addToCartDefaultCount == undefined;
	//
	var canAddToCart = item['addToCartButton'];
	//
	var addToCartEl = el.getElementsByClassName('addToCart')[0];
	//
	addToCartEl.style.display = canAddToCart ? 'block' : 'none';
	//
	// ADD TO CART INPUT
	var addToCartCountInputEl = el.getElementsByClassName('addToCartCountInput')[0];
	addToCartCountInputEl.setAttribute('id', 'addToCartCountInput' + '.' + itemKey + '.' + sectionKey);
	addToCartCountInputEl.setAttribute('min', 1);
	addToCartCountInputEl.setAttribute('step', 1);
	addToCartCountInputEl.value = addToCartDefaultCount;
	addToCartCountInputEl.style.display = noInputField ? 'none' : 'inline';
	//
	// ADD TO CART BUTTON
	var buttonAddToCartEl = el.getElementsByClassName('buttonAddToCart')[0];
	buttonAddToCartEl.onclick = function (event) {
		return clickAddToCartHandler(event, itemKey, sectionKey);
	};
	//
	// ADD TO CART BUTTON ICON
	var buttonAddToCartIconEl = el.getElementsByClassName('buttonAddToCartIcon')[0];
	buttonAddToCartIconEl.innerHTML = _resources['iconCart'];
	//
	// ADD TO CART BUTTON TEXT
	var buttonAddToCartTextEl = el.getElementsByClassName('buttonAddToCartText')[0];
	buttonAddToCartTextEl.setAttribute('id', 'buttonAddToCartText' + '.' + itemKey + '.' + sectionKey);
	txt(buttonAddToCartTextEl, _resources, 'buttonAddToCartText');
	//
	var images = item['images'];
	var imagesLength = images.length;
	if (imagesLength !== 0) {
		//
		var stampHolderEl = el.getElementsByClassName('stampHolder')[0];
		stampHolderEl.setAttribute('id', 'productPage' + '.' + 'stamp' + '.' + sectionKey + '.' + itemKey);
		txt(stampHolderEl, item, 'stamp');
		stampHolderEl.style.color = getColor('stampColor', itemKey);
		//
		//var height;
		var imgLargeEl = el.getElementsByClassName('itemImage')[0];
		imgLargeEl.style.visibility = 'hidden';
		//imgLargeEl.setAttribute('src', getImage(images[0]));
		loadImage(imgLargeEl, getImage(images[0]));
		imgLargeEl.onload = function (event) {
			resizeImg(imgLargeEl, _single_column_px);
			imgLargeEl.style.visibility = 'visible';
			_magnify = $(imgLargeEl).magnify({
				speed: 0, // fade in/out speed
				timeout: -1, // timeout for mobile
				src: imgLargeEl.src
					// The URI of the large image that will be shown in the magnifying lens.
			});
			//
			var stamp = getText(item, 'stamp');
			if (stamp !== '')
				manageStamp(stampHolderEl, imgLargeEl);
		}
		var stamp = getText(item, 'stamp');
		if (stamp !== '')
			window.addEventListener("resize", function () {
				manageStamp(stampHolderEl, imgLargeEl);
			});

		//
		if (imagesLength > 1) {
			var imgThumbsHolderEl = el.getElementsByClassName('imgThumbsHolder')[0];
			for (var i = 0; i < images.length; i++) {
				var image = getImage(images[i]);
				var imgEl = document.createElement('img');
				imgEl.style.visibility = 'hidden';
				imgEl.setAttribute('src', IMG_1x1);
				//imgEl.setAttribute('src', image);
				loadImage(imgEl, image);
				imgEl.onload = function (event) {
					var imgEl = event.target;
					resizeImg(imgEl, _single_column_px);
					imgEl.style.visibility = 'visible';
				};
				imgThumbsHolderEl.appendChild(imgEl);
				imgEl.classList.add('imgThumb');
				imgEl.onclick = function (event) {
					event.stopPropagation();
					//
					var imgEl = event.target;
					//
					var childrenEls = imgEl.parentNode.childNodes;
					for (var child in childrenEls) {
						var el = childrenEls[child];
						if (el.tagName !== "IMG")
							continue;
						el.classList.remove('imgThumbActive');
					}
					imgEl.classList.add('imgThumbActive');
					//
					imgLargeEl.setAttribute('src', imgEl.getAttribute('src'));
					//
					return false;
				};
				if (i == 0) {
					var event = document.createEvent("HTMLEvents");
					event.initEvent("click", false, true);
					imgEl.dispatchEvent(event);
				}
			}
		}
	}
	//
	return el;
}

function setFonts() {
	var s = '';
	for (var fontFamily in _fonts) {
		if (!_fonts.hasOwnProperty(fontFamily))
			continue;
		var fontProperties = _fonts[fontFamily];
		s += "@font-face {font-family: '" + fontFamily + "';";
		for (var key in fontProperties) {
			if (!fontProperties.hasOwnProperty(key))
				continue;
			var value = fontProperties[key];
			s += key + ': ' + value + ';';
		}
		s += '}';
	}
	byId('fonts').textContent = s;
}

//================================================================================================================================
function putInstancesToTable(table, instances) {
	for (var i = 0; i < instances.length; i++) {
		var instance = instances[i];
		var quantity = instance['quantity'];
		var options = instance['options'];
		var size = options['size'];
		var color = options['color'];
		var input = table.querySelector('[data-size="' + size + '"][data-color="' + color + '"]');
		input.value = quantity;
	}
}

function clearTable(table) {
	var inputs = table.getElementsByTagName('input');
	for (var i = 0; i < inputs.length; i++) {
		var input = inputs[i];
		var f = input.onchange;
		input.onchange = null;
		input.value = '';
		input.onchange = f;
	}
}

function extractInstancesFromTable(table) {
	var instances = [];
	var inputs = table.getElementsByTagName('input');
	for (var i = 0; i < inputs.length; i++) {
		var input = inputs[i];
		var quantityS = input.value;
		if (quantityS == '')
			continue;
		var quantity = parseInt(quantityS);
		var size = input.getAttribute('data-size');
		var color = input.getAttribute('data-color');
		//
		var instance = {
			quantity: quantity,
			options: {
				size: size,
				color: color
			}
		};
		//
		instances.push(instance);
	}
	return instances;
}

function createColorAndSizeTable(table, t, onchangeEventHandler) {
	var headerBg = "#555";
	var headerFg = "#eee";
	var unavailableBg = "#eee";
	//
	const
		BORDER_BOLD = '1px solid #fff';
	const
		ROW_HEIGHT = '30px';
	//
	for (var color in t) {
		if (!t.hasOwnProperty(color))
			continue;
		var tr = document.createElement('tr');
		table.appendChild(tr);
		tr.style.height = '30px';
		tr.style.fontWeight = 'bold';
		//
		var td = document.createElement('td');
		td.style.borderBottom = '1px solid ' + headerBg;
		tr.appendChild(td);
		//
		var sizes = t[color];

		var n = 0;
		for (var size in sizes) {
			if (!sizes.hasOwnProperty(size))
				continue;
			if (n > 0) {
				td.style.borderTop = '1px solid ' + headerBg;
				td.style.borderBottom = '1px solid ' + headerBg;
			}
			td = document.createElement('td');
			tr.appendChild(td);
			td.style.color = headerFg;
			td.style.background = headerBg;
			td.style.border = BORDER_BOLD;
			td.style.textAlign = 'center';
			txt(td, _itemOptionValues, size);
			//
			n++;
		}
		td.style.borderTop = '1px solid ' + headerBg;
		td.style.borderRight = '1px solid ' + headerBg;
		td.style.borderBottom = '1px solid ' + headerBg;
		break;
	}
	//
	for (var color in t) {
		if (!t.hasOwnProperty(color))
			continue;
		var tr = document.createElement('tr');
		table.appendChild(tr);
		//
		var tdColor = document.createElement('td');
		tr.appendChild(tdColor);
		tdColor.style.whiteSpace = 'nowrap';
		//
		var colorRectDiv = document.createElement('span');
		tdColor.appendChild(colorRectDiv);
		//
		tdColor.style.color = headerFg;

		tdColor.style.background = headerBg;
		tdColor.style.border = BORDER_BOLD;
		tdColor.style.borderLeft = '1px solid ' + headerBg;
		tdColor.style.borderRight = '0';
		tdColor.onmouseenter = function (event) {
			displayInWindow(event.target.getElementsByClassName('colorRect')[0]);
		};
		tdColor.onmouseleave = function (event) {
			closeColorWindow();
		};
		//
		colorRectDiv.classList.add('colorRect');
		colorRectDiv.style.background = getBackground(_color_list[color]);
		colorRectDiv.style.display = 'inline-block';
		colorRectDiv.style.margin = '5px';
		colorRectDiv.style.border = '1px solid ' + headerFg;
		colorRectDiv.style.width = '15px';
		colorRectDiv.style.height = '15px';
		//
		var colorNameSpan = document.createElement('span');
		tdColor.appendChild(colorNameSpan);
		//
		colorNameSpan.classList.add('colorNameSpan');
		txt(colorNameSpan, _itemOptionValues, color);
		//
		var sizes = t[color];
		for (var size in sizes) {
			if (!sizes.hasOwnProperty(size))
				continue;
			var td = document.createElement('td');
			tr.appendChild(td);
			td.style.border = '1px solid #bbb';
			td.style.textAlign = 'center';
			var available = sizes[size];
			if (available) {
				var input = document.createElement('input');
				td.appendChild(input);
				//
				input.classList.add('quantityInput');
				input.setAttribute('type', 'number');
				input.setAttribute('min', 0);
				input.setAttribute('data-size', size);
				input.setAttribute('data-color', color);
				input.style.margin = 'auto';
				input.style.border = '0';
				input.style.outline = 'none';
				input.style.minWidth = '33px';
				input.style.width = '33px';

				input.style.height = ROW_HEIGHT;
				input.style.textAlign = 'center';
				input.onchange = function (event) {
					onchangeEventHandler(event);
				};
			} else {
				td.style.background = unavailableBg;
				var div = document.createElement('div');
				td.appendChild(div);
				//
				div.style.padding = '0';
				div.style.margin = '0';
				div.style.outline = 'none';
				div.style.minWidth = '33px';
				div.style.width = '33px';
				div.style.height = ROW_HEIGHT;
				div.style.border = '0';
			}
		}
	}
	tdColor.style.borderBottom = '1px solid ' + headerBg;
}

function closeColorWindow() {
	var w = byId('colorWindow');
	if (w == null)
		return;
	w.parentElement.removeChild(w);
	_colorWindowOpen = null;
}

function displayInWindow(el) {
	var div = document.createElement('div');
	if (_colorWindowOpen != null) {
		closeColorWindow();
		if (_colorWindowOpen == div)
			return;
	}
	//
	div.setAttribute('id', 'colorWindow');
	document.body.appendChild(div);
	//
	div.style.position = 'absolute';
	//
	div.style.background = el.style.background;
	//
	_colorWindowOpen = div;
	//
	posColorWindow();
}

function posColorWindow() {
	if (_colorWindowOpen == null)
		return;
	//
	var imgLargeEl = _itemDetailsPageEl.getElementsByClassName('itemImage')[0];
	//
	var offset = getOffset(imgLargeEl);
	var left = offset.left + "px";
	var top = offset.top + "px";

	var div = _colorWindowOpen;
	//
	div.style.left = left;
	div.style.top = top;
}

function getOffset(el) {
	var rect = el.getBoundingClientRect();
	return {
		left: rect.left + window.scrollX,
		top: rect.top + window.scrollY
	}
}
