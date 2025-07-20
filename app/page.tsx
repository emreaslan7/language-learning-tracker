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
            Dil öğrenimi, LeetCode ve DeepML.com ilerlemenizi takip edin.
            Hedeflerinize ulaşmak için günlük aktivitelerinizi kaydedin ve
            analiz edin.
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                  Dil Öğrenimi
                </h3>
                <div className="text-gray-600 dark:text-gray-300 mb-6">
                  B1 seviyesinden C1 seviyesine ilerleme planınız. Günlük
                  aktiviteler ve hedefler.
                </div>
                <span className="inline-flex items-center text-green-600 dark:text-green-400 font-semibold group-hover:text-green-700 dark:group-hover:text-green-300">
                  Başla →
                </span>
              </div>
            </div>
          </Link>

          {/* LeetCode Card */}
          <Link href="/leetcode" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mx-auto mb-6 flex items-center justify-center">
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
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  LeetCode
                </h3>
                <div className="text-gray-600 dark:text-gray-300 mb-6">
                  Algoritma ve veri yapısı problemleri. Günlük çözüm hedefleri
                  ve ilerleme takibi.
                </div>
                <span className="inline-flex items-center text-orange-600 dark:text-orange-400 font-semibold group-hover:text-orange-700 dark:group-hover:text-orange-300">
                  Başla →
                </span>
              </div>
            </div>
          </Link>

          {/* DeepML Card */}
          <Link href="/deepml" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
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
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  DeepML.com
                </h3>
                <div className="text-gray-600 dark:text-gray-300 mb-6">
                  AI ve Machine Learning problemleri. Yapay zeka konularında
                  pratik ve öğrenim.
                </div>
                <span className="inline-flex items-center text-purple-600 dark:text-purple-400 font-semibold group-hover:text-purple-700 dark:group-hover:text-purple-300">
                  Başla →
                </span>
              </div>
            </div>
          </Link>
        </div>

        <div className="text-center mt-16">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-4xl mx-auto border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Hedeflerinizi Takip Edin
            </h2>
            <div className="text-gray-600 dark:text-gray-300 text-lg">
              Her gün küçük adımlarla büyük hedeflere ulaşın. İlerlemenizi
              görselleştirin ve motivasyonunuzu yüksek tutun.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
