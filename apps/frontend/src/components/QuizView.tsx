import { useState } from 'react';

type Question = {
    id: number;
    text: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
};

const quizQuestions: Question[] = [
    {
        id: 1,
        text: "Which cipher was famously used by Julius Caesar?",
        options: ["Vigenère Cipher", "Caesar Cipher", "Playfair Cipher", "Enigma"],
        correctAnswer: 1,
        explanation: "The Caesar Cipher is a simple substitution cipher named after Julius Caesar, who used it with a shift of 3 to protect messages."
    },
    {
        id: 2,
        text: "Which of these is a Transposition Cipher?",
        options: ["Hill Cipher", "Rail Fence Cipher", "RSA", "Diffie-Hellman"],
        correctAnswer: 1,
        explanation: "Rail Fence is a transposition cipher because it scrambles the positions of the letters rather than replacing them."
    },
    {
        id: 3,
        text: "Which cipher uses a polyalphabetic key (a keyword) to shift letters differently?",
        options: ["Vigenère Cipher", "Caesar Cipher", "Columnar Transposition", "Playfair Cipher"],
        correctAnswer: 0,
        explanation: "The Vigenère Cipher uses a repeating keyword to determine the shift for each letter, making it a polyalphabetic substitution cipher."
    },
    {
        id: 4,
        text: "Which Algorithm relies on the mathematical difficulty of factoring the product of two large prime numbers?",
        options: ["Diffie-Hellman", "Hill Cipher", "RSA", "AES"],
        correctAnswer: 2,
        explanation: "RSA's security is based on the practical difficulty of factoring the product of two large prime numbers, the factoring problem."
    },
    {
        id: 5,
        text: "Which cipher encrypts pairs of letters (digraphs) instead of single letters, using a 5x5 grid?",
        options: ["Hill Cipher", "Vigenère Cipher", "Caesar Cipher", "Playfair Cipher"],
        correctAnswer: 3,
        explanation: "The Playfair Cipher operates on digraphs using a 5x5 grid constructed with a keyword."
    }
];

export function QuizView() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
    const [score, setScore] = useState(0);
    const [isQuizComplete, setIsQuizComplete] = useState(false);

    const handleSelectOption = (index: number) => {
        if (isAnswerRevealed) return;
        setSelectedAnswer(index);
        setIsAnswerRevealed(true);

        const currentQ = quizQuestions[currentQuestionIndex];
        if (index === currentQ.correctAnswer) {
            setScore(score + 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null);
            setIsAnswerRevealed(false);
        } else {
            setIsQuizComplete(true);
        }
    };

    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setIsAnswerRevealed(false);
        setScore(0);
        setIsQuizComplete(false);
    };

    if (isQuizComplete) {
        const percentage = Math.round((score / quizQuestions.length) * 100);
        return (
            <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-2xl border border-purple-100 dark:border-gray-800 p-8 text-center animate-fade-in">
                <div className="mb-6 flex justify-center">
                    <div className="w-24 h-24 rounded-full bg-purple-100 dark:bg-gray-800 flex items-center justify-center text-4xl">
                        {percentage >= 80 ? '🏆' : percentage >= 50 ? '👍' : '📚'}
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-purple-800 dark:text-purple-400 mb-4">Quiz Completed!</h2>
                <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
                    You scored <span className="font-bold text-purple-600 dark:text-purple-400">{score}</span> out of {quizQuestions.length} ({percentage}%)
                </p>

                <button
                    onClick={handleRestart}
                    className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-900 mx-auto"
                >
                    Restart Quiz
                </button>
            </div>
        );
    }

    const currentQ = quizQuestions[currentQuestionIndex];

    return (
        <div className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-2xl border border-purple-100 dark:border-gray-800 p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-purple-50 dark:border-gray-800">
                <h2 className="text-2xl font-semibold text-purple-800 dark:text-purple-400">Cryptography Quiz</h2>
                <div className="text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-gray-800 px-3 py-1 rounded-full">
                    Question {currentQuestionIndex + 1} of {quizQuestions.length}
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-6">
                    {currentQ.text}
                </h3>

                <div className="space-y-3">
                    {currentQ.options.map((option, idx) => {
                        let buttonClass = "w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-gray-700 dark:text-gray-200 ";

                        if (!isAnswerRevealed) {
                            buttonClass += "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-gray-800";
                        } else {
                            if (idx === currentQ.correctAnswer) {
                                buttonClass += "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300";
                            } else if (idx === selectedAnswer) {
                                buttonClass += "border-red-500 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300";
                            } else {
                                buttonClass += "border-gray-200 dark:border-gray-700 opacity-50";
                            }
                        }

                        return (
                            <button
                                key={idx}
                                disabled={isAnswerRevealed}
                                onClick={() => handleSelectOption(idx)}
                                className={buttonClass}
                            >
                                <div className="flex items-center">
                                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 border dark:border-gray-600 mr-4 font-bold text-sm">
                                        {String.fromCharCode(65 + idx)}
                                    </span>
                                    {option}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {isAnswerRevealed && (
                <div className="animate-fade-in mb-8 p-5 rounded-xl border border-purple-100 dark:border-gray-700 bg-purple-50/50 dark:bg-gray-800/50">
                    <h4 className={`font-bold mb-2 ${selectedAnswer === currentQ.correctAnswer ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {selectedAnswer === currentQ.correctAnswer ? '✨ Correct!' : '❌ Incorrect!'}
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {currentQ.explanation}
                    </p>
                </div>
            )}

            <div className="flex justify-end">
                <button
                    onClick={handleNextQuestion}
                    disabled={!isAnswerRevealed}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-all ${isAnswerRevealed
                            ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm focus:ring-2 focus:ring-purple-500'
                            : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        }`}
                >
                    {currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question' : 'View Results'}
                </button>
            </div>
        </div>
    );
}
