"use client";

import { useAuth } from "@/contexts/auth/hooks/useAuth";
import { AddTodoForm } from "@/contexts/todos/components/AddTodoForm";
import { TodoList } from "@/contexts/todos/components/TodoList";
import { Button } from "@/components/ui/button";
import { LogOut, CheckCircle2, User as UserIcon } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Página principal protegida. Exibe a lista de tarefas do usuário.
 */
export default function HomePage() {
  const { user, isLoading, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center space-y-4">
          <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 font-medium animate-pulse">Iniciando sua sessão segura...</p>
        </div>
      </div>
    );
  }

  // Pega as iniciais do nome do usuário para criar um avatar customizado
  const userFullName = user?.user_metadata?.full_name || "";
  const userInitials = userFullName
    ? userFullName.split(" ").slice(0, 2).map((n: string) => n[0]).join("").toUpperCase()
    : user?.email?.[0].toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-10 border-slate-100">
        <div className="container max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-bold text-xl text-indigo-600">
            <div className="bg-indigo-50 p-1.5 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-indigo-600" />
            </div>
            <span>Meu To Do</span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Perfil e Boas-Vindas */}
            <div className="flex items-center gap-2.5 bg-slate-50 pl-2.5 pr-1.5 py-1 rounded-full border border-slate-100 transition-all hover:bg-slate-100">
              <span className="text-xs font-semibold text-slate-700 hidden sm:inline max-w-[120px] truncate">
                {userFullName || user?.email}
              </span>
              <div className="h-7 w-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm shadow-indigo-100">
                {userInitials}
              </div>
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={logout} 
              title="Sair"
              className="text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full h-9 w-9 transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Banner de boas-vindas */}
        <div className="bg-gradient-to-tr from-indigo-700 via-indigo-600 to-violet-600 text-white p-6 rounded-2xl shadow-xl shadow-indigo-100 border border-indigo-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10" />
          <div className="relative z-10 space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">
              Olá, {userFullName.split(" ")[0] || "Usuário"}!
            </h1>
            <p className="text-indigo-100 text-sm">
              Que bom ver você hoje. Pronto para riscar mais alguns itens da sua lista?
            </p>
          </div>
        </div>

        <section className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold tracking-tight text-slate-800">Nova Tarefa</h2>
          <AddTodoForm />
        </section>

        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-800">Minha Lista</h2>
          </div>
          <TodoList />
        </section>
      </main>
    </div>
  );
}