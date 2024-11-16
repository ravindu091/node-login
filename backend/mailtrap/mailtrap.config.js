import dotenv from 'dotenv'
import { MailtrapClient } from 'mailtrap';
dotenv.config();  

const TOKEN = process.env.MAILTRAP_TOKEN ;

export const mailTrapClient = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "Mailtrap Test 3",
};
