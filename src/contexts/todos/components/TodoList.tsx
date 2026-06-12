"use client";

import { useState } from "react";
import { useTodos } from "../hooks/useTodos";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, ListFilter, CheckCircle, Clock, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type FilterType = "all" | "active" | "completed";

/**
 * Exibe a lista de tarefas filtrada por status com design otimizado.
 * Contém o badge de status altamente profissional de tarefas concluídas.
 */
export const TodoList = () => {
  const { todos, isLoading, toggleTodo, deleteTodo } = useTodos();
  const [filter, setFilter] = useState<FilterType>("all");

  if (isLoading) {
    return (
      <div className="space-y-3 w-full">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  // Filtra as tarefas de acordo com o estado selecionado
  const filteredTodos = (todos || []).filter((todo) => {
    if (filter === "active") return !todo.is_completed;
    if (filter === "completed") return todo.is_completed;
    return true;
  });

  return (
    <div className="space-y-4 w-full">
      {/* Abas de Filtros de Status */}
      <div className="flex gap-1 p-1 bg-slate-50 rounded-xl border border-slate-100">
        <Button
          variant={filter === "all" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setFilter("all")}
          className="flex-1 rounded-lg text-xs font-semibold py-1.5 h-auto transition-all"
        >
          <ListFilter className="h-3.5 w-3.5 mr-1.5" />
          Todas ({todos?.length || 0})
        </Button>
        <Button
          variant={filter === "active" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setFilter("active")}
          className="flex-1 rounded-lg text-xs font-semibold py-1.5 h-auto transition-all"
        >
          <Clock className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
          Ativas ({todos?.filter((t) => !t.is_completed).length || 0})
        </Button>
        <Button
          variant={filter === "completed" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setFilter("completed")}
          className="flex-1 rounded-lg text-xs font-semibold py-1.5 h-auto transition-all"
        >
          <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-emerald-500" />
          Concluídas ({todos?.filter((t) => t.is_completed).length || 0})
        </Button>
      </div>

      {/* Conteúdo da Lista */}
      {!filteredTodos.length ? (
        <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-100">
          <p className="text-slate-400 font-medium text-sm">
            {filter === "all" && "Nenhuma tarefa criada. Adicione uma acima!"}
            {filter === "active" && "Nenhuma tarefa pendente por aqui! 🎉"}
            {filter === "completed" && "Nenhuma tarefa concluída ainda."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTodos.map((todo) => {
            const isCompleted = todo.is_completed;
            return (
              <div
                key={todo.id}
                className={cn(
                  "flex items-center justify-between p-4 border rounded-2xl bg-white transition-all duration-200 group hover:shadow-md",
                  isCompleted
                    ? "border-emerald-100 bg-emerald-50/10"
                    : "border-slate-100 hover:border-indigo-100"
                )}
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <Checkbox
                    checked={isCompleted}
                    onCheckedChange={() =>
                      toggleTodo.mutate({ id: todo.id, is_completed: isCompleted })
                    }
                    className={cn(
                      "rounded-full h-5 w-5 border-slate-300 transition-all",
                      isCompleted
                        ? "border-emerald-500 bg-emerald-500 text-white data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                        : "hover:border-indigo-500"
                    )}
                  />
                  
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {isCompleted && (
                      <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[3px]" />
                    )}
                    <span
                      onClick={() =>
                        toggleTodo.mutate({ id: todo.id, is_completed: isCompleted })
                      }
                      className={cn(
                        "text-sm font-semibold truncate cursor-pointer select-none transition-colors",
                        isCompleted ? "text-slate-600" : "text-slate-800"
                      )}
                    >
                      {todo.title}
                    </span>
                  </div>

                  {/* Badge de status das tarefas concluídas com bolinha e texto */}
                  {isCompleted && (
                    <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm font-semibold text-green-700 shrink-0 select-none">
                      <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                      Concluída
                    </span>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl h-9 w-9 transition-colors shrink-0 ml-2"
                  onClick={() => deleteTodo.mutate(todo.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};