import { onDomainCustomerResponses, onGetAllDomainBookings } from '@/actions/appointment';
import PortalForm from '@/components/forms/portal/portal-form';
import React from 'react';

type Props = { params: { domainId: string; customerId: string } };

const CustomerSignUpForm = async ({ params }: Props) => {
  const questions = await onDomainCustomerResponses(params.customerId);
  const bookings = await onGetAllDomainBookings(params.domainId);

  if (!questions) return null;

  return (
    <PortalForm
      bookings={bookings}
      email={questions.email!}
      domainId={params.domainId}
      customerId={params.customerId}
      questions={questions.questions}
      type="Appointment"
    />
  );
};

export default CustomerSignUpForm;
