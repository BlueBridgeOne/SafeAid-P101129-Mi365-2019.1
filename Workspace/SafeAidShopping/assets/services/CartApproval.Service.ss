
function service(request, response)
{
	'use strict';
	try 
	{
		require('SafeAid.bb1.CartApproval.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('SafeAid.bb1.CartApproval.ServiceController', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}