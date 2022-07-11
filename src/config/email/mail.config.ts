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
      //text: "Hey, this is a mockup email",
      html: inputHtml, // html body
    });
  } catch (error) {
    console.log("Something wrong with email: ", error);
  }

  console.log("Email Sent");
};

export const getTemplateConfirm = (name: string, token: string) => {
  const result = `


        <div id="email___content">
          <img src="https://img2.freepng.es/20180423/fjw/kisspng-digital-library-flat-design-medical-library-5addfbd00808f0.8776714215244973600329.jpg" width="100%" alt="">
          <h2>Hey ${name}</h2>
          <p>You must now confirm your email address using the following link: </p>
          <a
              href="http://localhost:4000/api/user/confirm/${token}"
              target="_blank"
          >Confirm your Account</a>
        </div>
  `;

  return result;
};

export const getTemplatePassNew = (name: string, token: string) => {
  const result = `


        <div id="email___content">
          <img src="https://img2.freepng.es/20180423/fjw/kisspng-digital-library-flat-design-medical-library-5addfbd00808f0.8776714215244973600329.jpg" width="100%" alt="">
          <h2>Hey ${name}</h2>
          <p>You must now confirm your password using the following link: </p>
          <a
              href="http://localhost:4000/api/user/newpass/${token}"
              target="_blank"
          >Confirm your Account</a>
        </div>
  `;

  return result;
};

export const getTemplateRecordatory = (name: string, infoBook: any) => {
  const result = `

        <div id="email___content">
          <img src="https://img2.freepng.es/20180423/fjw/kisspng-digital-library-flat-design-medical-library-5addfbd00808f0.8776714215244973600329.jpg" width="100%" alt="">
          <h1>Hey ${name}</h1>
          <p>Please we need that your book back. You must you pay infraction</p>
          <h2>Books Pending</h2>
          <ul> ${infoBook}</ul>

        </div>
  `;

  return result;
};

export const getTemplateTable = (titleTable: any, cellData: any) => {
  //title <tr> <th>Company</th> <th>Contact</th> <th>Country</th> </tr>
  //cellData   <tr> <td>Alfreds Futterkiste</td> <td>Maria Anders</td> <td>Germany</td> </tr>
  const result = `

  <body>
  
  <h2>Details of Infraction</h2>
  
  <table border="1" style='border-collapse:collapse;'>
    ${titleTable}
    ${cellData}
   
  </table>
  
  </body>
                          `;

  return result;
};

export const getTemplateOk = () => {
  const result = `

  <body>
  
  <h2>All of Book on Time</h2> 
  
  </body>
                          `;

  return result;
};
