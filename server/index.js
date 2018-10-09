
const express = require('express')
const consola = require('consola')
const bodyParser = require('body-parser')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

const Pusher = require('pusher')
const pusher = new Pusher({
  appId: '616772',
  key: '5cb0a26beb27693d86e5',
  secret: '283cf5a8f18aaab7deea',
  cluster: 'ap1',
  encrypted: true
})

app.set('port', port)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

const posts = [
  {
    id: 1,
    content: 'first content',
    createdAt: new Date().toLocaleDateString()
  }
]

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.use(bodyParser.urlencoded({
    extended: true
  }))
  app.use(bodyParser.json())

  app.get('/api/posts', function(req, res, next) {
    return res.json(posts)
  })

  app.post('/api/posts', function(req, res, next) {
    const now = new Date().toLocaleDateString()
    const post = {
      id: posts.length + 1,
      content: req.body.content,
      createdAt: now
    }
    posts.push(post)
    pusher.trigger('posts', 'post_added', {post: post})
    res.status(200).send()
  })

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
