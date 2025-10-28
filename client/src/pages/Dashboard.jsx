import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/http";
import { useNavigate, Link } from "react-router-dom";
import { msToMMSS, pct } from "@/lib/format";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// JS helpers (no TS types in .jsx)
const fmtPct = (v) => pct(typeof v === "number" ? v : 0, { fraction: true });
const fmtTime = (ms) => (ms != null ? msToMMSS(ms) : "–");

const Dashboard = () => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  const randomEmoji = useMemo(() => {
    const emojis = ["👋", "🚀", "💪", "🤓", "🌟", "🧠", "🎯", "⚡"];
    return emojis[Math.floor(Math.random() * emojis.length)];
  }, []);

  useEffect(() => {
    let alive = true;

    async function fetchAll() {
      try {
        setLoading(true);

        const [p, s, r] = await Promise.allSettled([
          api.get("/users/profile"),
          api.get("/users/progress/anagram/summary"),
          api.get("/users/progress/anagram/sessions", { params: { limit: 3 } }),
        ]);

        if (!alive) return;

        // profile
        if (p.status === "fulfilled") setProfile(p.value.data);
        else console.warn("[dashboard] profile load failed:", p.reason);

        // summary: 404 = no data yet
        if (s.status === "fulfilled") {
          setSummary(s.value?.data?.summary ?? null);
        } else {
          const code = s.reason?.response?.status;
          if (code !== 404) console.warn("[dashboard] summary load failed:", s.reason);
          setSummary(null);
        }

        // recent: 404 = none yet
        if (r.status === "fulfilled") {
          const list = Array.isArray(r.value?.data?.sessions)
            ? r.value.data.sessions
            : [];
          setRecent(list);
        } else {
          const code = r.reason?.response?.status;
          if (code !== 404) console.warn("[dashboard] sessions load failed:", r.reason);
          setRecent([]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    fetchAll();
    return () => { alive = false; };
  }, [accessToken]);

  // “Completed” count: prefer summary rollup; fall back to old profile array
  const anagramsCompleted =
    (summary && typeof summary.totalSetsCompleted === "number"
      ? summary.totalSetsCompleted
      : (Array.isArray(profile?.anagramProgress)
          ? profile.anagramProgress.filter((p) => p && p.roundCompleted).length
          : 0));

  const interviewQsAnswered = Array.isArray(profile?.reviewedQuestions)
    ? profile.reviewedQuestions.length
    : 0;

  const bestAcc  = fmtPct(summary?.bestAccuracy);
  const avgAcc   = fmtPct(summary?.avgAccuracy);
  const bestTime = fmtTime(summary?.bestAvgTimeMs);
  const avgTime  = fmtTime(summary?.avgTimeMs);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-center">
        {randomEmoji} Welcome back, {profile?.username || "User"}!
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg text-center">📊 Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-10 text-center">
              <div>
                <p className="text-muted-foreground">Anagrams Completed</p>
                <p className="text-xl font-semibold">{anagramsCompleted}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Interview Qs Answered</p>
                <p className="text-xl font-semibold">{interviewQsAnswered}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mt-6">
              <div>
                <p className="text-muted-foreground">Total Sets</p>
                <p className="text-lg font-medium">
                  {summary?.totalSetsCompleted ?? 0}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Best Accuracy</p>
                <p className="text-lg font-medium">{bestAcc}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Avg Accuracy</p>
                <p className="text-lg font-medium">{avgAcc}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Best Avg Time</p>
                <p className="text-lg font-medium">{bestTime}</p>
              </div>
            </div>

            {!loading && (
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Average time per set: <span className="font-medium">{avgTime}</span>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-center">🕑 Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground text-center">Loading…</p>
            ) : recent.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center">
                No sessions yet — try a set!
              </p>
            ) : (
              <ul className="space-y-3">
                {recent.map((s) => (
                  <li
                    key={s.sessionId || `${s.finishedAt}-${s.totalAttempted || 0}`}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {s.finishedAt
                          ? new Date(s.finishedAt).toLocaleDateString()
                          : "—"}
                      </span>
                      <span className="text-muted-foreground">
                        {s.topic || "General"}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{fmtPct(s.accuracyPct)}</div>
                      <div className="text-muted-foreground">{fmtTime(s.durationMs)}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activities */}
      {/* Activities */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
  {/* Anagram */}
  <Card>
    <CardContent className="p-6 space-y-4">
      <h2 className="font-semibold text-lg">🧩 Anagram Practice</h2>
      <div className="flex gap-2">
        <Button onClick={() => navigate("/practice/anagram")}>Start</Button>
        <Button variant="outline" asChild>
          <Link to="/results/anagram">Results</Link>
        </Button>
      </div>
    </CardContent>
  </Card>

  {/* Interview */}
  <Card>
    <CardContent className="p-6 space-y-4">
      <h2 className="font-semibold text-lg">💬 Interview Qs</h2>
      <div className="flex gap-2">
        <Button onClick={() => navigate("/practice/interview")}>Start</Button>
        <Button variant="outline" asChild>
          <Link to="/results/interview">Results</Link>
        </Button>
      </div>
    </CardContent>
  </Card>

  {/* Flashcards */}
  <Card>
    <CardContent className="p-6 space-y-4">
      <h2 className="font-semibold text-lg">🧠 Flashcards</h2>
      <div className="flex gap-2">
        <Button onClick={() => navigate("/practice/flashcards")}>Start</Button>
        <Button variant="outline" asChild>
          <Link to="/results/flashcards">Results</Link>
        </Button>
      </div>
    </CardContent>
  </Card>

  {/* LeetCode */}
  <Card>
    <CardContent className="p-6 space-y-4">
      <h2 className="font-semibold text-lg">🧮 Leetcode Mode</h2>
      <div className="flex gap-2">
        <Button onClick={() => navigate("/practice/leetcode")}>Start</Button>
        <Button variant="outline" asChild>
          <Link to="/results/leetcode">Results</Link>
        </Button>
      </div>
    </CardContent>
  </Card>
</div>
    </div>
  );
};

export default Dashboard;
