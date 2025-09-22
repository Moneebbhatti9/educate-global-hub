import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Upload,
  X,
  Plus,
  Eye,
  DollarSign,
  FileText,
  Image as ImageIcon,
  Save,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/layout/DashboardLayout";
import {
  resourceApi,
  RESOURCE_TYPES,
  AGE_RANGES,
  CURRICULUMS,
  CURRICULUM_TYPES,
  SUBJECTS,
  CURRENCIES,
} from "@/apis/resources";

// Form validation schema
const resourceSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(45, "Aim for 35-45 characters for your title"),
  description: z.string().min(1, "Description is required"),
  resourceType: z.string().min(1, "Resource type is required"),
  ageRange: z.string().min(1, "Age range is required"),
  curriculum: z.string().min(1, "Curriculum is required"),
  curriculumType: z.string().min(1, "Curriculum type is required"),
  subject: z.string().min(1, "Subject is required"),
  isFree: z.enum(["free", "paid"]),
  price: z.number().optional(),
  currency: z.string().optional(),
});

type ResourceFormData = z.infer<typeof resourceSchema>;

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

// Convert arrays to select options format
const RESOURCE_TYPE_OPTIONS = RESOURCE_TYPES.map((type) => ({
  value: type,
  label: type,
}));
const AGE_RANGE_OPTIONS = AGE_RANGES.map((age) => ({ value: age, label: age }));
const CURRICULUM_OPTIONS = CURRICULUMS.map((curriculum) => ({
  value: curriculum,
  label: curriculum,
}));
const CURRICULUM_TYPE_OPTIONS = CURRICULUM_TYPES.map((type) => ({
  value: type,
  label: type,
}));
const SUBJECT_OPTIONS = SUBJECTS.map((subject) => ({
  value: subject,
  label: subject,
}));
const CURRENCY_OPTIONS = CURRENCIES.map((currency) => ({
  value: currency.code,
  label: `${currency.symbol} ${currency.name}`,
}));

const UploadResource = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const form = useForm<ResourceFormData>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      isFree: "free",
      currency: "USD",
    },
  });

  // File upload states
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [previewImages, setPreviewImages] = useState<File[]>([]);
  const [resourceFiles, setResourceFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // UI states
  const [activeTab, setActiveTab] = useState("details");
  const [expectedEarnings, setExpectedEarnings] = useState(0);
  const [currentRoyaltyTier, setCurrentRoyaltyTier] = useState("Bronze (60%)");

  const watchIsFree = form.watch("isFree");
  const watchPrice = form.watch("price");

  // Calculate expected earnings when price changes
  const calculateEarnings = (price: number) => {
    const royaltyRate = 0.6; // Bronze tier
    const transactionFee = price < 3 ? 0.2 : 0;
    const vatRate = 0.2;

    const afterVat = price * (1 - vatRate);
    const afterFees = afterVat - transactionFee;
    const earnings = afterFees * royaltyRate;

    setExpectedEarnings(Math.max(0, earnings));
  };

  // Handle file uploads
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Banner image must be under 5MB",
          variant: "destructive",
        });
        return;
      }
      setBannerImage(file);
    }
  };

  const handlePreviewUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const isPaid = watchIsFree === "paid";
    const maxFiles = isPaid ? 5 : 1;

    if (previewImages.length + files.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `${
          isPaid ? "Paid" : "Free"
        } resources can have maximum ${maxFiles} preview image${
          maxFiles > 1 ? "s" : ""
        }`,
        variant: "destructive",
      });
      return;
    }

    const validFiles = files.filter((file) => {
      if (file.size > 3 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is over 3MB limit`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    setPreviewImages((prev) => [...prev, ...validFiles]);
  };

  const handleResourceFilesUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);

    if (totalSize > 500 * 1024 * 1024) {
      toast({
        title: "Files too large",
        description: "Total file size must be under 500MB",
        variant: "destructive",
      });
      return;
    }

    setResourceFiles((prev) => [...prev, ...files]);
  };

  const removePreviewImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeResourceFile = (index: number) => {
    setResourceFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Form submission
  const onSubmit = async (data: ResourceFormData) => {
    const isPaid = data.isFree === "paid";

    // Validation checks
    if (!bannerImage) {
      toast({
        title: "Banner image required",
        description: "Please upload a banner image for your resource",
        variant: "destructive",
      });
      return;
    }

    if (isPaid && previewImages.length < 5) {
      toast({
        title: "Preview images required",
        description: "Paid resources must have exactly 5 preview images",
        variant: "destructive",
      });
      return;
    }

    if (!isPaid && previewImages.length < 1) {
      toast({
        title: "Preview image required",
        description: "Free resources must have at least 1 preview image",
        variant: "destructive",
      });
      return;
    }

    if (isPaid && (!data.price || data.price <= 0)) {
      toast({
        title: "Price required",
        description: "Please set a price for your paid resource",
        variant: "destructive",
      });
      return;
    }

    if (resourceFiles.length === 0) {
      toast({
        title: "Resource files required",
        description: "Please upload at least one resource file",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // Create FormData for API
      const formData = new FormData();

      // Add form fields
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("resourceType", data.resourceType);
      formData.append("ageRange", data.ageRange);
      formData.append("curriculum", data.curriculum);
      formData.append("curriculumType", data.curriculumType);
      formData.append("subject", data.subject);
      formData.append("isFree", data.isFree === "free" ? "true" : "false");

      if (isPaid) {
        formData.append("price", data.price?.toString() || "0");
        formData.append("currency", data.currency || "USD");
      }

      // Add files
      formData.append("banner", bannerImage);

      previewImages.forEach((file, index) => {
        formData.append("previews", file);
      });

      resourceFiles.forEach((file, index) => {
        formData.append("files", file);
      });

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 20;
        });
      }, 500);

      // Call API
      const response = (await resourceApi.createResource(
        formData
      )) as ApiResponse;

      setUploadProgress(100);
      clearInterval(progressInterval);

      if (response.success) {
        toast({
          title: "Resource uploaded successfully!",
          description:
            "Your resource is now pending approval and will be available soon.",
        });
        navigate("/teacher/dashboard");
      } else {
        throw new Error(response.message || "Failed to create resource");
      }
    } catch (error: unknown) {
      console.error("Resource creation error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ||
            "There was an error uploading your resource. Please try again.";

      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const saveDraft = async () => {
    const formData = form.getValues();
    const isPaid = formData.isFree === "paid";

    // Basic validation for draft
    if (!formData.title || !formData.description) {
      toast({
        title: "Required fields missing",
        description: "Please fill in title and description to save as draft",
        variant: "destructive",
      });
      return;
    }

    try {
      const draftFormData = new FormData();

      // Add form fields
      draftFormData.append("title", formData.title);
      draftFormData.append("description", formData.description);
      draftFormData.append("resourceType", formData.resourceType || "");
      draftFormData.append("ageRange", formData.ageRange || "");
      draftFormData.append("curriculum", formData.curriculum || "");
      draftFormData.append("curriculumType", formData.curriculumType || "");
      draftFormData.append("subject", formData.subject || "");
      draftFormData.append(
        "isFree",
        formData.isFree === "free" ? "true" : "false"
      );
      draftFormData.append("saveAsDraft", "true");

      if (isPaid && formData.price) {
        draftFormData.append("price", formData.price.toString());
        draftFormData.append("currency", formData.currency || "USD");
      }

      // Add files if available
      if (bannerImage) {
        draftFormData.append("banner", bannerImage);
      }

      previewImages.forEach((file) => {
        draftFormData.append("previews", file);
      });

      resourceFiles.forEach((file) => {
        draftFormData.append("files", file);
      });

      const response = (await resourceApi.createResource(
        draftFormData
      )) as ApiResponse;

      if (response.success) {
        toast({
          title: "Draft saved",
          description: "Your resource has been saved as a draft.",
        });
      } else {
        throw new Error(response.message || "Failed to save draft");
      }
    } catch (error: unknown) {
      console.error("Draft save error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ||
            "There was an error saving your draft. Please try again.";

      toast({
        title: "Draft save failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Create a Resource
          </h1>
          <p className="text-muted-foreground mt-2">
            Share your teaching materials with educators worldwide
          </p>
        </div>

        {/* Upload Progress */}
        {isSubmitting && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Uploading resource...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - File Uploads */}
              <div className="space-y-6">
                {/* Banner Image */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <ImageIcon className="w-5 h-5" />
                      <span>Banner Image *</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        {bannerImage ? (
                          <div className="space-y-2">
                            <img
                              src={URL.createObjectURL(bannerImage)}
                              alt="Banner preview"
                              className="w-full h-32 object-cover rounded"
                            />
                            <p className="text-sm text-muted-foreground">
                              {bannerImage.name}
                            </p>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setBannerImage(null)}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                            <div>
                              <label
                                htmlFor="banner-upload"
                                className="cursor-pointer"
                              >
                                <span className="text-primary hover:underline">
                                  Click to upload
                                </span>
                                <span className="text-muted-foreground">
                                  {" "}
                                  or drag and drop
                                </span>
                              </label>
                              <input
                                id="banner-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleBannerUpload}
                                className="hidden"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Recommended: 1200×400px (16:5), min 800×300px, JPEG/PNG,
                        max 5MB
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Preview Images */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Eye className="w-5 h-5" />
                      <span>Preview Images *</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        {watchIsFree === "paid"
                          ? "Exactly 5 preview images required for paid resources"
                          : "Minimum 1 preview image required for free resources"}
                      </div>

                      {previewImages.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {previewImages.map((file, index) => (
                            <div key={index} className="relative">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-20 object-cover rounded"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute -top-2 -right-2 w-6 h-6 p-0"
                                onClick={() => removePreviewImage(index)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                        <label
                          htmlFor="preview-upload"
                          className="cursor-pointer"
                        >
                          <Plus className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                          <span className="text-sm text-primary hover:underline">
                            Add Preview Images
                          </span>
                          <input
                            id="preview-upload"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handlePreviewUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        Screenshots of worksheets, slides, or sample pages.
                        1200×825px recommended, max 3MB each
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Resource Files */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="w-5 h-5" />
                      <span>Resource Files</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {resourceFiles.length > 0 && (
                        <div className="space-y-2 mb-3">
                          {resourceFiles.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-muted/50 rounded"
                            >
                              <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4" />
                                <span className="text-sm">{file.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  ({(file.size / 1024 / 1024).toFixed(1)} MB)
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeResourceFile(index)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                        <label
                          htmlFor="resource-upload"
                          className="cursor-pointer"
                        >
                          <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                          <span className="text-sm text-primary hover:underline">
                            Upload Resource Files
                          </span>
                          <input
                            id="resource-upload"
                            type="file"
                            accept=".pdf,.docx,.pptx,.zip,image/*"
                            multiple
                            onChange={handleResourceFilesUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        PDF, DOCX, PPTX, ZIP, images. Total max 500MB
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Form Fields */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Describe your resource</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      This is your opportunity to clearly explain what your
                      resource is all about! It's worth remembering that you are
                      using the space to communicate to two different audiences.
                      Firstly, think about what fellow teachers would like to
                      know, such as exactly what the resource contains and how
                      it could be used in the classroom. Secondly, the words you
                      include on this page are also talking to internal and
                      external search engines. External search engines, like
                      Google, show the first 155 characters of the resource
                      description, so make sure you take advantage of these
                      characters by using lots of relevant keywords as part of
                      an enticing pitch.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title your resource *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Title your resource"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Character count: {field.value?.length || 0} - Aim
                            for 35-45 characters for your title.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Describe your resource *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Be clear in the first 155 characters, then write as much information as you can after."
                              className="h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Character count: {field.value?.length || 0} - Be
                            clear in the first 155 characters, then write as
                            much information as you can after. Markdown styling
                            is supported.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="resourceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Resource Type *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a resource type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {RESOURCE_TYPE_OPTIONS.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Age range and curriculum */}
                <Card>
                  <CardHeader>
                    <CardTitle>Age range and curriculum</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="ageRange"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age range *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose age range..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {AGE_RANGE_OPTIONS.map((age) => (
                                  <SelectItem key={age.value} value={age.value}>
                                    {age.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="curriculum"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Curriculum *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Please select..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {CURRICULUM_OPTIONS.map((curriculum) => (
                                  <SelectItem
                                    key={curriculum.value}
                                    value={curriculum.value}
                                  >
                                    {curriculum.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="curriculumType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Curriculum Type *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Please select..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {CURRICULUM_TYPE_OPTIONS.map((type) => (
                                  <SelectItem
                                    key={type.value}
                                    value={type.value}
                                  >
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose subject..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {SUBJECT_OPTIONS.map((subject) => (
                                <SelectItem
                                  key={subject.value}
                                  value={subject.value}
                                >
                                  {subject.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Pricing & Licensing */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5" />
                      <span>Pricing & Licensing</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="isFree"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Is this resource free? *</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="free" id="free" />
                                <Label htmlFor="free">Free</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="paid" id="paid" />
                                <Label htmlFor="paid">Paid</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {watchIsFree === "paid" && (
                      <div className="space-y-4 border border-border rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="currency"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Currency *</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {CURRENCY_OPTIONS.map((currency) => (
                                      <SelectItem
                                        key={currency.value}
                                        value={currency.value}
                                      >
                                        {currency.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price *</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    {...field}
                                    onChange={(e) => {
                                      const value =
                                        parseFloat(e.target.value) || 0;
                                      field.onChange(value);
                                      calculateEarnings(value);
                                    }}
                                  />
                                </FormControl>
                                {watchPrice && watchPrice < 3 && (
                                  <p className="text-sm text-amber-600">
                                    ⚠️ Items under £3 incur a transaction fee of
                                    £0.20
                                  </p>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Royalty Information */}
                        <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Current Royalty Tier:</span>
                            <Badge variant="secondary">
                              {currentRoyaltyTier}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Expected Net Earnings:</span>
                            <span className="font-medium text-primary">
                              £{expectedEarnings.toFixed(2)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Your share after VAT, transaction fees, and platform
                            commission
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={saveDraft}
                    disabled={isSubmitting}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Publish Resource
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
};

export default UploadResource;
