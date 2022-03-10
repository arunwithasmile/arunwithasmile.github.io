$(document).ready(function () {
    $.getJSON("media.json", loadMedia)
        .fail(function () {
            toast("An error has occurred.");
        });
});

function loadMedia(data) {
    for (section of data) {
        let sectionName = section.sectionName;
        let sectionHtml = $("#section").html();
        sectionHtml = sectionHtml.replace("{{name}}", sectionName);
        let sectionEle = $(sectionHtml);
        let songsHtml = "";
        for (media of section.media) {
            media.src = media.src || "youtube";
            switch(media.src){
                case 'youtube' : {
                    media.url = `https://www.youtube.com/watch?v=${media.key}`;
                    media.thumb = `https://img.youtube.com/vi/${media.key}/hqdefault.jpg`
                    break;
                }
            }
            let cardHtml = $("#card").html();
            cardHtml = cardHtml.replace("{{title}}", media.title);
            cardHtml = cardHtml.replace("{{url}}", media.url);
            cardHtml = cardHtml.replace("{{thumb}}", media.thumb);
            cardHtml = cardHtml.replace("{{zoom}}", media.zoom || "100%");
            sectionEle.append(cardHtml);
        }
        $('main').append(sectionEle);

    }
}

function toast(msg) {
    $('main').append($("#toast").html().replace("{{msg}}", msg));
    setTimeout(() => {
        $('.toast').addClass("ok");
        setTimeout(() => $(".toast-container").remove(),300);
    }, 5000);
}