# SINEKULTURA (HTML, CSS, JavaScript)
Filipino films catalog and anonymous review site (CC 201 Final Project).

## Run
No server needed. Unzip and open `index.html` in a browser (or use VS Code Live Server).

## Admin
Open Admin in the navbar. Login: `admin` / `sinekultura123` (edit in `js/admin.js`).

## Data ("database")
Data is saved in the browser's localStorage (tables `sk_movies`, `sk_reviews`, defined in `js/db.js`). It is stored per browser and per computer, so test and demo on the same machine and browser. Admin > "Reset sample data" restores the starting films. ER diagram: `er-diagram.svg` (movies 1 : many reviews).

## CRUD map
| Entity  | Create | Read | Update | Delete |
|---------|--------|------|--------|--------|
| movies  | admin.html (Add movie) | index.html, movie.html | admin.html (Edit) | admin.html (confirm) |
| reviews | movie.html (anonymous) | movie.html | n/a | admin.html (confirm) |

## Files
index.html, movie.html, about.html, admin.html, css/style.css, js/db.js (data layer), js/home.js, js/movie.js, js/admin.js, images/ (put posters here).

## Credits
Add the sources and poster credits you used to `about.html`.
