import React from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import UserTypeCard from './user-type-card';

interface Props {
  register: UseFormRegister<FieldValues>;
  userType: 'owner' | 'student';
  setUserType: React.Dispatch<React.SetStateAction<'owner' | 'student'>>;
}

const TypeSelectionForm = ({ register, userType, setUserType }: Props) => {
  return (
    <>
      <h2 className="text-gravel md:text-4xl font-bold">创建账号</h2>
      <UserTypeCard
        register={register}
        userType={userType}
        setUserType={setUserType}
        value="owner"
        title="拥有企业"
        text="为企业创建账号"
      />

      <UserTypeCard
        register={register}
        userType={userType}
        setUserType={setUserType}
        value="student"
        title="我是游客"
        text="我想试试该应用"
      />
    </>
  );
};

export default TypeSelectionForm;
