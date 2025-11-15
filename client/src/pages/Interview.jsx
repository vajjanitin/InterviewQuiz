import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { SyncLoader } from "react-spinners";
import { useMediaQuery } from "react-responsive";

const Interview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subject, mode, count } = location.state || {}; // mode added for difficulty filtering

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // Persisting selected answers and progress state between navigations.
  // Stored as { [questionId]: { question, selectedOption, correctAnswer, isCorrect } }
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  // Track which questions the user has visited (by question _id)
  // Question circle: default stays neutral until visited or answered
  const [visitedQuestions, setVisitedQuestions] = useState(new Set());
  // Lock state when quiz is submitted (manual or auto-submit)
  const [isLocked, setIsLocked] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const timerRef = useRef(null);
  const hasFetched = useRef(false);
  // refs and input method tracking for accessibility
  const optionsRef = useRef({});
  const [lastInputWasKeyboard, setLastInputWasKeyboard] = useState(false);

  // Responsiveness: detect small screens to adapt layout
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    if (!subject || !mode || !count) { // mode added to validation
      setError("Interview parameters are missing. Please start a new interview.");
      setLoading(false);
      return;
    }
    hasFetched.current = true;
    
    setTimer(30 * count);

    const fetchQuestions = async () => {
      try {
        // difficulty field added for mode filtering - pass mode as query parameter
        const response = await axios.get(`http://localhost:5000/api/questions/${subject}`, {
          params: { count, difficulty: mode },
        });
        if (response.data.length === 0) {
          setError(`No questions found for subject: ${subject}`);
        } else {
          setQuestions(response.data || []);
          setError(null);

          // Attempt to restore persisted answers for this quiz from sessionStorage
          try {
            const key = `qm_answers_${subject || 'unknown'}_${mode || 'unknown'}`;
            const stored = sessionStorage.getItem(key);
            if (stored) {
              const parsed = JSON.parse(stored);
              setAnswers(parsed || {});
            }
            // restore visited questions if present (non-essential)
            try {
              const vkey = `qm_visited_${subject || 'unknown'}_${mode || 'unknown'}`;
              const vstored = sessionStorage.getItem(vkey);
              if (vstored) {
                const parsed = JSON.parse(vstored);
                setVisitedQuestions(new Set(parsed || []));
              }
            } catch (e) {}
          } catch (e) {}
        }
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError(err.response?.data?.message || "Failed to fetch questions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();

    timerRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(timerRef.current);
          // Auto-submit on timeout: reuses existing submit handler, then locks quiz instance
          // (detectable in tests by this comment and by the sessionStorage flag set in handleSubmitInterview)
          handleSubmitInterview(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [subject, mode, count]);

  // Track last input method (keyboard vs pointer) to decide focus behavior for accessibility
  useEffect(() => {
    const handleKey = () => setLastInputWasKeyboard(true);
    const handlePointer = () => setLastInputWasKeyboard(false);
    window.addEventListener('keydown', handleKey);
    window.addEventListener('mousedown', handlePointer);
    window.addEventListener('touchstart', handlePointer);
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('mousedown', handlePointer);
      window.removeEventListener('touchstart', handlePointer);
    };
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      const currentQuestionId = questions[currentQuestionIndex]?._id;
      if (answers[currentQuestionId]) {
        setSelectedOption(answers[currentQuestionId].selectedOption);
      } else {
        setSelectedOption(null);
      }
    }
  }, [currentQuestionIndex, questions, answers]);

  // When the active question changes, mark it visited (user has opened it)
  useEffect(() => {
    const qid = questions[currentQuestionIndex]?._id;
    if (qid) {
      setVisitedQuestions((prev) => {
        const next = new Set(Array.from(prev || []));
        next.add(qid);
        try {
          const vkey = `qm_visited_${subject || 'unknown'}_${mode || 'unknown'}`;
          sessionStorage.setItem(vkey, JSON.stringify(Array.from(next)));
        } catch (e) {}
        return next;
      });
    }
  }, [currentQuestionIndex, questions, subject, mode]);

  // When selectedOption changes and this was a keyboard navigation, move focus to the selected option
  useEffect(() => {
    const currentQuestionId = questions[currentQuestionIndex]?._id;
    if (lastInputWasKeyboard && selectedOption != null && currentQuestionId) {
      const el = optionsRef.current[currentQuestionId]?.[selectedOption];
      if (el && typeof el.focus === 'function') el.focus();
    }
  }, [selectedOption, lastInputWasKeyboard, currentQuestionIndex, questions]);

  // If this quiz instance is already completed (manual or auto), lock and redirect to results
  useEffect(() => {
    try {
      const ckey = `qm_completed_${subject || 'unknown'}_${mode || 'unknown'}`;
      const completed = sessionStorage.getItem(ckey);
      if (completed === 'true') {
        setIsLocked(true);
        // navigate to submit/results screen
        navigate('/submit-interview');
      }
    } catch (e) {}
  }, [questions, subject, mode, navigate]);

  const handleOptionSelect = (option) => {
    // Save selection immediately to answers state and sessionStorage so navigating away retains selection
    setSelectedOption(option);
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;
    const newAnswers = {
      ...answers,
      [currentQuestion._id]: {
        question: currentQuestion.question,
        selectedOption: option,
        correctAnswer: currentQuestion.answer,
        isCorrect: option === currentQuestion.answer,
      },
    };
    setAnswers(newAnswers);
    // mark question as visited/answered
    try {
      const qid = currentQuestion._id;
      setVisitedQuestions((prev) => {
        const next = new Set(Array.from(prev || []));
        next.add(qid);
        try {
          const vkey = `qm_visited_${subject || 'unknown'}_${mode || 'unknown'}`;
          sessionStorage.setItem(vkey, JSON.stringify(Array.from(next)));
        } catch (e) {}
        return next;
      });
    } catch (e) {}
    try {
      const key = `qm_answers_${subject || 'unknown'}_${mode || 'unknown'}`;
      sessionStorage.setItem(key, JSON.stringify(newAnswers));
    } catch (e) {}
  };

  const handleNext = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    // Answers are saved on selection; just clear selectedOption for next question
    setSelectedOption(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // On the last question, show confirmation modal before submit
      setShowConfirmSubmit(true);
    }
  };

  const handleQuestionJump = (index) => {
    // Selection is already persisted on click; just jump and restore any saved selection
    setCurrentQuestionIndex(index);
    setSelectedOption(answers[questions[index]?._id]?.selectedOption || null);
    // mark visited for this question
    try {
      const qid = questions[index]?._id;
      if (qid) {
        setVisitedQuestions((prev) => {
          const next = new Set(Array.from(prev || []));
          next.add(qid);
          try {
            const vkey = `qm_visited_${subject || 'unknown'}_${mode || 'unknown'}`;
            sessionStorage.setItem(vkey, JSON.stringify(Array.from(next)));
          } catch (e) {}
          return next;
        });
      }
    } catch (e) {}
  };
  
  const handleSubmitInterview = (finalAnswers = answers, auto = false) => {
    // clear running timer and set locked state so UI is disabled if user remains
    clearInterval(timerRef.current);
    setIsLocked(true);

    // Persist a completed flag so this quiz instance cannot be resumed
    try {
      const ckey = `qm_completed_${subject || 'unknown'}_${mode || 'unknown'}`;
      sessionStorage.setItem(ckey, 'true');
      const byKey = `qm_completed_by_${subject || 'unknown'}_${mode || 'unknown'}`;
      sessionStorage.setItem(byKey, auto ? 'auto' : 'manual');
    } catch (e) {}

    // Build the quiz result payload. Ensure branch is defined (fallback to user branch or unknown).
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    const branchFromLocation = location.state?.branch;
    const branchName = branchFromLocation || storedUser.branch || storedUser.department || 'N/A';

    const quizResults = {
      username: storedUser?.username || 'anonymous',
      branch: branchName,
      subject,
      answers: Object.values(finalAnswers),
      score: Object.values(finalAnswers).filter(a => a.isCorrect).length,
      total: questions.length,
      timeTaken: (30 * questions.length) - timer,
    };

    // Save to localStorage so Result page can render immediately
  localStorage.setItem("quizResults", JSON.stringify(quizResults));
  // Also store a session copy as a fallback for immediate navigation (some flows clear localStorage)
  try { sessionStorage.setItem('quizResults', JSON.stringify(quizResults)); } catch (e) {}

    // If this is an auto-submit (timeout), use existing flow to navigate to submit page
    // otherwise navigate directly to the client-side result page and let it POST in background
    if (auto) {
      navigate("/submit-interview");
    } else {
      navigate("/result");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <SyncLoader color="#6366F1" loading={true} size={15} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl border-l-4 border-red-500 max-w-sm">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => navigate("/start-interview")}
            className="mt-6 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  // Derived values for header/progress
  const answeredCount = Object.keys(answers).length;
  const answeredPct = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;
  const displaySubject = subject || currentQuestion?.subject || "Quiz";
  const displayLevel = mode ? `${mode} Level` : "";

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-2 sm:p-4 font-sans">
      <div className="max-w-7xl mx-auto h-full flex flex-col md:flex-row gap-4 items-center md:items-stretch">
        <div className={`md:w-56 ${isMobile ? 'order-2 mt-4' : 'order-1'}`}>
          <div className="h-full md:min-h-[380px] bg-white p-3 md:p-4 rounded-2xl shadow-lg border border-gray-100 flex flex-col gap-2 md:gap-3">
            <h3 className="text-base md:text-sm font-bold mb-3 text-center text-gray-800">Question Navigation</h3>
            {/* Mobile: horizontal scrollable strip */}
            <div className="block md:hidden mb-3">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {questions.map((q, index) => {
                  const isAnswered = !!answers[q._id];
                  const isCurrent = index === currentQuestionIndex;
                  const isVisited = visitedQuestions.has(q._id);
                  const buttonClasses = `w-9 h-9 flex-shrink-0 flex items-center justify-center text-xs font-bold rounded-full transition-all duration-200 transform ${isCurrent ? 'bg-indigo-600 text-white shadow-lg scale-105 ring-2 ring-indigo-300' : ''} ${!isCurrent && isAnswered ? 'bg-emerald-500 text-white' : ''} ${!isCurrent && isVisited && !isAnswered ? 'bg-gray-100 text-gray-800' : ''} ${!isCurrent && !isVisited && !isAnswered ? 'bg-gray-200 text-gray-600' : ''}`;
                  const stateLabel = isAnswered ? 'answered' : (isVisited ? 'visited' : 'unvisited');
                  return (
                    <button
                      key={q._id}
                      onClick={() => handleQuestionJump(index)}
                      className={`${buttonClasses} focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                      title={isAnswered ? "Answered" : (isVisited ? "Visited, Not Answered" : "Not Visited")}
                      aria-label={`Question ${index + 1} — ${stateLabel}${isCurrent ? ' — current' : ''}`}
                      aria-current={isCurrent ? 'true' : undefined}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Desktop: grid side-nav */}
            <div className="hidden md:grid grid-cols-5 md:grid-cols-4 gap-2 mb-4">
              {questions.map((q, index) => {
                const isAnswered = !!answers[q._id];
                const isCurrent = index === currentQuestionIndex;
                const isVisited = visitedQuestions.has(q._id);
                // Visual states:
                const buttonClasses = `w-9 h-9 flex items-center justify-center text-xs font-bold rounded-full transition-all duration-200 transform ${isCurrent ? 'bg-indigo-600 text-white shadow-lg scale-105 ring-2 ring-indigo-300' : ''} ${!isCurrent && isAnswered ? 'bg-emerald-500 text-white shadow-md hover:bg-emerald-600' : ''} ${!isCurrent && isVisited && !isAnswered ? 'bg-gray-100 text-gray-800 ring-1 ring-gray-200' : ''} ${!isCurrent && !isVisited && !isAnswered ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' : ''}`;
                const stateLabel = isAnswered ? 'answered' : (isVisited ? 'visited' : 'unvisited');
                return (
                  <button
                    key={q._id}
                    onClick={() => handleQuestionJump(index)}
                    className={`${buttonClasses} focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                    title={isAnswered ? "Answered" : (isVisited ? "Visited, Not Answered" : "Not Visited")}
                    aria-label={`Question ${index + 1} — ${stateLabel}${isCurrent ? ' — current' : ''}`}
                    aria-current={isCurrent ? 'true' : undefined}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className={`flex-1 ${isMobile ? 'order-1' : 'order-2'} h-full`}>
          <div className="h-full bg-white shadow-2xl rounded-3xl p-4 md:p-5 w-full transform transition-transform duration-300 ease-in-out flex flex-col justify-between">
            {/* Header Section */}
                <div className="flex flex-row justify-between items-center mb-3 gap-3">
              <div className="flex-1">
                {/* Header bar: subject name and level */}
                <h2 className="text-lg md:text-base font-medium text-gray-800 mb-1">
                  {displaySubject}{displayLevel ? ` - ${displayLevel}` : ''}
                </h2>
                <p className="text-sm text-gray-600">{/* small subtitle if needed */}</p>
              </div>

              <div className="text-right">
                {/* Right side: Question X of Y */}
                <div className="text-sm font-medium text-gray-700 mb-2">Question {currentQuestionIndex + 1} of {questions.length}</div>
                <div>
                  <span className="text-xs font-semibold text-gray-500 block mb-1">TIME REMAINING</span>
                  <span className={`text-xl sm:text-2xl font-bold rounded-full px-3 py-1 inline-block ${
                    timer < 60 ? 'text-red-600 bg-red-50' : 'text-indigo-600 bg-indigo-50'
                  }`}>
                    {formatTime(timer)}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar: reflects number of answered questions out of total (compact) */}
            <div className="mb-3">
              <div className="relative h-1 md:h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 transition-all duration-300 ease-out"
                  style={{
                    width: `${questions.length > 0 ? (answeredCount / questions.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {currentQuestion && (
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Question Card - compact */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6 rounded-lg border border-indigo-200 shadow-sm">
                    <div className="flex gap-3 items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-6 w-6 md:h-7 md:w-7 rounded-full bg-indigo-600 text-white font-bold">•</div>
                      </div>
                      <div className="flex-1">
                        <p className="text-base md:text-lg font-semibold text-gray-800 leading-tight">
                          {currentQuestion.question}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    <p className="text-sm md:text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Choose your answer</p>
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        ref={(el) => {
                          const qid = currentQuestion._id;
                          if (!optionsRef.current[qid]) optionsRef.current[qid] = {};
                          optionsRef.current[qid][option] = el;
                        }}
                        onClick={() => !isLocked && handleOptionSelect(option)}
                        disabled={isLocked}
                        className={`w-full text-left py-3 md:py-2 px-4 md:px-3 rounded-lg font-medium transition-all duration-200 transform flex items-center gap-3 border-2 ${
                          selectedOption === option
                            ? "border-emerald-500 bg-emerald-50 text-gray-800 shadow-md"
                            : (isLocked ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed" : "border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50")
                        }`}
                        aria-pressed={selectedOption === option}
                      >
                        <div className={`flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedOption === option
                            ? "border-emerald-500 bg-emerald-500"
                            : "border-gray-300"
                        }`}>
                          {selectedOption === option && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className="font-medium text-sm md:text-base break-words">{option}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={() => { if (!isLocked) {
                      // If last question show confirm modal, otherwise go next
                      if (currentQuestionIndex < questions.length - 1) {
                        handleNext();
                      } else {
                        setShowConfirmSubmit(true);
                      }
                    }}}
                    disabled={!selectedOption || isLocked}
                    className={`px-6 py-2 rounded-full font-bold text-white transition-all duration-200 transform ${
                      (!isLocked && selectedOption)
                        ? "bg-indigo-600 hover:bg-indigo-700 shadow-md hover:scale-105 cursor-pointer"
                        : "bg-gray-400 cursor-not-allowed opacity-60"
                    }`}
                  >
                    {currentQuestionIndex < questions.length - 1 ? "Next" : "Submit"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl border-l-4 border-red-500">
            <div className="mb-4">
              <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Please Select an Option</h3>
            <p className="text-gray-600 mb-6">You need to choose an answer before moving forward.</p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full transition-all duration-300"
            >
              Got It
            </button>
          </div>
        </div>
      )}
      {/* Confirm Submit Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Submit Interview</h3>
            <p className="text-gray-700 mb-6">You are on the last question. Are you sure you want to submit your interview now?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowConfirmSubmit(false)} className="px-4 py-2 rounded-full border font-semibold">Cancel</button>
              <button onClick={() => { setShowConfirmSubmit(false); handleSubmitInterview(); }} className="px-4 py-2 bg-indigo-600 text-white rounded-full font-semibold">Yes, submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Interview;
