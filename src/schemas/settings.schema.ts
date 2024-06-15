import { z } from 'zod';

export const MAX_UPLOAD_SIZE = 1024 * 1024 * 2; // 2MB
export const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];

export type DomainSettingsProps = {
  domain?: string;
  image?: any;
  welcomeMessage?: string;
};

export type HelpDeskQuestionsProps = {
  question: string;
  answer: string;
};

export type AddProductProps = {
  name: string;
  image: any;
  price: string;
};

export type FilterQuestionsProps = {
  question: string;
};

export const AddDomainSchema = z.object({
  domain: z
    .string()
    .min(4, { message: 'A domain must have atleast 3 characters' })
    .refine(
      (value) => /^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,3}$/.test(value ?? ''),
      'This is not a valid domain'
    ),
  image: z
    .any()
    .refine((files) => files?.[0]?.size <= MAX_UPLOAD_SIZE, {
      message: 'Your file size must be less then 2MB',
    })
    .refine((files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type), {
      message: 'Only JPG, JPEG & PNG are accepted file formats',
    }),
});

export const DomainSettingsSchema = z
  .object({
    domain: z
      .string()
      .min(4, { message: '域名需要至少 3 个字符串' })
      .refine((value) => /^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,3}$/.test(value ?? ''), '域名格式不正确')
      .optional()
      .or(z.literal('').transform(() => undefined)),
    image: z.any().optional(),
    welcomeMessage: z
      .string()
      .min(6, '欢迎信息需要至少 6 个字符')
      .optional()
      .or(z.literal('').transform(() => undefined)),
  })
  .refine(
    (schema) => {
      if (schema.image?.length) {
        if (ACCEPTED_FILE_TYPES.includes(schema.image?.[0].type!) && schema.image?.[0].size <= MAX_UPLOAD_SIZE) {
          return true;
        }
      }
      if (!schema.image?.length) {
        return true;
      }
    },
    {
      message: 'The fill must be less then 2MB, and on PNG, JPEG & JPG files are accepted',
      path: ['image'],
    }
  );

export const HelpDeskQuestionsSchema = z.object({
  question: z.string().min(1, { message: '问题不能为空' }),
  answer: z.string().min(1, { message: '问题不能为空' }),
});

export const FilterQuestionsSchema = z.object({
  question: z.string().min(1, { message: '问题不能为空' }),
});

export const AddProductSchema = z.object({
  name: z.string().min(3, { message: '名称需要至少 3 个字符串' }),
  image: z
    .any()
    .refine((files) => files?.[0]?.size <= MAX_UPLOAD_SIZE, {
      message: 'Your file size must be less then 2MB',
    })
    .refine((files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type), {
      message: 'Only JPG, JPEG & PNG are accepted file formats',
    }),
  price: z.string(),
});
