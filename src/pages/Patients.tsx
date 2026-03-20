import { useState } from 'react';
import { useAppStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Search } from 'lucide-react';
import { isSameMonth } from 'date-fns';

export default function Patients() {
  const patients = useAppStore(state => state.patients);
  const appointments = useAppStore(state => state.appointments);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const thisMonthApps = appointments.filter(a => a.status === 'Completed' && isSameMonth(new Date(a.date), new Date()));
  const totalSessoesMes = thisMonthApps.length;

  const filtered = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-4 flex flex-col gap-4 h-full">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold">Pacientes</h1>
        <button 
          onClick={() => navigate('/patients/new')}
          className="bg-primary-600 text-white p-2.5 rounded-full shadow-lg active:scale-95 transition"
        >
          <UserPlus size={20} />
        </button>
      </div>

      <div className="bg-primary-50 border border-primary-100 rounded-2xl p-4 mb-1 flex items-center justify-between shadow-sm">
         <div>
            <p className="text-[10px] font-bold text-primary-600 uppercase tracking-wider mb-0.5">Neste Mês</p>
            <p className="text-slate-700 font-medium text-sm">Sessões concluídas</p>
         </div>
         <span className="text-2xl font-bold text-primary-700">{totalSessoesMes}</span>
      </div>

      <div className="relative mb-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Buscar pacientes..." 
          className="w-full bg-surface border border-slate-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto w-full pb-20">
        {filtered.length === 0 ? (
           <div className="text-center mt-10 text-slate-400">
             Nenhum paciente encontrado.
           </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(p => (
              <div 
                key={p.id} 
                className="bg-surface p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between active:bg-slate-50 transition-colors"
              >
                <div>
                  <h3 className="font-semibold text-lg">{p.name}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {p.frequency}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => navigate(`/patients/${p.id}`)}
                  className="text-primary-600 font-medium text-sm px-4 py-2 bg-primary-50 rounded-lg"
                >
                  Ver
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
