"use client";

import { useTodoContext } from "../context/TodoContext";

/**
 * Hook para gerenciar as tarefas do usuário, consumindo o estado unificado e reativo do TodoContext.
 * Mantém a mesma assinatura para não quebrar compatibilidade com os componentes existentes.
 * 
 * @returns Queries e mutações para manipular tarefas.
 */
export function useTodos() {
  const context = useTodoContext();

  return {
    todos: context.todos,
    isLoading: context.isLoading,
    createTodo: {
      mutateAsync: context.createTodo,
      isPending: context.isCreating,
    },
    toggleTodo: {
      mutate: ({ id, is_completed }: { id: string; is_completed: boolean }) =>
        context.toggleTodo(id, is_completed),
    },
    deleteTodo: {
      mutate: (id: string) => context.deleteTodo(id),
    },
  };
}