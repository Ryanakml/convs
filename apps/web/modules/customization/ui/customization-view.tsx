"use client";

import { api } from "@workspace/backend/_generated/api";
import { useQuery } from "convex/react";
import { MessageSquareIcon, PhoneCallIcon, SparklesIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty";
import { CustomizationForm } from "./components/customization-form";

const LoadingState = () => (
  <div className="grid gap-4 md:grid-cols-2">
    <Card className="md:col-span-2">
      <CardHeader>
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-4 w-56" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-16 w-full" />
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-4 w-36" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  </div>
);

export const CustomizationView = () => {
  const widgetSettings = useQuery(api.private.widgetSettings.getOne);

  const vapiPlugin = useQuery(api.private.plugins.getOne, {
    service: "vapi",
  });

  const isLoading = widgetSettings === undefined || vapiPlugin === undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/40 px-4 py-10">
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-80" />
          </div>
          <LoadingState />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted p-8">
      <div className="mx-auto w-full max-w-screen ">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            Widget Customization
          </h1>
          <p className="text-sm text-muted-foreground">
            Customize your agent to fit to your customers need
          </p>
        </div>

        <div className="mt-8">
          <CustomizationForm
            initialData={widgetSettings}
            hasVapiPlugin={!!vapiPlugin}
          />
        </div>
      </div>
    </div>
  );
};
