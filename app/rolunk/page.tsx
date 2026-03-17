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
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_8%,rgba(13,59,102,0.16),transparent_40%),linear-gradient(180deg,#0d3b66_0%,#0d3b66_34%,#f6f9fc_34%,#ffffff_100%)]" />

      <section className="max-w-6xl mx-auto px-4 pt-10 md:pt-14 pb-8">
        <div className="rounded-3xl border border-white/15 bg-tifo-dark shadow-[0_30px_70px_-40px_rgba(0,0,0,0.65)] p-8 md:p-12 text-center">
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
        <div className="rounded-3xl bg-white border border-gray-200 p-8 md:p-12 shadow-[0_24px_55px_-35px_rgba(13,59,102,0.35)]">
          <p className="text-xs uppercase tracking-[0.2em] text-tifo-dark font-semibold mb-3">Emberek</p>
          <h2 className="text-3xl md:text-4xl font-black text-tifo-dark mb-2">Csapatunk</h2>
          <p className="text-gray-700 mb-8 text-lg leading-[1.58]">Kattints egy kártyára, és megnyílik a részletes bemutatkozás.</p>

          {loading ? (
            <div className="text-gray-500">Betöltés...</div>
          ) : (
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {team.map((member) => (
                <li key={member.id}>
                  <button
                    type="button"
                    onClick={() => openMember(member)}
                    className="w-full text-left rounded-2xl bg-white border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-[#87ceeb]/60 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-tifo-dark text-white font-bold grid place-items-center">
                          {member.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-black">{member.name}</div>
                        <div className="text-sm text-gray-600">{member.role}</div>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {activeMember && (
        <div className="fixed inset-0 z-50 bg-black/60 p-4 flex items-center justify-center" onClick={closeModal}>
          <div
            className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl p-6 md:p-7 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-2xl leading-none"
              onClick={closeModal}
              aria-label="Bezárás"
            >
              &times;
            </button>

            <div className="flex items-start gap-4 mb-5">
              {activeMember.image ? (
                <img
                  src={activeMember.image}
                  alt={activeMember.name}
                  className="w-20 h-20 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-tifo-dark text-white grid place-items-center font-bold text-xl border-2 border-white/30">
                  {memberInitials}
                </div>
              )}
              <div>
                <h3 className="text-2xl font-bold text-black">{activeMember.name}</h3>
                <p className="text-gray-600">{activeMember.role}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-5">
              <button
                type="button"
                onClick={() => navigateMember(-1)}
                disabled={editing || team.length < 2}
                className="text-sm px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-[#87ceeb]/10 hover:border-[#87ceeb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Előző személy
              </button>
              <div className="text-xs text-gray-500">
                {activeIndex >= 0 ? `${activeIndex + 1} / ${team.length}` : ""}
              </div>
              <button
                type="button"
                onClick={() => navigateMember(1)}
                disabled={editing || team.length < 2}
                className="text-sm px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-[#87ceeb]/10 hover:border-[#87ceeb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
      {activeMember.bio?.trim() || "Még nincs megadva bemutatkozás ehhez a személyhez."}
    </p>
    {isAdmin && (
                <button
                  type="button"
                  className="inline-flex items-center gap-2 bg-tifo-green text-white px-5 py-2.5 rounded-full font-semibold hover:bg-[#87ceeb] hover:text-black transition-colors mt-4"
                  onClick={() => setEditing(true)}
                >
        Szerkesztés
      </button>
    )}
  </>
)}

            {editing && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-800">
                  Rövid bemutatkozás
                  <textarea
                    value={draftBio}
                    onChange={(e) => setDraftBio(e.target.value)}
                    className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 min-h-[130px] focus:outline-none focus:ring-2 focus:ring-tifo-green focus:border-tifo-green transition"
                    placeholder="Írj ide egy rövid bemutatkozást..."
                  />
                </label>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Kép feltöltése</label>
                  <div className="flex items-center gap-3 flex-wrap">
                    <label className="cursor-pointer bg-tifo-green text-white px-4 py-2 rounded-xl hover:bg-[#87ceeb] hover:text-black transition-colors">
                      Fájl kiválasztása
                      <input type="file" accept="image/*" onChange={onPickImage} className="hidden" />
                    </label>
                    {draftImage && (
                      <>
                        <img
                          src={draftImage}
                          alt="Előnézet"
                          className="w-16 h-16 rounded-full object-cover border border-slate-300 shadow"
                        />
                        <button
                          type="button"
                          onClick={() => setDraftImage(null)}
                        >
                          Kép törlése
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 bg-tifo-green text-white font-black px-6 py-2.5 rounded-full hover:bg-[#87ceeb] hover:text-black transition-colors mt-4 disabled:opacity-60"
                  onClick={saveMember}
                  disabled={saving}
                >
                  {saving ? "Mentés..." : "Mentés"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </main>
  );
}