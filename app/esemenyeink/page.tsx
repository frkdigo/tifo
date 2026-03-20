
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
					className="max-w-6xl mx-auto py-12 px-4 text-black"
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: "easeOut" }}
				>
					<h1 className="text-3xl font-bold mb-8 text-center">Eseményeink</h1>
					{loading ? (
						<div className="text-center text-gray-500">Betöltés...</div>
					) : error ? (
						<div className="text-center text-red-500">{error}</div>
					) : events.length === 0 ? (
						<div className="text-center text-gray-500">Nincs megjeleníthető esemény.</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{events.map((event, idx) => (
								<motion.div
									key={event.id}
									className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-2 border border-gray-100 hover:shadow-lg transition-shadow"
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true, amount: 0.2 }}
									transition={{ duration: 0.5, delay: idx * 0.1 }}
								>
									<div className="text-xs text-gray-400 mb-1">{toLocalDay(event.date).toLocaleDateString()}</div>
									<div className="font-semibold text-lg mb-1">{event.title}</div>
									{event.location && (
										<div className="text-sm text-gray-500 mb-1">📍 {event.location}</div>
									)}
									{event.description && (
										<EventDescription text={event.description} />
									)}
								</motion.div>
							))}
						</div>
					)}
				</motion.main>
			);
	}
