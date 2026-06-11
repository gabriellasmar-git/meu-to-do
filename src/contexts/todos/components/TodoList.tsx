"use client";

import { useState } from "react";
import { useTodos } from "../hooks/useTodos";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, Inbox, ClipboardList, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type FilterType = "all" | "active" | "completed";

/**
 * Exibe a lista de tarefas do usuário com filtros refinados (todas, pendentes e concluídas),
 * contadores de progresso interativos e estados vazios customizados.
 */
export const TodoList = () => {
  const { todos, isLoading, toggleTodo, deleteTodo } = useTodos();
  const [filter, setFilter] = useState<FilterType>("all");

  if (isLoading) {
    return (
      <div className="space-y-3 w-full">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between p-4 border rounded-xl bg-card">
            <div className="flex items-center gap-3 w-2/3">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-4 w-full rounded" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  // Filtragem das tarefas em tempo real
  const filteredTodos = (todos || []).filter((todo) => {
    if (filter === "active") return !todo.is_completed;
    if (filter === "completed") return todo.is_completed;
    return true;
  });

  const activeCount = (todos || []).filter((t) => !t.is_completed).length;
  const completedCount = (todos || []).filter((t) => t.is_completed).length;

  return (
    <div className="space-y-6 w-full">
      {/* Abas de Filtros Personalizadas */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div className="flex gap-1 bg-slate-100/80 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200",
              filter === "all"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-950"
            )}
          >
            Todas ({todos?.length || 0})
          </button>
          <button
            type="button"
            onClick={() => setFilter("active")}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200",
              filter === "active"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-950"
            )}
          >
            Pendentes ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("completed")}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200",
              filter === "completed"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-950"
            )}
          >
            Concluídas ({completedCount})
          </button>
        </div>

        {/* Indicador rápido de tarefas concluídas */}
        {todos?.length > 0 && (
          <span className="text-xs font-medium text-slate-400">
            {completedCount} de {todos.length} feitas
          </span>
        )}
      </div>

      {/* Lista de Itens */}
      {filteredTodos.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-10 px-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          {filter === "all" && (
            <>
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 mb-3 text-slate-400">
                <ClipboardList className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-slate-800 text-sm">Sua lista está limpa</h3>
              <p className="text-slate-400 text-xs mt-1 max-w-[240px]">
                Adicione suas primeiras metas no campo acima para começar a produzir!
              </p>
            </>
          )}
          {filter === "active" && (
            <>
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 mb-3 text-emerald-500">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-slate-800 text-sm">Tudo em dia!</h3>
              <p className="text-slate-400 text-xs mt-1 max-w-[240px]">
                Nenhuma tarefa pendente por aqui. Bom trabalho!
              </p>
            </>
          )}
          {filter === "completed" && (
            <>
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 mb-3 text-slate-400">
                <Inbox className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-slate-800 text-sm">Nada concluído ainda</h3>
              <p className="text-slate-400 text-xs mt-1 max-w-[240px]">
                Marque alguma tarefa como feita para vê-la brilhar por aqui!
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={cn(
                "flex items-center justify-between p-4 border rounded-xl transition-all duration-200 group bg-white",
                todo.is_completed 
                  ? "border-slate-100 bg-slate-50/50" 
                  : "border-slate-150 shadow-sm shadow-slate-100/50 hover:border-slate-300 hover:shadow-md hover:shadow-slate-100"
              )}
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0 mr-2">
                <Checkbox
                  checked={todo.is_completed}
                  onCheckedChange={() => toggleTodo.mutate({ id: todo.id, is_completed: todo.is_completed })}
                  className="rounded-md border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 h-5 w-5 transition-colors"
                />
                <span 
                  className={cn(
                    "text-sm font-medium text-slate-700 transition-all truncate",
                    todo.is_completed && "line-through text-slate-400 font-normal"
                  )}
                >
                  {todo.title}
                </span>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full h-8 w-8 transition-all shrink-0"
                onClick={() => deleteTodo.mutate(todo.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};