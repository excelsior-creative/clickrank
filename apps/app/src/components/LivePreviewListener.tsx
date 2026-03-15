"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { RefreshRouteOnSave } from "@payloadcms/live-preview-react";

import { getClientSideURL } from "@/lib/getURL";

export const LivePreviewListener = () => {
  const router = useRouter();

  return <RefreshRouteOnSave refresh={router.refresh} serverURL={getClientSideURL()} />;
};
