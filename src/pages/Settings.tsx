import { useState } from 'react';
import { useAppStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Trash2, ShieldAlert } from 'lucide-react';

export default function Settings() {
  const deleteAccount = useAppStore(state => state.deleteAccount);
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = () => {
    deleteAccount();
    navigate('/');
    // Could also clear local storage or trigger auth sign out here
  };

  return (
    <div className="p-4 flex flex-col gap-6 h-full">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary-100 p-3 rounded-full text-primary-600">
           <ShieldAlert size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Configurações</h1>
          <p className="text-sm text-text-secondary">Gerencie os dados da sua conta</p>
        </div>
      </div>

      <div className="bg-surface border border-slate-200 rounded-2xl p-5 mt-4">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-red-600">
           <AlertTriangle size={20} /> Área de Risco
        </h3>
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          Excluir sua conta removerá permanentemente todos os seus dados: pacientes, consultas e informações financeiras do dispositivo local. 
        </p>

        {confirmDelete ? (
          <div className="bg-red-50 p-4 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-2">
             <p className="text-red-800 font-bold mb-3 text-center">Tem certeza absoluta?</p>
             <div className="flex gap-3">
               <button 
                 onClick={() => setConfirmDelete(false)}
                 className="flex-1 bg-white text-slate-700 font-bold border border-slate-300 rounded-lg p-3 active:bg-slate-50 transition-colors"
               >
                 Cancelar
               </button>
               <button 
                 onClick={handleDelete}
                 className="flex-1 bg-red-600 text-white font-bold rounded-lg p-3 active:bg-red-700 transition-colors shadow-md shadow-red-200"
               >
                 Sim, excluir
               </button>
             </div>
          </div>
        ) : (
          <button 
            onClick={() => setConfirmDelete(true)}
            className="w-full border-2 border-red-100 text-red-600 hover:bg-red-50 font-bold p-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 size={18} /> Excluir Minha Conta
          </button>
        )}
      </div>
      
      <div className="mt-auto pb-4 text-center">
        <p className="text-xs text-slate-400 font-medium">PsychApp v1.0.0</p>
        <p className="text-xs text-slate-400">PWA Mobile Experience</p>
      </div>
    </div>
  );
}
