
$(document).ready(function () {
  $('.search-input').focus();

  /*** trim long titles ***/
  function trimStr(str) {
    if (str.length > 20) {
      return str.slice(0, 19) + '...';
    }
    return str;
  }

var submit_search = function () {

  /*** API URL with CORS proxy ***/
  var url = 'https://cors-anywhere.herokuapp.com/https://api-endpoint.igdb.com/games/?search=' + $('.search-input').val() + '&fields=id,name,rating,genres,platforms,videos,cover,artworks';
  var genre_id;

  /*** Game Data ***/
  $.ajax({
    url: url,
    type: 'GET',
    headers: {
      'user-key': '6bda01ab845a8f5f8e3ae970cbb95919',
      Accept: 'application/json'
    }
  }).done(function (response) {
    console.log(response);
    $(".game-output").empty();
    for (var i = 0; i < response.length; i++) {
        //store in objects here.
        $(".game-output").append('<div class="game"><img src="http:' + response[i].cover.url + '" alt="game cover art">' + '<p class="game-title">' + trimStr(response[i].name) + '</p>' + '<p class="game-genre">' + response[i].genres + '</p>' + '</div>');
      genre_id = response[i].genres;
    }
    //display first object here
    //&(".game-cover").attr("src", games[currentSelection].coverUrl);
    console.log(genre_id);
  });
}

  $('.search-submit').on('click', submit_search);
  $('.search-input').keydown(function(e) {
    console.log(e);
    if(e.keyCode == 13)
    {
      submit_search();
    }
  });
})
