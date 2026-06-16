const amqp = require("amqplib");

let connection, channel;

async function connectRabbitMq() {
  if (channel) return;

  connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();
  channel.prefetch(1);

  connection.on("error", (err) => {
    console.error("[Captains Service] RabbitMQ connection error:", err);
    connection = null;
    channel = null;
  });

  connection.on("close", () => {
    console.warn("[Captains Service] RabbitMQ connection closed");
    connection = null;
    channel = null;
  });

  console.log("[Captains Service] Connected to RabbitMQ successfully");
}

async function subscribeToQueue(queueName, callback) {
  if (!channel) await connectRabbitMq();
  await channel.assertQueue(queueName, { durable: true });
  channel.consume(queueName, async (message) => {
    if (!message) return;
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

module.exports = { connectRabbitMq, subscribeToQueue, publishToQueue };