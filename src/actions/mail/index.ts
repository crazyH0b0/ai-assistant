'use server';
import { prisma } from '@/server/db/client';
import { currentUser } from '@clerk/nextjs/server';
import nodemailer from 'nodemailer';

export const onMailer = (email: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.NODE_MAILER_EMAIL,
      pass: process.env.NODE_MAILER_GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.NODE_MAILER_EMAIL,
    to: email,
    subject: '人工客服支持',
    text: '您有一位客户需要人工客服帮助, 请你进入聊天室并打开实时模式',
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

export const onGetAllCustomers = async (id: string) => {
  try {
    const customers = await prisma.user.findUnique({
      where: {
        clerkId: id,
      },
      select: {
        subscription: {
          select: {
            credits: true,
            plan: true,
          },
        },
        domains: {
          select: {
            customer: {
              select: {
                id: true,
                email: true,
                Domain: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (customers) {
      return customers;
    }
  } catch (error) {}
};

export const onGetAllCampaigns = async (id: string) => {
  try {
    const campaigns = await prisma.user.findUnique({
      where: {
        clerkId: id,
      },
      select: {
        campaign: {
          select: {
            name: true,
            id: true,
            customers: true,
            createdAt: true,
          },
        },
      },
    });

    if (campaigns) {
      return campaigns;
    }
  } catch (error) {
    console.log(error);
  }
};

export const onCreateMarketingCampaign = async (name: string) => {
  try {
    const user = await currentUser();
    if (!user) return null;

    const campaign = await prisma.user.update({
      where: {
        clerkId: user.id,
      },
      data: {
        campaign: {
          create: {
            name,
          },
        },
      },
    });

    if (campaign) {
      return { status: 200, message: '活动创建成功~' };
    }
  } catch (error) {
    console.log(error);
  }
};

export const onSaveEmailTemplate = async (template: string, campainId: string) => {
  try {
    const newTemplate = await prisma.campaign.update({
      where: {
        id: campainId,
      },
      data: {
        template,
      },
    });

    return { status: 200, message: 'Email template created' };
  } catch (error) {
    console.log(error);
  }
};

export const onAddCustomersToEmail = async (customers: string[], id: string) => {
  try {
    const customerAdd = await prisma.campaign.update({
      where: {
        id,
      },
      data: {
        customers,
      },
    });

    if (customerAdd) {
      return { status: 200, message: '客户已添加到活动中~' };
    }
  } catch (error) {}
};

export const onBulkMailer = async (email: string[], campaignId: string) => {
  try {
    const user = await currentUser();
    if (!user) return null;

    //get the template for this campaign
    const template = await prisma.campaign.findUnique({
      where: {
        id: campaignId,
      },
      select: {
        name: true,
        template: true,
      },
    });

    if (template && template.template) {
      const transporter = nodemailer.createTransport({
        host: 'smtp.qq.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.NODE_MAILER_EMAIL,
          pass: process.env.NODE_MAILER_GMAIL_APP_PASSWORD,
        },
      });

      const mailOptions = {
        from: '1327185450@qq.com',
        to: email,
        subject: template.name,
        text: JSON.parse(template.template),
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      const creditsUsed = await prisma.user.update({
        where: {
          clerkId: user.id,
        },
        data: {
          subscription: {
            update: {
              credits: { decrement: email.length },
            },
          },
        },
      });
      if (creditsUsed) {
        return { status: 200, message: '邮件发送成功' };
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const onGetAllCustomerResponses = async (id: string) => {
  try {
    const user = await currentUser();
    if (!user) return null;
    const answers = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        domains: {
          select: {
            customer: {
              select: {
                questions: {
                  where: {
                    customerId: id,
                    answered: {
                      not: null,
                    },
                  },
                  select: {
                    question: true,
                    answered: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (answers) {
      return answers.domains;
    }
  } catch (error) {
    console.log(error);
  }
};

export const onGetEmailTemplate = async (id: string) => {
  try {
    const template = await prisma.campaign.findUnique({
      where: {
        id,
      },
      select: {
        template: true,
      },
    });

    if (template) {
      return template.template;
    }
  } catch (error) {
    console.log(error);
  }
};
