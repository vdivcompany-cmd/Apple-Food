import React from "react";

export interface StepperProps {
  steps: string[];
  currentStepIndex: number;
}

export function Stepper({ steps, currentStepIndex }: StepperProps) {
  return (
    <div>
      {steps.map((step, idx) => (
        <div key={step}>
          <span>{idx + 1}</span>
          <span>{step}</span>
        </div>
      ))}
    </div>
  );
}
