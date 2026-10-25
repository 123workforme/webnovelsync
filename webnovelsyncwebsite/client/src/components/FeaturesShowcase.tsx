import React, { useState, useEffect } from 'react';

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  demo: React.ReactNode;
}

const FeaturesShowcase: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const features: Feature[] = [
    {
      title: "Real-Time Sync Progress",
      description: "Track your sync progress with detailed status indicators and live updates",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      demo: (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">Scanning chapters: 5/10</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full w-1/2 transition-all duration-1000"></div>
          </div>
          <div className="text-xs text-gray-400">
            <div>• Pending: 3</div>
            <div>• Completed: 5</div>
            <div>• Failed: 0</div>
          </div>
        </div>
      )
    },
    {
      title: "Multi-Platform Support", 
      description: "Sync to all 8 platforms simultaneously - completely free!",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      demo: (
        <div className="space-y-2">
          {['ScribbleHub', 'RoyalRoad', 'Webnovel', 'FanFiction.net', 'Archive of Our Own', 'Wattpad', 'Inkitt', 'Tapas'].map((platform, index) => (
            <div key={platform} className="flex items-center justify-between p-2 bg-gray-700 rounded">
              <span className="text-sm text-gray-300">{platform}</span>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
          ))}
        </div>
      )
    },
    {
      title: "Smart Batch Processing",
      description: "Process multiple chapters at once with intelligent error handling",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      demo: (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">Batch Size:</span>
            <select className="bg-gray-700 text-white px-2 py-1 rounded text-sm">
              <option>1 (Most Reliable)</option>
              <option>2 (Balanced)</option>
              <option>3 (Faster)</option>
              <option>5 (Fastest)</option>
            </select>
          </div>
          <div className="text-xs text-gray-400">
            Larger batch sizes process chapters faster but may cause errors.
          </div>
          <div className="flex space-x-2">
            <button className="flex-1 bg-blue-500 text-white py-1 px-2 rounded text-xs">Scan Tab</button>
            <button className="flex-1 bg-gray-600 text-white py-1 px-2 rounded text-xs">Stop</button>
          </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveFeature((prev) => (prev + 1) % features.length);
        setIsAnimating(false);
      }, 150);
    }, 4000);

    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
      <h3 className="text-2xl font-bold text-center mb-8 text-white">Extension Features in Action</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                index === activeFeature
                  ? 'border-blue-500 bg-blue-500 bg-opacity-20'
                  : 'border-gray-600 bg-gray-700 hover:border-gray-500'
              }`}
              onClick={() => setActiveFeature(index)}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  index === activeFeature ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'
                }`}>
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold mb-1 ${
                    index === activeFeature ? 'text-blue-300' : 'text-white'
                  }`}>
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-600">
          <div className={`transition-opacity duration-300 ${
            isAnimating ? 'opacity-0' : 'opacity-100'
          }`}>
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-blue-500 rounded-lg text-white">
                {features[activeFeature].icon}
              </div>
              <h4 className="font-semibold text-white">{features[activeFeature].title}</h4>
            </div>
            
            <div className="min-h-[200px]">
              {features[activeFeature].demo}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        {features.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === activeFeature ? 'bg-blue-500' : 'bg-gray-600'
            }`}
            onClick={() => setActiveFeature(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturesShowcase;