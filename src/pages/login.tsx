import { SignIn } from "@clerk/clerk-react";

import Footer from "../components/footer";

const LoginPage: React.FC = () => {
  return (
    <div className="h-full flex justify-center mt-32">
      <SignIn routing="path" path="/sign-in" />
      <Footer />
    </div>
  );
};

export default LoginPage;
