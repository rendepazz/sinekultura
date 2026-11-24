// READ film details + reviews, CREATE anonymous review (with validation)
const id = Number(new URLSearchParams(location.search).get('id'));
const movie = DB.movies().find(m => m.id === id);
let errors = [], posted = false, draft = {name: '', rating: 0, comment: ''};

function render() {
  if (!movie) { $('#app').innerHTML = '<p class="empty">Film not found. <a href="index.html">Back to films</a></p>'; return; }
  document.title = movie.title + ' | SINEKULTURA';
  const reviews = DB.reviews().filter(r => r.movieId === id).sort((a, b) => b.id - a.id);
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  $('#app').innerHTML = `
  <section class="detail"><div class="detail-poster">${posterHTML(movie)}</div><div>
    <h1>${esc(movie.title)} <small>(${movie.year})</small></h1>
    <p class="meta">Directed by <b>${esc(movie.director)}</b> &middot; ${esc(movie.genre)}</p>
    <p>${reviews.length ? `<span class="stars">${stars(Math.round(avg))}</span> ${avg.toFixed(1)} from ${reviews.length} review(s)` : 'No ratings yet'}</p>
    <h3>Synopsis</h3><p>${esc(movie.synopsis)}</p></div></section>
  <section class="reviews"><h2>Reviews &amp; comments</h2>
    ${posted ? '<p class="ok">Thanks! Your review was posted.</p>' : ''}
    ${errors.map(e => `<p class="err">${esc(e)}</p>`).join('')}
    <form id="rf" class="review-form" novalidate>
      <label>Name (optional) <input name="name" maxlength="40" placeholder="Anonymous" value="${esc(draft.name)}"></label>
      <fieldset class="starpick"><legend>Your rating</legend>
        ${[5,4,3,2,1].map(i => `<input type="radio" id="s${i}" name="rating" value="${i}" ${draft.rating === i ? 'checked' : ''}><label for="s${i}" title="${i} star(s)">★</label>`).join('')}
      </fieldset>
      <label>Your review <textarea name="comment" rows="4" maxlength="1000">${esc(draft.comment)}</textarea></label>
      <button class="btn" type="submit">Post review</button>
    </form>
    ${reviews.length ? reviews.map(r => `<article class="review"><header><b>${esc(r.name)}</b> <span class="stars">${stars(r.rating)}</span> <time>${esc(r.date)}</time></header><p>${esc(r.comment)}</p></article>`).join('')
      : '<p class="empty">Be the first to share your thoughts on this film.</p>'}
  </section>`;
  $('#rf').addEventListener('submit', submit);
}

function submit(e) {
  e.preventDefault();
  const f = new FormData(e.target);
  draft = {name: (f.get('name') || '').trim(), rating: Number(f.get('rating') || 0), comment: (f.get('comment') || '').trim()};
  errors = []; posted = false;
  if (draft.rating < 1) errors.push('Please choose a rating from 1 to 5 stars.');
  if (draft.comment.length < 5) errors.push('Your review must be at least 5 characters.');
  if (!errors.length) {
    const all = DB.reviews();
    all.push({id: DB.nextId(all), movieId: id, name: draft.name || 'Anonymous', rating: draft.rating, comment: draft.comment, date: new Date().toISOString().slice(0, 10)});
    DB.saveReviews(all); draft = {name: '', rating: 0, comment: ''}; posted = true;
  }
  render();
}
render();
