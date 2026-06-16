const amqp = require('amqplib');

let channel = null;

const QUEUES = []; // add queue names here when users service needs them

const connectRabbitMQ = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  channel = await connection.createChannel();
  channel.prefetch(1);

  for (const queue of QUEUES) {
    await channel.assertQueue(queue, { durable: true });
  }

  console.log('[Users Service] RabbitMQ connected, queues ready');
  return channel;
};

const getChannel = () => {
  if (!channel) throw new Error('RabbitMQ not connected yet');
  return channel;
};

const subscribeToQueue = async (queueName, callback) => {
  const ch = getChannel();
  ch.consume(queueName, async (msg) => {
    if (!msg) return;
    try {
      await callback(JSON.parse(msg.content.toString()));
      ch.ack(msg);
    } catch (err) {
      console.error('[Users Service] Processing failed:', err);
      ch.nack(msg, false, true);
    }
  });
};

const publishToQueue = (queueName, data) => {
  const ch = getChannel();
  ch.sendToQueue(
    queueName,
    Buffer.from(JSON.stringify(data)),
    { persistent: true }
  );
};

module.exports = { connectRabbitMQ, getChannel, subscribeToQueue, publishToQueue };