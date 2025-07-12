"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Coins, Trophy, Zap, Target, TrendingUp, DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const predictionQuestions = [
  { 
    id: "btc-100k", 
    text: "Will Bitcoin hit $100k today?", 
    category: "Crypto",
    multiplier: 2.5 
  },
  { 
    id: "eth-5k", 
    text: "Will Ethereum surpass $5k this week?", 
    category: "Crypto",
    multiplier: 3.0 
  },
  { 
    id: "sp500-higher", 
    text: "Will the S&P 500 close higher today?", 
    category: "Stocks",
    multiplier: 1.8 
  },
  { 
    id: "rain-ny", 
    text: "Will it rain in New York tomorrow?", 
    category: "Weather",
    multiplier: 2.2 
  },
  { 
    id: "worldcup-brazil", 
    text: "Will the next World Cup be won by Brazil?", 
    category: "Sports",
    multiplier: 4.0 
  }
];

const TokenRain = ({ show }: { show: boolean }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${1 + Math.random()}s`
          }}
        >
          <Coins className="w-6 h-6 text-yellow-500 animate-spin" />
        </div>
      ))}
    </div>
  );
};

const WinBlast = ({ show }: { show: boolean }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-40">
      <div className="animate-pulse">
        <div className="relative">
          <Trophy className="w-32 h-32 text-green-500 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-full blur-xl opacity-60 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default function PredictionGame() {
  const [selectedQuestion, setSelectedQuestion] = useState<string>(predictionQuestions[0].id);
  const [choice, setChoice] = useState<string>("");
  const [betAmount, setBetAmount] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [betPlaced, setBetPlaced] = useState(false);
  const [availableTokens, setAvailableTokens] = useState(1000);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showWinBlast, setShowWinBlast] = useState(false);
  const [showTokenRain, setShowTokenRain] = useState(false);
  const [betHistory, setBetHistory] = useState<any[]>([]);
  const router = useRouter();

  const currentQuestion = predictionQuestions.find(q => q.id === selectedQuestion);

  const handlePlaceBet = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(betAmount);
    
    if (!choice) {
      toast({
        title: "Selection Required",
        description: "Please select Yes or No.",
        variant: "destructive"
      });
      return;
    }
    
    if (!betAmount || isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount", 
        description: "Please enter a valid bet amount.",
        variant: "destructive"
      });
      return;
    }
    
    if (amount > availableTokens) {
      toast({
        title: "Insufficient Tokens",
        description: "You don't have enough tokens for this bet.",
        variant: "destructive"
      });
      return;
    }

    setIsAnimating(true);
    setStatus("Placing bet...");
    setAvailableTokens(prev => prev - amount);
    
    // Simulate bet processing with animation
    setTimeout(() => {
      setBetPlaced(true);
      setStatus(`Bet placed! You bet ${amount} Token${amount !== 1 ? 's' : ''}.`);
      setIsAnimating(false);
      
      toast({
        title: "Bet Placed!",
        description: `You bet ${amount} tokens on "${currentQuestion?.text}"`,
      });
      
      // Simulate random win/loss after 3 seconds
      setTimeout(() => {
        const isWinner = Math.random() > 0.4; // 60% chance to win
        
        if (isWinner) {
          const winAmount = Math.floor(amount * (currentQuestion?.multiplier || 2));
          setAvailableTokens(prev => prev + winAmount);
          setShowWinBlast(true);
          setShowTokenRain(true);
          setStatus(`🎉 You WON! +${winAmount} tokens!`);
          
          toast({
            title: "🎉 WINNER!",
            description: `Congratulations! You won ${winAmount} tokens!`,
          });
          
          setBetHistory(prev => [...prev, {
            question: currentQuestion?.text,
            bet: amount,
            choice,
            result: 'win',
            winAmount
          }]);
          
          setTimeout(() => {
            setShowWinBlast(false);
            setShowTokenRain(false);
          }, 3000);
        } else {
          setStatus(`😔 You lost. Better luck next time!`);
          
          toast({
            title: "Better luck next time!",
            description: `You lost ${amount} tokens on this prediction.`,
            variant: "destructive"
          });
          
          setBetHistory(prev => [...prev, {
            question: currentQuestion?.text,
            bet: amount,
            choice,
            result: 'loss',
            winAmount: 0
          }]);
        }
      }, 3000);
    }, 1000);
  };

  const resetBet = () => {
    setBetPlaced(false);
    setChoice("");
    setBetAmount("");
    setStatus("");
  };

  const calculatePotentialWin = () => {
    const amount = parseFloat(betAmount);
    if (isNaN(amount) || !currentQuestion) return 0;
    return Math.floor(amount * currentQuestion.multiplier);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden relative">
      <TokenRain show={showTokenRain} />
      <WinBlast show={showWinBlast} />
      
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 opacity-30 animate-pulse" />
      
      <div className="relative z-10">
        <header className="w-full flex justify-between items-center p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-blue-400 animate-pulse" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              GameFi Oracle
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge className="bg-gray-800 border border-blue-500/30 px-4 py-2">
              <Coins className="w-5 h-5 mr-2 text-yellow-500 animate-bounce" />
              <span className="text-lg font-bold">{availableTokens.toLocaleString()}</span>
              <span className="text-sm ml-1 text-gray-400">tokens</span>
            </Badge>
          </div>
        </header>

        <main className="container mx-auto p-6 max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Game Card */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-800 border border-gray-700 shadow-lg">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                    <Target className="w-7 h-7 text-blue-400" />
                    Make Your Prediction
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <form onSubmit={handlePlaceBet} className="space-y-6">
                    
                    {/* Question Selection */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold text-blue-400">
                        Choose Prediction Question:
                      </Label>
                      <Select 
                        value={selectedQuestion} 
                        onValueChange={setSelectedQuestion}
                        disabled={betPlaced}
                      >
                        <SelectTrigger className="bg-gray-700 border border-blue-500/30 h-12 text-left">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border border-blue-500/30">
                          {predictionQuestions.map((q) => (
                            <SelectItem key={q.id} value={q.id} className="hover:bg-blue-500/20">
                              <div className="flex items-center justify-between w-full">
                                <span>{q.text}</span>
                                <Badge className="ml-2 bg-blue-500/20 text-blue-400 border-blue-500/30">
                                  {q.multiplier}x
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Question Display */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 text-center">
                      <Badge className="mb-3 bg-blue-500/20 text-blue-400 border-blue-500/30">
                        {currentQuestion?.category}
                      </Badge>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {currentQuestion?.text}
                      </h3>
                      <div className="flex items-center justify-center gap-2 text-green-400">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-semibold">{currentQuestion?.multiplier}x Multiplier</span>
                      </div>
                    </div>

                    {/* Choice Selection */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold text-blue-400">Your Prediction:</Label>
                      <RadioGroup 
                        value={choice} 
                        onValueChange={setChoice}
                        disabled={betPlaced}
                        className="flex gap-6 justify-center"
                      >
                        <div className="flex items-center space-x-2 bg-green-500/10 border border-green-500/30 rounded-lg px-6 py-4 hover:bg-green-500/20 transition-colors cursor-pointer">
                          <RadioGroupItem value="yes" id="yes" className="border-green-500 text-green-500" />
                          <Label htmlFor="yes" className="text-lg font-semibold text-green-500 cursor-pointer">
                            YES
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/30 rounded-lg px-6 py-4 hover:bg-red-500/20 transition-colors cursor-pointer">
                          <RadioGroupItem value="no" id="no" className="border-red-500 text-red-500" />
                          <Label htmlFor="no" className="text-lg font-semibold text-red-500 cursor-pointer">
                            NO
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Bet Amount */}
                    <div className="space-y-3">
                      <Label htmlFor="betAmount" className="text-base font-semibold text-blue-400">
                        Bet Amount:
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="betAmount"
                          type="number"
                          min="1"
                          max={availableTokens}
                          value={betAmount}
                          onChange={(e) => setBetAmount(e.target.value)}
                          disabled={betPlaced}
                          placeholder="Enter bet amount"
                          className="pl-10 bg-gray-700 border border-blue-500/30 h-12 text-lg"
                        />
                      </div>
                      {betAmount && !isNaN(parseFloat(betAmount)) && (
                        <div className="text-center text-green-400 font-semibold">
                          Potential Win: {calculatePotentialWin().toLocaleString()} tokens
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <Button
                        type="submit"
                        disabled={!choice || !betAmount || betPlaced || isAnimating}
                        className={`flex-1 h-12 text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 ${
                          isAnimating ? 'animate-bounce' : ''
                        }`}
                      >
                        {isAnimating ? (
                          <>
                            <Zap className="w-5 h-5 mr-2 animate-spin" />
                            Placing Bet...
                          </>
                        ) : (
                          <>
                            <Target className="w-5 h-5 mr-2" />
                            Place Bet
                          </>
                        )}
                      </Button>
                      
                      {betPlaced && (
                        <Button
                          type="button"
                          onClick={resetBet}
                          variant="outline"
                          className="h-12 px-6 border-blue-500/30 hover:bg-blue-500/20"
                        >
                          New Bet
                        </Button>
                      )}
                    </div>

                    {/* Status */}
                    {status && (
                      <div className="text-center p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                        <p className="text-lg font-semibold">{status}</p>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
              
              {/* Token Balance */}
              <Card className="bg-gray-800 border border-gray-700 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Coins className="w-6 h-6 text-yellow-500" />
                    Your Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-500 mb-2">
                      {availableTokens.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">Available Tokens</div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Bets */}
              <Card className="bg-gray-800 border border-gray-700 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Trophy className="w-6 h-6 text-blue-400" />
                    Recent Bets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {betHistory.length === 0 ? (
                    <p className="text-gray-400 text-center">No bets yet</p>
                  ) : (
                    <div className="space-y-3">
                      {betHistory.slice(-3).reverse().map((bet, idx) => (
                        <div key={idx} className="bg-gray-700/30 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-1">
                            <Badge 
                              className={`text-xs ${
                                bet.result === 'win' 
                                  ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                                  : 'bg-red-500/20 text-red-400 border-red-500/30'
                              }`}
                            >
                              {bet.result === 'win' ? '🎉 WIN' : '😔 LOSS'}
                            </Badge>
                            <span className="text-sm font-semibold">
                              {bet.result === 'win' ? '+' : '-'}{bet.result === 'win' ? bet.winAmount : bet.bet}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400 truncate">
                            {bet.question}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Navigation */}
              <Card className="bg-gray-800 border border-gray-700 shadow-lg">
                <CardContent className="pt-6">
                  <Button
                    onClick={() => router.push("/prediction/results")}
                    variant="outline"
                    className="w-full border-blue-500/30 hover:bg-blue-500/20"
                  >
                    View All Results
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}