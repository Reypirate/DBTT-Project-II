"use client";

import { useState } from "react";

export function useProxyRequestForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [ancestorName, setAncestorName] = useState("");
  const [ritualDate, setRitualDate] = useState("");
  const [ritualType, setRitualType] = useState("");
  const [bundle, setBundle] = useState("");
  const [instructions, setInstructions] = useState("");

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const resetForm = () => {
    setSubmitted(false);
    setStep(1);
    setAncestorName("");
    setRitualDate("");
    setRitualType("");
    setBundle("");
    setInstructions("");
  };

  const isStep1Valid = ancestorName && ritualDate && ritualType;
  const isStep2Valid = bundle;

  return {
    step,
    setStep,
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
  };
}
