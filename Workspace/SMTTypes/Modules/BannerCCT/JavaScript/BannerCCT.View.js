// bb1.SMTTypes.BannerCCTView, this is the view your cct
// will load after dragged into the application

define('bb1.SMTTypes.BannerCCT.View'
,	[
		'CustomContentType.Base.View'

	,	'bb1_smttypes_bannercct.tpl'

	,	'jQuery'
	,	'underscore'
	]
,	function (
		CustomContentTypeBaseView

	,	bb1_smttypes_bannercct_tpl

	,	jQuery
	,	_
	)
{
	'use strict';

	return CustomContentTypeBaseView.extend({

		template: bb1_smttypes_bannercct_tpl
	,	getContext: function getContext()
		{
			if(!this.settings.custrecord_bb1_banner_title||this.settings.custrecord_bb1_banner_title==""){
				this.settings.custrecord_bb1_banner_title="&nbsp;";
			}
			if(!this.settings.custrecord_bb1_banner_subtitle||this.settings.custrecord_bb1_banner_subtitle==""){
				this.settings.custrecord_bb1_banner_subtitle="&nbsp;";
			}
			return this.settings;
		}
	});
});