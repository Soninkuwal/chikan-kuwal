'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { GameState } from '@/app/page';
import { cn } from '@/lib/utils';
import Butterfly from './Butterfly';
import Cloud from './Cloud';

type GameSceneProps = {
  gameState: GameState;
  onGameEnd: (didCrash: boolean) => void;
  onMultiplierChange: (multiplier: number) => void;
  crashPoint: number | null;
  multiplier: number;
};

const GAME_DURATION = 30000; // 30 seconds for a slower run
const GATES = ['1.50x', '2.00x', '2.50x', '3.00x', '5.00x', '7.50x', '10.00x'];
const BUTTERFLY_COUNT = 10;
const CLOUD_COUNT = 7;


export default function GameScene({ gameState, onGameEnd, onMultiplierChange, crashPoint, multiplier }: GameSceneProps) {
  const chickenRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const multiplierIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [crashed, setCrashed] = useState(false);

  useEffect(() => {
    const chickenEl = chickenRef.current;

    const cleanup = () => {
      if (animationRef.current) {
        animationRef.current.cancel();
        animationRef.current = null;
      }
      if (multiplierIntervalRef.current) {
        clearInterval(multiplierIntervalRef.current);
        multiplierIntervalRef.current = null;
      }
      if (chickenEl) chickenEl.style.left = '10%';
    };

    if (gameState === 'running' && chickenEl && crashPoint) {
      setCrashed(false);
      
      animationRef.current = chickenEl.animate(
        [
          { left: '10%' },
          { left: '85%' },
        ],
        {
          duration: GAME_DURATION,
          easing: 'ease-in-out',
          fill: 'forwards',
        }
      );

      const startTime = Date.now();
      multiplierIntervalRef.current = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        // Exponential curve for multiplier
        const newMultiplier = 1 + Math.pow(elapsedTime / 5000, 2);
        
        if (newMultiplier < crashPoint) {
            onMultiplierChange(newMultiplier);
        } else {
            if (multiplierIntervalRef.current) clearInterval(multiplierIntervalRef.current);
            if(animationRef.current) animationRef.current.pause();
            setCrashed(true);
            onGameEnd(true);
        }
      }, 50);

      animationRef.current.onfinish = () => {
        if (multiplierIntervalRef.current) clearInterval(multiplierIntervalRef.current);
        onGameEnd(false);
      };

    } else if (gameState === 'finished' || gameState === 'ready') {
      cleanup();
      // Reset visual state
      if (crashed) {
          // Keep crashed state for a moment before resetting
          setTimeout(() => setCrashed(false), 500);
      } else {
          setCrashed(false);
      }
    }

    return cleanup;
  }, [gameState, crashPoint]);
  
  return (
    <div className={cn("w-full h-full relative road-bg flex flex-col justify-center", {
        'road-moving': gameState === 'running'
    })}>
      
      <div className="absolute inset-0 z-0 overflow-hidden">
        {Array.from({ length: CLOUD_COUNT }).map((_, i) => (
          <Cloud key={`cloud-${i}`} />
        ))}
        {Array.from({ length: BUTTERFLY_COUNT }).map((_, i) => (
          <Butterfly key={`butterfly-${i}`} />
        ))}
      </div>
      
      {/* Gates */}
      {gameState === 'running' && (
        <div className="absolute top-1/2 -translate-y-2/3 h-12 w-full overflow-hidden">
          <div className="absolute left-0 top-0 flex h-full items-center gate-container-animate">
              {/* Render gates twice for a seamless loop */}
              {GATES.concat(GATES).map((gate, index) => (
                  <div key={index} className="flex-shrink-0 w-64 h-full flex items-center justify-center">
                    <div className="text-accent font-bold text-2xl gate-glow bg-black/30 px-4 py-1 rounded-lg border-2 border-accent">
                        {gate}
                    </div>
                  </div>
              ))}
          </div>
        </div>
      )}

      {/* Chicken Start Door */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[150px] w-[80px] bg-gray-800/50 rounded-r-full border-y-4 border-r-4 border-black/20" style={{transform: 'translateY(-50%)'}}></div>


      <div 
        ref={chickenRef} 
        className={cn(
            'absolute z-10 top-1/2 -translate-y-[60%] transition-transform duration-300',
            { 'chicken-bounce': gameState !== 'running' && !crashed }
        )}
        style={{ left: '10%' }} 
      >
        <Image
          src={crashed ? "https://chickenroad.rajmines.com/images/blast.png" : "https://chickenroad.rajmines.com/images/chicken.png"}
          alt="Game Character"
          width={crashed ? 100 : 80}
          height={crashed ? 100 : 80}
          unoptimized
          className={cn('drop-shadow-2xl', { 'animate-ping': crashed })}
        />
      </div>
    </div>
  );
}
