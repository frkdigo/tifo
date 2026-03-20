
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type EventItem = {
	id: number;
	title: string;
	date: string;
	description?: string;
	image?: string | null;
	location?: string | null;
};

function renderInlineFormatting(text: string) {
	const parts = text.split(/(\*[^*]+\*)/g);
	return parts.map((part, index) => {
		if (/^\*[^*]+\*$/.test(part)) {
			return (
				<strong key={index} className="font-semibold text-gray-900">
					{part.slice(1, -1)}
				</strong>
			);
		}
		return <span key={index}>{part.replace(/\*/g, "")}</span>;
	});
}

function EventDescription({ text }: { text: string }) {
	const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

	return (
		<div className="space-y-2 text-gray-700">
			{lines.map((line, index) => {
				const bullet = line.match(/^[-*]\s+(.+)$/);
				if (bullet) {
					return (
						<div key={index} className="flex items-start gap-2">
							<span className="mt-1 text-primary">•</span>
							<span>{renderInlineFormatting(bullet[1])}</span>
						</div>
					);
				}
				return <div key={index}>{renderInlineFormatting(line)}</div>;
			})}
		</div>
	);
}

export default function Esemeneink() {
	const [events, setEvents] = useState<EventItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [selected, setSelected] = useState<EventItem | null>(null);
	const [zoomedImage, setZoomedImage] = useState<string | null>(null);

	useEffect(() => {
		fetchEvents();
	}, []);

	function toLocalDay(dateValue: string) {
		if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
			return new Date(`${dateValue}T00:00:00`);
		}
		return new Date(dateValue);
	}

	async function fetchEvents() {
		setLoading(true);
		try {
			const res = await fetch("/api/events", { cache: "force-cache" });
			const data = await res.json();
			setEvents(
				data.sort((a: EventItem, b: EventItem) => toLocalDay(a.date).getTime() - toLocalDay(b.date).getTime())
			);
		} catch {
			setError("Nem sikerült betölteni az eseményeket.");
		}
		setLoading(false);
	}

		const now = new Date();
		const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const upcoming = events.filter((event) => toLocalDay(event.date) >= todayStart);
		const past = events.filter((event) => toLocalDay(event.date) < todayStart).reverse();
		const featured = upcoming[0] || events[0] || null;

			return (
				<motion.main
					className="max-w-7xl mx-auto py-16 px-4 md:px-8 text-black"
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: "easeOut" }}
					style={{ minHeight: '70vh' }}
				>
					<h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-tifo-primary to-tifo-secondary bg-clip-text text-transparent drop-shadow-lg">
						Eseményeink
					</h1>
					{loading ? (
						<div className="text-center text-gray-400 text-lg font-medium animate-pulse">Betöltés...</div>
					) : error ? (
						<div className="text-center text-red-500 text-lg font-semibold">{error}</div>
					) : events.length === 0 ? (
						<div className="text-center text-gray-400 text-lg font-medium">Nincs megjeleníthető esemény.</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
							{events.map((event, idx) => (
								<motion.div
									key={event.id}
									className="relative group bg-white/90 rounded-3xl shadow-xl p-7 flex flex-col gap-3 border border-tifo-primary/10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true, amount: 0.2 }}
									transition={{ duration: 0.5, delay: idx * 0.1 }}
								>
									{/* Dátum badge */}
									<div className="absolute top-5 right-5">
										<span className="inline-block bg-gradient-to-r from-tifo-primary to-tifo-secondary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
											{toLocalDay(event.date).toLocaleDateString('hu-HU', { year: 'numeric', month: 'short', day: 'numeric' })}
										</span>
									</div>
									{/* Cím */}
									<div className="font-bold text-2xl mb-1 text-tifo-primary group-hover:text-tifo-secondary transition-colors duration-200">
										{event.title}
									</div>
									{/* Helyszín */}
									{event.location && (
										<div className="flex items-center gap-1 text-sm text-tifo-secondary font-medium mb-1">
											<svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="inline-block mr-1"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" fill="currentColor"/></svg>
											{event.location}
										</div>
									)}
									{/* Leírás */}
									{event.description && (
										<div className="mt-2 text-gray-700 text-base leading-relaxed">
											<EventDescription text={event.description} />
										</div>
									)}
									{/* Színes háttér animáció */}
									<div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0">
										<div className="absolute -top-10 -left-10 w-40 h-40 bg-tifo-primary/20 rounded-full blur-2xl animate-pulse" />
										<div className="absolute -bottom-10 -right-10 w-40 h-40 bg-tifo-secondary/20 rounded-full blur-2xl animate-pulse" />
									</div>
								</motion.div>
							))}
						</div>
					)}
				</motion.main>
			);
	}
