import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Download,
  Eye,
  ShoppingCart,
  TrendingUp,
  Calendar,
  MapPin,
  Users,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface ResourceStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: {
    id: string;
    title: string;
    thumbnail: string;
    price: number;
    status: string;
    salesCount: number;
    uploadDate: string;
  } | null;
}

// Mock data for demonstration
const mockStats = {
  totalViews: 2847,
  totalDownloads: 456,
  totalRevenue: 2284.5,
  averageRating: 4.7,
  ratingCount: 89,
  conversionRate: 16.0,
  
  // Chart data
  viewsOverTime: [
    { date: "Jan", views: 120, sales: 8 },
    { date: "Feb", views: 280, sales: 15 },
    { date: "Mar", views: 350, sales: 22 },
    { date: "Apr", views: 420, sales: 28 },
    { date: "May", views: 380, sales: 24 },
    { date: "Jun", views: 450, sales: 32 },
  ],
  
  topCountries: [
    { name: "United Kingdom", value: 45, color: "#8884d8" },
    { name: "United States", value: 25, color: "#82ca9d" },
    { name: "Australia", value: 15, color: "#ffc658" },
    { name: "Canada", value: 10, color: "#ff7300" },
    { name: "Others", value: 5, color: "#0088fe" },
  ],
  
  deviceTypes: [
    { name: "Desktop", views: 1420 },
    { name: "Tablet", views: 850 },
    { name: "Mobile", views: 577 },
  ],
};

export default function ResourceStatsModal({
  isOpen,
  onClose,
  resource,
}: ResourceStatsModalProps) {
  if (!resource) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <img
              src={resource.thumbnail}
              alt={resource.title}
              className="w-12 h-8 object-cover rounded border"
            />
            <div>
              <h3 className="text-lg font-semibold">{resource.title}</h3>
              <p className="text-sm text-muted-foreground">
                Resource Statistics & Analytics
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Views
                    </p>
                    <p className="text-2xl font-bold">{mockStats.totalViews.toLocaleString()}</p>
                  </div>
                  <Eye className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Downloads/Sales
                    </p>
                    <p className="text-2xl font-bold">{mockStats.totalDownloads}</p>
                  </div>
                  <Download className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold">
                      £{mockStats.totalRevenue.toFixed(2)}
                    </p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Conversion Rate
                    </p>
                    <p className="text-2xl font-bold">{mockStats.conversionRate}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Views & Sales Over Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Views & Sales Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockStats.viewsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="views"
                      stroke="#8884d8"
                      strokeWidth={2}
                      name="Views"
                    />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      name="Sales"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Geographic Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Geographic Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockStats.topCountries}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mockStats.topCountries.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Device Types & Rating */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Device Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Device Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={mockStats.deviceTypes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Resource Info & Rating */}
            <Card>
              <CardHeader>
                <CardTitle>Resource Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Price:</span>
                  <Badge variant="outline">
                    {resource.price === 0 ? "Free" : `£${resource.price.toFixed(2)}`}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge 
                    className={
                      resource.status === "Published" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {resource.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Upload Date:</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(resource.uploadDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Average Rating:</span>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-lg ${
                            star <= Math.floor(mockStats.averageRating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {mockStats.averageRating} ({mockStats.ratingCount} reviews)
                    </span>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <h4 className="font-medium">Performance Summary:</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• This resource is performing above average</p>
                    <p>• Strong conversion rate at {mockStats.conversionRate}%</p>
                    <p>• Popular in UK and US markets</p>
                    <p>• Most views come from desktop users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}