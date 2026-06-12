"use client";

import { Toaster } from "@/components/ui/sonner";
import { TodoProvider } from "@/contexts/todos/context/TodoContext";

/**
 * Agrupa todos os provedores de contexto necessários.
 * Adicionado o TodoProvider para compartilhamento seguro do estado de tarefas.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TodoProvider>
      {children}
      <Toaster position="top-right" />
    </TodoProvider>
  );
}