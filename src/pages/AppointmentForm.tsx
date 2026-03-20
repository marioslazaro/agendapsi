import { useState } from 'react';
import { useAppStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export default function AppointmentForm() {
  const navigate = useNavigate();
  const patients = useAppStore(state => state.patients);
  const addAppointment = useAppStore(state => state.addAppointment);

  const [patientId, setPatientId] = useState('');
  const [dateStr, setDateStr] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [timeStr, setTimeStr] = useState(format(new Date(), 'HH:mm'));
  const [value, setValue] = useState('150.00');

  const handleSave = () => {
    if (!patientId || !dateStr || !timeStr || !value) return;

    // Combine date and time
    const combinedDate = new Date(`${dateStr}T${timeStr}:00`);

    addAppointment({
      patientId,
      date: combinedDate.getTime(),
      status: 'Scheduled',
      paymentStatus: 'Pending',
      value: parseFloat(value)
    });
    
    navigate(-1);
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-4">Novo Agendamento</h2>
      
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-slate-700">Paciente</label>
        {patients.length === 0 ? (
          <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-200">
            Você precisa cadastrar um paciente antes de agendar uma consulta.
          </div>
        ) : (
          <select 
            className="border border-slate-300 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface shadow-sm w-full appearance-none bg-white"
            value={patientId} onChange={e => setPatientId(e.target.value)}
          >
            <option value="" disabled>Selecione um paciente...</option>
            {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        )}
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-sm font-bold text-slate-700">Data</label>
          <input 
            type="date"
            className="border border-slate-300 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface shadow-sm w-full bg-white"
            value={dateStr} onChange={e => setDateStr(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-sm font-bold text-slate-700">Horário</label>
          <input 
            type="time"
            className="border border-slate-300 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface shadow-sm w-full bg-white"
            value={timeStr} onChange={e => setTimeStr(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-slate-700">Valor da Sessão (R$)</label>
        <input 
          type="number"
          step="0.01"
          className="border border-slate-300 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface shadow-sm w-full bg-white"
          value={value} onChange={e => setValue(e.target.value)}
        />
      </div>

      <button 
        onClick={handleSave}
        disabled={patients.length === 0 || !patientId}
        className="mt-6 bg-primary-600 disabled:bg-slate-300 disabled:active:scale-100 active:bg-primary-700 text-white font-bold text-lg p-4 rounded-xl shadow-lg transition-transform active:scale-[0.98]"
      >
        Agendar Consulta
      </button>
    </div>
  );
}
