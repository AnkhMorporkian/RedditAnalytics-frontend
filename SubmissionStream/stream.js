var eventSource = new EventSource("http://api-dev.redditanalytics.com/submission_stream?eventsource=true");
eventSource.onmessage = function (evt) {
    var post = JSON.parse(evt.data);
    var source   = $("#submission-template").html();
    var template = Handlebars.compile(source);
    $(template(post)).hide().prependTo("#submissions").slideDown("fast");
    console.log(post);
};