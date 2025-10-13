import DashboardLayout from "@/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Package,
  ShoppingCart,
  Building2,
  MessageCircle,
  DollarSign,
  TrendingUp,
  Clock,
  Star,
  Truck,
  Calendar,
  ArrowRight,
  Plus,
  Eye,
  FileText,
} from "lucide-react";
import {
  DashboardErrorFallback,
  SectionErrorFallback,
} from "@/components/ui/error-fallback";
import {
  EmptyJobPostings,
  EmptySearchResults,
} from "@/components/ui/empty-state";
import { useNavigate } from "react-router-dom";

const SupplierDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Active Products",
      value: "47",
      change: "+5",
      icon: Package,
      color: "text-brand-primary",
    },
    {
      title: "Pending Orders",
      value: "23",
      change: "+8",
      icon: ShoppingCart,
      color: "text-brand-accent-green",
    },
    {
      title: "Partner Schools",
      value: "156",
      change: "+12",
      icon: Building2,
      color: "text-brand-secondary",
    },
    {
      title: "Revenue This Month",
      value: "$24,680",
      change: "+18%",
      icon: DollarSign,
      color: "text-brand-accent-orange",
    },
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      school: "International School of Bangkok",
      products: "Science Lab Equipment Set",
      value: "$12,450",
      status: "Processing",
      orderDate: "March 15, 2024",
      deliveryDate: "March 30, 2024",
      items: 8,
    },
    {
      id: "ORD-002",
      school: "British School Dubai",
      products: "Interactive Whiteboards",
      value: "$8,900",
      status: "Shipped",
      orderDate: "March 12, 2024",
      deliveryDate: "March 25, 2024",
      items: 3,
    },
    {
      id: "ORD-003",
      school: "American School Singapore",
      products: "Classroom Furniture Package",
      value: "$15,200",
      status: "Quote Sent",
      orderDate: "March 10, 2024",
      deliveryDate: "April 5, 2024",
      items: 12,
    },
  ];

  const topProducts = [
    {
      id: 1,
      name: 'Interactive Smart Board 75"',
      category: "Technology",
      sales: 18,
      revenue: "$45,600",
      rating: 4.8,
      stock: 12,
      trending: true,
    },
    {
      id: 2,
      name: "Student Desk & Chair Set",
      category: "Furniture",
      sales: 34,
      revenue: "$28,400",
      rating: 4.6,
      stock: 156,
      trending: false,
    },
    {
      id: 3,
      name: "Science Lab Microscope Kit",
      category: "Laboratory",
      sales: 12,
      revenue: "$18,900",
      rating: 4.9,
      stock: 8,
      trending: true,
    },
  ];

  const inquiries = [
    {
      id: 1,
      school: "Qatar International School",
      product: "Chemistry Lab Setup",
      budget: "$35,000",
      urgency: "High",
      date: "March 16, 2024",
      status: "New",
    },
    {
      id: 2,
      school: "German School Shanghai",
      product: "Sports Equipment Package",
      budget: "$18,000",
      urgency: "Medium",
      date: "March 15, 2024",
      status: "Quoted",
    },
    {
      id: 3,
      school: "International School Mumbai",
      product: "Art Supplies Bundle",
      budget: "$8,500",
      urgency: "Low",
      date: "March 14, 2024",
      status: "Follow-up",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing":
        return "bg-brand-primary text-white";
      case "Shipped":
        return "bg-brand-accent-green text-white";
      case "Quote Sent":
        return "bg-brand-secondary text-white";
      case "Delivered":
        return "bg-green-600 text-white";
      case "New":
        return "bg-brand-accent-orange text-white";
      case "Quoted":
        return "bg-brand-primary text-white";
      case "Follow-up":
        return "bg-yellow-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "High":
        return "bg-red-500 text-white";
      case "Medium":
        return "bg-yellow-500 text-white";
      case "Low":
        return "bg-brand-accent-green text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Navigation functions
  const handleCreateQuote = () => {
    navigate("/dashboard/supplier/create-quote");
  };

  const handleViewAllInquiries = () => {
    navigate("/dashboard/supplier/inquiries");
  };

  const handleManageProducts = () => {
    navigate("/dashboard/supplier/products");
  };

  const handleViewOrderDetails = (orderId: string) => {
    navigate(`/dashboard/supplier/order/${orderId}`);
  };

  const handleUpdateOrderStatus = (orderId: string) => {
    navigate(`/dashboard/supplier/order/${orderId}/update`);
  };

  const handleRespondToInquiry = (inquiryId: number) => {
    navigate(`/dashboard/supplier/inquiry/${inquiryId}/respond`);
  };

  return (
    <DashboardLayout role="supplier">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
            Welcome back! 📦
          </h1>
          <p className="text-muted-foreground">
            You have 5 new inquiries and 8 orders ready for processing.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="hover:shadow-card-hover transition-shadow"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-brand-accent-green">
                      {stat.change}
                    </span>{" "}
                    from last month
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-heading text-xl">
                    Recent Orders
                  </CardTitle>
                  <Button variant="default" onClick={handleCreateQuote}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Quote
                  </Button>
                </div>
                <CardDescription>
                  Manage and track your current orders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 border border-border rounded-lg hover:border-brand-primary/30 hover:shadow-sm transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{order.id}</h3>
                        <p className="text-muted-foreground">{order.school}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.products}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                        <div className="text-lg font-bold text-brand-accent-green mt-1">
                          {order.value}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Ordered: {order.orderDate}
                      </div>
                      <div className="flex items-center">
                        <Truck className="w-4 h-4 mr-1" />
                        Delivery: {order.deliveryDate}
                      </div>
                      <div className="flex items-center">
                        <Package className="w-4 h-4 mr-1" />
                        {order.items} items
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewOrderDetails(order.id)}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleUpdateOrderStatus(order.id)}
                      >
                        Update Status
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* New Inquiries */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">
                  New Inquiries
                </CardTitle>
                <CardDescription>
                  Schools interested in your products
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {inquiries.slice(0, 3).map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="p-3 border border-border rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-sm">
                          {inquiry.school}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {inquiry.product}
                        </p>
                      </div>
                      <Badge
                        className={`${getUrgencyColor(
                          inquiry.urgency
                        )} text-xs`}
                      >
                        {inquiry.urgency}
                      </Badge>
                    </div>

                    <div className="text-xs text-muted-foreground space-y-1 mb-3">
                      <div className="flex items-center">
                        <DollarSign className="w-3 h-3 mr-1" />
                        Budget: {inquiry.budget}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {inquiry.date}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge
                        className={`${getStatusColor(inquiry.status)} text-xs`}
                      >
                        {inquiry.status}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRespondToInquiry(inquiry.id)}
                      >
                        Respond
                      </Button>
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleViewAllInquiries}
                >
                  View All Inquiries
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">
                  Top Products
                </CardTitle>
                <CardDescription>Your best-performing products</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {topProducts.slice(0, 3).map((product) => (
                  <div
                    key={product.id}
                    className="p-3 border border-border rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-sm">
                            {product.name}
                          </h4>
                          {product.trending && (
                            <TrendingUp className="w-3 h-3 text-brand-accent-green" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {product.category}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Sales: {product.sales}</span>
                        <span className="font-semibold text-brand-accent-green">
                          {product.revenue}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
                          {product.rating}
                        </div>
                        <span className="text-muted-foreground">
                          Stock: {product.stock}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleManageProducts}
                >
                  Manage Products
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">
                  This Month
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-brand-primary">
                      32
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Orders Completed
                    </div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-brand-accent-green">
                      96%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      On-time Delivery
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Customer Satisfaction</span>
                    <span className="font-semibold">4.7/5</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>

                <div className="pt-2 text-sm text-muted-foreground">
                  <div className="flex justify-between mb-1">
                    <span>Avg. order value:</span>
                    <span>$8,450</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Top category:</span>
                    <span>Technology</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SupplierDashboard;
