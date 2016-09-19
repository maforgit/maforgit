'use strict';

function getFonts(lang) {
	if (lang == 'en')
		return {
			icons: {
				"src": "url('settings/custom/fonts/Icons/fontawesome-webfont.woff')"
			},
			sectionName: {
				"src": "url('http://fonts.gstatic.com/s/poiretone/v4/HrI4ZJpJ3Fh0wa5ofYMK8b3hpw3pgy2gAi-Ip7WPMi0.woff')",
				"font-weight": "bold"
			},
			sectionDescription: {
				"src": "url(settings/custom/fonts/Lato/Lato-Hairline.woff)"
			},
			productNameBig: {
				"src": "url(settings/custom/fonts/Lato/Lato-Light.woff)",
				"font-weight": "bold"
			},
			productLongName: {
				"src": "url(settings/custom/fonts/Lato/Lato-Light.woff)",
				"font-weight": "bold"
			},
			menu: {
				"src": "url(settings/custom/fonts/OpenSans/OpenSans-CondBold.ttf)",
			}
		};
	else
		return {
			icons: {
				"src": "url('settings/custom/fonts/Icons/fontawesome-webfont.woff')"
			},
			sectionName: {
				"src": "url(settings/custom/fonts/Lato/Lato-Light.woff)",
				"font-weight": "bold"
			},
			sectionDescription: {
				"src": "url(settings/custom/fonts/Lato/Lato-Hairline.woff)",
			},
			productNameBig: {
				"src": "url(settings/custom/fonts/Lato/Lato-Light.woff)",
				"font-weight": "bold"
			},
			productLongName: {
				"src": "url(settings/custom/fonts/Lato/Lato-Light.woff)",
				"font-weight": "bold"
			},
			menu: {
				"src": "url(settings/custom/fonts/OpenSans/OpenSans-CondBold.ttf)",
			}
		};

}
