import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { getGoogleOAuthClient } from "@/lib/google";
import { google } from "googleapis";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    // @ts-expect-error token on session
    const accessToken = session?.accessToken;

    if (!session || !accessToken) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const auth = getGoogleOAuthClient(accessToken);
    const tasks = google.tasks({ version: "v1", auth });

    // Pega listas de tarefas
    const tasklists = await tasks.tasklists.list({ maxResults: 1 });
    const primaryListId = tasklists.data.items?.[0]?.id || "@default";

    const res = await tasks.tasks.list({
      tasklist: primaryListId,
      showCompleted: true,
      maxResults: 20,
    });

    return NextResponse.json({
      tasks: res.data.items || [],
      listId: primaryListId,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json(
      { error: "Erro ao buscar tarefas: " + message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    // @ts-expect-error token on session
    const accessToken = session?.accessToken;

    if (!session || !accessToken) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const body = await req.json();
    const { title, notes, due } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Título da nota/tarefa é obrigatório." },
        { status: 400 }
      );
    }

    const auth = getGoogleOAuthClient(accessToken);
    const tasks = google.tasks({ version: "v1", auth });

    const task = await tasks.tasks.insert({
      tasklist: "@default",
      requestBody: {
        title,
        notes: notes || "",
        due: due ? new Date(due).toISOString() : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      task: task.data,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json(
      { error: "Erro ao salvar nota/tarefa: " + message },
      { status: 500 }
    );
  }
}
