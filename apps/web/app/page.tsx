"use client";

import React, { useState } from "react";
import { Search, Bell, MessageSquare, X, Minimize2 } from "lucide-react";

const EchoLandingPage = () => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#0f1419] text-white font-sans overflow-hidden relative">
      {/* Background gradient effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[150px]"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px]"></div>

      {/* Decorative star */}
      <div className="absolute bottom-20 right-20 text-gray-500">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <path
            d="M30 0L32.5 27.5L60 30L32.5 32.5L30 60L27.5 32.5L0 30L27.5 27.5L30 0Z"
            fill="currentColor"
            opacity="0.3"
          />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 leading-tight tracking-tight">
            Turn Every Visitor into
            <br />a Conversation.
          </h1>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            The enterprise AI layer that proactively engages leads, answers
            complex queries, and escalates to your team at the perfect moment.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onMouseEnter={() => setHoveredButton("demo")}
              onMouseLeave={() => setHoveredButton(null)}
              className="px-8 py-3.5 bg-cyan-400 text-gray-900 rounded-full font-medium hover:bg-cyan-300 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] hover:scale-105"
            >
              Request a Demo
            </button>
            <button
              onMouseEnter={() => setHoveredButton("docs")}
              onMouseLeave={() => setHoveredButton(null)}
              className="px-8 py-3.5 border-2 border-cyan-400/50 text-cyan-400 rounded-full font-medium hover:bg-cyan-400/10 hover:border-cyan-400 transition-all duration-300"
            >
              View Documentation
            </button>
          </div>
        </div>

        {/* Main Dashboard Mockup */}
        <div className="relative max-w-6xl mx-auto">
          {/* Browser Window */}
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50">
            {/* Browser Chrome */}
            <div className="bg-gray-800/60 px-4 py-3 flex items-center gap-2 border-b border-gray-700/50">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-gray-700/50 rounded-lg px-4 py-1.5 flex items-center gap-2 w-64">
                  <div className="w-4 h-4 text-gray-400">🔒</div>
                  <span className="text-gray-400 text-sm">brandboard.com</span>
                </div>
              </div>
              <div className="flex gap-3 text-gray-400">
                <div className="w-5 h-5"></div>
                <div className="w-5 h-5"></div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="flex">
              {/* Sidebar */}
              <div className="w-56 bg-gray-900/40 border-r border-gray-700/50 p-4">
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">NC</span>
                  </div>
                  <span className="font-semibold">Next Chat</span>
                </div>

                <nav className="space-y-1">
                  <div className="flex items-center gap-3 px-3 py-2 bg-gray-700/30 rounded-lg text-white">
                    <div className="w-5 h-5">📊</div>
                    <span className="text-sm">Dashboard</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700/20 rounded-lg transition-colors">
                    <div className="w-5 h-5">👥</div>
                    <span className="text-sm">Visitors</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700/20 rounded-lg transition-colors">
                    <div className="w-5 h-5">💬</div>
                    <span className="text-sm">Messages</span>
                  </div>
                </nav>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-semibold">Dashboard</h2>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="relative">
                      <Bell className="w-5 h-5 text-gray-400" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full"></div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-gray-800/30 rounded-xl p-4">
                    <div className="text-gray-400 text-sm mb-1">
                      Total visitors
                    </div>
                    <div className="text-2xl font-bold">$7.0k</div>
                    <div className="text-green-400 text-xs mt-1">
                      ↑ 12% vs last week
                    </div>
                  </div>
                  <div className="bg-gray-800/30 rounded-xl p-4">
                    <div className="text-gray-400 text-sm mb-1">
                      Total questions
                    </div>
                    <div className="text-2xl font-bold">$84K</div>
                    <div className="text-green-400 text-xs mt-1">
                      ↑ 8% vs last week
                    </div>
                  </div>
                  <div className="bg-gray-800/30 rounded-xl p-4">
                    <div className="text-gray-400 text-sm mb-1">
                      Average visitor
                    </div>
                    <div className="text-2xl font-bold">33</div>
                    <div className="text-green-400 text-xs mt-1">
                      ↑ 12% vs last week
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="space-y-3">
                  <div className="flex items-center gap-4 px-4 py-3 bg-gray-800/20 rounded-lg">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400 text-sm font-bold">
                      V1
                    </div>
                    <div className="flex-1 h-2 bg-gray-700/50 rounded"></div>
                    <div className="w-16 h-2 bg-gray-700/50 rounded"></div>
                    <div className="w-20 h-2 bg-gray-700/50 rounded"></div>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                      Succeeded
                    </span>
                    <div className="text-gray-400">›</div>
                  </div>

                  <div className="flex items-center gap-4 px-4 py-3 bg-gray-800/20 rounded-lg">
                    <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400 text-sm font-bold">
                      V2
                    </div>
                    <div className="flex-1 h-2 bg-gray-700/50 rounded"></div>
                    <div className="w-16 h-2 bg-gray-700/50 rounded"></div>
                    <div className="w-20 h-2 bg-gray-700/50 rounded"></div>
                    <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-medium">
                      Delayed
                    </span>
                    <div className="text-gray-400">›</div>
                  </div>

                  <div className="flex items-center gap-4 px-4 py-3 bg-gray-800/20 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 text-sm font-bold">
                      V3
                    </div>
                    <div className="flex-1 h-2 bg-gray-700/50 rounded"></div>
                    <div className="w-16 h-2 bg-gray-700/50 rounded"></div>
                    <div className="w-20 h-2 bg-gray-700/50 rounded"></div>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                      Succeeded
                    </span>
                    <div className="text-gray-400">›</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Escalation Popup - Left Side with Premium Glassmorphism */}
          <div className="absolute left-0 top-1/3 -translate-x-12 group">
            <div className="relative bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-2xl w-80 hover:scale-105 transition-transform duration-300">
              {/* Inner shadow effect */}
              <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]"></div>

              <div className="relative">
                {/* Header */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="relative">
                    <div className="w-2.5 h-2.5 bg-green-400 rounded-full"></div>
                    <div className="absolute inset-0 w-2.5 h-2.5 bg-green-400 rounded-full animate-ping"></div>
                  </div>
                  <span className="text-sm font-semibold text-white">
                    Live Escalation
                  </span>
                </div>

                <div className="space-y-3">
                  {/* AI Status */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xs">🤖</span>
                      </div>
                      <span className="text-sm text-gray-200">
                        Next Chat AI is assisting...
                      </span>
                    </div>
                  </div>

                  {/* High Priority Alert */}
                  <div className="bg-amber-500/10 backdrop-blur-sm rounded-xl p-3.5 border border-amber-500/30 shadow-lg">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-lg flex-shrink-0">⚠️</span>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-amber-300 mb-1">
                          Detecting customer confussion
                        </div>
                        <div className="text-xs text-amber-200/90 leading-relaxed">
                          Human intervention required.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Agent Joining */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/5 flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      S
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-400">
                        Escalated to human
                      </div>
                      <div className="text-sm text-gray-200 font-medium">
                        Sarah Mitchell
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
                      <div
                        className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Echo Widget - Right Side with Glow */}
          <div className="absolute right-0 top-1/2 translate-x-12 group">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-cyan-400/30 blur-2xl rounded-3xl scale-105"></div>

              {/* Widget */}
              <div className="relative bg-gray-900/90 backdrop-blur-xl border-2 border-cyan-400/50 rounded-3xl shadow-2xl w-80 overflow-hidden hover:scale-105 transition-transform duration-300">
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-3 flex items-center justify-between border-b border-cyan-400/30">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-cyan-400" />
                    <span className="font-semibold text-cyan-400">
                      Echo Widget
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Minimize2 className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
                    <X className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
                  </div>
                </div>

                {/* Chat Content */}
                <div className="p-4 h-64 bg-gradient-to-b from-gray-900 to-gray-950">
                  <div className="mb-4">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs">🤖</span>
                      </div>
                      <div className="bg-gray-800/60 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%]">
                        <p className="text-sm text-gray-200">
                          How can I help you today?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Input Area */}
                <div className="bg-gray-900/95 border-t border-cyan-400/20 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button className="text-cyan-400 text-sm hover:text-cyan-300">
                      AI chat
                    </button>
                    <div className="w-px h-4 bg-gray-700"></div>
                    <button className="text-gray-400 text-sm hover:text-white">
                      Human channels open
                    </button>
                  </div>
                  <div className="mt-2 bg-gray-800/60 rounded-lg px-3 py-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none"
                    />
                    <div className="flex gap-1 text-gray-500">
                      <button className="hover:text-white">📎</button>
                      <button className="hover:text-white">😊</button>
                      <button className="hover:text-white">🎤</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EchoLandingPage;
