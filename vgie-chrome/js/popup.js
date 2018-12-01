
$(document).ready(function () {
  /*** Page number of games ***/
  let game_num = 0;

  var game_veiwing_mode = false;
  var gameArrIndex = 0;

  let page_count = 0;
  let page_num = 1;
  let page_items_start = 0;
  let page_items_end = 4;

  /*** Store Game Objects ***/
  var game_objects = [];

  $('.search-input').focus();

  /*** trim long titles ***/
  function trimStr(str, beginTrim, trimLngth) {
    if(str.length > beginTrim) {
      return str.slice(0, trimLngth) + '...';
    }
    return str;
  }

var submit_search = function () {

  /*** API URL with CORS proxy ***/
  var url = 'https://cors-anywhere.herokuapp.com/https://api-endpoint.igdb.com/games/?search=' + $('.search-input').val() + '&fields=id,name,summary,rating,genres,platforms,screenshots,videos,cover,esrb,artworks&filter[rating][gte]=70&filter[version_parent][not_exists]=1';

  /*** Game Data ***/
  $.ajax({
    url: url,
    type: 'GET',
    headers: {
      'user-key': '6bda01ab845a8f5f8e3ae970cbb95919',
      Accept: 'application/json'
    }
  }).then(function (response) {
    game_objects = [];
    for(var i = 0; i < response.length; i++) {

      function getEsrbRating(val) {
        if(response[i].hasOwnProperty('esrb')) {
           if(response[i].esrb.hasOwnProperty('rating')) {
             switch (response[i].esrb.rating) {
               case 1:
                 return 'Rated: RP';
                 break;
               case 2:
                 return 'Rated: EC';
                 break;
               case 3:
                 return 'Rated: E';
                 break;
               case 4:
                 return 'Rated: E10+';
                 break;
               case 5:
                 return 'Rated: T';
                 break;
               case 6:
                 return 'Rated: M';
                 break;
               case 5:
                 return 'Rated: AO';
                 break;
               default:
                 return 'Rated: unrated';
             }
           }
        } else {
          return 'Rated: unrated';
        }
      }

      game_objects.push({
        title: response[i].name,
        cover: response[i].hasOwnProperty('cover') ? 'http:' + response[i].cover.url : 'images/noimage.png',
        rating: response[i].hasOwnProperty('rating') ? response[i].rating : 'Not Rated',
        esrb: response[i].hasOwnProperty('esrb') ? (response[i].esrb.hasOwnProperty('rating') ? getEsrbRating(response[i].esrb.rating) : 'Rated: unrated') : 'Rated: unrated',
        summary: typeof response[i].summary !== 'undefined' ? 'Description: ' + response[i].summary : 'Description: This game has no description.'
      });

      if((game_objects.length % 4) > 0)
        page_count = Math.floor((game_objects.length / 4) + 1);
      else
        page_count = game_objects.length / 4;
    }

  }).done(function (response) {
    console.log(response);
    $(".game-output").empty();

    page_num = 1;
    page_items_start = 0;
    page_items_end = 4;
    game_num = 0;
    game_veiwing_mode = false;

    for (var i = 0; i < 4; i++) {
      //store in objects here.

      if(i < game_objects.length) {
        $(".game-output").append('<div class="game">' +
        '<img data-game-num="' + game_num + '"class="games" src="' +
        game_objects[i].cover + '" alt="game cover art" width="90" height="90">' +
        '<p class="game-title">' + game_objects[i].title + '</p></div>');

        game_num++;
      } else {
        return;
      }

    }

  });
}

  function getPageNum(n) {
    if(n % 4 === 0 && n > 1) {
      return n / 4 + 1;
    } else {
      if(n > 0) {
        return (Math.ceil(n/4.0) * 4) / 4;
      } else if( n < 0){
          return Math.floor(n/4.0) * 4;
      } else {
           return 1;
      }
    }
  }

  /*** GO TO THE NEXT GAME IN GAME INFO MENU ***/
  function nextGame() {
    //gameArrIndex++;

    $('.game-cover').attr('src', game_objects[gameArrIndex].cover.replace('t_thumb', 't_cover_big'));

    $(".game-output").empty();

    $('.game-output').append('<div class="game">' +
    '<p class="game-title">' + game_objects[gameArrIndex].title + '</p>' +
    '<p class="game-esrb">' + game_objects[gameArrIndex].esrb + '</p>' +
    '<p class="game-reviews">Review: ' + Math.floor(game_objects[gameArrIndex].rating) + '%</p>' +
    '<p class="game-summary">' + game_objects[gameArrIndex].summary + '</p>' + '</div>');
  }

  /*** GO TO THE PREVIOUS GAME IN GAME INFO MENU ***/
  function prevGame() {
    //gameArrIndex--;

    $('.game-cover').attr('src', game_objects[gameArrIndex].cover.replace('t_thumb', 't_cover_big'));

    $(".game-output").empty();

    $('.game-output').append('<div class="game">' +
    '<p class="game-title">' + game_objects[gameArrIndex].title + '</p>' +
    '<p class="game-esrb">' + game_objects[gameArrIndex].esrb + '</p>' +
    '<p class="game-reviews">Review: ' + Math.floor(game_objects[gameArrIndex].rating) + '%</p>' +
    '<p class="game-summary">' + game_objects[gameArrIndex].summary + '</p>' + '</div>');
  }

  /*** GO TO THE NEXT ROW IN GAME SELECTION MENU ***/
  function nextRow() {

    if(page_num < page_count) {
      page_items_start += 4
      page_items_end += 4;

      var curArr = game_objects.slice(page_items_start, page_items_end);

      $(".game-output").empty();

      for (var i = 0; i < curArr.length; i++) {

        $(".game-output").append('<div class="game">' +
        '<img data-game-num="' + game_num + '"class="games" src="' +
        curArr[i].cover + '" alt="game cover art" width="90" height="90">' +
        '<p class="game-title">' +  curArr[i].title + '</p></div>');

        game_num >= game_objects.length-1 ? game_num : game_num++;

      }

      page_num++;

    }
  }

  /*** RETURN TO PREVIOUS ROW IN GAME SELECTION MENU ***/
  function prevRow() {

    if(page_num > 1) {

      page_items_start -= 4;
      page_items_end -= 4;
      game_num = ((page_num - 1) * 4) - 4;

      var curArr = game_objects.slice(page_items_start, page_items_end);

      $(".game-output").empty();

      for (var i = 0; i < curArr.length; i++) {

        $(".game-output").append('<div class="game">' +
        '<img data-game-num="' + game_num + '"class="games" src="' +
        curArr[i].cover + '" alt="game cover art" width="90" height="90">' +
        '<p class="game-title">' +  curArr[i].title + '</p></div>');

        game_num++;

      }

      page_num--;

    }
  }

    /*** VIEW GAME INFORMATION MENU ***/
  $(document).on('click', '.games', function(){
    $('.game-cover').attr('src', game_objects[$(this).data('game-num')].cover.replace('t_thumb', 't_cover_big'));

    $(".game-output").empty();

    $('.game-output').append('<div class="game">' +
    '<p class="game-title">' + game_objects[$(this).data('game-num')].title + '</p>' +
    '<p class="game-esrb">' + game_objects[$(this).data('game-num')].esrb + '</p>' +
    '<p class="game-reviews">Review: ' + Math.floor(game_objects[$(this).data('game-num')].rating) + '%</p>' +
    '<p class="game-summary">' + game_objects[$(this).data('game-num')].summary + '</p>' + '</div>');

    gameArrIndex = $(this).data('game-num');
    game_veiwing_mode = true;
  })

  /*** RETURN TO GAME SELECTION MENU ***/
  $('.game-cover-div').click(function(){
    if(game_veiwing_mode) {
      //page_num = getPageNum(gameArrIndex);
      game_num = (page_num * 4) - 4;

      var curArr = game_objects.slice(page_items_start, page_items_end);

      $('.game_cover').attr('src', 'images/noimage.png');
      $(".game-output").empty();

      for (var i = 0; i < curArr.length; i++) {

        $(".game-output").append('<div class="game">' +
        '<img data-game-num="' + game_num + '"class="games" src="' +
        curArr[i].cover + '" alt="game cover art" width="90" height="90">' +
        '<p class="game-title">' +  curArr[i].title + '</p></div>');

        game_num++;
        game_veiwing_mode = false;
      }
    }
  })


  $('.next-submit').click(function(){
    if(game_veiwing_mode) {
      if(gameArrIndex < game_objects.length-1) {
        gameArrIndex >= game_objects.length-1 ? game_objects.length-1 : gameArrIndex++;
        nextGame();
      }
    } else {
      nextRow();
    }
  })

  $('.previous-submit').click(function(){
    if(game_veiwing_mode) {
      gameArrIndex <= 0 ? 0 : gameArrIndex--;
      prevGame();
    } else {
      prevRow();
    }
  })

  $('.search-submit').on('click', submit_search);
  $('.search-input').keydown(function(e) {
    console.log(e);
    if(e.keyCode == 13)
    {
      submit_search();
    }
  });
})
