"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../components/AuthProvider";
import { uploadImageToStorage } from "../../lib/uploadImageToStorage";

type TeamMember = {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string | null;
  displayOrder: number;
};

export default function Rolunk() {
  const { user } = useAuth();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [activeMember, setActiveMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [draftBio, setDraftBio] = useState("");
  const [draftImage, setDraftImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const values = [
    {
      icon: "🤝",
      title: "Közösségépítés",
      text: "Olyan közeget teremtünk, ahol a fiatalok kapcsolódhatnak, alkothatnak és hatni tudnak a városukra.",
    },
    {
      icon: "🗣️",
      title: "Részvétel",
      text: "A helyi döntésekben valódi teret adunk a fiatalok véleményének, ötleteinek és kezdeményezéseinek.",
    },
    {
      icon: "⚡",
      title: "Lendület",
      text: "Programjaink a modern ifjúsági kultúra ritmusára épülnek: kreatív, nyitott és cselekvő szemléletben.",
    },
  ];

  const isAdmin = !!user?.isAdmin;

  useEffect(() => {
    fetchTeam();
  }, []);

  async function fetchTeam() {
    setLoading(true);
    const res = await fetch("/api/team", { cache: "no-store" });
    const data = await res.json();
    setTeam(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  function openMember(member: TeamMember) {
    setActiveMember(member);
    setDraftBio(member.bio || "");
    setDraftImage(member.image || null);
    setEditing(false);
    setError("");
  }

  function closeModal() {
    setActiveMember(null);
    setEditing(false);
    setDraftBio("");
    setDraftImage(null);
    setError("");
  }

  async function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !activeMember) return;

    setSaving(true);
    setError("");
    try {
      const url = await uploadImageToStorage(file, String(activeMember.id));
      setDraftImage(url);
    } catch (err) {
      setError("Kép feltöltése sikertelen");
    }
    setSaving(false);
  }

  async function saveMember() {
    if (!activeMember || !user?.email) return;

    setSaving(true);
    setError("");

    const res = await fetch("/api/team", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: activeMember.id,
        bio: draftBio,
        image: draftImage,
        actorEmail: user.email,
      }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Nem sikerült menteni.");
      return;
    }

    await fetchTeam();
    setActiveMember(data.member);
    setEditing(false);
  }

  const memberInitials = useMemo(() => {
    if (!activeMember) return "";
    return activeMember.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [activeMember]);

  const activeIndex = useMemo(() => {
    if (!activeMember) return -1;
    return team.findIndex((member) => member.id === activeMember.id);
  }, [team, activeMember]);

  function navigateMember(direction: -1 | 1) {
    if (!activeMember || team.length === 0) return;
    if (editing) return;
    const currentIndex = team.findIndex((member) => member.id === activeMember.id);
    if (currentIndex === -1) return;

    const nextIndex = (currentIndex + direction + team.length) % team.length;
    openMember(team[nextIndex]);
  }

  return (
    <main className="relative overflow-hidden bg-white text-black">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_8%,rgba(15,23,42,0.22),transparent_40%),linear-gradient(180deg,#020617_0%,#020617_34%,#f6f9fc_34%,#ffffff_100%)]" />

      <section className="max-w-6xl mx-auto px-4 pt-10 md:pt-14 pb-8">
        <div className="rounded-3xl border border-white/15 bg-slate-950 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.65)] p-8 md:p-12 text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/15 text-white text-xs tracking-[0.18em] uppercase px-5 py-2.5 mb-6 shadow-lg shadow-black/20">
            Törökbálinti Ifjúsági Önkormányzat
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight text-white">Rólunk</h1>
          <p className="mt-5 text-white/90 text-lg md:text-xl max-w-3xl leading-[1.58] mx-auto">
            Fiatalok által, fiatalokért dolgozunk. A célunk egy olyan aktív, inspiráló közösség, ahol az ötletekből
            valódi helyi változás lesz.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            <div className="rounded-2xl bg-white/10 border border-white/20 text-white p-4 backdrop-blur-sm">
              <div className="text-2xl font-extrabold">2008</div>
              <div className="text-xs text-white/80 uppercase tracking-wide">Alapítás</div>
            </div>
            <div className="rounded-2xl bg-white border border-white/20 shadow-sm p-4">
              <div className="text-2xl font-extrabold text-tifo-dark">50+</div>
              <div className="text-xs text-gray-600 uppercase tracking-wide">Éves esemény</div>
            </div>
            <div className="rounded-2xl bg-white border border-white/20 shadow-sm p-4">
              <div className="text-2xl font-extrabold text-tifo-dark">1000+</div>
              <div className="text-xs text-gray-600 uppercase tracking-wide">Elérés</div>
            </div>
            <div className="rounded-2xl bg-white/15 border border-white/20 text-white p-4 shadow-md">
              <div className="text-2xl font-extrabold">1</div>
              <div className="text-xs text-white/80 uppercase tracking-wide">Küldetés</div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10">
        <p className="section-label">Értékeink</p>
        <h2 className="text-3xl md:text-4xl font-black text-tifo-dark mb-6">Mit képviselünk?</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {values.map((value) => (
            <article
              key={value.title}
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-200 grid place-items-center text-2xl mb-5 group-hover:bg-[#87ceeb]/15 group-hover:border-[#87ceeb]/60 transition-colors">
                {value.icon}
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">{value.title}</h3>
              <p className="text-gray-700 leading-[1.58]">{value.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 p-8 md:p-12 shadow-[0_24px_55px_-35px_rgba(13,59,102,0.35)] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_42%,#f8fff9_100%)]">
          <div className="absolute inset-0 opacity-80 pointer-events-none" aria-hidden="true" style={{ background: 'radial-gradient(circle at 8% 0%, rgba(135,206,235,0.16), transparent 24%), radial-gradient(circle at 92% 12%, rgba(40,167,69,0.12), transparent 22%), radial-gradient(circle at 50% 100%, rgba(13,59,102,0.08), transparent 30%)' }} />
          <div className="relative">
          <p className="text-xs uppercase tracking-[0.2em] text-[#87ceeb] font-semibold mb-3">Emberek</p>
          <h2 className="text-3xl md:text-4xl font-black text-tifo-dark mb-2">Csapatunk</h2>
          <p className="text-gray-700 mb-4 text-lg leading-[1.58] max-w-2xl">Ismerd meg a TIFO mögött álló csapatot. Válassz egy kártyát, és megnyílik a részletes bemutatkozás.</p>
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="inline-flex items-center rounded-full bg-slate-950 text-white text-xs font-semibold px-3 py-1.5 shadow-sm">Közösség</span>
            <span className="inline-flex items-center rounded-full bg-[#87ceeb]/15 text-[#0d3b66] text-xs font-semibold px-3 py-1.5 border border-[#87ceeb]/35">Fiatalok</span>
            <span className="inline-flex items-center rounded-full bg-[#28a745]/15 text-[#1d6c31] text-xs font-semibold px-3 py-1.5 border border-[#28a745]/30">Lendület</span>
          </div>

          {loading ? (
            <div className="text-gray-500">Betöltés...</div>
          ) : (
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
              {team.map((member) => (
                <li key={member.id} className="h-full">
                  <button
                    type="button"
                    onClick={() => openMember(member)}
                    className="group relative w-full h-full text-left rounded-[1.5rem] overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_58%,#f7fff8_100%)] border border-slate-200/90 p-5 md:p-6 shadow-[0_16px_35px_-26px_rgba(15,23,42,0.4)] hover:shadow-[0_24px_45px_-24px_rgba(13,59,102,0.28)] hover:border-[#87ceeb]/70 hover:-translate-y-1 transition-all duration-200"
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(135,206,235,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(40,167,69,0.12),transparent_26%)]" />
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0d3b66] via-[#87ceeb] to-[#28a745] opacity-80" />
                    <div className="flex items-start gap-4 pt-2 h-full relative">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0 transition-transform duration-200 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-slate-950 text-white font-bold grid place-items-center shadow-sm shrink-0 transition-transform duration-200 group-hover:scale-[1.03]">
                          {member.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1 flex flex-col justify-center">
                        <div className="font-semibold text-black text-base md:text-lg leading-tight tracking-tight">{member.name}</div>
                        <div className="mt-1.5 inline-flex w-fit max-w-full items-center rounded-full bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 border border-slate-200 truncate transition-colors duration-200 group-hover:bg-[#87ceeb]/15 group-hover:border-[#87ceeb]/40 group-hover:text-[#0d3b66]">{member.role}</div>
                        <div className="mt-3 text-sm leading-[1.55] text-slate-500 line-clamp-2">
                          {member.bio?.trim() || "Kattints a részletes bemutatkozás megnyitásához."}
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
          </div>
        </div>
      </section>

      {activeMember && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-[3px] p-4 flex items-center justify-center" onClick={closeModal}>
          <div
            className="w-full max-w-2xl rounded-[1.75rem] overflow-hidden bg-white shadow-[0_30px_80px_-35px_rgba(0,0,0,0.55)] border border-slate-200 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1.5 bg-gradient-to-r from-slate-950 via-[#87ceeb] to-[#28a745]" />
            <button
              type="button"
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-2xl leading-none bg-white/90 rounded-full w-10 h-10 flex items-center justify-center shadow-sm border border-slate-200"
              onClick={closeModal}
              aria-label="Bezárás"
            >
              &times;
            </button>

            <div className="p-6 md:p-7">
            <div className="flex items-start gap-4 mb-6">
              {activeMember.image ? (
                <img
                  src={activeMember.image}
                  alt={activeMember.name}
                  className="w-20 h-20 rounded-[1.35rem] object-cover border border-slate-200 shadow-sm"
                />
              ) : (
                <div className="w-20 h-20 rounded-[1.35rem] bg-slate-950 text-white grid place-items-center font-bold text-xl shadow-sm">
                  {memberInitials}
                </div>
              )}
              <div className="min-w-0 pt-1">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#87ceeb] font-semibold mb-2">Csapattag</p>
                <h3 className="text-2xl md:text-[2rem] font-black text-black leading-tight tracking-tight">{activeMember.name}</h3>
                <p className="mt-2 inline-flex items-center rounded-full bg-slate-100 text-slate-700 text-sm font-semibold px-3 py-1.5 border border-slate-200">{activeMember.role}</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <button
                type="button"
                onClick={() => navigateMember(-1)}
                disabled={editing || team.length < 2}
                className="text-sm px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-[#87ceeb]/10 hover:border-[#87ceeb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Előző személy
              </button>
              <div className="text-xs text-gray-500 font-medium">
                {activeIndex >= 0 ? `${activeIndex + 1} / ${team.length}` : ""}
              </div>
              <button
                type="button"
                onClick={() => navigateMember(1)}
                disabled={editing || team.length < 2}
                className="text-sm px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-[#87ceeb]/10 hover:border-[#87ceeb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Következő személy
              </button>
            </div>

            {editing && (
              <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
                Szerkesztés közben a személyváltás ideiglenesen le van tiltva.
              </div>
            )}

{!editing && (
  <>
    <div className="rounded-[1.35rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-5 md:p-6 shadow-[0_14px_35px_-26px_rgba(15,23,42,0.22)]">
    <p className="text-gray-700 leading-[1.65] whitespace-pre-line text-[15px] md:text-base">
      {activeMember.bio?.trim() || "Még nincs megadva bemutatkozás ehhez a személyhez."}
    </p>
    </div>
    {isAdmin && (
                <button
                  type="button"
                  className="inline-flex items-center gap-2 bg-[#28a745] text-white px-5 py-2.5 rounded-full font-semibold hover:bg-[#87ceeb] hover:text-black transition-colors mt-4 shadow-sm"
                  onClick={() => setEditing(true)}
                >
        Szerkesztés
      </button>
    )}
  </>
)}

            {editing && (
              <div className="space-y-4 rounded-[1.35rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-5 md:p-6 shadow-[0_14px_35px_-26px_rgba(15,23,42,0.22)]">
                <label className="block text-sm font-medium text-gray-800">
                  Rövid bemutatkozás
                  <textarea
                    value={draftBio}
                    onChange={(e) => setDraftBio(e.target.value)}
                    className="mt-1.5 w-full border border-gray-200 rounded-2xl px-4 py-3 min-h-[160px] leading-[1.58] focus:outline-none focus:ring-2 focus:ring-[#28a745] focus:border-[#28a745] transition"
                    placeholder="Írj ide egy rövid bemutatkozást..."
                  />
                </label>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Kép feltöltése</label>
                  <div className="flex items-center gap-3 flex-wrap">
                    <label className="cursor-pointer bg-[#28a745] text-white px-4 py-2.5 rounded-full font-semibold hover:bg-[#87ceeb] hover:text-black transition-colors shadow-sm">
                      Fájl kiválasztása
                      <input type="file" accept="image/*" onChange={onPickImage} className="hidden" />
                    </label>
                    {draftImage && (
                      <>
                        <img
                          src={draftImage}
                          alt="Előnézet"
                          className="w-16 h-16 rounded-2xl object-cover border border-slate-300 shadow"
                        />
                        <button
                          type="button"
                          onClick={() => setDraftImage(null)}
                          className="text-sm text-slate-600 hover:text-black underline underline-offset-4"
                        >
                          Kép törlése
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 bg-[#28a745] text-white font-black px-6 py-3 rounded-full hover:bg-[#87ceeb] hover:text-black transition-colors mt-2 disabled:opacity-60 shadow-sm"
                  onClick={saveMember}
                  disabled={saving}
                >
                  {saving ? "Mentés..." : "Mentés"}
                </button>
              </div>
            )}
            </div>
          </div>
        </div>
      )}

    </main>
  );
}