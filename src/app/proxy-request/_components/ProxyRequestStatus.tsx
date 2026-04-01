"use client";

import { Flame, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StatusProps {
  type: "not-member" | "submitted";
  ancestorName?: string;
  ritualDate?: string;
  onReset?: () => void;
}

export function ProxyRequestStatus({ type, ancestorName, ritualDate, onReset }: StatusProps) {
  const router = useRouter();

  if (type === "not-member") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-background-main p-6">
        <Card className="w-full max-w-md text-center border-neutral-main">
          <CardContent className="pt-12 pb-10 space-y-6">
            <Flame className="size-12 text-primary/30 mx-auto" />
            <div>
              <h2 className="font-playfair text-2xl font-bold text-text-main mb-2">
                Member Exclusive
              </h2>
              <p className="text-text-main/70 text-sm">
                The Proxy Burning Service is available only for Members. Join our membership to
                access this feature.
              </p>
            </div>
            <Button onClick={() => router.push("/membership")} className="font-bold">
              View Plans
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background-main p-6">
      <Card className="w-full max-w-md text-center border-primary/30 shadow-xl">
        <CardContent className="pt-12 pb-10 space-y-6">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="size-10 text-green-600" strokeWidth={3} />
          </div>
          <div>
            <h2 className="font-playfair text-3xl font-bold text-text-main mb-2">
              Request Submitted!
            </h2>
            <p className="text-text-main/70">
              Your proxy burning request for <strong>{ancestorName}</strong> on{" "}
              <strong>
                {ritualDate &&
                  new Date(ritualDate).toLocaleDateString("en-SG", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
              </strong>{" "}
              has been received. We'll send you a video confirmation once the ceremony is complete.
            </p>
          </div>
          <div className="flex flex-col gap-3 pt-4">
            <Button onClick={() => router.push("/profile")} className="font-bold py-5">
              View in Profile
            </Button>
            <Button variant="outline" onClick={onReset}>
              Submit Another Request
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
