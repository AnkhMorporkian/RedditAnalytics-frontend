Handlebars.registerHelper('time_ago', function (timestamp) {
    return moment.unix(timestamp).fromNow();
});

var App = Ember.Application.create();


var ONE_SECOND = 1000;

App.Clock = Ember.Object.extend({
    second: null,
    minute: null,
    hour: null,

    init: function () {
        this.tick();
    },

    tick: function () {
        var now = new Date();

        this.setProperties({
            second: now.getSeconds(),
            minute: now.getMinutes(),
            hour: now.getHours()
        });

        var self = this;
        setTimeout(function () {
            self.tick();
        }, ONE_SECOND)
    }
});

App.clock = App.Clock.create();

App.Router.map(function () {

});

App.submissions = Em.A();

App.IndexRoute = Ember.Route.extend({
    model: function () {
        return App.submissions;
    }
});

App.PostItemController = Ember.ObjectController.extend({
    clock: App.clock,

    created: function () {
        return moment.unix(this.get('model.created_utc')).fromNow();
    }.property('model.created', 'clock.minute')
});


var eventSource = new EventSource("http://api-dev.redditanalytics.com/submission_stream?eventsource=true");
eventSource.onmessage = function (evt) {
    var post = JSON.parse(evt.data);
    if (post.thumbnail == "self" || post.thumbnail == "default") {
        post.thumbnail = "images/no_thumbnail.gif";
    }
    if (post.thumbnail == "nsfw") {
        post.thumbnail = "images/nsfw.gif"
    }
    App.submissions.insertAt(0, post);
};