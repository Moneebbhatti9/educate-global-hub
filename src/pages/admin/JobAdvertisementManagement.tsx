import { useState } from "react";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  TrendingUp,
  Image,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Upload,
  Download,
  ExternalLink,
} from "lucide-react";

const JobAdvertisementManagement = () => {
  const [selectedTab, setSelectedTab] = useState("ads");
  const [isCreateAdModalOpen, setIsCreateAdModalOpen] = useState(false);
  const [isCreateBannerModalOpen, setIsCreateBannerModalOpen] = useState(false);

  // Mock data for job ads
  const jobAds = [
    {
      id: "1",
      title: "Premium Job Spotlight - Mathematics Teacher",
      advertiser: "Dubai International School",
      type: "Premium Listing",
      size: "Large",
      duration: "30 days",
      status: "Active",
      startDate: "2024-01-15",
      endDate: "2024-02-14",
      views: 1250,
      clicks: 89,
      budget: 500,
      spent: 342,
    },
    {
      id: "2",
      title: "Featured Position - Science Department Head",
      advertiser: "Al Khaleej School",
      type: "Featured",
      size: "Medium",
      duration: "15 days",
      status: "Active",
      startDate: "2024-01-20",
      endDate: "2024-02-04",
      views: 892,
      clicks: 56,
      budget: 300,
      spent: 189,
    },
    {
      id: "3",
      title: "Urgent Hire - English Teacher",
      advertiser: "International Academy",
      type: "Urgent",
      size: "Small",
      duration: "7 days",
      status: "Expired",
      startDate: "2024-01-01",
      endDate: "2024-01-08",
      views: 456,
      clicks: 23,
      budget: 150,
      spent: 150,
    },
  ];

  // Mock data for banners
  const banners = [
    {
      id: "1",
      title: "Education Conference 2024",
      type: "Event Banner",
      size: "728x90",
      placement: "Header",
      status: "Active",
      startDate: "2024-01-10",
      endDate: "2024-03-10",
      clicks: 234,
      impressions: 15420,
    },
    {
      id: "2",
      title: "New Teacher Certification Program",
      type: "Promotional",
      size: "300x250",
      placement: "Sidebar",
      status: "Active",
      startDate: "2024-01-01",
      endDate: "2024-02-29",
      clicks: 156,
      impressions: 8932,
    },
    {
      id: "3",
      title: "Holiday Special Offer",
      type: "Seasonal",
      size: "970x250",
      placement: "Footer",
      status: "Paused",
      startDate: "2023-12-15",
      endDate: "2024-01-15",
      clicks: 89,
      impressions: 5234,
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      Active: "bg-brand-accent-green text-white",
      Expired: "bg-red-500 text-white",
      Paused: "bg-brand-accent-orange text-white",
      Draft: "bg-gray-500 text-white",
    };
    return variants[status as keyof typeof variants] || "bg-gray-500 text-white";
  };

  const CreateAdModal = () => (
    <Dialog open={isCreateAdModalOpen} onOpenChange={setIsCreateAdModalOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Job Advertisement</DialogTitle>
          <DialogDescription>
            Set up a new job advertisement with custom settings
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Advertisement Title</label>
              <Input placeholder="Enter ad title" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Advertiser</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select advertiser" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="school1">Dubai International School</SelectItem>
                  <SelectItem value="school2">Al Khaleej School</SelectItem>
                  <SelectItem value="recruiter1">Global Education Recruiters</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ad Type</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="premium">Premium Listing</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Size</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (1 week highlight)</SelectItem>
                  <SelectItem value="medium">Medium (2 week feature)</SelectItem>
                  <SelectItem value="large">Large (1 month premium)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 Days</SelectItem>
                  <SelectItem value="15">15 Days</SelectItem>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="60">60 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Budget ($)</label>
              <Input type="number" placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Audience</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="teachers">Teachers</SelectItem>
                  <SelectItem value="administrators">Administrators</SelectItem>
                  <SelectItem value="support">Support Staff</SelectItem>
                  <SelectItem value="all">All Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsCreateAdModalOpen(false)}>
              Cancel
            </Button>
            <Button>Create Advertisement</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const CreateBannerModal = () => (
    <Dialog open={isCreateBannerModalOpen} onOpenChange={setIsCreateBannerModalOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Marketing Banner</DialogTitle>
          <DialogDescription>
            Upload and configure a new marketing banner
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Banner Title</label>
              <Input placeholder="Enter banner title" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Banner Type</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="promotional">Promotional</SelectItem>
                  <SelectItem value="event">Event Banner</SelectItem>
                  <SelectItem value="seasonal">Seasonal</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Banner Image</label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop your banner image here, or click to browse
              </p>
              <Button variant="outline" size="sm">
                Choose File
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Support sources: Local PC, USB, Google Drive, OneDrive
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Banner Size</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="728x90">Leaderboard (728x90)</SelectItem>
                  <SelectItem value="300x250">Medium Rectangle (300x250)</SelectItem>
                  <SelectItem value="970x250">Large Banner (970x250)</SelectItem>
                  <SelectItem value="320x50">Mobile Banner (320x50)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Placement</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select placement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="header">Header</SelectItem>
                  <SelectItem value="sidebar">Sidebar</SelectItem>
                  <SelectItem value="footer">Footer</SelectItem>
                  <SelectItem value="inline">Inline Content</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 Days</SelectItem>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="60">60 Days</SelectItem>
                  <SelectItem value="90">90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Link URL (Optional)</label>
            <Input placeholder="https://example.com" />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsCreateBannerModalOpen(false)}>
              Cancel
            </Button>
            <Button>Create Banner</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-3xl text-foreground">
              Job Advertisement Management
            </h1>
            <p className="text-muted-foreground">
              Manage job advertisements and marketing banners across the platform
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsCreateBannerModalOpen(true)}
            >
              <Image className="w-4 h-4 mr-2" />
              Add Banner
            </Button>
            <Button onClick={() => setIsCreateAdModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Ad
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-brand-primary" />
                <div>
                  <p className="text-sm font-medium">Active Ads</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Image className="w-4 h-4 text-brand-secondary" />
                <div>
                  <p className="text-sm font-medium">Active Banners</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-brand-accent-green" />
                <div>
                  <p className="text-sm font-medium">Total Clicks</p>
                  <p className="text-2xl font-bold">1,234</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-brand-accent-orange" />
                <div>
                  <p className="text-sm font-medium">Revenue</p>
                  <p className="text-2xl font-bold">$2,890</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
          <Button
            variant={selectedTab === "ads" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedTab("ads")}
          >
            Job Advertisements
          </Button>
          <Button
            variant={selectedTab === "banners" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedTab("banners")}
          >
            Marketing Banners
          </Button>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder={`Search ${selectedTab === "ads" ? "advertisements" : "banners"}...`}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Content Table */}
        {selectedTab === "ads" ? (
          <Card>
            <CardHeader>
              <CardTitle>Job Advertisements</CardTitle>
              <CardDescription>
                Manage job ad placements and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Advertiser</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobAds.map((ad) => (
                    <TableRow key={ad.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{ad.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {ad.startDate} - {ad.endDate}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{ad.advertiser}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{ad.type}</Badge>
                      </TableCell>
                      <TableCell>{ad.duration}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(ad.status)}>
                          {ad.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{ad.views} views</p>
                          <p className="text-muted-foreground">{ad.clicks} clicks</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>${ad.spent} / ${ad.budget}</p>
                          <p className="text-muted-foreground">
                            {Math.round((ad.spent / ad.budget) * 100)}% spent
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Ad
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Clock className="w-4 h-4 mr-2" />
                              Extend Duration
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Ad
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Marketing Banners</CardTitle>
              <CardDescription>
                Manage promotional banners and their placements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Placement</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {banners.map((banner) => (
                    <TableRow key={banner.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{banner.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {banner.startDate} - {banner.endDate}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{banner.type}</Badge>
                      </TableCell>
                      <TableCell>{banner.size}</TableCell>
                      <TableCell>{banner.placement}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(banner.status)}>
                          {banner.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{banner.clicks} clicks</p>
                          <p className="text-muted-foreground">
                            {banner.impressions} impressions
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{banner.startDate}</p>
                          <p className="text-muted-foreground">to {banner.endDate}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              Preview Banner
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Banner
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Change Placement
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Banner
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        <CreateAdModal />
        <CreateBannerModal />
      </div>
    </DashboardLayout>
  );
};

export default JobAdvertisementManagement;