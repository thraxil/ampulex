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
};

function shim(k, f) {
   return function() {
     sockjs.send(k);
     f();
   }
}

Reveal.initialize({
    controls: true,
    progress: true,
    history: true,
    center: true,

    keyboard: {
        // p, page up
        80: shim('p', Reveal.navigatePrev),
        33: shim('p', Reveal.navigatePrev),
        // n, page down -->
        78: shim('n', Reveal.navigateNext),
        34: shim('n', Reveal.navigateNext),
        // h, left -->
        72: shim('h', Reveal.navigateLeft),
        37: shim('h', Reveal.navigateLeft),
        // l, right
        76: shim('l', Reveal.navigateRight),
        39: shim('l', Reveal.navigateRight),
        // k, up
        75: shim('k', Reveal.navigateUp),
        38: shim('k', Reveal.navigateUp),
        // j, down
        74: shim('j', Reveal.navigateDown),
        40: shim('j', Reveal.navigateDown),
        // home
        36: shim('home', function() {Reveal.slide(0);}),
        // end
        35: shim('end', function() { Reveal.slide(Number.MAX_VALUE);}),
        // space
        32: shim('space', function() {
            Reveal.isOverview() ? Reveal.toggleOverview() : Reveal.navigateNext()}),
        // return
        13: shim('enter', function() {Reveal.isOverview() ? Reveal.toggleOverview() : function () {} }),
        // b, period, Logitech presenter tools "black screen" button
        66: shim('b', Reveal.togglePause),
        190: shim('b', Reveal.togglePause),
        191: shim('b', Reveal.togglePause),
        // f
        70: shim('f', Reveal.enterFullScreen),
    },

    theme: Reveal.getQueryHash().theme,
    transition: Reveal.getQueryHash().transition || 'default',

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



