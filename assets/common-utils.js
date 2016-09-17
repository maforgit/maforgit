'use strict';

function byId(id) {
	return document.getElementById(id);
}

function byTag(tag) {
	return document.getElementsByTagName(tag);
}

function loadImage(imageEl, src) {
	var image = new Image();
	image.onload = function() {
		imageEl.src = this.src;
	};
	image.src = src;
}

function strip2text(html) {
	var tmp = document.createElement('div');
	tmp.innerHTML = html;
	var s = tmp.textContent || tmp.innerText || '';
	s = s.trim();
	return s.replace(/(\r\n|\n|\r|\t)/gm, '');
}

function imgUrl2dataUrl(img) {
	var w = img.naturalWidth;
	var h = img.naturalHeight;
	//
	var a = Math.max(w, h);
	//
	var canvas = document.createElement('canvas');
	canvas.width = a;
	canvas.height = a;
	var context = canvas.getContext('2d');
	context.drawImage(img, (a - w) / 2, (a - h) / 2);
	//
	img.src = canvas.toDataURL();
}

function resizeImg(img, minWidth) {
	var w = img.naturalWidth;
	var h = img.naturalHeight;
	if (w == h)
		return;
	//
	var a = Math.max(w, h);
	if (a < minWidth)
		a = minWidth;
	//
	var canvas = document.createElement('canvas');
	canvas.width = a;
	canvas.height = a;
	var context = canvas.getContext('2d');
	context.drawImage(img, (a - w) / 2, (a - h) / 2);
	//
	img.src = canvas.toDataURL();
}

function darkenColor(col, amt) {
	col = col.slice(1);
	var num = parseInt(col, 16);
	var r = (num >> 16) + amt;
	if (r > 255)
		r = 255;
	else if (r < 0)
		r = 0;
	var b = ((num >> 8) & 0x00FF) + amt;
	if (b > 255)
		b = 255;
	else if (b < 0)
		b = 0;
	var g = (num & 0x0000FF) + amt;
	if (g > 255)
		g = 255;
	else if (g < 0)
		g = 0;
	return "#" + (g | (b << 8) | (r << 16)).toString(16);
}

/**
 * SMOOTH SCROLL
 *
 * Copyright
 * In the footer of itnewb.com the following is written:
 * The techniques, effects and code demonstrated in ITNewb articles may be used for any purpose without attribution (although we recommend it)
 * (2014-01-12)
 * http://stackoverflow.com/questions/17722497/scroll-smoothly-to-specific-element-on-page
 */
function currentYPosition() {
	// Firefox, Chrome, Opera, Safari
	if (self.pageYOffset)
		return self.pageYOffset;
	// Internet Explorer 6 - standards mode
	if (document.documentElement && document.documentElement.scrollTop)
		return document.documentElement.scrollTop;
	// Internet Explorer 6, 7 and 8
	if (document.body.scrollTop)
		return document.body.scrollTop;
	return 0;
}

function elmYPosition(elm) {
	var y = elm.offsetTop;
	var node = elm;
	while (node.offsetParent && node.offsetParent != document.body) {
		node = node.offsetParent;
		y += node.offsetTop;
	}
	return y;
}

function smoothScroll(elm, topMargin) {
	var startY = currentYPosition();
	var stopY = elmYPosition(elm);
	if (topMargin !== undefined)
		stopY -= topMargin;
	var distance = stopY > startY ? stopY - startY : startY - stopY;
	if (distance < 100) {
		scrollTo(0, stopY);
		return;
	}
	var speed = Math.round(distance / 100);
	if (speed >= 20)
		speed = 20;
	var step = Math.round(distance / 50);
	var leapY = stopY > startY ? startY + step : startY - step;
	var timer = 0;
	if (stopY > startY) {
		for (var i = startY; i < stopY; i += step) {
			setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
			leapY += step;
			if (leapY > stopY)
				leapY = stopY;
			timer++;
		}
		return;
	}
	for (var i = startY; i > stopY; i -= step) {
		setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
		leapY -= step;
		if (leapY < stopY)
			leapY = stopY;
		timer++;
	}
	return false;
}

function smoothScrollById(eID, topMargin) {
	var elm = byId(eID);
	return smoothScroll(elm, topMargin);
}

///////////////////////////////////////////////////////////////////////////////////////////////

function extractHtmlBlocks(el) {
	var htmlBlocks = {};
	el.parentNode.removeChild(el);
	var children = el.children;
	for (var i = 0; i < children.length; i++) {
		var c = children[i];
		htmlBlocks[c.getAttribute('id')] = c.innerHTML;
	}
	return htmlBlocks;
}

///////////////////////////////////////////////////////////////////////////////////////////////

function ajaxPost(url, name, json, callback, error) {
	var xhr = new XMLHttpRequest();
	var params = encodeURIComponent(name) + '=' + encodeURIComponent(JSON.stringify(json, null, 0));
	//
	xhr.open("POST", url);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200 || xhr.status == 0)
				callback(xhr.responseText);
			else
				error(xhr.statusText);
		}
	};
	//
	xhr.send(params);
}

///////////////////////////////////////////////////////////////////////////////////////////////

function loadHtmlFile(el, file, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			el.innerHTML = xhr.responseText;
			if (callback !== undefined)
				callback();
		}
	}
	xhr.open("GET", file, true);
	xhr.send();
}

///////////////////////////////////////////////////////////////////////////////////////////////

function getUrlParams(search) {
	var parse = function(params, pairs) {
		var pair = pairs[0];
		var parts = pair.split('=');
		var key = decodeURIComponent(parts[0]);
		var value = decodeURIComponent(parts.slice(1).join('='));
		// Handle multiple parameters of the same name
		if (typeof params[key] === "undefined")
			params[key] = value;
		else
			params[key] = [].concat(params[key], value);
		return pairs.length == 1 ? params : parse(params, pairs.slice(1))
	}
	//
	return search.length == 0 ? {} : parse({}, search.substr(1).split('&'));
}

///////////////////////////////////////////////////////////////////////////////////////////////

function generateOrderNumber() {
	return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

///////////////////////////////////////////////////////////////////////////////////////////////

function isInt(n) {
	return n % 1 === 0;
}

///////////////////////////////////////////////////////////////////////////////////////////////

function leftPadNumWithZeros(num, len) {
	var s = num.toString();
	while (s.length < len)
		s = '0' + s;
	return s;
}

///////////////////////////////////////////////////////////////////////////////////////////////

function formatMoney(n, fixed, decimalSeparator, thousandsSeparator) {
	var s = n.toFixed(fixed).toString().replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
	return s.replace('.', decimalSeparator);
}

///////////////////////////////////////////////////////////////////////////////////////////////

function replaceAll(str, find, replace) {
	return str.replace(new RegExp(find, 'g'), replace);
}

function reverse(s){
	return s.split("").reverse().join("");
}

function strcmp(a, b) {
	if (a < b) return -1;
	if (a > b) return 1;
	return 0;
}

function sortObj(obj) {
	const ordered = {};
	Object.keys(obj).sort().forEach(function(key) {
		ordered[key] = obj[key];
	});
	return ordered;
}

function cloneObj(obj) {
	const ordered = {};
	Object.keys(obj).forEach(function(key) {
		ordered[key] = obj[key];
	});
	return ordered;
}

///////////////////////////////////////////////////////////////////////////////////////////////

(function($) {
	var getUnqueuedOpts = function(opts) {
		return {
			queue : false,
			duration : opts.duration,
			easing : opts.easing
		};
	};
	$.fn.showDown = function(opts) {
		opts = opts || {};
		$(this).hide().slideDown(opts).animate({
			opacity : 1
		}, getUnqueuedOpts(opts));
	};
	$.fn.hideUp = function(opts) {
		opts = opts || {};
		$(this).show().slideUp(opts).animate({
			opacity : 0
		}, getUnqueuedOpts(opts));
	};
	$.fn.verticalFade = function(opts) {
		opts = opts || {};
		if ($(this).is(':visible')) {
			$(this).hideUp(opts);
		} else {
			$(this).showDown(opts);
		}
	};
}(jQuery));

///////////////////////////////////////////////////////////////////////////////////////////////

function copyText(text) {
	function selectElementText(element) {
		if (document.selection) {
			var range = document.body.createTextRange();
			range.moveToElementText(element);
			range.select();
		} else if (window.getSelection) {
			var range = document.createRange();
			range.selectNode(element);
			window.getSelection().removeAllRanges();
			window.getSelection().addRange(range);
		}
	}
	var el = document.createElement('div');
	el.textContent = text;
	document.body.appendChild(el);
	selectElementText(el);
	document.execCommand('copy');
	el.parentNode.removeChild(el);
}

///////////////////////////////////////////////////////////////////////////////////////////////

function saveTextAsFile(textToSave, fileNameToSaveAs, type) {
	var textToSaveAsBlob = new Blob([ textToSave ], {
		type : type
	});
	var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
	var a = document.createElement('a');
	a.download = fileNameToSaveAs;
	a.href = textToSaveAsURL;
	a.onclick = function(event) {document.body.removeChild(event.target);};
	a.style.display = "none";
	document.body.appendChild(a);
	a.click();
}
///////////////////////////////////////////////////////////////////////////////////////////////
// polyfil for IE
if (!String.prototype.startsWith) {
	String.prototype.startsWith = function(searchString, position){
	  position = position || 0;
	  return this.substr(position, searchString.length) === searchString;
  };
}

///////////////////////////////////////////////////////////////////////////////////////////////
/*
https://gist.github.com/zziuni/3741933

	# A list of available STUN server.

	stun.l.google.com:19302
	stun1.l.google.com:19302
	stun2.l.google.com:19302
	stun3.l.google.com:19302
	stun4.l.google.com:19302
	stun01.sipphone.com
	stun.ekiga.net
	stun.fwdnet.net
	stun.ideasip.com
	stun.iptel.org
	stun.rixtelecom.se
	stun.schlund.de
	stunserver.org
	stun.softjoys.com
	stun.voiparound.com
	stun.voipbuster.com
	stun.voipstunt.com
	stun.voxgratia.org
	stun.xten.com
*/

function getIPs(stunUrl, callback){
	var ip_dups = {};

	//compatibility for firefox and chrome
	var RTCPeerConnection = window.RTCPeerConnection
		|| window.mozRTCPeerConnection
		|| window.webkitRTCPeerConnection;
	var useWebKit = !!window.webkitRTCPeerConnection;

	//bypass naive webrtc blocking using an iframe
	if(!RTCPeerConnection){
		//NOTE: you need to have an iframe in the page right above the script tag
		//
		//<iframe id="iframe" sandbox="allow-same-origin" style="display: none"></iframe>
		//<script>...getIPs called in here...
		//
		var win = iframe.contentWindow;
		RTCPeerConnection = win.RTCPeerConnection
			|| win.mozRTCPeerConnection
			|| win.webkitRTCPeerConnection;
		useWebKit = !!win.webkitRTCPeerConnection;
	}

	//minimal requirements for data connection
	var mediaConstraints = {
		optional: [{RtpDataChannels: true}]
	};
	// var servers = {iceServers: [{urls: "stun:stun.ekiga.net"}]};
	var servers = {iceServers: [{urls: stunUrl}]};

	//construct a new RTCPeerConnection
	var pc = new RTCPeerConnection(servers, mediaConstraints);

	function handleCandidate(candidate){
		//match just the IP address
		var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
		var ip_addr = ip_regex.exec(candidate)[1];

		//remove duplicates
		if(ip_dups[ip_addr] === undefined)
			callback(ip_addr);

		ip_dups[ip_addr] = true;
	}

	//listen for candidate events
	pc.onicecandidate = function(ice){

		//skip non-candidate events
		if(ice.candidate)
			handleCandidate(ice.candidate.candidate);
	};

	//create a bogus data channel
	pc.createDataChannel("");

	//create an offer sdp
	pc.createOffer(function(result){

		//trigger the stun server request
		pc.setLocalDescription(result, function(){}, function(){});

	}, function(){});

	//wait for a while to let everything done
	setTimeout(function(){
		//read candidate info from local description
		var lines = pc.localDescription.sdp.split('\n');

		lines.forEach(function(line){
			if(line.indexOf('a=candidate:') === 0)
				handleCandidate(line);
		});
	}, 1000);
}
