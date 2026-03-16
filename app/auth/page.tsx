"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthProvider";

export default function AuthPage() {
	const [isLogin, setIsLogin] = useState(true);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const { user, loginUser } = useAuth();
	const [rememberMe, setRememberMe] = useState(true);
	const router = useRouter();
	// Ha már be van jelentkezve, azonnal dobja át a főoldalra
	useEffect(() => {
		if (user) {
			router.replace("/");
		}
	}, [user, router]);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		setSuccess("");
		const method = isLogin ? "PUT" : "POST";
		try {
			const res = await fetch("/api/auth", {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(isLogin ? { email, password } : { name, email, password }),
			});
			let data = null;
			try {
				data = await res.json();
			} catch (jsonErr) {
				setError("Hibás válasz az API-tól");
				console.error("JSON parse error:", jsonErr);
				return;
			}
			if (!res.ok) {
				setError(data?.error || "Hiba történt");
				console.error("API error:", data);
			} else {
				setSuccess(isLogin ? "Sikeres bejelentkezés!" : "Sikeres regisztráció!");
				// Bejelentkezés vagy regisztráció után is jelentkeztesse be a user-t
				if (data.user) {
					loginUser(
						data.user.name,
						data.user.nickname || data.user.name,
						data.user.profileimage || null,
						data.user.email,
						data.user.isadmin,
						rememberMe
					);
					setTimeout(() => router.push("/"), 800);
				} else {
					setError("Sikertelen bejelentkezés/regisztráció: nincs user adat");
					console.error("Nincs user a válaszban:", data);
				}
			}
		} catch (err) {
			setError("Hálózati vagy szerver hiba");
			console.error("Fetch error:", err);
		}
	}

	return (
		<div className="flex flex-col flex-1 min-h-screen justify-center">
			<main className="max-w-md mx-auto py-12 px-4 flex-1 flex flex-col justify-center">
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
					{isLogin && (
						<label className="flex items-center gap-2 select-none">
							<input
								type="checkbox"
								checked={rememberMe}
								onChange={e => setRememberMe(e.target.checked)}
								className="accent-primary"
							/>
							Emlékezz rám
						</label>
					)}
					{error && <div className="text-red-600 text-sm">{error}</div>}
					{success && <div className="text-green-600 text-sm">{success}</div>}
					<button type="submit" className="bg-slate-900 text-white rounded px-4 py-2 font-semibold">
						{isLogin ? "Bejelentkezés" : "Regisztráció"}
					</button>
				</form>
				<button
					className="mt-4 text-sm text-slate-700 underline"
					onClick={() => setIsLogin((v) => !v)}
				>
					{isLogin ? "Nincs még fiókod? Regisztrálj!" : "Van már fiókod? Jelentkezz be!"}
				</button>
			</main>
		</div>
	);
}
