import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace = false) {
    if (replace) {
      setHistory((prev) => {
        const newHistory = [...prev];
        newHistory.pop();
        newHistory.push(newMode);
        return newHistory;
      });
    } else {
      setHistory((prev) => ([...prev, newMode]));
    }

    setMode(newMode);
  }

  function back() {
    if (history.length < 2) {
      return;
    }

    setHistory(prev => {
      prev.pop();
      setMode(prev[prev.length - 1]);
      return prev;
    });
  }

  return { mode, transition, back };
}