import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, BookOpen, Compass, Users, X, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const steps = [
  {
    title: 'Bem-vindo à Magic Library! 🌟',
    description: 'Aqui, cada livro é uma porta para um novo mundo. Prepare-se para embarcar em grandes aventuras literárias!',
    icon: <Sparkles className="w-16 h-16 text-secondary fill-secondary pulse-anim" />
  },
  {
    title: 'Sua Estante Mágica 📚',
    description: 'Guarde seus livros lidos e os que deseja ler. Acompanhe seu progresso e veja sua magia crescer a cada página.',
    icon: <BookOpen className="w-16 h-16 text-primary" />
  },
  {
    title: 'Busca Inteligente 🧭',
    description: 'Use nossa Bússola Mágica (Inteligência Artificial) para buscar livros pela sinopse, título ou autor!',
    icon: <Compass className="w-16 h-16 text-tertiary" />
  },
  {
    title: 'Clubes e Trocas 🤝',
    description: 'Em breve, conecte-se com outros exploradores, troque livros físicos e suba de nível no seu grimório!',
    icon: <Users className="w-16 h-16 text-on-surface" />
  }
];

export function TourGuide() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (user) {
      const tourStatus = localStorage.getItem(`magic_library_tour_${user.uid}`);
      if (tourStatus !== 'completed' && tourStatus !== 'skipped') {
        // Show after a small delay
        const timer = setTimeout(() => setIsVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    if (user) {
      localStorage.setItem(`magic_library_tour_${user.uid}`, 'completed');
    }
    setIsVisible(false);
  };

  const handleSkip = () => {
    if (user) {
      localStorage.setItem(`magic_library_tour_${user.uid}`, 'skipped');
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-scrim/60 backdrop-blur-sm"
          onClick={handleSkip}
        />

        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-md bg-surface-container-lowest rounded-[2rem] shadow-2xl border-4 border-primary-container overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4">
            <div className="flex gap-2">
              {steps.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-2 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-6 bg-primary' : 'w-2 bg-surface-variant'}`}
                />
              ))}
            </div>
            <button 
              onClick={handleSkip}
              className="p-2 text-on-surface-variant hover:text-error transition-colors rounded-full hover:bg-surface-variant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 pt-4 flex flex-col items-center text-center">
            <motion.div 
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <div className="w-24 h-24 mb-6 rounded-full bg-primary-container/30 flex items-center justify-center">
                {steps[currentStep].icon}
              </div>
              <h2 className="font-headline-lg text-primary mb-4">
                {steps[currentStep].title}
              </h2>
              <p className="font-body-lg text-on-surface-variant">
                {steps[currentStep].description}
              </p>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="p-6 pt-0 flex justify-between items-center">
            <button 
              onClick={handleSkip}
              className="font-label-lg text-on-surface-variant hover:text-primary transition-colors px-4 py-2"
            >
              Pular Tour
            </button>
            <button 
              onClick={handleNext}
              className="bg-primary text-on-primary font-label-lg px-6 py-3 rounded-full shadow-[0_4px_15px_rgba(0,77,98,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              {currentStep === steps.length - 1 ? 'Começar!' : 'Próximo'}
              {currentStep < steps.length - 1 && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
