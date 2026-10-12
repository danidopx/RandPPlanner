"use client";

import { useState } from "react";
import { Calendar, Clock, Bell, Repeat, MapPin, Share2, Sparkles, Check, ExternalLink } from "lucide-react";
import confetti from "canvas-confetti";

export function EventPlanner() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [recurrence, setRecurrence] = useState("none");
  const [reminderMinutes, setReminderMinutes] = useState("30");
  const [tag, setTag] = useState("Estudos 📚");

  const [loading, setLoading] = useState(false);
  const [createdEvent, setCreatedEvent] = useState<{
    summary: string;
    htmlLink: string;
    startDate: string;
    recurrenceText: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const tags = [
    { label: "Estudos 📚", color: "from-blue-500 to-indigo-600" },
    { label: "Treino / Esporte ⚽", color: "from-emerald-500 to-green-600" },
    { label: "Rolê / Amigos 🎉", color: "from-pink-500 to-rose-600" },
    { label: "Games / Play 🎮", color: "from-purple-500 to-violet-600" },
    { label: "Foco / Projeto ⚡", color: "from-amber-500 to-orange-600" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setCreatedEvent(null);

    try {
      const fullTitle = `[${tag}] ${title}`;
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: fullTitle,
          description,
          location,
          startDate,
          endDate,
          recurrence,
          reminderMinutes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao criar evento");

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      const recurrenceLabels: Record<string, string> = {
        none: "Único (Sem repetição)",
        daily: "Repete Todos os Dias 🔁",
        weekly: "Repete Toda Semana 🔁",
        monthly: "Repete Todo Mês 🔁",
      };

      setCreatedEvent({
        summary: fullTitle,
        htmlLink: data.event.htmlLink,
        startDate,
        recurrenceText: recurrenceLabels[recurrence] || "Personalizado",
      });
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Falha na sincronização.");
    } finally {
      setLoading(false);
    }
  };

  const getWhatsAppShareUrl = () => {
    if (!createdEvent) return "#";
    const dateFormatted = new Date(createdEvent.startDate).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });

    const msg = `⚡ *Convite / Lembrete: ${createdEvent.summary}*\n` +
      `📅 *Quando:* ${dateFormatted}\n` +
      `🔁 *Frequência:* ${createdEvent.recurrenceText}\n` +
      (location ? `📍 *Local:* ${location}\n` : "") +
      (description ? `📝 *Detalhes:* ${description}\n` : "") +
      `🔗 *Google Agenda:* ${createdEvent.htmlLink}`;

    return `https://wa.me/?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="border border-slate-800 bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Criar Evento no Google Agenda</h2>
          <p className="text-xs text-slate-400">Sincroniza direto na sua conta Google com alertas e repetição</p>
        </div>
      </div>

      {/* Tag Selector */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Categoria</label>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <button
              key={t.label}
              type="button"
              onClick={() => setTag(t.label)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                tag === t.label
                  ? "bg-gradient-to-r text-white shadow-md shadow-purple-900/50 scale-105 " + t.color
                  : "bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700/50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Título da Atividade *</label>
          <input
            type="text"
            required
            placeholder="Ex: Treino de Vôlei, Estudar Matemática..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm"
          />
        </div>

        {/* Date Time Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Início (Data & Hora) *</label>
            <div className="relative">
              <input
                type="datetime-local"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/70 text-white focus:outline-none focus:border-purple-500 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Término (Data & Hora) *</label>
            <input
              type="datetime-local"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/70 text-white focus:outline-none focus:border-purple-500 text-sm"
            />
          </div>
        </div>

        {/* Recurrence & Alerts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
              <Repeat className="w-3.5 h-3.5 text-cyan-400" />
              Repetição (Recorrência)
            </label>
            <select
              value={recurrence}
              onChange={(e) => setRecurrence(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/70 text-white focus:outline-none focus:border-cyan-500 text-sm"
            >
              <option value="none">Apenas uma vez (Sem repetir)</option>
              <option value="daily">Todos os dias (Diário)</option>
              <option value="weekly">Semanal (Mesmo dia da semana)</option>
              <option value="monthly">Mensal (Mesmo dia do mês)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-pink-400" />
              Alerta Antecipado (Push/Email)
            </label>
            <select
              value={reminderMinutes}
              onChange={(e) => setReminderMinutes(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/70 text-white focus:outline-none focus:border-pink-500 text-sm"
            >
              <option value="10">10 minutos antes</option>
              <option value="30">30 minutos antes</option>
              <option value="60">1 hora antes</option>
              <option value="1440">1 dia antes</option>
            </select>
          </div>
        </div>

        {/* Location & Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Local ou Link da Call
            </label>
            <input
              type="text"
              placeholder="Ex: Sala de Aula, Discord, Quadra..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Anotação rápida</label>
            <input
              type="text"
              placeholder="Ex: Levar chuteira / Livro capítulo 3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
            />
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-semibold shadow-lg shadow-purple-900/30 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Salvar no Google Agenda</span>
            </>
          )}
        </button>
      </form>

      {/* Success Card with WhatsApp Share */}
      {createdEvent && (
        <div className="mt-6 p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-2">
            <Check className="w-4 h-4" />
            <span>Evento adicionado com sucesso!</span>
          </div>
          <p className="text-xs text-slate-300 mb-4">{createdEvent.summary}</p>
          <div className="flex flex-wrap gap-3">
            <a
              href={getWhatsAppShareUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all shadow-md shadow-emerald-950/50"
            >
              <Share2 className="w-3.5 h-3.5" />
              Compartilhar no WhatsApp
            </a>
            <a
              href={createdEvent.htmlLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Ver no Google Calendar
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
