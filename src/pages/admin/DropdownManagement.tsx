import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { customToast } from "@/components/ui/sonner";
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Settings,
  List,
  RefreshCw,
  Eye,
  EyeOff,
  Database,
  Tag,
  Layers,
  GripVertical,
} from "lucide-react";
import {
  getAllDropdownCategories,
  getDropdownOptions,
  getAdminDropdownOptions,
  createDropdownOption,
  updateDropdownOption,
  deleteDropdownOption,
  toggleDropdownActive,
  updateDropdownSortOrder,
} from "@/apis/dropdowns";
import type {
  DropdownOption,
  DropdownCategory,
  CreateDropdownOptionRequest,
  UpdateDropdownOptionRequest,
} from "@/types/dropdown";
import { CATEGORY_DISPLAY_NAMES, CATEGORIES_WITH_PARENTS } from "@/types/dropdown";

// ============================================
// SKELETON COMPONENT
// ============================================

const DropdownManagementSkeleton = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-10 w-32" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-24" />
      ))}
    </div>
    <Skeleton className="h-[400px]" />
  </div>
);

// ============================================
// HELPER FUNCTIONS
// ============================================

const getStatusColor = (isActive: boolean) => {
  return isActive
    ? "bg-brand-accent-green text-white"
    : "bg-gray-500 text-white";
};

// ============================================
// MAIN COMPONENT
// ============================================

const DropdownManagement = () => {
  // State
  const [categories, setCategories] = useState<DropdownCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [options, setOptions] = useState<DropdownOption[]>([]);
  const [parentOptions, setParentOptions] = useState<DropdownOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(null);

  // Form state for add/edit
  const [formData, setFormData] = useState<CreateDropdownOptionRequest>({
    category: "",
    value: "",
    label: "",
    description: "",
    parentValue: "",
    isActive: true,
    color: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ============================================
  // DATA FETCHING
  // ============================================

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAllDropdownCategories();
      setCategories(data);
      if (data.length > 0 && !selectedCategory) {
        setSelectedCategory(data[0].category);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      customToast.error("Failed to load dropdown categories");
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory]);

  const fetchOptions = useCallback(async () => {
    if (!selectedCategory) return;

    try {
      setIsLoadingOptions(true);
      const data = await getDropdownOptions(selectedCategory, true);
      setOptions(data);

      // If this category has a parent, fetch parent options
      const parentCategory = CATEGORIES_WITH_PARENTS[selectedCategory];
      if (parentCategory) {
        const parentData = await getDropdownOptions(parentCategory, true);
        setParentOptions(parentData);
      } else {
        setParentOptions([]);
      }
    } catch (error) {
      console.error("Failed to fetch options:", error);
      customToast.error("Failed to load dropdown options");
    } finally {
      setIsLoadingOptions(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchOptions();
    }
  }, [selectedCategory, fetchOptions]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleAddOption = () => {
    setFormData({
      category: selectedCategory || "",
      value: "",
      label: "",
      description: "",
      parentValue: "",
      isActive: true,
      color: "",
    });
    setAddModalOpen(true);
  };

  const handleEditOption = (option: DropdownOption) => {
    setSelectedOption(option);
    setFormData({
      category: option.category,
      value: option.value,
      label: option.label,
      description: option.description || "",
      parentValue: option.parentValue || "",
      parentCategory: option.parentCategory || undefined,
      isActive: option.isActive,
      color: option.color || "",
    });
    setEditModalOpen(true);
  };

  const handleDeleteOption = (option: DropdownOption) => {
    setSelectedOption(option);
    setDeleteDialogOpen(true);
  };

  const handleToggleActive = async (option: DropdownOption) => {
    try {
      await toggleDropdownActive(option._id);
      customToast.success(`Option ${option.isActive ? "deactivated" : "activated"} successfully`);
      fetchOptions();
    } catch (error) {
      console.error("Failed to toggle option:", error);
      customToast.error("Failed to update option status");
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const updates = [
      { id: options[index]._id, sortOrder: options[index - 1].sortOrder },
      { id: options[index - 1]._id, sortOrder: options[index].sortOrder },
    ];
    try {
      await updateDropdownSortOrder(updates);
      fetchOptions();
    } catch (error) {
      customToast.error("Failed to reorder options");
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === options.length - 1) return;
    const updates = [
      { id: options[index]._id, sortOrder: options[index + 1].sortOrder },
      { id: options[index + 1]._id, sortOrder: options[index].sortOrder },
    ];
    try {
      await updateDropdownSortOrder(updates);
      fetchOptions();
    } catch (error) {
      customToast.error("Failed to reorder options");
    }
  };

  const handleSubmitAdd = async () => {
    if (!formData.value || !formData.label) {
      customToast.error("Value and Label are required");
      return;
    }

    try {
      setIsSubmitting(true);

      const requestData: CreateDropdownOptionRequest = {
        ...formData,
        category: selectedCategory || formData.category,
      };

      // Add parent relationship if applicable
      const parentCategory = CATEGORIES_WITH_PARENTS[selectedCategory || ""];
      if (parentCategory && formData.parentValue) {
        requestData.parentCategory = parentCategory;
        requestData.parentValue = formData.parentValue;
      }

      await createDropdownOption(requestData);
      customToast.success("Option created successfully");
      setAddModalOpen(false);
      fetchOptions();
      fetchCategories(); // Refresh counts
    } catch (error: any) {
      console.error("Failed to create option:", error);
      customToast.error(error.response?.data?.message || "Failed to create option");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitEdit = async () => {
    if (!selectedOption || !formData.value || !formData.label) {
      customToast.error("Value and Label are required");
      return;
    }

    try {
      setIsSubmitting(true);

      const requestData: UpdateDropdownOptionRequest = {
        value: formData.value,
        label: formData.label,
        description: formData.description,
        isActive: formData.isActive,
        color: formData.color,
      };

      // Add parent relationship if applicable
      const parentCategory = CATEGORIES_WITH_PARENTS[selectedCategory || ""];
      if (parentCategory) {
        requestData.parentCategory = parentCategory;
        requestData.parentValue = formData.parentValue;
      }

      await updateDropdownOption(selectedOption._id, requestData);
      customToast.success("Option updated successfully");
      setEditModalOpen(false);
      fetchOptions();
    } catch (error: any) {
      console.error("Failed to update option:", error);
      customToast.error(error.response?.data?.message || "Failed to update option");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedOption) return;

    try {
      await deleteDropdownOption(selectedOption._id);
      customToast.success("Option deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedOption(null);
      fetchOptions();
      fetchCategories(); // Refresh counts
    } catch (error: any) {
      console.error("Failed to delete option:", error);
      customToast.error(error.response?.data?.message || "Failed to delete option");
    }
  };

  // Reset page when search term or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Filter options based on search
  const filteredOptions = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opt.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalItems = filteredOptions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedOptions = filteredOptions.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  // Get display name for category
  const getCategoryDisplayName = (category: string) => {
    return CATEGORY_DISPLAY_NAMES[category] || category;
  };

  // ============================================
  // RENDER
  // ============================================

  if (isLoading) {
    return (
      <DashboardLayout role="admin">
        <div className="p-6">
          <DropdownManagementSkeleton />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dropdown Management</h1>
            <p className="text-muted-foreground">
              Manage all dropdown options used throughout the application
            </p>
          </div>
          <Button onClick={handleAddOption} disabled={!selectedCategory}>
            <Plus className="w-4 h-4 mr-2" />
            Add Option
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Options</CardTitle>
              <List className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {categories.reduce((sum, cat) => sum + cat.totalCount, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Options</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {categories.reduce((sum, cat) => sum + cat.activeCount, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive Options</CardTitle>
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {categories.reduce((sum, cat) => sum + (cat.totalCount - cat.activeCount), 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
              <CardDescription>Select a category to manage</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y max-h-[500px] overflow-y-auto">
                {categories.map((cat) => (
                  <button
                    key={cat.category}
                    onClick={() => setSelectedCategory(cat.category)}
                    className={`w-full px-4 py-3 text-left hover:bg-muted transition-colors ${
                      selectedCategory === cat.category ? "bg-muted border-l-4 border-primary" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">
                          {getCategoryDisplayName(cat.category)}
                        </p>
                        <p className="text-xs text-muted-foreground">{cat.category}</p>
                      </div>
                      <Badge variant="secondary">{cat.totalCount}</Badge>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Options Table */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>
                    {selectedCategory
                      ? getCategoryDisplayName(selectedCategory)
                      : "Select a Category"}
                  </CardTitle>
                  <CardDescription>
                    {selectedCategory
                      ? `Manage options for ${getCategoryDisplayName(selectedCategory)}`
                      : "Choose a category from the sidebar"}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search options..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline" size="icon" onClick={fetchOptions}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingOptions ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : !selectedCategory ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a category from the sidebar to view and manage options</p>
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No options found</p>
                  <Button variant="outline" className="mt-4" onClick={handleAddOption}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Option
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Order</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Label</TableHead>
                        {CATEGORIES_WITH_PARENTS[selectedCategory] && (
                          <TableHead>Parent</TableHead>
                        )}
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedOptions.map((option, index) => {
                        const actualIndex = startIndex + index;
                        return (
                          <TableRow key={option._id}>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                                <div className="flex flex-col">
                                  <button
                                    onClick={() => handleMoveUp(actualIndex)}
                                    disabled={actualIndex === 0}
                                    className="p-0.5 hover:bg-muted rounded disabled:opacity-30"
                                  >
                                    <ChevronUp className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => handleMoveDown(actualIndex)}
                                    disabled={actualIndex === filteredOptions.length - 1}
                                    className="p-0.5 hover:bg-muted rounded disabled:opacity-30"
                                  >
                                    <ChevronDown className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm">{option.value}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {option.color && (
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: option.color }}
                                  />
                                )}
                                {option.label}
                              </div>
                            </TableCell>
                            {CATEGORIES_WITH_PARENTS[selectedCategory] && (
                              <TableCell>
                                <Badge variant="outline">{option.parentValue || "—"}</Badge>
                              </TableCell>
                            )}
                            <TableCell>
                              <Badge className={getStatusColor(option.isActive)}>
                                {option.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEditOption(option)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleToggleActive(option)}>
                                    {option.isActive ? (
                                      <>
                                        <EyeOff className="h-4 w-4 mr-2" />
                                        Deactivate
                                      </>
                                    ) : (
                                      <>
                                        <Eye className="h-4 w-4 mr-2" />
                                        Activate
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteOption(option)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t pt-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>
                          Showing {startIndex + 1} to {endIndex} of {totalItems} options
                        </span>
                        <span className="text-muted-foreground">|</span>
                        <div className="flex items-center gap-2">
                          <span>Per page:</span>
                          <Select
                            value={itemsPerPage.toString()}
                            onValueChange={(value) => {
                              setItemsPerPage(Number(value));
                              setCurrentPage(1);
                            }}
                          >
                            <SelectTrigger className="w-20 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="20">20</SelectItem>
                              <SelectItem value="50">50</SelectItem>
                              <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={goToFirstPage}
                          disabled={currentPage === 1}
                        >
                          <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={goToPreviousPage}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center gap-1 mx-2">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum: number;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
                            return (
                              <Button
                                key={pageNum}
                                variant={currentPage === pageNum ? "default" : "outline"}
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => goToPage(pageNum)}
                              >
                                {pageNum}
                              </Button>
                            );
                          })}
                        </div>

                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={goToNextPage}
                          disabled={currentPage === totalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={goToLastPage}
                          disabled={currentPage === totalPages}
                        >
                          <ChevronsRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add Option Modal */}
        <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Option</DialogTitle>
              <DialogDescription>
                Add a new option to {selectedCategory ? getCategoryDisplayName(selectedCategory) : "the selected category"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="value">Value *</Label>
                <Input
                  id="value"
                  placeholder="e.g., full_time"
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value.toLowerCase().replace(/\s+/g, "_") })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Internal value stored in the database (auto-formatted)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="label">Label *</Label>
                <Input
                  id="label"
                  placeholder="e.g., Full-time"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">Display text shown to users</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Optional description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              {CATEGORIES_WITH_PARENTS[selectedCategory || ""] && (
                <div className="space-y-2">
                  <Label htmlFor="parentValue">Parent Option</Label>
                  <Select
                    value={formData.parentValue}
                    onValueChange={(value) => setFormData({ ...formData, parentValue: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent option" />
                    </SelectTrigger>
                    <SelectContent>
                      {parentOptions.map((opt) => (
                        <SelectItem key={opt._id} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="color">Color (optional)</Label>
                <div className="flex gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={formData.color || "#000000"}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    placeholder="#000000"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitAdd} disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Option"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Option Modal */}
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Option</DialogTitle>
              <DialogDescription>
                Update the option details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-value">Value *</Label>
                <Input
                  id="edit-value"
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value.toLowerCase().replace(/\s+/g, "_") })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-label">Label *</Label>
                <Input
                  id="edit-label"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              {CATEGORIES_WITH_PARENTS[selectedCategory || ""] && (
                <div className="space-y-2">
                  <Label htmlFor="edit-parentValue">Parent Option</Label>
                  <Select
                    value={formData.parentValue}
                    onValueChange={(value) => setFormData({ ...formData, parentValue: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent option" />
                    </SelectTrigger>
                    <SelectContent>
                      {parentOptions.map((opt) => (
                        <SelectItem key={opt._id} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="edit-color">Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="edit-color"
                    type="color"
                    value={formData.color || "#000000"}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="edit-isActive">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitEdit} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Option</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{selectedOption?.label}"? This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default DropdownManagement;
