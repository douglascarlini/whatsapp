const amqp = require('amqplib');

module.exports = {

    url: `amqp://${process.env.RMQ_USER}:${process.env.RMQ_PASS}@rmq:5672`,

    async wait() {
        let conn;
        while (!conn) {
            try {
                conn = await amqp.connect(this.url);
            } catch (error) {
                console.log(`RabbitMQ Error: ${error}`);
                await new Promise(res => setTimeout(res, 5000));
            }
        }
    },

    async publish(queue, data) {
        data = JSON.stringify(data);
        const config = { persistent: true };
        const connection = await amqp.connect(this.url);
        const channel = await connection.createChannel();
        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(data), config);
        await channel.close();
        await connection.close();
    },

    async consume(queue, callback) {
        const connection = await amqp.connect(this.url);
        const channel = await connection.createChannel();
        await channel.assertQueue(queue, { durable: true });
        console.log(`Start to consuming "${queue}" queue...`);
        channel.consume(queue, msg => callback(channel, msg));
    }

};