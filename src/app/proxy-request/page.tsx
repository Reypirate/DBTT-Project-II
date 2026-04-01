"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Check } from "lucide-react";

import { useProxyRequestForm } from "./_hooks/useProxyRequestForm";
import { ProxyRequestStatus } from "./_components/ProxyRequestStatus";
import { Step1, Step2, Step3 } from "./_components/ProxyRequestSteps";

export default function ProxyRequestPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const isMember = user?.tier === "Member";

  const {
    step,
    submitted,
    setSubmitted,
    ancestorName,
    setAncestorName,
    ritualDate,
    setRitualDate,
    ritualType,
    setRitualType,
    bundle,
    setBundle,
    instructions,
    setInstructions,
    nextStep,
    prevStep,
    resetForm,
    isStep1Valid,
    isStep2Valid,
  } = useProxyRequestForm();

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  if (!isMember) {
    return <ProxyRequestStatus type="not-member" />;
  }

  if (submitted) {
    return (
      <ProxyRequestStatus
        type="submitted"
        ancestorName={ancestorName}
        ritualDate={ritualDate}
        onReset={resetForm}
      />
    );
  }

  return (
    <div className="bg-background-main min-h-screen py-12">
      <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
        <header className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Flame className="size-3 mr-1" />
            Member Service
          </Badge>
          <h1 className="font-playfair text-4xl font-bold text-text-main mb-3">
            Request Proxy Burning
          </h1>
          <p className="text-text-main/70 max-w-xl mx-auto">
            Let Hin Long perform the ritual on your behalf. Fill in the details below and we'll take
            care of the rest.
          </p>
        </header>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step >= s
                    ? "bg-primary text-primary-foreground"
                    : "bg-neutral-main/20 text-text-main/40"
                }`}
              >
                {step > s ? <Check className="size-4" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-12 h-0.5 ${step > s ? "bg-primary" : "bg-neutral-main/20"}`} />
              )}
            </div>
          ))}
        </div>

        <Card className="border-neutral-main shadow-sm">
          <CardContent className="p-8">
            {step === 1 && (
              <Step1
                ancestorName={ancestorName}
                setAncestorName={setAncestorName}
                ritualDate={ritualDate}
                setRitualDate={setRitualDate}
                ritualType={ritualType}
                setRitualType={setRitualType}
                onNext={nextStep}
                isValid={isStep1Valid}
              />
            )}

            {step === 2 && (
              <Step2
                bundle={bundle}
                setBundle={setBundle}
                onNext={nextStep}
                onBack={prevStep}
                isValid={isStep2Valid}
              />
            )}

            {step === 3 && (
              <Step3
                ancestorName={ancestorName}
                ritualDate={ritualDate}
                instructions={instructions}
                setInstructions={setInstructions}
                onBack={prevStep}
                onSubmit={() => setSubmitted(true)}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
