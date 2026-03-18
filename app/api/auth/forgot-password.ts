import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendMail } from "../../../lib/sendMail";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function POST(req: NextRequest) {
  const { name, email } = await req.json();
  if (!name || !email) {
    return NextResponse.json({ error: "Név és email szükséges" }, { status: 400 });
  }

  // Ellenőrizd, hogy létezik-e user
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("name", name)
    .eq("email", email)
    .single();

  if (userError || !user) {
    return NextResponse.json({ error: "Nincs ilyen felhasználó" }, { status: 404 });
  }

  // Generálj token-t
  const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 perc

  // Mentsd el a token-t
  await supabase
    .from("password_reset_tokens")
    .insert([{ user_id: user.id, token, expires_at: expires }]);

  // Küldj emailt
  const resetUrl = `https://tifo.hu/auth/reset-password?token=${token}`;
  try {
    await sendMail(email, resetUrl);
  } catch (mailErr) {
    return NextResponse.json({ error: "Email küldése sikertelen" }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
