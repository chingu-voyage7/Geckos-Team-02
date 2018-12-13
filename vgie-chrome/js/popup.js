
$(document).ready(function () {
  /*** Page number of games ***/
  let game_num = 0;

  let game_veiwing_mode = false;
  let gameArrIndex = 0;

  let page_count = 0;
  let page_num = 1;
  let page_items_start = 0;
  let page_items_end = 4;

  /*** Store Game Objects ***/
  let game_objects = [];

  $('.search-input').focus();

  /*** trim long titles ***/
  trimStr = (str, beginTrim, trimLngth) => {
    if (str.length > beginTrim) {
      return str.slice(0, trimLngth) + '...';
    }
    return str;
  }

  let submit_search = () => {

  /*** API URL with CORS proxy ***/
  const url = 'https://cors-anywhere.herokuapp.com/https://api-endpoint.igdb.com/games/?search=' + $('.search-input').val() + '&fields=id,name,summary,rating,genres,platforms,screenshots,videos,cover,esrb,artworks&filter[rating][gte]=70&filter[version_parent][not_exists]=1&limit=20';

    /*** Game Data ***/
    $.ajax({
      url: url,
      type: 'GET',
      headers: {
        'user-key': '6bda01ab845a8f5f8e3ae970cbb95919',
        Accept: 'application/json'
      }
    }).then((response) => {
      game_objects = [];
      for (let i = 0; i < response.length; i++) {

        getEsrbRating = (val) => {
          if (response[i].hasOwnProperty('esrb')) {
            if (response[i].esrb.hasOwnProperty('rating')) {
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
          summary: typeof response[i].summary !== 'undefined' ? 'Description: ' + response[i].summary : 'Description: This game has no description.',
          media: {
            screenshots: response[i].hasOwnProperty('screenshots') ? response[i].screenshots : null,
            videos: response[i].hasOwnProperty('videos') ? response[i].videos : null
          }

        });

        if ((game_objects.length % 4) > 0)
          page_count = Math.floor((game_objects.length / 4) + 1);
        else
          page_count = game_objects.length / 4;
      }

      countPages(game_objects.length);
    }

  }).done((response) => {
    console.log(response);

    initPage();
    addGamesToPage(4, game_objects);
  });
}

  /*** INIT PAGE ***/
  initPage = () => {
    page_num = 1;
    page_items_start = 0;
    page_items_end = 4;
    game_num = 0;
    game_veiwing_mode = false;
  }

  /*** RETURN THE PAGE NUMBER ***/
  getPageNum = (n) => {
    if(n % 4 === 0 && n > 1) {
      return n / 4 + 1;
    } else {
      if (n > 0) {
        return (Math.ceil(n / 4.0) * 4) / 4;
      } else if (n < 0) {
        return Math.floor(n / 4.0) * 4;
      } else {
        return 1;
      }
    }
  }
  
  /*** SET THE NUMBER OF PAGES ***/
  countPages = (n) => {
    if((n % 4) > 0)
      page_count = Math.floor((n / 4) + 1);
    else
      page_count = n / 4;
  }

  /*** ADD NUMBER OF GAMES TO PAGE ***/
  addGamesToPage = (num, arr) => {
    $(".game-output").empty();
    for (var i = 0; i < num; i++) {
      if(i < game_objects.length) {
        $(".game-output").append('<div class="game">' +
        '<img data-game-num="' + game_num + '"class="games" src="' +
        arr[i].cover + '" alt="game cover art" width="90" height="90">' +
        '<p class="game-title">' + arr[i].title + '</p></div>');
        game_num >= game_objects.length-1 ? game_num : game_num++;
      } else {
        return;
      }
    }
  }

  /*** DISPLAY SELECTED GAME INFORMATION ***/
  displayGameInfo = (n) => {
    $('.game-cover').attr('src', game_objects[n].cover.replace('t_thumb', 't_cover_big'));

    $(".game-output").empty();

    $('.game-output').append('<div class="game">' +

    '<p class="game-title">' + game_objects[n].title + '</p>' +
    '<p class="game-esrb">' + game_objects[n].esrb + '</p>' +
    '<p class="game-reviews">Review: ' + Math.floor(game_objects[n].rating) + '%</p>' +
    '<p class="game-summary">' + game_objects[n].summary + '</p>' + '</div>');
  }

  /*** GO TO THE NEXT GAME IN GAME INFO MENU ***/
  nextGame = () => {
    displayGameInfo(gameArrIndex);
  }

  /*** GO TO THE PREVIOUS GAME IN GAME INFO MENU ***/
  prevGame = () => {
    displayGameInfo(gameArrIndex);
  }

  /*** GO TO THE NEXT ROW IN GAME SELECTION MENU ***/
  nextRow = () => {

    if (page_num < page_count) {
      page_items_start += 4
      page_items_end += 4;

      let curArr = game_objects.slice(page_items_start, page_items_end);
      addGamesToPage(curArr.length, curArr);
      page_num++;
    }
  }

  /*** RETURN TO PREVIOUS ROW IN GAME SELECTION MENU ***/
  prevRow = () => {

    if (page_num > 1) {

      page_items_start -= 4;
      page_items_end -= 4;
      game_num = ((page_num - 1) * 4) - 4;

      let curArr = game_objects.slice(page_items_start, page_items_end);
      
      addGamesToPage(4, curArr);

      page_num--;

    }
  }
  
    /*** VIEW GAME INFORMATION MENU ***/
  $(document).on('click', '.games',() => {
    gameArrIndex = $(this).data('game-num');
    displayGameInfo(gameArrIndex);
    game_veiwing_mode = true;
  })

  /*** RETURN TO GAME SELECTION MENU ***/
  $('.game-cover-div').click(() => {
    if(game_veiwing_mode) {

      page_num = getPageNum(gameArrIndex);
      game_num = (page_num * 4) - 4;
      page_items_start = game_num;
      page_items_end = page_items_start + 4;

      let curArr = game_objects.slice(page_items_start, page_items_end);

      $('.game_cover').attr('src', 'images/noimage.png');

      addGamesToPage(curArr.length, curArr);
      game_veiwing_mode = false;
    }
  })

  /*** RIGHT ARROW FUNCTION ***/
  $('.next-submit').click(() => {
    if(game_veiwing_mode) {
      if(gameArrIndex < game_objects.length-1) {
        gameArrIndex >= game_objects.length-1 ? game_objects.length-1 : gameArrIndex++;
        nextGame();
      }
    } else {
      nextRow();
    }
  })

  /*** LEFT ARROW FUNCTION ***/
  $('.previous-submit').click(() => {
    if(game_veiwing_mode) {
      gameArrIndex <= 0 ? 0 : gameArrIndex--;
      prevGame();
    } else {
      prevRow();
    }
  })

  $('.search-submit').on('click', submit_search);
  $('.search-input').keydown((e) => {
    console.log(e);
    if (e.keyCode == 13) {
      submit_search();
    }
  });

  /*** LIGHTBOX CODE ***/
  let mediaNum = 0;

  /*** OPEN THE MODAL ***/
  openModal = () => {
    $('#myModal').css("display", "block");
  }

  /*** CLOSE THE MODAL ***/
  closeModal = () => {
    $('#myModal').css("display", "none");
    $('.mySlides').html("");
  }

  $('.close').click(() => {
    closeModal();
    mediaNum = 0;
  })

  $('.game-cover-div').click(() => {
    openModal();

    if (game_objects[gameArrIndex].media.hasOwnProperty('videos')) {
      $('.mySlides').html('<iframe width="90%" height="400px" src="https://www.youtube.com/embed/' + game_objects[gameArrIndex].media.videos[mediaNum].video_id + '"></iframe>');
    }
  });

  $('.modal-prev').click(() => {
    if (game_objects[gameArrIndex].media.hasOwnProperty('videos')) {
      if (mediaNum > 0) {
        mediaNum--;
        $('.mySlides').html('<iframe width="90%" height="400px" src="https://www.youtube.com/embed/' + game_objects[gameArrIndex].media.videos[mediaNum].video_id + '"></iframe>')
      }
    }
  });

  $('.modal-next').click(() => {
    if (game_objects[gameArrIndex].media.hasOwnProperty('videos')) {
      if (mediaNum < game_objects[gameArrIndex].media.videos.length - 1) {
        mediaNum++;
        $('.mySlides').html('<iframe width="90%" height="400px" src="https://www.youtube.com/embed/' + game_objects[gameArrIndex].media.videos[mediaNum].video_id + '"></iframe>')
      }
    }
  });
})