Reveal.initialize({
    controls: false,
    keyboard: false,
    progress: true,
    history: true,
    center: true,
    touch: false,

    theme: Reveal.getQueryHash().theme, // available themes are in /css/theme
    transition: Reveal.getQueryHash().transition || 'default', // default/cube/page/concave/zoom/linear/fade/none

    // Optional libraries used to extend on reveal.js
    dependencies: [
        { src: 'lib/js/classList.js', condition: function() { return !document.body.classList; } },
        { src: 'plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
        { src: 'plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
        { src: 'plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
        { src: 'plugin/zoom-js/zoom.js', async: true, condition: function() { return !!document.body.classList; } },
        { src: 'plugin/notes/notes.js', async: true, condition: function() { return !!document.body.classList; } }
    ]
});

function log(m) {
    console.log(m);
}

var sockjs_url = '/echo';
var sockjs = new SockJS(sockjs_url);
sockjs.onopen = function() {
    log(' [*] Connected (using: '+sockjs.protocol+')');
};
sockjs.onclose = function(e) {
    log(' [*] Disconnected ('+e.status + ' ' + e.reason+ ')');
};
sockjs.onmessage = function(e) {
    log(' [ ] received: ' + JSON.stringify(e.data));
    switch( e.data ) {
    case 'p': Reveal.navigatePrev(); break;
    case 'n': Reveal.navigateNext(); break;
    case 'h': Reveal.navigateLeft(); break;
    case 'l': Reveal.navigateRight(); break;
    case 'k': Reveal.navigateUp(); break;
    case 'j': Reveal.navigateDown(); break;
    case 'home': Reveal.slide(0); break;
    case 'end': Reveal.slide(Number.MAX_NUMBER); break;
    case 'space': Reveal.isOverview() ? Reveal.toggleOverview() : Reveal.navigateNext(); break;
    case 'return': Reveal.isOverview() ? Review.toggleOverview() : function () {}; break;
    case 'b': Reveal.togglePause(); break;
    case 'f': Reveal.enterFullscreen(); break;
    default: log(e.data);
    }
};

