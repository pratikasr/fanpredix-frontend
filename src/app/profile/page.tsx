'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaCoins, FaTrophy, FaChartLine, FaExchangeAlt, FaCheckCircle, FaTimesCircle, FaLock, FaUnlock, FaCrown, FaMedal, FaStar, FaBolt, FaFire, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { GiPodium, GiTrophyCup, GiLaurelCrown, GiFireGem, GiStarMedal } from 'react-icons/gi';

// Mock user data
const userData = {
  id: 1,
  username: "PredictionPro",
  balance: 15000,
  level: 8,
  xp: 75,
  totalBets: 150,
  winRate: 68,
  achievements: [
    { name: "First Win", icon: FaTrophy, unlocked: true, description: "Win your first bet" },
    { name: "Hot Streak", icon: FaFire, unlocked: true, description: "Win 5 bets in a row" },
    { name: "High Roller", icon: FaCoins, unlocked: false, description: "Place a bet of 1000 FT or more" },
    { name: "Market Guru", icon: FaChartLine, unlocked: false, description: "Correctly predict 10 markets" },
  ],
  recentRewards: [
    { name: "Daily Login Bonus", amount: 100, icon: FaCoins },
    { name: "Streak Bonus", amount: 250, icon: FaFire },
    { name: "Level Up Reward", amount: 500, icon: FaBolt },
  ]
};

// Mock bet data
const betData = [
  { id: 1, market: "Man Utd vs Liverpool", prediction: "Man Utd Win", odds: 2.5, stake: 100, status: "Matched", potential_win: 250 },
  { id: 2, market: "NBA Finals Game 7", prediction: "Over 210.5 Points", odds: 1.9, stake: 200, status: "Unmatched" },
  { id: 3, market: "Wimbledon Men's Final", prediction: "Djokovic Win", odds: 1.8, stake: 150, status: "Settled", winnings: 270 },
];

export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [bets, setBets] = useState(betData);
  const [showRewards, setShowRewards] = useState(false);

  const cancelUnmatchedOrder = (betId) => {
    setBets(bets.filter(bet => bet.id !== betId));
  };

  const redeemWinnings = (betId) => {
    setBets(bets.map(bet => 
      bet.id === betId ? { ...bet, status: "Redeemed" } : bet
    ));
    userData.balance += bets.find(bet => bet.id === betId).winnings;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="bg-gray-800 rounded-3xl p-8 mb-8 shadow-2xl border-4 border-blue-500 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-blue-400 to-purple-600 rounded-full p-2 mr-4">
                <FaUser className="text-4xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                  {userData.username}
                </h1>
                <p className="text-gray-400">Level {userData.level} Predictor</p>
              </div>
            </div>
            <motion.div 
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full px-6 py-3 flex items-center shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaCoins className="text-yellow-900 mr-2" />
              <span className="font-bold text-yellow-900">{userData.balance.toLocaleString()} FT</span>
            </motion.div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
            <motion.div 
              className="bg-gradient-to-br from-green-500 to-blue-500 p-4 rounded-xl text-center shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <FaChartLine className="text-3xl mb-2 text-white mx-auto" />
              <p className="text-xs text-gray-200">Total Bets</p>
              <p className="text-2xl font-bold">{userData.totalBets}</p>
            </motion.div>
            <motion.div 
              className="bg-gradient-to-br from-yellow-500 to-red-500 p-4 rounded-xl text-center shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <FaTrophy className="text-3xl mb-2 text-white mx-auto" />
              <p className="text-xs text-gray-200">Win Rate</p>
              <p className="text-2xl font-bold">{userData.winRate}%</p>
            </motion.div>
            <motion.div 
              className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-xl text-center shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <GiPodium className="text-3xl mb-2 text-white mx-auto" />
              <p className="text-xs text-gray-200">Rank</p>
              <p className="text-2xl font-bold">#42</p>
            </motion.div>
            <motion.div 
              className="bg-gradient-to-br from-blue-500 to-indigo-500 p-4 rounded-xl text-center shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <FaBolt className="text-3xl mb-2 text-white mx-auto" />
              <p className="text-xs text-gray-200">XP to Next Level</p>
              <p className="text-2xl font-bold">{100 - userData.xp} XP</p>
            </motion.div>
          </div>
          <div className="relative">
            <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
              <motion.div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full h-4 transition-all duration-500 ease-out relative"
                style={{ width: `${userData.xp}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${userData.xp}%` }}
              >
                <span className="absolute right-0 top-6 text-xs bg-purple-600 rounded-full px-2 py-1">
                  {userData.xp}/100 XP
                </span>
              </motion.div>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Level {userData.level}</span>
              <span className="text-xs text-gray-400">Level {userData.level + 1}</span>
            </div>
          </div>
        </motion.div>

        <div className="mb-8 flex justify-center space-x-4">
          {['overview', 'bets', 'achievements'].map((tab) => (
            <motion.button
              key={tab}
              className={`px-6 py-3 rounded-full font-bold text-lg ${activeTab === tab ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
              onClick={() => setActiveTab(tab)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div 
                  className="bg-gray-800 rounded-3xl p-6 shadow-xl border-2 border-purple-500"
                  whileHover={{ scale: 1.02 }}
                >
                  <h2 className="text-2xl font-bold mb-4 font-orbitron">Prediction Streak</h2>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, index) => (
                        <motion.div
                          key={index}
                          initial={{ rotateY: 0 }}
                          animate={{ rotateY: index < 3 ? 360 : 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <FaStar className={`text-3xl ${index < 3 ? 'text-yellow-400' : 'text-gray-600'} mr-1`} />
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-lg font-bold">3 day streak!</p>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
                    <motion.div 
                      className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full h-4"
                      initial={{ width: 0 }}
                      animate={{ width: '60%' }}
                      transition={{ duration: 1 }}
                    ></motion.div>
                  </div>
                  <p className="text-sm text-gray-400">2 more days to reach your next reward!</p>
                </motion.div>

                <motion.div 
                  className="bg-gray-800 rounded-3xl p-6 shadow-xl border-2 border-green-500"
                  whileHover={{ scale: 1.02 }}
                >
                  <h2 className="text-2xl font-bold mb-4 font-orbitron">Recent Rewards</h2>
                  {userData.recentRewards.map((reward, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-center justify-between mb-4 last:mb-0"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center">
                        <reward.icon className="text-2xl mr-3 text-yellow-400" />
                        <span>{reward.name}</span>
                      </div>
                      <span className="font-bold text-green-400">+{reward.amount} FT</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}

            {activeTab === 'bets' && (
            <motion.div
                key="bets"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800 rounded-3xl p-6 shadow-xl"
            >
                <h2 className="text-3xl font-bold mb-6 font-orbitron">My Bets</h2>
                <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-700">
                        <th className="pb-3 px-4">Market</th>
                        <th className="pb-3 px-4">Prediction</th>
                        <th className="pb-3 px-4">Odds</th>
                        <th className="pb-3 px-4">Stake</th>
                        <th className="pb-3 px-4">Status</th>
                        <th className="pb-3 px-4">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {bets.map((bet, index) => (
                        <motion.tr 
                        key={bet.id}
                        className="border-b border-gray-700 hover:bg-gray-750 transition-colors duration-150"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        >
                        <td className="py-4 px-4">{bet.market}</td>
                        <td className="py-4 px-4">{bet.prediction}</td>
                        <td className="py-4 px-4">{bet.odds}</td>
                        <td className="py-4 px-4">{bet.stake} FT</td>
                        <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            bet.status === 'Matched' ? 'bg-green-500' :
                            bet.status === 'Unmatched' ? 'bg-yellow-500' :
                            bet.status === 'Settled' ? 'bg-blue-500' : 'bg-purple-500'
                            }`}>
                            {bet.status}
                            </span>
                        </td>
                        <td className="py-4 px-4">
                            {bet.status === 'Unmatched' && (
                            <motion.button
                                className="bg-red-500 text-white px-3 py-1 rounded-full text-sm"
                                onClick={() => cancelUnmatchedOrder(bet.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Cancel
                            </motion.button>
                            )}
                            {bet.status === 'Settled' && (
                            <motion.button
                                className="bg-green-500 text-white px-3 py-1 rounded-full text-sm"
                                onClick={() => redeemWinnings(bet.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Redeem
                            </motion.button>
                            )}
                        </td>
                        </motion.tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </motion.div>
            )}

          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-6 font-orbitron">Achievements</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {userData.achievements.map((achievement, index) => (
                  <motion.div 
                    key={index}
                    className={`bg-gray-800 p-6 rounded-xl text-center ${achievement.unlocked ? 'border-4 border-yellow-400' : 'opacity-75 border-2 border-gray-600'}`}
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={`rounded-full p-4 mx-auto mb-4 w-20 h-20 flex items-center justify-center ${achievement.unlocked ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : 'bg-gray-700'}`}>
                      <achievement.icon className={`text-4xl ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`} />
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${achievement.unlocked ? 'text-yellow-400' : 'text-gray-400'}`}>
                      {achievement.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">{achievement.description}</p>
                    {achievement.unlocked ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <FaCheckCircle className="text-green-400 text-3xl mx-auto" />
                      </motion.div>
                    ) : (
                      <motion.div
                        whileHover={{ rotate: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 10 }}
                      >
                        <FaLock className="text-gray-500 text-3xl mx-auto" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
            className="mt-12 bg-gray-800 rounded-3xl p-8 shadow-2xl border-4 border-purple-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            >
            <h2 className="text-3xl font-bold mb-6 font-orbitron">Prediction Milestones</h2>
            <div className="relative pt-4 pb-4">
                <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-700 rounded-full transform -translate-y-1/2"></div>
                <motion.div 
                    className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transform -translate-y-1/2"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((userData.totalBets / 100) * 100, 100)}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                ></motion.div>
                {[25, 50, 75, 100].map((milestone, index) => (
                    <div key={index} className="absolute top-1/2 transform -translate-y-3" style={{ left: `calc(${(milestone / 100) * 100}% - 1rem)` }}>
                    <motion.div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        userData.totalBets >= milestone 
                            ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                            : 'bg-gray-600'
                        }`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6 + index * 0.1, type: "spring", stiffness: 500, damping: 30 }}
                    >
                        {userData.totalBets >= milestone ? (
                        <FaCheckCircle className="text-white" />
                        ) : (
                        <span className="text-xs font-bold text-white">{milestone}</span>
                        )}
                    </motion.div>
                    <div className="mt-4 text-center text-sm">
                        <span className={userData.totalBets >= milestone ? 'text-purple-400' : 'text-gray-400'}>
                        {milestone} 
                        </span>
                    </div>
                    </div>
                ))}
                </div>
            <p className="text-center mt-8 text-lg">
                You've made <span className="font-bold text-purple-400">{userData.totalBets}</span> predictions! 
                Keep going to reach the next milestone!
            </p>
            </motion.div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4 font-orbitron">Ready to make more predictions?</h2>
          <p className="text-gray-400 mb-8 text-lg">Explore new markets and boost your stats!</p>
          <motion.button
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 px-8 rounded-full text-xl shadow-lg hover:shadow-xl transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Markets
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}