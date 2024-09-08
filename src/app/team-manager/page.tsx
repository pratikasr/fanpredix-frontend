'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUsers, FaChartLine, FaCoins, FaTrophy, FaBolt, FaFireAlt, FaChartBar, FaStar, FaMedal, FaFootballBall, FaPlusCircle, FaUserCircle, FaEdit, FaTrash, FaLock, FaUnlock, FaCheck } from 'react-icons/fa';
import { ethers } from 'ethers';

const contractAddress = '0x239EDd859C51b8b7ac88F55Eed96F380F0bD816d';
const contractABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "_category", "type": "string" },
      { "internalType": "string", "name": "_question", "type": "string" },
      { "internalType": "string", "name": "_description", "type": "string" },
      { "internalType": "string[]", "name": "_options", "type": "string[]" },
      { "internalType": "uint256", "name": "_startTime", "type": "uint256" },
      { "internalType": "uint256", "name": "_endTime", "type": "uint256" }
    ],
    "name": "createMarket",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_teamId", "type": "uint256" }],
    "name": "getMarketsByTeam",
    "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
    "stateMutability": "view",
    "type": "function"
  },
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
  }
];

const TeamManagerPage = () => {
  const [teamData, setTeamData] = useState({
    name: 'Manchester United',
    sport: 'Football',
    fanTokens: 1000000,
    activeMarkets: 20,
    totalFans: 50000,
    winRate: 65,
    level: 8,
    xp: 7500,
    nextLevelXp: 10000,
  });

  const [markets, setMarkets] = useState([]);
  const [newMarket, setNewMarket] = useState({
    category: '',
    question: '',
    description: '',
    options: ['', ''],
    startTime: '',
    endTime: ''
  });

  const [showMarketForm, setShowMarketForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMarkets();
  }, []);

  const fetchMarkets = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        
        // Assume teamId is 1 for this example. In a real scenario, you'd get this from the user's context or props
        const teamId = 1;
        const marketIds = await contract.getMarketsByTeam(teamId);
        
        const marketsData = await Promise.all(
          marketIds.map(id => contract.getMarket(id))
        );

        setMarkets(marketsData.map(market => ({
          id: market.id.toNumber(),
          title: market.question,
          status: ['Open', 'Closed', 'Resolved'][market.status],
          startTime: new Date(market.startTime.toNumber() * 1000).toLocaleString(),
          endTime: new Date(market.endTime.toNumber() * 1000).toLocaleString(),
        })));
      } catch (error) {
        console.error('Error fetching markets:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMarket(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...newMarket.options];
    newOptions[index] = value;
    setNewMarket(prev => ({ ...prev, options: newOptions }));
  };

  const handleAddOption = () => {
    setNewMarket(prev => ({ ...prev, options: [...prev.options, ''] }));
  };

  const handleCreateMarket = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        // Check if we're connected to the correct network
        const network = await provider.getNetwork();
        if (network.chainId !== 88882) {
          throw new Error('Please connect to the Chiliz Spicy Testnet');
        }

        const startTimestamp = Math.floor(new Date(newMarket.startTime).getTime() / 1000);
        const endTimestamp = Math.floor(new Date(newMarket.endTime).getTime() / 1000);

        const tx = await contract.createMarket(
          newMarket.category,
          newMarket.question,
          newMarket.description,
          newMarket.options,
          startTimestamp,
          endTimestamp,
          {
            gasLimit: 500000, // Manually set gas limit
            gasPrice: ethers.utils.parseUnits('2500', 'gwei'), // Set gas price to 2500 Gwei
          }
        );
        
        setSuccess('Transaction sent. Waiting for confirmation...');
        await tx.wait();
        
        setSuccess('Market created successfully');
        setShowMarketForm(false);
        setNewMarket({
          category: '',
          question: '',
          description: '',
          options: ['', ''],
          startTime: '',
          endTime: ''
        });
        fetchMarkets(); // Refresh the markets list
      } catch (error) {
        console.error('Error creating market:', error);
        if (error.data && error.data.message) {
          setError(error.data.message);
        } else if (error.message) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    } else {
      setError('Please install MetaMask');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          className="text-5xl font-bold mb-12 text-center font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-600"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {teamData.name} Command Center
        </motion.h1>

        {/* Team Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Fan Tokens', value: teamData.fanTokens, icon: FaCoins, color: 'yellow' },
            { label: 'Active Markets', value: teamData.activeMarkets, icon: FaChartLine, color: 'green' },
            { label: 'Total Fans', value: teamData.totalFans, icon: FaUsers, color: 'blue' },
            { label: 'Win Rate', value: `${teamData.winRate}%`, icon: FaTrophy, color: 'purple' },
          ].map((stat, index) => (
            <motion.div 
              key={stat.label}
              className={`bg-gray-800 p-6 rounded-xl shadow-lg`}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className={`text-${stat.color}-400 mb-2`}>
                <stat.icon className="text-3xl" />
              </div>
              <p className="text-lg font-semibold mb-1">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
            </motion.div>
          ))}
        </div>

        {/* Team Level Progress */}
        <motion.div 
          className="bg-gray-800 p-6 rounded-xl shadow-lg mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-4">Team Level Progress</h2>
          <div className="flex items-center mb-4">
            <FaMedal className="text-4xl mr-4 text-yellow-400" />
            <div className="flex-grow">
              <div className="flex justify-between mb-2">
                <span className="text-lg font-bold">Level {teamData.level}</span>
                <span className="text-lg font-bold">{teamData.xp} / {teamData.nextLevelXp} XP</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <motion.div 
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full h-4"
                  initial={{ width: 0 }}
                  animate={{ width: `${(teamData.xp / teamData.nextLevelXp) * 100}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                ></motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Market Management */}
        <motion.div 
          className="bg-gray-800 p-6 rounded-xl shadow-lg mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Market Management</h2>
            <motion.button
              className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300 flex items-center"
              onClick={() => setShowMarketForm(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlusCircle className="mr-2" />
              Create New Market
            </motion.button>
          </div>
          
          <h3 className="text-xl font-bold mb-4">Previous Markets</h3>
          <div className="space-y-4">
            {markets.map((market, index) => (
              <motion.div
                key={market.id}
                className="bg-gray-700 p-4 rounded-lg flex items-center justify-between"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div>
                  <h4 className="font-bold">{market.title}</h4>
                  <p className="text-sm text-gray-400">Status: {market.status}</p>
                  <p className="text-sm text-gray-400">Start: {market.startTime}</p>
                  <p className="text-sm text-gray-400">End: {market.endTime}</p>
                </div>
                <div className="flex space-x-2">
                  <motion.button
                    className="bg-blue-500 p-2 rounded-full hover:bg-blue-600 transition duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaEdit />
                  </motion.button>
                  <motion.button
                    className="bg-red-500 p-2 rounded-full hover:bg-red-600 transition duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaTrash />
                  </motion.button>
                  <motion.button
                    className={`${market.status === 'Open' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} p-2 rounded-full transition duration-300`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {market.status === 'Open' ? <FaLock /> : <FaUnlock />}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Create Market Modal */}
        <AnimatePresence>
          {showMarketForm && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <h2 className="text-2xl font-bold mb-4">Create New Market</h2>
                {error && (
                  <div className="bg-red-500 text-white p-2 rounded mb-4">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-500 text-white p-2 rounded mb-4">
                    {success}
                  </div>
                )}
                <form onSubmit={handleCreateMarket} className="space-y-4">
                  <div>
                    <label className="block mb-1">Category</label>
                    <input 
                      type="text" 
                      name="category" 
                      value={newMarket.category} 
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Question</label>
                    <input 
                      type="text" 
                      name="question" 
                      value={newMarket.question} 
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Description</label>
                    <textarea 
                      name="description" 
                      value={newMarket.description} 
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Options</label>
                    {newMarket.options.map((option, index) => (
                      <input 
                        key={index}
                        type="text" 
                        value={option} 
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="w-full bg-gray-700 rounded px-3 py-2 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder={`Option ${index + 1}`}
                        required
                      />
                    ))}
                    <button 
                      type="button" 
                      onClick={handleAddOption}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                    >
                      Add Option
                    </button>
                  </div>
                  <div>
                    <label className="block mb-1">Start Time</label>
                    <input 
                      type="datetime-local" 
                      name="startTime" 
                      value={newMarket.startTime} 
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">End Time</label>
                    <input 
                      type="datetime-local" 
                      name="endTime" 
                      value={newMarket.endTime} 
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowMarketForm(false);
                        setError('');
                        setSuccess('');
                      }}
                      className="bg-gray-600 text-white font-bold py-2 px-4 rounded hover:bg-gray-700 transition duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-2 px-4 rounded hover:from-green-600 hover:to-green-700 transition duration-300"
                    >
                      Create Market
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Fans */}
        <motion.div 
          className="bg-gray-800 p-6 rounded-xl shadow-lg mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-4">Top Fans</h2>
          <div className="space-y-4">
            {[
              { name: 'John Doe', predictions: 150, winRate: 68 },
              { name: 'Jane Smith', predictions: 132, winRate: 72 },
              { name: 'Bob Johnson', predictions: 128, winRate: 65 },
            ].map((fan, index) => (
              <motion.div
                key={fan.name}
                className="bg-gray-700 p-4 rounded-lg flex items-center justify-between"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center">
                  <FaUserCircle className="text-3xl mr-3 text-blue-400" />
                  <div>
                    <p className="font-bold">{fan.name}</p>
                    <p className="text-sm text-gray-400">{fan.predictions} predictions, {fan.winRate}% win rate</p>
                  </div>
                </div>
                <FaTrophy className="text-2xl text-yellow-400" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div 
          className="bg-gray-800 p-6 rounded-xl shadow-lg mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {[
              { action: 'New market created', time: '2 hours ago', icon: FaChartLine },
              { action: 'Fan milestone reached', time: '1 day ago', icon: FaUsers },
              { action: 'Large prediction placed', time: '2 days ago', icon: FaCoins },
              { action: 'Win streak achieved', time: '3 days ago', icon: FaFireAlt },
            ].map((activity, index) => (
              <motion.div
                key={index}
                className="bg-gray-700 p-4 rounded-lg flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <activity.icon className="text-2xl mr-3 text-green-400" />
                <div>
                  <p className="font-bold">{activity.action}</p>
                  <p className="text-sm text-gray-400">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Achievements */}
        <motion.div 
          className="bg-gray-800 p-6 rounded-xl shadow-lg mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-4">Team Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'Market Domination', icon: FaTrophy, progress: 75, color: 'yellow' },
              { title: 'Fan Frenzy', icon: FaUsers, progress: 60, color: 'blue' },
              { title: 'Token Titan', icon: FaCoins, progress: 40, color: 'green' },
              { title: 'Prediction Perfection', icon: FaBolt, progress: 90, color: 'purple' },
            ].map((achievement, index) => (
              <motion.div 
                key={achievement.title}
                className={`bg-gray-700 p-4 rounded-lg text-center`}
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255,255,255,0.2)' }}
              >
                <achievement.icon className={`text-4xl mb-2 mx-auto text-${achievement.color}-400`} />
                <h3 className="font-bold text-sm mb-2">{achievement.title}</h3>
                <div className="w-full bg-gray-600 rounded-full h-2.5">
                  <motion.div 
                    className={`bg-${achievement.color}-500 h-2.5 rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${achievement.progress}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  ></motion.div>
                </div>
                <p className="text-xs mt-1 text-gray-400">{achievement.progress}%</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          className="bg-gray-800 p-6 rounded-xl shadow-lg mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {[
              { event: 'Fan Token Sale', date: '2024-07-15', icon: FaCoins },
              { event: 'Prediction Tournament', date: '2024-07-20', icon: FaTrophy },
              { event: 'Team AMA Session', date: '2024-07-25', icon: FaUsers },
            ].map((event, index) => (
              <motion.div
                key={index}
                className="bg-gray-700 p-4 rounded-lg flex items-center justify-between"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center">
                  <event.icon className="text-2xl mr-3 text-orange-400" />
                  <div>
                    <p className="font-bold">{event.event}</p>
                    <p className="text-sm text-gray-400">{event.date}</p>
                  </div>
                </div>
                <motion.button
                  className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm hover:bg-orange-600 transition duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Remind Me
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Notification Center */}
        <motion.div
          className="fixed bottom-4 right-4 bg-gray-800 p-4 rounded-lg shadow-lg border-2 border-blue-500"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <h3 className="text-lg font-bold mb-2">Notifications</h3>
          <ul className="space-y-2">
            <li className="flex items-center">
              <FaBolt className="text-yellow-400 mr-2" />
              <span>New high-value prediction placed</span>
            </li>
            <li className="flex items-center">
              <FaUsers className="text-blue-400 mr-2" />
              <span>Fan base grew by 5% this week</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default TeamManagerPage;