import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });

import { adjectives, nouns } from "./words";
import nodemailer from "nodemailer";
import sgTransport from "nodemailer-sendgrid-transport";
import jwt from "jsonwebtoken";

export const generateSecret = () => {
  const randomNumber = Math.floor(Math.random() * adjectives.length);
  return `${adjectives[randomNumber]} ${nouns[randomNumber]}`;
};

console.log(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD)

// 아래 email은 email 주소만 말하는게 아니라 보내는데에 필요한 모든것을 포함.
// sendMail은 Promise 함수를 리턴.
// requestSecret.js에 이미 try catch가 작성되어 있다.
const sendMail = email => {
  const options = {
    auth: {
      api_user: process.env.SENDGRID_USERNAME,
      api_key: process.env.SENDGRID_PASSWORD
    }
  };
  const client = nodemailer.createTransport(sgTransport(options));
  return client.sendMail(email);
};

// sign 함수를 실행할 때 payload를 입력해야 함. (우리는 id를 입력) secretKey는 process.env에 있음.
// 암호화 하고 해독할 때 같은 private key를 사용.
export const generateToken = id => jwt.sign({ id }, process.env.JWT_SECRET);

// sendSecretMail은 sendMail을 리턴
export const sendSecretMail = (adress, secret) => {
  const email = {
    from: "hamin@mucstagram.com",
    to: adress,
    subject: "🔒Login Secret for Prismagram🔒",
    html: `Hello! Your login secret is <strong>${secret}</strong>.<br/>Copy paste on the app/website to log in`
  };
  return sendMail(email);
};