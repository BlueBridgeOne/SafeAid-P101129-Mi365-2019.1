// bb1.SMTTypes.YouTubeCCTView, this is the view your cct
// will load after dragged into the application

define('bb1.SMTTypes.YouTubeCCT.View'
,	[
		'CustomContentType.Base.View'

	,	'bb1_smttypes_youtubecct.tpl'

	,	'jQuery'
	,	'underscore'
	]
,	function (
		CustomContentTypeBaseView

	,	bb1_smttypes_youtubecct_tpl

	,	jQuery
	,	_
	)
{
	'use strict';

	return CustomContentTypeBaseView.extend({

		template: bb1_smttypes_youtubecct_tpl
	,	getContext: function getContext()
		{
			return this.settings;
		}
	});
});