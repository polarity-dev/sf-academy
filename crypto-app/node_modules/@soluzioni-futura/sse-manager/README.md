# sse-manager

Handle server sent events with ease.

Supported features:

- handle single request
- handle multiple requests using rooms abstraction
- ExpressJs compatible
- Redis events compatible
- pluggable with every backend server framework with programmable custom http adapters
- pluggable with every event dispatcher tool with programmable custom event adapters

## Usage

classic usage:

``` js
const { createSSEManager } = require("@soluzioni-futura/sse-manager")

const sseManager = await createSSEManager()

app.get("/stream", async(req, res) => {
  const sseStream = await sseManager.createSSEStream(res)
  await sseStream.broadcast({ data: "Joining you to test-room"})
  await sseStream.addToRoom("test-room")
})

setInterval(async() => {
  await sseManager.broadcast("test-room", { data: "Hello test-room people!" })
}, 1000)
```

with Redis events adapter:

```js
  const redisClient = createClient({
    url: "redis://redis:6379"
  })

  await redisClient.connect()

  const redisSubscriber = redisClient.duplicate()
  await redisSubscriber.connect()

  const sseManager = await createSSEManager({
    eventsAdapter: new RedisEventsAdapter({
      redisClient,
      redisSubscriber
    })
  })
```

with PostgreSQL events adapter:

```js
  const dbOptions = {
    host: 'your_host',
    user: 'your_user',
    port: 5432,
    password: 'your_password',
    database: 'your_database'
  }

  const sseManager = await createSSEManager({
    eventsAdapter: new PostgresEventAdapter(dbOptions)
  })
```

## createSSEManager options

``` js
const sseManager = await createSSEManager({
  httpAdapter: new ExpressHttpAdapter(), // default
  eventsAdapter: new EmitterEventsAdapter() // default, uses node event emitters to broadcast events
})
```

## Adapters

### HTTP Adapters

available http adapters:

- `ExpressHttpAdapter`: default, uses ExpressJs to handle http requests
- `FastifyHttpAdapter`: uses Fastify to handle http requests
- custom http adapter:

    ```js
    class CustomHttpAdapter = extends HTTPAdapter {
      constructor() {
        super({
          setResHeaders: (res, headers): void => {
            // add your custom code here
            Object.entries(headers).forEach(([k, v]) => res.set(k, v)) // example: code from ExpressHttpAdapter
          },

          writeRes: (res, data): void => {
            // add your custom code here
            res.write(data) // example: code from ExpressHttpAdapter
          },

          flushResHeaders: (res): void => {
            // add your custom code here
            res.flushHeaders() // example: code from ExpressHttpAdapter
          },

          endRes: (res): void => {
            // add your custom code here
            res.end() // example: code from ExpressHttpAdapter
          },

          onCloseCallback: (res, fn): void => {
            // add your custom code here
            res.on("close", fn) // example: code from ExpressHttpAdapter
          }
        })
      }
    }
    ```

### Event Adapters

available event adapters:

- `EmitterEventsAdapter`: default, uses NodeJs event emitters to broadcast events in a single application instance use case
- `RedisEventsAdapter`: uses Redis to broadcast events in a multiple application instance use case
- `PostgresEventsAdapter`: uses PostgreSQL to broadcast events in a multiple application instance use case
- custom event adapter:

``` js
class CustomEventsAdapter = extends EventsAdapter {
  #emitter = new EventEmitter() // example: code from EmitterEventsAdapter

  constructor() {
    super({
      emit: (event, data) => {
        // add your custom code here

        // example: code from EmitterEventsAdapter
        this.#emitter.emit(event, data)
        return Promise.resolve()
      },
      on: (event, fn) => {
        // add your custom code here

        // example: code from EmitterEventsAdapter
        this.#emitter.on(event, (data) => {
          return fn(data, event)
        })
        return Promise.resolve()
      }
    })
  }
}
```
