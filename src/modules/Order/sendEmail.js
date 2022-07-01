import nodeMailer from 'nodemailer'

export default async function(data, message, email, type) {
    try {
      const transporter = await nodeMailer.createTransport({
        service: "gmail",
        auth: {
          user: "umid09tuxtayev@gmail.com", // generated ethereal user
          pass: process.env.E_PASS, // generated ethereal password
        },
      })

      if(type == 'order') {
        let info = await transporter.sendMail({
          from: "umid09tuxtayev@gmail.com",
          to: email,
          subject: "New order notification",
          text: `${message}, \n User info: ${data}`,
          html: `<p>You may approve the order by clicking the link below: </p><br><a href=http://localhost:5000/book/approve/${data.book_id}/${data.order_id}"">Approve</a>
          <p>You may reject the order by clicking the link below: </p><br><a href=http://localhost:5000/book/reject/${data.book_id}/${data.order_id}"">Reject</a>`
        })
      } 

      if(type == 'buy') {
        let info = await transporter.sendMail({
          from: "umid09tuxtayev@gmail.com",
          to: email,
          subject: "New order notification",
          text: `${message}, \n User info: ${data}`,
          html: `<p>You may approve the order by clicking the link below: </p><br><a href=http://localhost:5000/book/buy/approve/${data.order_id}"">Approve</a>
          <p>You may reject the order by clicking the link below: </p><br><a href=http://localhost:5000/book/buy/reject/${data.order_id}"">Reject</a>`
        })
      } 

      if(type == 'approve' || type == 'reject') {
        let info = await transporter.sendMail({
          from: "umid09tuxtayev@gmail.com",
          to: email,
          subject: `Order is ${type}ed` ,
          text: `${message}, \n User info: ${data}`,
        })
      }

    } catch (e) {
      throw new Error(e.message)
    }

}