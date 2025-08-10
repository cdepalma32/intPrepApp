import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { accessToken } = useAuth(); // switched from just user to use accessToken
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null); // new state to hold updated user data
  const randomEmoji = React.useMemo(() => {
  const emojis = ["👋", "🚀", "💪", "🤓", "🌟", "🧠", "🎯", "⚡"];
  return emojis[Math.floor(Math.random() * emojis.length)];
}, []);

  // Fetch updated profile with progress
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data); 
      } catch (err) {
        console.error("Error loading profile:", err.message);
      }
    };

    fetchProfile();
  }, [accessToken]); 

  // Extract dynamic progress data
  const anagramsCompleted = profile?.anagramProgress?.filter(p => p.roundCompleted).length || 0;
  const interviewQsAnswered = profile?.reviewedQuestions?.length || 0;

 return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {/*  Dynamic username */}
      <h1 className="text-3xl font-bold text-center">
        {randomEmoji} Welcome back, {profile?.username || "User"}!
      </h1>

      {/*  Dynamic Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-center">📊 Your Progress</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center gap-10 text-center">
          <div>
            <p className="text-muted-foreground">Anagrams Completed</p>
            <p className="text-xl font-semibold">{anagramsCompleted}</p> 
          </div>
          <div>
            <p className="text-muted-foreground">Interview Qs Answered</p>
            <p className="text-xl font-semibold">{interviewQsAnswered}</p> 
          </div>
        </CardContent>
      </Card>

      {/* Activities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="font-semibold text-lg">🧩 Anagram Practice</h2>
            <Button onClick={() => navigate("/practice/anagram")}>Start</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="font-semibold text-lg">💬 Interview Qs</h2>
            <Button onClick={() => navigate("/practice/interview")}>Start</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="font-semibold text-lg">🧠 Flashcards</h2>
            <Button onClick={() => navigate("/practice/flashcards")}>Start</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="font-semibold text-lg">🧮 Leetcode Mode</h2>
            <Button onClick={() => navigate("/practice/leetcode")}>Start</Button>
          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <Card>
        <CardContent className="p-6 text-center space-y-3">
          <p className="text-lg">🚀 Ready to jump in?</p>
          <Button onClick={() => navigate("/topics")}>Start Practicing</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;