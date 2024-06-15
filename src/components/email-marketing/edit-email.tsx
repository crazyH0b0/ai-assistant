'use client';
import React from 'react';

import { Button } from '../ui/button';
import { FieldErrors, FieldValues, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import FormGenerator from '../forms/form-generator';
import { useEditEmail } from '@/hooks/email-marketing/use-marketing';
import Loader from '../loader';

type EditEmailProps = {
  id: string;
  onCreate(): void;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  setDefault: UseFormSetValue<FieldValues>;
};

export const EditEmail = ({ id, onCreate, errors, register, setDefault }: EditEmailProps) => {
  const { loading } = useEditEmail(id);

  return (
    <form onSubmit={onCreate} className="flex flex-col gap-3">
      <Loader loading={loading}>
        <FormGenerator
          name="description"
          label="内容"
          register={register}
          errors={errors}
          inputType="textarea"
          lines={10}
          placeholder="邮件内容..."
          type="text"
        />
        <Button>保存</Button>
      </Loader>
    </form>
  );
};
