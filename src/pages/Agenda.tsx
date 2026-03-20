import { useState } from 'react';
import { useAppStore } from '../store';
import { format, addDays, isSameDay } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, Plus, Filter, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { getWhatsAppLink } from '../utils/whatsapp';

export default function Agenda() {
  const navigate = useNavigate();
  const appointments = useAppStore(state => state.appointments);
  const patients = useAppStore(state => state.patients);
  const updateAppointment = useAppStore(state => state.updateAppointment);
  const [baseDate, setBaseDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const days = Array.from({ length: 7 }).map((_, i) => addDays(baseDate, i - 3));

  const dayAppointments = appointments.filter(a => isSameDay(new Date(a.date), selectedDate)).sort((a, b) => a.date - b.date);

  const openWhatsApp = (phone: string, patientName: string, time: string) => {
    // Dr. Nome mock
    const link = getWhatsAppLink(phone, patientName, "Dr(a).", time);
    window.open(link, '_blank');
  };

  return (
    <div className="p-4 flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Agenda</h1>
        <div className="flex gap-2 items-center">
          <button onClick={() => setBaseDate(prev => addDays(prev, -7))} className="p-2 bg-surface text-slate-500 rounded-full border shadow-sm active:scale-95 transition-transform"><ChevronLeft size={20}/></button>
          <button onClick={() => setBaseDate(prev => addDays(prev, 7))} className="p-2 bg-surface text-slate-500 rounded-full border shadow-sm active:scale-95 transition-transform"><ChevronRight size={20}/></button>
          <button 
            onClick={() => navigate('/agenda/new')}
            className="bg-primary-600 text-white p-2.5 rounded-full shadow-lg active:scale-95 transition ml-1"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Week Selector */}
      <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar snap-x">
        {days.map(d => {
          const isSelected = isSameDay(d, selectedDate);
          return (
            <button
              key={d.toISOString()}
              onClick={() => setSelectedDate(d)}
              className={`snap-center flex flex-col items-center min-w-[60px] p-3 rounded-2xl border transition-all ${
                isSelected ? 'bg-primary-600 text-white border-primary-600 shadow-md' : 'bg-surface border-slate-200 text-text-secondary active:bg-slate-50'
              }`}
            >
              <span className="text-xs uppercase font-bold mb-1">{format(d, 'eee', { locale: ptBR }).replace('.', '')}</span>
              <span className={`text-xl font-bold ${isSelected ? 'text-white' : 'text-slate-800'}`}>{format(d, 'd')}</span>
            </button>
          )
        })}
      </div>

      <div className="mb-4 mt-2 flex justify-between items-center px-1">
        <h2 className="font-semibold text-lg">{format(selectedDate, "d 'de' MMMM", { locale: ptBR })}</h2>
        <button className="text-primary-600 text-sm font-medium flex items-center gap-1 active:opacity-70"><Filter size={16}/> Filtro</button>
      </div>

      {/* Timeline / Appointments */}
      <div className="flex-1 overflow-y-auto pb-20">
        {dayAppointments.length === 0 ? (
           <div className="text-center mt-12 text-slate-400 bg-surface py-10 rounded-2xl border border-dashed border-slate-300">
             <CalendarIcon size={40} className="mx-auto mb-3 opacity-50" />
             <p className="font-medium">Nenhum agendamento<br/>neste dia.</p>
           </div>
        ) : (
          <div className="flex flex-col gap-4">
            {dayAppointments.map(app => {
              const p = patients.find(pat => pat.id === app.patientId);
              const time = format(new Date(app.date), 'HH:mm');
              return (
                <div key={app.id} className="flex gap-4 items-stretch group">
                  <div className="flex flex-col items-center">
                     <span className="font-bold text-slate-600 text-sm mb-1">{time}</span>
                     <div className="w-0.5 bg-slate-200 flex-1 rounded-full group-last:bg-transparent"></div>
                  </div>
                  <div className="bg-surface p-5 rounded-2xl border border-slate-100 shadow-sm flex-1 ml-1 active:scale-[0.98] transition-transform">
                     <div className="flex justify-between items-start mb-2">
                       <h3 className="font-bold text-lg">{p?.name || 'Desconhecido'}</h3>
                       <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${app.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : app.status === 'Cancelled' ? 'bg-red-100 text-red-700' : app.status === 'NoShow' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                         {app.status === 'Scheduled' ? 'Agendado' : app.status === 'Completed' ? 'Concluído' : app.status === 'Cancelled' ? 'Cancelado' : 'Faltou'}
                       </span>
                     </div>
                     <p className="text-sm text-slate-500 mb-4 flex items-center gap-1.5">
                       <Clock size={14} /> {format(new Date(app.date), "HH:mm")} - {(app.status === 'Scheduled') ? '1h de duração' : ''}
                     </p>
                     
                     <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-slate-100">
                        {app.status === 'Scheduled' ? (
                          <div className="flex gap-2">
                            {p?.phone && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); openWhatsApp(p.phone!, p.name, time); }}
                                className="flex-1 flex justify-center items-center gap-1.5 bg-[#25D366]/10 text-[#075E54] font-semibold py-2 rounded-xl text-sm"
                              >
                                <MessageCircle size={15} /> Lembrete
                              </button>
                            )}
                            <button 
                              onClick={(e) => { e.stopPropagation(); updateAppointment(app.id, { status: 'Cancelled' }); }}
                              className="flex-1 flex justify-center items-center bg-red-50 text-red-600 font-semibold py-2 rounded-xl text-sm"
                            >
                              Cancelar
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); updateAppointment(app.id, { status: 'NoShow' }); }}
                              className="flex-1 flex justify-center items-center bg-purple-50 text-purple-600 font-semibold py-2 rounded-xl text-sm"
                            >
                              Faltou
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); updateAppointment(app.id, { status: 'Completed' }); }}
                              className="flex-1 flex justify-center items-center bg-emerald-50 text-emerald-600 font-semibold py-2 rounded-xl text-sm"
                            >
                              Concluir
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={(e) => { e.stopPropagation(); updateAppointment(app.id, { status: 'Scheduled' }); }}
                            className="w-full flex justify-center items-center bg-slate-50 text-slate-500 font-semibold py-2 rounded-xl text-sm border border-slate-200 active:bg-slate-100"
                          >
                            Reabrir Agendamento
                          </button>
                        )}
                     </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}
