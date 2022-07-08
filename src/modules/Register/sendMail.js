import nodeMailer from 'nodemailer'

export default async function(id, token, email) {
    try {
      const transporter = await nodeMailer.createTransport({
        service: "gmail",
        auth: {
          user: "umid09tuxtayev@gmail.com", // generated ethereal user
          pass: process.env.E_PASS, // generated ethereal password
        },
      })

      let info = await transporter.sendMail({
        from: "umid09tuxtayev@gmail.com",
        to: email,
        subject: "Verification email",
        text: "Please, verify your email by press the link below!",
        html: `<p><a href="${process.env.SERVER_HOST}:5000/${id}/verify/${token}"> Please, verify your account by clicking the link!</p>`
      })

    } catch (e) {
      throw new Error(e.message)
    }

}