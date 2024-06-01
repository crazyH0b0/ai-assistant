import SignUpFormProvider from "@/components/forms/sign-up/form-provider";
import StepBar from "@/components/forms/sign-up/step-bar";
import RegistrationFormStep from "@/components/forms/sign-up/registration-form-step";
import StepButton from "@/components/forms/sign-up/step-button";

export default function SignUp() {
  return <div  className="flex-1 py-36 md:px-16 w-full  ">
    <div className="flex flex-col h-full gap-3">
      <SignUpFormProvider>
        <div className="flex flex-col gap-3">
          <RegistrationFormStep />
          <StepButton />
        </div>
          <StepBar />
      </SignUpFormProvider>
    </div>
  </div>;
}