import { APPOINTMENT_TABLE_HEADER } from '@/constants/menu';
import React from 'react';
import { TableCell, TableRow } from '../ui/table';
import { getMonthName } from '@/lib/utils';
import { CardDescription } from '../ui/card';
import { DataTable } from '../table';

type Props = {
  bookings:
    | {
        Customer: {
          Domain: {
            name: string;
          } | null;
        } | null;
        id: string;
        email: string;
        domainId: string | null;
        date: Date;
        slot: string;
        createdAt: Date;
      }[]
    | undefined;
};

const AllAppointments = ({ bookings }: Props) => {
  return (
    <DataTable headers={APPOINTMENT_TABLE_HEADER}>
      {bookings ? (
        bookings.map((booking) => (
          <TableRow key={booking.id}>
            <TableCell>{booking.email}</TableCell>
            <TableCell>
              <div>
                {booking.date.getFullYear()} {getMonthName(booking.date.getMonth())} {booking.date.getDate()}
              </div>
              <div className="">{booking.slot}</div>
            </TableCell>
            <TableCell>
              <div>
                {booking.createdAt.getFullYear()} {getMonthName(booking.createdAt.getMonth())}
                {booking.createdAt.getDate()}{' '}
              </div>
              <div>
                {booking.createdAt.getHours()} {booking.createdAt.getMinutes()}{' '}
                {booking.createdAt.getHours() > 12 ? '下午' : '上午'}
              </div>
            </TableCell>
            <TableCell className="text-right">{booking.Customer?.Domain?.name}</TableCell>
          </TableRow>
        ))
      ) : (
        <CardDescription>无预约</CardDescription>
      )}
    </DataTable>
  );
};

export default AllAppointments;
