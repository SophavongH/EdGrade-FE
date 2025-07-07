"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { login } from "../../lib/auth";
import { FIELD_NAME, FIELD_TYPES } from "../../constants";
import { Input } from "./input";
import { Button } from "./button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "./form";
import { useLanguage } from "../../lib/LanguageProvider";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginType = z.infer<typeof loginSchema>;

export default function AuthForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const form = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginType) => {
    form.clearErrors();
    const result = await login(data.email, data.password);

    if (result.error === "Account is suspended.") {
      toast.error(t("accountSuspended"));
      return;
    }

    if (result.success) {
      toast.success(t("loginSuccess"));
      if (result.token) localStorage.setItem("token", result.token);
      if (result.user?.id) localStorage.setItem("userId", result.user.id);
      router.push(result.role === "admin" ? "/admin" : "/school");
    } else {
      if (result.error?.toLowerCase().includes("email")) {
        form.setError("email", { message: result.error });
      } else if (result.error?.toLowerCase().includes("password")) {
        form.setError("password", { message: result.error });
      } else {
        toast.error(result.error || t("loginFailed"));
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {Object.keys(form.getValues()).map((field) => (
          <FormField
            key={field}
            control={form.control}
            name={field as keyof LoginType}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t(FIELD_NAME[field.name as keyof typeof FIELD_NAME])}
                </FormLabel>
                <FormControl>
                  <Input
                    type={FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button type="submit">{t("login")}</Button>
      </form>
    </Form>
  );
}
