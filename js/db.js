// Shared data layer. localStorage acts as the "database" with two tables: movies and reviews.
const SEED_MOVIES = [
 {id:1,title:'Himala',year:1982,director:'Ishmael Bernal',genre:'Drama',poster:'',featured:true,synopsis:'In a drought-stricken barrio, a young woman claims to have seen the Virgin Mary, drawing crowds of believers and exposing questions about faith, hope, and exploitation.'},
 {id:2,title:'Heneral Luna',year:2015,director:'Jerrold Tarog',genre:'Historical',poster:'',featured:false,synopsis:'A portrait of General Antonio Luna during the Philippine-American War, as his fierce discipline clashes with political rivals within the revolutionary government.'},
 {id:3,title:'Oro, Plata, Mata',year:1982,director:'Peque Gallaga',genre:'War Drama',poster:'',featured:false,synopsis:'Two wealthy Negrense families flee to the hills during the Japanese occupation, and the war strips away their privilege and certainties.'},
 {id:4,title:'Ang Babae sa Septic Tank',year:2011,director:'Marlon Rivera',genre:'Comedy',poster:'',featured:false,synopsis:'Three young filmmakers plan an award-winning poverty drama for foreign festivals, and a satire of the local indie scene unfolds.'},
 {id:5,title:'Kisapmata',year:1981,director:'Mike de Leon',genre:'Thriller',poster:'',featured:false,synopsis:'A young couple lives under the roof of an overbearing retired policeman whose control over his family turns suffocating and dangerous.'},
 {id:6,title:'Insiang',year:1976,director:'Lino Brocka',genre:'Drama',poster:'',featured:false,synopsis:"A young woman in a Manila slum endures her mother's neglect and a predatory boarder, and finally takes control of her own fate."},
 {id:7,title:'Maynila sa mga Kuko ng Liwanag',year:1975,director:'Lino Brocka',genre:'Drama',poster:'',featured:false,synopsis:'A provincial man searches Manila for the woman he loves and meets the harsh realities of city life and labor.'},
 {id:8,title:'Bayan Ko: Kapit sa Patalim',year:1984,director:'Lino Brocka',genre:'Drama',poster:'',featured:false,synopsis:'A striking worker pushed by poverty and a sick family faces impossible choices under a repressive era.'}
];
const SEED_REVIEWS = [
 {id:1,movieId:1,name:'Anonymous',rating:5,comment:'Still unsettling and powerful. The ending stays with you long after the credits.',date:'2026-11-21'},
 {id:2,movieId:2,name:'Maria',rating:4,comment:'Gripping history lesson with a very intense lead performance.',date:'2026-11-21'}
];

const DB = {
  get(key, seed) {
    try { const v = JSON.parse(localStorage.getItem(key)); if (Array.isArray(v)) return v; } catch (e) {}
    this.set(key, seed); return JSON.parse(JSON.stringify(seed));
  },
  set(key, v) { localStorage.setItem(key, JSON.stringify(v)); },
  movies()  { return this.get('sk_movies', SEED_MOVIES); },
  reviews() { return this.get('sk_reviews', SEED_REVIEWS); },
  saveMovies(v)  { this.set('sk_movies', v); },
  saveReviews(v) { this.set('sk_reviews', v); },
  nextId(list) { return list.reduce((m, x) => Math.max(m, x.id), 0) + 1; },
  reset() { localStorage.removeItem('sk_movies'); localStorage.removeItem('sk_reviews'); }
};

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const stars = n => '★'.repeat(n) + '☆'.repeat(5 - n);
const posterHTML = m => m.poster
  ? `<img src="${esc(m.poster)}" alt="Poster of ${esc(m.title)}" loading="lazy">`
  : `<div class="ph" role="img" aria-label="Poster placeholder for ${esc(m.title)}"><span>${esc(m.title)}</span><small>${m.year}</small></div>`;

// Same navbar and footer on every page
document.body.insertAdjacentHTML('afterbegin',
  `<header class="nav"><a class="logo" href="index.html">SINE<b>KULTURA</b></a>
   <nav><a href="index.html">Films</a><a href="about.html">About &amp; Sources</a><a href="admin.html">Admin</a></nav></header>`);
document.body.insertAdjacentHTML('beforeend',
  `<footer class="foot">SINEKULTURA &mdash; Filipino cinema, Filipino voices. Student project for CC 201.</footer>`);
