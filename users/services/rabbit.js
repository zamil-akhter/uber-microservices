const amqp = require("amqplib");

let connection, channel;

async function connectRabbitMq() {
  connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();
  channel.prefetch(1);
  console.log("[Users Service] Connected to RabbitMQ successfully");
}

async function subscribeToQueue(queueName, callback) {
  if (!channel) await connectRabbitMq();
  await channel.assertQueue(queueName, { durable: true });
  channel.consume(queueName, async (message) => {
    try {
      await callback(JSON.parse(message.content.toString()));
      channel.ack(message);
    } catch (err) {
      console.error("Processing failed:", err);
      channel.nack(message, false, true);
    }
  });
}

async function publishToQueue(queueName, data) {
  if (!channel) await connectRabbitMq();
  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), {
    persistent: true,
  });
}

module.exports = {
  subscribeToQueue,
  publishToQueue,
  connectRabbitMq,
};
