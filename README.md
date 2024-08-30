# WhatsApp Bot AI

Bot AI for WhatsApp Web with built-in API.

## Configure

Copy `.env.sample` to `.env` and configure it.

### Features

- Bot consume `RMQ_Q_STAT` queue to send *"typing"* state;
- Bot publish received messages to `RMQ_Q_RECV` queue;
- Bot consume `RMQ_Q_SEND` queue to send messages;
- Bot run scheduled tasks (API);

#### Chat Control

> Disable/Enable application worker.

- Take chat control sending `CHAT_TAKE_CONTROL` value;
- Pass chat control sending `CHAT_PASS_CONTROL` value;

### API

> The `session` must be a unique ID for a WhatsApp session (e.g. `customer-001-sales`).

- `POST /schedule/{session}/{number} { message: str, media_url: str, template: str, data: any, when: str }`
    - Send message to number (publish to `RMQ_Q_SEND` queue) (`when` can be date or `in 20 minutes`);
- `POST /message/{session}/{number} { message: str, media_url: str, template: str, data: any }`
    - Send message to number (publish to `RMQ_Q_SEND` queue) (use `message` or `template`);
- `POST /auth/login { username: str, password: str }`
    - Generate a JWT Bearer token (`Authorization` header or `key` query string);
- `GET /session/{session}?key={jwt-token}`
    - Create session and generate QR Code (link device);
- `GET /contact/{session}?search={term}`
    - Search a contact or get all contacts;
- `DELETE /session/{session}`
    - Delete session;

#### Templates

You can use templates to send messages using data replacement.

> Put your templates on `data/bot/templates` folder.

##### Sample Template (order.txt)

```
Hello, *{{customerName}}*!

*Order:* #{{orderId}}

{{#items}}
- `{{quantity}}x {{name}}`
{{/items}}

*Total:* {{total}}
*Delivery:* {{deliveryDate}}

Thank you! 😃
```

##### API Message Payload

```json
{
    "number": "5527900000000",
    "template": "order",
    "data": {
        "customerName": "Douglas",
        "orderId": "123456",
        "total": "R$ 190,78",
        "deliveryDate": "02/09/2024",
        "items": [
            {
                "quantity": 1,
                "name": "iPhone"
            },
            {
                "quantity": 2,
                "name": "Carro"
            },
            {
                "quantity": 5,
                "name": "SSD"
            }
        ]
    },
    "media_url": "https://message-image-url"
}
```

### Worker

Create your worker application on `app` folder to process received messages.

#### app/package.json

```json
{
    "name": "app",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
        "start": "node index.js"
    },
    "author": "",
    "license": "ISC",
    "dependencies": {
      "amqplib": "^0.10.4"
    }
}
```

#### app/index.js

```javascript
const rmq = require('./lib/rabbitmq');

const worker = async (data) => {
    console.log({ data });
    return "[response]";
}

(async () => {

    await rmq.wait();

    await rmq.consume(process.env.RMQ_Q_RECV,

        async (ch, msg) => {

            try {

                const { session, type, name, number, message, media } = JSON.parse(msg.content.toString());

                if (type == 'api') return;
                await rmq.publish(process.env.RMQ_Q_STAT, { session, number });
                const response = await worker({ session, type, name, number, message, media });
                await rmq.publish(process.env.RMQ_Q_SEND, { session, number, message: response });

                ch.ack(msg);

            } catch (error) {

                console.log(`SEND:`, error);

            }

        });

})();
```