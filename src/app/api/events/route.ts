import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { getGoogleOAuthClient } from "@/lib/google";
import { google } from "googleapis";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    // @ts-expect-error token on session
    const accessToken = session?.accessToken;

    if (!session || !accessToken) {
      return NextResponse.json(
        { error: "Não autenticado com o Google" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, description, location, startDate, endDate, recurrence, reminderMinutes } = body;

    if (!title || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Título, data inicial e final são obrigatórios." },
        { status: 400 }
      );
    }

    const auth = getGoogleOAuthClient(accessToken);
    const calendar = google.calendar({ version: "v3", auth });

    // Regra de recorrência RFC5545
    let recurrenceRule: string[] | undefined = undefined;
    if (recurrence && recurrence !== "none") {
      if (recurrence === "daily") recurrenceRule = ["RRULE:FREQ=DAILY"];
      if (recurrence === "weekly") recurrenceRule = ["RRULE:FREQ=WEEKLY"];
      if (recurrence === "monthly") recurrenceRule = ["RRULE:FREQ=MONTHLY"];
    }

    // Alertas/Notificações
    const reminders = reminderMinutes
      ? {
          useDefault: false,
          overrides: [
            { method: "popup", minutes: parseInt(reminderMinutes, 10) },
            { method: "email", minutes: parseInt(reminderMinutes, 10) },
          ],
        }
      : { useDefault: true };

    const event = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: title,
        description: description || "",
        location: location || "",
        start: {
          dateTime: new Date(startDate).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Sao_Paulo",
        },
        end: {
          dateTime: new Date(endDate).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Sao_Paulo",
        },
        recurrence: recurrenceRule,
        reminders,
      },
    });

    return NextResponse.json({
      success: true,
      event: {
        id: event.data.id,
        htmlLink: event.data.htmlLink,
        summary: event.data.summary,
      },
    });
  } catch (error: unknown) {
    console.error("Erro ao criar evento:", error);
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json(
      { error: "Erro ao comunicar com Google Calendar: " + message },
      { status: 500 }
    );
  }
}
