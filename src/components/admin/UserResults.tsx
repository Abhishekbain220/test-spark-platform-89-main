
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for user test results
const mockUserResults = [
  {
    id: "result1",
    userId: "user1",
    userName: "John Doe",
    userEmail: "john@example.com",
    testId: "test1",
    testName: "Basic Mathematics",
    score: 8,
    totalQuestions: 10,
    date: "2023-04-15T09:30:00",
  },
  {
    id: "result2",
    userId: "user2",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    testId: "test2",
    testName: "General Knowledge",
    score: 15,
    totalQuestions: 20,
    date: "2023-04-10T14:45:00",
  },
  {
    id: "result3",
    userId: "user3",
    userName: "Bob Johnson",
    userEmail: "bob@example.com",
    testId: "test3",
    testName: "English Grammar",
    score: 18,
    totalQuestions: 25,
    date: "2023-04-05T11:15:00",
  },
  {
    id: "result4",
    userId: "user1",
    userName: "John Doe",
    userEmail: "john@example.com",
    testId: "test2",
    testName: "General Knowledge",
    score: 16,
    totalQuestions: 20,
    date: "2023-04-12T10:15:00",
  },
];

const UserResults = () => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">User Test Results</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Tests Taken
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUserResults.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Average Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                (mockUserResults.reduce((acc, result) => acc + (result.score / result.totalQuestions * 100), 0) / 
                mockUserResults.length)
              )}%
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Unique Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(mockUserResults.map(result => result.userId)).size}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Tests This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUserResults.length}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Detailed Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Test Name</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUserResults.map((result) => {
                const percentage = Math.round((result.score / result.totalQuestions) * 100);
                const formattedDate = new Date(result.date).toLocaleDateString();
                
                return (
                  <TableRow key={result.id}>
                    <TableCell>
                      <div>{result.userName}</div>
                      <div className="text-sm text-gray-500">{result.userEmail}</div>
                    </TableCell>
                    <TableCell>{result.testName}</TableCell>
                    <TableCell>
                      <div>{result.score}/{result.totalQuestions}</div>
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
                    <TableCell>{formattedDate}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserResults;
