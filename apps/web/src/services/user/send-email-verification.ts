import { sendEmailVerification, User } from "firebase/auth";

async function sendEmailVerificationService(user: User) {
  await sendEmailVerification(user);
  console.log("E-mail check sent!");
}

export default sendEmailVerificationService;
