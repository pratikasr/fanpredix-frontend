'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link'; 
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTrophy, FaCrown, FaChartLine, FaCoins, FaUsers, FaHistory, FaCalendarAlt, FaExternalLinkAlt, FaFire, FaBolt, FaLock, FaUnlock, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { GiSoccerBall, GiTennisBall, GiVolleyballBall, GiPodium, GiTrophyCup } from 'react-icons/gi';

// Mock data for teams (you would fetch this data based on the teamId)
const teamsData = {
  1: {
    id: 1,
    name: 'Manchester United',
    sport: 'Soccer',
    fanTokens: 1000000,
    marketsClosed: 50,
    winRate: 65,
    color: '#DA291C',
    icon: GiSoccerBall,
    founded: 1878,
    fanBase: 1100000,
    description: 'Manchester United is a professional football club based in Old Trafford, Greater Manchester, England. The club is one of the most widely supported in the world and has won numerous domestic and international titles.',
    level: 8,
    xp: 75,
    achievements: ['Top Predictor', 'Market Maker', 'Fan Favorite']
  },
  // ... other teams ...
};

// Mock data for markets (you would fetch this data based on the teamId)
const marketsData = [
  { id: 1, title: 'Man Utd vs Liverpool - Winner', endDate: '2024-12-31', liquidity: 500000, volume: 1200000, difficulty: 'Hard', hotness: 'Blazing' },
  { id: 2, title: 'Top Goalscorer of the Season', endDate: '2025-05-15', liquidity: 300000, volume: 800000, difficulty: 'Medium', hotness: 'Hot' },
  { id: 3, title: 'Clean Sheets in Next 5 Games', endDate: '2024-11-30', liquidity: 200000, volume: 600000, difficulty: 'Easy', hotness: 'Cool' },
  // ... more markets ...
];

export default function TeamMarketsPage() {
  const params = useParams();
  const teamId = params.teamId as string;
  const team = teamsData[teamId];

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMarkets, setFilteredMarkets] = useState(marketsData);
  const [sortBy, setSortBy] = useState('liquidity');
  const [activeTab, setActiveTab] = useState('markets');

  useEffect(() => {
    let result = marketsData;
    if (searchTerm) {
      result = result.filter(market => 
        market.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    result.sort((a, b) => b[sortBy] - a[sortBy]);
    setFilteredMarkets(result);
  }, [searchTerm, sortBy]);

  if (!team) {
    return <div>Team not found</div>;
  }

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getHotnessIcon = (hotness) => {
    switch(hotness) {
      case 'Blazing': return <FaFire className="text-red-500" />;
      case 'Hot': return <FaBolt className="text-yellow-500" />;
      default: return <FaChartLine className="text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Team Info Section */}
      <motion.div 
        className="max-w-7xl mx-auto mb-12 bg-gray-800 rounded-3xl overflow-hidden shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-8" style={{ borderTop: `4px solid ${team.color}` }}>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold font-orbitron">{team.name}</h1>
            <div className="flex items-center">
              <team.icon className="text-6xl mr-4" style={{ color: team.color }} />
              <div className="bg-gray-700 rounded-full px-4 py-2 flex items-center">
                <FaStar className="text-yellow-400 mr-1" />
                <span className="font-bold">Level {team.level}</span>
              </div>
            </div>
          </div>
          <p className="text-gray-300 mb-6">{team.description}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-700 p-4 rounded-lg">
              <FaCalendarAlt className="text-2xl mb-2" style={{ color: team.color }} />
              <p className="text-sm text-gray-400">Founded</p>
              <p className="text-xl font-bold">{team.founded}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <FaUsers className="text-2xl mb-2" style={{ color: team.color }} />
              <p className="text-sm text-gray-400">Fan Base</p>
              <p className="text-xl font-bold">{team.fanBase.toLocaleString()}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <FaCoins className="text-2xl mb-2" style={{ color: team.color }} />
              <p className="text-sm text-gray-400">Fan Tokens</p>
              <p className="text-xl font-bold">{team.fanTokens.toLocaleString()}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <FaTrophy className="text-2xl mb-2" style={{ color: team.color }} />
              <p className="text-sm text-gray-400">Win Rate</p>
              <p className="text-xl font-bold">{team.winRate}%</p>
            </div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-bold mb-2">XP Progress</h3>
            <div className="w-full bg-gray-600 rounded-full h-4 mb-2">
              <div 
                className="bg-blue-500 rounded-full h-4"
                style={{ width: `${team.xp}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-400">{team.xp}/100 XP to next level</p>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-full font-bold ${activeTab === 'markets' ? 'bg-blue-600' : 'bg-gray-700'}`}
            onClick={() => setActiveTab('markets')}
          >
            Markets
          </button>
          <button
            className={`px-4 py-2 rounded-full font-bold ${activeTab === 'achievements' ? 'bg-blue-600' : 'bg-gray-700'}`}
            onClick={() => setActiveTab('achievements')}
          >
            Achievements
          </button>
        </div>
      </div>

      {activeTab === 'markets' ? (
        <>
          {/* Markets Section */}
          <motion.h2 
            className="text-4xl font-bold text-center mb-8 font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Active Markets
          </motion.h2>

          {/* Search and Sort */}
          <div className="max-w-4xl mx-auto mb-12 space-y-6">
            <motion.div 
              className="flex items-center bg-gray-800 rounded-full p-2 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <FaSearch className="text-gray-400 ml-3 mr-2" />
              <input
                type="text"
                placeholder="Search markets..."
                className="bg-transparent border-none focus:outline-none text-white flex-grow"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </motion.div>
            <motion.select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-700 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <option value="liquidity">Sort by Liquidity</option>
              <option value="volume">Sort by Volume</option>
            </motion.select>
          </div>

          {/* Markets Grid */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredMarkets.map((market, index) => (
                <motion.div
                  key={market.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${team.color}22, ${team.color}11)`,
                    borderTop: `4px solid ${team.color}`,
                  }}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold font-orbitron">{market.title}</h3>
                      {getHotnessIcon(market.hotness)}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 flex items-center"><FaCalendarAlt className="mr-2" /> End Date:</span>
                        <span className="font-bold">{market.endDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 flex items-center"><FaCoins className="mr-2" /> Liquidity:</span>
                        <span className="font-bold">{market.liquidity.toLocaleString()} FT</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 flex items-center"><FaChartLine className="mr-2" /> Volume:</span>
                        <span className="font-bold">{market.volume.toLocaleString()} FT</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 flex items-center"><GiPodium className="mr-2" /> Difficulty:</span>
                        <span className={`font-bold ${getDifficultyColor(market.difficulty)}`}>{market.difficulty}</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-4 bg-gray-900 flex justify-between items-center">
                  <Link href={`/teams/${teamId}/markets/${market.id}`}>
                    <motion.button 
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 flex items-center shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                    
                      <FaExternalLinkAlt className="mr-2" />
                      Predict Now
                      
                    </motion.button>
                    </Link>
                    <div className="flex items-center bg-gray-800 rounded-full px-3 py-1">
                      {market.hotness === 'Blazing' ? <FaFire className="text-red-500 mr-2" /> : <FaChartLine className="text-green-400 mr-2" />}
                      <span className="font-bold">{market.hotness}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* No Results Message */}
          {filteredMarkets.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-400 mt-12 bg-gray-800 rounded-lg p-8 max-w-md mx-auto"
            >
              <FaSearch className="text-6xl mb-4 mx-auto" />
              <p className="text-xl mb-4">No markets found.</p>
              <p>Try adjusting your search criteria.</p>
            </motion.div>
          )}
        </>
      ) : (
        // Achievements Section
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center mb-8 font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-500"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Team Achievements
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.achievements.map((achievement, index) => (
              <motion.div
                key={achievement}
                className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center mb-4">
                  <GiTrophyCup className="text-4xl text-yellow-400 mr-4" />
                  <h3 className="text-xl font-bold">{achievement}</h3>
                </div>
                <p className="text-gray-400">Congratulations on earning this achievement!</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-12 bg-gray-800 rounded-2xl p-8 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-2xl font-bold mb-6">Upcoming Achievements</h3>
            <div className="space-y-4">
              {['Market Master', 'Prediction Prodigy', 'Token Tycoon'].map((upcomingAchievement, index) => (
                <div key={upcomingAchievement} className="flex items-center">
                  <FaLock className="text-gray-500 mr-4" />
                  <span className="text-gray-400">{upcomingAchievement}</span>
                  <div className="ml-auto bg-gray-700 rounded-full h-2 w-24">
                    <div 
                      className="bg-blue-500 rounded-full h-2" 
                      style={{ width: `${(index + 1) * 25}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Leaderboard Section */}
      <motion.div
        className="max-w-7xl mx-auto mt-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h2 className="text-4xl font-bold text-center mb-8 font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
          Team Leaderboard
        </h2>
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400">
                <th className="pb-4">Rank</th>
                <th className="pb-4">User</th>
                <th className="pb-4">Predictions</th>
                <th className="pb-4">Win Rate</th>
              </tr>
            </thead>
            <tbody>
              {[
                { rank: 1, user: 'CryptoKing', predictions: 150, winRate: 68 },
                { rank: 2, user: 'PredictionPro', predictions: 132, winRate: 65 },
                { rank: 3, user: 'TokenMaster', predictions: 128, winRate: 62 },
              ].map((player) => (
                <tr key={player.rank} className="border-t border-gray-700">
                  <td className="py-4">
                    <div className="flex items-center">
                      {player.rank === 1 && <FaCrown className="text-yellow-400 mr-2" />}
                      {player.rank}
                    </div>
                  </td>
                  <td className="py-4 font-bold">{player.user}</td>
                  <td className="py-4">{player.predictions}</td>
                  <td className="py-4">
                    <div className="flex items-center">
                      <span className="mr-2">{player.winRate}%</span>
                      <div className="bg-gray-700 rounded-full h-2 w-24">
                        <div 
                          className="bg-green-500 rounded-full h-2" 
                          style={{ width: `${player.winRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        className="max-w-4xl mx-auto mt-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <h2 className="text-3xl font-bold mb-4">Ready to make your predictions?</h2>
        <p className="text-gray-400 mb-8">Join the excitement and start predicting now!</p>
        <motion.button
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Predicting
        </motion.button>
      </motion.div>
    </div>
  );
}