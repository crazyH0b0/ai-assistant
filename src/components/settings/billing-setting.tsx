import { prisma } from '@/server/db/client';
import { currentUser } from '@clerk/nextjs/server';
import React from 'react';
import Section from '../section-label';
import { Card, CardContent, CardDescription } from '../ui/card';
import { Plus } from 'lucide-react';

interface Props {}

const BillingSetting = async (props: Props) => {
  let plan = null;

  try {
    const user = await currentUser();

    if (!user) return;

    const dbPlan = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });

    if (dbPlan) {
      plan = dbPlan.subscription?.plan;
    }
  } catch (error) {}
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
      <div className="lg:col-span-1">
        <Section label="账单设置" message="添加账号信息，升级或者修改订阅" />
      </div>

      <div className="lg:col-span-2 flex justify-start lg:justify-center">
        <Card
          className="border-dashed bg-cream border-gray-400 w-full
        cursor-pointer h-[200px] flex justify-center items-center
        "
        >
          <CardContent className="flex gap-2 items-center">
            <div className="rounded-full border-2 p-1">
              <Plus className="text-gray-400" />
            </div>
            <CardDescription className="font-semibold">开发中~</CardDescription>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <h3 className="text-xl font-semibold mb-2">当前订阅</h3>
        <p className="text-sm font-semibold">{plan}</p>
        <p className="text-sm font-light">
          {plan === 'PRO' ? '开始增长你的生意' : plan === 'ULTIMATE' ? '无限制' : '免费版'}
        </p>
      </div>
    </div>
  );
};

export default BillingSetting;
