import { auth } from "../firebase";

async function checkUserEmailVerificationService() {
  const user = auth.currentUser;

  if (!user) {
    console.log("No authenticated user");
    return false;
  }

  await user.reload();
  return user.emailVerified;
}

export default checkUserEmailVerificationService;
