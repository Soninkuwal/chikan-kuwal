
'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import GameHeader from '@/components/game/GameHeader';
import GameScene from '@/components/game/GameScene';
import ControlPanel from '@/components/game/ControlPanel';
import { Sidebar } from '@/components/game/Sidebar';
import { useToast } from '@/hooks/use-toast';
import BottomNavBar from '@/components/game/BottomNavBar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';

export type GameState = 'ready' | 'running' | 'finished';

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [gameState, setGameState] = useState<GameState>('ready');
  const [betAmount, setBetAmount] = useState<number>(100);
  const [multiplier, setMultiplier] = useState(1.0);
  const [crashPoint, setCrashPoint] = useState<number | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(300);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      router.push('/auth');
    } else {
      setIsAuthenticated(true);
      const savedBalance = localStorage.getItem('walletBalance');
      if (savedBalance) {
        setWalletBalance(JSON.parse(savedBalance));
      }
      const savedBetAmount = localStorage.getItem('betAmount');
      if (savedBetAmount) {
          setBetAmount(JSON.parse(savedBetAmount));
      }
    }
  }, [router]);

  useEffect(() => {
    if (isAuthenticated) {
        localStorage.setItem('walletBalance', JSON.stringify(walletBalance));
    }
  }, [walletBalance, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
        localStorage.setItem('betAmount', JSON.stringify(betAmount));
    }
  }, [betAmount, isAuthenticated]);


  const handlePlay = () => {
    if (gameState === 'ready' || gameState === 'finished') {
      if (walletBalance < betAmount) {
        toast({
          variant: "destructive",
          title: "Insufficient Funds",
          description: `You do not have enough money (₹${walletBalance.toFixed(2)}) to place a bet of ₹${betAmount}.`,
        })
        return;
      }

      setWalletBalance((prev) => prev - betAmount);
      setGameState('running');
      setMultiplier(1.0);
      // Ensure crash point is at least 1.1x and gives reasonable time
      const randomCrashPoint = 1.1 + Math.random() * 4;
      setCrashPoint(randomCrashPoint);
    }
  };

  const handleCashOut = () => {
    if (gameState === 'running') {
      const winnings = betAmount * multiplier;
      setWalletBalance((prev) => prev + winnings);
      setGameState('finished');
      toast({
        title: `🎉 You Won! 🎉`,
        description: `Cashed out at ${multiplier.toFixed(2)}x and won ₹${winnings.toFixed(2)}!`,
      })
    }
  }

  const handleGameEnd = (didCrash: boolean) => {
    if (gameState !== 'running') return; // Prevent multiple calls
    
    setGameState('finished');
    if (didCrash) {
      toast({
        variant: "destructive",
        title: "Oh No! You Crashed!",
        description: `You lost your bet of ₹${betAmount}. Better luck next time!`,
      })
    }
  }

  if (!isAuthenticated) {
      return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4">
            <div className="space-y-4 w-full max-w-lg">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
        </div>
      );
  }

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-background font-body">
      <GameHeader onMenuClick={() => setSidebarOpen(true)} walletBalance={walletBalance} />
      <div className="relative flex-1 pb-40 md:pb-0">
        <GameScene 
          gameState={gameState} 
          onGameEnd={handleGameEnd}
          onMultiplierChange={setMultiplier}
          crashPoint={crashPoint}
          multiplier={multiplier}
        />
      </div>
      <div className="md:relative absolute bottom-16 left-0 right-0 z-20">
         <ControlPanel 
            gameState={gameState} 
            onPlay={handlePlay} 
            onCashOut={handleCashOut}
            betAmount={betAmount}
            onBetAmountChange={setBetAmount}
            multiplier={multiplier}
        />
      </div>
      <Sidebar 
        isOpen={isSidebarOpen} 
        onOpenChange={setSidebarOpen} 
      />
      {isMobile && <BottomNavBar onMenuClick={() => setSidebarOpen(true)} />}
    </div>
  );
}
