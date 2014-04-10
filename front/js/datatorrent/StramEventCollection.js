var BaseCollection = require('./BaseCollection');
var StramEventModel = require('./StramEventModel');
var StramEventCollection = BaseCollection.extend({
    initialize:function(options) {
        this.appId = options.appId;
        this.dataSource = options.dataSource;
    },
    subscribe: function() {
        var topic = this.resourceTopic('StramEvents', {
            appId: this.appId
        });
        this.listenTo(this.dataSource, topic, function(e) {
            // console.log(e);
        });
    },
    model: StramEventModel,
    url: function() {
        return this.resourceURL('StramEvent', {
            appId: this.appId
        });
    }
});
exports = module.exports = StramEventCollection;