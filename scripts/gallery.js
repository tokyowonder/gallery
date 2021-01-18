//console.log = function() {}

/* id = "photo-slider" */
document.onreadystatechange = function () {
    if (document.readyState === 'interactive') {
        if (document.querySelectorAll('img').length > 0) {
            if (document.body.contains(document.getElementById("photo-slider"))) {
                img_find().forEach(element => console.log(element));
            }
        }
    }

    // list collapse/uncollapse
    $('.level2').hide();

    $('.level1').click(function () {
        if (this.classList.contains("show")) {
            $(this).removeClass("show");
        } else {
            $(this).addClass("show");
        }
        $('.level2').slideUp();
        $(this).find('ul').slideToggle();
    });
}

var imgSrcs = [];

function img_find() {
    var post = document.querySelector('.item');
    var imgs = post.getElementsByTagName("img");
    var imageNodes = []

    for (var i = 0; i < imgs.length; i++) {
        imgSrcs.push(getLink(imgs[i].src));
        imageNodes.push(imgs[i]);
    }

    // console.log(imageNodes.length);

    // buid slider
    if (document.body.contains(document.getElementById("photo-slider"))) {
        let list = document.createElement('ul');
        var att = document.createAttribute("id");
        att.value = "slideImg";
        list.setAttributeNode(att);
        document.querySelectorAll('#gallery .separator').forEach(e => e.remove());
        console.log("building photo-slider");
        imageNodes.forEach(element => list.append(element));
        var target = document.getElementById("photo-slider");
        target.append(list);

        wrapImages();
        loadHighQualityArt();
    }
    return imgSrcs;
}

function wrapImages() {
    var images = document.querySelectorAll(".item img");

    for (var i = 0; i < images.length; i++) {
        var image = images[i];
        if (image.alt.trim().length > 0) {
            image.outerHTML = "<li><div class='imgBox fade-in'><a href='" + getLink(image.src) + "' data-fancybox='gallery' data-caption='" + image.alt + "'><img src='" + image.src + "' data-src='" + getLink(image.src) + "' class='asyncImage' alt='" + image.alt + "' /></a><div class='caption'>" + image.alt + "<div></div></li>";
        } else {
            image.outerHTML = "<li><div class='imgBox fade-in'><a href='" + getLink(image.src) + "' data-fancybox='gallery'><img src='" + image.src + "' data-src='" + getLink(image.src) + "' class='asyncImage' /></a></div></li>";
        }
    }
}

function loadHighQualityArt() {
    'use strict';
    // Page is loaded
    console.log("Load hi-res images");
    const objects = document.getElementsByClassName('asyncImage');
    Array.from(objects).map((item) => {
        // Start loading image
        const img = new Image();
        img.src = item.dataset.src;
        // src="resized-optimized-image.jpg" data-src="high-res-image.jpg"
        // Once image is loaded replace the src of the HTML element
        img.onload = () => {
            item.classList.remove('asyncImage');
            return item.nodeName === 'IMG' ?
                item.src = item.dataset.src :
                item.style.backgroundImage = 'url(${item.dataset.src})';
        };
    });
}


/* blogger specific links */
function getLink(imageSrc) {
    var link = imageSrc.replace(/(^.+?\/)([a-zA-Z0-9\-]+?)(\/[^\/]+?$)/g, "$1s1600$3");
    return link
}


$(document).ready(function () {
    $('[data-fancybox]:not(.slick-cloned)').fancybox({
        afterShow: function () {

        },
        'loop': true
    });
    if (document.body.contains(document.getElementById("homepage"))) {
        loadHighQualityArt();
    };
});

$(document).ready(function () {
    createShareButtons();
    $('#slideImg').not('.slick-initialized').slick({
        dots: true,
        centerMode: true,
        autoplay: true,
        infinite: true,
        slidesToShow: 1,
        variableWidth: true,
        adaptiveHeight: true,
        cssEase: 'ease-out',
        slidesToScroll: 1
    });
    formatLabels();
});

$(document).ready(function () {
    handleCollections();
    organizeLabels();
});

var share = "<div class='share'><span class='tweet sharelink'><a href='https://twitter.com/share?&amp;text={%description%}&amp;via=tokyowondershop&amp;url={%url%}'><i class='fab fa-twitter'></i><span class='text'>tweet</span></a></span><span class='shareBar'> | </span><span class='facebook sharelink'><a href='https://www.facebook.com/sharer.php?u={%url%}'><i class='fab fa-facebook-f'></i><span class='text'>share</span></a></span><span class='shareBar'> | </span><span class='pin sharelink'><a href='http://pinterest.com/pin/create/button/?url={%url%}&media={%image%}&description={%description%}' class='pin-it-button' count-layout='horizontal'><i class='fab fa-pinterest'></i><span class='text'>pin</span></a></span><span class='shareBar'> | </span><span class='mail sharelink'><a href='mailto:?subject={%description%}&amp;body={%description%}%0A{%url%}' tabindex='0'><i class='far fa-envelope'></i><span class='text'>mail</span></a></span><span class='shareBar'> | </span><span class='link sharelink'><a title='{%url%}' href='javascript:void(0);' onclick='copyLink(this);'><i class='fas fa-share-alt'></i><span class='text'>link</span></a></span></div>";

function createShareButtons() {
    if ($('body.item-view').length && $('div.itemLeft').length) {
        var title = encodeURI(document.querySelector('h2.itemTitle').innerText);
        var url = encodeURI(window.location.href);
        var image = encodeURI(imgSrcs[0]);
        var shareSpan = share;
        shareSpan = shareSpan.replace(/\{%description%\}/g, title);
        shareSpan = shareSpan.replace(/\{%url%\}/g, url);
        shareSpan = shareSpan.replace(/\{%image%\}/g, image);
        $(shareSpan).appendTo($(".itemLeft"));
    };
}

var _categories = [];

function formatLabels() {
    if ($('body.item-view').length && $('div.labels').length) {
        var labels = document.querySelector('div.labels');
        if (labels.querySelectorAll('a').length > 0) {
            var _periods = [];
            var _materials = [];
            var _techniques = [];
            var label = labels.getElementsByTagName("a");
            for (var i = 0; i < label.length; i++) {
                var patt = new RegExp(/^([\@\#\$]|(?:\&amp;))([A-Za-z0-9\-]+)$/);
                labelText = label[i].innerHTML;
                if (patt.test(labelText)) {
                    // console.log(label[i].href + " " + label[i].innerHTML);
                    // label[i].innerHTML = labelText.replace(/^([\@\#\$]|(?:\&amp;))([A-Za-z0-9\-]+)$/,"$2");
                    if (labelText.startsWith('@')) {
                        _periods.push("<a href='" + label[i].href + "'>" + labelText.replace(/^(\@)([A-Za-z0-9\-]+)$/, "$2") + "</a>");
                    }
                    if (labelText.startsWith('&')) {
                        _materials.push("<a href='" + label[i].href + "'>" + labelText.replace(/^(\&amp;)([A-Za-z0-9\-]+)$/, "$2") + "</a>");
                    }
                    if (labelText.startsWith('#')) {
                        _techniques.push("<a href='" + label[i].href + "'>" + labelText.replace(/^(\#)([A-Za-z0-9\-]+)$/, "$2") + "</a>");
                    }
                } else {
                    // label[i].remove();
                    _categories.push(labelText);
                }
            }
            _labels = ""
            if (!_periods.length != true) {
                _labels = "<div class='label period'>period: " + _periods.join('-') + "</div>";
            }
            if (!_materials.length != true) {
                _labels = _labels + "<div class='label material'>material: " + _materials.join(', ') + "</div>";
            }
            if (!_techniques.length != true) {
                _labels = _labels + "<div class='label technique'>technique: " + _techniques.join(', ') + "</div>";
            }
            labels.innerHTML = _labels
            labels.classList.remove("hide");

        }
    };
}


function handleCollections() {

    if (window.location.pathname.length == 1) {
        console.log("homepage");
        sessionStorage.removeItem("collection");
        sessionStorage.removeItem("collectionTitle");
    }


    if (window.location.pathname.startsWith('/search')) {

        sessionStorage.removeItem("collection");
        sessionStorage.removeItem("collectionTitle");

        var collection = [];
        var title
        if (window.location.href.includes("/label/")) {
            title = decodeURI(window.location.href.replace(/^(?:.+\/label\/)([^\/]*)$/, "$1"));
        } else {
            title = decodeURI(window.location.href.replace(/^(?:.+\/search\?q=)([^\/]*)$/, "$1"));
        }

        var items = document.querySelectorAll('.homepage article a.item-thumbnail');
        for (var i = 0; i < items.length; i++) {
            if (title.startsWith("!") && window.location.href.includes("/label/")) {
                items[i].href = items[i].href + "?collection=" + encodeURI(title.substring(1)) + "&item=" + i;
            } else if (window.location.href.includes("/label/")) {
                items[i].href = items[i].href + "?category=" + encodeURI(title) + "&item=" + i;
            } else {
                items[i].href = items[i].href + "?search=" + encodeURI(title) + "&item=" + i;
            }
            console.log(i + ' ' + items[i].href + ' ' + items[i].dataset.title);
            let item = {
                "title": items[i].dataset.title,
                "url": items[i].href
            };
            collection.push(item);
        }

        console.log("collection created");
        sessionStorage.setItem("collectionTitle", title);
        sessionStorage.setItem("collection", JSON.stringify(collection));

    }

    if (sessionStorage.getItem("collection") !== null) {
        console.log(sessionStorage.getItem("collectionTitle"));
        console.log("Part of collection");
    }


}


function organizeLabels() {
    console.log("organizing labels ...");

    var labels = document.querySelector('div.list-label-widget-content');
    if (labels.querySelectorAll('li').length > 0) {
        var _periods = [];
        var _materials = [];
        var _techniques = [];
        var _collections = [];
        var _categories = [];
        var label = labels.getElementsByTagName("a");
        for (var i = 0; i < label.length; i++) {
            var patt = new RegExp(/^([\@\#!]|(?:\:{1,3})|(?:\&amp;))([A-Za-z0-9\- ]+)$/);
            labelText = label[i].innerHTML;
            if (patt.test(labelText)) {
                // console.log(" " + label[i].innerHTML);
                // label[i].innerHTML = labelText.replace(/^([\@\#\$!]|(?:\:{1,3})|(?:\&amp;))([A-Za-z0-9\- ]+)$/,"$2");
                if (labelText.startsWith('@')) {
                    _periods.push("<a href='" + label[i].href + "'>" + labelText.replace(/^(\@)([A-Za-z0-9\-]+)$/, "$2") + "</a>");
                }
                if (labelText.startsWith('&')) {
                    _materials.push("<a href='" + label[i].href + "'>" + labelText.replace(/^(\&amp;)([A-Za-z0-9\-]+)$/, "$2") + "</a>");
                }
                if (labelText.startsWith('#')) {
                    _techniques.push("<a href='" + label[i].href + "'>" + labelText.replace(/^(\#)([A-Za-z0-9\-]+)$/, "$2") + "</a>");
                }
                if (labelText.startsWith('!')) {
                    _collections.push("<a href='" + label[i].href + "'>" + labelText.replace(/^(!)([A-Za-z0-9\- ]+)$/, "$2") + "</a>");
                }
                if (labelText.startsWith('::')) {
                    _categories.push(labelText.replace(/^(?:\:{1,3})([A-Za-z0-9\-]+) ([A-Za-z0-9\-]+)$/, "$2|$1") + "<a href='" + label[i].href + "'>" + labelText.replace(/^(?:\:{1,3})([A-Za-z0-9\-]+) ([A-Za-z0-9\-]+)$/, "$1") + "</a>");
                } else if (labelText.startsWith(':')) {
                    _categories.push(labelText.replace(/^(\:{1,3})([A-Za-z0-9\- ]+)$/, "$2") + "<a href='" + label[i].href + "'>" + labelText.replace(/^(\:{1,3})([A-Za-z0-9\- ]+)$/, "$2") + "</a>");
                }
            } else {
                // label[i].remove();
                //_labels.push(labelText);
            }
        }

        console.log("creating lists ...");
        if (!_collections.length != true) {
            for (const s of _collections) {}
        }
        if (!_categories.length != true) {
            var catList = "<ul>"
            len = _categories.length;
            for (i = 0; i < len; ++i) {
                s = _categories[i];
                if (s.indexOf("|") === -1) {
                    level1 = s.substring(0, s.indexOf("<"));
                    priority = 99;
                    switch (level1.toLowerCase()) {
                        case "kimono":
                            priority = 1;
                            break;
                        case "haori":
                            priority = 10;
                            break;
                        case "nagajuban":
                            priority = 9;
                            break;
                        case "obi":
                            priority = 30;
                            break;
                        default:
                            priority = 99;
                    }
                    // var catList = catList + "<li data-priority='" + priority + "' class='level1'>" + s.substring(s.indexOf("<"));
                    var catList = catList + "<li data-priority='" + priority + "' class='level1'>";
                    tmpList = ""
                    for (j = 0; j < len; ++j) {
                        t = _categories[j];
                        if (t.startsWith(level1 + "|")) {
                            level2 = t.substring(t.indexOf("|") + 1, t.indexOf("<"));
                            tmpList = tmpList + "<li>" + t.substring(t.indexOf("<")) + "</li>";
                        }
                    }
                    if (tmpList.length > 0) {
                        catList = catList + level1 + "<ul class='level2'><li>" + s.substring(s.indexOf("<"),s.indexOf(">")+1) + "All " + level1 + "</a></li>" + tmpList + "</ul>" + "</li>";
                    } else {
                        catList = catList + s.substring(s.indexOf("<")) + "</li>";
                    }
                }
            }
            catList = catList + "</ul>";
            var list = document.createElement('div');
            list.innerHTML = catList;
            console.log("sorting categories ...");
            labels.outerHTML = sortList(list).innerHTML;
        }
    }

}

function sortList(list) {
    console.log("sorting ...");
    var i, switching, b, shouldSwitch;
    switching = true;
    while (switching) {
        switching = false;
        b = list.querySelectorAll("li.level1");
        for (i = 0; i < (b.length - 1); i++) {
            shouldSwitch = false;
            if (Number(b[i].dataset.priority) > Number(b[i + 1].dataset.priority)) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            b[i].parentNode.insertBefore(b[i + 1], b[i]);
            switching = true;
        }
    }
    return list;
}
