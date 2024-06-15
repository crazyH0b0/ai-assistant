'use client';
import { useChangePassword } from '@/hooks/settings/use-settings';
import React from 'react';
import Section from '../section-label';
import FormGenerator from '../forms/form-generator';
import { Button } from '../ui/button';
import Loader from '../loader';

interface Props {}

const ChangePassword = (props: Props) => {
  const { register, loading, onChangePassword, errors } = useChangePassword();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
      <div className="lg:col-span-1">
        <Section label="修改密码" message="重置你的密码" />
      </div>
      <form onSubmit={onChangePassword} className="lg:col-span-4">
        <div className="lg:w-[500px] flex flex-col gap-3">
          <FormGenerator
            register={register}
            errors={errors}
            name="password"
            placeholder="新密码"
            type="password"
            inputType="input"
          />

          <FormGenerator
            register={register}
            errors={errors}
            name="comfirmPassword"
            placeholder="确认密码"
            type="password"
            inputType="input"
          />

          <Button type="submit" className="bg-grandis text-gray-700 font-semibold">
            <Loader loading={loading}>修改密码</Loader>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
