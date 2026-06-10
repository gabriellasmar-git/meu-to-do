import { RegisterForm } from "@/contexts/auth/components/RegisterForm";

/**
 * Página para criação de novas contas.
 */
export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50">
      <div className="w-full max-w-sm space-y-6 bg-white p-8 rounded-xl shadow-sm border">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Criar Conta</h1>
          <p className="text-muted-foreground">Comece a organizar seu dia agora mesmo</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}