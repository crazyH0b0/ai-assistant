'use client';
import { useAuthContext } from '@/context/use-auth-context';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import TypeSelectionForm from './type-selection-form';
import dynamic from 'next/dynamic';
import { Spinner } from '@/components/spinner';

const DetailForm = dynamic(() => import('./account-detail-form'), {
  ssr: false,
  loading: () => <Spinner />,
});

const OTPForm = dynamic(() => import('./OTP-Form'), {
  ssr: false,
  loading: () => <Spinner />,
});

const RegistrationFormStep = () => {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();
  const { currentStep } = useAuthContext();
  const [OTP, setOTP] = React.useState('');
  const [userType, setUserType] = React.useState<'owner' | 'student'>('owner');
  setValue('otp', OTP);

  switch (currentStep) {
    case 1:
      return <TypeSelectionForm register={register} userType={userType} setUserType={setUserType} />;
    case 2:
      return <DetailForm errors={errors} register={register} />;
    case 3:
      return <OTPForm otp={OTP} setOTP={setOTP} />;
  }

  return <div>RegistrationFormStep</div>;
};

export default RegistrationFormStep;
