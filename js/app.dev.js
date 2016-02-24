"use strict";

var App = App || {};

App.control = function() {
    var init = function() {
        console.log("Initialising CONTROL");
        addEventListener();
    };
    var addEventListener = function() {
        console.log("Initialising events...");
        window.addEventListener("popstate", function(event) {
            if (event.state) {
                console.log("!", event.state);
            }
        }, false);
        $(window).resize(onResize);
        $(window).resize(onResize);
        $(window).blur(onWindowBlur);
        $(window).focus(onWindowFoucs);
        $(document).on("onClick", onClick);
        $(window).on("hashchange", hashChange);
        $(document).keydown(onKeyPress);
        $(window).on("mousewheel DOMMouseScroll", onScroll);
        $(document).on("touchstart", touchStart);
        $(document).on("touchmove", touchMove);
    };
    var hashChange = function() {
        if (window.location.hash && App.config.pages.indexOf(window.location.hash.split("#")[1]) !== -1) {
            App.config.page = App.config.pages.indexOf(window.location.hash.split("#")[1]);
        } else {
            App.config.page = 0;
            window.location.hash = App.config.pages[App.config.page];
        }
        App.view.showPage(App.config.page);
    };
    var onClick = function(_evt, _name, _id) {
        console.log("click:", _name, _id);
        switch (_name) {
          case "nav":
            if (_id !== App.config.page) {
                window.location.hash = App.config.pages[_id];
            }
            break;
        }
    };
    var onResize = function() {};
    var onKeyPress = function() {};
    var onScroll = function() {};
    var touchStart = function() {};
    var touchMove = function() {};
    var onWindowBlur = function() {};
    var onWindowFoucs = function() {};
    return {
        init: init
    };
}();

"use strict";

var App = App || {};

App.initializer = function() {
    var router, modules, hash;
    console.log("Initialising APP");
    App.config = App.config || {};
    App.config.mobile = /Android|webOS|iPhone|ipad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? true : false;
    App.config.ipad = /ipad/i.test(navigator.userAgent) ? true : false;
    App.config.iphone = /iPhone/i.test(navigator.userAgent) ? true : false;
    App.config.ios = /iPad|iPhone|iPod/i.test(navigator.userAgent) ? true : false;
    App.config.html5video = !!document.createElement("video").canPlayType;
    App.config.touchsupport = "ontouchstart" in document.documentElement;
    App.config.pages = [ "home", "day", "info", "rsvp" ];
    if (window.location.hash && App.config.pages.indexOf(window.location.hash.split("#")[1]) !== -1) {
        App.config.page = App.config.pages.indexOf(window.location.hash.split("#")[1]);
    } else {
        App.config.page = 0;
        window.location.hash = App.config.pages[App.config.page];
    }
    $(window).on("hashchange", function() {});
    router = {
        all: [ App.control, App.view ],
        page: [],
        article: []
    };
    modules = router.all;
    $.each(modules, function(index, module) {
        module.init.call();
    });
    setTimeout(function() {
        window.scrollTo(0, 0);
    }, 50);
};

$(document).ready(function() {
    App.initializer();
});

"use strict";

var App = App || {};

App.view = function() {
    var el;
    var init = function() {
        console.log("Initialising VIEW");
        el = {
            pages: $("section.page"),
            navigation: $("footer nav#navigation"),
            buttons: $(".btn")
        };
        el.buttons.on("click", function(evt) {
            if ($(this).data("click") === false) {
                return;
            }
            var name, id;
            if ($(this).attr("data-btn-info")) {
                name = $(this).attr("data-btn-info").split(" ")[0];
                id = $(this).attr("data-btn-info").split(" ")[1] || 0;
            } else {
                name = $(this).attr("class").split(" ")[0];
                id = el.buttons.index(this);
            }
            $(document).trigger("onClick", [ name, id ]);
        });
        showPage(App.config.page, function() {
            console.log("removed all delays!!");
            setTimeout(function() {
                el.pages.removeClass("delay3").addClass("time1");
            }, 3e3);
        });
    };
    var updateNav = function(_id, _callback) {
        el.navigation.find("li").removeClass("selected");
        el.navigation.find("li:eq(" + _id + ")").addClass("selected");
        if (_callback) {
            _callback();
        }
    };
    var showPage = function(_id, _callback) {
        var page;
        page = $(el.pages[_id]);
        el.pages.hide();
        page.show();
        updateNav(_id);
        if (_callback) {
            _callback();
        }
    };
    return {
        init: init,
        showPage: showPage
    };
}();