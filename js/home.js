// READ: featured film, catalog, search and filters
const movies = DB.movies();
const fill = (sel, vals) => vals.forEach(v => sel.insertAdjacentHTML('beforeend', `<option>${esc(v)}</option>`));
fill($('#genre'), [...new Set(movies.map(m => m.genre))].sort());
fill($('#year'),  [...new Set(movies.map(m => m.year))].sort((a, b) => b - a));

function render() {
  const f = movies.find(m => m.featured);
  $('#hero').innerHTML = f ? `<div class="hero"><div class="hero-poster">${posterHTML(f)}</div><div class="hero-text">
    <p class="tag">Featured film</p><h1>${esc(f.title)}</h1>
    <p class="meta">${f.year} &middot; Directed by ${esc(f.director)} &middot; ${esc(f.genre)}</p>
    <p>${esc(f.synopsis)}</p><a class="btn" href="movie.html?id=${f.id}">View details &amp; reviews</a></div></div>` : '';
  const q = $('#q').value.trim().toLowerCase(), g = $('#genre').value, y = $('#year').value;
  const list = movies.filter(m =>
    (!q || m.title.toLowerCase().includes(q) || m.director.toLowerCase().includes(q)) &&
    (!g || m.genre === g) && (!y || String(m.year) === y)
  ).sort((a, b) => a.title.localeCompare(b.title));
  $('#grid').innerHTML = list.length
    ? list.map(m => `<a class="card" href="movie.html?id=${m.id}" title="${esc(m.title)} (${m.year})">${posterHTML(m)}</a>`).join('')
    : '<p class="empty">No films match your search. Try a different title or reset the filters.</p>';
}
['input', 'change'].forEach(e => $('#filters').addEventListener(e, render));
$('#reset').addEventListener('click', () => setTimeout(render));
render();
