'use server';
import { prisma } from '@/server/db/client';
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';

// 查询过滤问题
export async function onGetAllFilterQuestions(id: string) {
  console.log({ id });

  try {
    const questions = await prisma.filterQuestions.findMany({
      where: {
        domainId: id,
      },
      select: {
        question: true,
        id: true,
      },
      orderBy: {
        question: 'asc',
      },
    });

    if (questions) return { status: 200, message: '', questions: questions };
    return { status: 400, message: '出错了~' };
  } catch (error) {
    console.log(error);
  }
}

// 创建过滤问题
export async function onCreateFilterQuestions(id: string, question: string) {
  try {
    const filterQuestion = await prisma.domain.update({
      where: {
        id,
      },
      data: {
        filterQuestions: {
          create: {
            question,
          },
        },
      },
      include: {
        filterQuestions: {
          select: {
            id: true,
            question: true,
          },
        },
      },
    });

    if (filterQuestion) return { status: 200, message: '过滤问题添加成功', questions: filterQuestion.filterQuestions };
    return { status: 400, message: '出错了~' };
  } catch (error) {
    console.log(error);
  }
}

// 获取 helpDesk 问答
export async function onGetAllHelpDeskQuestions(id: string) {
  const user = await currentUser();
  if (!user) return auth().redirectToSignIn();
  try {
    const questions = await prisma.helpDesk.findMany({
      where: {
        domainId: id,
      },
      select: {
        question: true,
        answer: true,
        id: true,
      },
    });
    console.log(1, questions);

    return {
      status: 200,
      message: '问答添加成功',
      questions,
    };
  } catch (error) {
    console.log(error);
  }
}

// 创建 helpDesk 问答
export async function onCreateHelpDeskQuestion(id: string, question: string, answer: string) {
  const user = await currentUser();
  if (!user) return auth().redirectToSignIn();
  try {
    const helpQuestion = await prisma.domain.update({
      where: {
        id,
      },
      data: {
        helpdesk: {
          create: {
            question,
            answer,
          },
        },
      },
      include: {
        helpdesk: {
          select: {
            id: true,
            question: true,
            answer: true,
          },
        },
      },
    });
    if (helpQuestion) return { status: 200, message: '新的帮助问题已被添加', questions: helpQuestion.helpdesk };

    return {
      status: 400,
      message: '出错了~',
    };
  } catch (error) {
    console.log(error);
  }
}

// 删除域名
export async function onDeletedUserDomain(id: string) {
  const user = await currentUser();
  if (!user) return auth().redirectToSignIn();

  try {
    const validUser = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        id: true,
      },
    });

    if (validUser) {
      // 检查需要被删除的域名是否属于该用户
      const deletedDomain = await prisma.domain.delete({
        where: {
          userId: validUser.id,
          id,
        },
        select: {
          name: true,
        },
      });

      if (deletedDomain) return { status: 200, message: `${deletedDomain.name} 删除成功~` };
    }
  } catch (error) {
    console.log(error);
  }
}

// 更新机器人欢迎语
export async function onUpdateWelcomeMessage(message: string, domainId: string) {
  const user = await currentUser();
  if (!user) return auth().redirectToSignIn();

  try {
    const update = await prisma.domain.update({
      where: {
        id: domainId,
      },
      data: {
        chatBot: {
          update: {
            data: {
              welcomeMessage: message,
            },
          },
        },
      },
    });
    if (update) return { status: 200, message: '欢迎信息更新成功' };
  } catch (error) {
    console.log(error);
  }
}

// 更新机器人 icon
export async function onChatBotImageUpdate(id: string, icon: string) {
  const user = await currentUser();
  if (!user) return auth().redirectToSignIn();

  try {
    const domain = await prisma.domain.update({
      where: {
        id,
      },
      data: {
        chatBot: {
          update: {
            data: {
              icon,
            },
          },
        },
      },
    });

    if (domain) return { status: 200, message: '域名更新成功' };

    return { status: 400, message: '出错了' };
  } catch (error) {
    console.log(error);
  }
}

// 更新域名
export async function onUpdateDomain(id: string, name: string) {
  const user = await currentUser();
  if (!user) return auth().redirectToSignIn();
  try {
    const domainExists = await prisma.domain.findFirst({
      where: {
        name: {
          contains: name,
        },
      },
    });

    if (!domainExists) {
      const domain = await prisma.domain.update({
        where: {
          id,
        },
        data: {
          name,
        },
      });
      if (domain) return { status: 200, message: '域名更新成功~' };
      return { status: 400, message: '出错了~' };
    }

    if (domainExists) return { status: 400, message: '该域名名字已存在' };
  } catch (error) {
    console.log(error);
  }
}

// 获取域名
export async function onGetCurrentDomain(domain: string) {
  const user = await currentUser();
  if (!user) return auth().redirectToSignIn();
  try {
    const userDomain = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        domains: {
          where: {
            name: {
              contains: domain,
            },
          },
          select: {
            id: true,
            name: true,
            icon: true,
            userId: true,
            chatBot: {
              select: {
                id: true,
                welcomeMessage: true,
                icon: true,
              },
            },
          },
        },
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });
    if (userDomain) return userDomain;
  } catch (error) {
    console.log(error);
  }
}

// 修改密码
export async function onUpdatePassword(password: string) {
  try {
    const user = await currentUser();
    if (!user) return auth().redirectToSignIn();
    const update = await clerkClient.users.updateUser(user.id, { password });
    if (update) return { status: 200, message: '密码更新成功~' };
  } catch (error) {
    console.log(error);
  }
}

// 添加域名
export async function handleAddDomainAction(doamin: string, icon: string) {
  const user = await currentUser();
  if (!user) return auth().redirectToSignIn();
  try {
    const subscription = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        _count: {
          select: {
            domains: true,
          },
        },
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });
    const domainExists = await prisma.user.findFirst({
      where: {
        clerkId: user.id,
        domains: {
          some: {
            name: doamin,
          },
        },
      },
    });
    if (!domainExists) {
      if (
        (subscription?.subscription?.plan == 'STANDARD' && subscription._count.domains < 1) ||
        (subscription?.subscription?.plan == 'PRO' && subscription._count.domains < 5) ||
        (subscription?.subscription?.plan == 'ULTIMATE' && subscription._count.domains < 10)
      ) {
        const newDomain = await prisma.user.update({
          where: {
            clerkId: user.id,
          },
          data: {
            domains: {
              create: {
                name: doamin,
                icon,
                chatBot: {
                  create: {
                    welcomeMessage: '嗨，你有什么问题吗？',
                  },
                },
              },
            },
          },
        });
        if (newDomain) {
          return { status: 200, message: '域名添加成功' };
        }
        return {
          status: 400,
          message: '可添加域名超出上限，请升级订阅~',
        };
      }
    }
    return {
      status: 400,
      message: '域名已存在',
    };
  } catch (error) {
    console.log(error);
  }
}

// 获取用户的域名
export const onGetAllAccountDomains = async () => {
  const user = await currentUser();
  if (!user) return auth().redirectToSignIn();

  try {
    const domains = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        id: true,
        domains: {
          select: {
            name: true,
            icon: true,
            id: true,
            customer: {
              select: {
                chatRoom: {
                  select: {
                    id: true,
                    live: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return { ...domains };
  } catch (error) {
    console.log(error);
  }
};
