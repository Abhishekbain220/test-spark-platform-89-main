
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import axios from "../components/utils/axios";
const Index = () => {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();

  // Temporary mock login function
  const handleMockLogin = () => {
    setIsLoggedIn(true);
    setAuthDialogOpen(false);
    toast({
      title: "Success",
      description: "You have been logged in. This is a mock implementation.",
    });
  };

  // Logout handler
  let logoutHandler = async () => {
    try {
      let {data}=await axios.get("/user/logout")
      setIsLoggedIn(false);
      console.log(data)
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    } catch (error) {
      console.log(error)
    }
  }
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
              {!isLoggedIn ? (
                <Button onClick={() => setAuthDialogOpen(true)}>Login / Register</Button>
              ) : (
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => window.location.href = "/dashboard"}>
                    Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    onClick={logoutHandler}
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="py-12 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-purple-600 font-semibold tracking-wide uppercase">
              Prepare Better
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              The best way to prepare for your exams
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Practice with real exam-like tests. Get instant results and improve your skills.
            </p>
            <div className="mt-8">
              <Button
                size="lg"
                onClick={() => {
                  if (isLoggedIn) {
                    window.location.href = "/dashboard";
                  } else {
                    setAuthDialogOpen(true);
                  }
                }}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-10">
            <h2 className="text-base text-purple-600 font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to excel
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Realistic Mock Tests",
                  description: "Practice with tests that simulate the actual exam environment"
                },
                {
                  title: "Instant Results",
                  description: "Get your score and detailed analysis immediately after submission"
                },
                {
                  title: "Progress Tracking",
                  description: "Monitor your improvement over time with detailed analytics"
                },
                {
                  title: "Subject-wise Tests",
                  description: "Focus on specific topics that need improvement"
                },
                {
                  title: "Affordable Pricing",
                  description: "Access high-quality tests at just ₹20 each"
                },
                {
                  title: "Explanations",
                  description: "Learn from detailed explanations for each question"
                }
              ].map((feature, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Login/Register Dialog */}
      <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Authentication</DialogTitle>
            <DialogDescription>
              Login or create an account to access mock tests
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm onSuccess={handleMockLogin} />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm onSuccess={handleMockLogin} />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
