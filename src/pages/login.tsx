import { SignIn } from "@clerk/clerk-react";

import Footer from "../components/footer";

const LoginPage: React.FC = () => {
  return (
    <div className="flex align-center justify-center h-screen mt-10">
      <SignIn routing="path" path="/sign-in" />
      <Footer />
    </div>
  );
};

export default LoginPage;
