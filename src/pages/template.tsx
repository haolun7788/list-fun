import { useState } from 'react';
import { Play, RefreshCw, Settings } from 'lucide-react';
import '../app.css'

export default function SortingPractice() {
  const [minValue, setMinValue] = useState(1);
  const [maxValue, setMaxValue] = useState(100);
  const [listLength, setListLength] = useState(10);
  const [problemStarted, setProblemStarted] = useState(false);
  const [unsortedList, setUnsortedList] = useState<number[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('java');

  const generateRandomList = () => {
    const list = [];
    for (let i = 0; i < listLength; i++) {
      const randomNum = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
      list.push(randomNum);
    }
    return list;
  };

  const handleStart = () => {
    const newList = generateRandomList();
    setUnsortedList(newList);
    setProblemStarted(true);
  };

  const handleRandomize = () => {
    const newList = generateRandomList();
    setUnsortedList(newList);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1>
            Sorting Algorithm Practice
          </h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {!problemStarted ? (
          /* Setup Screen */
          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-semibold">Configure Your Challenge</h2>
              </div>

              <div className="space-y-6">
                {/* Min Value */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Minimum Value: {minValue}
                  </label>
                  <input
                    type="range"
                    min="-1000"
                    max="1000"
                    value={minValue}
                    onChange={(e) => setMinValue(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>-1000</span>
                    <span>1000</span>
                  </div>
                </div>

                {/* Max Value */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Maximum Value: {maxValue}
                  </label>
                  <input
                    type="range"
                    min="-1000"
                    max="1000"
                    value={maxValue}
                    onChange={(e) => setMaxValue(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>-1000</span>
                    <span>1000</span>
                  </div>
                </div>

                {/* List Length */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    List Length: {listLength}
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={listLength}
                    onChange={(e) => setListLength(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>5</span>
                    <span>100</span>
                  </div>
                </div>

                {/* Language Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Programming Language
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="csharp">C#</option>
                    <option value="go">Go</option>
                  </select>
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={handleStart}
                disabled={minValue >= maxValue}
                className="w-full mt-8 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Play className="w-5 h-5" />
                Start Challenge
              </button>

              {minValue >= maxValue && (
                <p className="text-red-400 text-sm text-center mt-3">
                  Minimum value must be less than maximum value
                </p>
              )}
            </div>
          </div>
        ) : (
          /* Problem Screen */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Panel - Problem & List */}
            <div className="space-y-6">
              {/* Problem Description */}
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3 text-blue-400">Challenge</h3>
                <p className="text-slate-300 mb-4">
                  Sort the following list of numbers in ascending order.
                </p>
                
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-2 font-mono">Unsorted List:</p>
                  <div className="flex flex-wrap gap-2">
                    {unsortedList.map((num, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-700 px-3 py-1 rounded text-sm font-mono"
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleRandomize}
                  className="mt-4 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Randomize
                </button>
              </div>

              {/* Settings Summary */}
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3 text-slate-300">Settings</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Range:</span>
                    <span className="font-mono">{minValue} to {maxValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Length:</span>
                    <span className="font-mono">{listLength}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Language:</span>
                    <span className="font-mono capitalize">{selectedLanguage}</span>
                  </div>
                </div>
                <button
                  onClick={() => setProblemStarted(false)}
                  className="mt-4 w-full bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Change Settings
                </button>
              </div>
            </div>

            {/* Right Panel - Code Editor */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3 text-purple-400">Code Editor</h3>
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 font-mono text-sm h-96 overflow-auto">
                <p className="text-slate-500">// Write your sorting algorithm here...</p>
                <p className="text-slate-500">// Monaco Editor will be integrated here</p>
              </div>
              
              <button className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl">
                Run & Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}