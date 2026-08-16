"use client";

import { FormEvent, useMemo, useState } from "react";

type Result = {
  username: string;
  films: number;
  group: number;
  name: string;
  emoji: string;
  min: number;
  max: number | null;
  description: string;
};

const GROUPS = [
  { min: 0, max: 50, name: "Casual Watcher", emoji: "🍿", description: "Baru mulai mengumpulkan perjalanan sinematik." },
  { min: 51, max: 100, name: "Movie Enjoyer", emoji: "🎬", description: "Film sudah mulai jadi bagian dari rutinitas." },
  { min: 101, max: 250, name: "Serious Viewer", emoji: "🎞️", description: "Oke, kamu memang lumayan sering nonton film." },
  { min: 251, max: 500, name: "Cinephile", emoji: "🔥", description: "Koleksi tontonanmu mulai bikin orang lain minder." },
  { min: 501, max: 1000, name: "Film Addict", emoji: "🫡", description: "Ini sudah bukan sekadar hobi." },
  { min: 1001, max: null, name: "Touch Grass", emoji: "💀", description: "Seribu film lebih. Hormat, tapi... kamu baik-baik saja?" },
];

function classify(films: number) {
  const index = GROUPS.findIndex((g) => films >= g.min && (g.max === null || films <= g.max));
  const g = GROUPS[index === -1 ? GROUPS.length - 1 : index];
  return { ...g, group: index + 1 };
}

export default function Checker() {
  const [username, setUsername] = useState("");
  const [films, setFilms] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  const preview = useMemo(() => {
    const n = Number(films);
    return Number.isFinite(n) && n >= 0 ? classify(Math.floor(n)) : null;
  }, [films]);

  function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const clean = username.trim().replace(/^@/, "");
    const n = Number(films);

    if (!clean) return setError("Masukkan username Letterboxd.");
    if (!/^[A-Za-z0-9_-]{1,30}$/.test(clean)) return setError("Username tidak terlihat valid.");
    if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n)) return setError("Jumlah film harus berupa angka bulat 0 atau lebih.");

    const c = classify(n);
    setResult({ username: clean, films: n, ...c });
  }

  function share() {
    if (!result) return;
    const text = `Aku masuk Kelompok ${result.group} — ${result.name} di Letterboxd Level dengan ${result.films} film 🎬`;
    if (navigator.share) navigator.share({ title: "Letterboxd Level", text, url: window.location.href });
    else navigator.clipboard.writeText(text);
  }

  return (
    <main className="page">
      <div className="grain" />
      <section className="hero">
        <div className="eyebrow">LETTERBOXD • FILM LEVEL</div>
        <h1>Seberapa parah<br /><span>kecanduan film</span> kamu?</h1>
        <p className="lead">Masukkan username Letterboxd dan cari tahu kamu termasuk kelompok penonton yang mana.</p>

        <form onSubmit={submit} className="card form">
          <label>Username Letterboxd</label>
          <div className="inputWrap">
            <span>letterboxd.com/</span>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" autoComplete="off" />
          </div>

          <label>Jumlah film yang sudah ditonton</label>
          <input className="numberInput" value={films} onChange={(e) => setFilms(e.target.value)} placeholder="contoh: 327" inputMode="numeric" />

          <button type="submit">CEK LEVEL SAYA →</button>
          <p className="hint">Versi gratis ini sengaja tidak melakukan scraping otomatis. Isi angka “Films” yang tampil di profil Letterboxd kamu.</p>
          {error && <p className="error">{error}</p>}
        </form>

        {preview && !result && (
          <div className="miniPreview">Preview: {preview.emoji} {preview.name}</div>
        )}

        {result && (
          <div className="result card">
            <div className="resultTop">
              <span>@{result.username}</span>
              <span>GROUP {result.group}</span>
            </div>
            <div className="emoji">{result.emoji}</div>
            <div className="groupLabel">KELOMPOK {result.group}</div>
            <h2>{result.name}</h2>
            <div className="films">{result.films.toLocaleString("id-ID")} <small>FILMS</small></div>
            <p>{result.description}</p>
            <div className="progress">
              <div style={{ width: `${result.max ? Math.min(100, ((result.films - result.min) / (result.max - result.min + 1)) * 100) : 100}%` }} />
            </div>
            <div className="range">
              <span>{result.min.toLocaleString("id-ID")}</span>
              <span>{result.max === null ? "∞" : result.max.toLocaleString("id-ID")}</span>
            </div>
            <button className="secondary" onClick={share}>SHARE HASIL ↗</button>
          </div>
        )}
      </section>

      <section className="groups">
        <div className="sectionTitle">SEMUA LEVEL</div>
        <div className="grid">
          {GROUPS.map((g, i) => (
            <div className="level" key={g.name}>
              <div className="levelNum">0{i + 1}</div>
              <div className="levelEmoji">{g.emoji}</div>
              <div>
                <strong>{g.name}</strong>
                <span>{g.min.toLocaleString("id-ID")}–{g.max === null ? "∞" : g.max.toLocaleString("id-ID")} films</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer>
        <span>LETTERBOXD LEVEL</span>
        <span>Fan-made experiment • Not affiliated with Letterboxd</span>
      </footer>
    </main>
  );
}
