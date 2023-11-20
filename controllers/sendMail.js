'use-strict';
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
   service: "gmail",
   auth: {
      user: "enessyyilmazb@gmail.com",
      pass: "mgxmpxmifkffekui"
   }
});

const sendEmail = (req , res , next) => {
  const {to , subject ,text} = req.body;
   console.log(req.body);
   const mailOptions = {
      from: "enessyyilmazb@gmail.com",
      to ,
      subject,
      text,
   };

   transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
         console.log(error);
         res.status(500).send("Internal Server Error");
      } else {
         console.log("Email sent: " + info.response);
         res.status(200).json({message:'email başarıyla gönderildi '});
      }
   });
}

module.exports = {
    sendEmail
}