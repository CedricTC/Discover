'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home',  icon: '🏠' },
    { name: 'About',  icon: '📍' },
    { name: 'Contact',  icon: '📧' }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-gray-900/95 backdrop-blur-lg shadow-2xl shadow-blue-500/10 border-b border-gray-700/50' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
              <div>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                DISCOVER
              </h1>
              <p className="text-xs text-gray-400 font-medium tracking-wider">
                EXPLORE PLACES
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item, index) => (
              <a
                key={item.name}
                
                className="group relative px-6 py-3 rounded-2xl transition-all duration-300 hover:bg-gray-800/50 border border-transparent hover:border-gray-600/50"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </span>
                  <span className="text-gray-300 font-medium group-hover:text-white transition-colors duration-300">
                    {item.name}
                  </span>
                </div>
                
                {/* Hover effect line */}
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-3/4 transition-all duration-300 rounded-full"></div>
              </a>
            ))}
          </nav>

          {/* CTA Button - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="relative group overflow-hidden px-6 py-3 rounded-2xl font-semibold text-white transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 transition-all duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Explore</span>
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative group p-3 rounded-xl bg-gray-800/50 border border-gray-600/50 transition-all duration-300 hover:bg-gray-700/50"
            >
              <div className="space-y-1.5">
                <div className={`w-6 h-0.5 bg-gray-300 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-gray-300 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-gray-300 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-500 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-96 opacity-100 pb-6' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="space-y-2 pt-4 border-t border-gray-700/50">
            {navItems.map((item, index) => (
              <a
                key={item.name}
                
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-4 px-4 py-3 rounded-xl bg-gray-800/30 border border-gray-700/30 hover:bg-gray-700/50 transition-all duration-300 group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </span>
                <span className="text-gray-300 font-medium group-hover:text-white transition-colors duration-300">
                  {item.name}
                </span>
                <div className="flex-1"></div>
                <svg className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ))}
            
            {/* Mobile CTA */}
            <div className="pt-4">
              <button className="w-full relative group overflow-hidden px-6 py-4 rounded-2xl font-semibold text-white transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Start Exploring</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Background blur overlay when mobile menu is open */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </header>
  );
};

export default Header;