"use client";

import type { PayloadAdminBarProps, PayloadMeUser } from "@payloadcms/admin-bar";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { PayloadAdminBar } from "@payloadcms/admin-bar";

import { getClientSideURL } from "@/lib/getURL";

type Props = {
  adminBarProps?: PayloadAdminBarProps;
};

export const AdminBar = ({ adminBarProps }: Props) => {
  const router = useRouter();
  const [show, setShow] = useState(false);

  const onAuthChange = useCallback((user: PayloadMeUser) => {
    setShow(Boolean(user?.id));
  }, []);

  return (
    <div className={show ? "block" : "hidden"}>
      <PayloadAdminBar
        {...adminBarProps}
        cmsURL={getClientSideURL()}
        onAuthChange={onAuthChange}
        onPreviewExit={() => {
          fetch("/next/exit-preview").then(() => {
            router.push("/");
            router.refresh();
          });
        }}
      />
    </div>
  );
};
