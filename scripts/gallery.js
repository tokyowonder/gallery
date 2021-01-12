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

    console.log(imageNodes.length);

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
            image.outerHTML = "<li><div class='imgBox fade-in'><a href='" + getLink(image.src) + "' data-fancybox='gallery' data-caption='"+image.alt+"'><img src='" + image.src + "' data-src='" + getLink(image.src) + "' class='asyncImage' alt='" + image.alt + "' /></a><div class='caption'>" + image.alt + "<div></div></li>";
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
        afterShow: function(){

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


var share = "<div class='share'><span class='tweet sharelink'><a href='https://twitter.com/share?&amp;text={%description%}&amp;via=tokyowondershop&amp;url={%url%}'><i class='fab fa-twitter'></i><span class='text'>tweet</span></a></span><span class='shareBar'> | </span><span class='facebook sharelink'><a href='https://www.facebook.com/sharer.php?u={%url%}'><i class='fab fa-facebook-f'></i><span class='text'>share</span></a></span><span class='shareBar'> | </span><span class='pin sharelink'><a href='http://pinterest.com/pin/create/button/?url={%url%}&media={%image%}&description={%description%}' class='pin-it-button' count-layout='horizontal'><i class='fab fa-pinterest'></i><span class='text'>pin</span></a></span><span class='shareBar'> | </span><span class='mail sharelink'><a href='mailto:?subject={%description%}&amp;body={%description%}%0A{%url%}' tabindex='0'><i class='far fa-envelope'></i><span class='text'>mail</span></a></span><span class='shareBar'> | </span><span class='link sharelink'><a title='{%url%}' href='javascript:void(0);' onclick='copyLink(this);'><i class='fas fa-share-alt'></i><span class='text'>link</span></a></span></div>";

function createShareButtons() {
 if ($('div.itemLeft').length) {
    var title = encodeURI(document.querySelector('h2.itemTitle').innerText);
    var url = encodeURI(window.location.href);
    var image = encodeURI(imgSrcs[0]);
    var shareSpan = share;
    shareSpan = shareSpan.replace(/\{%description%\}/g,title);
    shareSpan = shareSpan.replace(/\{%url%\}/g,url);
    shareSpan = shareSpan.replace(/\{%image%\}/g,image);
    $(shareSpan).appendTo( $( ".itemLeft" ) );
 };
}

function formatLabels() {
 if ($('div.labels').length) {
        var labels = document.querySelector('div.labels');
        if (labels.querySelectorAll('a').length > 0) {
            var label = labels.getElementsByTagName("a");
            for (var i = 0; i < label.length; i++) {
                var patt = new RegExp(/^([\@\#\$]|(?:\&amp;))([A-Za-z0-9\-]+)$/);
                labelText = label[i].innerHTML;
                if (patt.test(labelText)) {
                    console.log(label[i].href + " " + label[i].innerHTML);
                    // label[i].innerHTML = labelText.replace(/^([\@\#\$]|(?:\&amp;))([A-Za-z0-9\-]+)$/,"$2");
                    if (labelText.startsWith('@')) { label[i].innerHTML = labelText.replace(/^(\@)([A-Za-z0-9\-]+)$/,"period: $2"); }
                    if (labelText.startsWith('&')) { label[i].innerHTML = labelText.replace(/^(\&amp;)([A-Za-z0-9\-]+)$/,"material: $2"); }
                    if (labelText.startsWith('#')) { label[i].innerHTML = labelText.replace(/^(\#)([A-Za-z0-9\-]+)$/,"technique: $2"); }
                } else {
                    // label[i].remove();
                    label[i].outerHTML = "<div class='hide'>" + label[i].outerHTML + "</div>";
                }
                labels.classList.remove("hide");
            }
        }
 };
}

