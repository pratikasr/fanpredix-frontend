'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link'; 
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFootballBall, FaBasketballBall, FaBaseballBall, FaHockeyPuck, FaTrophy, FaChartLine, FaCoins } from 'react-icons/fa';
import { GiSoccerBall, GiTennisBall, GiVolleyballBall } from 'react-icons/gi';

// Mock data for teams
const teams = [
  { id: 1, name: 'Manchester United', sport: 'Soccer', fanTokens: 1000000, marketsClosed: 50, winRate: 65, color: '#DA291C' },
  { id: 2, name: 'LA Lakers', sport: 'Basketball', fanTokens: 850000, marketsClosed: 45, winRate: 70, color: '#FDB927' },
  { id: 3, name: 'New York Yankees', sport: 'Baseball', fanTokens: 920000, marketsClosed: 48, winRate: 62, color: '#003087' },
  { id: 4, name: 'Real Madrid', sport: 'Soccer', fanTokens: 980000, marketsClosed: 52, winRate: 68, color: '#FFFFFF' },
  { id: 5, name: 'Golden State Warriors', sport: 'Basketball', fanTokens: 800000, marketsClosed: 40, winRate: 72, color: '#1D428A' },
  { id: 6, name: 'Tampa Bay Lightning', sport: 'Ice Hockey', fanTokens: 750000, marketsClosed: 38, winRate: 60, color: '#002868' },
  { id: 7, name: 'Novak Djokovic', sport: 'Tennis', fanTokens: 700000, marketsClosed: 35, winRate: 75, color: '#4B7F52' },
  { id: 8, name: 'Brazil National Team', sport: 'Soccer', fanTokens: 1100000, marketsClosed: 55, winRate: 70, color: '#00A859' },
];

const sportIcons = {
  Soccer: GiSoccerBall,
  Basketball: FaBasketballBall,
  Baseball: FaBaseballBall,
  'Ice Hockey': FaHockeyPuck,
  Tennis: GiTennisBall,
  Volleyball: GiVolleyballBall,
};

export default function TeamPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTeams, setFilteredTeams] = useState(teams);
  const [selectedSport, setSelectedSport] = useState('All');
  const [sortBy, setSortBy] = useState('fanTokens');

  useEffect(() => {
    let result = teams;
    if (searchTerm) {
      result = result.filter(team => 
        team.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedSport !== 'All') {
      result = result.filter(team => team.sport === selectedSport);
    }
    result.sort((a, b) => b[sortBy] - a[sortBy]);
    setFilteredTeams(result);
  }, [searchTerm, selectedSport, sortBy]);

  const sportOptions = ['All', ...new Set(teams.map(team => team.sport))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <motion.h1 
        className="text-6xl font-bold text-center mb-12 font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        FanPredix Teams Arena
      </motion.h1>

      {/* Search and Filter Section */}
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
            placeholder="Search teams..."
            className="bg-transparent border-none focus:outline-none text-white flex-grow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </motion.div>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <motion.div 
            className="flex space-x-2 overflow-x-auto pb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {sportOptions.map((sport, index) => (
              <motion.button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedSport === sport
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                {sport === 'All' ? 'All Sports' : sport}
              </motion.button>
            ))}
          </motion.div>
          <motion.select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-700 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <option value="fanTokens">Sort by Fan Tokens</option>
            <option value="marketsClosed">Sort by Markets Closed</option>
            <option value="winRate">Sort by Win Rate</option>
          </motion.select>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredTeams.map((team, index) => (
            <motion.div
              key={team.id}
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
              <div className="p-6 relative">
                <div className="absolute top-4 right-4 text-6xl opacity-10" style={{ color: team.color }}>
                  {sportIcons[team.sport] && React.createElement(sportIcons[team.sport])}
                </div>
                <h2 className="text-2xl font-bold mb-2 font-orbitron">{team.name}</h2>
                <p className="text-blue-400 mb-4 flex items-center">
                  {React.createElement(sportIcons[team.sport], { className: "mr-2" })}
                  {team.sport}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center"><FaCoins className="mr-2" /> Fan Tokens:</span>
                    <span className="font-bold">{team.fanTokens.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center"><FaChartLine className="mr-2" /> Markets Closed:</span>
                    <span className="font-bold">{team.marketsClosed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center"><FaTrophy className="mr-2" /> Win Rate:</span>
                    <span className="font-bold">{team.winRate}%</span>
                  </div>
                </div>
                <div className="mt-6 relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                        Performance
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        {team.winRate}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                    <motion.div 
                      style={{ width: `${team.winRate}%` }} 
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${team.winRate}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    ></motion.div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-900 flex justify-between items-center">
                <motion.button 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 flex items-center shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                <Link href={`/teams/${team.id}/markets`} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 flex items-center shadow-lg">
                  <FaChartLine className="mr-2" />
                  View Markets
                </Link>
                </motion.button>
                <div className="flex items-center bg-gray-800 rounded-full px-3 py-1">
                  <FaTrophy className="text-yellow-400 mr-2" />
                  <span className="font-bold">{team.marketsClosed}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* No Results Message */}
      {filteredTeams.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-400 mt-12 bg-gray-800 rounded-lg p-8 max-w-md mx-auto"
        >
          <FaSearch className="text-6xl mb-4 mx-auto" />
          <p className="text-xl mb-4">No teams found.</p>
          <p>Try adjusting your search or filters.</p>
        </motion.div>
      )}
    </div>
  );
}