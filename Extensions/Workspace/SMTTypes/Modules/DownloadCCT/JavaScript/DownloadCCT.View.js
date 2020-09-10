// bb1.SMTTypes.DownloadCCTView, this is the view your cct
// will load after dragged into the application

define('bb1.SMTTypes.DownloadCCT.View'
,	[
		'CustomContentType.Base.View'

	,	'bb1_smttypes_downloadcct.tpl'

	,	'jQuery'
	,	'underscore'
	]
,	function (
		CustomContentTypeBaseView

	,	bb1_smttypes_downloadcct_tpl

	,	jQuery
	,	_
	)
{
	'use strict';

	return CustomContentTypeBaseView.extend({

		template: bb1_smttypes_downloadcct_tpl
	,	getContext: function getContext()
		{
			if(!this.settings.custrecord_bb1_download_description||this.settings.custrecord_bb1_download_description==""){
				this.settings.custrecord_bb1_download_description="&nbsp;";
			}
			return this.settings;
		}
	});
});