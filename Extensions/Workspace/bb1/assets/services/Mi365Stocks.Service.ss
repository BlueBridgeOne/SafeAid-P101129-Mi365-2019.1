
function service(request, response)
{
	'use strict';
	try 
	{
		require('SafeAid.bb1.Mi365Stocks.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}