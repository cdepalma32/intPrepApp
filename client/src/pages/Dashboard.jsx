import React from "react";
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
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {/* Welcome */}
      <h1 className="text-3xl font-bold text-center">
        Welcome back, {user?.username || "User"} 👋
      </h1>

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-center">📊 Your Progress</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center gap-10 text-center">
          <div>
            <p className="text-muted-foreground">Anagrams Completed</p>
            <p className="text-xl font-semibold">0</p>
          </div>
          <div>
            <p className="text-muted-foreground">Interview Qs Answered</p>
            <p className="text-xl font-semibold">0</p>
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
            <Button disabled>Coming Soon</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="font-semibold text-lg">🧮 Leetcode Mode</h2>
            <Button disabled>Coming Soon</Button>
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
