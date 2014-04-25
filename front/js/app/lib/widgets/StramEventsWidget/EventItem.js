var _ = require('underscore');
var kt = require('knights-templar');
var BaseView = require('bassview');
var EventItem = BaseView.extend({
    className: 'event-item',
    initialize: function() {
        this.listenTo(this.model, 'change:selected', this.render);
    },
    render: function() {
        var json = this.model.toJSON();
        var html = this.template(json);
        this.$el.html(html);
        return this;
    },
    template: kt.make(__dirname+'/EventItem.html')
});
exports = module.exports = EventItem;