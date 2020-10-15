const fetch = require('node-fetch')
const { HttpConnector, Reshuffle } = require('reshuffle')
const { EIDRConnector } = require('reshuffle-eidr-connector')
const { MoviesAnywhereConnector } = require('reshuffle-moviesanywhere-connector')

// Initialize the Reshuffle application and connectors
const app = new Reshuffle()
const eidr = new EIDRConnector(app)
const http = new HttpConnector(app)
const ma = new MoviesAnywhereConnector(app)

// Listen to HTTP GET requestes to /
http.on({ method: 'GET', path: '/' }, async ({ req, res }) => {

  // Get the movie name from the query string
  const name = req.query.name
  if (typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).send(`Invalid movie name: ${name}`)
  }
  const nm = name.trim()

  // Get the image width from the query string, or default to 400
  const width = req.query.width || 400
  const wd = typeof width === 'string' ? parseInt(width, 10) : width
  if (typeof wd !== 'number' || isNaN(wd) || wd <= 1 || 8192 < wd) {
    return res.status(400).send(`Invalid width: ${wd}`)
  }

  // Lookup the movie name in EIDR. If the movie is found, we get back
  // a unique ID
  console.log('Search EIDR for movie name:', nm)
  const movies = await eidr.simpleQuery({
    name: nm,
    movie: true,
    valid: true,
    StructuralType: 'Performance',
  })
  if (!movies) {
    return res.status(404).send(`Movie not found: ${nm}`)
  }
  const id = movies[0].ID

  // Lookup the movie ID in Movies Anywhere. Movies Anywhere's title service
  // provides metadata for movies, including a URL for the poster image
  console.log('Searching Movies Anywhere for EIDR ID:', id)
  const { boxart } = await ma.getTitleByEIDR(id)
  if (!boxart) {
    return res.status(404).send(`Movie poster not found: ${nm}`)
  }

  // Fetch the image
  const url = `https:${boxart}.jpg?w=${Math.round(wd)}`
  console.log('Fetching poster image:', url)
  const rs = await fetch(url)
  if (rs.status !== 200) {
    console.error('Error fetching image', rs.status, rs.statusText)
    return res.status(500).send(`Unable to load poster image: ${nm}`)
  }

  // Return the image in the HTTP response
  const blob = await rs.blob()
  return res
    .set({ 'Content-Type': blob.type, 'Content-Length': blob.size })
    .send(Buffer.from(await blob.arrayBuffer()))
})

app.start(8000)
