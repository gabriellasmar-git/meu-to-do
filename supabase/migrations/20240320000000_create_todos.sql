-- Tabela de tarefas
CREATE TABLE public.todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Users can view their own todos" 
ON public.todos FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own todos" 
ON public.todos FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own todos" 
ON public.todos FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own todos" 
ON public.todos FOR DELETE 
USING (auth.uid() = user_id);