/**
 * Project : P101129
 * 
 * Description : Print a catalogue for a buyer/customer.
 * 
 * @Author : Gordon Truslove
 * @Date   : 3/31/2020, 3:34:53 PM
 * 
 * Copyright (c) 2019 BlueBridge One Business Solutions, All Rights Reserved
 * support@bluebridgeone.com, +44 (0)1932 300007
 * 
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/search', 'N/runtime', 'N/config', 'N/record', 'N/render', 'N/file'],
	function (search, runtime, config, record, render, file) {
		function onRequest(context) {
			var request = context.request;
			var contact = request.parameters.contact; //35
			var customer = request.parameters.customer;
			var settings = {},
				contactFields = {},
				custFields = {};
			if (contact) {
				contactFields = search.lookupFields({
					type: 'contact',
					id: contact,
					columns: ['custentity_bb1_sca_buyer', 'custentity_bb1_sca_overridecustomeritems', 'custentity_bb1_sca_showstandarditems', 'entityid', 'company']
				});
				customer = contactFields.company;
				if (customer && customer.length > 0) {
					customer = customer[0].value;
				}
			}

			if (customer) {
				custFields = search.lookupFields({
					type: 'customer',
					id: customer,
					columns: ['custentity_bb1_sca_showstandarditems', 'custentity_bb1_sca_membership', 'custentity_bb1_sca_websitecolour', 'custentity_bb1_sca_websitelogo', 'billaddress1', 'billaddress2', 'billcity', 'billstate', 'billzipcode', 'billcountry', 'companyname']
				});
			}
			if(customer){
			var filters=[
				["type","anyof","Assembly","InvtPart"], 
				"AND", 
				["isonline","is","T"], 
				"AND", 
				["isinactive","is","F"],
				"AND", 
      ["matrix","is","F"]
			 ];
			if(contactFields.custentity_bb1_sca_overridecustomeritems){
				filters.push("AND"), 
				filters.push(["custitem_bb1_sca_buyers","anyof",contact]); 
			}else{
				filters.push("AND"), 
				filters.push(["custitem_bb1_sca_customers","anyof",customer]);
				
			}

			var itemSearchObj = search.create({
				type: "item",
				filters:
				filters,
				columns:
				[
				   search.createColumn({name: "itemid", label: "Name"}),
				   search.createColumn({name: "displayname", label: "Display Name"}),
				   search.createColumn({name: "salesdescription", label: "Description"}),
				   search.createColumn({name: "type", label: "Type"}),
				   search.createColumn({name: "custitem_bb1_matrix_colour", label: "Colour"}),
				   search.createColumn({name: "custitem_bb1_matrix_size", label: "Size"}),
				   search.createColumn({name: "custitem_bb1_matrix_footwear", label: "Footwear"}),
				   search.createColumn({name: "custitem_bb1_matrix_length", label: "Length"}),
				   search.createColumn({name: "custitem_bb1_matrix_shoewidths", label: "Shoe Widths"}),
				   search.createColumn({name: "custitem_bb1_matrix_ladieswear", label: "Ladies Wear Sizes"}),
				   search.createColumn({name: "custitem_bb1_matrix_gloves", label: "Glove Sizes"}),
				   search.createColumn({name: "onlineprice", label: "Online Price"}),
				   search.createColumn({name: "baseprice", label: "Base Price"}),
				   search.createColumn({
					name: "displayname",
					join: "parent",
					label: "Display Name"
				 }),search.createColumn({
					name: "description",
					join: "parent",
					label: "Description"
				 })
				]
			 });
			 var item,items=[];
			 itemSearchObj.run().each(function(result){
				 item={
					 itemid:result.getValue("itemid"),
					 displayname:result.getValue("displayname"),
					 salesdescription:result.getValue("salesdescription"),
					 type:result.getValue("type"),
					 custitem_bb1_matrix_colour:result.getText("custitem_bb1_matrix_colour"),
					 custitem_bb1_matrix_size:result.getText("custitem_bb1_matrix_size"),
					 custitem_bb1_matrix_footwear:result.getText("custitem_bb1_matrix_footwear"),
					 custitem_bb1_matrix_length:result.getText("custitem_bb1_matrix_length"),
					 custitem_bb1_matrix_shoewidths:result.getText("custitem_bb1_matrix_shoewidths"),
					 custitem_bb1_matrix_ladieswear:result.getText("custitem_bb1_matrix_ladieswear"),
					 custitem_bb1_matrix_gloves:result.getText("custitem_bb1_matrix_gloves"),
					 onlineprice:result.getValue("onlineprice")||0,
					 baseprice:result.getValue("baseprice")||0,
					 parentDisplayName:result.getValue({name: "displayname",
					 join: "parent"})||result.getValue({name: "description",
					 join: "parent"})
				 };
				 item.name=item.parentDisplayName||item.displayname||item.salesdescription;
				 item.price=Math.max(item.onlineprice,item.baseprice);
				 item.hasColour=!!item.custitem_bb1_matrix_colour;
				 item.hasSize=!!item.custitem_bb1_matrix_size;
				 item.hasFootwear=!!item.custitem_bb1_matrix_footwear;
				 item.hasLength=!!item.custitem_bb1_matrix_length;
				 item.hasShoewidths=!!item.custitem_bb1_matrix_shoewidths;
				 item.hasLadieswear=!!item.custitem_bb1_matrix_ladieswear;
				 item.hasGloves=!!item.custitem_bb1_matrix_gloves;
				 if(item.itemid.indexOf(" : ")>-1){
					item.itemid=item.itemid.split(" : ")[1];
				 }
				 if(item.price>0){
					item.price="£"+item.price.toFixed(2);
					items.push(item);
				 }
				
				return true;
			 });
			 items.sort(function(a,b){return a.salesdescription.localeCompare(b.salesdescription)});

			var renderer = render.create();
			var xmlTemplateFile = file.load({
				id: "SuiteScripts/BB1/bb1_sca_mycatalogue.xml"
			});
			var companyConfig = config.load({
				type: config.Type.COMPANY_INFORMATION
			});
			//Add company information to renderer
			renderer.addRecord({
				templateName: 'companyInformation',
				record: companyConfig
			});
			//add record
			// renderer.addRecord({
			// 	templateName : 'record',
			// 	record : record.load({
			// 		type : record.Type.ITEM_RECEIPT,
			// 		id : itemreceipt,
			// 		isDynamic : false
			// 	})
			// });
			var pagelogo = companyConfig.getValue("pagelogo");
			if (pagelogo) {
				var logoFile = file.load({
					id: pagelogo
				});
				settings.logoUrl = xmlSafe(logoFile.url);
			}
			settings.colour=custFields.custentity_bb1_sca_websitecolour||"#f18830";

			log.debug("customer", JSON.stringify(custFields));
			
			if (custFields.custentity_bb1_sca_websitelogo&&custFields.custentity_bb1_sca_websitelogo.length>0) {
				
					settings.logo_url = xmlSafe(custFields.custentity_bb1_sca_websitelogo[0].text);
				

			}

			settings.date = new Date().toDateString();
			var address = "";
			address += custFields.companyname ? custFields.companyname + "<br />" : "";
			address += custFields.billaddress1 ? custFields.billaddress1 + "<br />" : "";
			address += custFields.billaddress2 ? custFields.billaddress2 + "<br />" : "";
			address += custFields.billcity ? custFields.billcity + "<br />" : "";
			address += custFields.billstate && custFields.billstate.length > 0 ? custFields.billstate[0].text + "<br />" : "";
			address += custFields.billzipcode ? custFields.billzipcode + "<br />" : "";
			address += custFields.billcountry && custFields.billcountry.length > 0 ? custFields.billcountry[0].text + "<br />" : "";
			settings.address = address;
			
			renderer.addCustomDataSource({
				format: render.DataSource.OBJECT,
				alias: "settings",
				data: settings
			});
			renderer.addCustomDataSource({
				format: render.DataSource.OBJECT,
				alias: "record",
				data: {items:items}
			});
		
			renderer.templateContent = xmlTemplateFile.getContents();
			//render to response
			var cataloguePdf = renderer.renderAsPdf();
			context.response.setHeader({
				name: 'Content-Disposition',
				value: "attachment;filename=My-Catalogue-" + new Date().toDateString().split(' ').join('-')+".pdf",
			});

			
			context.response.writeFile({
				file: cataloguePdf,
				isInline: true
			});
		}
		}

		function xmlSafe(value) {
			if (!value) {
				return value;
			}
			return value.split("&").join("&amp;");
		}

		return {
			onRequest: onRequest
		};

	})