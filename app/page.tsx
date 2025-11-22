"use client";

import { useState } from "react";

type ButtonConfig = {
  label: string;
  value: string;
  variant?: "operator" | "accent" | "equal";
  span?: number;
};

const BUTTONS: ButtonConfig[] = [
  { label: "مسح الكل", value: "AC", variant: "accent", span: 2 },
  { label: "⌫", value: "DEL", variant: "accent" },
  { label: "÷", value: "/" , variant: "operator"},
  { label: "7", value: "7" },
  { label: "8", value: "8" },
  { label: "9", value: "9" },
  { label: "×", value: "*", variant: "operator" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
  { label: "-", value: "-", variant: "operator" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "+", value: "+", variant: "operator" },
  { label: "%", value: "%", variant: "operator" },
  { label: "0", value: "0" },
  { label: ".", value: "." },
  { label: "=", value: "=", variant: "equal", span: 2 }
];

export default function CalculatorPage() {
  const [expression, setExpression] = useState<string>("");
  const [history, setHistory] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [justEvaluated, setJustEvaluated] = useState<boolean>(false);

  const appendValue = (value: string) => {
    if (justEvaluated && /[0-9.]/.test(value)) {
      setExpression(value);
    } else if (justEvaluated) {
      setExpression((prev) => prev + value);
    } else {
      setExpression((prev) => prev + value);
    }
    setJustEvaluated(false);
    setError("");
  };

  const handleOperator = (value: string) => {
    if (expression === "" && value !== "-") {
      return;
    }
    setExpression((prev) => {
      if (/[+\-*/%]$/.test(prev)) {
        return prev.slice(0, -1) + value;
      }
      return prev + value;
    });
    setJustEvaluated(false);
    setError("");
  };

  const evaluate = () => {
    if (!expression) {
      return;
    }

    try {
      const sanitized = expression.replace(/[^0-9+\-*/%.() ]/g, "");
      if (!sanitized) {
        throw new Error("صيغة غير صحيحة");
      }
      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict"; return (${sanitized.replace(/%/g, "/100")});`)();
      if (!Number.isFinite(result)) {
        throw new Error("ناتج غير صالح");
      }
      setHistory(expression);
      setExpression(String(result));
      setJustEvaluated(true);
      setError("");
    } catch (err) {
      setError("حدث خطأ في الحساب");
      setJustEvaluated(false);
    }
  };

  const handleAction = (value: string) => {
    switch (value) {
      case "AC":
        setExpression("");
        setHistory("");
        setError("");
        setJustEvaluated(false);
        break;
      case "DEL":
        if (justEvaluated) {
          setExpression("");
          setJustEvaluated(false);
        } else {
          setExpression((prev) => prev.slice(0, -1));
        }
        setError("");
        break;
      case "=":
        evaluate();
        break;
      default:
        if (/[+\-*/%]/.test(value)) {
          handleOperator(value);
        } else {
          appendValue(value);
        }
    }
  };

  return (
    <main className="calculator">
      <section className="display" aria-live="polite">
        <div className="history">{error || history}</div>
        <div className="value">{expression || "0"}</div>
      </section>
      <section className="pad">
        {BUTTONS.map((button) => (
          <button
            key={button.label}
            type="button"
            className={[
              button.variant ? button.variant : "",
              button.span ? `span-${button.span}` : ""
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => handleAction(button.value)}
          >
            {button.label}
          </button>
        ))}
      </section>
    </main>
  );
}
