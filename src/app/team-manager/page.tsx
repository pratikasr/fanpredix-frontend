'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUsers, FaChartLine, FaCoins, FaTrophy, FaBolt, FaFireAlt, FaChartBar, FaStar, FaMedal, FaFootballBall, FaPlusCircle, FaUserCircle, FaEdit, FaTrash, FaLock, FaUnlock, FaCheck } from 'react-icons/fa';

// Mock data for the team
const teamData = {
  name: 'Manchester United',
  sport: 'Football',
  fanTokens: 1000000,
  activeMarkets: 20,
  totalFans: 50000,
  winRate: 65,
  level: 8,
  xp: 7500,
  nextLevelXp: 10000,
};

// Mock data for previous markets
const previousMarkets = [
  { id: 1, title: 'Man Utd vs Liverpool', status: 'Closed', participation: 5000, volume: 100000 },
  { id: 2, title: 'Top Scorer 2023', status: 'Active', participation: 3000, volume: 75000 },
  { id: 3, title: 'UCL Qualification', status: 'Pending', participation: 2000, volume: 50000 },
];

const TeamManagerPage = () => {
  const [newMarket, setNewMarket] = useState({ title: '', description: '', endDate: '', options: ['', ''] });
  const [showMarketForm, setShowMarketForm] = useState(false);

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

  const handleCreateMarket = (e) => {
    e.preventDefault();
    console.log('Creating new market:', newMarket);
    setNewMarket({ title: '', description: '', endDate: '', options: ['', ''] });
    setShowMarketForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white pt-20 p-8">
      <motion.h1 
        className="text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-600"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {teamData.name} Command Center
      </motion.h1>

      {/* Team Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Fan Tokens', value: teamData.fanTokens, icon: FaCoins, color: 'yellow' },
          { label: 'Active Markets', value: teamData.activeMarkets, icon: FaChartLine, color: 'green' },
          { label: 'Total Fans', value: teamData.totalFans, icon: FaUsers, color: 'blue' },
          { label: 'Win Rate', value: `${teamData.winRate}%`, icon: FaTrophy, color: 'purple' },
        ].map((stat, index) => (
          <motion.div 
            key={stat.label}
            className={`bg-gray-800 p-4 rounded-xl shadow-lg border-2 border-${stat.color}-500 relative overflow-hidden`}
            whileHover={{ scale: 1.05, boxShadow: `0 0 20px rgba(${stat.color === 'yellow' ? '255,255,0' : stat.color === 'purple' ? '128,0,128' : '0,0,255'},0.3)` }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute top-0 right-0 bg-gradient-to-bl from-gray-700 to-transparent w-16 h-16 rounded-bl-full"></div>
            <stat.icon className={`text-3xl mb-2 text-${stat.color}-400 absolute top-2 right-2`} />
            <h2 className="text-lg font-semibold mb-1">{stat.label}</h2>
            <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
          </motion.div>
        ))}
      </div>

      {/* Team Level Progress */}
      <motion.div 
        className="bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-purple-500 mb-8"
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          {['Market Master', 'Fan Favorite', 'Token Tycoon', 'Prediction Pro'].map((achievement, index) => (
            <motion.div
              key={achievement}
              className="bg-gray-700 p-3 rounded-lg text-center relative"
              whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(255,255,255,0.1)' }}
            >
              <FaStar className="text-2xl mb-2 mx-auto text-yellow-400" />
              <p className="text-sm font-bold">{achievement}</p>
              <motion.div
                className="absolute -top-2 -right-2 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <FaCheck className="text-white text-xs" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Market Management */}
      <motion.div 
        className="bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-green-500 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Market Management</h2>
          <motion.button
            className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300 flex items-center"
            onClick={() => setShowMarketForm(!showMarketForm)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlusCircle className="mr-2" />
            Create New Market
          </motion.button>
        </div>
        
        <AnimatePresence>
          {showMarketForm && (
            <motion.form 
              onSubmit={handleCreateMarket}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div className="mb-4">
                <label className="block mb-2">Market Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={newMarket.title} 
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Description</label>
                <textarea 
                  name="description" 
                  value={newMarket.description} 
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">End Date</label>
                <input 
                  type="date" 
                  name="endDate" 
                  value={newMarket.endDate} 
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Options</label>
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
              <motion.button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-2 px-4 rounded hover:from-green-600 hover:to-green-700 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Market
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

        <h3 className="text-xl font-bold mb-4">Previous Markets</h3>
        <div className="space-y-4">
          {previousMarkets.map((market, index) => (
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
                <p className="text-sm text-gray-400">Participation: {market.participation} | Volume: {market.volume} FT</p>
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
                  className={`${market.status === 'Active' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} p-2 rounded-full transition duration-300`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {market.status === 'Active' ? <FaLock /> : <FaUnlock />}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Top Fans */}
      <motion.div 
        className="bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-pink-500 mb-8"
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
        className="bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-blue-500 mb-8"
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
        className="bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-yellow-500 mb-8"
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
        className="bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-orange-500 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
        <div className="space-y-4">
          {[
            { event: 'Fan Token Sale', date: '2023-07-15', icon: FaCoins },
            { event: 'Prediction Tournament', date: '2023-07-20', icon: FaTrophy },
            { event: 'Team AMA Session', date: '2023-07-25', icon: FaUsers },
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
  );
};

export default TeamManagerPage;