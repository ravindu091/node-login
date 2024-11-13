import https from 'https';
import dotenv from 'dotenv'
import { MailtrapClient } from "mailtrap";


dotenv.config();

const TOKEN = ''

const client = new MailtrapClient({
    token: TOKEN,
    httpsAgent: new https.Agent({
      keepAlive: true,
      minVersion: "TLSv1.2"}),
});

const sender = {
  email: "hello@demomailtrap.com",
  name: "bob Test",
};
const recipients = [
  {
    email: "936doralynn@rowdydow.com",
  }
];

client
  .send({
    from: sender,
    to: recipients,
    subject: "You are awesome!",
    text: "Congrats for sending test email with Mailtrap!",
    category: "Integration Test",
  })
  .then(console.log, console.error);