"use client";

// Mock do ID único
const generateUUID = () => {
  return 'mock-uuid-' + Math.random().toString(36).substr(2, 9);
};

// Inicialização dos storages locais se não existirem
const getLocalData = (key: string) => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setLocalData = (key: string, data: any) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
};

// Configurações de estado de sessão do usuário
const getActiveSessionUser = () => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("todo_session_user");
  return user ? JSON.parse(user) : null;
};

const setActiveSessionUser = (user: any) => {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem("todo_session_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("todo_session_user");
  }
};

const authCallbacks: Array<(event: string, session: any) => void> = [];

/**
 * Cliente local que imita exatamente a API do Supabase Client,
 * armazenando dados diretamente no localStorage do navegador de forma limpa e sem dados mocados.
 */
export const supabase = {
  auth: {
    getSession: async () => {
      const user = getActiveSessionUser();
      return {
        data: {
          session: user ? { user } : null,
        },
        error: null,
      };
    },
    getUser: async () => {
      const user = getActiveSessionUser();
      return {
        data: { user },
        error: null,
      };
    },
    signUp: async ({ email, password, options }: any) => {
      const users = getLocalData("todo_registered_users");
      const userExists = users.some((u: any) => u.email === email);

      if (userExists) {
        return { data: null, error: { message: "Usuário já cadastrado com este e-mail." } };
      }

      const newUser = {
        id: generateUUID(),
        email,
        created_at: new Date().toISOString(),
        user_metadata: options?.data || {},
      };

      users.push({ ...newUser, password });
      setLocalData("todo_registered_users", users);

      return {
        data: { user: newUser },
        error: null,
      };
    },
    signInWithPassword: async ({ email, password }: any) => {
      const users = getLocalData("todo_registered_users");
      const user = users.find((u: any) => u.email === email && u.password === password);

      if (!user) {
        return { data: null, error: { message: "E-mail ou senha incorretos." } };
      }

      const sessionUser = { 
        id: user.id, 
        email: user.email,
        user_metadata: user.user_metadata || {} 
      };
      setActiveSessionUser(sessionUser);

      // Dispara os listeners de mudança de autenticação
      authCallbacks.forEach((cb) => cb("SIGNED_IN", { user: sessionUser }));

      return {
        data: { user: sessionUser },
        error: null,
      };
    },
    signOut: async () => {
      setActiveSessionUser(null);
      authCallbacks.forEach((cb) => cb("SIGNED_OUT", null));
      return { error: null };
    },
    onAuthStateChange: (callback: any) => {
      authCallbacks.push(callback);
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              const index = authCallbacks.indexOf(callback);
              if (index > -1) {
                authCallbacks.splice(index, 1);
              }
            },
          },
        },
      };
    },
  },

  from: (table: string) => {
    return {
      select: (columns?: string) => {
        let currentData = getLocalData(`todo_table_${table}`);
        const sessionUser = getActiveSessionUser();

        // Filtra tarefas pelo ID do usuário atualmente logado
        if (table === "todos" && sessionUser) {
          currentData = currentData.filter((t: any) => t.user_id === sessionUser.id);
        }

        const queryResult = {
          data: currentData,
          error: null,
          order: (column: string, { ascending = true } = {}) => {
            const sorted = [...currentData].sort((a: any, b: any) => {
              const valA = a[column];
              const valB = b[column];
              if (valA < valB) return ascending ? -1 : 1;
              if (valA > valB) return ascending ? 1 : -1;
              return 0;
            });
            return {
              data: sorted,
              error: null,
            };
          },
        };

        return {
          ...queryResult,
          order: queryResult.order,
        };
      },

      insert: (rows: any[]) => {
        const currentData = getLocalData(`todo_table_${table}`);
        const sessionUser = getActiveSessionUser();

        const createdRows = rows.map((row) => ({
          id: generateUUID(),
          created_at: new Date().toISOString(),
          is_completed: false,
          user_id: sessionUser?.id || "anonymous",
          ...row,
        }));

        const updatedData = [...createdRows, ...currentData];
        setLocalData(`todo_table_${table}`, updatedData);

        const chainResult = {
          data: createdRows,
          error: null,
          select: () => ({
            single: () => ({
              data: createdRows[0],
              error: null,
            }),
          }),
        };

        return chainResult;
      },

      update: (values: any) => {
        return {
          eq: (column: string, value: any) => {
            const currentData = getLocalData(`todo_table_${table}`);
            const updatedData = currentData.map((item: any) => {
              if (item[column] === value) {
                return { ...item, ...values };
              }
              return item;
            });

            setLocalData(`todo_table_${table}`, updatedData);
            return { data: updatedData, error: null };
          },
        };
      },

      delete: () => {
        return {
          eq: (column: string, value: any) => {
            const currentData = getLocalData(`todo_table_${table}`);
            const filteredData = currentData.filter((item: any) => item[column] !== value);

            setLocalData(`todo_table_${table}`, filteredData);
            return { data: filteredData, error: null };
          },
        };
      },
    };
  },
};