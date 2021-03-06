var root = 'https://jsonplaceholder.typicode.com';
var imagesCount = 0;
var prev; 

$(document).ajaxStart(function(){
    $("#waitImg").css("display", "block");
    if(imagesCount == 0)
        $('#wholePanel').css("display", "none");
});

$(document).ajaxComplete(function(){
    $("#waitImg").css("display", "none");
    $('#wholePanel').css("display", "block");
    
});


$(document).ajaxError(function(){
    $("#waitImg").css("display", "none");
    $('#messageComplete').html("Internal Server Error");
});


$(function () {
    getRecentImages(imagesCount);
    $("#searchText").jBox('Mouse', {
        theme: 'TooltipDark',
        content: "<span class = 'hover-title'> WARNING: Search is CASE sensitive! </span>",
    });
    $(".modalImageContent").on('load', function(){
        document.getElementsByClassName("modalImageContentContainer")[0].style.height = this.height;
        document.getElementsByClassName("modalImageContentContainer")[0].style.width = this.width;
    });
})

function getAlbumName (window, id) {
    $.ajax({
      url: root + '/albums',
      method: 'GET'
    }).then(function(data) {
        $(window).append("<span id = 'albumIcon' class = 'modalIcon'> </span>");
        window.innerHTML += "<a href = single-album.html?albumId=" + (id) +" >" + data[id-1].title + "</a><br>";
        getNameUsernameWithLink(window, data[id-1].userId);
    });
}

function filterImages () {
    var count = 1;
    var value = $("#searchText").val();
    count = 0;
    
    $('.imagePost').each(function() {
        $(this).unmark();
        if($(this).attr("data-value").includes(value)) {
            count++;
            $(this).show();
        } else {
            $(this).hide();
        }
    })
    
    if(prev != null)
        prev.close();
    
    if(value != "") 
        notifyImages("<span class = matches-notification> Search results for " + value + " : " + count + "/" + imagesCount + " </span>");
}


function notifyImages (value) {
    prev = new jBox('Notice', {
        content: value,
        color: 'black',
        fontFamily: 'Lato',
        autoClose: false,
        attributes: {
            x: 'right',
            y: 'bottom'
        }
    });
}

function getNameUsernameWithLink (window, id) {
    $.ajax({
      url: root + '/users',
      method: 'GET'
    }).then(function(data) {
        var name = document.createElement('a');
        var username = document.createElement('a');
        
        $(name).attr('href', 'profile.html?userId=' + data[id-1].id);
        $(username).attr('href', 'profile.html?userId=' + data[id-1].id);
        
         name.innerHTML = data[id-1].name;
         username.innerHTML = data[id-1].username;
        
        $(window).append("<span id = 'userIcon' class = 'modalIcon'> </span>");
        $(window).append(name);
        $(window).append('<br>');
        $(window).append('@ ');
        $(window).append(username);
    });
}

function getRecentImages (start) {
    $.ajax({
      url: root + '/photos',
      method: 'GET'
    }).then(function(data) {
        if(imagesCount != data.length)
        {
            for(i = data.length - start - 1; i > (data.length - start - 11); i--)
            {
                var imagePost = document.createElement("div");
                var imageContent = document.createElement("div");
                var rand = (Math.random() * 10) - 5;
                var hoverText = "";
                $(imagePost).attr("value", data[i].id)
                
                $(imagePost).addClass("imagePost");
                $(imageContent).addClass("imageContent");
                
                $(imageContent).css("background-image", "url(" + data[i].thumbnailUrl + ")");  
                
                $(imagePost).attr("data-value", data[i].title); 
                $(imagePost).rotate(rand);
                
                $('#imageContainer').append(imagePost);
                $(imagePost).append(imageContent);
                
                $(imagePost).click(function () {
                    var imgsrc = data[$(this).attr("value") - 1].url;
                    $(".modalImageContent").attr("src", imgsrc);
                    document.getElementsByClassName("modalOverlay")[0].innerHTML = "<span id = 'titleIcon' class = 'modalIcon'> </span>";
                    document.getElementsByClassName("modalOverlay")[0].innerHTML += "<span class = 'titleImage'> " + data[$(this).attr("value") - 1].title + "</span><br>";
                    getAlbumName(document.getElementsByClassName("modalOverlay")[0], data[$(this).attr("value") - 1].albumId);
                    document.getElementsByClassName("modalImage")[0].style.display = "block";
                    
                    var value = $("#searchText").val();
                    
                    var options = {};
                    options['separateWordSearch'] = false;

                    if(value != "")
                        $('.titleImage').mark(value, options);
                })
                
               
                
                $('.closeModal').click(function () {
                    document.getElementsByClassName("modalImage")[0].style.display = "none";
                })
                
                $(document).keydown(function(event) {
                    if(event.keyCode == 27) {
                        document.getElementsByClassName("modalImage")[0].style.display = "none";
                    }
                })
                
                 $(imagePost).jBox('Mouse', {
                    theme: 'TooltipDark',
                    content: "<span class = 'hover-title'> " + data[i].title + "</span> <br>" + " <span class = 'hover-more'> Click to view more details </span>",
                });
                
                imagesCount++;
            }
            
            if(imagesCount == data.length)
                $('#moreMessage').hide();
        } else {
            $('#moreMessage').hide();
        }
    });
}