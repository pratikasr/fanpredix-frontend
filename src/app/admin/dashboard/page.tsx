'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUsers, FaChartLine, FaCoins, FaShieldAlt, FaPlusCircle, FaCog, FaTrophy, FaUserPlus } from 'react-icons/fa';
import { ethers } from 'ethers';

const contractAddress = '0x239EDd859C51b8b7ac88F55Eed96F380F0bD816d';
const contractABI = [
  // Add the ABI for the addTeam function here
  {
    "inputs": [
      { "internalType": "string", "name": "_name", "type": "string" },
      { "internalType": "address", "name": "_teamManager", "type": "address" },
      { "internalType": "address", "name": "_fanToken", "type": "address" }
    ],
    "name": "addTeam",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Add the ABI for the getAllTeams function here
  {
    "inputs": [],
    "name": "getAllTeams",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "id", "type": "uint256" },
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "address", "name": "teamManager", "type": "address" },
          { "internalType": "address", "name": "fanToken", "type": "address" }
        ],
        "internalType": "struct FanPredix.Team[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  // Add other relevant functions from your contract ABI
];

const AdminDashboard = () => {
  const [platformStats, setPlatformStats] = useState({
    totalTeams: 0,
    activeMarkets: 0,
    totalPredictions: 0,
    fanTokensCirculation: 0,
  });

  const [newTeam, setNewTeam] = useState({
    name: '',
    teamManager: '',
    fanToken: '',
  });

  const [teams, setTeams] = useState([]);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);

  useEffect(() => {
    fetchPlatformStats();
    fetchTeams();
  }, []);

  const fetchPlatformStats = async () => {
    // Implement fetching of platform stats from the contract
    // For now, we'll use dummy data
    setPlatformStats({
      totalTeams: 10,
      activeMarkets: 50,
      totalPredictions: 100000,
      fanTokensCirculation: 10000000,
    });
  };

  const fetchTeams = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        const fetchedTeams = await contract.getAllTeams();
        setTeams(fetchedTeams);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeam(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTeam = async (e) => {
    e.preventDefault();
    
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        const tx = await contract.addTeam(newTeam.name, newTeam.teamManager, newTeam.fanToken);
        await tx.wait();
        
        console.log('Team added successfully');
        setShowAddTeamModal(false);
        setNewTeam({ name: '', teamManager: '', fanToken: '' });
        fetchTeams();
      } catch (error) {
        console.error('Error adding team:', error);
      }
    } else {
      console.log('Please install MetaMask');
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
          FanPredix Admin Command Center
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Teams', value: platformStats.totalTeams, icon: FaShieldAlt, color: 'blue' },
            { label: 'Active Markets', value: platformStats.activeMarkets, icon: FaChartLine, color: 'green' },
            { label: 'Total Predictions', value: platformStats.totalPredictions, icon: FaTrophy, color: 'yellow' },
            { label: 'Fan Tokens Circulation', value: platformStats.fanTokensCirculation, icon: FaCoins, color: 'purple' },
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

        <motion.div 
          className="bg-gray-800 rounded-xl shadow-lg p-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold font-orbitron">Registered Teams</h2>
            <motion.button
              onClick={() => setShowAddTeamModal(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaUserPlus className="mr-2" /> Add Team
            </motion.button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="pb-2">ID</th>
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Team Manager</th>
                  <th className="pb-2">Fan Token</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team, index) => (
                  <motion.tr 
                    key={team.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-700"
                  >
                    <td className="py-3">{team.id.toString()}</td>
                    <td className="py-3">{team.name}</td>
                    <td className="py-3">{`${team.teamManager.slice(0, 6)}...${team.teamManager.slice(-4)}`}</td>
                    <td className="py-3">{`${team.fanToken.slice(0, 6)}...${team.fanToken.slice(-4)}`}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div 
          className="bg-gray-800 rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-6 font-orbitron">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { action: 'Manage Markets', icon: FaChartLine, color: 'blue' },
              { action: 'User Reports', icon: FaUsers, color: 'green' },
              { action: 'Token Management', icon: FaCoins, color: 'yellow' },
              { action: 'System Settings', icon: FaCog, color: 'red' },
            ].map((action, index) => (
              <motion.button
                key={action.action}
                className={`bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg flex flex-col items-center justify-center transition duration-300`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <action.icon className={`text-3xl mb-2 text-${action.color}-400`} />
                <span className="text-sm font-bold">{action.action}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Add Team Modal */}
      <AnimatePresence>
        {showAddTeamModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-800 p-8 rounded-xl shadow-xl max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 className="text-2xl font-bold mb-4">Add New Team</h2>
              <form onSubmit={handleAddTeam} className="space-y-4">
                <div>
                  <label className="block mb-1">Team Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={newTeam.name} 
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Team Manager Address</label>
                  <input 
                    type="text" 
                    name="teamManager" 
                    value={newTeam.teamManager} 
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Fan Token Address</label>
                  <input 
                    type="text" 
                    name="fanToken" 
                    value={newTeam.fanToken} 
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddTeamModal(false)}
                    className="bg-gray-600 text-white font-bold py-2 px-4 rounded hover:bg-gray-700 transition duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-2 px-4 rounded hover:from-pink-600 hover:to-purple-700 transition duration-300"
                  >
                    Add Team
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;