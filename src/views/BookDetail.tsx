import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, Clock, LayoutGrid, Star, Save, Share2, 
  CheckCircle2, Lock, BookOpenCheck, Trash2, Sparkles, Quote, 
  Package, ChevronRight, Bookmark
} from 'lucide-react';
import { doc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { syncUserGamificationStats } from '../lib/gamification';
import { removeBookKeepHistory } from '../lib/bookUtils';
import { useAuth } from '../contexts/AuthContext';
import { TopBar } from '../components/TopBar';
import { BookCoverCard } from '../components/BookCoverCard';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const progressInputRef = useRef<HTMLInputElement>(null);
  
  const [book, setBook] = useState<any>(null);
  const [userBook, setUserBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [pagesRead, setPagesRead] = useState<number | ''>('');
  const [isShareable, setIsShareable] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    async function fetchBookData() {
      if (!id || !user) return;
      try {
        const bookDoc = await getDoc(doc(db, 'books', id));
        if (bookDoc.exists()) {
          const bData = bookDoc.data();
          setBook({ id: bookDoc.id, ...bData });
          if (bData.status === 'available') {
            setIsShareable(true);
          } else {
            setIsShareable(false);
          }
        }

        const q = query(
          collection(db, 'user_books'),
          where('userId', '==', user.uid),
          where('bookId', '==', id)
        );
        const ubs = await getDocs(q);
        if (!ubs.empty) {
          const ubData = ubs.docs[0].data();
          setUserBook({ id: ubs.docs[0].id, ...ubData });
          setPagesRead(ubData.pagesRead || 0);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBookData();
  }, [id, user]);

  const handleUpdateProgress = async () => {
    if (!userBook || !book || pagesRead === '') return;
    setIsSaving(true);
    try {
      const numPages = Number(pagesRead);
      const calculatedProgress = Math.round((numPages / (book.totalPages || 1)) * 100);
      const finalProgress = calculatedProgress > 100 ? 100 : calculatedProgress;
      const newStatus = finalProgress >= 100 ? 'Lido' : 'Lendo';
      const is100 = finalProgress >= 100;
      const finalShareable = is100 && isShareable;

      await updateDoc(doc(db, 'user_books', userBook.id), {
        pagesRead: numPages,
        progress: finalProgress,
        status: newStatus
      });

      if (book.ownerId === user?.uid || book.currentReaderId === user?.uid) {
        await updateDoc(doc(db, 'books', book.id), {
          pagesRead: numPages,
          status: finalShareable ? 'available' : 'reading_owner',
          currentReaderId: finalShareable ? null : user.uid,
          currentReaderName: finalShareable ? null : user.displayName || 'Explorador(a) de Mundos'
        });
        setBook((prev: any) => ({
          ...prev,
          status: finalShareable ? 'available' : 'reading_owner',
          currentReaderId: finalShareable ? null : user.uid,
          currentReaderName: finalShareable ? null : user.displayName || 'Explorador(a) de Mundos'
        }));
      }

      if (user) {
        await syncUserGamificationStats(user.uid);
      }

      alert('Progresso salvo com sucesso!');
      setUserBook({ ...userBook, pagesRead: numPages, progress: finalProgress, status: newStatus });
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar progresso.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleShare = async (newShareValue: boolean) => {
    if (!book || !user) return;
    setIsSaving(true);
    try {
      const isOwner = book.ownerId === user.uid;
      if (!isOwner) {
        alert('Apenas o proprietário do livro pode alterar o compartilhamento.');
        return;
      }

      const is100Read = userBook?.status === 'Lido' || (userBook?.progress && userBook.progress >= 100) || book?.status === 'available';

      if (newShareValue && !is100Read) {
        alert('🔒 O livro só pode ser compartilhado caso você tenha concluído 100% da leitura!');
        setIsSaving(false);
        return;
      }

      const newStatus = newShareValue ? 'available' : 'reading_owner';
      const newReaderId = newShareValue ? null : user.uid;
      const newReaderName = newShareValue ? null : user.displayName || 'Explorador(a) de Mundos';

      await updateDoc(doc(db, 'books', book.id), {
        status: newStatus,
        currentReaderId: newReaderId,
        currentReaderName: newReaderName
      });

      setBook((prev: any) => ({
        ...prev,
        status: newStatus,
        currentReaderId: newReaderId,
        currentReaderName: newReaderName
      }));
      setIsShareable(newShareValue);

      alert(newShareValue 
        ? '🎉 Livro disponibilizado com sucesso na Biblioteca Compartilhada do Clube!' 
        : '🔒 Livro removido do compartilhamento e mantido na sua biblioteca pessoal.'
      );
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar compartilhamento.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBook = async () => {
    if (!user || !book) return;
    setIsSaving(true);
    try {
      await removeBookKeepHistory(user.uid, book.id, userBook?.id);
      await syncUserGamificationStats(user.uid);
      setShowDeleteModal(false);
      alert('Livro removido da sua biblioteca. Todo o histórico de trocas e conversas foi preservado com sucesso.');
      navigate('/library');
    } catch (err) {
      console.error('Error deleting book:', err);
      alert('Erro ao remover o livro. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTitleEdit = async (newTitle: string) => {
    if (!book || !user || !newTitle.trim()) return;
    if (book.ownerId !== user.uid) {
      alert('Apenas o guardião original pode alterar o título do livro.');
      return;
    }
    
    try {
      await updateDoc(doc(db, 'books', book.id), {
        title: newTitle.trim()
      });
      setBook((prev: any) => ({ ...prev, title: newTitle.trim() }));
    } catch (err) {
      console.error('Error updating title:', err);
      alert('Erro ao atualizar o título.');
    }
  };

  const scrollToProgress = () => {
    if (progressInputRef.current) {
      progressInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      progressInputRef.current.focus();
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center font-body-lg text-[#0c6780]">Carregando magia...</div>;
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center font-body-lg text-[#0c6780]">
        <p className="mb-6 font-headline-lg-mobile">Livro não encontrado.</p>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 bg-[#0c6780] text-white font-label-lg px-6 py-3 rounded-full hover:scale-105 transition-transform shadow-sm">
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fefccf] text-[#1d1d03] relative overflow-x-hidden selection:bg-[#fcd400] selection:text-[#6e5c00]">
      {/* Playful Background Shapes */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.7, 0.4, 0.7] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-[#87ceeb] rounded-full mix-blend-multiply filter blur-3xl"
        />
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          className="absolute top-[20%] right-[-10%] w-80 h-80 bg-[#fcd400] rounded-full mix-blend-multiply filter blur-3xl"
        />
        <motion.div 
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
          className="absolute bottom-[-10%] left-[20%] w-72 h-72 bg-[#76da75] rounded-full mix-blend-multiply filter blur-3xl"
        />
      </div>

      <header className="w-full top-0 sticky z-50 bg-[#fefccf]/80 backdrop-blur-md shadow-[0_8px_30px_rgb(12,103,128,0.1)] transition-all duration-300 ease-out">
        <div className="flex justify-between items-center px-6 py-4 w-full max-w-[1200px] mx-auto">
          <button 
            onClick={() => navigate(-1)} 
            aria-label="Voltar" 
            className="flex items-center justify-center w-12 h-12 rounded-full bg-[#eceabe] text-[#0c6780] hover:scale-110 transition-transform shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-7 h-7" />
          </button>
          
          <div className="flex items-center gap-3">
            <img 
              alt="Logo" 
              className="w-10 h-10 rounded-full shadow-sm" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDva-qK4dyshafW3iHriK_oaoWDV0E5SDZxy3pRs9l10h-O-HsKPwBuNWz4Prq3eOOaSdnkLKpNrmXPhgq97ixztTflLeRNdKbmsb26CcgaTduzvAetWhhndOzY_Lzi4kE-YnxIfiohbpM6LGc-h1go6Xb-IwyzmGtQx2D0B_Z5Eg1jSJR4tTUZ-c91HTq35mzNbENb7_7UeeFiL3Xy1TXAC5OYV4KGNKHa8SJlmnnt_Xz9oUkgLRpTr8qgTEN3Rnk4yAhoWV3WwlNA" 
            />
            <span className="font-headline-lg-mobile text-[#0c6780] drop-shadow-sm">Magic Library</span>
          </div>

          <button className="w-12 h-12 rounded-full bg-[#87ceeb] text-white flex items-center justify-center hover:scale-110 transition-transform overflow-hidden shadow-sm border-2 border-white">
            <img 
              alt="Avatar" 
              className="w-full h-full object-cover" 
              src={user?.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuARIYEBYr2Qu-wJTbfzQD633QObYH01qK-pkJE9uSM1l4NPyKGA3ME4i4dqelhpeFcIjASLUvSiAQDlDxShyExEqqUzuUhinFZI2A7AsGZ43IN0cFZjBaJkATFNYbVcoRP71AEQbiNWmF6fGdxv5f9w3DIW63-uZ091WJhSAi2KkkyAzx42zgR8ur0x-Bo6fNJVrc9ywW0zVIaZKAqhSetEs3ip7Wz-2tsvnn_PHbOxVVC2ZJkoUIL-qqhQYab8grZ2oe2lAo6x57HB"} 
            />
          </button>
        </div>
      </header>

      <main className="relative z-10 w-full max-w-[1200px] mx-auto px-6 py-8 pb-32 md:pb-16 flex flex-col items-center">
        <article className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Book Cover Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full max-w-sm mx-auto md:mx-0 float-anim"
          >
            <div className="absolute inset-0 bg-[#e9c400]/30 rounded-[2rem] blur-2xl transform scale-105"></div>
            <div className="relative z-10 aspect-[3/4] w-full rounded-[2rem] border-[3px] border-[#87ceeb] bg-white shadow-[0_20px_50px_rgba(12,103,128,0.2)] overflow-hidden">
              <BookCoverCard 
                coverUrl={book.coverUrl}
                title={book.title}
                author={book.author}
                className="w-full h-full"
                onTitleEdit={handleTitleEdit}
              />
              {book.status === 'available' && (
                <div className="absolute top-4 right-4 bg-[#006e1c] text-white font-label-lg text-xs px-4 py-1.5 rounded-full shadow-md transform rotate-3 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 fill-current" /> Novo
                </div>
              )}
            </div>
          </motion.div>

          {/* Book Info */}
          <div className="flex flex-col space-y-6 text-center md:text-left">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-[#87ceeb]/30 text-[#005870] px-4 py-2 rounded-full font-label-lg text-sm w-fit mx-auto md:mx-0">
                <LayoutGrid className="w-4 h-4" />
                {book.category || 'Aventura Épica'}
              </div>
              <h1 className="font-headline-xl text-[#0c6780] drop-shadow-sm leading-tight">{book.title}</h1>
              <p className="font-body-lg text-[#3f484c]">Por {book.author}</p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="bg-white/40 backdrop-blur-md border-2 border-[#87ceeb]/50 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-[#fcd400] text-[#6e5c00] flex items-center justify-center">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div className="text-left">
                  <div className="font-label-lg text-xs text-[#3f484c]">Dificuldade</div>
                  <div className="font-body-md text-[#0c6780] font-bold">{book.difficulty || 'Iniciante'}</div>
                </div>
              </div>
              <div className="bg-white/40 backdrop-blur-md border-2 border-[#87ceeb]/50 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-[#76da75] text-[#005f17] flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-label-lg text-xs text-[#3f484c]">Tempo Mágico</div>
                  <div className="font-body-md text-[#0c6780] font-bold">15 min</div>
                </div>
              </div>
            </div>

            <div className="bg-[#f8f6c9] p-6 rounded-[2rem] border-2 border-[#e6e5b9] shadow-sm relative">
              <Quote className="absolute top-4 right-4 text-[#87ceeb] opacity-30 w-10 h-10 transform -rotate-12" />
              <h2 className="font-body-lg text-[#0c6780] mb-2 flex items-center gap-2 font-bold">
                <Sparkles className="w-5 h-5 text-[#705d00] fill-[#705d00]" />
                Sobre a Aventura
              </h2>
              <p className="font-body-md text-[#3f484c] leading-relaxed">
                {book.synopsis || "Prepare-se para uma jornada incrível! Uma história mágica que vai levar sua imaginação para novos mundos fantásticos. Você está pronto para começar?"}
              </p>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={scrollToProgress}
                className="flex-1 bg-[#fcd400] text-[#6e5c00] font-headline-lg-mobile md:text-lg py-4 px-6 rounded-full shadow-[0_8px_0_rgba(112,93,0,0.2)] hover:translate-y-1 hover:shadow-[0_4px_0_rgba(112,93,0,0.2)] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
              >
                <div className="absolute inset-0 shimmer pointer-events-none"></div>
                <BookOpen className="w-6 h-6 group-hover:scale-110 transition-transform fill-current" />
                <span className="relative z-10">{userBook ? 'Continuar Leitura' : 'Começar Leitura'}</span>
              </button>
              
              <Link 
                to="/profile"
                className="flex-1 bg-[#0c6780] text-white font-headline-lg-mobile md:text-lg py-4 px-6 rounded-full shadow-[0_8px_0_rgba(0,77,98,0.3)] hover:translate-y-1 hover:shadow-[0_4px_0_rgba(0,77,98,0.3)] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-2 group"
              >
                <Package className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                Ver Tesouros
              </Link>
            </div>

            {/* Refined Progress Editor */}
            <AnimatePresence>
              {userBook && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-white/60 backdrop-blur-sm p-6 rounded-[2rem] border-2 border-[#fcd400] shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-body-lg text-[#0c6780] font-bold flex items-center gap-2">
                      <Bookmark className="w-5 h-5 text-[#705d00]" /> Meu Progresso ({userBook.progress}%)
                    </h3>
                    {userBook.status === 'Lido' && (
                      <span className="bg-[#76da75] text-[#005f17] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Concluído
                      </span>
                    )}
                  </div>

                  <div className="w-full bg-[#e6e5b9] rounded-full h-3 overflow-hidden shadow-inner">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-700 ease-out",
                        userBook.status === 'Lido' ? "bg-[#006e1c]" : "bg-[#87ceeb] progress-glow"
                      )}
                      style={{ width: `${userBook.progress}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <div className="relative flex-1">
                      <input 
                        ref={progressInputRef}
                        type="number" 
                        value={pagesRead}
                        onChange={(e) => setPagesRead(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-white border-2 border-[#e6e5b9] rounded-2xl py-3 px-4 font-body-md text-[#1d1d03] focus:outline-none focus:border-[#0c6780] shadow-sm"
                        placeholder="Páginas lidas"
                        min="0"
                        max={book.totalPages}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#6f787d] font-bold">
                        de {book.totalPages}
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleUpdateProgress}
                      disabled={isSaving || pagesRead === ''}
                      className="bg-[#0c6780] text-white font-label-lg py-3.5 px-6 rounded-2xl shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? 'Salvando...' : 'Salvar'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sharing / Advanced Section */}
            {userBook && (
              <div className="pt-4 flex flex-col gap-3">
                 {book.ownerId === user?.uid && (
                   <div className="p-5 bg-white/40 border-2 border-[#87ceeb]/40 rounded-3xl flex flex-col gap-3">
                     <div className="flex items-center justify-between">
                        <h4 className="font-body-md text-[#0c6780] font-bold flex items-center gap-2">
                          <Share2 className="w-4 h-4" /> Compartilhar com o Clube
                        </h4>
                        <div className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          book.status === 'available' ? "bg-[#76da75]/20 text-[#006e1c]" : "bg-[#3f484c]/10 text-[#3f484c]"
                        )}>
                          {book.status === 'available' ? 'Público' : 'Privado'}
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-3 bg-white/50 p-3 rounded-xl border border-[#87ceeb]/20">
                        <input
                          type="checkbox"
                          id="shareBookDetailToggle"
                          checked={isShareable || book.status === 'available'}
                          disabled={isSaving}
                          onChange={(e) => handleToggleShare(e.target.checked)}
                          className="w-5 h-5 text-[#0c6780] border-[#bfc8cd] rounded focus:ring-[#0c6780] cursor-pointer"
                        />
                        <label htmlFor="shareBookDetailToggle" className="text-sm font-bold text-[#3f484c] cursor-pointer">
                          Disponibilizar para empréstimo no Clube
                        </label>
                     </div>
                   </div>
                 )}

                 <button
                  onClick={() => setShowDeleteModal(true)}
                  disabled={isSaving}
                  className="w-full py-4 text-red-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-50 rounded-2xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Remover livro da minha estante
                </button>
              </div>
            )}
          </div>
        </article>
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white max-w-sm w-full p-8 rounded-3xl shadow-2xl space-y-6 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-headline-sm font-bold text-[#1d1d03] mb-2">Apagar Livro?</h3>
                <p className="font-body-md text-[#3f484c]">
                  Tem certeza que deseja remover esta aventura da sua estante? Seu progresso será guardado, mas o livro não aparecerá mais aqui.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 px-4 rounded-2xl border-2 border-[#bfc8cd] text-[#3f484c] font-bold hover:bg-[#f2f0c4] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteBook}
                  disabled={isSaving}
                  className="flex-1 py-3 px-4 rounded-2xl bg-red-600 text-white font-bold shadow-lg hover:bg-red-700 transition-all"
                >
                  {isSaving ? 'Removendo...' : 'Sim, remover'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

