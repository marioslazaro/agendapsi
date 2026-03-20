import { useState } from 'react';
import { useAppStore, Frequency } from '../store';
import { useNavigate, useParams } from 'react-router-dom';

export default function PatientForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const patients = useAppStore(state => state.patients);
  const addPatient = useAppStore(state => state.addPatient);
  const updatePatient = useAppStore(state => state.updatePatient);
  
  const isEditing = !!id && id !== 'new';
  const patient = isEditing ? patients.find(p => p.id === id) : null;

  const [name, setName] = useState(patient?.name || '');
  const [phone, setPhone] = useState(patient?.phone || '');
  const [birthDate, setBirthDate] = useState(patient?.birthDate || '');
  const [frequency, setFrequency] = useState<Frequency>(patient?.frequency || 'Semanal');
  const [observations, setObservations] = useState(patient?.observations || '');

  const handleSave = () => {
    if (!name || !phone) return; // simple validation
    
    if (isEditing && id) {
      updatePatient(id, { name, phone, birthDate, frequency, observations });
    } else {
      addPatient({ name, phone, birthDate, frequency, observations });
    }
    navigate(-1);
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Detalhes do Paciente' : 'Novo Paciente'}</h2>
      
      <div className="flex flex-col gap-1.5 border-b border-transparent">
        <label className="text-sm font-bold text-slate-700">Nome Completo</label>
        <input 
          className="border border-slate-300 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface shadow-sm"
          value={name} onChange={e => setName(e.target.value)} placeholder="Ex: João da Silva"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-slate-700">Data de Nascimento</label>
        <input 
          type="date"
          className="border border-slate-300 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface shadow-sm w-full bg-white"
          value={birthDate} onChange={e => setBirthDate(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-slate-700">WhatsApp</label>
        <input 
          className="border border-slate-300 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface shadow-sm"
          value={phone} onChange={e => setPhone(e.target.value)} placeholder="(11) 99999-9999" type="tel"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-slate-700">Frequência</label>
        <select 
          className="border border-slate-300 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface shadow-sm w-full appearance-none bg-white"
          value={frequency} onChange={e => setFrequency(e.target.value as Frequency)}
        >
          <option value="Semanal">Semanal</option>
          <option value="Quinzenal">Quinzenal</option>
          <option value="Mensal">Mensal</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-slate-700">Observações Clínicas (Opcional)</label>
        <textarea 
          className="border border-slate-300 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface shadow-sm min-h-[140px]"
          value={observations} onChange={e => setObservations(e.target.value)} placeholder="Anotações sobre o quadro do paciente..."
        />
      </div>

      <button 
        onClick={handleSave}
        className="mt-6 bg-primary-600 active:bg-primary-700 text-white font-bold text-lg p-4 rounded-xl shadow-lg transition-transform active:scale-[0.98]"
      >
        {isEditing ? 'Salvar Alterações' : 'Cadastrar Paciente'}
      </button>
    </div>
  );
}
