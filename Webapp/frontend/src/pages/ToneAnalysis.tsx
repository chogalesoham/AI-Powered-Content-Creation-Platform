import { useState } from 'react';

const ToneAnalysis = () => {
  const [posts, setPosts] = useState<string[]>(['', '', '']);
  const [analysis, setAnalysis] = useState<{ result: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (index: number, value: string) => {
    const newPosts = [...posts];
    newPosts[index] = value;
    setPosts(newPosts);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setAnalysis(null);
    setShowPopup(false);
    // Placeholder for AIML integration
    // Simulate API call
    setTimeout(() => {
      setAnalysis({
        result: 'Tone analysis result will appear here after AIML integration.'
      });
      setLoading(false);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl p-12 mt-12 mb-12 flex flex-col items-center">
        <div className="flex flex-col items-center mb-8">
          <span className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 p-4 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414M17.95 17.95l-1.414-1.414M6.05 6.05L4.636 7.464" />
            </svg>
          </span>
          <h2 className="text-4xl font-extrabold text-purple-700 mb-2 text-center">Tone Analysis</h2>
          <p className="text-gray-600 text-center text-lg">Paste your last 3 posts below and analyze their tone using AI.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10 w-full">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <label className="mb-3 text-base font-semibold text-gray-700">Post {i + 1}</label>
              <textarea
                className="w-64 h-32 border-2 border-purple-200 focus:border-purple-500 rounded-2xl p-4 resize-none shadow-md transition-all duration-200 text-lg"
                placeholder={`Paste post ${i + 1} here...`}
                value={posts[i]}
                onChange={e => handleChange(i, e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-center w-full">
          <button
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-10 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 hover:from-purple-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-60 text-lg"
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Analyzing...
              </span>
            ) : 'Tone Analysis'}
          </button>
        </div>
        {analysis && (
          <div className="mt-10 p-8 border-2 border-blue-200 rounded-2xl bg-blue-50 text-center shadow-lg w-full">
            <strong className="text-xl text-purple-700">Result:</strong>
            <div className="mt-3 text-gray-800 text-lg">{analysis.result}</div>
          </div>
        )}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white border-2 border-purple-400 rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center">
              <svg className="w-12 h-12 text-purple-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-xl font-bold text-purple-700 mb-2">Done!</span>
              <span className="text-gray-700">Tone analysis completed.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToneAnalysis;
