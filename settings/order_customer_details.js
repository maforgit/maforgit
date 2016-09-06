'use strict';

function getOrderCustomerDetails() {
	var orderCustomerDetails = [];
	//
	orderCustomerDetails.push({
		"text" : {
			"en" : "Name, Surname:",
			"fr" : "Name, Surname:",
			"ru" : "Ф.И.О"
		},
		"value" : document.getElementById('customerName').value
	});
	orderCustomerDetails.push({
		"text" : {
			"en" : "Phone number:",
			"fr" : "Tel:",
			"ru" : "Тел:"
		},
		"value" : document.getElementById('customerPhone').value
	});
	orderCustomerDetails.push({
		"text" : {
			"en" : "E-Mail:",
			"fr" : "E-Mail:",
			"ru" : "Электронная почта:"
		},
		"value" : document.getElementById('customerEmail').value
	});
	orderCustomerDetails.push({
		"text" : {
			"en" : "Street Address:",
			"fr" : "Address:",
			"ru" : "Адрес доставки:"
		},
		"value" : document.getElementById('customerAddress').value
	});
	return orderCustomerDetails;
}
