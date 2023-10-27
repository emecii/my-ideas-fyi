import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-6">
      <SignIn
        path="/sign-in"
        redirectUrl={"/"}
        signUpUrl="/sign-up"
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-inprogress hover:bg-inprogress hover:brightness-95 text-sm normal-case",

            formButtonSecondary: "bg-inprogress text-sm normal-case",
            footerActionText: " text-md",
            footerActionLink:
              "text-inprogress hover:text-inprogress hover:brightness-95 font-semibold text-md",
          },
        }}
      />
    </div>
  );
};

export function SigninRoute() {
  return <SignInPage />;
}

export default SignInPage;
