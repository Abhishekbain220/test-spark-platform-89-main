
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface QuestionOption {
  [key: string]: string;
}

interface Question {
  id: string;
  questionText: string;
  options: QuestionOption;
  correctAnswer: string;
  explanation?: string;
}

interface QuestionCardProps {
  question: Question;
  selectedAnswer: string;
  onAnswerSelect: (questionId: string, answer: string) => void;
}

const QuestionCard = ({ question, selectedAnswer, onAnswerSelect }: QuestionCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{question.questionText}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={selectedAnswer} 
          onValueChange={(value) => onAnswerSelect(question.id, value)}
          className="space-y-3"
        >
          {Object.entries(question.options).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-2">
              <RadioGroupItem value={key} id={`option-${question.id}-${key}`} />
              <Label 
                htmlFor={`option-${question.id}-${key}`}
                className="text-base font-normal cursor-pointer"
              >
                {value}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
