"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Todo, CreateTodoInput } from "../todos.types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth/hooks/useAuth";

interface TodoContextType {
  todos: Todo[];
  isLoading: boolean;
  isCreating: boolean;
  fetchTodos: () => Promise<void>;
  createTodo: (input: CreateTodoInput) => Promise<Todo>;
  toggleTodo: (id: string, isCompleted: boolean) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

/**
 * Provedor de contexto para gerenciar o estado global compartilhado das tarefas.
 * Garante reatividade instantânea entre adição, edição e exclusão de tarefas.
 */
export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Busca inicial das tarefas do usuário logado
  const fetchTodos = async () => {
    if (!isAuthenticated || !user) {
      setTodos([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTodos((data as Todo[]) || []);
    } catch (error: any) {
      toast.error(`Erro ao carregar tarefas: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Sincroniza busca de tarefas ao alterar autenticação
  useEffect(() => {
    fetchTodos();
  }, [isAuthenticated, user?.id]);

  // Criação de nova tarefa com resposta instantânea
  const createTodo = async ({ title }: CreateTodoInput) => {
    try {
      setIsCreating(true);
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("todos")
        .insert([{ title, user_id: currentUser.id }])
        .select()
        .single();

      if (error) throw error;
      
      const newTodo = data as Todo;
      setTodos((prev) => [newTodo, ...prev]);
      toast.success("Tarefa adicionada!");
      return newTodo;
    } catch (error: any) {
      toast.error(`Erro ao adicionar tarefa: ${error.message}`);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  // Alternar estado de conclusão (com atualização otimista na UI)
  const toggleTodo = async (id: string, is_completed: boolean) => {
    const nextStatus = !is_completed;
    
    // Atualização otimista imediata
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, is_completed: nextStatus } : t))
    );

    try {
      const { error } = await supabase
        .from("todos")
        .update({ is_completed: nextStatus })
        .eq("id", id);

      if (error) throw error;
    } catch (error: any) {
      toast.error(`Erro ao atualizar tarefa: ${error.message}`);
      // Reverte o estado local em caso de falha de rede
      fetchTodos();
    }
  };

  // Deletar tarefa (com atualização otimista na UI)
  const deleteTodo = async (id: string) => {
    // Atualização otimista imediata
    setTodos((prev) => prev.filter((t) => t.id !== id));

    try {
      const { error } = await supabase.from("todos").delete().eq("id", id);
      if (error) throw error;

      toast.success("Tarefa removida.");
    } catch (error: any) {
      toast.error(`Erro ao remover tarefa: ${error.message}`);
      // Reverte o estado local em caso de falha de rede
      fetchTodos();
    }
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        isLoading,
        isCreating,
        fetchTodos,
        createTodo,
        toggleTodo,
        deleteTodo,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

/**
 * Hook interno para acessar de forma segura o contexto de Tarefas.
 */
export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodoContext deve ser usado dentro de um TodoProvider");
  }
  return context;
};