'use client';
import {
  onChatBotImageUpdate,
  onCreateFilterQuestions,
  onCreateHelpDeskQuestion,
  onDeletedUserDomain,
  onGetAllFilterQuestions,
  onGetAllHelpDeskQuestions,
  onUpdateDomain,
  onUpdatePassword,
  onUpdateWelcomeMessage,
} from '@/actions/settings';
import { useToast } from '@/components/ui/use-toast';
import { ChangePasswordSchema } from '@/schemas/auth.schema';
import { DomainSettingsSchema, FilterQuestionsSchema, HelpDeskQuestionsSchema } from '@/schemas/settings.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export function useFilterQuestions(id: string) {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [questions, setQuestions] = React.useState<{ id: string; question: string }[]>([]);

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof FilterQuestionsSchema>>({
    resolver: zodResolver(FilterQuestionsSchema),
    mode: 'onChange',
  });

  const onAddFilterQuestions = handleSubmit(async (values) => {
    setLoading(true);
    const questions = await onCreateFilterQuestions(id, values.question);

    if (questions) {
      setQuestions(questions.questions!);
      toast({
        title: questions.status === 200 ? '成功' : '失败',
        description: questions.message,
      });
      reset();
      setLoading(false);
    }
  });

  const onGetQuestions = async () => {
    setLoading(true);
    const questions = await onGetAllFilterQuestions(id);
    if (questions) {
      setQuestions(questions.questions!);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    onGetQuestions();
  }, []);

  return {
    loading,
    register,
    errors,
    onAddFilterQuestions,
    questions,
  };
}

export function useHelpDesk(id: string) {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [questions, setQuestions] = React.useState<{ id: string; question: string; answer: string }[]>([]);

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof HelpDeskQuestionsSchema>>({
    resolver: zodResolver(HelpDeskQuestionsSchema),
    mode: 'onChange',
  });

  const onSubmitQuestion = handleSubmit(async (values) => {
    setLoading(true);
    const question = await onCreateHelpDeskQuestion(id, values.question, values.answer);
    if (question) {
      setQuestions(question.questions!);
      toast({
        title: question.status === 200 ? '成功' : '失败',
      });
      setLoading(false);
      reset();
    }
  });

  const onGetQuestions = async () => {
    setLoading(true);
    const questions = await onGetAllHelpDeskQuestions(id);
    if (questions) {
      setQuestions(questions.questions);
      setLoading(false);
    }
  };
  React.useEffect(() => {
    onGetQuestions();
  }, []);

  return {
    register,
    onSubmitQuestion,
    loading,
    errors,
    questions,
  };
}

export function useSettings(id: string) {
  const router = useRouter();
  const { toast } = useToast();

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof DomainSettingsSchema>>({
    resolver: zodResolver(DomainSettingsSchema),
    mode: 'onChange',
  });

  const [loading, setLoading] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const onUpdateSettings = handleSubmit(async (values) => {
    setLoading(true);
    if (values.domain) {
      const domain = await onUpdateDomain(id, values.domain);
      if (domain) {
        toast({
          title: '成功',
          description: domain.message,
        });
      }
    }
    if (values.image[0]) {
      // const uploaded = await
      const uploadedUUid = crypto.randomUUID();
      const image = await onChatBotImageUpdate(id, uploadedUUid);
      if (image) {
        toast({
          title: image.status === 200 ? '成功' : '失败',
          description: image.message,
        });
        setLoading(false);
      }
    }
    if (values.welcomeMessage) {
      const message = await onUpdateWelcomeMessage(id, values.welcomeMessage);
      if (message) {
        toast({
          title: '成功',
          description: message.message,
        });
      }
    }
    reset();
    router.refresh();
    setLoading(false);
  });

  const onDeleteDomain = async () => {
    setDeleting(true);
    const deleted = await onDeletedUserDomain(id);
    if (deleted) {
      toast({
        title: '成功',
        description: deleted.message,
      });
      setDeleting(false);
      router.refresh();
    }
  };

  return {
    onDeleteDomain,
    onUpdateSettings,
    deleting,
    loading,
    register,
    errors,
  };
}

export function useThemeMode() {
  const { setTheme, theme } = useTheme();
  return {
    setTheme,
    theme,
  };
}

export function useChangePassword() {
  const [loading, setLoading] = React.useState(false);

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    mode: 'onChange',
  });
  const { toast } = useToast();
  const onChangePassword = handleSubmit(async (values) => {
    try {
      setLoading(true);
      const updated = await onUpdatePassword(values.password);
      if (updated) {
        reset();
        toast({
          title: '成功',
          description: updated.message,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  });
  return {
    register,
    onChangePassword,
    loading,
    errors,
  };
}
