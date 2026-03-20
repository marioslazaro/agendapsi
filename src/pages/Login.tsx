import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isSignUp && !name)) return;
    setLoading(true);
    setErrorMsg('');
    
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
      });
      if (error) setErrorMsg(error.message);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setErrorMsg('Email ou senha inválidos.');
    }
    setLoading(false);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-primary-50 to-surface relative overflow-y-auto overflow-x-hidden">
      
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[50%] bg-primary-600 rounded-[100%] opacity-10 blur-3xl pointer-events-none"></div>

      <div className="flex flex-col items-center justify-center w-full max-w-sm z-10 animate-in fade-in slide-in-from-bottom-6 duration-700 mt-8 mb-8">
        
        <div className="mb-6 relative flex justify-center">
          <img src="/logo.png" alt="AgendaPsi Logo" className="w-32 h-32 object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500" />
          <div className="absolute top-2 right-2 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full animate-ping"></div>
        </div>
        
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight text-center mb-1">AgendaPsi</h1>
        <p className="text-slate-500 font-medium text-center mb-6 text-sm">Gestão Clínica Inteligente.</p>
        
        {errorMsg && (
          <div className="w-full bg-red-50 border border-red-200 text-red-600 text-sm font-medium p-3 rounded-xl mb-4 text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="w-full flex flex-col gap-3 mb-6">
          {isSignUp && (
            <input 
              type="text"
              placeholder="Nome Completo"
              value={name} onChange={e => setName(e.target.value)}
              className="w-full bg-white border border-slate-200 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm transition-all"
              required
            />
          )}
          <input 
            type="email"
            placeholder="E-mail"
            value={email} onChange={e => setEmail(e.target.value)}
            className="w-full bg-white border border-slate-200 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm transition-all"
            required
          />
          <input 
            type="password"
            placeholder="Senha"
            value={password} onChange={e => setPassword(e.target.value)}
            className="w-full bg-white border border-slate-200 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm transition-all"
            required
          />
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white font-bold p-3.5 rounded-xl shadow-md shadow-primary-200 hover:bg-primary-700 transition-all active:scale-[0.98] disabled:opacity-70 mt-2 flex justify-center"
          >
            {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : (isSignUp ? 'Criar Conta' : 'Entrar')}
          </button>
        </form>

        <div className="flex items-center gap-4 w-full mb-6">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">OU</span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          type="button"
          className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-bold p-3.5 rounded-xl shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98] disabled:opacity-70 mb-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
             <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
             <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
             <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
             <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
             <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
          Continuar com Google
        </button>

        <p className="text-sm font-medium text-slate-500 text-center">
          {isSignUp ? 'Já possui uma conta?' : 'Não tem uma conta?'} {' '}
          <button 
            type="button" 
            onClick={() => setIsSignUp(!isSignUp)} 
            className="text-primary-600 font-bold hover:underline"
          >
            {isSignUp ? 'Fazer Login' : 'Criar Conta'}
          </button>
        </p>

      </div>
    </div>
  );
}
