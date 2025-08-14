import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardSkeleton } from "../skeletons/dashboard-skeleton";
import { JobPostingsSkeleton } from "../skeletons/job-postings-skeleton";
import {
  JobPostingFormSkeleton,
  EditJobFormSkeleton,
} from "../skeletons/form-skeleton";
import { CandidatesSkeleton } from "../skeletons/candidates-skeleton";

const SkeletonDemo = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">
          Skeleton Loading Components Demo
        </h1>
        <p className="text-muted-foreground">
          Interactive demo of all skeleton loading states for the school
          dashboard system
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="job-postings">Job Postings</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>School Dashboard Skeleton</CardTitle>
            </CardHeader>
            <CardContent>
              <DashboardSkeleton />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="job-postings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Postings Page Skeleton</CardTitle>
            </CardHeader>
            <CardContent>
              <JobPostingsSkeleton />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forms" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Job Form Skeleton</CardTitle>
              </CardHeader>
              <CardContent>
                <JobPostingFormSkeleton />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Edit Job Form Skeleton</CardTitle>
              </CardHeader>
              <CardContent>
                <EditJobFormSkeleton />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="candidates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Candidates Page Skeleton</CardTitle>
            </CardHeader>
            <CardContent>
              <CandidatesSkeleton />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          These skeleton components provide smooth loading states for better
          user experience
        </p>
        <p>
          They automatically show when data is loading and hide when content is
          ready
        </p>
      </div>
    </div>
  );
};

export default SkeletonDemo;
