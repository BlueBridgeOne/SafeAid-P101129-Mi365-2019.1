/*BB1 G Truslove 2017*/
define('SafeAid.bb1.Mi365Router', [
    'Backbone',
    'SafeAid.bb1.Mi365Dashboard.View',
    'SafeAid.bb1.Mi365Buyers.View',
    'SafeAid.bb1.Mi365Buyer.View',
    'SafeAid.bb1.Mi365Areas.View',
    'SafeAid.bb1.Mi365Area.View',
    'SafeAid.bb1.Mi365Reports.View',
    'SafeAid.bb1.Mi365Report.View',
    'SafeAid.bb1.Mi365Wearers.View',
    'SafeAid.bb1.Mi365Wearer.View',
    'SafeAid.bb1.Mi365Alerts.View',
    'SafeAid.bb1.Mi365Alert.View',
    'SafeAid.bb1.Mi365Stocks.View',
    'SafeAid.bb1.Mi365Stock.View',
    'SafeAid.bb1.Mi365Rules.View',
    'SafeAid.bb1.Mi365Rule.View',
    'SafeAid.bb1.Mi365Transfers.View',
    'SafeAid.bb1.Mi365Transfer.View',
    'SafeAid.bb1.Mi365ConfirmTransfer.View',
    'SafeAid.bb1.Mi365StartTransfer.View',
    'SafeAid.bb1.Mi365Buyers.Collection',
    'SafeAid.bb1.Mi365Buyers.Model',
    'SafeAid.bb1.Mi365Areas.Collection',
    'SafeAid.bb1.Mi365Areas.Model',
    'SafeAid.bb1.Mi365Wearers.Collection',
    'SafeAid.bb1.Mi365Wearers.Model',
    'SafeAid.bb1.Mi365Alerts.Collection',
    'SafeAid.bb1.Mi365Alerts.Model',
    'SafeAid.bb1.Mi365Stocks.Collection',
    'SafeAid.bb1.Mi365Stocks.Model',
    'SafeAid.bb1.Mi365Rules.Collection',
    'SafeAid.bb1.Mi365Rules.Model',
    'SafeAid.bb1.Mi365Transfers.Collection',
    'SafeAid.bb1.Mi365Transfers.Model',
    'Mi365Overview',
    'SafeAid.bb1.Mi365Reports.Model',
    'jQuery',
    'Profile.Model',
    'ErrorManagement.InternalError.View'
], function (
    Backbone,
    Mi365DashboardView,
    Mi365BuyersView,
    Mi365BuyerView,
    Mi365AreasView,
    Mi365AreaView,
    Mi365ReportsView,
    Mi365ReportView,
    Mi365WearersView,
    Mi365WearerView,
    Mi365AlertsView,
    Mi365AlertView,
    Mi365StocksView,
    Mi365StockView,
    Mi365RulesView,
    Mi365RuleView,
    Mi365TransfersView,
    Mi365TransferView,
    Mi365ConfirmTransferView,
    Mi365StartTransferView,
    Mi365BuyersCollection,
    Mi365BuyersModel,
    Mi365AreasCollection,
    Mi365AreasModel,
    Mi365WearersCollection,
    Mi365WearersModel,
    Mi365AlertsCollection,
    Mi365AlertsModel,
    Mi365StocksCollection,
    Mi365StocksModel,
    Mi365RulesCollection,
    Mi365RulesModel,
    Mi365TransfersCollection,
    Mi365TransfersModel,
    Mi365Overview,
    Mi365ReportsModel,
    jQuery,
    ProfileModel,
    InternalError) {


    return Backbone.Router.extend({
        initialize: function (application) {
            var self = this;
            this.application = application;
//console.log("Mi365Overview",Mi365Overview);
            ProfileModel.getPromise().done(function () {
                Mi365Overview.done(function (overview) { //show Mi365 if silver or better.
                    console.log(overview);
                    var level = overview.get("level");
                    console.log("level: " + level);
                    if (level && level != "bronze") {
                        $("<style>").text("a[data-id='mi365']{ display:block!important; }").appendTo("head");
                    }
                });
            });

        },
        routes: {
            'Mi365': 'Dashboard',
            'Mi365/buyers': 'Buyers',
            'Mi365/areas': 'Areas',
            'Mi365/reports': 'Reports',
            'Mi365/wearers': 'Wearers',
            'Mi365/alerts': 'Alerts',
            'Mi365/buyer/:id': 'Buyer',
            'Mi365/area/:id': 'Area',
            'Mi365/report/:id': 'Report',
            'Mi365/wearer/:id': 'Wearer',
            'Mi365/alert/:id': 'Alert',
            'Mi365/wearer/stock/:id': 'WearerStocks',
            'Mi365/area/stock/:id': 'AreaStocks',
            'Mi365/stock/:id': 'Stock',
            'Mi365/wearer/rule/:id': 'WearerRules',
            'Mi365/area/rule/:id': 'AreaRules',
            'Mi365/wearer/rules/:id': 'WearerRules',
            'Mi365/area/rules/:id': 'AreaRules',
            'Mi365/rule/:id': 'Rule',
            'Mi365/wearer/transfers/:id': 'WearerTransfers',
            'Mi365/area/wearers/:id': 'AreaWearers',
            'Mi365/area/transfers/:id': 'AreaTransfers',
            'Mi365/area/transfers/new/:id': 'StartTransfer',
            'Mi365/transfer/:id': 'Transfer',
            'Mi365/transfer/confirm/:id': 'ConfirmTransfer'

        },
        getErrorFunction:function(){
            var self=this;
            return function (mod,res) {
                var errView=new InternalError({application: self.application,pageHeader:"Unable to View",title:"Unable to View",message:res&&res.responseJSON&&res.responseJSON.errorMessage});
                errView.showContent();
            };
        },
        getSuccessFunction:function(view){
            return function () {
                view.showContent();
            }
        }
        ,
        Dashboard: function () {
            var view = new Mi365DashboardView({
                application: this.application
            });
            view.showContent();
        },
        ConfirmTransfer: function (id) {
            var model = new Mi365TransfersModel();
            var view = new Mi365ConfirmTransferView({
                model: model,
                application: this.application
            });

            model.fetch({
                data: {
                    id: id,
                    t: new Date().getTime()
                },
                success: this.getSuccessFunction(view),
                error: this.getErrorFunction()
            });
        },
        Buyer: function (id) {
            var model = new Mi365BuyersModel();
            var view = new Mi365BuyerView({
                model: model,
                application: this.application
            });

            model.fetch({
                data: {
                    id: id,
                    t: new Date().getTime()
                },
                success: this.getSuccessFunction(view),
                error: this.getErrorFunction()
            });
        },
        Buyers: function () {
            var collection = new Mi365BuyersCollection();
            var view = new Mi365BuyersView({
                collection: collection,
                application: this.application
            });
            collection.fetch({
                data: {},
                success: this.getSuccessFunction(view),
                error: this.getErrorFunction()
            });
        },
        Area: function (id) {
            var model = new Mi365AreasModel();
            var view = new Mi365AreaView({
                model: model,
                application: this.application
            });

            model.fetch({
                data: {
                    id: id,
                    t: new Date().getTime()
                },
                success: this.getSuccessFunction(view),
                error: this.getErrorFunction()
            });
        },
        Areas: function () {
            var collection = new Mi365AreasCollection();
            var view = new Mi365AreasView({
                collection: collection,
                application: this.application
            });

            collection.fetch({
                data: {},
                success: this.getSuccessFunction(view),
                error: this.getErrorFunction()
            })
            ;
        },
        Report: function (id) {
            var model = new Mi365ReportsModel();
            var view = new Mi365ReportView({
                model: model,
                application: this.application
            });

            model.fetch({
                data: {
                    id: id,
                    t: new Date().getTime()
                },
                success: this.getSuccessFunction(view),
                error: this.getErrorFunction()
            });
        },
        Reports: function () {
            var view = new Mi365ReportsView({
                application: this.application
            });
            view.showContent();
        },
        Wearer: function (id) {
            var model = new Mi365WearersModel();
            var view = new Mi365WearerView({
                model: model,
                application: this.application
            });
            model.fetch({
                data: {
                    id: id,
                    t: new Date().getTime()
                },
                success: this.getSuccessFunction(view),
                error: this.getErrorFunction()
            });
        },
        AreaWearers: function (id) {
            var collection = new Mi365WearersCollection();
            var view = new Mi365WearersView({
                collection: collection,
                application: this.application
            });

            collection.fetch({
                data: {
                    area: id
                },
                success: this.getSuccessFunction(view),
                error: this.getErrorFunction()
            });
        },
        Wearers: function () {
            var collection = new Mi365WearersCollection();
            var view = new Mi365WearersView({
                collection: collection,
                application: this.application
            });

            collection.fetch({
                data: {},
                success: this.getSuccessFunction(view),
                error: this.getErrorFunction()
            });
        },
        Alert: function (id) {
            var model = new Mi365AlertsModel();
            var view = new Mi365AlertView({
                model: model,
                application: this.application
            });

            model.fetch({
                data: {
                    id: id,
                    t: new Date().getTime()
                },
                success: this.getSuccessFunction(view),
                error: this.getErrorFunction()
            });
        },
        Alerts: function () {
            var collection = new Mi365AlertsCollection();
            var view = new Mi365AlertsView({
                collection: collection,
                application: this.application
            });

            collection.fetch({
                data: {},
                success: this.getSuccessFunction(view),
                error: this.getErrorFunction()
            });
        },
        Transfer: function (id) {
            var model = new Mi365TransfersModel();
            var view = new Mi365TransferView({
                model: model,
                application: this.application
            });

            model.fetch({
                data: {
                    id: id,
                    t: new Date().getTime()
                },
                success: this.getSuccessFunction(view),
                error: this.getErrorFunction()
            });
        },
        Stock: function (id) {
            var model = new Mi365StocksModel();
            var view = new Mi365StockView({
                model: model,
                application: this.application
            });

            model.fetch({
                data: {
                    id: id,
                    t: new Date().getTime()
                },
                success: this.getSuccessFunction(view),
                error: this.getErrorFunction()
            });
        },
        Rule: function (id) {
            var model = new Mi365RulesModel();
            var view = new Mi365RuleView({
                model: model,
                application: this.application
            });

            model.fetch({
                data: {
                    id: id,
                    t: new Date().getTime()
                },
                success: this.getSuccessFunction(view),
                error: this.getErrorFunction()
            });
        },
        StartTransfer: function (id) {
            var model = new Mi365StocksModel();
            var view = new Mi365StartTransferView({
                model: model,
                application: this.application
            });

            model.fetch({
                data: {
                    id: id,
                    t: new Date().getTime(),
                    includeWearers: "T"

                },
                success: this.getSuccessFunction(view),
                error: this.getErrorFunction()
            });
        },
        WearerStocks: function (id) {
            var collection = new Mi365StocksCollection();
            var view = new Mi365StocksView({
                collection: collection,
                application: this.application,
                wearer: id
            });

            collection.fetch({
                data: {
                    wearer: id,
                    t: new Date().getTime()
                },
                success: this.getSuccessFunction(view),
                error: this.getErrorFunction()
            });
        },
        AreaStocks: function (id) {
            var collection = new Mi365StocksCollection();
            var view = new Mi365StocksView({
                collection: collection,
                application: this.application,
                area: id
            });

            collection.fetch({
                data: {
                    area: id,
                    t: new Date().getTime()
                },
                success: this.getSuccessFunction(view),
                error: this.getErrorFunction()
            });
        },
        WearerRules: function (id) {
            var collection = new Mi365RulesCollection();
            var view = new Mi365RulesView({
                collection: collection,
                application: this.application,
                wearer: id
            });

            collection.fetch({
                data: {
                    wearer: id,
                    t: new Date().getTime()
                },
                success: this.getSuccessFunction(view),
                error: this.getErrorFunction()
            });
        },
        AreaRules: function (id) {
            var collection = new Mi365RulesCollection();
            var view = new Mi365RulesView({
                collection: collection,
                application: this.application,
                area: id
            });

            collection.fetch({
                data: {
                    area: id,
                    t: new Date().getTime()
                },
                success: this.getSuccessFunction(view),
                error: this.getErrorFunction()
            });
        },
        Transfer: function (id) {
            var model = new Mi365TransfersModel();
            var view = new Mi365TransferView({
                model: model,
                application: this.application
            });

            model.fetch({
                data: {
                    id: id,
                    t: new Date().getTime()
                },
                success: this.getSuccessFunction(view),
                error: this.getErrorFunction()
            });
        },
        WearerTransfers: function (id) {
            var collection = new Mi365TransfersCollection();
            var view = new Mi365TransfersView({
                collection: collection,
                application: this.application,
                wearer: id
            });

            collection.fetch({
                data: {
                    wearer: id,
                    t: new Date().getTime()
                },
                success: this.getSuccessFunction(view),
                error: this.getErrorFunction()
            });
        },
        AreaTransfers: function (id) {
            var collection = new Mi365TransfersCollection();
            var view = new Mi365TransfersView({
                collection: collection,
                application: this.application,
                area: id
            });

            collection.fetch({
                data: {
                    area: id,
                    t: new Date().getTime()
                },
                success: this.getSuccessFunction(view),
                error: this.getErrorFunction()
            });
        }

    });
});