import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";
// import { light } from "@clerk/themes";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import "./App.css";

import LoginPage from "./pages/login";
import Dashboard from "./pages/dashboard";
import ClubMemberPage from "./pages/club-member";

// if (!import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY) {
//   throw new Error("Missing Publishable Key");
// }

const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY;
console.log(clerkPubKey);
const queryClient = new QueryClient();

function ClerkProviderWithRoutes() {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      navigate={(to) => navigate(to)}
      // appearance={{
      //   baseTheme: light,
      // }}
    >
      <Routes>
        <Route path="/sign-in/*" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <>
              <SignedIn>
                <Dashboard />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/club-member/:id"
          element={
            <>
              <SignedIn>
                <ClubMemberPage />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
      </Routes>
    </ClerkProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ClerkProviderWithRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
