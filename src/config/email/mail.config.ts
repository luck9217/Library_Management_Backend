import nodemailer from "nodemailer";
import { environment } from "../environment";

const mail = {
  user: environment.EMAIL_TEST,
  pass: environment.Email_TEST_PASS,
};

const transporter = nodemailer.createTransport({
  service: "Gmail", // config on gmail account , app password
  auth: {
    user: mail.user,
    pass: mail.pass,
  },
});

export const sendEmail = async (
  inputSubject: string,
  inputTo: string,
  inputHtml: any
) => {
  try {
    await transporter.sendMail({
      from: `Library Admin <${mail.user}>`,
      to: inputSubject,
      subject: inputTo,
      text: "Hey, this is a mockup email",
      html: inputHtml, // html body
    });
  } catch (error) {
    console.log("Something wrong with email: ", error);
  }

  console.log(inputHtml);

  const getTemplate = (name: any, token: any) => {
    return `
          <head>
              <link rel="stylesheet" href="./style.css">
          </head>
          
          <div id="email___content">
              <img src="https://i.imgur.com/eboNR82.png" alt="">
              <h2>Hola ${name}</h2>
              <p>Para confirmar tu cuenta, ingresa al siguiente enlace</p>
              <a
                  href="http://localhost:4000/api/user/confirm/${token}"
                  target="_blank"
              >Confirmar Cuenta</a>
          </div>
        `;
  };
};

export const Template = (name:string,token:string) => {

  const result=`
          <head>
          <link rel="stylesheet" href="./style.css">
        </head>

        <div id="email___content">
          <img src="https://i.imgur.com/eboNR82.png" alt="">
          <h2>Hola ${name}</h2>
          <p>Para confirmar tu cuenta, ingresa al siguiente enlace</p>
          <a
              href="http://localhost:4000/api/user/confirm/${token}"
              target="_blank"
          >Confirmar Cuenta</a>
        </div>
  `
  
  return result
  

  
};
