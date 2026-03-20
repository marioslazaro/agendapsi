import { useAppStore } from '../store';
import { ShieldX, Mail } from 'lucide-react';

export default function SubscriptionExpired() {
  const logout = useAppStore(state => state.logout);
  const user = useAppStore(state => state.user);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-orange-50 to-surface relative overflow-hidden">
      
      <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[50%] bg-orange-400 rounded-[100%] opacity-10 blur-3xl pointer-events-none"></div>

      <div className="flex flex-col items-center justify-center w-full max-w-sm z-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
        
        <div className="mb-6 relative flex justify-center">
          <div className="bg-orange-500 p-5 rounded-[2rem] shadow-xl shadow-orange-200">
            <ShieldX size={48} className="text-white" strokeWidth={1.5} />
          </div>
        </div>
        
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight text-center mb-2">Assinatura Expirada</h1>
        <p className="text-slate-500 font-medium text-center mb-8 text-sm leading-relaxed">
          Sua assinatura do <strong className="text-slate-700">AgendaPsi</strong> expirou ou ainda não foi ativada. 
          Entre em contato para renovar e continuar usando todos os recursos.
        </p>

        <div className="w-full bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mb-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Como Renovar</p>
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <span className="bg-primary-100 text-primary-700 font-bold text-sm w-7 h-7 flex items-center justify-center rounded-full shrink-0">1</span>
              <p className="text-sm text-slate-600">Entre em contato com o administrador via WhatsApp ou e-mail.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-primary-100 text-primary-700 font-bold text-sm w-7 h-7 flex items-center justify-center rounded-full shrink-0">2</span>
              <p className="text-sm text-slate-600">Realize o pagamento da mensalidade via PIX ou transferência.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-primary-100 text-primary-700 font-bold text-sm w-7 h-7 flex items-center justify-center rounded-full shrink-0">3</span>
              <p className="text-sm text-slate-600">Após a confirmação, seu acesso será liberado automaticamente.</p>
            </div>
          </div>
        </div>

        <a 
          href="mailto:contato@agendapsi.com.br"
          className="w-full flex justify-center items-center gap-2 bg-primary-600 text-white font-bold p-3.5 rounded-xl shadow-md shadow-primary-200 hover:bg-primary-700 transition-all active:scale-[0.98] mb-3"
        >
          <Mail size={18} /> Entrar em Contato
        </a>

        <button 
          onClick={() => logout()}
          className="w-full text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors py-3"
        >
          Sair da Conta ({user?.email})
        </button>

      </div>
    </div>
  );
}
