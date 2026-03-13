"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../app/components/AuthProvider";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { loginUser } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    const method = isLogin ? "PUT" : "POST";
    const res = await fetch("/api/auth", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(isLogin ? { email, password } : { name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Hiba történt");
    } else {
      setSuccess(isLogin ? "Sikeres bejelentkezés!" : "Sikeres regisztráció!");
      // Ha bejelentkezés, állítsd be a user-t contextben
      if (isLogin && data.user) {
        loginUser(
          data.user.name,
          data.user.nickname || data.user.name,
          data.user.profileImage || null,
          data.user.email,
          data.user.isAdmin
        );
        setTimeout(() => router.push("/"), 800);
      }
    }
  }

  return (
    <main className="max-w-md mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {isLogin ? "Bejelentkezés" : "Regisztráció"}
      </h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
        {!isLogin && (
          <label>
            Nev
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" required={!isLogin} />
          </label>
        )}
        <label>
          Email
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" required />
        </label>
        <label>
          Jelszó
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" required />
        </label>
        <button type="submit" className="bg-secondary text-white font-semibold px-6 py-2 rounded hover:bg-primary transition">
          {isLogin ? "Bejelentkezés" : "Regisztráció"}
        </button>
        <button type="button" className="text-sm text-gray-500 hover:underline mt-2" onClick={() => setIsLogin(l => !l)}>
          {isLogin ? "Nincs fiókod? Regisztrálj!" : "Van már fiókod? Jelentkezz be!"}
        </button>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
      </form>
    </main>
  );
}
