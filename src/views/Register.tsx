import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, User as UserIcon, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [realName, setRealName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { registerWithEmail, loginWithEmail, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password, name, realName);
      }
      navigate('/dashboard');
    } catch (err: any) {
      const errorCode = err.code || '';
      const errorMessage = err.message || '';
      if (errorCode === 'auth/invalid-credential' || errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password' || errorMessage.includes('auth/invalid-credential') || errorMessage.includes('auth/wrong-password')) {
         setError('Email ou senha incorretos.');
      } else if (errorCode === 'auth/email-already-in-use' || errorMessage.includes('auth/email-already-in-use')) {
         setError('Este email já está sendo usado por outro explorador.');
      } else if (errorCode === 'auth/weak-password' || errorMessage.includes('auth/weak-password')) {
         setError('A senha deve ter pelo menos 6 caracteres.');
      } else if (errorCode === 'auth/operation-not-allowed' || errorMessage.includes('auth/operation-not-allowed')) {
         setError('O login por email/senha não está ativado. Ative-o no console do Firebase (Authentication > Sign-in method).');
      } else {
         setError(err.message || 'Ops! A magia falhou.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('O login com Google não está ativado. Ative-o no console do Firebase (Authentication > Sign-in method).');
      } else {
        setError('Falha ao entrar com Google.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary-container/30 blur-[80px] float-anim" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-secondary-container/20 blur-[100px] float-anim" style={{ animationDuration: '12s', animationDelay: '2s' }}></div>
      </div>

      <div className="z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-surface-container border-4 border-primary-container shadow-md mb-4 relative">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDva-qK4dyshafW3iHriK_oaoWDV0E5SDZxy3pRs9l10h-O-HsKPwBuNWz4Prq3eOOaSdnkLKpNrmXPhgq97ixztTflLeRNdKbmsb26CcgaTduzvAetWhhndOzY_Lzi4kE-YnxIfiohbpM6LGc-h1go6Xb-IwyzmGtQx2D0B_Z5Eg1jSJR4tTUZ-c91HTq35mzNbENb7_7UeeFiL3Xy1TXAC5OYV4KGNKHa8SJlmnnt_Xz9oUkgLRpTr8qgTEN3Rnk4yAhoWV3WwlNA" 
              alt="Logo" 
              className="w-12 h-12 object-contain"
            />
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-secondary fill-secondary pulse-anim" />
          </div>
          <h1 className="font-headline-lg text-primary">Magic Library</h1>
          <p className="font-body-md text-on-surface-variant mt-2">
            {isLogin ? 'Bem-vindo de volta, explorador!' : 'Crie sua conta para começar a aventura!'}
          </p>
        </div>

        <div className="glass-panel bg-surface-container-lowest/80 rounded-3xl p-6 md:p-8 magic-shadow border-[2px] border-primary-container/50">
          
          {error && (
            <div className="bg-error-container text-on-error-container p-3 rounded-xl mb-4 font-body-md text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {!isLogin && (
              <>
                <div className="space-y-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-primary">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Seu Nome Mágico de Exibição (Exclusivo)" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={!isLogin}
                      className="w-full bg-surface-container-highest border-2 border-surface-variant rounded-xl py-3 pl-12 pr-4 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary-container/30 transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-on-surface-variant px-1 font-medium">
                    ⚠️ Este nome é exclusivo e <span className="text-primary font-bold">não poderá ser alterado</span> após o cadastro.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-primary">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Seu Nome Real" 
                    value={realName}
                    onChange={(e) => setRealName(e.target.value)}
                    required={!isLogin}
                    className="w-full bg-surface-container-highest border-2 border-surface-variant rounded-xl py-3 pl-12 pr-4 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary-container/30 transition-all"
                  />
                </div>
              </>
            )}

            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-primary">
                <Mail className="w-5 h-5" />
              </div>
              <input 
                type="email" 
                placeholder="Seu Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-surface-container-highest border-2 border-surface-variant rounded-xl py-3 pl-12 pr-4 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary-container/30 transition-all"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-primary">
                <Lock className="w-5 h-5" />
              </div>
              <input 
                type="password" 
                placeholder="Sua Senha Secreta" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-surface-container-highest border-2 border-surface-variant rounded-xl py-3 pl-12 pr-4 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary-container/30 transition-all"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="mt-2 w-full bg-primary text-on-primary font-headline-lg-mobile text-[18px] py-3 rounded-xl shadow-[0_8px_0_rgba(0,77,98,0.3)] hover:translate-y-1 hover:shadow-[0_4px_0_rgba(0,77,98,0.3)] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
            >
              {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
              {isLoading ? 'Carregando...' : (isLogin ? 'Entrar na Biblioteca' : 'Criar Conta')}
            </button>
          </form>

          <div className="mt-6 mb-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-outline-variant"></div>
            <span className="font-label-lg text-on-surface-variant">OU</span>
            <div className="flex-1 h-px bg-outline-variant"></div>
          </div>

          <button 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-surface-container border-2 border-outline-variant text-on-surface font-body-lg py-3 rounded-xl hover:bg-surface-variant transition-colors flex items-center justify-center gap-3 shadow-sm disabled:opacity-70"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Entrar com Google
          </button>
        </div>

        <p className="text-center mt-6 font-body-md text-on-surface-variant">
          {isLogin ? 'Ainda não tem uma conta?' : 'Já é um explorador?'}
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }} 
            className="ml-2 font-bold text-primary hover:underline focus:outline-none"
          >
            {isLogin ? 'Cadastre-se aqui' : 'Entre aqui'}
          </button>
        </p>

        {!isLogin && (
          <p className="text-center mt-4 text-xs font-body-md text-on-surface-variant opacity-70">
            * Para usar email/senha, lembre-se de ativá-lo no console do Firebase!
          </p>
        )}
      </div>
    </div>
  );
}
