import styles from '@/styles/SignUp.module.css'
import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => (
    <div className={styles.container}>
        <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </div>
  );

export default SignUpPage;