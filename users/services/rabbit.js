const amqp = require('amqplib');

const rabbitmqUrl = process.env.RABBITMQ_URL;
console.log({ rabbitmqUrl })

let connection, channel;

async function connectRabbitMq() {
    connection = await amqp.connect(rabbitmqUrl);
    channel = await connection.createChannel();
    console.log('[Users Service] Connected to RabbitMQ successfully');
}

async function subscribeToQueue(queueName, callback) {
    if (!channel) await connect();
    await channel.assertQueue(queueName);
    channel.consume(queueName, (message) => {
        callback(message.content.toString());
        channel.ack(message);
    });
}

async function publishToQueue(queueName, data) {
    if (!channel) await connect();
    await channel.assertQueue(queueName);
    channel.sendToQueue(queueName, Buffer.from(data));
}

module.exports = {
    subscribeToQueue,
    publishToQueue,
    connectRabbitMq
};
