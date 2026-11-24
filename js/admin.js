// Admin: CREATE / UPDATE / DELETE movies, feature a movie, DELETE reviews.
// NOTE: this login is only for the school demo; JavaScript-only sites cannot hide a password.
const ADMIN_USER = 'admin', ADMIN_PASS = 'sinekultura123';
let editId = null;

function showDash(on) {
  $('#login').classList.toggle('hidden', on); $('#dash').classList.toggle('hidden', !on);
  if (on) render();
}
$('#lf').addEventListener('submit', e => {
  e.preventDefault(); const f = new FormData(e.target);
  if (f.get('user') === ADMIN_USER && f.get('pass') === ADMIN_PASS) { sessionStorage.setItem('sk_admin', '1'); $('#loginErr').textContent = ''; showDash(true); }
  else $('#loginErr').textContent = 'Incorrect username or password.';
});
$('#logout').addEventListener('click', () => { sessionStorage.removeItem('sk_admin'); showDash(false); });
$('#resetData').addEventListener('click', () => { if (confirm('Restore the original sample films and reviews? Your changes will be lost.')) { DB.reset(); flash('Sample data restored.'); } });

function flash(t) { render(); $('#msg').textContent = t; }

function render() {
  const movies = DB.movies().sort((a, b) => a.title.localeCompare(b.title)), reviews = DB.reviews().sort((a, b) => b.id - a.id);
  $('#msg').textContent = '';
  $('#mt').innerHTML = '<tr><th>Title</th><th>Year</th><th>Director</th><th>Genre</th><th>Featured</th><th>Actions</th></tr>' +
    movies.map(m => `<tr><td>${esc(m.title)}</td><td>${m.year}</td><td>${esc(m.director)}</td><td>${esc(m.genre)}</td><td>${m.featured ? '★ Featured' : ''}</td>
      <td class="actions"><button data-a="edit" data-id="${m.id}">Edit</button>${m.featured ? '' : `<button data-a="feature" data-id="${m.id}">Set featured</button>`}
      <button class="danger" data-a="delMovie" data-id="${m.id}">Delete</button></td></tr>`).join('');
  const title = id => (movies.find(m => m.id === id) || {}).title || '(deleted)';
  $('#rt').innerHTML = '<tr><th>Film</th><th>Name</th><th>Rating</th><th>Comment</th><th>Action</th></tr>' +
    reviews.map(r => `<tr><td>${esc(title(r.movieId))}</td><td>${esc(r.name)}</td><td class="stars">${stars(r.rating)}</td><td>${esc(r.comment)}</td>
      <td class="actions"><button class="danger" data-a="delReview" data-id="${r.id}">Delete</button></td></tr>`).join('');
}

document.addEventListener('click', e => {
  const b = e.target.closest('button[data-a]'); if (!b) return;
  const id = Number(b.dataset.id), a = b.dataset.a;
  const movies = DB.movies();
  if (a === 'edit') openForm(movies.find(m => m.id === id));
  if (a === 'feature') { movies.forEach(m => m.featured = m.id === id); DB.saveMovies(movies); flash('Featured movie updated.'); }
  if (a === 'delMovie') {  // DELETE with confirmation
    const m = movies.find(x => x.id === id);
    if (confirm(`Delete "${m.title}" and all its reviews? This cannot be undone.`)) {
      DB.saveMovies(movies.filter(x => x.id !== id)); DB.saveReviews(DB.reviews().filter(r => r.movieId !== id)); flash('Movie deleted.');
    }
  }
  if (a === 'delReview' && confirm('Delete this review?')) { DB.saveReviews(DB.reviews().filter(r => r.id !== id)); flash('Review deleted.'); }
});

function openForm(m) {
  editId = m ? m.id : null;
  $('#formTitle').textContent = m ? 'Edit movie' : 'Add movie'; $('#formErr').innerHTML = '';
  const f = $('#mf'); ['title','year','director','genre','poster','synopsis'].forEach(k => f[k].value = m ? m[k] : '');
  $('#formBox').classList.remove('hidden'); f.title.focus();
}
$('#addBtn').addEventListener('click', () => openForm(null));
$('#cancel').addEventListener('click', () => $('#formBox').classList.add('hidden'));

$('#mf').addEventListener('submit', e => {  // CREATE or UPDATE, with validation
  e.preventDefault();
  const f = e.target, m = {title: f.title.value.trim(), year: Number(f.year.value), director: f.director.value.trim(),
    genre: f.genre.value.trim(), poster: f.poster.value.trim(), synopsis: f.synopsis.value.trim()};
  const errs = [];
  if (!m.title || !m.director || !m.genre) errs.push('Title, director, and genre are required.');
  if (!(m.year >= 1900 && m.year <= new Date().getFullYear())) errs.push('Enter a valid release year (1900 to this year).');
  if (m.synopsis.length < 20) errs.push('Synopsis must be at least 20 characters.');
  if (m.poster && !/^(https?:\/\/|images\/)/.test(m.poster)) errs.push('Poster must start with http(s):// or images/.');
  $('#formErr').innerHTML = errs.map(x => `<p class="err">${esc(x)}</p>`).join('');
  if (errs.length) return;
  const movies = DB.movies();
  if (editId) Object.assign(movies.find(x => x.id === editId), m);
  else movies.push({...m, id: DB.nextId(movies), featured: false});
  DB.saveMovies(movies); $('#formBox').classList.add('hidden'); flash(editId ? 'Movie updated.' : 'Movie added.');
});

showDash(sessionStorage.getItem('sk_admin') === '1');
