'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChartLine, FaCoins, FaExchangeAlt, FaChartBar, FaArrowUp, FaArrowDown, FaUserAlt, FaClock, FaCheckCircle, FaTrophy, FaBolt, FaFire, FaLock, FaUndo } from 'react-icons/fa';
import { GiPodium, GiTrophyCup, GiSoccerBall } from 'react-icons/gi';
import { ethers } from 'ethers';

const contractAddress = '0x239EDd859C51b8b7ac88F55Eed96F380F0bD816d';
const contractABI = [
  {
    "inputs": [{ "internalType": "uint256", "name": "_marketId", "type": "uint256" }],
    "name": "getMarket",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "id", "type": "uint256" },
          { "internalType": "uint256", "name": "teamId", "type": "uint256" },
          { "internalType": "address", "name": "teamManager", "type": "address" },
          { "internalType": "address", "name": "fanToken", "type": "address" },
          { "internalType": "string", "name": "category", "type": "string" },
          { "internalType": "string", "name": "question", "type": "string" },
          { "internalType": "string", "name": "description", "type": "string" },
          { "internalType": "string[]", "name": "options", "type": "string[]" },
          { "internalType": "uint256", "name": "startTime", "type": "uint256" },
          { "internalType": "uint256", "name": "endTime", "type": "uint256" },
          { "internalType": "enum FanPredix.MarketStatus", "name": "status", "type": "uint8" },
          { "internalType": "uint256", "name": "resolvedOutcomeIndex", "type": "uint256" }
        ],
        "internalType": "struct FanPredix.Market",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_marketId", "type": "uint256" },
      { "internalType": "uint256", "name": "_outcomeIndex", "type": "uint256" },
      { "internalType": "enum FanPredix.OrderType", "name": "_orderType", "type": "uint8" },
      { "internalType": "uint256", "name": "_amount", "type": "uint256" },
      { "internalType": "uint256", "name": "_odds", "type": "uint256" }
    ],
    "name": "placeOrder",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_orderId", "type": "uint256" }],
    "name": "cancelOrder",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_marketId", "type": "uint256" },
      { "internalType": "address", "name": "_user", "type": "address" }
    ],
    "name": "getUserBets",
    "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_betId", "type": "uint256" }],
    "name": "getBet",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "id", "type": "uint256" },
          { "internalType": "uint256", "name": "marketId", "type": "uint256" },
          { "internalType": "address", "name": "user", "type": "address" },
          { "internalType": "uint256", "name": "outcomeIndex", "type": "uint256" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" },
          { "internalType": "uint256", "name": "odds", "type": "uint256" },
          { "internalType": "enum FanPredix.OrderType", "name": "orderType", "type": "uint8" }
        ],
        "internalType": "struct FanPredix.Bet",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export default function IndividualMarketPage() {
  const params = useParams();
  const teamId = params.teamId as string;
  const marketId = params.marketId as string;

  const [marketData, setMarketData] = useState(null);
  const [selectedOutcome, setSelectedOutcome] = useState(null);
  const [betType, setBetType] = useState('back');
  const [stake, setStake] = useState(100);
  const [userBalance, setUserBalance] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [userXP, setUserXP] = useState(0);
  const [userBets, setUserBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMarketData();
    fetchUserData();
  }, [marketId]);

  const fetchMarketData = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const market = await contract.getMarket(marketId);
      setMarketData({
        id: market.id.toNumber(),
        title: market.question,
        description: market.description,
        endDate: new Date(market.endTime.toNumber() * 1000).toLocaleString(),
        liquidity: 0, // You might need to calculate this based on orders
        volume: 0, // You might need to calculate this based on bets
        outcomes: market.options.map((option, index) => ({
          id: index,
          name: option,
          backOdds: 2, // Placeholder odds, you might need to calculate these
          layOdds: 2.1, // Placeholder odds, you might need to calculate these
          probability: 50 // Placeholder probability, you might need to calculate this
        }))
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching market data:', err);
      setError('Failed to fetch market data. Please try again.');
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      
      // Fetch user bets
      const betIds = await contract.getUserBets(marketId, address);
      const betsPromises = betIds.map(id => contract.getBet(id));
      const betsData = await Promise.all(betsPromises);
      
      setUserBets(betsData.map(bet => ({
        id: bet.id.toNumber(),
        outcomeIndex: bet.outcomeIndex.toNumber(),
        amount: ethers.utils.formatEther(bet.amount),
        odds: bet.odds.toNumber() / 1000,
        orderType: bet.orderType
      })));

      // Note: User balance, level, and XP might need to be implemented separately if not in the contract
      setUserBalance(10000); // Placeholder
      setUserLevel(5); // Placeholder
      setUserXP(75); // Placeholder
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  const placeOrder = async () => {
    if (!selectedOutcome) return;
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      
      const tx = await contract.placeOrder(
        marketId,
        selectedOutcome.id,
        betType === 'back' ? 0 : 1, // 0 for Back, 1 for Lay
        ethers.utils.parseEther(stake.toString()),
        ethers.utils.parseUnits(selectedOutcome[betType + 'Odds'].toString(), 3) // Assuming odds are in thousandths
      );
      
      await tx.wait();
      alert('Order placed successfully!');
      fetchUserData(); // Refresh user data
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Failed to place order. Please try again.');
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      
      const tx = await contract.cancelOrder(orderId);
      await tx.wait();
      alert('Order cancelled successfully!');
      fetchUserData(); // Refresh user data
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert('Failed to cancel order. Please try again.');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white flex items-center justify-center">
      <div className="text-2xl font-bold">Loading market data...</div>
    </div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white flex items-center justify-center">
      <div className="text-2xl font-bold text-red-500">{error}</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          className="text-4xl font-bold mb-6 font-orbitron text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {marketData.title}
        </motion.h1>

        <motion.div 
          className="bg-gray-800 rounded-3xl p-6 mb-8 shadow-xl border border-blue-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-gray-300 mb-4">{marketData.description}</p>
          <div className="flex flex-wrap justify-between items-center text-sm">
            <div className="flex items-center mb-2 sm:mb-0 bg-gray-700 rounded-full px-3 py-1">
              <FaClock className="mr-2 text-blue-400" />
              <span>Ends: {marketData.endDate}</span>
            </div>
            <div className="flex items-center mb-2 sm:mb-0 bg-gray-700 rounded-full px-3 py-1">
              <FaCoins className="mr-2 text-yellow-400" />
              <span>Liquidity: {marketData.liquidity.toLocaleString()} FT</span>
            </div>
            <div className="flex items-center bg-gray-700 rounded-full px-3 py-1">
              <FaChartLine className="mr-2 text-green-400" />
              <span>Volume: {marketData.volume.toLocaleString()} FT</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div 
              className="bg-gray-800 rounded-3xl p-6 shadow-xl border border-purple-500"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold mb-4 font-orbitron">Market Outcomes</h2>
              <div className="space-y-4">
                {marketData.outcomes.map((outcome) => (
                  <motion.div 
                    key={outcome.id} 
                    className={`bg-gray-700 rounded-xl p-4 cursor-pointer transition-all duration-300 ${selectedOutcome?.id === outcome.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-600'}`}
                    onClick={() => setSelectedOutcome(outcome)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold">{outcome.name}</span>
                      <div className="flex items-center bg-gray-600 rounded-full px-2 py-1 text-xs">
                        <GiPodium className="mr-1 text-yellow-400" />
                        <span>{outcome.probability}%</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        className={`flex-1 px-3 py-2 rounded-full text-sm font-bold transition-colors duration-300 ${betType === 'back' && selectedOutcome?.id === outcome.id ? 'bg-blue-600 text-white' : 'bg-blue-900 text-blue-300 hover:bg-blue-800'}`}
                        onClick={(e) => { e.stopPropagation(); setBetType('back'); setSelectedOutcome(outcome); }}
                      >
                        Back {outcome.backOdds.toFixed(2)}
                      </button>
                      <button 
                        className={`flex-1 px-3 py-2 rounded-full text-sm font-bold transition-colors duration-300 ${betType === 'lay' && selectedOutcome?.id === outcome.id ? 'bg-red-600 text-white' : 'bg-red-900 text-red-300 hover:bg-red-800'}`}
                        onClick={(e) => { e.stopPropagation(); setBetType('lay'); setSelectedOutcome(outcome); }}
                      >
                        Lay {outcome.layOdds.toFixed(2)}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="mt-8 bg-gray-800 rounded-3xl p-6 shadow-xl border border-green-500"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold mb-4 font-orbitron">Your Bets</h2>
              {userBets.length > 0 ? (
                <div className="space-y-4">
                  {userBets.map((bet, index) => (
                    <motion.div 
                      key={index}
                      className="bg-gray-700 rounded-xl p-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold">{marketData.outcomes[bet.outcomeIndex].name}</span>
                        <span className={`font-bold ${bet.orderType === 0 ? 'text-blue-400' : 'text-red-400'}`}>
                          {bet.orderType === 0 ? 'Back' : 'Lay'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span>Stake: {bet.amount} FT</span>
                        <span>Odds: {bet.odds.toFixed(2)}</span>
                      </div>
                      <button
                        onClick={() => cancelOrder(bet.id)}
                        className="mt-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm hover:bg-red-600 transition duration-300"
                      >
                        <FaUndo className="inline mr-1" /> Cancel
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">You haven't placed any bets on this market yet.</p>
              )}
            </motion.div>
          </div>

          <motion.div 
            className="bg-gray-800 rounded-3xl p-6 shadow-xl border border-green-500"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-4 font-orbitron">Place Your Prediction</h2>
            {selectedOutcome ? (
              <>
                <div className="mb-4">
                  <label className="block text-gray-400 mb-2">Stake (FT)</label>
                  <input 
                    type="number" 
                    value={stake}
                    onChange={(e) => setStake(Number(e.target.value))}
                    className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-gray-400">Outcome:</span>
                  <span className="font-bold">{selectedOutcome.name}</span>
                </div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-gray-400">Type:</span>
                  <span className={`font-bold ${betType === 'back' ? 'text-blue-400' : 'text-red-400'}`}>
                    {betType.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-gray-400">Odds:</span>
                  <span className="font-bold">{selectedOutcome[betType + 'Odds'].toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-4 text-sm">
                  <span className="text-gray-400">Potential Profit:</span>
                  <span className="font-bold text-green-400">
                    {(stake * (selectedOutcome[betType + 'Odds'] - 1)).toFixed(2)} FT
                  </span>
                </div>
                <button 
                  onClick={placeOrder}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-2 px-4 rounded-full text-sm hover:from-blue-600 hover:to-purple-700 transition duration-300 transform hover:scale-105"
                  disabled={stake > userBalance}
                >
                  Place Prediction
                </button>
                {stake > userBalance && (
                  <p className="text-red-400 mt-2 text-xs">Insufficient balance</p>
                )}
              </>
            ) : (
              <p className="text-gray-400 text-sm">Select an outcome to place your prediction</p>
            )}
          </motion.div>
        </div>

        <motion.div 
          className="mt-8 bg-gray-800 rounded-3xl p-6 shadow-xl border border-yellow-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold mb-4 font-orbitron">Your Stats</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-gray-700 p-3 rounded-xl">
              <FaUserAlt className="text-xl mb-2 text-blue-400" />
              <p className="text-xs text-gray-400">Balance</p>
              <p className="text-lg font-bold">{userBalance.toLocaleString()} FT</p>
            </div>
            <div className="bg-gray-700 p-3 rounded-xl">
              <FaChartBar className="text-xl mb-2 text-green-400" />
              <p className="text-xs text-gray-400">Win Rate</p>
              <p className="text-lg font-bold">65%</p>
            </div>
            <div className="bg-gray-700 p-3 rounded-xl">
              <FaExchangeAlt className="text-xl mb-2 text-yellow-400" />
              <p className="text-xs text-gray-400">Total Trades</p>
              <p className="text-lg font-bold">127</p>
            </div>
            <div className="bg-gray-700 p-3 rounded-xl">
              <GiTrophyCup className="text-xl mb-2 text-purple-400" />
              <p className="text-xs text-gray-400">Rank</p>
              <p className="text-lg font-bold">#42</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="mt-8 bg-gray-800 rounded-3xl p-6 shadow-xl border border-pink-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <h2 className="text-2xl font-bold mb-4 font-orbitron">Level Progress</h2>
          <div className="flex items-center mb-2">
            <FaBolt className="text-2xl mr-3 text-yellow-400" />
            <div className="flex-grow">
              <div className="flex justify-between mb-1 text-sm">
                <span>Level {userLevel}</span>
                <span>{userXP}/100 XP</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full h-2 transition-all duration-500 ease-out"
                  style={{ width: `${userXP}%` }}
                ></div>
              </div>
            </div>
          </div>
          <p className="text-gray-400 text-xs">Make predictions to earn XP and level up!</p>
        </motion.div>

        <motion.div 
          className="mt-8 bg-gray-800 rounded-3xl p-6 shadow-xl border border-indigo-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <h2 className="text-2xl font-bold mb-4 font-orbitron">Achievements</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: "First Bet", icon: GiSoccerBall, unlocked: true },
              { name: "Win Streak", icon: FaFire, unlocked: true },
              { name: "Big Spender", icon: FaCoins, unlocked: false },
              { name: "Market Maker", icon: FaChartLine, unlocked: false },
            ].map((achievement, index) => (
              <motion.div 
                key={index}
                className={`bg-gray-700 p-3 rounded-xl text-center ${achievement.unlocked ? 'border border-yellow-400' : 'opacity-50'}`}
                whileHover={{ scale: 1.05 }}
              >
                <achievement.icon className={`text-2xl mb-2 mx-auto ${achievement.unlocked ? 'text-yellow-400' : 'text-gray-500'}`} />
                <p className={`text-xs ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}>{achievement.name}</p>
                {achievement.unlocked ? (
                  <FaCheckCircle className="text-green-400 mt-1 mx-auto text-xs" />
                ) : (
                  <FaLock className="text-gray-500 mt-1 mx-auto text-xs" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="mt-8 bg-gray-800 rounded-3xl p-6 shadow-xl border border-orange-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          <h2 className="text-2xl font-bold mb-4 font-orbitron">Market Leaderboard</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm">
                  <th className="pb-2">Rank</th>
                  <th className="pb-2">User</th>
                  <th className="pb-2">Profit</th>
                  <th className="pb-2">Win Rate</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { rank: 1, user: "PredictionKing", profit: 15000, winRate: 72 },
                  { rank: 2, user: "SportsMaster", profit: 12000, winRate: 68 },
                  { rank: 3, user: "LuckyCharm", profit: 10000, winRate: 65 },
                  { rank: 4, user: "BettingPro", profit: 8000, winRate: 63 },
                  { rank: 5, user: "FanPredictor", profit: 7000, winRate: 61 },
                ].map((player, index) => (
                  <motion.tr 
                    key={index}
                    className="border-t border-gray-700"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.6 + index * 0.1 }}
                  >
                    <td className="py-2">
                      <div className="flex items-center">
                        {index === 0 && <FaTrophy className="text-yellow-400 mr-1 text-xs" />}
                        {player.rank}
                      </div>
                    </td>
                    <td className="py-2 font-medium">{player.user}</td>
                    <td className="py-2 text-green-400">+{player.profit} FT</td>
                    <td className="py-2">
                      <div className="flex items-center">
                        <span className="mr-2 text-sm">{player.winRate}%</span>
                        <div className="bg-gray-700 rounded-full h-1.5 w-16">
                          <div 
                            className="bg-blue-500 rounded-full h-1.5" 
                            style={{ width: `${player.winRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          <h2 className="text-2xl font-bold mb-2 font-orbitron">Ready to climb the ranks?</h2>
          <p className="text-gray-400 mb-4 text-sm">Make your predictions and compete with other fans!</p>
          <motion.button
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-2 px-6 rounded-full text-sm shadow-lg hover:shadow-xl transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            >
            View All Markets
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}