'use server';
import { prisma } from '@/server/db/client';
import { auth, currentUser } from '@clerk/nextjs/server';
import { onGetAllAccountDomains } from '../settings';

export const onComplateUserRegistration = async (fullname: string, clerkId: string, type: string) => {
  try {
    const registered = await prisma.user.create({
      data: {
        fullname,
        clerkId,
        type,
        subscription: {
          create: {},
        },
      },
      select: {
        fullname: true,
        id: true,
        type: true,
      },
    });

    if (registered) return { status: 200, user: registered };
  } catch (error) {
    return { status: 400 };
  }
};

export const onLoginUser = async () => {
  const user = await currentUser();
  if (!user) return auth().redirectToSignIn();
  try {
    const authenticated = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        fullname: true,
        id: true,
        type: true,
      },
    });

    if (authenticated) {
      const domains = await onGetAllAccountDomains();
      return { status: 200, user: authenticated, domains: domains };
    }
  } catch (error) {
    console.log(error);

    return { status: 400 };
  }
};
