import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { mailTrapClient , sender } from "./mailtrap.config.js"

export const sendVerificationEmail = async (email,userName , verificationToken)=>{
    const recipient = [{email}]

    try{
        const response = await mailTrapClient.send({
            from:sender,
            to: recipient,
            subject:"Verify Your Email",
            html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken).replace("{username}",email),
            category:"Email verification"
        })
        console.log("email sent successfully", response);
        
    } catch(error){
        console.error("error sending email", error);
        throw new Error(`Error sending email: ${error.message}`)
    
    }
}