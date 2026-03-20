import { useState } from 'react';
import { useAppStore } from '../store';
import { usePullToRefresh } from '../hooks/usePullToRefresh';
import { format, differenceInYears, isSameWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Dashboard() {
  const { isRefreshing } = usePullToRefresh(async () => {
    // mock network request
    await new Promise(r => setTimeout(r, 1000));
  });
  
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);
  const updateAppointment = useAppStore(state => state.updateAppointment);
  const appointments = useAppStore(state => state.appointments);
  const patients = useAppStore(state => state.patients);
  const user = useAppStore(state => state.user);
  const today = new Date();
  
  const todayAppointments = appointments.filter(a => {
    const d = new Date(a.date);
    return d.getDate() === today.getDate() && 
           d.getMonth() === today.getMonth() && 
           d.getFullYear() === today.getFullYear();
  }).sort((a,b) => a.date - b.date);

  const getGreeting = () => {
    const hour = today.getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const totalToday = todayAppointments.length;
  const completedToday = todayAppointments.filter(a => a.status === 'Completed').length;
  const cancelledToday = todayAppointments.filter(a => a.status === 'Cancelled').length;
  const noShowToday = todayAppointments.filter(a => a.status === 'NoShow').length;

  const birthdaysWeek = patients.filter(p => {
    if (!p.birthDate) return false;
    const parts = p.birthDate.split('-');
    if (parts.length !== 3) return false;
    const [y, m, d] = parts;
    const bDateThisYear = new Date(today.getFullYear(), parseInt(m)-1, parseInt(d));
    return isSameWeek(bDateThisYear, today, { weekStartsOn: 0 });
  });

  return (
    <div className="p-4 flex flex-col gap-6 bg-slate-50 min-h-full">
      {isRefreshing && <div className="text-center text-primary-500 text-sm py-2 animate-pulse">Atualizando...</div>}
      
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{getGreeting()}, {user?.name?.split(' ')[0] || 'Doutor(a)'}!</h1>
          <p className="text-text-secondary capitalize">{format(today, "EEEE, d 'de' MMMM", { locale: ptBR })}</p>
        </div>
        {user?.avatarUrl && (
          <img src={user.avatarUrl} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
        )}
      </header>

      <section className="bg-primary-50 rounded-2xl p-5 border border-primary-100 shadow-sm">
        <h3 className="font-semibold text-primary-700 mb-2">Mensagem do Dia</h3>
        <p className="text-primary-600/90 text-sm italic tracking-wide leading-relaxed">
          "Conheça todas as teorias, domine todas as técnicas, mas ao tocar uma alma humana, seja apenas outra alma humana."
          <br/><span className="mt-2 block font-medium">— Carl Jung</span>
        </p>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Resumo Diário</h2>
        </div>
        
        <div className="grid grid-cols-4 gap-2 mb-6">
          <div className="bg-surface border border-slate-100 rounded-2xl p-3 flex flex-col items-center justify-center shadow-sm">
            <span className="text-xl font-bold text-slate-800">{totalToday}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">Total</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 flex flex-col items-center justify-center shadow-sm">
            <span className="text-xl font-bold text-emerald-700">{completedToday}</span>
            <span className="text-[10px] font-bold text-emerald-600 uppercase mt-1 text-center">Finalizou</span>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-2xl p-3 flex flex-col items-center justify-center shadow-sm">
            <span className="text-xl font-bold text-red-700">{cancelledToday}</span>
            <span className="text-[10px] font-bold text-red-600 uppercase mt-1">Cancelou</span>
          </div>
          <div className="bg-purple-50 border border-purple-100 rounded-2xl p-3 flex flex-col items-center justify-center shadow-sm">
             <span className="text-xl font-bold text-purple-700">{noShowToday}</span>
             <span className="text-[10px] font-bold text-purple-600 uppercase mt-1">Faltou</span>
          </div>
        </div>

        {birthdaysWeek.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">🎂 Aniversariantes da Semana</h2>
            <div className="flex flex-col gap-2">
              {birthdaysWeek.map(p => {
                const [y, m, d] = p.birthDate!.split('-');
                const age = differenceInYears(today, new Date(parseInt(y), parseInt(m)-1, parseInt(d)));
                const bDateThisYear = new Date(today.getFullYear(), parseInt(m)-1, parseInt(d));
                return (
                  <div key={p.id} className="bg-gradient-to-r from-pink-50 to-orange-50 border border-pink-100 p-3 rounded-2xl flex justify-between items-center">
                    <div>
                      <p className="font-bold text-pink-800">{p.name}</p>
                      <p className="text-xs font-semibold text-pink-600">{format(bDateThisYear, "dd 'de' MMMM", { locale: ptBR })}</p>
                    </div>
                    <div className="bg-white px-3 py-1 rounded-full shadow-sm">
                      <span className="font-bold text-pink-600">{age} anos</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Agenda de Hoje</h2>
        </div>
        
        {todayAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-text-secondary bg-surface rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                 <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                 <line x1="16" y1="2" x2="16" y2="6"></line>
                 <line x1="8" y1="2" x2="8" y2="6"></line>
                 <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <p className="font-medium text-slate-500">Nenhuma consulta hoje</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {todayAppointments.map(app => {
              const patient = patients.find(p => p.id === app.patientId);
              return (
                <div 
                  key={app.id} 
                  onClick={() => setExpandedAppId(app.id === expandedAppId ? null : app.id)}
                  className="bg-surface p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                   <div className="flex gap-4 items-center">
                      <div className="font-bold text-lg text-primary-600 bg-primary-50 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                        {format(new Date(app.date), 'HH:mm')}
                      </div>
                      <div>
                        <h4 className={`font-semibold text-base ${(app.status === 'Cancelled' || app.status === 'NoShow') ? 'line-through text-slate-400' : ''}`}>
                          {patient?.name || 'Desconhecido'}
                        </h4>
                        <div className="flex gap-2 items-center mt-0.5">
                           <p className="text-xs text-text-secondary">{patient?.frequency || 'Sem tag'}</p>
                           {app.status === 'Cancelled' && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold uppercase">Cancelada</span>}
                           {app.status === 'Completed' && <span className="text-[10px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded font-bold uppercase">Compareceu</span>}
                           {app.status === 'NoShow' && <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded font-bold uppercase">Faltou</span>}
                        </div>
                      </div>
                   </div>
                   <div className="text-right flex flex-col items-end gap-2 shrink-0">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${app.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                        {app.paymentStatus === 'Paid' ? 'Pago' : 'Pendente'}
                      </span>
                   </div>
                  </div>
                  
                  {expandedAppId === app.id && (
                    <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-100 animate-in slide-in-from-top-2 fade-in">
                       <p className="text-xs font-bold text-slate-500 uppercase">Ações Rápidas</p>
                       <div className="flex gap-2">
                         <button 
                           onClick={(e) => { e.stopPropagation(); updateAppointment(app.id, { paymentStatus: app.paymentStatus === 'Paid' ? 'Pending' : 'Paid' }); }}
                           className={`flex-1 py-1.5 rounded-lg text-sm font-bold ${app.paymentStatus === 'Paid' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'}`}
                         >
                           {app.paymentStatus === 'Paid' ? 'Marcar Pendente' : 'Marcar Pago'}
                         </button>
                       </div>
                       <div className="flex gap-2">
                         <button 
                           onClick={(e) => { e.stopPropagation(); updateAppointment(app.id, { status: 'Cancelled' }); }}
                           className="flex-1 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-bold"
                         >
                           Cancelou
                         </button>
                         <button 
                           onClick={(e) => { e.stopPropagation(); updateAppointment(app.id, { status: 'NoShow' }); }}
                           className="flex-1 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-sm font-bold"
                         >
                           Faltou
                         </button>
                         <button 
                           onClick={(e) => { e.stopPropagation(); updateAppointment(app.id, { status: 'Completed' }); }}
                           className="flex-1 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold"
                         >
                           Compareceu
                         </button>
                       </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  );
}
