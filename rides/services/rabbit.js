const amqp = require('amqplib');

const rabbitmqUrl = process.env.RABBITMQ_URL;

let connection, channel;

async function connectRabbitMq() {
    connection = await amqp.connect(rabbitmqUrl);
    channel = await connection.createChannel();
    channel.prefetch(1); // process one message at a time
    console.log('[Rides Service] Connected to RabbitMQ successfully');
}

async function subscribeToQueue(queueName, callback) {
    if (!channel) await connectRabbitMq();
    await channel.assertQueue(queueName, { durable: true });
    channel.consume(queueName, async (message) => {
        try {
            await callback(JSON.parse(message.content.toString()));
            channel.ack(message); // only ack after successful processing
        } catch (err) {
            console.error('Processing failed:', err);
            channel.nack(message, false, true); // requeue for retry
        }
    });
}

async function publishToQueue(queueName, data) {
    if (!channel) await connectRabbitMq();
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), { persistent: true });
}

module.exports = {
    subscribeToQueue,
    publishToQueue,
    connectRabbitMq
};
