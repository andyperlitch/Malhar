/*
 * Copyright (c) 2013 DataTorrent, Inc. ALL Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var _ = require('underscore');
var Backbone = require('backbone');
var BaseView = require('./StepView');
var GatewayInfoModel = require('../../../../datatorrent/GatewayInfoModel');
var Bbind = DT.lib.Bbindings;
var Notifier = DT.lib.Notifier;
var ConfigIssueCollection = DT.lib.ConfigIssueCollection;
var HadoopLocationModel = require('../../../../datatorrent/HadoopLocationModel');
var RestartModal = DT.lib.RestartModal;
var ConfirmModal = require('./ConfirmModalView');
var DfsModel = require('./DfsModel');
var ConfigPropertyModel = DT.lib.ConfigPropertyModel;
var HadoopView = BaseView.extend({

    events: {
        'click .continue': 'continue'
    },

    initialize: function(options) {
        BaseView.prototype.initialize.apply(this, arguments);
        this.dataSource = options.dataSource;
        this.navFlow = options.navFlow;

        this.error = false; //TODO
        this.loading = true;

        this.dfsModel = new DfsModel();

        var hadoopLocationPromise = this.loadHadoopLocation();
        var dfsPromise = this.loadDfsProperty();

        var all = $.when(hadoopLocationPromise, dfsPromise);
        all.done(function () {
            this.loading = false;
            
            this.dfsModel.init(this.dfsDirectory);

            this.render();
        }.bind(this));

        all.fail(function () {
            this.errorMsg = 'Internal error. Failed to load installation data.';
            this.render();
        }.bind(this));

        this.subview('hadoop-location', new Bbind.text({
            model: this.hadoopLocationModel,
            attr: 'value',
            updateEvents: ['blur'],
            clearErrorOnFocus: true,
            listenToModel: false,
            setAnyway: true,
            classElement: function($el) {
                return $el.parent().parent();
            },
            errorEl: '.help-block',
            errorClass: 'error'
        }));

        this.subview('dfs-directory', new Bbind.text({
            model: this.dfsModel,
            attr: 'value',
            updateEvents: ['blur'],
            clearErrorOnFocus: true,
            listenToModel: false,
            setAnyway: true,
            classElement: function($el) {
                return $el.parent().parent();
            },
            errorEl: '.help-block',
            errorClass: 'error'
        }));

        this.listenTo(this.hadoopLocationModel, 'change', function () {
            this.clearError('.hadoop-error');
        });

        this.listenTo(this.dfsModel, 'change', function () {
            this.clearError('.dfs-directory-error');
        });
    },

    loadDfsProperty: function () {
        var promise = this.loadProperty('dt.dfsRootDirectory');

        this.dfsDirectory = '';

        promise.then(function (data) {
            if (data && data.value) {
                this.dfsDirectory = data.value;
            }
        }.bind(this));

        return promise;
    },

    loadDFSIssue: function () {
        var issues = new ConfigIssueCollection([], { silentErrors: true });
        var issuesPromise = issues.fetch();

        issuesPromise.done(function () {
            this.dfsIssue = issues.findWhere({
                key: 'DFS_PROBLEM'
            });
        }.bind(this));

        return issuesPromise;
    },

    showDFSIssue: function () {
        if (this.dfsIssue) {
            _.defer(function () {
                this.$('.dfs-directory').attr('disabled', '');
                this.showError('.dfs-directory-error', this.dfsIssue.get('description'));
                this.$('.dfs-reload').show();
            }.bind(this));
        }
    },

    loadProperty: function (name) {
        var d = $.Deferred();

        var model = new ConfigPropertyModel({
            name: name
        });

        var ajax = model.fetch();

        ajax.then(function (data) {
            d.resolveWith(null, [data]);
        }.bind(this));

        ajax.fail(function (jqXHR) {
            if (jqXHR.status === 404) {
                d.resolveWith(null, [null]);
            } else {
                //TODO
                //console.log(jqXHR.responseText);
                //var response = JSON.parse(jqXHR.responseText);
                //this.errorMsg = response.message;
                //this.errorMsg = 'Failed to load config property dt.attr.GATEWAY_ADDRESS';
                this.error = true;
                d.reject();
            }
        }.bind(this));

        return d.promise();
    },

    saveProperty: function (name, value) {
        var d = $.Deferred();

        var model = new ConfigPropertyModel({
            name: name,
            value: value
        });

        var ajax = model.save();
        //var ajax = function () { var df = $.Deferred();df.rejectWith(null, [{status: 500}]);return df.promise() }();

        ajax.done(function () {
            d.resolve();
        });

        ajax.fail(function (jqXHR) {
            var msg;
            if (jqXHR.status === 412) {
                var response = JSON.parse(jqXHR.responseText);
                msg = response.message;
            } else {
                msg = 'Failed to update property ' + name;
            }

            d.rejectWith(null, [msg]);
        }.bind(this));

        return d.promise();
    },

    saveHadoopLocation: function () {
        var d = $.Deferred();

        //setTimeout(function () { d.rejectWith(null, ['hadoop location update failed test msg']); }, 3000); return d.promise();

        var ajax = this.hadoopLocationModel.save();

        ajax.done(function () {
            d.resolve();
        }.bind(this));

        ajax.fail(function (jqXHR) {
            var response = JSON.parse(jqXHR.responseText);
            d.rejectWith(null, [response.message]);
        }.bind(this));

        return d.promise();
    },

    loadHadoopLocation: function () {
        var d = $.Deferred();

        this.hadoopLocationModel = new HadoopLocationModel();
        var ajax = this.hadoopLocationModel.fetch();

        ajax.done(function () {
            // save default value
            this.hadoopLocationModel.init(this.hadoopLocationModel.get('value'));
            d.resolve();
        }.bind(this));

        ajax.fail(function (jqXHR) {
            if (jqXHR.status === 404) { //TODO
                this.hadoopLocationModel.init('');
                d.resolve();
            } else {
                d.reject();
            }
        }.bind(this));

        return d.promise();
    },

    continue: function (event) {
        event.preventDefault();

        if (jQuery(event.target).hasClass('disabled')) {
            return;
        }

        this.$('.hadoop-location').blur();

        if (!this.hadoopLocationModel.isValid()) {
            return;
        }

        this.$('.loading').show();
        this.$('.continue').addClass('disabled');

        var hadoopLocationPromise;
        if (this.hadoopLocationModel.isChanged()) {
            hadoopLocationPromise = this.saveHadoopLocation();
        } else {
            hadoopLocationPromise = this.createResolvedPromise();
        }

        hadoopLocationPromise.fail(function (msg) {
            this.$('.loading').hide();
            this.$('.continue').removeClass('disabled');
            this.showError('.hadoop-error', msg);
        }.bind(this));

        hadoopLocationPromise.done(function () {
            var issues = new ConfigIssueCollection([], { silentErrors: true });
            var issuesPromise = issues.fetch();

            issuesPromise.done(function () {
                this.$('.loading').hide();
                this.$('.continue').removeClass('disabled');

                var restartRequiredIssue = issues.findWhere({
                    key: 'RESTART_NEEDED'
                });

                var restartRequired = !!restartRequiredIssue;

                //if (true) {
                if (restartRequired) {
                    var modal = new ConfirmModal({
                        message: 'Changes made require restart. Please restart the Gateway.',
                        confirmCallback: this.restart.bind(this)
                    });
                    modal.addToDOM();
                    modal.launch();
                } else {
                    this.checkDFSLocation();
                }
            }.bind(this));

            issuesPromise.fail(function () {
                this.errorMsg = 'Internal Error. Failed to load installation status.';
                this.render();
            }.bind(this));
        }.bind(this));
    },

    restart: function () {
        var restartModal = new RestartModal({
            dataSource: this.dataSource,
            message: 'Restarting the Gateway...',
            restartCompleteCallback: this.checkDFSLocation.bind(this)
        });
        restartModal.addToDOM();
        restartModal.launch();
    },

    checkDFSLocation: function () {
        // Check that DFS Location is still valid
        var dfsPromise;
        if (this.dfsModel.isChanged()) {
            var value = this.dfsModel.getValue();
            dfsPromise = this.saveProperty('dt.dfsRootDirectory', value);
        } else {
            dfsPromise = this.createResolvedPromise();
        }
        
        dfsPromise.fail(function (msg) {
            this.showError('.dfs-directory-error', msg);
        }.bind(this));

        dfsPromise.done(_.bind(function() {
            if (this.dfsIssue) {
                var dfsIssuePromise = this.loadDFSIssue();

                dfsIssuePromise.done(function () {
                    if (this.dfsIssue) {
                        this.$('.loading').hide();
                        this.$('.continue').removeClass('disabled');
                        this.showDFSIssue();
                    } else {
                        this.navFlow.go('LicenseInfoView');
                    }
                }.bind(this));

                dfsIssuePromise.fail(function () {
                    this.error = true;
                    this.render();
                }.bind(this));
            } else {
                this.navFlow.go('LicenseInfoView');
            }
        }, this))
        
    },

    createResolvedPromise: function () {
        var d = $.Deferred();
        d.resolve();
        return d.promise();
    },

    showError: function (selector, msg) {
        var el = this.$(selector);
        el.text(msg);
        el.show();
    },

    clearError: function (selector) {
        this.$(selector).hide();
    },

    render: function() {
        var html = this.template({
            errorMsg: this.errorMsg,
            loading: this.loading,
            hadoopLocationModel: this.hadoopLocationModel,
            dfsModel: this.dfsModel
        });

        this.$el.html(html);

        if (this.assignments) {
            this.assign(this.assignments);
        }

        return this;
    },

    assignments: {
        '.hadoop-location': 'hadoop-location',
        '.dfs-directory': 'dfs-directory'
    }

});
exports = module.exports = HadoopView;