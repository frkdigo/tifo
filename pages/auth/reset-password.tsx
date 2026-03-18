
import { useState } from "react";
import { useRouter } from "next/router";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;

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

    if (!token || typeof token !== "string") {
      setError("Hiányzó vagy érvénytelen token");
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
    <main className="flex-grow flex flex-col items-center justify-center bg-site min-h-screen">
      <div className="w-full flex flex-col items-center">
        <div className="max-w-md w-full mt-8 mb-4 flex flex-col items-center">
          <img src="/images/logo.jpg" alt="TIFO logó" className="h-14 w-14 rounded-full shadow-md mb-2" />
          <div className="text-xs uppercase tracking-[0.2em] text-sky-400 font-bold mb-1">TIFO</div>
          <div className="text-base font-black text-slate-900 mb-2 text-center">Törökbálinti Ifjúsági Önkormányzat</div>
        </div>
        <div className="max-w-md w-full">
          <div className="premium-surface rounded-2xl shadow-xl p-8 border border-slate-200">
            <h1 className="text-2xl font-black mb-6 text-center text-slate-900 drop-shadow-sm tracking-tight">
              Új jelszó beállítása
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <label className="text-sm font-semibold text-slate-700">
                Új jelszó
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-tifo-green focus:border-tifo-green transition bg-white"
                  required
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Új jelszó megerősítése
                <input
                  type="password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-tifo-green focus:border-tifo-green transition bg-white"
                  required
                />
              </label>
              {error && <div className="text-red-600 text-sm font-semibold">{error}</div>}
              {success && <div className="text-green-600 text-sm font-semibold">{success}</div>}
              <button
                type="submit"
                disabled={submitting}
                className="bg-sky-500 hover:bg-sky-600 text-white rounded-full px-6 py-2 font-bold text-base shadow-md transition-all duration-150 active:scale-95 active:brightness-90 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitting ? "Folyamatban..." : "Jelszó frissítése"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
