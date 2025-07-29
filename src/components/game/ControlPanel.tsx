
'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { HandCoins } from 'lucide-react'
import Image from 'next/image'
import { GameState } from '@/app/page'

type ControlPanelProps = {
  gameState: GameState;
  onPlay: () => void;
  onCashOut: () => void;
  betAmount: number;
  onBetAmountChange: (amount: number) => void;
  multiplier: number;
};

export default function ControlPanel({ gameState, onPlay, onCashOut, betAmount, onBetAmountChange, multiplier }: ControlPanelProps) {
  
  const betAmounts = [100, 300, 500, 1000, 1500, 2000];
  const isRunning = gameState === 'running';

  return (
    <div className="p-2 md:p-4">
      <div className="max-w-4xl mx-auto bg-card/80 backdrop-blur-md rounded-2xl p-2 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4 border border-border shadow-2xl">
        <div className="w-full md:w-auto">
          <p className="text-white font-semibold mb-1 text-center text-sm md:hidden">Select Bet Amount</p>
          <div className="grid grid-cols-3 sm:flex gap-1">
          {betAmounts.map(amount => (
            <Button 
              key={amount} 
              variant={betAmount === amount ? "primary" : "secondary"} 
              size="sm"
              className="font-bold sm:text-base flex-1"
              onClick={() => onBetAmountChange(amount)}
              disabled={isRunning}
            >
              ₹{amount}
            </Button>
          ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select defaultValue="easy" disabled={isRunning}>
            <SelectTrigger className="w-full md:w-[180px] bg-secondary text-secondary-foreground font-bold">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          
          {isRunning ? (
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg sm:text-xl px-4 sm:px-8 py-6 rounded-xl shadow-lg hover:scale-105 transition-transform w-full md:w-auto"
              onClick={onCashOut}
              disabled={multiplier <= 1.00}
            >
              <HandCoins className="mr-2 h-6 w-6" />
              Cash Out
            </Button>
          ) : (
             <Button 
              size="lg" 
              className="bg-green-500 hover:bg-green-600 text-white font-bold text-lg sm:text-xl px-4 sm:px-8 py-6 rounded-xl shadow-lg hover:scale-105 transition-transform w-full md:w-auto"
              onClick={onPlay}
              disabled={isRunning}
            >
                <Image src="https://chickenroad.rajmines.com/images/chicken.png" alt="Play" width={28} height={28} className="mr-2" />
                {gameState === 'finished' ? 'Play Again' : 'Play'}
            </Button>
          )}

        </div>
      </div>
    </div>
  )
}
