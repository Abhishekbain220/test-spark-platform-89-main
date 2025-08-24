
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for user test results
const mockResults = [
  {
    id: "result1",
    testId: "test1",
    testName: "Basic Mathematics",
    score: 8,
    totalQuestions: 10,
    date: "2023-04-15T09:30:00",
  },
  {
    id: "result2",
    testId: "test2",
    testName: "General Knowledge",
    score: 15,
    totalQuestions: 20,
    date: "2023-04-10T14:45:00",
  },
  {
    id: "result3",
    testId: "test3",
    testName: "English Grammar",
    score: 18,
    totalQuestions: 25,
    date: "2023-04-05T11:15:00",
  },
];

const UserResults = () => {
  const [results, setResults] = useState(mockResults);

  // This would fetch user's test results from the database in a real app
  useEffect(() => {
    // Simulate API call
    setResults(mockResults);
  }, []);

  if (results.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-gray-500">
            You haven't completed any tests yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Test Results</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test Name</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Percentage</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result) => {
              const percentage = Math.round((result.score / result.totalQuestions) * 100);
              const formattedDate = new Date(result.date).toLocaleDateString();
              
              return (
                <TableRow key={result.id}>
                  <TableCell className="font-medium">{result.testName}</TableCell>
                  <TableCell>
                    {result.score}/{result.totalQuestions}
                  </TableCell>
                  <TableCell>
                    <span 
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        percentage >= 70 
                          ? 'bg-green-100 text-green-800' 
                          : percentage >= 40 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {percentage}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{formattedDate}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UserResults;
