import { ConversationSearchProps } from '@/schemas/conversation.schema';
import React from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';

interface Props {
  register: UseFormRegister<ConversationSearchProps>;
  domains?: {
    name: string;
    id: string;
    icon: string;
  }[];
}

const ConversationSearch = ({ register, domains }: Props) => {
  return (
    <div className="flex flex-col py-3">
      <select {...register('domain')} className="px-3 py-4 text-sm border-[1px] rounded-lg mr-5">
        <option disabled selected>
          域名名称
        </option>
        {domains?.map((domain) => (
          <option value={domain.id} key={domain.id}>
            {domain.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ConversationSearch;
