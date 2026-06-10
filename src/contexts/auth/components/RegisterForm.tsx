"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { User, Mail, Lock, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const registerSchema = z.object({
  fullName: z.string()
    .min(3, "O nome deve conter pelo menos 3 caracteres")
    .max(50, "O nome não pode exceder 50 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "O nome deve conter apenas letras"),
  email: z.string().email("Por favor, digite um e-mail válido"),
  password: z.string().min(6, "A senha deve conter no mínimo 6 caracteres"),
  confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

/**
 * Componente do formulário de cadastro, projetado com uma interface limpa, moderna e foca em UX.
 */
export const RegisterForm = () => {
  const { register } = useAuth();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await register({ 
        email: data.email, 
        password: data.password, 
        fullName: data.fullName 
      });
    } catch (error) {
      // Erro tratado internamente pelo useAuth
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        {/* Campo Nome Completo */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 font-medium">Nome Completo</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <Input 
                    placeholder="Seu nome" 
                    className="pl-10 h-11 border-slate-200 focus-visible:ring-indigo-500 rounded-lg transition-all" 
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Campo E-mail */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 font-medium">E-mail</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <Input 
                    type="email"
                    placeholder="exemplo@email.com" 
                    className="pl-10 h-11 border-slate-200 focus-visible:ring-indigo-500 rounded-lg transition-all" 
                    {...field} 
                  />
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
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <Input 
                    type="password" 
                    placeholder="Mínimo 6 caracteres" 
                    className="pl-10 h-11 border-slate-200 focus-visible:ring-indigo-500 rounded-lg transition-all" 
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Campo Confirmar Senha */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 font-medium">Confirmar Senha</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <Input 
                    type="password" 
                    placeholder="Repita sua senha" 
                    className="pl-10 h-11 border-slate-200 focus-visible:ring-indigo-500 rounded-lg transition-all" 
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-md shadow-indigo-100 transition-all flex items-center justify-center gap-2 group mt-2" 
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            "Criando sua conta..."
          ) : (
            <>
              Criar minha conta 
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-100" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-400">Ou se preferir</span>
          </div>
        </div>

        <p className="text-sm text-center text-slate-500">
          Já possui um perfil?{" "}
          <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-all">
            Fazer login
          </Link>
        </p>
      </form>
    </Form>
  );
};