var root = 'https://jsonplaceholder.typicode.com';
var postsCount = 0;


$(function () {
    getRecentPosts(postsCount);
})

function filterPosts () {
    var value = $("#searchText").val();
    value = value.replace(/\s/g,'');
    var count = 0;
    $('.postTitle').each(function(){
        $(this).unmark();
        if(this.innerHTML.includes(value)) {
            $(this).parent().show();
            $(this).mark(value);
            count++;
        } else {
            $(this).parent().hide();
        }
    });

    $('.contentPost').each(function(){
        $(this).unmark();
        if(this.innerHTML.includes(value)) {
            if(!$(this).is(":visible"))
                count++;
            $(this).parent().parent().show();
            $(this).mark(value);
        } else {
            if(!$(this).is(":visible")) {
                $(this).parent().parent().hide();
            }
        }
    });

    if(value != "") 
        notifyPosts("<span class = matches-notification> Search results for " + value + " : " + count + "/" + postsCount + " </span>");
}

function notifyPosts (value) {
    new jBox('Notice', {
        content: value,
        color: 'black',
        fontFamily: 'Lato',
        autoClose: 3000,
        attributes: {
            x: 'right',
            y: 'bottom'
        }
    });
}

function getRecentPosts (start) {
    $.ajax({
      url: root + '/posts',
      method: 'GET'
    }).then(function(data) {
        if(data.length != start) {
            for(i = data.length - start - 1; i > (data.length - start - 11); i--) {
                var post = document.createElement("div");
                var picture = document.createElement("div");
                var pTitle = document.createElement("p");
                var contentPost = document.createElement("span");
                var contentArea = document.createElement("div");
                var name = document.createElement("a");
                var username = document.createElement("a");
                
                $(post).addClass("post");
                $(picture).addClass("picture");
                $(pTitle).addClass("postTitle");
                $(contentPost).addClass("contentPost");
                $(contentArea).addClass("contentArea");
                $(name).addClass("name");
                $(username).addClass("username");
                
                $(post).append(picture);
                $(post).append(pTitle);
                $(post).append(name);
                $(post).append(username);
                $(post).append(contentArea);
                $(contentArea).append(contentPost);
                $("#postContainer").append(post);
                
                $(name).attr('href', 'profile.html?userId=' + data[i].userId);
                $(username).attr('href', 'profile.html?userId=' + data[i].userId);
                contentPost.innerHTML = data[i].body;
                pTitle.innerHTML = data[i].title;
                setName(data[i].userId, name);
                setUsername(data[i].userId, username);
            }
            
            postsCount = data.length - i - 1;
            
            if(postsCount == data.length)
                $('#moreMessage').hide();
            
            filterPosts();
        } else {
            $('#moreMessage').hide();
        }
      
    });
}

function setName(id, name)
{
    $.ajax({
      url: root + '/users',
      method: 'GET'
    }).then(function(data) {
        name.innerHTML = data[id-1].name;
    });
}

function setUsername(id, username)
{
    $.ajax({
      url: root + '/users',
      method: 'GET'
    }).then(function(data) {
        username.innerHTML = "@" + data[id-1].username; 
    });
}
