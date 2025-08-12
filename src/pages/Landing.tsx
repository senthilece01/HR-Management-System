import { useNavigate } from 'react-router-dom';
import React from 'react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-white text-black flex flex-col items-center justify-between">
      {/* Navbar */}
      <nav className="w-full py-6 px-8 flex justify-between items-center border-b border-gray-200">
        <h1 className="text-2xl font-bold">LeavePortal</h1>
        <button
          onClick={() => navigate("/login")}
          className="bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition"
        >
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <section className="text-center px-6 py-20 max-w-3xl">
        <h2 className="text-5xl sm:text-6xl font-extrabold mb-6 leading-tight">
          Effortless Leave Management.
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 mb-10">
          Apply, approve, and track employee leaves — all from one clean and intuitive portal.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-black text-white px-6 py-3 text-lg rounded-full hover:bg-gray-900 transition"
        >
          Get Started →
        </button>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 py-16 border-t border-gray-200 w-full max-w-6xl">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Live Tracking</h3>
          <p className="text-gray-600">Track leave balances, statuses, and history in real-time.</p>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Fast Approvals</h3>
          <p className="text-gray-600">Managers can approve or reject requests instantly.</p>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Simple UI</h3>
          <p className="text-gray-600">No clutter, no confusion — just clean leave management.</p>
        </div>
      </section>

      {/* Footer 
      <footer className="w-full py-6 text-center text-sm text-gray-500 border-t border-gray-200">
        © {new Date().getFullYear()} Leave Management Portal
      </footer>
      */}
    </main>
  );
}
