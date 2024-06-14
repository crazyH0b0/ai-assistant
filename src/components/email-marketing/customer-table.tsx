'use client';
import React from 'react';
import { DataTable } from '../table';
import { EMAIL_MARKETING_HEADER } from '@/constants/menu';
import { TableCell, TableRow } from '../ui/table';
import { Card } from '../ui/card';
import { cn } from '@/lib/utils';
import { SideSheet } from '../sheet';
import Answers from './answers';

type CustomerTableProps = {
  domains: {
    customer: {
      Domain: {
        name: string;
      } | null;
      id: string;
      email: string | null;
    }[];
  }[];
  onSelect(email: string): void;
  select: string[];
  onId(id: string): void;
  id?: string;
};

export const CustomerTable = ({ domains, onSelect, select, onId, id }: CustomerTableProps) => {
  return (
    <DataTable headers={EMAIL_MARKETING_HEADER}>
      {domains.map((domain) =>
        domain.customer.map((c) => (
          <TableRow key={c.id}>
            <TableCell>
              <Card
                onClick={() => onSelect(c.email as string)}
                className={cn(
                  'rounded-full w-5 h-5 border-4 cursor-pointer',
                  select.includes(c.email as string) ? 'bg-orange' : 'bg-peach'
                )}
              />
            </TableCell>
            <TableCell>{c.email}</TableCell>
            <TableCell>
              <SideSheet
                title="答案"
                description="当客户回复机器人所提出的问题时，客户的问题会被存储"
                trigger={
                  <Card
                    className="bg-grandis py-2 px-4 cursor-pointer text-gray-700 hover:bg-orange"
                    onClick={() => onId(c.id)}
                  >
                    查看
                  </Card>
                }
              >
                <Answers id={id} />
              </SideSheet>
            </TableCell>
            <TableCell className="text-right">{c.Domain?.name}</TableCell>
          </TableRow>
        ))
      )}
    </DataTable>
  );
};
