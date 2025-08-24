
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

// Import mock data
import { mockTestSeries } from "@/lib/mock-data";

const TestSeriesManagement = () => {
  const { toast } = useToast();
  const [tests, setTests] = useState(mockTestSeries);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTest, setCurrentTest] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newTest, setNewTest] = useState({
    title: "",
    description: "",
    price: 20,
  });

  const handleAddTest = () => {
    // Form validation
    if (!newTest.title || !newTest.description) {
      toast({
        title: "Validation Error",
        description: "Title and description are required",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would add to the database
    const testId = `test${Date.now()}`;
    setTests([...tests, { id: testId, ...newTest, isPurchased: false }]);
    setIsAddDialogOpen(false);
    setNewTest({ title: "", description: "", price: 20 });
    toast({
      title: "Success",
      description: "Test series added successfully",
    });
  };

  const handleEditTest = () => {
    // Form validation
    if (!currentTest.title || !currentTest.description) {
      toast({
        title: "Validation Error",
        description: "Title and description are required",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would update the database
    setTests(tests.map(test => 
      test.id === currentTest.id ? { ...test, ...currentTest } : test
    ));
    setIsEditDialogOpen(false);
    toast({
      title: "Success",
      description: "Test series updated successfully",
    });
  };

  const handleDeleteTest = () => {
    // In a real app, this would delete from the database
    setTests(tests.filter(test => test.id !== currentTest.id));
    setIsDeleteDialogOpen(false);
    toast({
      title: "Success",
      description: "Test series deleted successfully",
    });
  };

  // Filter test series based on search query
  const filteredTests = tests.filter(test => {
    if (!searchQuery) return true;
    const lowerQuery = searchQuery.toLowerCase();
    return (
      test.title.toLowerCase().includes(lowerQuery) ||
      test.description.toLowerCase().includes(lowerQuery)
    );
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Test Series</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>Add New Test Series</Button>
      </div>
      
      <div className="mb-4">
        <Input
          placeholder="Search test series..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price (₹)</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                {searchQuery ? "No test series match your search" : "No test series added yet"}
              </TableCell>
            </TableRow>
          ) : (
            filteredTests.map((test) => (
              <TableRow key={test.id}>
                <TableCell className="font-medium">{test.title}</TableCell>
                <TableCell className="max-w-xs truncate">{test.description}</TableCell>
                <TableCell>{test.price}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mr-2"
                    onClick={() => {
                      setCurrentTest(test);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => {
                      setCurrentTest(test);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {/* Add Test Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Test Series</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newTest.title}
                onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
                placeholder="Enter test series title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newTest.description}
                onChange={(e) => setNewTest({ ...newTest, description: e.target.value })}
                placeholder="Enter description"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                value={newTest.price}
                onChange={(e) => setNewTest({ ...newTest, price: Number(e.target.value) || 0 })}
                min={0}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTest}>
              Add Test Series
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Test Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Test Series</DialogTitle>
          </DialogHeader>
          
          {currentTest && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={currentTest.title}
                  onChange={(e) => setCurrentTest({ ...currentTest, title: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={currentTest.description}
                  onChange={(e) => setCurrentTest({ ...currentTest, description: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price (₹)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={currentTest.price}
                  onChange={(e) => setCurrentTest({ ...currentTest, price: Number(e.target.value) || 0 })}
                  min={0}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditTest}>
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
            <p>Are you sure you want to delete this test series?</p>
            {currentTest && (
              <p className="font-medium mt-2">{currentTest.title}</p>
            )}
            <p className="text-sm text-red-500 mt-2">
              This action cannot be undone.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTest}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestSeriesManagement;
