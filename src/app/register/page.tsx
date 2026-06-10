import { RegisterForm } from "@/contexts/auth/components/RegisterForm";
import { CheckCircle2, ShieldCheck, Sparkles, Zap } from "lucide-react";

/**
 * Página completa de criação de novas contas, otimizada com layout premium de duas colunas em telas maiores.
 */
export default function RegisterPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Coluna da Esquerda: Lado Motivacional / Características do App (Apenas Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-tr from-indigo-700 via-indigo-600 to-violet-600 p-12 text-white flex-col justify-between relative overflow-hidden">
        {/* Elemento de background brilhante */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

        {/* Logo superior */}
        <div className="flex items-center gap-2.5 font-bold text-xl relative z-10">
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md">
            <CheckCircle2 className="h-6 w-6 text-white" />
          </div>
          <span className="tracking-wide">Meu To Do</span>
        </div>

        {/* Copy de Atração */}
        <div className="space-y-8 relative z-10 my-auto max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold backdrop-blur-md border border-white/10">
            <Sparkles className="h-3 w-3 text-yellow-300 fill-yellow-300" />
            <span>Simples, rápido e inteligente</span>
          </div>
          
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
            Assuma o controle da sua rotina diária hoje mesmo.
          </h2>
          
          <p className="text-indigo-100 text-lg leading-relaxed">
            Organize suas tarefas, crie metas realistas e aumente sua produtividade em minutos. Tudo sincronizado localmente para sua segurança e conveniência.
          </p>

          {/* Vantagens */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-start gap-3">
              <div className="bg-white/10 p-1.5 rounded-lg mt-0.5">
                <Zap className="h-4 w-4 text-yellow-300" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Produtividade Sem Limites</h4>
                <p className="text-sm text-indigo-200">Crie listas infinitas de forma otimizada e livre de distrações.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-white/10 p-1.5 rounded-lg mt-0.5">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Privacidade de Dados</h4>
                <p className="text-sm text-indigo-200">Seus dados ficam protegidos e salvos de forma segura.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer lateral */}
        <div className="text-sm text-indigo-200 relative z-10">
          © {new Date().getFullYear()} Meu To Do. Todos os direitos reservados.
        </div>
      </div>

      {/* Coluna da Direita: Formulário de Registro */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 md:p-16">
        <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-xl shadow-slate-100 border border-slate-100">
          
          {/* Logo visível apenas no mobile */}
          <div className="flex lg:hidden items-center justify-center gap-2 font-bold text-2xl text-indigo-600 mb-6">
            <CheckCircle2 className="h-7 w-7 text-indigo-600" />
            <span>Meu To Do</span>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Crie sua conta
            </h1>
            <p className="text-slate-500 text-sm">
              Comece a organizar seu dia agora mesmo em poucos passos.
            </p>
          </div>

          <RegisterForm />
        </div>
      </div>
    </div>
  );
}