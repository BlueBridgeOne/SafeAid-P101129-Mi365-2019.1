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

    function getFacetValueUrl(facetId, facetValueLabel) {
      var facetValueUrl = '';

      try {

        if (!itemFacets) {
          var itemApiUrl = 'http://' + ModelsInit.session.getEffectiveShoppingDomain() + '/api/items';
          var itemApiParms = {
            'include': 'facets',
            'limit': 1
          };
          var itemApiHeaders = {
            'Accept': 'application/json'
          };
          var itemApiUrlWithParms = addParamsToUrl(itemApiUrl, itemApiParms);
          var itemApiResponse = nlapiRequestURL(itemApiUrlWithParms, null, itemApiHeaders);
          var itemApiResults = JSON.parse(itemApiResponse.getBody() || '{}');

          itemFacets = itemApiResults && itemApiResults.facets || [];
        }

        for (var i = 0; i < itemFacets.length; i++) {
          var facet = itemFacets[i];

          if (facet.id === facetId) {
            for (var j = 0; j < facet.values.length; j++) {
              var facetValue = facet.values[j] || {};

              if (facetValue.label && facetValue.url) {
                if (facetValue.label === facetValueLabel)
                  facetValueUrl = facetValue.url;
              }
            }
          }
        }

      } catch (error) {
        console.log('Error occurred getting Customer/Buyer facet values', error && error.getCode ? error.getCode() + ': ' + error.getDetails() : error);
      }

      return facetValueUrl;
    }

    Application.on('after:Profile.get', function (model, profile) {
      var contactId = ModelsInit.context.getContact();

      var customer = context.getUser();
      //var custentity_bb1_sca_showstandarditems = true;
      
      var lookupFields={}
      try {
        lookupFields = nlapiLookupField('customer', customer, ['custentity_bb1_sca_showstandarditems','custentity_bb1_sca_membership']);
      } catch (err) {}

      //nlapiLogExecution("DEBUG","custentity_bb1_sca_showstandarditems",JSON.stringify(custentity_bb1_sca_showstandarditems));
      var customerShowStandardItems = (lookupFields&&lookupFields.custentity_bb1_sca_showstandarditems)||false;
      var custentity_bb1_sca_membership=(lookupFields&&lookupFields.custentity_bb1_sca_membership)||1;
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
            custentity_bb1_sca_membership:custentity_bb1_sca_membership
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