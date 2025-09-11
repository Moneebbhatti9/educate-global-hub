import { useState } from "react";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useAdmin } from "@/hooks/useAdmin";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  CURRICULUM_OPTIONS,
  SCHOOL_SIZE_OPTIONS,
  SCHOOL_TYPE_OPTIONS,
  GENDER_TYPE_OPTIONS,
  AGE_GROUP_OPTIONS,
  QUALIFICATION_OPTIONS,
} from "@/types/profiles";

const baseUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["teacher", "school", "recruiter", "supplier"]),
});

const teacherSchema = baseUserSchema.extend({
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^\+[1-9]\d{1,14}$/,
      "Phone number must include country code (e.g., +1234567890)"
    ),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  address: z.string().min(1, "Address is required"),
  qualification: z.enum([
    "Bachelor",
    "Master",
    "PhD",
    "Diploma",
    "Certificate",
    "Other",
  ]),
  subject: z.string().min(1, "Subject is required"),
  pgce: z.boolean(),
  yearsOfTeachingExperience: z.number().min(0, "Experience must be 0 or more"),
  professionalBio: z.string().min(1, "Professional bio is required"),
  keyAchievements: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  additionalQualifications: z.array(z.string()).optional(),
});

const schoolSchema = baseUserSchema.extend({
  schoolName: z.string().min(1, "School name is required"),
  schoolEmail: z.string().email("Invalid school email"),
  schoolContactNumber: z
    .string()
    .min(1, "School contact number is required")
    .regex(
      /^\+[1-9]\d{1,14}$/,
      "Phone number must include country code (e.g., +1234567890)"
    ),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  address: z.string().min(1, "Address is required"),
  curriculum: z
    .array(
      z.enum([
        "British Curriculum",
        "American Curriculum",
        "IB (International Baccalaureate)",
        "Canadian Curriculum",
        "Australian Curriculum",
        "National Curriculum",
        "Montessori",
        "Waldorf",
        "Reggio Emilia",
        "Other",
      ])
    )
    .min(1, "At least one curriculum is required"),
  schoolSize: z.enum([
    "Small (1-500 students)",
    "Medium (501-1000 students)",
    "Large (1001+ students)",
  ]),
  schoolType: z.enum([
    "Public",
    "Private",
    "International",
    "Charter",
    "Religious",
    "Other",
  ]),
  genderType: z.enum(["Boys Only", "Girls Only", "Mixed"]),
  ageGroup: z
    .array(
      z.enum([
        "Early Years (2-5 years)",
        "Primary (6-11 years)",
        "Secondary (12-16 years)",
        "Sixth Form/High School (17-18 years)",
        "All Ages",
      ])
    )
    .min(1, "At least one age group is required"),
  schoolWebsite: z.string().optional(),
  aboutSchool: z.string().min(1, "About school is required"),
  establishedYear: z
    .number()
    .min(1800, "Established year must be 1800 or later")
    .max(new Date().getFullYear(), "Established year cannot be in the future"),
});

const recruiterSchema = baseUserSchema.extend({
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^\+[1-9]\d{1,14}$/,
      "Phone number must include country code (e.g., +1234567890)"
    ),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  address: z.string().min(1, "Address is required"),
  companyName: z.string().min(1, "Company name is required"),
  industry: z.string().min(1, "Industry is required"),
  position: z.string().min(1, "Position is required"),
});

const supplierSchema = baseUserSchema.extend({
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^\+[1-9]\d{1,14}$/,
      "Phone number must include country code (e.g., +1234567890)"
    ),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  address: z.string().min(1, "Address is required"),
  companyName: z.string().min(1, "Company name is required"),
  products: z.array(z.string()).min(1, "At least one product is required"),
  website: z.string().optional(),
});

interface AddUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (userData: any) => void;
  initialData?: any;
  mode?: "add" | "edit";
  onSuccess?: () => void;
}

export const AddUserModal = ({
  open,
  onOpenChange,
  onSave,
  initialData,
  mode = "add",
  onSuccess,
}: AddUserModalProps) => {
  const [selectedRole, setSelectedRole] = useState<
    "teacher" | "school" | "recruiter" | "supplier"
  >(initialData?.role || "teacher");
  const { createUser, updateUser, isLoading } = useAdmin();

  const getSchema = (role: string) => {
    switch (role) {
      case "teacher":
        return teacherSchema;
      case "school":
        return schoolSchema;
      case "recruiter":
        return recruiterSchema;
      case "supplier":
        return supplierSchema;
      default:
        return teacherSchema;
    }
  };

  const schema = getSchema(selectedRole);

  const form = useFormValidation({
    schema,
    defaultValues: initialData || {
      role: selectedRole,
      firstName: "",
      lastName: "",
      email: "",
      ...(selectedRole === "teacher"
        ? {
            phoneNumber: "",
            country: "",
            city: "",
            province: "",
            zipCode: "",
            address: "",
            qualification: "Bachelor",
            subject: "",
            pgce: false,
            yearsOfTeachingExperience: 0,
            professionalBio: "",
            keyAchievements: [],
            certifications: [],
            additionalQualifications: [],
          }
        : selectedRole === "school"
        ? {
            schoolName: "",
            schoolEmail: "",
            schoolContactNumber: "",
            country: "",
            city: "",
            province: "",
            zipCode: "",
            address: "",
            curriculum: [],
            schoolSize: "Small (1-500 students)",
            schoolType: "Public",
            genderType: "Mixed",
            ageGroup: [],
            schoolWebsite: "",
            aboutSchool: "",
            establishedYear: new Date().getFullYear(),
          }
        : selectedRole === "recruiter"
        ? {
            phoneNumber: "",
            country: "",
            city: "",
            province: "",
            zipCode: "",
            address: "",
            companyName: "",
            industry: "",
            position: "",
          }
        : {
            // supplier
            phoneNumber: "",
            country: "",
            city: "",
            province: "",
            zipCode: "",
            address: "",
            companyName: "",
            products: [],
            website: "",
          }),
    },
  });

  const handleSubmit = async (data: any) => {
    try {
      if (mode === "add") {
        await createUser(data);
      } else if (mode === "edit" && initialData?.id) {
        await updateUser(initialData.id, data);
      }
      onSave(data);
      onOpenChange(false);
      form.reset();
      onSuccess?.();
    } catch (error) {
      // Error handling is done in the useAdmin hook
    }
  };

  const handleRoleChange = (
    role: "teacher" | "school" | "recruiter" | "supplier"
  ) => {
    setSelectedRole(role);
    form.setValue("role", role);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New User" : "Edit User"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Create a new user account with role-specific information."
              : "Update user account information."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Role Selection */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Role</FormLabel>
                  <Select
                    onValueChange={handleRoleChange}
                    defaultValue={field.value}
                    disabled={mode === "edit"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="school">School</SelectItem>
                      <SelectItem value="recruiter">Recruiter</SelectItem>
                      <SelectItem value="supplier">Supplier</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* User Account Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">User Account</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Teacher-specific fields */}
            {selectedRole === "teacher" && (
              <>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <PhoneInput
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Enter phone number"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <CountryDropdown
                              onChange={(country) =>
                                field.onChange(country.name)
                              }
                              defaultValue={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Province/State</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip Code</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Professional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="qualification"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Qualification</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {QUALIFICATION_OPTIONS.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
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
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="yearsOfTeachingExperience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Years of Experience</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pgce"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>PGCE Qualified</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="professionalBio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Professional Bio</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Additional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="keyAchievements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Key Achievements (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Enter key achievements (one per line)"
                              value={
                                Array.isArray(field.value)
                                  ? field.value.join("\n")
                                  : ""
                              }
                              onChange={(e) => {
                                const achievements = e.target.value
                                  .split("\n")
                                  .filter((a) => a.trim());
                                field.onChange(achievements);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="certifications"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Certifications (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Enter certifications (one per line)"
                              value={
                                Array.isArray(field.value)
                                  ? field.value.join("\n")
                                  : ""
                              }
                              onChange={(e) => {
                                const certifications = e.target.value
                                  .split("\n")
                                  .filter((c) => c.trim());
                                field.onChange(certifications);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="additionalQualifications"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Additional Qualifications (Optional)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Enter additional qualifications (one per line)"
                              value={
                                Array.isArray(field.value)
                                  ? field.value.join("\n")
                                  : ""
                              }
                              onChange={(e) => {
                                const qualifications = e.target.value
                                  .split("\n")
                                  .filter((q) => q.trim());
                                field.onChange(qualifications);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </>
            )}

            {/* School-specific fields */}
            {selectedRole === "school" && (
              <>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">School Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="schoolName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="schoolEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="schoolContactNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School Contact Number</FormLabel>
                          <FormControl>
                            <PhoneInput
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Enter contact number"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <CountryDropdown
                              onChange={(country) =>
                                field.onChange(country.name)
                              }
                              defaultValue={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Province/State</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip Code</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="schoolWebsite"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School Website (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="establishedYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Established Year</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  parseInt(e.target.value) ||
                                    new Date().getFullYear()
                                )
                              }
                              min={1800}
                              max={new Date().getFullYear()}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="aboutSchool"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>About School</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    School Configuration
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="curriculum"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Curriculum</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value) => {
                                const currentValues = Array.isArray(field.value)
                                  ? field.value
                                  : [];
                                if (!currentValues.includes(value)) {
                                  field.onChange([...currentValues, value]);
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select curriculum" />
                              </SelectTrigger>
                              <SelectContent>
                                {[
                                  "British Curriculum",
                                  "American Curriculum",
                                  "IB (International Baccalaureate)",
                                  "Canadian Curriculum",
                                  "Australian Curriculum",
                                  "National Curriculum",
                                  "Montessori",
                                  "Waldorf",
                                  "Reggio Emilia",
                                  "Other",
                                ].map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          {Array.isArray(field.value) &&
                            field.value.length > 0 && (
                              <div className="mt-2 space-y-2">
                                {field.value.map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center space-x-2"
                                  >
                                    <span className="text-sm bg-muted px-2 py-1 rounded">
                                      {item}
                                    </span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const newValues = field.value.filter(
                                          (_, i) => i !== index
                                        );
                                        field.onChange(newValues);
                                      }}
                                    >
                                      ×
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="schoolSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School Size</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {SCHOOL_SIZE_OPTIONS.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
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
                      name="schoolType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {SCHOOL_TYPE_OPTIONS.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
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
                      name="genderType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {GENDER_TYPE_OPTIONS.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
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
                      name="ageGroup"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age Groups</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value) => {
                                const currentValues = Array.isArray(field.value)
                                  ? field.value
                                  : [];
                                if (!currentValues.includes(value)) {
                                  field.onChange([...currentValues, value]);
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select age group" />
                              </SelectTrigger>
                              <SelectContent>
                                {[
                                  "Early Years (2-5 years)",
                                  "Primary (6-11 years)",
                                  "Secondary (12-16 years)",
                                  "Sixth Form/High School (17-18 years)",
                                  "All Ages",
                                ].map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          {Array.isArray(field.value) &&
                            field.value.length > 0 && (
                              <div className="mt-2 space-y-2">
                                {field.value.map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center space-x-2"
                                  >
                                    <span className="text-sm bg-muted px-2 py-1 rounded">
                                      {item}
                                    </span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const newValues = field.value.filter(
                                          (_, i) => i !== index
                                        );
                                        field.onChange(newValues);
                                      }}
                                    >
                                      ×
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Recruiter-specific fields */}
            {selectedRole === "recruiter" && (
              <>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <PhoneInput
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Enter phone number"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <CountryDropdown
                              onChange={(country) =>
                                field.onChange(country.name)
                              }
                              defaultValue={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Province/State</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip Code</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Company Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Supplier-specific fields */}
            {selectedRole === "supplier" && (
              <>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <PhoneInput
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Enter phone number"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <CountryDropdown
                              onChange={(country) =>
                                field.onChange(country.name)
                              }
                              defaultValue={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Province/State</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip Code</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Company Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="products"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Products/Services</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Enter products or services (one per line)"
                            value={
                              Array.isArray(field.value)
                                ? field.value.join("\n")
                                : ""
                            }
                            onChange={(e) => {
                              const products = e.target.value
                                .split("\n")
                                .filter((p) => p.trim());
                              field.onChange(products);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white border-green-600"
              >
                {isLoading
                  ? "Saving..."
                  : mode === "add"
                  ? "Add User"
                  : "Update User"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
