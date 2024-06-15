import { ZodType, z } from 'zod';

type EmailMarketingProps = {
  name: string;
};

type EmailMarketingBodyProps = {
  description: string;
};

export const EmailMarketingSchema: ZodType<EmailMarketingProps> = z.object({
  name: z.string().min(3, { message: '活动名称至少需要 3 个字符' }),
});

export const EmailMarketingBodySchema: ZodType<EmailMarketingBodyProps> = z.object({
  description: z.string().max(30, { message: '内容至少需要 5 个字符' }),
});
