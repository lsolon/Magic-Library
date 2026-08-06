import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Sparkles, User as UserIcon } from 'lucide-react';

export default function SetupProfile() {
  const { completeProfile } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [realName, setRealName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setIsLoading(true);
      await completeProfile(name, realName);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Erro ao configurar perfil.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center p-4 relative overflow-hidden">
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
          <h1 className="font-headline-lg text-primary">Quase lá!</h1>
          <p className="font-body-md text-on-surface-variant mt-2">
            Como você quer ser chamado na Magic Library?
          </p>
        </div>

        <div className="glass-panel bg-surface-container-lowest/80 rounded-3xl p-6 md:p-8 magic-shadow border-[2px] border-primary-container/50">
          
          {error && (
            <div className="bg-error-container text-on-error-container p-3 rounded-xl mb-4 font-body-md text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
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
                  required
                  className="w-full bg-surface-container-highest border-2 border-surface-variant rounded-xl py-3 pl-12 pr-4 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary-container/30 transition-all"
                />
              </div>
              <p className="text-[11px] text-on-surface-variant px-1 font-medium">
                ⚠️ Este nome é exclusivo e <span className="text-primary font-bold">não poderá ser alterado</span>.
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
                required
                className="w-full bg-surface-container-highest border-2 border-surface-variant rounded-xl py-3 pl-12 pr-4 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary-container/30 transition-all"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="mt-4 w-full bg-primary text-on-primary font-headline-lg-mobile text-[18px] py-3 rounded-xl shadow-[0_8px_0_rgba(0,77,98,0.3)] hover:translate-y-1 hover:shadow-[0_4px_0_rgba(0,77,98,0.3)] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
            >
              {isLoading ? 'Salvando...' : 'Começar a Aventura'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
