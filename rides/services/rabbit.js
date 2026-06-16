const amqp = require('amqplib');

let channel = null;

const connectRabbitMQ = async () => {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    channel = await connection.createChannel();
    console.log('RabbitMQ connected');
    return channel;
};

const getChannel = () => {
    if (!channel) throw new Error('RabbitMQ not connected yet');
    return channel;
};

module.exports = { connectRabbitMQ, getChannel };