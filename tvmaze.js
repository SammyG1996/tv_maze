/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */

const showsList = document.querySelector('#shows-list')

async function searchShows(query) {


  const shows = await axios.get('https://api.tvmaze.com/search/shows', {params: {q: query}})
  
  return shows.data
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let img;
  
    show.show.image !== null ? img = show.show.image.original: img = 'https://tinyurl.com/tv-missing';

    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
        <img class="card-img-top" src=${img} alt="Card image cap">
         <div class="card" data-show-id="${show.show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.show.name}</h5>
             <p class="card-text">${show.show.summary}</p>
             <button type="button" class="btn btn-info" class="episodesBtn" id="${show.show.id}">Get Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);

});



showsList.addEventListener('click', (e) => getEpisodes(e))


//console.log(e.target.id)


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(e) {
  const id = e.target.id

  const episodes = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`); 
  populateEpisodes(episodes.data)

}

$('#remove').on('click', () => {
  const $episodesContainer = $('#episode-container');
  $episodesContainer.removeClass('d-block')
  $episodesContainer.addClass('d-none')

})


function populateEpisodes(episodes) {
  const $episodesArea = $("#episodes-area");
  const $episodesContainer = $('#episode-container')
  $episodesArea.empty();
  $episodesContainer.removeClass('d-none')
  $episodesContainer.addClass('d-block')
  $episodesArea.addClass('d-block')

  for (let episode of episodes) {
    let img;
  
    episode.image !== null ? img = episode.image.original: img = 'https://tinyurl.com/tv-missing';

    let $item = $(
      ` <img class="card-img-top" src=${img} alt="Card image cap">
         <div class="card" data-show-id="${episode.id}">
           <div class="card-body">
             <h5 class="card-title">Season ${episode.season} Episode ${episode.number}</h5>
             <p class="card-text">${episode.name}: ${episode.summary}</p>
           </div>
         </div>
      `);

    $episodesArea.append($item);
  }
}