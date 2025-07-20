import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Learning Path Tracker
          </h1>
          <div className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Track your language learning progress. Record and analyze your daily
            activities to reach your goals.
          </div>
        </div>

        <div className="flex justify-center max-w-6xl mx-auto">
          {/* Language Learning Card */}
          <Link href="/language-learning" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full mx-auto mb-6 flex items-center justify-center">
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
                      d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Language Learning
                </h3>
                <div className="text-gray-600 dark:text-gray-300 mb-6">
                  Your progress plan from B1 to C1 level. Daily activities and
                  goals.
                </div>
                <span className="inline-flex items-center text-green-600 dark:text-green-400 font-semibold group-hover:text-green-700 dark:group-hover:text-green-300">
                  Get Started →
                </span>
              </div>
            </div>
          </Link>
        </div>

        <div className="text-center mt-16">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-4xl mx-auto border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Track Your Goals
            </h2>
            <div className="text-gray-600 dark:text-gray-300 text-lg">
              Reach big goals with small daily steps. Visualize your progress
              and keep your motivation high.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
