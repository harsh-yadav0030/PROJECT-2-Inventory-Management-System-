import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
});

const sendEmail = async ({
    to,
    subject,
    text,
    html = "",
}) => {
    const info=await transporter.sendMail({
        from: `"Inventory Management System" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
    });
    // console.log(info);
};

export default sendEmail;