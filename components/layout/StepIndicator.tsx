interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div
          key={step}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
            step === currentStep
              ? 'bg-primary text-background-dark font-semibold scale-110'
              : step < currentStep
              ? 'bg-primary/50 text-white'
              : 'bg-surface-dark text-gray-500'
          }`}
        >
          {step < currentStep ? '✓' : step}
        </div>
      ))}
    </div>
  )
}

