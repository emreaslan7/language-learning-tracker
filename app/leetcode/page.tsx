export default function LeetCode() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            LeetCode Progress
          </h1>
          <div className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Algoritma ve veri yapısı problemlerini çözerek programming
            becerilerinizi geliştirin. Günlük hedefler ve ilerleme takibi ile
            coding interview'lara hazırlanın.
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {/* Progress Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              İstatistikler
            </h2>
            <div className="space-y-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  247
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Çözülen Problemler
                </div>
              </div>

              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  31
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Günlük Streak
                </div>
              </div>

              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  1247
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Toplam Puan
                </div>
              </div>
            </div>
          </div>

          {/* Difficulty Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Zorluk Seviyesi
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-green-600">
                    Easy
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    127/193
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                  <div
                    className="bg-green-600 h-3 rounded-full"
                    style={{ width: "65%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-yellow-600">
                    Medium
                  </span>
                  <span className="text-sm font-medium text-yellow-600">
                    89/341
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                  <div
                    className="bg-yellow-600 h-3 rounded-full"
                    style={{ width: "26%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-red-600">Hard</span>
                  <span className="text-sm font-medium text-red-600">
                    31/127
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                  <div
                    className="bg-red-600 h-3 rounded-full"
                    style={{ width: "24%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Goals */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Günlük Hedefler
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    Easy Problem
                  </span>
                </div>
                <span className="text-green-600 dark:text-green-400 font-semibold">
                  ✓
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    Medium Problem
                  </span>
                </div>
                <span className="text-yellow-600 dark:text-yellow-400 font-semibold">
                  In Progress
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-400 rounded-full mr-3"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    Review Solutions
                  </span>
                </div>
                <span className="text-gray-400 font-semibold">Pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Problem Categories */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Problem Kategorileri
          </h2>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { name: "Array", solved: 45, total: 67, color: "blue" },
              { name: "String", solved: 32, total: 54, color: "green" },
              { name: "Linked List", solved: 18, total: 23, color: "purple" },
              { name: "Binary Tree", solved: 25, total: 41, color: "red" },
              {
                name: "Dynamic Programming",
                solved: 12,
                total: 34,
                color: "yellow",
              },
              { name: "Graph", solved: 8, total: 28, color: "indigo" },
              { name: "Hash Table", solved: 22, total: 31, color: "pink" },
              { name: "Binary Search", solved: 15, total: 19, color: "cyan" },
            ].map((category) => (
              <div
                key={category.name}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow cursor-pointer"
              >
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {category.name}
                  </h3>
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                    {category.solved}/{category.total}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 mb-4">
                    <div
                      className={`bg-${category.color}-600 h-2 rounded-full`}
                      style={{
                        width: `${(category.solved / category.total) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors text-sm">
                    Devam Et
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Hızlı İşlemler
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <button className="bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 transition-colors">
                Random Easy Problem
              </button>
              <button className="bg-yellow-600 text-white py-4 px-6 rounded-lg hover:bg-yellow-700 transition-colors">
                Random Medium Problem
              </button>
              <button className="bg-red-600 text-white py-4 px-6 rounded-lg hover:bg-red-700 transition-colors">
                Review Past Solutions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
