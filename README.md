# IntPrepApp

**Your Personalized Interview Prep App (MERN Stack)**

Practice real-world anagrams, review common interview questions, and prep with confidence using a secure, token-authenticated full-stack experience.

> Final MVP in progress — focused on authentication, protected routes, user scoring, and scalable activity design.  
> Built to simulate LeetCode, Quizlet, and system design prep workflows.

---

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS + ShadCN UI
- **Backend**: Node.js + Express + MongoDB (Atlas)
- **Authentication**: JWT (Access + Refresh Tokens with Rotation)
- **Deployment**: (Coming Soon) Render (Backend) + Vercel (Frontend)
- **Testing**: Jest + AI-Generated Unit Tests (via Cursor AI)

---

## Authentication & Security

- **Access Tokens**: In-memory only (via React Context) for enhanced security
- **Refresh Tokens**: Stored in localStorage, supports silent login and rotation
- **Token Rotation**: Each refresh request issues new tokens and invalidates the old
- **.env Protection**: Secrets excluded with `.gitignore` and rotated after early exposure
- Verified in Insomnia + working in frontend login/signup flow

---

## ACTIVITY 1: Anagram Practice ( MVP Complete)

### Done

- Pulls randomized anagrams from backend (25 per session)
- Tracks ✅ correct and ❌ missed attempts
- 4-strike rule: answer revealed after 4 failed attempts
- Re-randomizes letters on each wrong try
- Topic/category displayed for each anagram
- End-of-session summary with motivational message

### In Progress

- Record scores to user profile
- Track and update personal best
- Topic-based filtering via `/topics?activity=anagram`

---

## ACTIVITY 2: Interview Questions (Planned MVP)

### Vision

- Show one question at a time (e.g., “What is REST?”)
- User reflects or types their answer
- Click to reveal sample answer
- Add thumbs-up/down for UX feedback (not scored)

### MVP Tasks

- Scaffold `InterviewPractice.jsx`
- Fetch questions by topic
- Add collapsible sample answer
- Add next/prev navigation

> Post-MVP: Integrate AI or keyword-matching to check answer quality and score user response

---

## ACTIVITY 3: LeetCode Challenges (MVP In Progress)

### Vision

- Timed coding challenges (JS algorithms & data structures)
- Built-in timer and code editor UI
- Users can attempt and view solution afterward

### MVP Tasks

- Scaffold `LeetcodePractice.jsx`
- Add timer UI + textarea
- Store user input (temp only, no auto-judge yet)
- Manual scoring based on correctness + time

> Post-MVP: Integrate OpenAI API for hints or solution feedback

---

## User Profiles

### Done

- User creation, login, logout, token rotation fully functional

### MVP Tasks

- Dashboard shows score summary and activity history
- Record personal bests per activity
- Add account deletion + settings management
- Track reviewed content (e.g., completed questions)

---

## AI-Assisted Unit Testing (Cursor AI)

### What I Did

I integrated **Cursor AI** to generate my first suite of Jest unit tests for helper logic, expanding my testing toolkit beyond API tools like Insomnia. This allowed me to:

- Auto-generate and validate test cases for utility functions
- Set up a basic TDD workflow with minimal effort
- Practice testing concepts as part of the development lifecycle

### Tested Helpers

#### 1. `isValidAnagram()`

```js
// utils/isValidAnagram.js
function isValidAnagram(str1, str2) {
  if (str1.length !== str2.length) return false;
  const lookup = {};
  for (let char of str1) {
    lookup[char] = (lookup[char] || 0) + 1;
  }
  for (let char of str2) {
    if (!lookup[char]) return false;
    lookup[char]--;
  }
  return true;
}
export default isValidAnagram;

// tests/isValidAnagram.test.js
import isValidAnagram from '../utils/isValidAnagram';

describe('isValidAnagram', () => {
  it('validates correct anagram', () => {
    expect(isValidAnagram('cinema', 'iceman')).toBe(true);
  });
  it('fails on different lengths', () => {
    expect(isValidAnagram('aaz', 'zza')).toBe(false);
  });
  it('fails on mismatched characters', () => {
    expect(isValidAnagram('anagram', 'nagarab')).toBe(false);
  });
});
```

#### 2.`isValidAnagram()`

```js
// utils/calculateScore.js
export function calculateScore(correct, total) {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

// tests/calculateScore.test.js
import { calculateScore } from '../utils/calculateScore';

describe('calculateScore', () => {
  it('returns 0 for total = 0', () => {
    expect(calculateScore(5, 0)).toBe(0);
  });
  it('calculates percentage correctly', () => {
    expect(calculateScore(8, 10)).toBe(80);
  });
  it('rounds down correctly', () => {
    expect(calculateScore(2, 3)).toBe(67);
  });
});
```

## Deployment Plan

- **Backend**: Hosted on Render (MongoDB Atlas included)
- **Frontend**: Hosted on Vercel (auto-deploy from GitHub main branch)
- **.env** securely used for tokens and DB credentials
- **CORS** configured for frontend-backend communication
- **Token-based auth** verified and refreshed across hosted domains

## Roadmap

### MVP Scope

- User auth with token rotation
- Anagram activity with score tracking + feedback
- AI-assisted unit test with Jest

### MVP In Progress

- Interview + LeetCode scaffolds
- Topic filtering + dynamic dashboard
- Profile CRUD and stat tracking

### Post-MVP Ideas

- OpenAI API (auto-eval or AI hints)
- Adaptive difficulty by user performance
- Peer feedback or discussion area
- Analytics: graphs showing improvement over time

---

## Why This Project?

I built this mainly because I wish I had something like this during my own interview journey -- something fun and engaging, as well as to challenge myself technically, learn secure full-stack practices, and show how I approach real-world problems as a developer — from authentication and architecture to UI/UX and testing.
While there is still more to build and refine, I am proud of the foundation that I have laid -- and excited to continue expanding, improving and learning!
This README will evolve as the app grows -- follow along for updates as new features are added!
