"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!password || !password2) {
      setError("Minden mező kötelező");
      return;
    }
    if (password !== password2) {
      setError("A jelszavak nem egyeznek");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Hiba történt");
      } else {
        setSuccess("Jelszó sikeresen frissítve!");
        setTimeout(() => router.push("/auth"), 1500);
      }
    } catch (err) {
      setError("Hálózati vagy szerver hiba");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex-grow flex flex-col items-center justify-center">
      <div className="max-w-md w-full py-12 px-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Új jelszó beállítása</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
          <label>
            Új jelszó
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" required />
          </label>
          <label>
            Jelszó még egyszer
            <input type="password" value={password2} onChange={e => setPassword2(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" required />
          </label>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-700 text-white rounded px-4 py-2 font-semibold transition-all duration-150 active:scale-95 active:brightness-90 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {submitting ? "Folyamatban..." : "Jelszó frissítése"}
          </button>
        </form>
      </div>
    </main>
  );
}
