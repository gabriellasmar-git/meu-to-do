"use client";

import { useTodos } from "../hooks/useTodos";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Exibe a lista de tarefas do usuário com opções de completar e excluir.
 */
export const TodoList = () => {
  const { todos, isLoading, toggleTodo, deleteTodo } = useTodos();

  if (isLoading) {
    return (
      <div className="space-y-2 w-full">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!todos?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma tarefa encontrada. Comece adicionando uma!
      </div>
    );
  }

  return (
    <div className="space-y-2 w-full">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Checkbox
              checked={todo.is_completed}
              onCheckedChange={() => toggleTodo.mutate({ id: todo.id, is_completed: todo.is_completed })}
            />
            <span className={todo.is_completed ? "line-through text-muted-foreground" : ""}>
              {todo.title}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => deleteTodo.mutate(todo.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};