// client/src/pages/results/AnagramResults.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "@/lib/http";
import { msToMMSS } from "@/lib/format";
import { Button } from "@/components/ui/button";

const mmss = (ms) => (ms != null ? msToMMSS(ms) : "—");

export default function AnagramResults() {
  const { state } = useLocation(); // { latestSession }
  const navigate = useNavigate();
  const [session, setSession] = useState(state?.latestSession || null);
  const [loading, setLoading] = useState(!state?.latestSession);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (session) return;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/users/progress/anagram/sessions", {
          params: { limit: 1 },
        });
        setSession(res.data?.sessions?.[0] || null);
      } catch (e) {
        setErr(e?.response?.data?.error || "Failed to load last session");
      } finally {
        setLoading(false);
      }
    })();
  }, [session]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;

  if (!session) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center space-y-4">
        <h1 className="text-2xl font-bold">Anagram Results</h1>
        <p className="text-gray-600">Finish your first anagram set to see results.</p>
        <div>
          <Button onClick={() => navigate("/practice/anagram")}>Start</Button>
        </div>
      </div>
    );
  }

  const totalCorrect = session.totalCorrect ?? 0;
  const totalAttempted = session.totalAttempted ?? 0;
  const accuracyText = `${Math.round((session.accuracyPct || 0) * 100)}%`;
  const timeText = mmss(session.durationMs);

  // keep exact locale format; just split across two lines
  const finishedText = session.finishedAt
    ? new Date(session.finishedAt).toLocaleString(undefined, {
        dateStyle: "short",
        timeStyle: "short",
      })
    : "—";
  const finishedDate = finishedText.split(",")[0];
  const finishedTime = finishedText.split(",")[1]?.trim();

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      {/* Title */}
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold">Anagram Results</h1>
      </div>

      {/* Divider */}
      <div className="h-px bg-muted/50 mb-6" />

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-stretch mb-6">
        <Stat label="Score" value={`${totalCorrect}/${totalAttempted}`} />
        <Stat label="Accuracy" value={accuracyText} />
        <Stat label="Time" value={timeText} />
        <Stat
          label="Completed"
          value={
            <span className="block leading-tight">
              {finishedDate}
              <br />
              {finishedTime}
            </span>
          }
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-muted/50 mb-6" />

      {/* Topic (compact) */}
      <div className="rounded-xl border px-4 py-3 max-w-sm mx-auto text-left mb-6">
        <div className="text-xs text-gray-500 mb-1">Topic</div>
        <div className="text-base font-medium">{session.topic || "All Topics"}</div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-3">
        <Button
          onClick={() => navigate("/practice/anagram")}
          className="shadow-sm"
        >
          Try Again
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard")}
          className="shadow-sm"
        >
          Dashboard
        </Button>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border p-4 text-center w-full flex flex-col items-center justify-center">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-xl font-semibold leading-tight">{value}</div>
    </div>
  );
}
