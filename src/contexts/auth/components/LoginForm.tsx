"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Componente de formulário para autenticação, contendo apenas o fluxo padrão e real de login.
 */
export const LoginForm = () => {
  const { login } = useAuth();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data);
    } catch (error) {
      // Erro tratado internamente no hook
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        {/* Campo E-mail */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 font-medium">E-mail</FormLabel>
              <FormControl>
                <div className="relative flex items-center">
                  <Input 
                    type="email"
                    placeholder="seu@email.com" 
                    className="pr-10 h-11 border-slate-200 focus-visible:ring-indigo-500 rounded-lg transition-all w-full" 
                    {...field} 
                  />
                  <Mail className="absolute right-4 text-slate-400 h-5 w-5 pointer-events-none z-10" />
                </div>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Campo Senha */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 font-medium">Senha</FormLabel>
              <FormControl>
                <div className="relative flex items-center">
                  <Input 
                    type="password" 
                    placeholder="******" 
                    className="pr-10 h-11 border-slate-200 focus-visible:ring-indigo-500 rounded-lg transition-all w-full" 
                    {...field} 
                  />
                  <Lock className="absolute right-4 text-slate-400 h-5 w-5 pointer-events-none z-10" />
                </div>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <div className="pt-2">
          <Button 
            type="submit" 
            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-md shadow-indigo-100 transition-all flex items-center justify-center gap-2 group" 
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              "Entrando..."
            ) : (
              <>
                Entrar na conta 
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </Button>
        </div>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-100" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-400">Novo por aqui?</span>
          </div>
        </div>

        <p className="text-sm text-center text-slate-500">
          Não tem uma conta?{" "}
          <Link href="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-all">
            Cadastre-se grátis
          </Link>
        </p>
      </form>
    </Form>
  );
};