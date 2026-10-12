"use client";

import { signIn } from "next-auth/react";
import { Sparkles, Calendar, CheckSquare, Share2, ArrowRight } from "lucide-react";
import { useState } from "react";

export function StudioLogin() {
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    signIn("google");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-[#0a0d14]">
      {/* Background Studio Glow & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))] pointer-events-none" />
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }} 
      />

      {/* Glow Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Studio Card */}
      <div className="relative w-full max-w-md border border-slate-800/80 bg-slate-900/60 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl shadow-purple-950/30">
        {/* Header Badge */}
        <div className="flex items-center justify-between mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-xs font-semibold text-purple-300">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Studio Planner v1.0</span>
          </div>
          <span className="text-xs text-slate-500 font-mono">RandPPlanner</span>
        </div>

        {/* Title & Tagline */}
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Domine sua rotina no <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">Studio</span>
          </h1>
          <p className="text-sm text-slate-400">
            Conecte seu Google Agenda e Google Notas/Tasks para sincronizar eventos, recorrências e compartilhar no WhatsApp com estilo.
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-3 gap-2 py-4 mb-8 border-y border-slate-800/60 text-center">
          <div className="p-2 rounded-xl bg-slate-800/30 border border-slate-700/20">
            <Calendar className="w-5 h-5 mx-auto text-purple-400 mb-1" />
            <span className="text-[11px] font-medium text-slate-300">Eventos & Repetições</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/30 border border-slate-700/20">
            <CheckSquare className="w-5 h-5 mx-auto text-cyan-400 mb-1" />
            <span className="text-[11px] font-medium text-slate-300">Notas & Tasks</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/30 border border-slate-700/20">
            <Share2 className="w-5 h-5 mx-auto text-emerald-400 mb-1" />
            <span className="text-[11px] font-medium text-slate-300">WhatsApp Link</span>
          </div>
        </div>

        {/* Google Login Action */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="group relative w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-all duration-200 shadow-lg hover:shadow-cyan-500/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 cursor-pointer"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              {/* Google SVG Icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continuar com o Google</span>
              <ArrowRight className="w-4 h-4 ml-auto text-slate-400 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        {/* Footer Note */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Acesso seguro autenticado via Google Cloud OAuth 2.0.
        </p>
      </div>
    </div>
  );
}
