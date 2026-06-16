// captains/config/rabbitmq.js — same helper file, copy it here
const amqp = require('amqplib');

let channel = null;

const connectRabbitMQ = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  channel = await connection.createChannel();
  return channel;
};

const getChannel = () => channel;

module.exports = { connectRabbitMQ, getChannel };