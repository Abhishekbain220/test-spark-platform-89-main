
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

// Import mock data
import { mockQuestions, mockTestSeries } from "@/lib/mock-data";

const QuestionManagement = () => {
  const { toast } = useToast();
  const [questions, setQuestions] = useState(mockQuestions);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploadingStatus, setUploadingStatus] = useState<string | null>(null);
  const [selectedTestSeries, setSelectedTestSeries] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "a",
    explanation: "",
    testSeriesId: "",
    subject: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0]);
    }
  };

  const handleUploadCSV = () => {
    if (!csvFile || !selectedTestSeries) {
      toast({
        title: "Error",
        description: "Please select both a CSV file and a test series",
        variant: "destructive",
      });
      return;
    }

    setUploadingStatus("Processing...");
    
    // Read the CSV file
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        if (!event.target?.result) throw new Error("Failed to read file");
        
        const content = event.target.result as string;
        const rows = content.split('\n');
        
        if (rows.length < 2) {
          throw new Error("CSV file is empty or has invalid format");
        }
        
        // Skip header row
        const parsedQuestions = parseCSVToQuestions(rows.slice(1), selectedTestSeries);
        
        // Add new questions to the state
        setQuestions([...questions, ...parsedQuestions]);
        
        setUploadingStatus("Success");
        toast({
          title: "Success",
          description: `${parsedQuestions.length} questions uploaded successfully`,
        });
        
        setTimeout(() => {
          setIsUploadDialogOpen(false);
          setCsvFile(null);
          setUploadingStatus(null);
          setSelectedTestSeries("");
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }, 1500);
      } catch (error) {
        console.error("Error parsing CSV:", error);
        setUploadingStatus("Error");
        toast({
          title: "Upload Failed",
          description: error instanceof Error ? error.message : "Failed to process CSV file",
          variant: "destructive",
        });
      }
    };
    
    reader.onerror = () => {
      setUploadingStatus("Error");
      toast({
        title: "Upload Failed",
        description: "Failed to read the file",
        variant: "destructive",
      });
    };
    
    reader.readAsText(csvFile);
  };

  // Parse CSV rows to question objects
  const parseCSVToQuestions = (rows: string[], testSeriesId: string) => {
    return rows
      .filter(row => row.trim() !== '')
      .map((row, index) => {
        const columns = row.split(',').map(col => col.trim());
        
        if (columns.length < 6) {
          throw new Error(`Line ${index + 2}: Invalid format, not enough columns`);
        }
        
        const [questionText, optionA, optionB, optionC, optionD, correctAnswer, explanation = "", subject = "General"] = columns;
        
        if (!["a", "b", "c", "d"].includes(correctAnswer.toLowerCase())) {
          throw new Error(`Line ${index + 2}: Invalid correct answer '${correctAnswer}', must be one of a, b, c, d`);
        }
        
        return {
          id: `question${Date.now()}_${index}`,
          questionText,
          options: {
            a: optionA,
            b: optionB,
            c: optionC,
            d: optionD,
          },
          correctAnswer: correctAnswer.toLowerCase(),
          explanation,
          testSeriesId,
          subject,
        };
      });
  };

  const handleAddQuestion = () => {
    // Validate required fields
    if (!newQuestion.questionText || !newQuestion.optionA || !newQuestion.optionB || 
        !newQuestion.testSeriesId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would add to the database
    const questionId = `question${Date.now()}`;
    const newQuestionObj = {
      id: questionId,
      questionText: newQuestion.questionText,
      options: {
        a: newQuestion.optionA,
        b: newQuestion.optionB,
        c: newQuestion.optionC,
        d: newQuestion.optionD,
      },
      correctAnswer: newQuestion.correctAnswer,
      explanation: newQuestion.explanation,
      testSeriesId: newQuestion.testSeriesId,
      subject: newQuestion.subject || "General",
    };
    
    setQuestions([...questions, newQuestionObj]);
    setIsAddDialogOpen(false);
    setNewQuestion({
      questionText: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "a",
      explanation: "",
      testSeriesId: "",
      subject: "",
    });
    
    toast({
      title: "Success",
      description: "Question added successfully",
    });
  };

  const handleEditQuestion = () => {
    // Validate required fields
    if (!currentQuestion.questionText || !currentQuestion.optionA || !currentQuestion.optionB || 
        !currentQuestion.testSeriesId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would update the database
    setQuestions(questions.map(question => 
      question.id === currentQuestion.id 
        ? {
            ...question,
            questionText: currentQuestion.questionText,
            options: {
              a: currentQuestion.optionA,
              b: currentQuestion.optionB,
              c: currentQuestion.optionC,
              d: currentQuestion.optionD,
            },
            correctAnswer: currentQuestion.correctAnswer,
            explanation: currentQuestion.explanation,
            testSeriesId: currentQuestion.testSeriesId,
            subject: currentQuestion.subject || "General",
          } 
        : question
    ));
    
    setIsEditDialogOpen(false);
    toast({
      title: "Success",
      description: "Question updated successfully",
    });
  };

  const handleDeleteQuestion = () => {
    // In a real app, this would delete from the database
    setQuestions(questions.filter(question => question.id !== currentQuestion.id));
    setIsDeleteDialogOpen(false);
    toast({
      title: "Success",
      description: "Question deleted successfully",
    });
  };

  // Filter questions based on search query
  const filteredQuestions = questions.filter(question => {
    if (!searchQuery) return true;
    
    const lowerQuery = searchQuery.toLowerCase();
    return (
      question.questionText.toLowerCase().includes(lowerQuery) ||
      question.subject.toLowerCase().includes(lowerQuery) ||
      mockTestSeries.find(t => t.id === question.testSeriesId)?.title.toLowerCase().includes(lowerQuery)
    );
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Questions</h2>
        <div className="space-x-2">
          <Button onClick={() => setIsUploadDialogOpen(true)}>Upload CSV</Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>Add Question</Button>
        </div>
      </div>
      
      <div className="mb-4">
        <Input 
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Question</TableHead>
            <TableHead>Test Series</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredQuestions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                {searchQuery ? "No questions match your search" : "No questions added yet"}
              </TableCell>
            </TableRow>
          ) : (
            filteredQuestions.map((question) => {
              const testSeries = mockTestSeries.find(t => t.id === question.testSeriesId);
              return (
                <TableRow key={question.id}>
                  <TableCell className="font-medium max-w-xs truncate">
                    {question.questionText}
                  </TableCell>
                  <TableCell>{testSeries?.title || "Unknown"}</TableCell>
                  <TableCell>{question.subject}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mr-2"
                      onClick={() => {
                        setCurrentQuestion({
                          ...question,
                          optionA: question.options.a,
                          optionB: question.options.b,
                          optionC: question.options.c,
                          optionD: question.options.d,
                        });
                        setIsEditDialogOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => {
                        setCurrentQuestion(question);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
      
      {/* CSV Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Questions CSV</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="test-series-select">Select Test Series</Label>
              <Select
                value={selectedTestSeries}
                onValueChange={setSelectedTestSeries}
              >
                <SelectTrigger id="test-series-select">
                  <SelectValue placeholder="Select test series" />
                </SelectTrigger>
                <SelectContent>
                  {mockTestSeries.map((test) => (
                    <SelectItem key={test.id} value={test.id}>
                      {test.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="csv-file">Select CSV File</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
            
            <div className="text-sm text-gray-500">
              <p>CSV format should have the following columns:</p>
              <p className="font-mono text-xs mt-1">
                questionText, optionA, optionB, optionC, optionD, correctAnswer, explanation, subject
              </p>
              <p className="text-xs mt-2">
                Example: What is 2+2?, 3, 4, 5, 6, b, Basic addition, Mathematics
              </p>
            </div>

            {uploadingStatus && (
              <div className={`mt-2 text-sm ${
                uploadingStatus === "Success" ? "text-green-600" : 
                uploadingStatus === "Error" ? "text-red-600" : 
                "text-blue-600"
              }`}>
                {uploadingStatus}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsUploadDialogOpen(false);
              setCsvFile(null);
              setSelectedTestSeries("");
              setUploadingStatus(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleUploadCSV}
              disabled={!csvFile || !selectedTestSeries || uploadingStatus === "Processing..."}
            >
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Question Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Question</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="questionText">Question</Label>
              <Textarea
                id="questionText"
                value={newQuestion.questionText}
                onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
                placeholder="Enter the question text"
                className="min-h-20"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="optionA">Option A</Label>
                <Input
                  id="optionA"
                  value={newQuestion.optionA}
                  onChange={(e) => setNewQuestion({ ...newQuestion, optionA: e.target.value })}
                  placeholder="Enter option A"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="optionB">Option B</Label>
                <Input
                  id="optionB"
                  value={newQuestion.optionB}
                  onChange={(e) => setNewQuestion({ ...newQuestion, optionB: e.target.value })}
                  placeholder="Enter option B"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="optionC">Option C</Label>
                <Input
                  id="optionC"
                  value={newQuestion.optionC}
                  onChange={(e) => setNewQuestion({ ...newQuestion, optionC: e.target.value })}
                  placeholder="Enter option C"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="optionD">Option D</Label>
                <Input
                  id="optionD"
                  value={newQuestion.optionD}
                  onChange={(e) => setNewQuestion({ ...newQuestion, optionD: e.target.value })}
                  placeholder="Enter option D"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="correctAnswer">Correct Answer</Label>
                <Select
                  value={newQuestion.correctAnswer}
                  onValueChange={(value) => setNewQuestion({ ...newQuestion, correctAnswer: value })}
                >
                  <SelectTrigger id="correctAnswer">
                    <SelectValue placeholder="Select correct option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">Option A</SelectItem>
                    <SelectItem value="b">Option B</SelectItem>
                    <SelectItem value="c">Option C</SelectItem>
                    <SelectItem value="d">Option D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="testSeries">Test Series</Label>
                <Select
                  value={newQuestion.testSeriesId}
                  onValueChange={(value) => setNewQuestion({ ...newQuestion, testSeriesId: value })}
                >
                  <SelectTrigger id="testSeries">
                    <SelectValue placeholder="Select test series" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTestSeries.map((test) => (
                      <SelectItem key={test.id} value={test.id}>
                        {test.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={newQuestion.subject}
                onChange={(e) => setNewQuestion({ ...newQuestion, subject: e.target.value })}
                placeholder="Enter subject (e.g., Mathematics, Science)"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="explanation">Explanation (Optional)</Label>
              <Textarea
                id="explanation"
                value={newQuestion.explanation}
                onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                placeholder="Enter explanation for the correct answer (optional)"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddQuestion}>
              Add Question
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Question Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
          </DialogHeader>
          
          {currentQuestion && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-questionText">Question</Label>
                <Textarea
                  id="edit-questionText"
                  value={currentQuestion.questionText}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, questionText: e.target.value })}
                  className="min-h-20"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-optionA">Option A</Label>
                  <Input
                    id="edit-optionA"
                    value={currentQuestion.optionA}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, optionA: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-optionB">Option B</Label>
                  <Input
                    id="edit-optionB"
                    value={currentQuestion.optionB}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, optionB: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-optionC">Option C</Label>
                  <Input
                    id="edit-optionC"
                    value={currentQuestion.optionC}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, optionC: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-optionD">Option D</Label>
                  <Input
                    id="edit-optionD"
                    value={currentQuestion.optionD}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, optionD: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-correctAnswer">Correct Answer</Label>
                  <Select
                    value={currentQuestion.correctAnswer}
                    onValueChange={(value) => setCurrentQuestion({ ...currentQuestion, correctAnswer: value })}
                  >
                    <SelectTrigger id="edit-correctAnswer">
                      <SelectValue placeholder="Select correct option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a">Option A</SelectItem>
                      <SelectItem value="b">Option B</SelectItem>
                      <SelectItem value="c">Option C</SelectItem>
                      <SelectItem value="d">Option D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-testSeries">Test Series</Label>
                  <Select
                    value={currentQuestion.testSeriesId}
                    onValueChange={(value) => setCurrentQuestion({ ...currentQuestion, testSeriesId: value })}
                  >
                    <SelectTrigger id="edit-testSeries">
                      <SelectValue placeholder="Select test series" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTestSeries.map((test) => (
                        <SelectItem key={test.id} value={test.id}>
                          {test.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-subject">Subject</Label>
                <Input
                  id="edit-subject"
                  value={currentQuestion.subject}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, subject: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-explanation">Explanation (Optional)</Label>
                <Textarea
                  id="edit-explanation"
                  value={currentQuestion.explanation}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanation: e.target.value })}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditQuestion}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p>Are you sure you want to delete this question?</p>
            {currentQuestion && (
              <p className="font-medium mt-2 line-clamp-2">{currentQuestion.questionText}</p>
            )}
            <p className="text-sm text-red-500 mt-2">
              This action cannot be undone.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteQuestion}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuestionManagement;
