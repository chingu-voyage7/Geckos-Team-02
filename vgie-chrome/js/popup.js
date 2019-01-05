
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
    $('.loader-div').show();
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


      }
      console.log(response);
      countPages(game_objects.length, 4);


  }).done((response) => {
    console.log(game_objects);

    $('.loader-div').hide();
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
    $('.output-tab').removeClass('active');
    $('#about-tab').addClass('active');
    $('.tabs').hide();
    $('.output-scroll-btn').hide();
    $('.game-cover').attr('src', 'images/noimage.png');
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

    $('.page-btn').removeClass('active');
  }

  /*** SET THE NUMBER OF PAGES ***/
  countPages = (n, i) => {
    if((n % i) > 0)
      page_count = Math.floor((n / i) + 1);
    else
      page_count = n / i;

    $('.pages').empty();

    for(let i = 0; i < page_count; i++) {
      i === 0 ? $('.pages').append('<li><button class="page-btn ' + (i + 1) +' active">' + (i + 1) + '</button></li>' ) :
      $('.pages').append('<li><button class="page-btn ' +(i + 1)+'">' + (i + 1) + '</button></li>' );
    }

    $('.pages').show();
  }

  nextPage = () => {
    if (page_num < page_count) {
      page_num++;

      $('.pages .page-btn').removeClass('active');
      $('.pages .' + page_num).addClass('active');
    }
  }

  prevPage = () => {
    if(page_num > 1) {
      page_num--;

      $('.pages .page-btn').removeClass('active');
      $('.pages .' + page_num).addClass('active');
    }
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

    $('.output-scroll-btn').show();
  }

  /*** ADD NUMBER OF VIDEOS TO PAGE ***/
  addVideosToPage = (num, arr) => {
    $(".game-output").empty();
    console.log(arr);
    num > arr.length ? num : arr.length;
    for(let i = 0; i < num; i++) {
      if(arr[i] != null) {
        $('.game-output').append('<img class="videos" width="240" height="200" src="https://img.youtube.com/vi/' +
          arr[i].video_id +
          '/sddefault.jpg">')
      } else {
        console.log('returned')
        return;
      }
    }
  }

  /*** ADD NUMBER OF VIDEOS TO PAGE ***/
  addScreenshotsToPage = (num, arr) => {
    $(".game-output").empty();
    console.log(arr);
    for(let i = 0; i < num; i++) {
      if(arr[i] != null) {
        $('.game-output').append('<img class="screenshots" width="240" height="200" src="http:' +
        arr[i].url.replace('t_thumb', 't_screenshot_med') +
        '" alt="video game screenshot">')
      } else {
        console.log('returned')
        return;
      }
    }
  }

  $('.output-prev').click(() => {
      prevRow();
  })

  $('.output-next').click(() => {
      nextRow();
  })

  /*** DISPLAY SELECTED GAME INFORMATION ***/
  displayGameInfo = (n) => {
    console.log(n);
    $('.game-cover').attr('src', game_objects[n].cover.replace('t_thumb', 't_cover_big'));

    $(".game-output").empty();

    $('.game-output').append('<div class="game">' +

    '<p class="game-title">' + game_objects[n].title + '</p>' +
    '<p class="game-esrb">' + game_objects[n].esrb + '</p>' +
    '<p class="game-reviews">Review: ' + Math.floor(game_objects[n].rating) + '%</p>' +
    '<p class="game-summary">' + game_objects[n].summary + '</p>' + '</div>');
  }

  /*** DISPLAY SELECTED GAME VIDEOS ***/
  displayGameVideos = (n) => {
    console.log(n);

    let num;

    $(".game-output").empty();

    if(game_objects[n].media.hasOwnProperty('videos')) {

      if(game_objects[n].media.videos !== null) {
        num = game_objects[n].media.videos.length >= 2 ? 2 : game_objects[n].media.videos.length;

        for(let i = 0; i < num; i++) {
          if(game_objects[n].media.videos[i].hasOwnProperty('video_id')) {
            $('.game-output').append('<img class="videos" width="240" height="200" src="https://img.youtube.com/vi/' +
            game_objects[n].media.videos[i].video_id +
            '/sddefault.jpg">');
          }
        }

        countPages(game_objects[n].media.videos.length, 2);
      } else {
        $('.game-output').append('<p class="no-videos">No videos for this game</p>');
      }
    } else {
      return;
    }
  }

  /*** DISPLAY SELECTED GAME SCREENSHOTS ***/
  displayGameScreenshots = (n) => {
    console.log(n);

    let num;

    $(".game-output").empty();

    if(game_objects[n].media.hasOwnProperty('screenshots')) {
      if(game_objects[n].media.screenshots !== null) {
        num = game_objects[n].media.screenshots.length >= 2 ? 2 : game_objects[n].media.screenshots.length;

        for(let i = 0; i < num; i++) {
          $('.game-output').append('<img class="screenshots" width="240" height="200" src="http:' +
          game_objects[n].media.screenshots[i].url.replace('t_thumb', 't_screenshot_med') +
          '" alt="video game screenshot">');
        }

        countPages(game_objects[n].media.screenshots.length, 2);
      } else {
        $('.game-output').append('<p class="no-videos">No screenshots for this game</p>');
      }

    } else {
      return;
    }
  }

  /*** OPEN NEW TAB ***/
  $('.tabs').click((e) => {

    if($(e.target).is('#about-tab')) {
      if(!$(e.target).hasClass('active')) {
        $('.output-tab').removeClass('active');
        $('#about-tab').addClass('active');
        displayGameInfo(gameArrIndex);
        $('.output-scroll-btn').hide();
      }
    } else if ($(e.target).is('#videos-tab')) {
      if(!$(e.target).hasClass('active')) {
        page_num = 1;
        $('.output-tab').removeClass('active');
        $('#videos-tab').addClass('active');
        displayGameVideos(gameArrIndex);
        $('.output-scroll-btn').show();
      }
    } else if ($(e.target).is('#screenshots-tab')) {
      if(!$(e.target).hasClass('active')) {
        page_num = 1;
        $('.output-tab').removeClass('active');
        $('#screenshots-tab').addClass('active');
        displayGameScreenshots(gameArrIndex);
        $('.output-scroll-btn').show();
      }
    }

  })

  /*** RESET TO DEFAULT TAB ***/
  resetTab = () => {
    $('.output-tab').removeClass('active');
    $('#about-tab').addClass('active');
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

    if(!game_veiwing_mode) {
      if (page_num < page_count) {
        page_items_start += 4
        page_items_end += 4;

        let curArr = game_objects.slice(page_items_start, page_items_end);
        addGamesToPage(curArr.length, curArr);

        getPageNum(gameArrIndex);
        nextPage();
      }
    } else {
      if (page_num < page_count) {
        if($('.videos-list').hasClass('active')) {
          let a = page_num * 2;
          let b = a + 2;
          let curArr = game_objects[gameArrIndex].media.videos.slice(a, b);
          addVideosToPage(2, curArr);
          nextPage();
        } else if ($('.screenshots-list').hasClass('active')) {
          let a = page_num * 2;
          let b = a + 2;
          let curArr = game_objects[gameArrIndex].media.screenshots.slice(a, b);
          addScreenshotsToPage(2, curArr);
          nextPage();
        }
      }
    }

  }

  /*** RETURN TO PREVIOUS ROW IN GAME SELECTION MENU ***/
  prevRow = () => {

    if(!game_veiwing_mode) {
      if (page_num > 1) {

        page_items_start -= 4;
        page_items_end -= 4;
        game_num = ((page_num - 1) * 4) - 4;

        let curArr = game_objects.slice(page_items_start, page_items_end);
        addGamesToPage(4, curArr);

        getPageNum(gameArrIndex);
        prevPage();
      }
    } else {
      if (page_num > 1) {
        if($('.videos-list').hasClass('active')) {
          let a = ((page_num - 1) * 2) - 2;
          let b = a + 2;
          let curArr = game_objects[gameArrIndex].media.videos.slice(a, b);
          addVideosToPage(2, curArr);
          prevPage();
        } else if ($('.screenshots-list').hasClass('active')) {
          let a = ((page_num - 1) * 2) - 2;
          let b = a + 2;
          let curArr = game_objects[gameArrIndex].media.screenshots.slice(a, b);
          addScreenshotsToPage(2, curArr);
          prevPage();
        }
      }
    }

  }

    /*** VIEW GAME INFORMATION MENU ***/
  $(document).on('click', '.games',function() {
    gameArrIndex = $(this).data('game-num');
    displayGameInfo(gameArrIndex);
    game_veiwing_mode = true;
    $('.tabs').show();
    $('.switch-btn').show();
    $('.pages').hide();
    $('.output-scroll-btn').hide();
  })

  /*** RETURN TO GAME SELECTION MENU ***/
  $('.switch-btn').click(() => {
    if(game_veiwing_mode) {

      page_num = getPageNum(gameArrIndex);
      game_num = (page_num * 4) - 4;
      page_items_start = game_num;
      page_items_end = page_items_start + 4;

      let curArr = game_objects.slice(page_items_start, page_items_end);

      $('.game-cover').attr('src', 'images/noimage.png');

      addGamesToPage(curArr.length, curArr);
      game_veiwing_mode = false;
      $('.tabs').hide();
      $('.switch-btn').hide();
      countPages(game_objects.length, 4);
      $('.pages').show();
      resetTab();
      $('.pages .page-btn').removeClass('active');
      $('.pages .' + page_num).addClass('active');
    }
  })

  /*** RIGHT ARROW FUNCTION ***/
  $('.next-submit').click(() => {
    if(game_veiwing_mode) {
      if(gameArrIndex < game_objects.length-1) {
        gameArrIndex >= game_objects.length-1 ? game_objects.length-1 : gameArrIndex++;
        nextGame();
        resetTab();
        $('.pages').hide();
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
      resetTab();
      $('.pages').hide();
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

  /*** DISPLAY VIDEO IN MODAL ***/
  $(document).on('click', '.videos',function(){
    openModal();

    mediaNum = ((page_num * 2) - 2) + $(this).index();

    if (game_objects[gameArrIndex].media.hasOwnProperty('videos')) {
      $('.mySlides').html('<iframe width="90%" height="400px" src="https://www.youtube.com/embed/' +
      game_objects[gameArrIndex].media.videos[mediaNum].video_id + '"></iframe>');
    }
  })

  /*** DISPLAY IMAGE IN MODAL ***/
  $(document).on('click', '.screenshots',function(){
    openModal();

    mediaNum = ((page_num * 2) - 2) + $(this).index();

    if (game_objects[gameArrIndex].media.hasOwnProperty('screenshots')) {
      $('.mySlides').html('<img width="90%" height="400px" src="http:' +
      game_objects[gameArrIndex].media.screenshots[mediaNum].url.replace('t_thumb', 't_screenshot_med') + '">');
    }
  })

  /*** SCROLL TO PREVIOUS VIDEO OR IMAGE ***/
  $('.modal-prev').click(() => {
    if($('.videos-list').hasClass('active')) {
      if (game_objects[gameArrIndex].media.hasOwnProperty('videos')) {
        if (mediaNum > 0) {
          mediaNum--;
          $('.mySlides').html('<iframe width="90%" height="400px" src="https://www.youtube.com/embed/' + game_objects[gameArrIndex].media.videos[mediaNum].video_id + '"></iframe>')
        }
      }
    } else if ($('.screenshots-list').hasClass('active')) {
      if (game_objects[gameArrIndex].media.hasOwnProperty('screenshots')) {
        if (mediaNum > 0) {
          mediaNum--;
          $('.mySlides').html('<img width="90%" height="400px" src="http:' +
          game_objects[gameArrIndex].media.screenshots[mediaNum].url.replace('t_thumb', 't_screenshot_med') + '">')
        }
      }
    }

  });

  /*** SCROLL TO NEXT VIDEO OR IMAGE ***/
  $('.modal-next').click(() => {
    if($('.videos-list').hasClass('active')) {
      if (game_objects[gameArrIndex].media.hasOwnProperty('videos')) {
        if (mediaNum < game_objects[gameArrIndex].media.videos.length - 1) {
          mediaNum++;
          $('.mySlides').html('<iframe width="90%" height="400px" src="https://www.youtube.com/embed/' + game_objects[gameArrIndex].media.videos[mediaNum].video_id + '"></iframe>')
        }
      }
    } else if ($('.screenshots-list').hasClass('active')) {
      if (game_objects[gameArrIndex].media.hasOwnProperty('screenshots')) {
        if (mediaNum < game_objects[gameArrIndex].media.screenshots.length - 1) {
          mediaNum++;
          $('.mySlides').html('<img width="90%" height="400px" src="http:' +
          game_objects[gameArrIndex].media.screenshots[mediaNum].url.replace('t_thumb', 't_screenshot_med') + '">')
        }
      }
    }

  });
})
