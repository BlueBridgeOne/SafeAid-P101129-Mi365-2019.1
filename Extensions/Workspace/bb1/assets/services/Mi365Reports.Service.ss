
function service(request, response)
{
	'use strict';
	try 
	{
		require('SafeAid.bb1.Mi365Reports.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('SafeAid.bb1.Mi365Reports.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}