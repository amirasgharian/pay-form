import { TransportLayout } from "./layouts/TransportLayout";
import { useEffect, useState } from "react";
import { StepVariant } from "./constants/StepValriants";
import { TargetCredit } from "./features/TargetCredit";
import { SourceCredit } from "./features/SourceCredit";
import { ReportTransport } from "./features/ReportTransport";

const steps = [TargetCredit, SourceCredit, ReportTransport];

function App() {
  const [stepsForm, setStepsForm] = useState([
    { sourceCredit: "", targetCredit: "", price: "" },
    { cvv2: "", month: "", year: "", dynamicPassword: "", timer: null },
    {},
  ]);
  const [step, setStep] = useState(0);

  const onNextStep = () => {
    if (step < steps.length - 1) {
      setStep((prev) => prev + 1);
    }
  };

  const onPrevStep = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

  const handleStepValue = (stepIndex, name, value) => {
    setStepsForm((prev) => {
      const updated = [...prev];
      updated[stepIndex] = { ...updated[stepIndex], [name]: value };
      return updated;
    });
  };

  const getStepValue = (stepIndex) => {
    return stepsForm[stepIndex];
  };

  const registerInput = (name) => {
    return {
      value: getStepValue(step)[name] || "",
      onChange: (e) => handleStepValue(step, name, e.target.value),
    };
  };

  useEffect(() => {
    const timerValue = stepsForm[StepVariant.Source].timer;
    if (timerValue === null) return;

    const interval = setInterval(() => {
      setStepsForm((prev) => {
        const updated = [...prev];
        const currentTimer = updated[StepVariant.Source].timer;
        if (currentTimer > 1) {
          updated[StepVariant.Source].timer = currentTimer - 1;
        } else {
          updated[StepVariant.Source].timer = null;
        }
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [stepsForm[StepVariant.Source].timer]);

  const CurrentStep = steps[step];
  return (
    <TransportLayout>
      <CurrentStep
        registerInput={registerInput}
        handleValue={(name, value) => handleStepValue(step, name, value)}
        getStepValue={getStepValue}
        onNextStep={onNextStep}
        onPrevStep={onPrevStep}
      />
    </TransportLayout>
  );
}

export default App;
