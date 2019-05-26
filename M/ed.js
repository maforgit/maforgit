        "use strict";
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
            el.setAttribute('download', filename);
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
        	alert( domain);
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
		"content": window.btoa(text)
	};

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

