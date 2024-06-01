import { ZodType, z } from 'zod'

export type UserRegistrationProps = {
  type: string
  fullname: string
  email: string
  confirmEmail: string
  password: string
  confirmPassword: string
  otp: string
}

export const UserRegistrationSchema: ZodType<UserRegistrationProps> = z
  .object({
    type: z.string().min(1),
    fullname: z
      .string()
      .min(4, { message: '用户名必须至少为4个字符' }),
    email: z.string().email({ message: '邮箱格式不正确' }),
    confirmEmail: z.string().email({message: '邮箱格式不正确'}),
    password: z
      .string()
      .min(8, { message: '密码必须至少包含8个字符' })
      .max(64, {
        message: '密码长度不能超过64个字符',
      })
      .refine(
        (value) => /^[a-zA-Z0-9_.-]*$/.test(value ?? ''),
        '密码只能包含字母和数字'
      ),
    confirmPassword: z.string(),
    otp: z.string().min(6, { message: '你必须输入一个6位数的代码' }),
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  })
  .refine((schema) => schema.email === schema.confirmEmail, {
    message: '两次输入的邮箱不一致',
    path: ['confirmEmail'],
  })

export type UserLoginProps = {
  email: string
  password: string
}

export type ChangePasswordProps = {
  password: string
  confirmPassword: string
}

export const UserLoginSchema: ZodType<UserLoginProps> = z.object({
  email: z.string().email({ message: '请输入有效的电子邮件地址' }),
  password: z
    .string()
    .min(8, { message: '密码必须至少包含8个字符' })
    .max(64, {
      message: '密码长度不能超过64个字符',
    }),
})

export const ChangePasswordSchema: ZodType<ChangePasswordProps> = z
  .object({
    password: z
      .string()
      .min(8, { message: '密码必须至少包含8个字符' })
      .max(64, {
        message: '密码长度不能超过64个字符',
      })
      .refine(
        (value) => /^[a-zA-Z0-9_.-]*$/.test(value ?? ''),
        '密码只能包含字母和数字'
      ),
    confirmPassword: z.string(),
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  })