        "use strict";
/*
 *  base64.js
 *
 *  Licensed under the BSD 3-Clause License.
 *    http://opensource.org/licenses/BSD-3-Clause
 *
 *  References:
 *    http://en.wikipedia.org/wiki/Base64
 */
;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? module.exports = factory(global)
        : typeof define === 'function' && define.amd
        ? define(factory) : factory(global)
}((
    typeof self !== 'undefined' ? self
        : typeof window !== 'undefined' ? window
        : typeof global !== 'undefined' ? global
: this
), function(global) {
    'use strict';
    // existing version for noConflict()
    global = global || {};
    var _Base64 = global.Base64;
    var version = "2.5.1";
    // if node.js and NOT React Native, we use Buffer
    var buffer;
    if (typeof module !== 'undefined' && module.exports) {
        try {
            buffer = eval("require('buffer').Buffer");
        } catch (err) {
            buffer = undefined;
        }
    }
    // constants
    var b64chars
        = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var b64tab = function(bin) {
        var t = {};
        for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
        return t;
    }(b64chars);
    var fromCharCode = String.fromCharCode;
    // encoder stuff
    var cb_utob = function(c) {
        if (c.length < 2) {
            var cc = c.charCodeAt(0);
            return cc < 0x80 ? c
                : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6))
                                + fromCharCode(0x80 | (cc & 0x3f)))
                : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
                   + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                   + fromCharCode(0x80 | ( cc         & 0x3f)));
        } else {
            var cc = 0x10000
                + (c.charCodeAt(0) - 0xD800) * 0x400
                + (c.charCodeAt(1) - 0xDC00);
            return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
                    + fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
                    + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                    + fromCharCode(0x80 | ( cc         & 0x3f)));
        }
    };
    var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
    var utob = function(u) {
        return u.replace(re_utob, cb_utob);
    };
    var cb_encode = function(ccc) {
        var padlen = [0, 2, 1][ccc.length % 3],
        ord = ccc.charCodeAt(0) << 16
            | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
            | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
        chars = [
            b64chars.charAt( ord >>> 18),
            b64chars.charAt((ord >>> 12) & 63),
            padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
            padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
        ];
        return chars.join('');
    };
    var btoa = global.btoa ? function(b) {
        return global.btoa(b);
    } : function(b) {
        return b.replace(/[\s\S]{1,3}/g, cb_encode);
    };
    var _encode = buffer ?
        buffer.from && Uint8Array && buffer.from !== Uint8Array.from
        ? function (u) {
            return (u.constructor === buffer.constructor ? u : buffer.from(u))
                .toString('base64')
        }
        :  function (u) {
            return (u.constructor === buffer.constructor ? u : new  buffer(u))
                .toString('base64')
        }
        : function (u) { return btoa(utob(u)) }
    ;
    var encode = function(u, urisafe) {
        return !urisafe
            ? _encode(String(u))
            : _encode(String(u)).replace(/[+\/]/g, function(m0) {
                return m0 == '+' ? '-' : '_';
            }).replace(/=/g, '');
    };
    var encodeURI = function(u) { return encode(u, true) };
    // decoder stuff
    var re_btou = new RegExp([
        '[\xC0-\xDF][\x80-\xBF]',
        '[\xE0-\xEF][\x80-\xBF]{2}',
        '[\xF0-\xF7][\x80-\xBF]{3}'
    ].join('|'), 'g');
    var cb_btou = function(cccc) {
        switch(cccc.length) {
        case 4:
            var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                |    ((0x3f & cccc.charCodeAt(1)) << 12)
                |    ((0x3f & cccc.charCodeAt(2)) <<  6)
                |     (0x3f & cccc.charCodeAt(3)),
            offset = cp - 0x10000;
            return (fromCharCode((offset  >>> 10) + 0xD800)
                    + fromCharCode((offset & 0x3FF) + 0xDC00));
        case 3:
            return fromCharCode(
                ((0x0f & cccc.charCodeAt(0)) << 12)
                    | ((0x3f & cccc.charCodeAt(1)) << 6)
                    |  (0x3f & cccc.charCodeAt(2))
            );
        default:
            return  fromCharCode(
                ((0x1f & cccc.charCodeAt(0)) << 6)
                    |  (0x3f & cccc.charCodeAt(1))
            );
        }
    };
    var btou = function(b) {
        return b.replace(re_btou, cb_btou);
    };
    var cb_decode = function(cccc) {
        var len = cccc.length,
        padlen = len % 4,
        n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
            | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
            | (len > 2 ? b64tab[cccc.charAt(2)] <<  6 : 0)
            | (len > 3 ? b64tab[cccc.charAt(3)]       : 0),
        chars = [
            fromCharCode( n >>> 16),
            fromCharCode((n >>>  8) & 0xff),
            fromCharCode( n         & 0xff)
        ];
        chars.length -= [0, 0, 2, 1][padlen];
        return chars.join('');
    };
    var _atob = global.atob ? function(a) {
        return global.atob(a);
    } : function(a){
        return a.replace(/\S{1,4}/g, cb_decode);
    };
    var atob = function(a) {
        return _atob(String(a).replace(/[^A-Za-z0-9\+\/]/g, ''));
    };
    var _decode = buffer ?
        buffer.from && Uint8Array && buffer.from !== Uint8Array.from
        ? function(a) {
            return (a.constructor === buffer.constructor
                    ? a : buffer.from(a, 'base64')).toString();
        }
        : function(a) {
            return (a.constructor === buffer.constructor
                    ? a : new buffer(a, 'base64')).toString();
        }
        : function(a) { return btou(_atob(a)) };
    var decode = function(a){
        return _decode(
            String(a).replace(/[-_]/g, function(m0) { return m0 == '-' ? '+' : '/' })
                .replace(/[^A-Za-z0-9\+\/]/g, '')
        );
    };
    var noConflict = function() {
        var Base64 = global.Base64;
        global.Base64 = _Base64;
        return Base64;
    };
    // export Base64
    global.Base64 = {
        VERSION: version,
        atob: atob,
        btoa: btoa,
        fromBase64: decode,
        toBase64: encode,
        utob: utob,
        encode: encode,
        encodeURI: encodeURI,
        btou: btou,
        decode: decode,
        noConflict: noConflict,
        __buffer__: buffer
    };
    // if ES5 is available, make Base64.extendString() available
    if (typeof Object.defineProperty === 'function') {
        var noEnum = function(v){
            return {value:v,enumerable:false,writable:true,configurable:true};
        };
        global.Base64.extendString = function () {
            Object.defineProperty(
                String.prototype, 'fromBase64', noEnum(function () {
                    return decode(this)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64', noEnum(function (urisafe) {
                    return encode(this, urisafe)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64URI', noEnum(function () {
                    return encode(this, true)
                }));
        };
    }
    //
    // export Base64 to the namespace
    //
    if (global['Meteor']) { // Meteor.js
        Base64 = global.Base64;
    }
    // module.exports and AMD are mutually exclusive.
    // module.exports has precedence.
    if (typeof module !== 'undefined' && module.exports) {
        module.exports.Base64 = global.Base64;
    }
    else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function(){ return global.Base64 });
    }
    // that's it!
    return {Base64: global.Base64}
}));







































        //
        let sr = window.location.search;
        //var edit = sr.endsWith('&') || (sr == '');

        var urlParams = new URLSearchParams(sr);
        var edit = urlParams.get('editable') !== null;
        //
        let fieldEls = document.querySelectorAll('[data-editable]:not(title)');
        let savedAllText = '';
        let pageWasChanged = false;
        let originalTitle = document.title;
        var titleEl = document.querySelector('title[data-editable]');
		let favliconEl = document.querySelector('link[data-editable]');

        function getText() {
            fieldEls.forEach(fieldEl => {
                fieldEl.removeAttribute('contenteditable');
            });
            //
            let savedTitle = document.title;
            titleEl.textContent = originalTitle;
            document.title = originalTitle;
            //
            return document.documentElement.outerHTML;
        }

        function saveOnGithub() {
            let text = getText();
        	//
        	let host = window.location.host;
        	host = host.split(':')[0];
        	//
        	let owner = host.split('.')[0];
        	let pos = host.indexOf('.');
        	let domain = host.substring(pos + 1);
        	//
        	let pathName = window.location.pathname;
        	if (pathName !== '')
        		pathName = pathName.substring(1);
			if (pathName === '')
				pathName = 'index.html';
			//
        	let token = window.prompt("Token");
            if (token !== null) {
				let callback = reqListener;
				sendToGithub(pathName, text, callback, owner, token);
			}
        }

        function saveLocally() {
        	let text = getText();
        	//
            let fileName = window.location.pathname.split('/').pop();
    		if (fileName === '')
    			fileName = 'index.html';
        	//
        	var el = document.createElement('a');
            document.body.appendChild(el);
            el.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(text));
            el.setAttribute('download', fileName);
            el.click();
            document.title = savedTitle;
            document.body.removeChild(el);
        }

        function init() {
            if (edit) {
                savedAllText = allText();
                createCSS();
                initMenu();
                updateTitle();
                document.addEventListener("keydown", function(e) {
                    if (window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) {
                        e.preventDefault();
                        if (e.keyCode == 83) { // Ctrl + S
                        	saveLocally();
                        }
                    }
                }, false);
                /*
                				document.addEventListener("keydown", function(e) {
                					if (e.keyCode == 13) {
                						e.preventDefault();
                						fieldEls.forEach(fieldEl0 => {
                							if (fieldEl0.getAttribute('contenteditable') == 'true') {
                								fieldEl0.innerHTML = fieldEl0.textContent;
                								fieldEl0.removeAttribute('contenteditable');
                								//updateLink();
                							}
                						});
                					}
                				}, false);
                */
            }
            //
            fieldEls.forEach(fieldEl => {
                if (edit) {

                    fieldEl.addEventListener('focusout', e => {
                        fieldEls.forEach(fieldEl0 => {
                            if (fieldEl0.getAttribute('contenteditable') == 'true') {
                                //fieldEl0.innerHTML = fieldEl0.textContent;
                                fieldEl.scrollTop = 0;
                                fieldEl0.removeAttribute('contenteditable');
                            }
                        });
                    });
                    //
                    fieldEl.addEventListener('click', e => {
                        e.preventDefault();
                        //e.stopPropagation();
                        let editable = e.currentTarget.getAttribute('contenteditable') == 'true';
                        if (!editable) {
                            fieldEls.forEach(fieldEl0 => {
                                let edEl = e.currentTarget;
                                let ths = edEl == fieldEl0;
                                if (ths) {
                                    let src = edEl.getAttribute('src');
                                    let href = edEl.getAttribute('href');
                                    if (src !== null) {
                                        let src = window.prompt("Image URL", edEl.getAttribute('src'));
                                        if (src !== null) {
                                            edEl.setAttribute('src', src);
                                            //updateLink();
                                            updateTitle();
                                        }
                                    } else if (href !== null) {
                                        let href = window.prompt("Link URL", edEl.getAttribute('href'));
                                        if (href !== null) {
                                            edEl.setAttribute('href', href);
                                            //updateLink();
                                            updateTitle();
                                        }
                                    } else {
                                        fieldEl.style.borderColor = fieldEl.style.color;
                                        //									fieldEl0.textContent = fieldEl0.innerHTML;
                                        fieldEl0.setAttribute('contenteditable', 'true');
                                        fieldEl0.focus();
                                    }
                                } else {
                                    fieldEl.style.borderColor = 'transparent';
                                    fieldEl0.removeAttribute('contenteditable');
                                }
                            });
                            return false;
                        }
                    });
                    fieldEl.addEventListener('input', e => {
                        updateTitle();
                    });
                }
            });

            //updateLink();
            //
        }

        //https://stackoverflow.com/questions/1720320/how-to-dynamically-create-css-class-in-javascript-and-apply
        //createCSSSelector('.mycssclass', 'display:none');
        function createCSSSelector(selector, style) {
            if (!document.styleSheets) return;
            if (document.getElementsByTagName('head').length == 0) return;

            var styleSheet, mediaType;

            if (document.styleSheets.length > 0) {
                for (var i = 0, l = document.styleSheets.length; i < l; i++) {
                    if (document.styleSheets[i].disabled)
                        continue;
                    var media = document.styleSheets[i].media;
                    mediaType = typeof media;

                    if (mediaType === 'string') {
                        if (media === '' || (media.indexOf('screen') !== -1)) {
                            styleSheet = document.styleSheets[i];
                        }
                    } else if (mediaType == 'object') {
                        if (media.mediaText === '' || (media.mediaText.indexOf('screen') !== -1)) {
                            styleSheet = document.styleSheets[i];
                        }
                    }

                    if (typeof styleSheet !== 'undefined')
                        break;
                }
            }

            if (typeof styleSheet === 'undefined') {
                var styleSheetElement = document.createElement('style');
                styleSheetElement.type = 'text/css';
                document.getElementsByTagName('head')[0].appendChild(styleSheetElement);

                for (i = 0; i < document.styleSheets.length; i++) {
                    if (document.styleSheets[i].disabled) {
                        continue;
                    }
                    styleSheet = document.styleSheets[i];
                }

                mediaType = typeof styleSheet.media;
            }

            if (mediaType === 'string') {
                for (var i = 0, l = styleSheet.rules.length; i < l; i++) {
                    if (styleSheet.rules[i].selectorText && styleSheet.rules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
                        styleSheet.rules[i].style.cssText = style;
                        return;
                    }
                }
                styleSheet.addRule(selector, style);
            } else if (mediaType === 'object') {
                var styleSheetLength = (styleSheet.cssRules) ? styleSheet.cssRules.length : 0;
                for (var i = 0; i < styleSheetLength; i++) {
                    if (styleSheet.cssRules[i].selectorText && styleSheet.cssRules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
                        styleSheet.cssRules[i].style.cssText = style;
                        return;
                    }
                }
                styleSheet.insertRule(selector + '{' + style + '}', styleSheetLength);
            }
        }

        function updateTitle() {
            pageWasChanged = allText() != savedAllText;
            document.title = (pageWasChanged ? '*' : '') + window.location.href.split('?')[0] + ' - ' + originalTitle;

        }

        function initMenu() {
            let menuDivEl = document.createElement('div');
            menuDivEl.classList.add('menu');
            //
            let menuUlEl = document.createElement('ul');
            menuUlEl.classList.add('menu-options');
            menuDivEl.appendChild(menuUlEl);
            //
            if (titleEl !== null) {
                let menuLiTitleEl = document.createElement('li');
                menuLiTitleEl.classList.add('menu-option');
                menuLiTitleEl.innerHTML = 'Change Page Title';
                menuLiTitleEl.addEventListener("click", event => {
                    toggleMenu("hide");
                    setTimeout(function() {
                        let title = window.prompt("Title", originalTitle);
                        if (title !== null) {
                            //titleEl.textContent = originalTitle;
                            originalTitle = title;
                            updateTitle();
                        }
                    }, 100);
                });
                menuUlEl.appendChild(menuLiTitleEl);
            }
            //
            if (favliconEl !== null) {
                let menuLiFaviconEl = document.createElement('li');
                menuLiFaviconEl.classList.add('menu-option');
                menuLiFaviconEl.innerHTML = 'Change Page Favicon';
                menuLiFaviconEl.addEventListener("click", event => {
                    toggleMenu("hide");
                    setTimeout(function() {
                        let favlicon = window.prompt("Favicon", favliconEl.getAttribute('href'));
                        if (favlicon !== null) {
                            //titleEl.textContent = originalTitle;
                            favliconEl.setAttribute('href', favlicon);
                            updateTitle();
                        }
                    }, 100);
                });
                menuUlEl.appendChild(menuLiFaviconEl);
            }
            //
        	let host = window.location.host;
        	host = host.split(':')[0];
        	let pos = host.indexOf('.');
        	let domain = host.substring(pos + 1);
			if (domain == 'github.io') {
	            let menuLiSaveOnGithubEl = document.createElement('li');
	            menuLiSaveOnGithubEl.classList.add('menu-option');
	            menuLiSaveOnGithubEl.innerHTML = 'Save on Github';
	            menuLiSaveOnGithubEl.addEventListener("click", event => {
	                toggleMenu("hide");
	                saveOnGithub();
	            });
	            menuUlEl.appendChild(menuLiSaveOnGithubEl);
			}
        	//
            let menuLiSaveEl = document.createElement('li');
            menuLiSaveEl.classList.add('menu-option');
            menuLiSaveEl.innerHTML = 'Save locally (Ctrl + S)';
            menuLiSaveEl.addEventListener("click", event => {
                toggleMenu("hide");
                saveLocally();
            });
            menuUlEl.appendChild(menuLiSaveEl);
            //
            document.documentElement.appendChild(menuDivEl);

            let menuVisible = false;

            const toggleMenu = command => {
                menuDivEl.style.display = command === "show" ? "block" : "none";
                menuVisible = !menuVisible;
            };

            const setPosition = ({
                top,
                left
            }) => {
                menuDivEl.style.left = `${left}px`;
                menuDivEl.style.top = `${top}px`;
                toggleMenu("show");
            };

            window.addEventListener("click", e => {
                if (menuVisible) toggleMenu("hide");
            });


            menuUlEl.addEventListener("mouseleave", e => {
                if (menuVisible) toggleMenu("hide");
            });

            window.addEventListener("contextmenu", e => {
                e.preventDefault();
                const origin = {
                    left: e.pageX,
                    top: e.pageY
                };
                setPosition(origin);
                return false;
            });
        }

        function createCSS() {
            let s = '';
            s += '.menu {';
            s += '  background: #F1F3F4;';
            s += '  z-index: 1;';
            s += '  box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.2);';
            s += '  position: fixed;';
            s += '  display: none;';
            s += '}';
            s += '.menu .menu-options {';
            s += '  list-style: none;';
            s += '  padding: 0 0;';
            s += '}';
            s += '.menu .menu-options .menu-option {';
            s += '	white-space: nowrap;';
            s += '	font-family: Arial,"Helvetica Neue",Helvetica,sans-serif;';
            s += '  padding: 10px 40px 10px 20px;';
            s += '  cursor: pointer;';
            s += '}';
            s += '.menu .menu-options .menu-option:hover {';
            s += '  background: rgba(0, 0, 0, 0.2);';
            s += '}';
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = s;
            document.getElementsByTagName('head')[0].appendChild(style);
        }

        function allText() {
            let s = originalTitle + "=";
			if (favliconEl != null)
				s += favliconEl.getAttribute('href') + "=";
            fieldEls.forEach(fieldEl => {
                let src = fieldEl.getAttribute('src');
                let text;
                if (src !== null)
                    text = src;
                else
                    text = fieldEl.textContent;
                //
                s += '=' + text;
            });
            return s;
        }

        function btoaUTF16 (sString) {
        	var aUTF16CodeUnits = new Uint16Array(sString.length);
        	Array.prototype.forEach.call(aUTF16CodeUnits, function (el, idx, arr) { arr[idx] = sString.charCodeAt(idx); });
        	return btoa(String.fromCharCode.apply(null, new Uint8Array(aUTF16CodeUnits.buffer)));
        }
        
function sendToGithub(file, text, callback, owner, token) {
	let repo = owner + '/' + owner + '.github.io';
	let url = 'https://api.github.com/repos/' + repo + '/contents/' + file;
	//
	let data = {
		"message": "WYSIWYG update",
		"committer": {
			"name": "WYSIWYG editor",
			"email": "WYSIWYG editor"
			},
		"content": btoaUTF16(text)
	};
//btoa
	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", function() {
		let sha = JSON.parse(this.responseText)['sha'];
		data['sha'] = sha;
		//
		var oReq = new XMLHttpRequest();
		oReq.addEventListener("load", callback);
		oReq.open("PUT", url);
		oReq.setRequestHeader('Authorization', 'token ' + token);
		oReq.send(JSON.stringify(data));
	});
	oReq.open("GET", url);
	oReq.setRequestHeader('Authorization', 'token ' + token);
	oReq.send();
}


function reqListener () {
  console.log(this.responseText);
}
        init();

