"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import RegisterForm from "./RegisterForm";
import type { Activity } from "@/features/activity/model/activity.types";

export default function RegisterDialog({ activity }: { activity: Activity }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Đăng ký</Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Đăng ký tham gia</DialogTitle>
        </DialogHeader>

        <RegisterForm activity={activity} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
