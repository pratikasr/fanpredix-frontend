'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaChartLine, FaUsers, FaHandshake, FaFutbol, FaBasketballBall, FaTableTennis, FaTrophy, FaCoins, FaRocket, FaBolt, FaFireAlt, FaMedal, FaShieldAlt, FaChartBar } from 'react-icons/fa';
import { BiLineChart } from 'react-icons/bi';
import { Link as ScrollLink, Element } from 'react-scroll';

const statsData = [
  { label: 'Active Teams', value: '256', icon: FaShieldAlt },
  { label: 'Total Fans', value: '1.2M', icon: FaUsers },
  { label: 'Predictions Made', value: '5.6M', icon: FaChartBar },
];

const featuredMarkets = [
  { id: 1, team: 'Barcelona FC', title: 'UCL Quarter-Final', odds: '2.5', hot: true, icon: FaFutbol },
  { id: 2, team: 'LA Lakers', title: 'NBA Playoffs Game 5', odds: '1.8', hot: false, icon: FaBasketballBall },
  { id: 3, team: 'Novak Djokovic', title: 'Wimbledon Final', odds: '3.2', hot: true, icon: FaTableTennis },
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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="bg-gray-900 text-white">
      {/* Hero Section */}
        <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 to-purple-900">
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
              className="text-7xl md:text-9xl font-extrabold mb-6 text-white font-orbitron"
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
              Team-Powered Predictions. Fan Token Rewards.
            </motion.p>
            <motion.div 
              className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link href="/teams" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 px-10 rounded-full transition duration-300 flex items-center justify-center transform hover:scale-105 hover:shadow-neon-pink">
                <FaShieldAlt className="mr-2" /> Explore Teams
              </Link>
              <Link href="/signup" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 px-10 rounded-full transition duration-300 flex items-center justify-center transform hover:scale-105 hover:shadow-neon-blue">
                <FaUsers className="mr-2" /> Join as a Fan
              </Link>
            </motion.div>
          </div>
          <ScrollLink to="ecosystem" smooth={true} duration={500} className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-white text-4xl"
            >
              ↓
            </motion.div>
          </ScrollLink>
        </section>

      {/* Quick Stats */}
        <section id="ecosystem" className="py-20 bg-gray-800 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-5xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-500 font-orbitron">FanPredix Ecosystem</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {statsData.map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  className="bg-gray-900 p-8 rounded-2xl shadow-xl transform hover:scale-105 transition duration-300 hover:shadow-neon-mixed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-center mb-6">
                    <div className="bg-gradient-to-r from-pink-500 to-cyan-500 p-4 rounded-full">
                      <stat.icon className="text-5xl text-white" />
                    </div>
                  </div>
                  <h2 className="text-5xl font-bold text-white mb-4 text-center font-orbitron">
                    <CountUpAnimation end={parseInt(stat.value.replace(/,/g, ''))} />
                    {stat.value.includes('M') && 'M'}
                  </h2>
                  <p className="text-xl text-gray-300 text-center font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse"></div>
        </section>

      {/* Featured Markets */}
        <section id="markets" className="py-20 bg-gray-900 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-5xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-500 font-orbitron">Team-Created Markets</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredMarkets.map((market, index) => (
                <motion.div 
                  key={market.id}
                  className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition duration-300 hover:shadow-neon-mixed"
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
                    <h3 className="text-xl font-semibold mb-2">{market.team}</h3>
                    <h4 className="text-2xl font-bold mb-4 font-orbitron">{market.title}</h4>
                    <p className="text-gray-300 mb-6 text-lg">Fan Token Odds: {market.odds}</p>
                    <Link href={`/markets/${market.id}`} className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 flex items-center justify-center transform hover:scale-105 shadow-lg hover:shadow-neon-pink">
                      <FaHandshake className="mr-2" /> Make Prediction
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="absolute inset-0 bg-[url('/images/stadium-bg.jpg')] bg-cover bg-center opacity-10"></div>
        </section>

      {/* How it Works */}
        <section id="how-it-works" className="py-20 bg-gray-800 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-5xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-500 font-orbitron">How FanPredix Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { title: 'Teams Create Markets', icon: FaShieldAlt, description: 'Official team managers set up prediction markets for their events.' },
                { title: 'Fans Make Predictions', icon: FaChartBar, description: 'Use team-specific Fan Tokens to participate in markets.' },
                { title: 'Earn Fan Token Rewards', icon: FaCoins, description: 'Successful predictions are rewarded with more Fan Tokens!' }
              ].map((step, index) => (
                <motion.div 
                  key={step.title}
                  className="bg-gray-900 p-8 rounded-2xl shadow-xl text-center transform hover:scale-105 transition duration-300 hover:shadow-neon-mixed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-center mb-6">
                    <div className="bg-gradient-to-r from-pink-500 to-cyan-500 p-4 rounded-full">
                      <step.icon className="text-5xl text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 font-orbitron">{step.title}</h3>
                  <p className="text-gray-300">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse"></div>
        </section>

      {/* Top Teams Section */}
        <section id="top-teams" className="py-20 bg-gray-900 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-5xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-500 font-orbitron">Top Performing Teams</h2>
            <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-pink-500 to-cyan-500 text-white">
                  <tr>
                    <th className="py-4 px-6 text-left">Rank</th>
                    <th className="py-4 px-6 text-left">Team</th>
                    <th className="py-4 px-6 text-left">Active Markets</th>
                    <th className="py-4 px-6 text-left">Fan Engagement</th>
                  </tr>
                </thead>
                <tbody>
                {[
                    { rank: 1, team: "Manchester United", markets: 15, engagement: "95%" },
                    { rank: 2, team: "Los Angeles Lakers", markets: 12, engagement: "92%" },
                    { rank: 3, team: "New York Yankees", markets: 10, engagement: "89%" },
                  ].map((team, index) => (
                    <motion.tr 
                      key={team.rank}
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
                        {team.rank}
                      </td>
                      <td className="py-4 px-6 font-medium">{team.team}</td>
                      <td className="py-4 px-6">{team.markets}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-700 rounded-full h-2.5 mr-2">
                            <div className="bg-gradient-to-r from-pink-500 to-cyan-500 h-2.5 rounded-full" style={{ width: team.engagement }}></div>
                          </div>
                          {team.engagement}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="absolute inset-0 bg-[url('/images/crowd-bg.jpg')] bg-cover bg-center opacity-10"></div>
        </section>

      {/* Why Choose FanPredix Section */}
        <section id="why-choose" className="container mx-auto px-4 py-20 relative overflow-hidden">
          <h2 className="text-5xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600 font-orbitron">Why Choose FanPredix?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 relative z-10">
            {[
              { title: "Team-Created Markets", icon: FaShieldAlt, description: "Participate in markets directly created by your favorite teams." },
              { title: "Fan Token Integration", icon: FaCoins, description: "Use and earn team-specific Fan Tokens for all predictions." },
              { title: "Expert Team Insights", icon: FaChartLine, description: "Access exclusive information from official team sources." },
              { title: "Multi-Sport Coverage", icon: FaFutbol, description: "Engage with a wide range of sports and teams globally." },
              { title: "Community Engagement", icon: FaUsers, description: "Connect with fellow fans and boost your team's performance." },
              { title: "Instant Token Rewards", icon: FaBolt, description: "Receive Fan Token payouts immediately after market resolution." },
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
                <h3 className="text-2xl font-semibold mb-4 text-center font-orbitron">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">{feature.description}</p>
              </motion.div>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-green-500/5 animate-pulse"></div>
        </section>

      {/* Call to Action */}
        <section id="cta" className="py-20 bg-gray-800 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="bg-gradient-to-r from-pink-500 to-cyan-500 rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-12 md:p-20">
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-5xl font-extrabold mb-8 text-white font-orbitron">Ready to Join Your Team's Prediction Market?</h2>
                  <p className="text-2xl mb-12 text-gray-100">Start making predictions and earning Fan Tokens with FanPredix today!</p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href="/signup" className="inline-block bg-white text-gray-900 font-bold py-4 px-12 rounded-full transition duration-300 transform hover:scale-105 shadow-lg text-xl hover:shadow-neon-white">
                      <div className="flex items-center justify-center">
                        <FaRocket className="mr-3" /> 
                        <span>Join Your Team Now</span>
                      </div>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-[url('/images/stadium-lights.jpg')] bg-cover bg-center opacity-10"></div>
        </section>
    </div>
  );
}