"use client";

import { useEffect, useState } from "react";
import { CheckSquare, Plus, Check, Loader2, StickyNote, Share2 } from "lucide-react";

interface TaskItem {
  id: string;
  title: string;
  notes?: string;
  status?: string;
}

export function NotesAndTasks() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newNote, setNewNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      if (data.tasks) {
        setTasks(data.tasks);
      }
    } catch (e) {
      console.error("Erro ao carregar tasks", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, notes: newNote }),
      });
      const data = await res.json();
      if (res.ok && data.task) {
        setTasks((prev) => [data.task, ...prev]);
        setNewTitle("");
        setNewNote("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const shareNoteWhatsApp = (task: TaskItem) => {
    const text = `📌 *Nota/Tarefa:* ${task.title}\n` + (task.notes ? `📝 *Detalhes:* ${task.notes}\n` : "") + `⚡ via RandPPlanner`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="border border-slate-800 bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 lg:p-8 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <StickyNote className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Notas Rápidas & Tasks</h2>
            <p className="text-xs text-slate-400">Sincronizado com o ecossistema Google Tasks</p>
          </div>
        </div>
      </div>

      {/* Form de nova nota/tarefa */}
      <form onSubmit={handleAddTask} className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Título da nota ou lembrete..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
        />
        <input
          type="text"
          placeholder="Detalhes opcionais..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="w-full px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
        />
        <button
          type="submit"
          disabled={submitting || !newTitle.trim()}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          <span>Adicionar Nota / Task</span>
        </button>
      </form>

      {/* Lista de notas */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[380px]">
        {loading ? (
          <div className="flex items-center justify-center py-10 text-slate-500 text-xs gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Carregando notas...
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs">
            Nenhuma nota cadastrada. Adicione uma acima!
          </div>
        ) : (
          tasks.map((t) => (
            <div
              key={t.id}
              className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/40 hover:border-cyan-500/30 transition-all flex items-start justify-between gap-3 group"
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 w-4 h-4 rounded border border-cyan-500/50 flex items-center justify-center text-cyan-400">
                  {t.status === "completed" && <Check className="w-3 h-3" />}
                </div>
                <div>
                  <p className={`text-xs font-semibold ${t.status === "completed" ? "line-through text-slate-500" : "text-slate-200"}`}>
                    {t.title}
                  </p>
                  {t.notes && <p className="text-[11px] text-slate-400 mt-0.5">{t.notes}</p>}
                </div>
              </div>
              <button
                type="button"
                onClick={() => shareNoteWhatsApp(t)}
                title="Compartilhar no WhatsApp"
                className="opacity-60 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-slate-700 text-emerald-400 transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
