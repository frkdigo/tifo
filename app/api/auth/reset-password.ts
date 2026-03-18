import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();
  if (!token || !password) {
    return NextResponse.json({ error: "Token és jelszó szükséges" }, { status: 400 });
  }

  // Token ellenőrzése
  const { data: tokenRow, error: tokenError } = await supabase
    .from("password_reset_tokens")
    .select("user_id, expires_at")
    .eq("token", token)
    .single();

  if (tokenError || !tokenRow) {
    return NextResponse.json({ error: "Érvénytelen vagy lejárt token" }, { status: 400 });
  }

  if (new Date(tokenRow.expires_at) < new Date()) {
    return NextResponse.json({ error: "Token lejárt" }, { status: 400 });
  }

  // Jelszó frissítése
  const { error: updateError } = await supabase
    .from("users")
    .update({ password })
    .eq("id", tokenRow.user_id);

  if (updateError) {
    return NextResponse.json({ error: "Jelszó frissítése sikertelen" }, { status: 500 });
  }

  // Token törlése
  await supabase
    .from("password_reset_tokens")
    .delete()
    .eq("token", token);

  return NextResponse.json({ success: true });
}
