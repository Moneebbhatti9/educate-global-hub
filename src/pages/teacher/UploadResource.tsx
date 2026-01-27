import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { customToast } from "@/components/ui/sonner";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { resourcesAPI } from "@/apis/resources";
import type {
  CreateResourceRequest,
  UpdateResourceRequest,
  TeacherResource,
  UploadedFileMetadata,
} from "@/types/resource";
import DashboardLayout from "@/layout/DashboardLayout";
import { FileUploadStatus } from "@/components/resources/FileUploadStatus";
import { useDropdownOptions } from "@/components/ui/dynamic-select";

// Form validation schema
const resourceSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(140, "Title must be under 140 characters"),
    description: z.string().min(1, "Description is required"),
    type: z.string().min(1, "Resource type is required"),
    publishing: z.string().optional(),
    isFree: z.enum(["free", "paid"]),
    price: z.union([z.number(), z.literal("")]).optional(),
    currency: z.string().optional(),
    ageRange: z.string().min(1, "Age range is required"),
    curriculum: z.string().min(1, "Curriculum is required"),
    curriculumType: z.string().min(1, "Curriculum type is required"),
    subject: z.string().min(1, "Subject is required"),
  })
  .refine(
    (data) => {
      if (data.isFree === "paid") {
        return data.price && typeof data.price === "number" && data.price > 0;
      }
      return true;
    },
    {
      message: "Price is required for paid resources",
      path: ["price"],
    }
  );

type ResourceFormData = z.infer<typeof resourceSchema>;

const UploadResource = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { handleError, showSuccess, showError } = useErrorHandler();

  // Fetch dynamic dropdown options
  const { data: resourceTypeOptions, isLoading: loadingResourceTypes } = useDropdownOptions("resourceType");
  const { data: subjectOptions, isLoading: loadingSubjects } = useDropdownOptions("subject");
  const { data: ageRangeOptions, isLoading: loadingAgeRanges } = useDropdownOptions("ageRange");
  const { data: curriculumOptions, isLoading: loadingCurricula } = useDropdownOptions("curriculum");
  const { data: curriculumTypeOptions, isLoading: loadingCurriculumTypes } = useDropdownOptions("curriculumType");
  const { data: currencyOptions, isLoading: loadingCurrencies } = useDropdownOptions("currency");

  // Check for edit mode
  const editState = location.state as {
    editMode?: boolean;
    resourceData?: TeacherResource;
  } | null;
  const isEditMode = Boolean(id) || Boolean(editState?.editMode);
  const [resourceData, setResourceData] = useState<TeacherResource | null>(null);
  const [isLoadingResource, setIsLoadingResource] = useState(false);

  // Form state
  const form = useForm<ResourceFormData>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "",
      publishing: "public",
      isFree: "free",
      price: "",
      currency: "USD",
      ageRange: "",
      curriculum: "",
      curriculumType: "",
      subject: "",
    },
  });

  // File upload metadata states
  const [bannerMetadata, setBannerMetadata] = useState<UploadedFileMetadata | null>(null);
  const [previewMetadata, setPreviewMetadata] = useState<UploadedFileMetadata[]>([]);
  const [resourceFileMetadata, setResourceFileMetadata] = useState<UploadedFileMetadata | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allFilesUploaded, setAllFilesUploaded] = useState(false);

  const watchIsFree = form.watch("isFree");

  // Load resource data for edit mode
  useEffect(() => {
    if (isEditMode && editState?.resourceData) {
      const resource = editState.resourceData;

      // Populate form fields
      form.reset({
        title: resource.title || "",
        description: resource.description || "",
        type: resource.type || "",
        publishing: resource.publishing || "public",
        isFree: resource.isFree ? "free" : "paid",
        price: resource.isFree ? "" : resource.price,
        currency: resource.currency || "USD",
        ageRange: resource.ageRange || "",
        curriculum: resource.curriculum || "",
        curriculumType: resource.curriculumType || "",
        subject: resource.subject || "",
      });

      // Load existing files as metadata with success status
      const coverPhotoUrl = typeof resource.coverPhoto === 'string'
        ? resource.coverPhoto
        : resource.coverPhoto?.url;

      if (coverPhotoUrl) {
        setBannerMetadata({
          file: new File([], "existing-banner.jpg"),
          url: coverPhotoUrl,
          publicId: null,
          progress: 100,
          status: 'success',
        });
      }

      // Load preview images
      const previewUrls = Array.isArray(resource.previewImages)
        ? resource.previewImages.map(img =>
            typeof img === 'string' ? img : img.url
          )
        : [];

      if (previewUrls.length > 0) {
        setPreviewMetadata(
          previewUrls.map((url, index) => ({
            file: new File([], `existing-preview-${index}.jpg`),
            url,
            publicId: null,
            progress: 100,
            status: 'success' as const,
          }))
        );
      }

      // Load main file
      const mainFileUrl = typeof resource.mainFile === 'string'
        ? resource.mainFile
        : resource.mainFile?.url;

      if (mainFileUrl) {
        setResourceFileMetadata({
          file: new File([], "existing-file.pdf"),
          url: mainFileUrl,
          publicId: null,
          progress: 100,
          status: 'success',
        });
      }

      setResourceData(resource);
    }
  }, [isEditMode, editState]);

  // Check if all files are uploaded
  useEffect(() => {
    const bannerUploaded = bannerMetadata?.status === 'success';
    const previewsUploaded = previewMetadata.length > 0 &&
      previewMetadata.every(m => m.status === 'success');
    const fileUploaded = resourceFileMetadata?.status === 'success';

    setAllFilesUploaded(bannerUploaded && previewsUploaded && fileUploaded);
  }, [bannerMetadata, previewMetadata, resourceFileMetadata]);

  // Upload file helper function
  const uploadFile = async (
    file: File,
    type: 'banner' | 'preview' | 'resource',
    index?: number
  ) => {
    const metadata: UploadedFileMetadata = {
      file,
      url: null,
      publicId: null,
      progress: 0,
      status: 'uploading',
    };

    // Update state based on type
    if (type === 'banner') {
      setBannerMetadata(metadata);
    } else if (type === 'preview') {
      setPreviewMetadata(prev => [...prev, metadata]);
    } else {
      setResourceFileMetadata(metadata);
    }

    try {
      const response = await resourcesAPI.uploadDocument(file, (progress) => {
        // Update progress
        if (type === 'banner') {
          setBannerMetadata(prev => prev ? { ...prev, progress } : null);
        } else if (type === 'preview' && index !== undefined) {
          setPreviewMetadata(prev => prev.map((m, i) =>
            i === index ? { ...m, progress } : m
          ));
        } else {
          setResourceFileMetadata(prev => prev ? { ...prev, progress } : null);
        }
      });

      if (response.success && response.data) {
        // Update with success
        const updatedMetadata: UploadedFileMetadata = {
          file,
          url: response.data.documentUrl,
          publicId: response.data.publicId,
          status: 'success',
          progress: 100,
        };

        if (type === 'banner') {
          setBannerMetadata(updatedMetadata);
        } else if (type === 'preview' && index !== undefined) {
          setPreviewMetadata(prev => prev.map((m, i) =>
            i === index ? updatedMetadata : m
          ));
        } else {
          setResourceFileMetadata(updatedMetadata);
        }
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error) {
      // Update with error
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';

      if (type === 'banner') {
        setBannerMetadata(prev => prev ? { ...prev, status: 'error', error: errorMessage } : null);
      } else if (type === 'preview' && index !== undefined) {
        setPreviewMetadata(prev => prev.map((m, i) =>
          i === index ? { ...m, status: 'error', error: errorMessage } : m
        ));
      } else {
        setResourceFileMetadata(prev => prev ? { ...prev, status: 'error', error: errorMessage } : null);
      }
    }
  };

  // Handle file uploads
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showError("Invalid file type", "Banner must be an image (JPG, PNG, etc.)");
      e.target.value = '';
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError("File too large", "Banner image must be under 5MB");
      e.target.value = '';
      return;
    }

    // Validate image dimensions (recommended 1200×400px, min 800×300px)
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);

      const width = img.width;
      const height = img.height;

      // Check minimum dimensions
      if (width < 800 || height < 300) {
        showError(
          "Image too small",
          `Banner must be at least 800×300px. Your image is ${width}×${height}px`
        );
        e.target.value = '';
        return;
      }

      // Warn if not recommended dimensions but still allow
      if (width !== 1200 || height !== 400) {
        customToast.info(
          "Image dimensions",
          `Recommended size is 1200×400px. Your image is ${width}×${height}px`
        );
      }

      await uploadFile(file, 'banner');
      e.target.value = '';
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      showError("Invalid image", "Could not load the image file");
      e.target.value = '';
    };

    img.src = objectUrl;
  };

  const handlePreviewUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check maximum limit (1-5 images)
    if (previewMetadata.length + files.length > 5) {
      showError("Too many files", "Maximum 5 preview images allowed");
      e.target.value = '';
      return;
    }

    // Validate each file
    const validFiles: File[] = [];
    for (const file of files) {
      // Validate file type (images only)
      if (!file.type.startsWith("image/")) {
        showError("Invalid file type", `${file.name} must be an image (JPG, PNG, etc.)`);
        continue;
      }

      // Validate file size (max 3MB)
      if (file.size > 3 * 1024 * 1024) {
        showError("File too large", `${file.name} must be under 3MB`);
        continue;
      }

      validFiles.push(file);
    }

    // Upload valid files
    for (let i = 0; i < validFiles.length; i++) {
      await uploadFile(validFiles[i], 'preview', previewMetadata.length + i);
    }

    e.target.value = '';
  };

  const handleResourceFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type (PDF, DOCX, PPTX, ZIP, images)
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
      'application/vnd.ms-powerpoint', // .ppt
      'application/zip',
      'application/x-zip-compressed',
    ];

    const isImage = file.type.startsWith('image/');
    const isAllowedType = allowedTypes.includes(file.type);

    if (!isImage && !isAllowedType) {
      showError(
        "Invalid file type",
        "Resource file must be PDF, DOCX, PPTX, ZIP, or an image"
      );
      e.target.value = '';
      return;
    }

    // Validate file size (max 500MB)
    if (file.size > 500 * 1024 * 1024) {
      showError("File too large", "Resource file must be under 500MB");
      e.target.value = '';
      return;
    }

    await uploadFile(file, 'resource');
    e.target.value = '';
  };

  const removePreviewImage = (index: number) => {
    setPreviewMetadata(prev => prev.filter((_, i) => i !== index));
  };

  // Form submission
  const onSubmit = async (data: ResourceFormData) => {
    if (!allFilesUploaded) {
      showError("Upload incomplete", "Please wait for all files to finish uploading");
      return;
    }

    if (!bannerMetadata?.url || !resourceFileMetadata?.url) {
      showError("Missing files", "Please upload all required files");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode && resourceData?._id) {
        // Update existing resource
        const updatePayload: UpdateResourceRequest = {
          title: data.title.trim(),
          description: data.description.trim(),
          type: data.type,
          publishing: data.publishing || "public",
          isFree: data.isFree === "free",
          price: data.isFree === "paid" ? (data.price as number) : undefined,
          currency: data.isFree === "paid" ? data.currency : undefined,
          ageRange: data.ageRange,
          curriculum: data.curriculum,
          curriculumType: data.curriculumType || "",
          subject: data.subject,
          coverPhotoUrl: bannerMetadata.url,
          previewImageUrls: previewMetadata.map(m => m.url!),
          mainFileUrl: resourceFileMetadata.url,
        };

        const response = await resourcesAPI.updateResource(resourceData._id, updatePayload);

        if (response.success) {
          showSuccess(
            "Resource updated successfully!",
            "Your resource has been updated."
          );

          navigate("/dashboard/teacher/resource-management");
        } else {
          showError("Update failed", response.message || "Failed to update resource");
        }
      } else {
        // Create new resource
        const resourcePayload: CreateResourceRequest = {
          title: data.title.trim(),
          description: data.description.trim(),
          resourceType: data.type,
          visibility: data.publishing || "public",
          isFree: data.isFree === "free",
          price: data.isFree === "paid" ? (data.price as number) : undefined,
          currency: data.isFree === "paid" ? data.currency : undefined,
          saveAsDraft: false,
          ageRange: data.ageRange,
          curriculum: data.curriculum,
          curriculumType: data.curriculumType || "",
          subject: data.subject,
          coverPhotoUrl: bannerMetadata.url,
          previewImageUrls: previewMetadata.map(m => m.url!),
          mainFileUrl: resourceFileMetadata.url,
        };

        const response = await resourcesAPI.createResource(resourcePayload);

        if (response.success) {
          showSuccess(
            "Resource uploaded successfully!",
            "Your resource is now live and available."
          );

          // Clear form
          form.reset();
          setBannerMetadata(null);
          setPreviewMetadata([]);
          setResourceFileMetadata(null);

          navigate("/dashboard/teacher/resource-management");
        } else {
          showError("Upload failed", response.message || "Failed to upload resource");
        }
      }
    } catch (error) {
      console.error("Error uploading resource:", error);
      handleError(error, isEditMode ? "Update failed" : "Upload failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveDraft = async () => {
    const formData = form.getValues();

    if (!formData.title?.trim()) {
      showError("Title required", "Please enter a title to save as draft");
      return;
    }

    if (!bannerMetadata?.url) {
      showError("Banner required", "Please upload a banner to save as draft");
      return;
    }

    setIsSubmitting(true);

    try {
      const draftPayload: CreateResourceRequest = {
        title: formData.title.trim(),
        description: formData.description?.trim() || "",
        resourceType: formData.type || "",
        visibility: formData.publishing || "public",
        isFree: formData.isFree === "free",
        price: formData.isFree === "paid" ? (formData.price as number) : undefined,
        currency: formData.isFree === "paid" ? formData.currency : undefined,
        saveAsDraft: true,
        ageRange: formData.ageRange || "",
        curriculum: formData.curriculum || "",
        curriculumType: formData.curriculumType || "",
        subject: formData.subject || "",
        coverPhotoUrl: bannerMetadata.url,
        previewImageUrls: previewMetadata.map(m => m.url || "").filter(Boolean),
        mainFileUrl: resourceFileMetadata?.url || "",
      };

      const response = await resourcesAPI.createResource(draftPayload);

      if (response.success) {
        showSuccess(
          "Draft saved successfully!",
          "Your resource draft has been saved."
        );

        // Clear form
        form.reset();
        setBannerMetadata(null);
        setPreviewMetadata([]);
        setResourceFileMetadata(null);
      } else {
        showError("Save failed", response.message || "Failed to save draft");
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      handleError(error, "Failed to save draft");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {isEditMode ? "Edit Resource" : "Create a Resource"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isEditMode
              ? "Update your teaching resource details and files"
              : "Share your teaching materials with educators worldwide"}
          </p>
        </div>

        {/* Upload Status Banner - Only show when files are uploading */}
        {(bannerMetadata?.status === 'uploading' ||
          previewMetadata.some(m => m.status === 'uploading') ||
          resourceFileMetadata?.status === 'uploading') && (
          <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
            <CardContent className="pt-6">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                ⏳ Files are still uploading. The submit button will be enabled once all uploads complete.
              </p>
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
                      {bannerMetadata ? (
                        <FileUploadStatus
                          fileName={bannerMetadata.file.name}
                          progress={bannerMetadata.progress}
                          status={bannerMetadata.status}
                          error={bannerMetadata.error}
                          onRetry={() => uploadFile(bannerMetadata.file, 'banner')}
                          onRemove={() => setBannerMetadata(null)}
                        />
                      ) : (
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                          <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                          <label htmlFor="banner-upload" className="cursor-pointer">
                            <span className="text-primary hover:underline">
                              Click to upload
                            </span>
                            <span className="text-muted-foreground"> or drag and drop</span>
                          </label>
                          <input
                            id="banner-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleBannerUpload}
                            className="hidden"
                          />
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Required: Min 800×300px (Recommended: 1200×400px), JPEG/PNG, max 5MB
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Preview Images */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Eye className="w-5 h-5" />
                      <span>Preview Images * (1-5)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {previewMetadata.map((metadata, index) => (
                        <FileUploadStatus
                          key={index}
                          fileName={metadata.file.name}
                          progress={metadata.progress}
                          status={metadata.status}
                          error={metadata.error}
                          onRetry={() => uploadFile(metadata.file, 'preview', index)}
                          onRemove={() => removePreviewImage(index)}
                        />
                      ))}

                      {previewMetadata.length < 5 && (
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                          <label htmlFor="preview-upload" className="cursor-pointer">
                            <Plus className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                            <span className="text-sm text-primary hover:underline">
                              Add Preview Images
                            </span>
                          </label>
                          <input
                            id="preview-upload"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handlePreviewUpload}
                            className="hidden"
                          />
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground">
                        Required: 1-5 images, screenshots or sample pages, JPEG/PNG, max 3MB each
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Resource File */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="w-5 h-5" />
                      <span>Resource File *</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {resourceFileMetadata ? (
                        <FileUploadStatus
                          fileName={resourceFileMetadata.file.name}
                          progress={resourceFileMetadata.progress}
                          status={resourceFileMetadata.status}
                          error={resourceFileMetadata.error}
                          onRetry={() => uploadFile(resourceFileMetadata.file, 'resource')}
                          onRemove={() => setResourceFileMetadata(null)}
                        />
                      ) : (
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                          <label htmlFor="resource-upload" className="cursor-pointer">
                            <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                            <span className="text-sm text-primary hover:underline">
                              Upload Resource File
                            </span>
                          </label>
                          <input
                            id="resource-upload"
                            type="file"
                            accept=".pdf,.docx,.pptx,.zip,image/*"
                            onChange={handleResourceFileUpload}
                            className="hidden"
                          />
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Required: PDF, DOCX, PPTX, ZIP, or images. Max 500MB
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
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Clear, searchable title"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            {field.value?.length || 0}/140 characters
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
                          <FormLabel>Description *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Detailed description..."
                              className="h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Resource Type *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} disabled={loadingResourceTypes}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={loadingResourceTypes ? "Loading..." : "Select type"} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {resourceTypeOptions.map((option) => (
                                  <SelectItem key={option._id} value={option.value}>
                                    {option.label}
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
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} disabled={loadingSubjects}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={loadingSubjects ? "Loading..." : "Select subject"} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {subjectOptions.map((option) => (
                                  <SelectItem key={option._id} value={option.value}>
                                    {option.label}
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
                        name="ageRange"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age Range *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} disabled={loadingAgeRanges}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={loadingAgeRanges ? "Loading..." : "Select age range"} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {ageRangeOptions.map((option) => (
                                  <SelectItem key={option._id} value={option.value}>
                                    {option.label}
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
                        name="curriculum"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Curriculum *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} disabled={loadingCurricula}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={loadingCurricula ? "Loading..." : "Select curriculum"} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {curriculumOptions.map((option) => (
                                  <SelectItem key={option._id} value={option.value}>
                                    {option.label}
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
                      name="curriculumType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Curriculum Type *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={loadingCurriculumTypes}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={loadingCurriculumTypes ? "Loading..." : "Select curriculum type"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {curriculumTypeOptions.map((option) => (
                                <SelectItem key={option._id} value={option.value}>
                                  {option.label}
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
                      <span>Pricing</span>
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-border rounded-lg p-4">
                        <FormField
                          control={form.control}
                          name="currency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Currency *</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value} disabled={loadingCurrencies}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={loadingCurrencies ? "Loading..." : "Select currency"} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {currencyOptions.map((option) => (
                                    <SelectItem key={option._id} value={option.value}>
                                      {option.label}
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
                                  value={field.value === "" ? "" : field.value}
                                  onChange={(e) => {
                                    const value = e.target.value === "" ? "" : parseFloat(e.target.value) || 0;
                                    field.onChange(value);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Publishing Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Publishing Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="publishing"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Visibility *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="public">Public</SelectItem>
                              <SelectItem value="private">Private</SelectItem>
                              <SelectItem value="school only">School Only</SelectItem>
                              <SelectItem value="unlisted">Unlisted Link</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={saveDraft}
                    disabled={isSubmitting || !bannerMetadata}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>

                  <Button
                    type="submit"
                    disabled={!allFilesUploaded || isSubmitting}
                    className="px-8"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {!allFilesUploaded ? "Uploading..." : "Publish Resource"}
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
