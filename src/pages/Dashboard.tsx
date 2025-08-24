import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import TestSeriesList from "@/components/test/TestSeriesList";
import UserResults from "@/components/test/UserResults";
import { usePayment } from "../contexts/PaymentContext";

// Mock data
import { mockTestSeries } from "@/lib/mock-data";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { pay, paymentSwitch } = usePayment();

  const [tests, setTests] = useState(mockTestSeries);
  const [activeTab, setActiveTab] = useState("tests");
  const [pendingTestId, setPendingTestId] = useState<string | null>(null); // track which test is being purchased

  const handleStartTest = (testId: string) => {
    navigate(`/test/${testId}`);
  };

  const handlePurchaseTest = async (testId: string) => {
    try {
      const test = tests.find((t) => t.id === testId);
      if (!test) throw new Error("Test not found");

      setPendingTestId(testId); // remember which test purchase is in progress

      await pay(test.price); // wait for Razorpay/payment flow
    } catch (error) {
      console.error(error);
      toast({
        title: "Payment Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setPendingTestId(null);
    }
  };

  // ✅ React to payment success
  useEffect(() => {
    if (paymentSwitch && pendingTestId) {
      setTests((prevTests) =>
        prevTests.map((t) =>
          t.id === pendingTestId ? { ...t, isPurchased: true } : t
        )
      );

      const purchasedTest = tests.find((t) => t.id === pendingTestId);
      if (purchasedTest) {
        toast({
          title: "Purchase Successful",
          description: `You have purchased the test: ${purchasedTest.title}`,
        });
      }

      setPendingTestId(null); // reset after handling
    }
  }, [paymentSwitch]); // runs when paymentSwitch changes

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-purple-700">MockTest Pro</h1>
            </div>
            <div>
              <Button
                variant="outline"
                onClick={() => {
                  navigate("/");
                  toast({
                    title: "Logged out",
                    description: "You have been logged out successfully",
                  });
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

          <div className="mt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="tests">Available Tests</TabsTrigger>
                <TabsTrigger value="results">My Results</TabsTrigger>
              </TabsList>

              <TabsContent value="tests" className="mt-6">
                <TestSeriesList
                  testSeries={tests}
                  onStartTest={handleStartTest}
                  onPurchaseTest={handlePurchaseTest}
                />
              </TabsContent>

              <TabsContent value="results" className="mt-6">
                <UserResults />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
