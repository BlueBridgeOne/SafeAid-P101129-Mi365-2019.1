//@module bb1.SafeAidShopping.Profile
define(
  'bb1.SafeAidShopping.Profile',
  [
    'Application',
    'Configuration',
    'Utils',
    'SC.Model',
    'Models.Init',

    'underscore'
  ],
  function (
    Application,
    Configuration,
    Utils,
    SCModel,
    ModelsInit,

    _
  ) {
    'use strict';

    var itemFacets;

    function addParamsToUrl(baseUrl, params) {
      if (params && _.keys(params).length) {
        var paramString = _.keys(params).map(function (k) {
          return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
        }).join('&');

        var join_string = ~baseUrl.indexOf('?') ? '&' : '?';

        return baseUrl + join_string + paramString;
      } else {
        return baseUrl;
      }
    }

    function fixedEncodeURIComponent(str){
      return encodeURIComponent(str).replace(/[!'()*]/g, function(c){
        return '%' + c.charCodeAt(0).toString(16);
      });
    }
  
      function getFacetValueUrl(facetId, facetValueLabel) {
  
        try {
          var body = "",
          char, charCode;
      if(facetValueLabel){
          
              for (var i = 0; i < facetValueLabel.length; i++) {
                  char = facetValueLabel.charAt(i);
                  charCode = facetValueLabel.charCodeAt(i);
                  if (char == " ") {
                      body += "-";
                  } else if (char == "&") {
                      body += "-AND-";
                  } else if (char == "/") {
                      body += "-SLASH-";
                  } else if (char == "-") {
                      body += "~";
                  } else {
                      body += fixedEncodeURIComponent(char);
                  }
          }
        }
          return body;

      } catch (error) {
        console.log('Error occurred getting Customer/Buyer facet values', error && error.getCode ? error.getCode() + ': ' + error.getDetails() : error);
      }

      return "";
    }

    Application.on('after:Profile.get', function (model, profile) {
      var contactId = ModelsInit.context.getContact();

      var customer = context.getUser();
      //var custentity_bb1_sca_showstandarditems = true;
      
      var lookupFields={}
      try {
        lookupFields = nlapiLookupField('customer', customer, ['custentity_bb1_sca_showstandarditems','custentity_bb1_sca_membership','custentity_bb1_sca_websitecolour','custentity_bb1_sca_websitelogo']);
      } catch (err) {
        //nlapiLogExecution("Unable to get contact fields.",customer+" "+err);
      }

      //nlapiLogExecution("DEBUG","custentity_bb1_sca_showstandarditems",JSON.stringify(custentity_bb1_sca_showstandarditems));
      var customerShowStandardItems = (lookupFields&&lookupFields.custentity_bb1_sca_showstandarditems)||false;
      var custentity_bb1_sca_membership=(lookupFields&&lookupFields.custentity_bb1_sca_membership)||1;
      var custentity_bb1_sca_websitecolour=(lookupFields&&lookupFields.custentity_bb1_sca_websitecolour)||"#F18830";
      var custentity_bb1_sca_websitelogo=lookupFields&&lookupFields.custentity_bb1_sca_websitelogo;
      var custentity_bb1_sca_websitelogo_url;
if(custentity_bb1_sca_websitelogo){
      var logo=nlapiLoadFile(custentity_bb1_sca_websitelogo);
      if(logo){
        custentity_bb1_sca_websitelogo_url=logo.getURL();
      }

}

      var customerName = profile.companyname;
      var customerFacetValueUrl = getFacetValueUrl('custitem_bb1_sca_customers', customerName);

      _.extend(profile, {
        customerShowStandardItems: customerShowStandardItems == 'T',
        customerFacetValueUrl: customerFacetValueUrl
      });

      if (contactId) {
        try {
          var contactFields = nlapiLookupField('contact', contactId, ['custentity_bb1_sca_buyer', 'custentity_bb1_sca_overridecustomeritems', 'custentity_bb1_sca_showstandarditems', 'entityid']);
          var contactName = customerName + ' : ' + contactFields.entityid;
          var contactFacetValueUrl = getFacetValueUrl('custitem_bb1_sca_buyers', contactName);
          
          var membership_level = "bronze";
				switch (custentity_bb1_sca_membership.toString()) {
					case "2":
						membership_level = "silver";
						break;
					case "3":
						membership_level = "gold";
						break;
					case "4":
						membership_level = "platinum";
						break;
				}

          _.extend(profile, {
            contactId: contactId,
            contactName: contactName,
            contactFacetValueUrl: contactFacetValueUrl,
            contactIsBuyer: contactFields.custentity_bb1_sca_buyer == 'T',
            contactOverrideCustomerItems: contactFields.custentity_bb1_sca_overridecustomeritems == 'T',
            contactShowStandardItems: contactFields.custentity_bb1_sca_showstandarditems == 'T',
            level:membership_level,
            custentity_bb1_sca_membership:custentity_bb1_sca_membership,
            custentity_bb1_sca_websitecolour:custentity_bb1_sca_websitecolour,
            custentity_bb1_sca_websitelogo:custentity_bb1_sca_websitelogo,
            custentity_bb1_sca_websitelogo_url:custentity_bb1_sca_websitelogo_url
          });
        } catch (err) {
          //unable to lookup contact record.
          _.extend(profile, {
            level:"bronze",
            custentity_bb1_sca_membership:1
          });
        }
      }

    });

  });