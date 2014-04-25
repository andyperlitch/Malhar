var BaseView = require('bassview');
var EventItem = require('./EventItem');
var EventList = BaseView.extend({

    initialize: function(options) {
        console.log('init eventlist');
        this.listenTo(this.collection, 'add', this.addOne);
    },

    render: function() {
        this.trigger('clean_up');
        this.collection.each(this.addOne);
    },

    addOne: function(model) {
        console.log('addOne');
        var itemView = new EventItem({
            model: model
        });
        itemView.listenTo(this, 'clean_up', itemView.remove);
        this.$el.prepend(itemView.render().el);
    }

});
exports = module.exports = EventList;