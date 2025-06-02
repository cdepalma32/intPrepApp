import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Shuffle array utility
const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

// Shuffle letters of a string
const reshuffleWord = (word) => {
  return shuffleArray(word.split('')).join('');
};

const AnagramPractice = () => {
  const { user } = useAuth();
  const [anagrams, setAnagrams] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [displayScramble, setDisplayScramble] = useState('');
  const [missedCount, setMissedCount] = useState(0);

  const totalProgress = correctCount + missedCount;
  const currentAnagram = anagrams[currentIndex];

  useEffect(() => {
    const fetchAnagrams = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/anagrams');
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        const shuffled = shuffleArray(data);
        setAnagrams(shuffled);

        if (shuffled.length > 0) {
          setDisplayScramble(reshuffleWord(shuffled[0].solution));
        }
      } catch (err) {
        console.error('Failed to load anagrams', err);
        setFeedback('Unable to load anagram questions.');
      }
    };

    fetchAnagrams();
  }, []);

  const checkAnswer = () => {
    if (!currentAnagram || !currentAnagram.solution) return;

    if (totalProgress >= 25) {
      setFeedback("✅ You've reached the max for this round!");
      return;
    }

    const normalized = input.trim().toLowerCase();
    const correct = currentAnagram.solution.toLowerCase();

    if (normalized === correct) {
      setFeedback('Correct!');
      setCorrectCount((prev) => prev + 1);
      setInput('');
      setAttempts(0);

      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      if (anagrams[nextIndex]) {
        setDisplayScramble(reshuffleWord(anagrams[nextIndex].solution));
      }
    } else {
      const nextAttempt = attempts + 1;
      setAttempts(nextAttempt);

      if (nextAttempt >= 4) {
        setFeedback(`The correct answer was: ${currentAnagram.solution}`);
        setMissedCount((prev) => prev + 1);

        setTimeout(() => {
          const nextIndex = currentIndex + 1;
          setCurrentIndex(nextIndex);
          setAttempts(0);
          setInput('');

          if (anagrams[nextIndex]) {
            setDisplayScramble(reshuffleWord(anagrams[nextIndex].solution));
          }
        }, 2000);
      } else {
        setFeedback(`Try again! (${nextAttempt}/4)`);

        let newScramble = reshuffleWord(currentAnagram.solution);
        while (newScramble === currentAnagram.solution) {
          newScramble = reshuffleWord(currentAnagram.solution);
        }
        setDisplayScramble(newScramble);
      }
    }
  };

  if (!anagrams.length || currentIndex >= anagrams.length || totalProgress >= 25) {
    return (
      <div className="text-center p-6">
        <h2 className="text-xl font-bold">🎉 All done!</h2>
        <p className="text-muted-foreground">
          You solved {correctCount} / {totalProgress} correctly
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-4 space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold text-center">
            Welcome{user?.username ? `, ${user.username}` : ''}! Unscramble This:
          </h2>

          <p className="text-sm text-center text-muted-foreground">
            Progress: {totalProgress} / 25 | ✅ {correctCount} correct, ❌ {missedCount} missed
          </p>

          <p className="text-2xl font-bold text-center">
            {displayScramble || 'Loading...'}
          </p>

          {currentAnagram?.topic?.name && (
            <div className="flex justify-center">
              <span className="text-xs font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full shadow">
                Category: {currentAnagram.topic.name}
              </span>
            </div>
          )}

          <input
            type="text"
            placeholder="Your guess..."
            className="w-full border rounded px-4 py-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
          />

          <Button onClick={checkAnswer}>Check</Button>

          {feedback && <p className="text-center">{feedback}</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnagramPractice;
