/*BB1 G Truslove 2017*/
define('SafeAid.bb1.Mi365Router', [
    'Backbone',
    'SafeAid.bb1.Mi365Dashboard.View',
    'SafeAid.bb1.Mi365Buyers.View',
    'SafeAid.bb1.Mi365Buyer.View',
    'SafeAid.bb1.Mi365Areas.View',
    'SafeAid.bb1.Mi365Area.View',
    'SafeAid.bb1.Mi365Wearers.View',
    'SafeAid.bb1.Mi365Wearer.View',
    'SafeAid.bb1.Mi365Alerts.View',
    'SafeAid.bb1.Mi365Alert.View',
    'SafeAid.bb1.Mi365Stocks.View',
    'SafeAid.bb1.Mi365Stock.View',
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
    'SafeAid.bb1.Mi365Transfers.Collection',
    'SafeAid.bb1.Mi365Transfers.Model',
    'SafeAid.bb1.Mi365Overview.Model',
    'jQuery',
    'Profile.Model'
], function (
    Backbone,
    Mi365DashboardView,
    Mi365BuyersView,
    Mi365BuyerView,
    Mi365AreasView,
    Mi365AreaView,
    Mi365WearersView,
    Mi365WearerView,
    Mi365AlertsView,
    Mi365AlertView,
    Mi365StocksView,
    Mi365StockView,
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
    Mi365TransfersCollection,
    Mi365TransfersModel,
    Mi365OverviewModel,
    jQuery,
    ProfileModel) {


    return Backbone.Router.extend({
        initialize: function (application) {
            var self=this;
            this.application = application;

            ProfileModel.getPromise().done(function() {
            self.overview = new Mi365OverviewModel();

            self.overview.fetch({
                data: {
                    t: new Date().getTime()
                }
            }).done(function () { //show Mi365 if silver or better.
                console.log(self.overview);
                var level = self.overview.get("level");
                console.log("level: "+level);
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
            'Mi365/wearers': 'Wearers',
            'Mi365/alerts': 'Alerts',
            'Mi365/buyer/:id': 'Buyer',
            'Mi365/area/:id': 'Area',
            'Mi365/wearer/:id': 'Wearer',
            'Mi365/alert/:id': 'Alert',
            'Mi365/wearer/stock/:id': 'WearerStocks',
            'Mi365/area/stock/:id': 'AreaStocks',
            'Mi365/stock/:id': 'Stock',
            'Mi365/wearer/transfers/:id': 'WearerTransfers',
            'Mi365/area/wearers/:id': 'AreaWearers',
            'Mi365/area/transfers/:id': 'AreaTransfers',
            'Mi365/area/transfers/new/:id': 'StartTransfer',
            'Mi365/transfer/:id': 'Transfer',
            'Mi365/transfer/confirm/:id': 'ConfirmTransfer'

        },
        Dashboard: function () {
            var view = new Mi365DashboardView({
                application: this.application,
                overview:this.overview
            });
            view.showContent();
        },
        ConfirmTransfer: function (id) {
            var model = new Mi365TransfersModel();
            var view = new Mi365ConfirmTransferView({
                model: model,
                application: this.application,
                overview:this.overview
            });

            model.fetch({
                data: {
                    id: id,
                    t: new Date().getTime()
                }
            }).done(function () {
                view.showContent();
            });
        },
        Buyer: function (id) {
            var model = new Mi365BuyersModel();
            var view = new Mi365BuyerView({
                model: model,
                application: this.application,
                overview:this.overview
            });

            model.fetch({
                data: {
                    id: id,
                    t: new Date().getTime()
                }
            }).done(function () {
                view.showContent();
                
            });
        },
        Buyers: function () {
            var collection = new Mi365BuyersCollection();
            var view = new Mi365BuyersView({
                collection: collection,
                application: this.application,
                overview:this.overview
            });
            collection.fetch({
                data: {}
            }).done(function () {
               view.showContent();     
            });
        },
        Area: function (id) {
            var model = new Mi365AreasModel();
            var view = new Mi365AreaView({
                model: model,
                application: this.application,
                overview:this.overview
            });

            model.fetch({
                data: {
                    id: id,
                    t: new Date().getTime()
                }
            }).done(function () {
                view.showContent();
            });
        },
        Areas: function () {
            var collection = new Mi365AreasCollection();
            var view = new Mi365AreasView({
                collection: collection,
                application: this.application,
                overview:this.overview
            });

            collection.fetch({
                data: {}
            }).done(function () {
                view.showContent();
            });
        },
        Wearer: function (id) {
            var model = new Mi365WearersModel();
            var view = new Mi365WearerView({
                model: model,
                application: this.application,
                overview:this.overview
            });

            model.fetch({
                data: {
                    id: id,
                    t: new Date().getTime()
                }
            }).done(function () {
                view.showContent();
            });
        },
        AreaWearers: function (id) {
            var collection = new Mi365WearersCollection();
            var view = new Mi365WearersView({
                collection: collection,
                application: this.application,
                overview:this.overview
            });

            collection.fetch({
                data: {
                    area: id
                }
            }).done(function () {
                view.showContent();
            });
        },
        Wearers: function () {
            var collection = new Mi365WearersCollection();
            var view = new Mi365WearersView({
                collection: collection,
                application: this.application,
                overview:this.overview
            });

            collection.fetch({
                data: {}
            }).done(function () {
                view.showContent();
            });
        },
        Alert: function (id) {
            var model = new Mi365AlertsModel();
            var view = new Mi365AlertView({
                model: model,
                application: this.application,
                overview:this.overview
            });

            model.fetch({
                data: {
                    id: id,
                    t: new Date().getTime()
                }
            }).done(function () {
                view.showContent();
            });
        },
        Alerts: function () {
            var collection = new Mi365AlertsCollection();
            var view = new Mi365AlertsView({
                collection: collection,
                application: this.application,
                overview:this.overview
            });

            collection.fetch({
                data: {}
            }).done(function () {
                view.showContent();
            });
        },
        Transfer: function (id) {
            var model = new Mi365TransfersModel();
            var view = new Mi365TransferView({
                model: model,
                application: this.application,
                overview:this.overview
            });

            model.fetch({
                data: {
                    id: id,
                    t: new Date().getTime()
                }
            }).done(function () {
                view.showContent();
            });
        },
        Stock: function (id) {
            var model = new Mi365StocksModel();
            var view = new Mi365StockView({
                model: model,
                application: this.application,
                overview:this.overview
            });

            model.fetch({
                data: {
                    id: id,
                    t: new Date().getTime()
                }
            }).done(function () {
                view.showContent();
            });
        },
        StartTransfer: function (id) {
            var model = new Mi365StocksModel();
            var view = new Mi365StartTransferView({
                model: model,
                application: this.application,
                overview:this.overview
            });

            model.fetch({
                data: {
                    id: id,
                    t: new Date().getTime(),
                    includeWearers: "T"

                }
            }).done(function () {
                view.showContent();
            });
        },
        WearerStocks: function (id) {
            var collection = new Mi365StocksCollection();
            var view = new Mi365StocksView({
                collection: collection,
                application: this.application,
                wearer: id,
                overview:this.overview
            });

            collection.fetch({
                data: {
                    wearer: id,
                    t: new Date().getTime()
                }
            }).done(function () {
                view.showContent();
            });
        },
        AreaStocks: function (id) {
            var collection = new Mi365StocksCollection();
            var view = new Mi365StocksView({
                collection: collection,
                application: this.application,
                area: id,
                overview:this.overview
            });

            collection.fetch({
                data: {
                    area: id,
                    t: new Date().getTime()
                }
            }).done(function () {
                view.showContent();
            });
        },
        Transfer: function (id) {
            var model = new Mi365TransfersModel();
            var view = new Mi365TransferView({
                model: model,
                application: this.application,
                overview:this.overview
            });

            model.fetch({
                data: {
                    id: id,
                    t: new Date().getTime()
                }
            }).done(function () {
                view.showContent();
            });
        },
        WearerTransfers: function (id) {
            var collection = new Mi365TransfersCollection();
            var view = new Mi365TransfersView({
                collection: collection,
                application: this.application,
                wearer: id,
                overview:this.overview
            });

            collection.fetch({
                data: {
                    wearer: id,
                    t: new Date().getTime()
                }
            }).done(function () {
                view.showContent();
            });
        },
        AreaTransfers: function (id) {
            var collection = new Mi365TransfersCollection();
            var view = new Mi365TransfersView({
                collection: collection,
                application: this.application,
                area: id,
                overview:this.overview
            });

            collection.fetch({
                data: {
                    area: id,
                    t: new Date().getTime()
                }
            }).done(function () {
                view.showContent();
            });
        }

    });
});