# reshuffle-movieposter-example

[Code](https://github.com/reshufflehq/reshuffle-movieposter-example) |
[npm](https://www.npmjs.com/package/reshuffle-movieposter-example)

`npm install reshuffle-movieposter-example`

### Reshuffle Movie Poster Example

This example uses [Reshuffle](https://github.com/reshufflehq/reshuffle) to
set up an API endpoint for retrieving a movie poster image using the movie's
name.

This is a two stage process. The code first uses Reshuffle's [Entertainment
Identifier Registry (EIDR)](https://eidr.org/) connector to resolve the
movie name into a standaridized movie ID. It then uses the
[Movies Anywhere](https://moviesanywhere.com/) to lookup to movie poster
image given this ID.

#### Usage

First install the example and start the Reshuffle server:

```bash
npm install reshuffle-movieposter-example
npm run start
```

This will start a web server at local port 8000. Then point your browser to
the local URL

`http://localhost:8000/movie-poster?name=abominable`

to see the poster frame. Try different movie names, but be aware that not
all movies are part of the Movies Anywhere service, so some may not resolve
into a poster image.

The default width for the returned image is 400 pixels. You can change the
width with a query parameter like so:

`http://localhost:8000/movie-poster?name=abominable?width=1000`
