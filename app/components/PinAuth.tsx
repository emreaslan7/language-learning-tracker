import { useState } from "react";

interface PinAuthProps {
  onAuthenticated: () => void;
}

export default function PinAuth({ onAuthenticated }: PinAuthProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Correct PIN (not stored in GitHub)
  const CORRECT_PIN = "010507";

  const handlePinChange = (value: string) => {
    // Only allow numbers and max 6 digits
    if (value.length <= 6 && /^\d*$/.test(value)) {
      setPin(value);
      setError("");

      // Auto-submit when 6 digits entered
      if (value.length === 6) {
        setTimeout(() => checkPin(value), 100);
      }
    }
  };

  const checkPin = (pinToCheck: string = pin) => {
    setIsLoading(true);

    if (pinToCheck === CORRECT_PIN) {
      // Store authentication timestamp
      const expirationTime = Date.now() + 12 * 60 * 60 * 1000; // 12 hours
      localStorage.setItem("pinAuthExpiration", expirationTime.toString());

      setTimeout(() => {
        setIsLoading(false);
        onAuthenticated();
      }, 500);
    } else {
      setTimeout(() => {
        setIsLoading(false);
        setError("Invalid PIN. Please try again.");
        setPin("");
      }, 500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length === 6) {
      checkPin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Required
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Enter your 6-digit PIN to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              PIN Code
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => handlePinChange(e.target.value)}
              className="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="• • • • • •"
              maxLength={6}
              autoFocus
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-red-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.764 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <span className="text-red-700 dark:text-red-300 text-sm">
                  {error}
                </span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={pin.length !== 6 || isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Verifying...
              </div>
            ) : (
              "Access Learning Platform"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            🔒 Authentication expires every 12 hours for security
          </div>
        </div>
      </div>
    </div>
  );
}
