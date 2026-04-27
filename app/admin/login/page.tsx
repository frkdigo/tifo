"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from '../../../lib/supabaseClient';

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      router.push("/admin");
    }
  }

  return (
    <main className="max-w-md mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Admin bejelentkezés</h1>
      <form className="bg-white rounded-xl shadow p-6 flex flex-col gap-4" onSubmit={handleSubmit}>
        <label>
          Email
          <input type="email" name="email" className="mt-1 w-full border rounded px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>
        <label>
          Jelszó
          <input type="password" name="password" className="mt-1 w-full border rounded px-3 py-2" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>
        <button type="submit" className="bg-black text-white font-semibold px-6 py-2 rounded hover:bg-neutral-800 transition">Bejelentkezés</button>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </form>
      <p className="text-xs text-gray-400 mt-4 text-center">A bejelentkezéshez Supabase Auth lesz használva.</p>
    </main>
  );
}
