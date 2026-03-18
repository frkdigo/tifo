"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthProvider";

export default function AuthPage() {
	const [isLogin, setIsLogin] = useState(true);
	const [showForgot, setShowForgot] = useState(false);
	const [forgotName, setForgotName] = useState("");
	const [forgotEmail, setForgotEmail] = useState("");
	const [forgotSuccess, setForgotSuccess] = useState("");
	const [forgotError, setForgotError] = useState("");
	const [forgotSubmitting, setForgotSubmitting] = useState(false);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const { user, loginUser } = useAuth();
	const [rememberMe, setRememberMe] = useState(true);
	const router = useRouter();
	useEffect(() => {
		if (user) {
			router.replace("/");
		}
	}, [user, router]);

	async function handleForgotSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (forgotSubmitting) return;
		setForgotSubmitting(true);
		setForgotError("");
		setForgotSuccess("");
		try {
			const res = await fetch("/api/auth/forgot-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: forgotName, email: forgotEmail }),
			});
			const data = await res.json();
			if (!res.ok) {
				setForgotError(data?.error || "Hiba történt");
			} else {
				setForgotSuccess("Jelszó-visszaállító email elküldve!");
			}
		} catch (err) {
			setForgotError("Hálózati vagy szerver hiba");
		} finally {
			setForgotSubmitting(false);
		}
	}
	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (submitting) return;
		setSubmitting(true);
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
				if (data.user) {
					const profileImage = data.user.profileImage ?? data.user.profileimage ?? null;
					loginUser(
						data.user.name,
						data.user.nickname || data.user.name,
						profileImage,
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
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<main className="flex-grow flex flex-col items-center justify-center">
			<div className="max-w-md w-full py-12 px-4">
				{showForgot ? (
					<>
						<h1 className="text-2xl font-bold mb-6 text-center">Elfelejtett jelszó</h1>
						<form onSubmit={handleForgotSubmit} className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
							<label>
								Név
								<input type="text" value={forgotName} onChange={e => setForgotName(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" required />
							</label>
							<label>
								Email
								<input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" required />
							</label>
							{forgotError && <div className="text-red-600 text-sm">{forgotError}</div>}
							{forgotSuccess && <div className="text-green-600 text-sm">{forgotSuccess}</div>}
							<button
								type="submit"
								disabled={forgotSubmitting}
								className="bg-blue-700 text-white rounded px-4 py-2 font-semibold transition-all duration-150 active:scale-95 active:brightness-90 disabled:opacity-70 disabled:cursor-not-allowed"
							>
								{forgotSubmitting ? "Folyamatban..." : "Jelszó-visszaállító email küldése"}
							</button>
						</form>
						<button
							className="mt-4 text-sm text-slate-700 underline"
							onClick={() => setShowForgot(false)}
						>
							Vissza a bejelentkezéshez
						</button>
					</>
				) : (
					<>
						<h1 className="text-2xl font-bold mb-6 text-center">
							{isLogin ? "Bejelentkezés" : "Regisztráció"}
						</h1>
						<form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
							{!isLogin && (
								<label>
									Név
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
							<button
								type="submit"
								disabled={submitting}
								className="bg-slate-900 text-white rounded px-4 py-2 font-semibold transition-all duration-150 active:scale-95 active:brightness-90 disabled:opacity-70 disabled:cursor-not-allowed"
							>
								{submitting ? "Folyamatban..." : isLogin ? "Bejelentkezés" : "Regisztráció"}
							</button>
						</form>
						<button
							className="mt-4 text-sm text-slate-700 underline"
							onClick={() => setIsLogin((v) => !v)}
						>
							{isLogin ? "Nincs még fiókod? Regisztrálj!" : "Van már fiókod? Jelentkezz be!"}
						</button>
						<button
							className="mt-2 text-sm text-blue-700 underline"
							onClick={() => setShowForgot(true)}
						>
							Elfelejtett jelszó
						</button>
					</>
				)}
			</div>
		</main>
	);
													<h1 className="text-2xl font-bold mb-6 text-center">Elfelejtett jelszó</h1>
													<form onSubmit={handleForgotSubmit} className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
														<label>
															Név
															<input type="text" value={forgotName} onChange={e => setForgotName(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" required />
														</label>
														<label>
															Email
															<input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" required />
														</label>
														{forgotError && <div className="text-red-600 text-sm">{forgotError}</div>}
														{forgotSuccess && <div className="text-green-600 text-sm">{forgotSuccess}</div>}
														<button
															type="submit"
															disabled={forgotSubmitting}
															className="bg-blue-700 text-white rounded px-4 py-2 font-semibold transition-all duration-150 active:scale-95 active:brightness-90 disabled:opacity-70 disabled:cursor-not-allowed"
														>
															{forgotSubmitting ? "Folyamatban..." : "Jelszó-visszaállító email küldése"}
														</button>
													</form>
													<button
														className="mt-4 text-sm text-slate-700 underline"
														onClick={() => setShowForgot(false)}
													>
														Vissza a bejelentkezéshez
													</button>
												</>
											)}
										</div>
									</main>
								}
