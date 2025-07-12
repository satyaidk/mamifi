"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, Coins, Target, TrendingUp, TrendingDown } from "lucide-react";

// Mock data for demonstration - in a real app this would come from a backend/state management
const mockResults = [
  {
    id: 1,
    question: "Will Bitcoin hit $100k today?",
    category: "Crypto",
    userChoice: "yes",
    actualResult: "yes",
    betAmount: 100,
    winAmount: 250,
    status: "win",
    date: "2025-07-12",
    multiplier: 2.5
  },
  {
    id: 2,
    question: "Will Ethereum surpass $5k this week?",
    category: "Crypto",
    userChoice: "no",
    actualResult: "yes",
    betAmount: 50,
    winAmount: 0,
    status: "loss",
    date: "2025-07-11",
    multiplier: 3.0
  },
  {
    id: 3,
    question: "Will the S&P 500 close higher today?",
    category: "Stocks",
    userChoice: "yes",
    actualResult: "yes",
    betAmount: 200,
    winAmount: 360,
    status: "win",
    date: "2025-07-10",
    multiplier: 1.8
  },
  {
    id: 4,
    question: "Will it rain in New York tomorrow?",
    category: "Weather",
    userChoice: "no",
    actualResult: "no",
    betAmount: 75,
    winAmount: 165,
    status: "win",
    date: "2025-07-09",
    multiplier: 2.2
  },
  {
    id: 5,
    question: "Will the next World Cup be won by Brazil?",
    category: "Sports",
    userChoice: "yes",
    actualResult: "no",
    betAmount: 300,
    winAmount: 0,
    status: "loss",
    date: "2025-07-08",
    multiplier: 4.0
  }
];

export default function PredictionResults() {
  const router = useRouter();

  const totalBets = mockResults.length;
  const wins = mockResults.filter(r => r.status === "win").length;
  const losses = mockResults.filter(r => r.status === "loss").length;
  const totalWinAmount = mockResults.reduce((sum, r) => sum + r.winAmount, 0);
  const totalBetAmount = mockResults.reduce((sum, r) => sum + r.betAmount, 0);
  const netProfit = totalWinAmount - totalBetAmount;
  const winRate = totalBets > 0 ? Math.round((wins / totalBets) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 opacity-30 animate-pulse" />
      
      <div className="relative z-10">
        <header className="w-full flex justify-between items-center p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => router.push("/prediction")}
              variant="ghost"
              size="sm"
              className="hover:bg-blue-500/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Game
            </Button>
            <Trophy className="w-8 h-8 text-blue-400 animate-pulse" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Prediction Results
            </h1>
          </div>
        </header>

        <main className="container mx-auto p-6 max-w-6xl">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-800 border border-gray-700 shadow-lg">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{totalBets}</div>
                  <div className="text-sm text-gray-400">Total Bets</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border border-gray-700 shadow-lg">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Trophy className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-400">{winRate}%</div>
                  <div className="text-sm text-gray-400">Win Rate</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border border-gray-700 shadow-lg">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Coins className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-500">{totalWinAmount.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Total Won</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border border-gray-700 shadow-lg">
              <CardContent className="pt-6">
                <div className="text-center">
                  {netProfit >= 0 ? (
                    <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  ) : (
                    <TrendingDown className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  )}
                  <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {netProfit >= 0 ? '+' : ''}{netProfit.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Net Profit</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Table */}
          <Card className="bg-gray-800 border border-gray-700 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Trophy className="w-7 h-7 text-blue-400" />
                All Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockResults.map((result) => (
                  <div
                    key={result.id}
                    className="bg-gray-700/30 rounded-lg p-4 border border-gray-600 hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      
                      {/* Question Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                            {result.category}
                          </Badge>
                          <Badge 
                            className={`font-semibold ${
                              result.status === 'win' 
                                ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                                : 'bg-red-500/20 text-red-400 border-red-500/30'
                            }`}
                          >
                            {result.status === 'win' ? '🎉 WIN' : '😔 LOSS'}
                          </Badge>
                          <span className="text-sm text-gray-400">
                            {result.date}
                          </span>
                        </div>
                        <h3 className="font-semibold text-white mb-1">
                          {result.question}
                        </h3>
                        <div className="text-sm text-gray-400">
                          Your prediction: <span className="font-semibold capitalize">{result.userChoice}</span> • 
                          Actual result: <span className="font-semibold capitalize">{result.actualResult}</span> • 
                          Multiplier: <span className="font-semibold">{result.multiplier}x</span>
                        </div>
                      </div>

                      {/* Bet Info */}
                      <div className="text-right">
                        <div className="text-lg font-bold text-white mb-1">
                          Bet: {result.betAmount.toLocaleString()} tokens
                        </div>
                        <div className={`text-lg font-bold ${result.status === 'win' ? 'text-green-400' : 'text-red-400'}`}>
                          {result.status === 'win' ? '+' : '-'}
                          {result.status === 'win' ? result.winAmount.toLocaleString() : result.betAmount.toLocaleString()} tokens
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {mockResults.length === 0 && (
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">
                    No predictions yet
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Start playing to see your prediction results here!
                  </p>
                  <Button
                    onClick={() => router.push("/prediction")}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    Make Your First Prediction
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
} 