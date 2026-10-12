"use client";

import { useSession, signOut } from "next-auth/react";
import { StudioLogin } from "@/components/StudioLogin";
import { EventPlanner } from "@/components/EventPlanner";
import { NotesAndTasks } from "@/components/NotesAndTasks";
import { Sparkles, LogOut, CalendarCheck } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0d14]">
        <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <StudioLogin />;
  }

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col">
      {/* Navbar Studio Style */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 text-white shadow-md shadow-purple-900/40">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                RandPPlanner
              </span>
              <span className="ml-2 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300">
                Studio
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "Avatar"}
                  width={32}
                  height={32}
                  className="rounded-full ring-2 ring-purple-500/40"
                />
              ) : null}
              <span className="text-xs font-medium text-slate-300 hidden sm:inline">
                {session.user?.name}
              </span>
            </div>

            <button
              onClick={() => signOut()}
              title="Encerrar sessão"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-400 border border-slate-700/60 text-xs font-semibold text-slate-300 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Coluna Principal: Formulário de Eventos */}
          <div className="lg:col-span-7">
            <EventPlanner />
          </div>

          {/* Coluna Lateral: Google Tasks & Notas Rápidas */}
          <div className="lg:col-span-5">
            <NotesAndTasks />
          </div>
        </div>
      </main>
    </div>
  );
}
