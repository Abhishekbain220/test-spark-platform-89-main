
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TestSeries {
  id: string;
  title: string;
  description: string;
  price: number;
  isPurchased?: boolean;
}

interface TestSeriesListProps {
  testSeries: TestSeries[];
  onStartTest: (testId: string) => void;
  onPurchaseTest: (testId: string) => void;
}

const TestSeriesList = ({ testSeries, onStartTest, onPurchaseTest }: TestSeriesListProps) => {
  if (testSeries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-500">No test series available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {testSeries.map((test) => (
        <Card key={test.id} className="overflow-hidden">
          <CardHeader className="bg-purple-50">
            <CardTitle>{test.title}</CardTitle>
            <CardDescription>{test.description}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="text-lg font-medium">₹{test.price}</p>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-500">Status</p>
                <p className={`text-sm font-medium ${test.isPurchased ? 'text-green-600' : 'text-amber-600'}`}>
                  {test.isPurchased ? 'Purchased' : 'Available'}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-gray-50 px-6 py-3">
            {test.isPurchased ? (
              <Button 
                className="w-full" 
                onClick={() => onStartTest(test.id)}
              >
                Start Test
              </Button>
            ) : (
              <Button 
                className="w-full" 
                onClick={() => onPurchaseTest(test.id)}
              >
                Purchase (₹{test.price})
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default TestSeriesList;
