import styles from '@/styles/SignIn.module.css'
import { SignIn } from "@clerk/nextjs";

const SignInPage = () => (
  <div className={styles.container}>
    <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
  </div>
  );

export default SignInPage;