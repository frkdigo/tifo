"use client";
import { useEffect, useState } from "react";

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
		<div className="space-y-3 text-slate-700 text-[17px] leading-8 md:text-base md:leading-7">
			{lines.map((line, index) => {
				const bullet = line.match(/^[-*]\s+(.+)$/);
				if (bullet) {
					return (
						<div key={index} className="flex items-start gap-2.5">
							<span className="mt-[9px] text-slate-500 text-sm">•</span>
							<span>{renderInlineFormatting(bullet[1])}</span>
						</div>
					);
				}
				return <p key={index} className="text-balance">{renderInlineFormatting(line)}</p>;
			})}
		</div>
	);
}

function EventModal({ event, onClose }: { event: any; onClose: () => void }) {
	useEffect(() => {
		const scrollY = window.scrollY;
		const originalOverflow = document.body.style.overflow;
		const originalPosition = document.body.style.position;
		const originalTop = document.body.style.top;
		const originalWidth = document.body.style.width;

		// Lock body scroll (iOS-safe) while the modal is open.
		document.body.style.overflow = "hidden";
		document.body.style.position = "fixed";
		document.body.style.top = `-${scrollY}px`;
		document.body.style.width = "100%";

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		};

		window.addEventListener("keydown", onKeyDown);

		return () => {
			window.removeEventListener("keydown", onKeyDown);
			document.body.style.overflow = originalOverflow;
			document.body.style.position = originalPosition;
			document.body.style.top = originalTop;
			document.body.style.width = originalWidth;
			window.scrollTo(0, scrollY);
		};
	}, [onClose]);

	return (
		<div className="fixed inset-0 z-[220] bg-slate-950/45 backdrop-blur-[2px] md:flex md:items-center md:justify-center md:p-4" onClick={onClose}>
			<div
				className="absolute inset-x-0 bottom-0 md:static bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-2xl h-[92dvh] md:h-auto md:max-h-[88vh] overflow-hidden flex flex-col"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-100 px-4 pt-3 pb-3 md:px-5 md:pt-4 md:pb-4">
					<div className="w-10 h-1.5 rounded-full bg-slate-300 mx-auto mb-3 md:hidden" />
					<div className="flex items-start justify-between gap-3">
						<div>
							<h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">{event.title}</h2>
							<div className="mt-2 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-600">
								<span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 font-semibold">
									{new Date(event.date).toLocaleDateString("hu-HU")}
								</span>
								{event.location && (
									<span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-1 font-semibold">
										{event.location}
									</span>
								)}
							</div>
						</div>
						<button
							className="shrink-0 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-2xl leading-none"
							onClick={onClose}
							aria-label="Bezárás"
						>
							&times;
						</button>
					</div>
				</div>

				<div className="overflow-y-auto px-4 pb-7 pt-4 md:px-5 md:pb-7 space-y-4">
					{event.image && (
						<button
							type="button"
							onClick={() => setZoomedImage(event.image || null)}
							className="block w-full"
							aria-label="Kép nagyítása"
						>
							<img
								src={event.image}
								alt={event.title}
								className="w-full h-48 md:h-64 object-cover rounded-2xl border border-slate-100"
							/>
						</button>
					)}
					<div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 md:p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
						<EventDescription text={event.description || ""} />
					</div>
				</div>
			</div>
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
		<main className="max-w-6xl mx-auto py-12 px-4">
			<section className="premium-surface rounded-3xl p-6 md:p-8 mb-8">
				<div className="flex flex-wrap items-end justify-between gap-4">
					<div>
						<p className="text-xs uppercase tracking-[0.18em] text-slate-500 mb-2">Programok</p>
						<h1 className="text-3xl md:text-5xl font-black text-slate-900">Eseményeink</h1>
						<p className="mt-2 text-slate-600 max-w-2xl">
							Kövesd a közelgő programokat, nézd vissza a korábbi eseményeket, és csatlakozz a közösséghez.
						</p>
					</div>

					<div className="grid grid-cols-2 gap-2 text-sm">
						<div className="rounded-xl bg-slate-900 text-white px-4 py-3 min-w-[120px]">
							<div className="text-xl font-bold">{upcoming.length}</div>
							<div className="text-slate-300 text-xs">Közelgő</div>
						</div>
						<div className="rounded-xl border border-slate-200 bg-white px-4 py-3 min-w-[120px]">
							<div className="text-xl font-bold text-slate-900">{past.length}</div>
							<div className="text-slate-500 text-xs">Korábbi</div>
						</div>
					</div>
				</div>
			</section>

			{loading ? (
				<div className="text-center">Betöltés...</div>
			) : error ? (
				<div className="text-red-500 text-center">{error}</div>
			) : events.length === 0 ? (
				<div className="text-center text-gray-500">Jelenleg nincsenek események.</div>
			) : (
				<div className="space-y-8">
					{featured && (
						<section className="rounded-3xl overflow-hidden shadow-[0_24px_55px_-30px_rgba(15,23,42,0.55)] border border-slate-200 bg-white">
							<div className="grid md:grid-cols-[1.2fr,0.8fr]">
								<div className="relative min-h-[260px] md:min-h-[320px]">
									{featured.image ? (
										<button
											type="button"
											onClick={() => setZoomedImage(featured.image || null)}
											className="absolute inset-0 block w-full h-full"
											aria-label="Kép nagyítása"
										>
											<img src={featured.image} alt={featured.title} className="absolute inset-0 w-full h-full object-cover" decoding="async" fetchPriority="high" />
										</button>
									) : (
										<div className="absolute inset-0 bg-slate-900" />
									)}
									<div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent" />
									<div className="absolute bottom-0 left-0 right-0 p-6 md:p-7 text-white">
										<p className="text-xs uppercase tracking-[0.16em] text-sky-200 mb-2">Kiemelt esemény</p>
										<h2 className="text-2xl md:text-3xl font-black mb-2">{featured.title}</h2>
										<p className="text-sm text-slate-200">{new Date(featured.date).toLocaleDateString("hu-HU")}</p>
									</div>
								</div>

								<div className="p-6 flex flex-col justify-between">
									<p className="text-slate-700 leading-relaxed line-clamp-6">{featured.description || "Részletek hamarosan..."}</p>
									<div className="mt-4">
										{featured.location && <p className="text-xs text-slate-500 mb-3">Helyszín: {featured.location}</p>}
										<button
											className="w-full bg-slate-900 text-white py-2.5 rounded-lg hover:bg-slate-800 transition-colors font-semibold"
											onClick={() => setSelected(featured)}
										>
											Részletek megnyitása
										</button>
									</div>
								</div>
							</div>
						</section>
					)}

					<section>
						<h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">Közelgő események</h3>
						{upcoming.length === 0 ? (
							<div className="text-gray-500">Jelenleg nincs közelgő esemény.</div>
						) : (
							<div className="grid md:grid-cols-2 gap-4">
								{upcoming.map((event) => (
									<article key={event.id} className="premium-surface rounded-2xl overflow-hidden flex flex-col h-[360px]">
										{event.image && (
											<button
												type="button"
												onClick={() => setZoomedImage(event.image || null)}
												className="block w-full"
												aria-label="Kép nagyítása"
											>
												<img src={event.image} alt={event.title} className="w-full h-40 object-cover" loading="lazy" decoding="async" />
											</button>
										)}
										<div className="p-4 flex-1 min-h-0 flex flex-col">
											<div className="relative flex-1 min-h-0 overflow-hidden">
												<h4 className="font-bold text-lg text-slate-900 mb-1">{event.title}</h4>
												<p className="text-sm text-slate-500 mb-2">{new Date(event.date).toLocaleDateString("hu-HU")}</p>
												<p className="text-slate-700 text-sm whitespace-pre-line">{event.description || "Részletek hamarosan..."}</p>
												{event.location && <p className="text-xs text-slate-500 mt-2">Helyszín: {event.location}</p>}
												<div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent" />
											</div>
											<button
												className="mt-3 w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 transition-colors font-semibold shrink-0"
												onClick={() => setSelected(event)}
											>
												Érdekel
											</button>
										</div>
									</article>
								))}
							</div>
						)}
					</section>

					<section>
						<h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">Korábbi események</h3>
						{past.length === 0 ? (
							<div className="text-gray-500">Még nincsenek korábbi események.</div>
						) : (
							<div className="space-y-3">
								{past.slice(0, 6).map((event) => (
									<div key={event.id} className="rounded-xl border border-slate-200 bg-white px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
										<div>
											<div className="font-semibold text-slate-900">{event.title}</div>
											<div className="text-xs text-slate-500">{new Date(event.date).toLocaleDateString("hu-HU")}</div>
										</div>
										<button
											className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors"
											onClick={() => setSelected(event)}
										>
											Megnézem
										</button>
									</div>
								))}
							</div>
						)}
					</section>
				</div>
			)}

			{selected && <EventModal event={selected} onClose={() => setSelected(null)} />}
			{zoomedImage && (
				<div className="fixed inset-0 z-[260] bg-black/85 p-4 flex items-center justify-center" onClick={() => setZoomedImage(null)}>
					<button
						type="button"
						onClick={() => setZoomedImage(null)}
						className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white text-3xl leading-none"
						aria-label="Kép bezárása"
					>
						&times;
					</button>
					<img
						src={zoomedImage}
						alt="Nagyított eseménykép"
						className="max-w-full max-h-[88dvh] rounded-2xl shadow-2xl"
						onClick={(e) => e.stopPropagation()}
					/>
				</div>
			)}
		</main>
	);
}
