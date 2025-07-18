import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Utility: Shuffle array
const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

// Scramble while preserving original word lengths (for multi-word anagrams)
const scrambleWithWordLengths = (phrase) => {
  const words = phrase.trim().split(' ');
  const lengths = words.map(word => word.length);
  const allLetters = phrase.replace(/\s/g, '').split('');
  const shuffled = shuffleArray(allLetters);

  const scrambledWords = [];
  let i = 0;
  for (const len of lengths) {
    scrambledWords.push(shuffled.slice(i, i + len).join(''));
    i += len;
  }

  return scrambledWords.join(' ');
};

// Generate hint like "________   ___"
const getWordLengthHint = (solution) => {
  return solution
    .trim()
    .split(' ')
    .map(word => '_'.repeat(word.length))
    .join('   ');
};

const AnagramPractice = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [anagrams, setAnagrams] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [displayScramble, setDisplayScramble] = useState('');
  const [hintPlaceholder, setHintPlaceholder] = useState('');
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
          const first = shuffled[0].solution;
          setDisplayScramble(scrambleWithWordLengths(first));
          setHintPlaceholder(getWordLengthHint(first));
        }
      } catch (err) {
        console.error('Failed to load anagrams', err);
        setFeedback('Unable to load anagram questions.');
      }
    };

    fetchAnagrams();
  }, []);

  useEffect(() => {
    if (anagrams.length && (currentIndex >= anagrams.length || totalProgress >= 25)) {
      const timer = setTimeout(() => navigate('/dashboard'), 5000);
      return () => clearTimeout(timer);
    }
  }, [anagrams, currentIndex, totalProgress, navigate]);

  const checkAnswer = () => {
    if (!currentAnagram || !currentAnagram.solution) return;

    if (totalProgress >= 25) {
      setFeedback("✅ You've reached the max for this round!");
      return;
    }

    const normalize = (str) => str.replace(/\s/g, '').toLowerCase();
    const normalizedInput = normalize(input);
    const normalizedSolution = normalize(currentAnagram.solution);

    if (normalizedInput === normalizedSolution) {
      setFeedback('Correct!');
      setCorrectCount(prev => prev + 1);
      setInput('');
      setAttempts(0);

      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      if (anagrams[nextIndex]) {
        const nextSol = anagrams[nextIndex].solution;
        setDisplayScramble(scrambleWithWordLengths(nextSol));
        setHintPlaceholder(getWordLengthHint(nextSol));
      }
    } else {
      const nextAttempt = attempts + 1;
      setAttempts(nextAttempt);

      if (nextAttempt >= 4) {
        setFeedback(`The correct answer was: ${currentAnagram.solution}`);
        setMissedCount(prev => prev + 1);

        setTimeout(() => {
          const nextIndex = currentIndex + 1;
          setCurrentIndex(nextIndex);
          setAttempts(0);
          setInput('');

          if (anagrams[nextIndex]) {
            const nextSol = anagrams[nextIndex].solution;
            setDisplayScramble(scrambleWithWordLengths(nextSol));
            setHintPlaceholder(getWordLengthHint(nextSol));
          }
        }, 2000);
      } else {
        setFeedback(`Try again! (${nextAttempt}/4)`);

        let newScramble = scrambleWithWordLengths(currentAnagram.solution);
        while (newScramble === currentAnagram.solution) {
          newScramble = scrambleWithWordLengths(currentAnagram.solution);
        }

        setDisplayScramble(newScramble);
        setHintPlaceholder(getWordLengthHint(currentAnagram.solution));
      }
    }
  };

  if (anagrams.length && (currentIndex >= anagrams.length || totalProgress >= 25)) {
    let message = '';
    if (correctCount >= 20) message = "🔥 Incredible work!";
    else if (correctCount >= 15) message = "💪 Great job!";
    else if (correctCount >= 10) message = "👍 Nice effort!";
    else message = "Keep practicing — you’ll get there!";

    return (
      <div className="text-center p-6">
        <h2 className="text-xl font-bold">{message}</h2>
        <p className="text-muted-foreground">
          You solved {correctCount} / {totalProgress} correctly
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Redirecting to dashboard in 5 seconds…
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

          <p className="text-2xl font-bold text-center tracking-wider">
            {displayScramble || 'Loading...'}
          </p>

          {hintPlaceholder && (
            <p className="text-sm text-muted-foreground text-center tracking-widest">
              {hintPlaceholder}
            </p>
          )}

          {currentAnagram?.topic?.name && (
            <div className="flex justify-center">
              <span className="text-xs font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full shadow">
                Category: {currentAnagram.topic.name}
              </span>
            </div>
          )}

          <div className="space-y-1">
            <input
              type="text"
              placeholder="Type the full phrase..."
              className="w-full border rounded px-4 py-2"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
            />
          </div>

            <div className="flex justify-center">
            <Button onClick={checkAnswer}>
                {attempts === 0 && 'Scramble 1/4'}
                {attempts === 1 && 'Scramble 2/4'}
                {attempts === 2 && 'Scramble 3/4'}
                {attempts >= 3 && 'Unsure, give me the answer'}
            </Button>
            </div>

          {feedback && <p className="text-center">{feedback}</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnagramPractice;