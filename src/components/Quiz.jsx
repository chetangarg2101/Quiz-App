import React, { useState, useRef, useEffect } from 'react';
import './Quiz.css';
import { data } from '../assets/data';  // Ensure this file has quiz data

const Quiz = () => {
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState(data[index]);
  const [lock, setLock] = useState(false);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(false);
  const [name, setName] = useState('');
  const [history, setHistory] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false); // State to control quiz start

  const Option1 = useRef(null);
  const Option2 = useRef(null);
  const Option3 = useRef(null);
  const Option4 = useRef(null);

  const option_array = [Option1, Option2, Option3, Option4];

  // Retrieve user's history if exists
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('quizHistory'));
    if (storedHistory) {
      setHistory(storedHistory);
    }
  }, []);

  const checkAns = (e, ans) => {
    if (lock === false) {
      if (question.ans === ans) {
        e.target.classList.add('correct');
        setLock(true);
        setScore((prev) => prev + 1);
      } else {
        e.target.classList.add('wrong');
        setLock(true);
        option_array[question.ans - 1].current.classList.add('correct');
      }
    }
  };

  const next = () => {
    if (lock === true) {
      if (index === data.length - 1) {
        setResult(true);
        return;
      }
      setIndex((prev) => prev + 1);
      setQuestion(data[index + 1]);
      setLock(false);
      option_array.forEach((option) => {
        option.current.classList.remove('wrong');
        option.current.classList.remove('correct');
      });
    }
  };

  const reset = () => {
    setIndex(0);
    setQuestion(data[0]);
    setScore(0);
    setLock(false);
    setResult(false);
    setQuizStarted(false); // Reset quiz start state
    setName(''); // Reset the name as well
  };

  const handleNameChange = (e) => {
    setName(e.target.value); // Update name state as user types
  };

  const handleStartQuiz = () => {
    if (name.trim()) {
      setQuizStarted(true); // Only start the quiz when the user clicks start
    }
  };

  const saveHistory = () => {
    if (name.trim()) {
      const newHistory = { name, score };
      localStorage.setItem('quizHistory', JSON.stringify(newHistory));
      setHistory(newHistory); // Set the new history state
    }
  };

  return (
    <div className="container">
      <h1>Quiz App</h1>
      <hr />

      {!quizStarted ? (
        // Name input and start quiz
        <div>
          <h2>Enter Your Full Name</h2>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Your Full Name"
          />
          <button onClick={handleStartQuiz} disabled={!name.trim()}>
            Start Quiz
          </button>
        </div>
      ) : (
        <>
          {/* Display quiz or result */}
          {result ? (
            <>
              <h2>{name}, You Scored {score} out of {data.length}</h2>
              <button onClick={reset}>Reset</button>
              <button onClick={saveHistory}>Save History</button>
              {history && (
                <div>
                  <h3>Previous Attempt:</h3>
                  <p>Name: {history.name}</p>
                  <p>Score: {history.score}</p>
                </div>
              )}
            </>
          ) : (
            <>
              <h2>{index + 1}. {question.question}</h2>
              <ul>
                <li ref={Option1} onClick={(e) => { checkAns(e, 1) }}>{question.option1}</li>
                <li ref={Option2} onClick={(e) => { checkAns(e, 2) }}>{question.option2}</li>
                <li ref={Option3} onClick={(e) => { checkAns(e, 3) }}>{question.option3}</li>
                <li ref={Option4} onClick={(e) => { checkAns(e, 4) }}>{question.option4}</li>
              </ul>
              <button onClick={next}>Next</button>
              <div className="index">{index + 1} of {data.length} questions</div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Quiz;
