
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import QuestionCard from "@/components/test/QuestionCard";

// Import mock data
import { mockTestSeries, mockQuestions } from "@/lib/mock-data";

const TestPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [testScore, setTestScore] = useState<{total: number, correct: number} | null>(null);
  
  // Find the test series from mock data
  const testSeries = mockTestSeries.find(test => test.id === testId);
  const questions = mockQuestions.filter(q => q.testSeriesId === testId);
  
  // Handle timer
  useEffect(() => {
    if (testCompleted) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [testCompleted]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleAnswerSelect = (questionId: string, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  const handleSubmitTest = () => {
    // Calculate score
    let correctCount = 0;
    
    questions.forEach(question => {
      if (userAnswers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });
    
    setTestScore({
      total: questions.length,
      correct: correctCount
    });
    
    setTestCompleted(true);
    setIsSubmitDialogOpen(false);
    
    // In a real app, save the result to the database
    toast({
      title: "Test Submitted",
      description: `Your score: ${correctCount}/${questions.length}`,
    });
  };
  
  // If test not found
  if (!testSeries || !questions.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Test not found</h1>
          <p className="mt-2 text-gray-600">The test you're looking for doesn't exist.</p>
          <Button className="mt-4" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  // If test is completed, show results
  if (testCompleted && testScore) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900">Test Results</h1>
            <h2 className="text-lg text-gray-700 mt-2">{testSeries.title}</h2>
            
            <div className="mt-8 text-center">
              <div className="text-5xl font-bold text-purple-700">
                {testScore.correct}/{testScore.total}
              </div>
              <p className="mt-2 text-lg text-gray-600">
                {Math.round((testScore.correct / testScore.total) * 100)}% Score
              </p>
              
              <div className="mt-6">
                <Progress value={(testScore.correct / testScore.total) * 100} className="h-2" />
              </div>
            </div>
            
            <div className="mt-8 space-y-4">
              {questions.map((question, index) => (
                <div 
                  key={question.id} 
                  className={`p-4 rounded-lg border ${
                    userAnswers[question.id] === question.correctAnswer 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex justify-between">
                    <h3 className="font-medium">Question {index + 1}</h3>
                    <span className={userAnswers[question.id] === question.correctAnswer ? 'text-green-600' : 'text-red-600'}>
                      {userAnswers[question.id] === question.correctAnswer ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  <p className="mt-2">{question.questionText}</p>
                  
                  <div className="mt-2 text-sm">
                    <p>Your answer: {userAnswers[question.id] ? question.options[userAnswers[question.id] as keyof typeof question.options] : 'Not answered'}</p>
                    <p className="text-green-600">Correct answer: {question.options[question.correctAnswer]}</p>
                  </div>
                  
                  {question.explanation && (
                    <div className="mt-2 text-sm bg-blue-50 p-2 rounded">
                      <p className="font-medium">Explanation:</p>
                      <p>{question.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex justify-center">
              <Button onClick={() => navigate("/dashboard")}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Active test UI
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with timer */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900 truncate">
              {testSeries.title}
            </h1>
            <div className="flex items-center">
              <div className={`text-lg font-medium ${timeLeft < 300 ? 'text-red-600' : 'text-gray-700'}`}>
                {formatTime(timeLeft)}
              </div>
              <Button 
                variant="destructive" 
                className="ml-4"
                onClick={() => setIsSubmitDialogOpen(true)}
              >
                Submit Test
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Test content */}
      <div className="py-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress indicator */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-sm text-gray-500">
                {Object.keys(userAnswers).length} answered
              </span>
            </div>
            <Progress 
              value={(currentQuestionIndex / (questions.length - 1)) * 100} 
              className="h-1"
            />
          </div>
          
          {/* Current question */}
          {questions[currentQuestionIndex] && (
            <QuestionCard
              question={questions[currentQuestionIndex]}
              selectedAnswer={userAnswers[questions[currentQuestionIndex].id] || ''}
              onAnswerSelect={handleAnswerSelect}
            />
          )}
          
          {/* Navigation buttons */}
          <div className="mt-6 flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            
            {currentQuestionIndex < questions.length - 1 ? (
              <Button onClick={handleNextQuestion}>
                Next
              </Button>
            ) : (
              <Button 
                variant="default"
                onClick={() => setIsSubmitDialogOpen(true)}
              >
                Finish Test
              </Button>
            )}
          </div>
          
          {/* Question navigator */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Questions</h3>
            <div className="grid grid-cols-10 gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  className={`h-8 w-8 flex items-center justify-center rounded-full text-sm 
                    ${currentQuestionIndex === index 
                      ? 'bg-purple-600 text-white' 
                      : userAnswers[questions[index].id] 
                        ? 'bg-purple-100 text-purple-700 border border-purple-300' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Submit confirmation dialog */}
      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Test</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your test? You won't be able to change your answers after submission.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-gray-700">
              {Object.keys(userAnswers).length} of {questions.length} questions answered
            </p>
            {Object.keys(userAnswers).length < questions.length && (
              <p className="text-sm text-amber-600 mt-2">
                Warning: You haven't answered all questions.
              </p>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleSubmitTest}>
              Submit Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestPage;
