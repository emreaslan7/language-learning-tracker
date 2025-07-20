export default function DeepML() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            DeepML.com Progress
          </h1>
          <div className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Machine Learning ve AI problemlerini çözerek yapay zeka
            becerilerinizi geliştirin. Practical ML challenges, theory questions
            ve hands-on projects ile öğrenin.
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {/* Progress Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              AI Öğrenim İstatistikleri
            </h2>
            <div className="space-y-4">
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  89
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Çözülen Problemler
                </div>
              </div>

              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  Level 4
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  ML Seviye
                </div>
              </div>

              <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  2847
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  AI Points
                </div>
              </div>
            </div>
          </div>

          {/* Learning Path Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Öğrenme Yolu
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-green-600">
                    Fundamentals
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    Completed
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                  <div
                    className="bg-green-600 h-3 rounded-full"
                    style={{ width: "100%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-yellow-600">
                    Supervised Learning
                  </span>
                  <span className="text-sm font-medium text-yellow-600">
                    75%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                  <div
                    className="bg-yellow-600 h-3 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-purple-600">
                    Deep Learning
                  </span>
                  <span className="text-sm font-medium text-purple-600">
                    45%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                  <div
                    className="bg-purple-600 h-3 rounded-full"
                    style={{ width: "45%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-400">
                    MLOps
                  </span>
                  <span className="text-sm font-medium text-gray-400">
                    Locked
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                  <div
                    className="bg-gray-400 h-3 rounded-full"
                    style={{ width: "0%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Goals */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Günlük AI Hedefleri
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    Theory Question
                  </span>
                </div>
                <span className="text-green-600 dark:text-green-400 font-semibold">
                  ✓
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    Coding Challenge
                  </span>
                </div>
                <span className="text-purple-600 dark:text-purple-400 font-semibold">
                  In Progress
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-400 rounded-full mr-3"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    Paper Review
                  </span>
                </div>
                <span className="text-gray-400 font-semibold">Pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* ML Topics */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Machine Learning Konuları
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Linear Regression",
                solved: 12,
                total: 15,
                color: "blue",
                difficulty: "Beginner",
                description: "Regression analysis ve statistical modeling",
              },
              {
                name: "Classification",
                solved: 18,
                total: 22,
                color: "green",
                difficulty: "Beginner",
                description: "Logistic regression, SVM, decision trees",
              },
              {
                name: "Neural Networks",
                solved: 8,
                total: 18,
                color: "purple",
                difficulty: "Intermediate",
                description: "Deep learning fundamentals",
              },
              {
                name: "Computer Vision",
                solved: 5,
                total: 16,
                color: "red",
                difficulty: "Advanced",
                description: "CNN, image processing, object detection",
              },
              {
                name: "NLP",
                solved: 7,
                total: 20,
                color: "yellow",
                difficulty: "Intermediate",
                description: "Text processing, transformers, LLMs",
              },
              {
                name: "Reinforcement Learning",
                solved: 3,
                total: 12,
                color: "indigo",
                difficulty: "Advanced",
                description: "Q-learning, policy gradients",
              },
            ].map((topic) => (
              <div
                key={topic.name}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow cursor-pointer"
              >
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {topic.name}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        topic.difficulty === "Beginner"
                          ? "bg-green-100 text-green-600"
                          : topic.difficulty === "Intermediate"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {topic.difficulty}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {topic.description}
                  </div>
                  <div className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    {topic.solved}/{topic.total}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 mb-4">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{
                        width: `${(topic.solved / topic.total) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm">
                    Continue Learning
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Research & Projects */}
        <div className="max-w-6xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Research & Projects
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                📄 Latest Papers
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    Attention Is All You Need
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Transformer architecture fundamentals
                  </div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    BERT: Pre-training of Deep Bidirectional Transformers
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Language representation models
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                🚀 Active Projects
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="font-semibold text-purple-900 dark:text-purple-300">
                    Sentiment Analysis Model
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">
                    Building a custom BERT-based classifier
                  </div>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="font-semibold text-blue-900 dark:text-blue-300">
                    Computer Vision Pipeline
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    Object detection using YOLO
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Hızlı AI Aktiviteleri
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              <button className="bg-purple-600 text-white py-4 px-6 rounded-lg hover:bg-purple-700 transition-colors">
                Random ML Question
              </button>
              <button className="bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                Coding Challenge
              </button>
              <button className="bg-indigo-600 text-white py-4 px-6 rounded-lg hover:bg-indigo-700 transition-colors">
                Theory Quiz
              </button>
              <button className="bg-pink-600 text-white py-4 px-6 rounded-lg hover:bg-pink-700 transition-colors">
                Project Ideas
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
