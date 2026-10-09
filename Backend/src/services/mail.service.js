// import nodemailer from "nodemailer"

// const transporter = nodemailer.createTransport({
//     service : 'gmail' ,
//     auth : {
//         type : 'OAuth2' ,
//         user : process.env.GOOGLE_USER ,
//         clientSecret : process.env.GOOGLE_CLIENT_SECRET ,
//         refreshToken : process.env.GOOGLE_REFRESH_TOKEN ,
//         clientId : process.env.GOOGLE_CLIENT_ID ,

//     } 
// })


// transporter.verify()
// .then(()=>{console.log('Email transporter is ready to send emails')})
// .catch((err)=>{console.error("Email transporter verification failed" , err)})

// export async function sendEmail({ to , subject , html , text}) {
//     const mailOptions = {

//         from : process.env.GOOGLE_USER ,
//         to ,
//         subject ,
//         html ,
//         text 
//     }    

//     const details = await transporter.sendMail(mailOptions)
//     console.log("Email sent " , details)
// }


async function getAccessToken() {
    const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
            grant_type: "refresh_token",
        }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(`Google token error: ${JSON.stringify(data)}`)
    return data.access_token
}

export async function sendEmail({ to, subject, html, text }) {
    const accessToken = await getAccessToken()

    const body = Buffer.from(html || text || "").toString("base64").replace(/.{76}/g, "$&\r\n")

    const mime = [
        `From: ${process.env.GOOGLE_USER}`,
        `To: ${to}`,
        `Subject: =?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`,
        "MIME-Version: 1.0",
        'Content-Type: text/html; charset="UTF-8"',
        "Content-Transfer-Encoding: base64",
        "",
        body,
    ].join("\r\n")

    const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw: Buffer.from(mime).toString("base64url") }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(`Gmail API error: ${JSON.stringify(data)}`)
    console.log("Email sent", data.id)
}