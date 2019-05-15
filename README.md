# Chatpot-Websocket-Consumer
websocket server and message consumer from message queue for chatpot services.<br />
[Socket.IO Protocol Guide](http://dev-websocket.chatpot.chat/socketio-doc)

## How to run
to run the application, you need the configuration file on your home directory. the path is ```$HOME/chatpot-websocket-consumer-conf.json ```.
```bash
npm install
npm run dev
```

## How to Configure application
application configuration to be injected with Environment Variables, or Configuration file.

### Configure with json file
```json
{
	"AMQP_HOST": "AMQP_SERVER_HOST",
	"AMQP_PORT": AMQP_SERVER_PORT,
	"AMQP_LOGIN": "AMQP_LOGIN",
	"AMQP_PASSWORD": "AMQP_PASSWORD",
	"TOPIC_WEBSOCKET_MESSAGE_QUEUE": "QUEUE_NAME_FROM_AMQP_SERVER",
	"WEBSOCKET_PORT": WEBSOCKET_PORT,
	"WEBSOCKET_ADAPTER": "REDIS | MEMORY",
	"WEBSOCKET_REDIS_HOST": "REDIS SERVER HOST",
	"WEBSOCKET_REDIS_PORT": REDIS SERVER PORT,
	"KV_STORAGE_PROVIDER": "REDIS | MEMORY",
	"KV_STORAGE_REDIS_HOST": "REDIS SERVER HOST",
	"KV_STORAGE_REDIS_PORT": REDIS SERVER PORT,
	"HOST_WEBSOCKET": "WEBSOCKET SERVER PUBLIC DOMAIN",
	"HTTP_PORT": HTTP_PORT
}
```
### Configure with environment variable
```bash
$ HTTP_PORT=3000 AMQP_HOST=rabbitmq.test.com AMQP_PORT=5672... bin/app.js
```