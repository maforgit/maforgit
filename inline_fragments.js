function getInlineFragments() {
	'use strict';

	return {
		//
		// binary
		//
		'assets/loading.gif': {
			type: 'binary',
			tag: '<img id="loading" width="600px" height="600px" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);" src="$">',
			replacer: '<img id="loading" width="600px" height="600px" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);" src="data:image/gif;base64,$">'
		},
		//
		// less
		//
		'assets/grid12.less': {
			type: 'less',
			tag: '<link rel="stylesheet/less" href="$">',
			replacer: '<style type="text/z-less">$</style>'
		},
		//
		'assets/style.less': {
			type: 'less',
			tag: '<link rel="stylesheet/less" href="$">',
			replacer: '<style type="text/z-less">$</style>'
		},
		//
		// css
		//
		'assets/zoom/css/magnify.css': {
			type: 'css',
			tag: '<link rel="stylesheet/css" href="$">',
			replacer: '<style>$</style>'
		},
		//
		// js
		//
		'assets/less.min.js': {
			type: 'js',
			tag: '<script src="$"></script>',
			replacer: '<script>$</script>'
		},
		//
		'assets/lz-string.min.js': {
			type: 'js',
			tag: '<script src="$"></script>',
			replacer: '<script>$</script>'
		},
		//
		'assets/jquery-3.0.0.min.js': {
			type: 'js',
			tag: '<script src="$"></script>',
			replacer: '<script>$</script>'
		},
		//
		'assets/common-utils.js': {
			type: 'js',
			tag: '<script src="$"></script>',
			replacer: '<script>$</script>'
		},
		//
		'assets/resource-utils.js': {
			type: 'js',
			tag: '<script src="$"></script>',
			replacer: '<script>$</script>'
		},
		//
		'assets/utils.js': {
			type: 'js',
			tag: '<script src="$"></script>',
			replacer: '<script>$</script>'
		},
		//
		'assets/zoom/js/jquery.magnify.js': {
			type: 'js',
			tag: '<script src="$"></script>',
			replacer: '<script>$</script>'
		},
		//
		'assets/default_settings.js': {
			type: 'js',
			tag: '<script src="$"></script>',
			replacer: '<script>$</script>'
		}
		//
	};
}
