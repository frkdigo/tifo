"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../app/components/AuthProvider";

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
      title: "Közösségépítés",
      text: "Olyan közeget teremtünk, ahol a fiatalok kapcsolódhatnak, alkothatnak és hatni tudnak a városukra.",
    },
    {
      title: "Részvétel",
      text: "A helyi döntésekben valódi teret adunk a fiatalok véleményének, ötleteinek és kezdeményezéseinek.",
    },
    {
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
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setDraftImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
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

    const updated: TeamMember = data.member;
    setTeam((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    setActiveMember(updated);
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
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-white" />

      <section className="max-w-6xl mx-auto px-4 pt-12 pb-8">
        <div className="rounded-3xl border border-white/70 bg-white/80 backdrop-blur-md shadow-[0_20px_60px_-30px_rgba(15,23,42,0.45)] p-8 md:p-12">
          <p className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-sky-200 text-xs tracking-[0.18em] uppercase px-4 py-2 mb-6">
            Törökbálinti Ifjúsági Önkormányzat
          </p>
          <h1 className="text-4xl md:text-6xl font-black leading-tight text-slate-900">Rólunk</h1>
          <p className="mt-5 text-slate-700 text-lg md:text-xl max-w-3xl leading-relaxed">
            Fiatalok által, fiatalokért dolgozunk. A célunk egy olyan aktív, inspiráló közösség, ahol az ötletekből
            valódi helyi változás lesz.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            <div className="rounded-2xl bg-slate-900 text-white p-4">
              <div className="text-2xl font-extrabold">2008</div>
              <div className="text-xs text-slate-300 uppercase tracking-wide">Alapítás</div>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-4">
              <div className="text-2xl font-extrabold text-slate-900">50+</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">Éves esemény</div>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-4">
              <div className="text-2xl font-extrabold text-slate-900">1000+</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">Elérés</div>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-4">
              <div className="text-2xl font-extrabold text-slate-900">1</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">Küldetés</div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Mit képviselünk?</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {values.map((value) => (
            <article
              key={value.title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-sky-300 grid place-items-center font-bold text-sm mb-4">
                {value.title.slice(0, 2).toUpperCase()}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{value.title}</h3>
              <p className="text-slate-600 leading-relaxed">{value.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="rounded-3xl bg-slate-950 text-slate-100 p-8 md:p-10 shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Csapatunk</h2>
          <p className="text-slate-300 mb-6">Kattints egy kártyára, és megnyílik a részletes bemutatkozás.</p>

          {loading ? (
            <div className="text-slate-300">Betöltés...</div>
          ) : (
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {team.map((member) => (
                <li key={member.id}>
                  <button
                    type="button"
                    onClick={() => openMember(member)}
                    className="w-full text-left rounded-2xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-sky-300 text-slate-950 font-bold grid place-items-center">
                        {member.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold">{member.name}</div>
                        <div className="text-sm text-slate-300">{member.role}</div>
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
                  className="w-28 h-28 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-slate-900 text-sky-300 grid place-items-center font-bold text-2xl">
                  {memberInitials}
                </div>
              )}
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{activeMember.name}</h3>
                <p className="text-slate-500">{activeMember.role}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-5">
              <button
                type="button"
                onClick={() => navigateMember(-1)}
                disabled={editing || team.length < 2}
                className="text-sm px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Előző személy
              </button>
              <div className="text-xs text-slate-500">
                {activeIndex >= 0 ? `${activeIndex + 1} / ${team.length}` : ""}
              </div>
              <button
                type="button"
                onClick={() => navigateMember(1)}
                disabled={editing || team.length < 2}
                className="text-sm px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                {activeMember.bio?.trim() || "Még nincs megadva bemutatkozás ehhez a személyhez."}
              </p>
            )}

            {editing && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">
                  Rövid bemutatkozás
                  <textarea
                    value={draftBio}
                    onChange={(e) => setDraftBio(e.target.value)}
                    className="mt-1 w-full border border-slate-300 rounded-xl px-3 py-2 min-h-[130px]"
                    placeholder="Írj ide egy rövid bemutatkozást..."
                  />
                </label>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Kép feltöltése</label>
                  <div className="flex items-center gap-3 flex-wrap">
                    <label className="cursor-pointer bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors">
                      Fájl kiválasztása
                      <input type="file" accept="image/*" onChange={onPickImage} className="hidden" />
                    </label>
                    {draftImage && (
                      <button
                        type="button"
                        onClick={() => setDraftImage(null)}
                        className="text-sm text-slate-600 hover:text-slate-900"
                      >
                        Kép törlése
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {error && <div className="text-red-600 text-sm mt-4">{error}</div>}

            <div className="mt-6 flex items-center gap-3">
              {isAdmin && !editing && (
                <button
                  type="button"
                  className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                  onClick={() => setEditing(true)}
                >
                  Szerkesztés
                </button>
              )}

              {isAdmin && editing && (
                <>
                  <button
                    type="button"
                    onClick={saveMember}
                    disabled={saving}
                    className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-60"
                  >
                    {saving ? "Mentés..." : "Mentés"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setDraftBio(activeMember.bio || "");
                      setDraftImage(activeMember.image || null);
                    }}
                    className="text-slate-600 hover:text-slate-900"
                  >
                    Mégse
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
