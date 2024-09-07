'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaChartLine, FaUsers, FaHandshake, FaFutbol, FaBasketballBall, FaTableTennis, FaTrophy, FaCoins, FaRocket, FaBolt, FaFireAlt, FaMedal } from 'react-icons/fa';
import { BiLineChart } from 'react-icons/bi';

const statsData = [
  { label: 'Active Markets', value: '1,234', icon: FaChartLine },
  { label: 'Total Users', value: '45.6K', icon: FaUsers },
  { label: 'Bets Placed', value: '789K', icon: FaHandshake },
];

const featuredMarkets = [
  { id: 1, title: 'UEFA Champions League Final', odds: '2.5', hot: true, icon: FaFutbol },
  { id: 2, title: 'NBA Playoffs', odds: '1.8', hot: false, icon: FaBasketballBall },
  { id: 3, title: 'Wimbledon Men\'s Singles', odds: '3.2', hot: true, icon: FaTableTennis },
];

const CountUpAnimation = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);

  useEffect(() => {
    let startTimestamp: number;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <span ref={nodeRef}>{count.toLocaleString()}</span>;
};

export default function Home() {
  const [hoveredMarket, setHoveredMarket] = useState<number | null>(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -50]);

  return (
    <div className="bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            <defs>
              <radialGradient id="Gradient1" cx="50%" cy="50%" fx="0.441602%" fy="50%" r=".5">
                <animate attributeName="fx" dur="34s" values="0%;3%;0%" repeatCount="indefinite"></animate>
                <stop offset="0%" stopColor="rgba(255, 0, 255, 0.5)"></stop>
                <stop offset="100%" stopColor="rgba(255, 0, 255, 0)"></stop>
              </radialGradient>
              <radialGradient id="Gradient2" cx="50%" cy="50%" fx="2.68147%" fy="50%" r=".5">
                <animate attributeName="fx" dur="23.5s" values="0%;3%;0%" repeatCount="indefinite"></animate>
                <stop offset="0%" stopColor="rgba(255, 255, 0, 0.5)"></stop>
                <stop offset="100%" stopColor="rgba(255, 255, 0, 0)"></stop>
              </radialGradient>
              <radialGradient id="Gradient3" cx="50%" cy="50%" fx="0.836536%" fy="50%" r=".5">
                <animate attributeName="fx" dur="21.5s" values="0%;3%;0%" repeatCount="indefinite"></animate>
                <stop offset="0%" stopColor="rgba(0, 255, 255, 0.5)"></stop>
                <stop offset="100%" stopColor="rgba(0, 255, 255, 0)"></stop>
              </radialGradient>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#Gradient1)">
              <animate attributeName="x" dur="20s" values="25%;0%;25%" repeatCount="indefinite" />
              <animate attributeName="y" dur="21s" values="0%;25%;0%" repeatCount="indefinite" />
              <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="17s" repeatCount="indefinite"/>
            </rect>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#Gradient2)">
              <animate attributeName="x" dur="23s" values="-25%;0%;-25%" repeatCount="indefinite" />
              <animate attributeName="y" dur="24s" values="0%;50%;0%" repeatCount="indefinite" />
              <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="18s" repeatCount="indefinite"/>
            </rect>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#Gradient3)">
              <animate attributeName="x" dur="25s" values="0%;25%;0%" repeatCount="indefinite" />
              <animate attributeName="y" dur="26s" values="0%;25%;0%" repeatCount="indefinite" />
              <animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="19s" repeatCount="indefinite"/>
            </rect>
          </svg>
        </div>
        <div className="relative z-10 text-center">
        <motion.h1 
          className="text-7xl md:text-9xl font-extrabold mb-6 text-white"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            textShadow: `
              -1px -1px 0 #000,  
              1px -1px 0 #000,
              -1px  1px 0 #000,
              1px  1px 0 #000,
              0 0 20px rgba(255, 255, 255, 0.5)
            `
          }}
        >
          FanPredix
        </motion.h1>
          <motion.p 
            className="text-2xl md:text-4xl mb-10 font-light"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Predict. Bet. Dominate.
          </motion.p>
          <motion.div 
            className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="/markets" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 px-10 rounded-full transition duration-300 flex items-center justify-center transform hover:scale-105 shadow-lg">
              <FaRocket className="mr-2" /> Explore Markets
            </Link>
            <Link href="/signup" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 px-10 rounded-full transition duration-300 flex items-center justify-center transform hover:scale-105 shadow-lg">
              <FaUsers className="mr-2" /> Join Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-500">Platform Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {statsData.map((stat, index) => (
              <motion.div 
                key={stat.label}
                className="bg-gray-900 p-8 rounded-2xl shadow-xl transform hover:scale-105 transition duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-gradient-to-r from-pink-500 to-cyan-500 p-4 rounded-full">
                    <stat.icon className="text-5xl text-white" />
                  </div>
                </div>
                <h2 className="text-5xl font-bold text-white mb-4 text-center">
                  <CountUpAnimation end={parseInt(stat.value.replace(/,/g, ''))} />
                  {stat.value.includes('K') && 'K'}
                </h2>
                <p className="text-xl text-gray-300 text-center font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Markets */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-500">Hot Markets</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredMarkets.map((market, index) => (
              <motion.div 
                key={market.id}
                className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition duration-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ boxShadow: "0 0 25px rgba(236, 72, 153, 0.3)" }}
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="bg-gradient-to-r from-pink-500 to-cyan-500 p-4 rounded-full">
                      <market.icon className="text-4xl text-white" />
                    </div>
                    {market.hot && (
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                        <FaFireAlt className="mr-1" /> Hot
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">{market.title}</h3>
                  <p className="text-gray-300 mb-6 text-lg">Odds: {market.odds}</p>
                  <Link href={`/markets/${market.id}`} className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 flex items-center justify-center transform hover:scale-105 shadow-lg">
                    <FaHandshake className="mr-2" /> Place Bet
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-500">How it Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Choose a Market', icon: FaChartLine, description: 'Browse through our wide range of sports markets.' },
              { title: 'Place Your Bet', icon: FaHandshake, description: 'Set your stake and confirm your prediction.' },
              { title: 'Win Big!', icon: FaTrophy, description: 'Celebrate your victory and collect your winnings!' }
            ].map((step, index) => (
              <motion.div 
                key={step.title}
                className="bg-gray-900 p-8 rounded-2xl shadow-xl text-center transform hover:scale-105 transition duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-gradient-to-r from-pink-500 to-cyan-500 p-4 rounded-full">
                    <step.icon className="text-5xl text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-500">Top Predictors</h2>
          <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-pink-500 to-cyan-500 text-white">
                <tr>
                  <th className="py-4 px-6 text-left">Rank</th>
                  <th className="py-4 px-6 text-left">User</th>
                  <th className="py-4 px-6 text-left">Win Rate</th>
                  <th className="py-4 px-6 text-left">Total Winnings</th>
                </tr>
              </thead>
              <tbody>
              {[
                  { rank: 1, user: "CryptoKing", winRate: "68%", winnings: "$15,420" },
                  { rank: 2, user: "SportsMaster", winRate: "65%", winnings: "$12,750" },
                  { rank: 3, user: "LuckyCharm", winRate: "62%", winnings: "$10,980" },
                ].map((player, index) => (
                  <motion.tr 
                    key={player.rank}
                    className="border-b border-gray-700"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ 
                      backgroundColor: "rgba(236, 72, 153, 0.1)",
                      transition: { duration: 0.2 }
                    }}
                  >
                    <td className="py-4 px-6 flex items-center">
                      <FaMedal className={`mr-2 ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-400' : 'text-orange-400'}`} />
                      {player.rank}
                    </td>
                    <td className="py-4 px-6 font-medium">{player.user}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-700 rounded-full h-2.5 mr-2">
                          <div className="bg-gradient-to-r from-pink-500 to-cyan-500 h-2.5 rounded-full" style={{ width: player.winRate }}></div>
                        </div>
                        {player.winRate}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-green-400 font-bold">{player.winnings}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-pink-500 to-cyan-500 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-12 md:p-20">
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-5xl font-extrabold mb-8 text-white">Ready to Dominate?</h2>
                <p className="text-2xl mb-12 text-gray-100">Join FanPredix today and start your journey to becoming a top predictor!</p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/signup" className="inline-block bg-white text-gray-900 font-bold py-4 px-12 rounded-full transition duration-300 transform hover:scale-105 shadow-lg text-xl">
                    <div className="flex items-center justify-center">
                      <FaRocket className="mr-3" /> 
                      <span>Start Predicting Now</span>
                    </div>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose FanPredix Section (Unchanged as requested) */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-5xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600">Why Choose FanPredix?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {[
            { title: "Real-Time Odds", icon: BiLineChart, description: "Get up-to-the-minute odds for all markets." },
            { title: "Secure Transactions", icon: FaHandshake, description: "Your bets and winnings are always safe with us." },
            { title: "Expert Analysis", icon: FaChartLine, description: "Access in-depth analysis from sports experts." },
            { title: "Multi-Sport Coverage", icon: FaFutbol, description: "Bet on a wide range of sports and events." },
            { title: "Community Insights", icon: FaUsers, description: "Engage with a community of sports enthusiasts." },
            { title: "Instant Payouts", icon: FaCoins, description: "Withdraw your winnings quickly and easily." },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                y: -10,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                transition: { duration: 0.2 }
              }}
            >
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900 p-4 rounded-full">
                  <feature.icon className="text-4xl text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-center">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}