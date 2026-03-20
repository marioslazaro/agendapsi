import { useState } from 'react';
import { useAppStore } from '../store';
import { format, isSameWeek, isSameMonth, isSameYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Finances() {
  const appointments = useAppStore(state => state.appointments);
  const patients = useAppStore(state => state.patients);
  const updateAppointment = useAppStore(state => state.updateAppointment);
  
  const [filter, setFilter] = useState<'All' | 'Paid' | 'Pending'>('All');
  const [timeFilter, setTimeFilter] = useState<'Semanal' | 'Mensal' | 'Anual'>('Mensal');

  const timeFiltered = appointments.filter(a => {
    const d = new Date(a.date);
    const now = new Date();
    if (timeFilter === 'Semanal') return isSameWeek(d, now, { weekStartsOn: 0 });
    if (timeFilter === 'Mensal') return isSameMonth(d, now);
    if (timeFilter === 'Anual') return isSameYear(d, now);
    return true;
  });

  const filtered = timeFiltered.filter(a => {
    if (filter === 'All') return true;
    return a.paymentStatus === filter;
  }).sort((a,b) => b.date - a.date);

  const totalRevenue = timeFiltered
    .filter(a => a.paymentStatus === 'Paid')
    .reduce((acc, curr) => acc + (curr.value || 0), 0);

  const pendingRevenue = timeFiltered
    .filter(a => a.paymentStatus === 'Pending')
    .reduce((acc, curr) => acc + (curr.value || 0), 0);

  const togglePaymentStatus = (id: string, currentStatus: 'Paid' | 'Pending') => {
    updateAppointment(id, { paymentStatus: currentStatus === 'Paid' ? 'Pending' : 'Paid' });
  };

  return (
    <div className="p-4 flex flex-col h-full bg-slate-50">
      <h1 className="text-2xl font-bold mb-4 pt-2">Controle Financeiro</h1>
      
      {/* Time Filter */}
      <div className="flex gap-2 mb-4 bg-slate-200/50 p-1 rounded-xl">
        {['Semanal', 'Mensal', 'Anual'].map((f) => (
          <button
            key={f}
            onClick={() => setTimeFilter(f as any)}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${timeFilter === f ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 active:bg-slate-300/50'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1 bg-gradient-to-br from-emerald-500 to-primary-600 rounded-3xl p-5 shadow-lg shadow-emerald-200">
          <p className="text-emerald-50 text-sm font-medium mb-1">Recebido (Total)</p>
          <p className="text-white text-2xl font-bold tracking-tight">R$ {totalRevenue.toFixed(2)}</p>
        </div>
        <div className="flex-1 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-slate-500 text-sm font-medium mb-1">Pendente</p>
          <p className="text-orange-600 text-2xl font-bold tracking-tight">R$ {pendingRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4 bg-slate-200/50 p-1 rounded-xl">
        {['All', 'Paid', 'Pending'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${filter === f ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 active:bg-slate-300/50'}`}
          >
            {f === 'All' ? 'Todos' : f === 'Paid' ? 'Pagos' : 'Pendentes'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        <div className="flex flex-col gap-3">
          {filtered.length === 0 && (
             <div className="text-center py-10 text-slate-400">
               Nenhum registro encontrado.
             </div>
          )}
          {filtered.map(app => {
            const p = patients.find(pat => pat.id === app.patientId);
            return (
              <div key={app.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 mb-0.5">{p?.name || 'Paciente'}</h4>
                  <p className="text-xs text-slate-400 font-medium">{format(new Date(app.date), "dd/MMM 'às' HH:mm", { locale: ptBR })}</p>
                  <p className="text-lg font-bold text-slate-700 mt-2">R$ {app.value?.toFixed(2) || '150.00'}</p>
                </div>
                <button
                  onClick={() => togglePaymentStatus(app.id, app.paymentStatus)}
                  className={`px-4 py-8 rounded-xl font-bold transition-all text-sm flex flex-col items-center justify-center gap-1 ${
                    app.paymentStatus === 'Paid' 
                      ? 'bg-emerald-50 text-emerald-600 active:bg-emerald-100' 
                      : 'bg-orange-50 text-orange-600 active:bg-orange-100'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full mb-1 ${app.paymentStatus === 'Paid' ? 'bg-emerald-500' : 'bg-orange-400'}`}></span>
                  {app.paymentStatus === 'Paid' ? 'Pago' : 'Pendente'}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
