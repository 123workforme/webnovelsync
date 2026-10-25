import React, { useState } from 'react';

interface TutorialStep {
  title: string;
  description: string;
  image?: string;
  highlight?: string;
}

const InteractiveTutorial: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const tutorialSteps: TutorialStep[] = [
    {
      title: "Welcome to WebnovelSync!",
      description: "This extension cross-posts your chapters between novel platforms automatically. All 8 platforms, completely free, no account required. Let's take a quick tour!",
      highlight: "Get ready to streamline your publishing workflow"
    },
    {
      title: "Configure Your Platforms",
      description: "Enable the platforms you want to post TO — ScribbleHub, RoyalRoad, Webnovel, FanFiction.net, AO3, Wattpad, Inkitt, or Tapas — and enter each one's Story/Work ID. The extension remembers your novel names, so you always know which ID is which.",
      highlight: "Set up your target destinations"
    },
    {
      title: "Set Chapter Range",
      description: "Enter the start and end chapter numbers you want to sync. You can process a single chapter or a whole range at once.",
      highlight: "Define what to sync"
    },
    {
      title: "Pick a Post Mode",
      description: "Each platform has its own post mode: publish immediately, save as a draft, use the platform's native scheduler, or queue chapters to post at a set time — the queue works even after you restart your browser.",
      highlight: "Publish, draft, schedule, or queue"
    },
    {
      title: "Choose Your Batch Size",
      description: "Control how many chapters process at once. Larger batches are faster but may cause errors. Start with 1 for reliability.",
      highlight: "Optimize for speed vs reliability"
    },
    {
      title: "Start Syncing!",
      description: "Navigate to a chapter on a supported source (Webnovel, ScribbleHub, AO3, FanFiction.net, RoyalRoad, Wattpad, or Tapas) and click 'Scan Current Tab'. The extension handles the rest!",
      highlight: "You're ready to go!"
    }
  ];

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsOpen(false);
      setCurrentStep(0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const closeTutorial = () => {
    setIsOpen(false);
    setCurrentStep(0);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg transition-all hover:scale-105 flex items-center space-x-2"
        >
          <span>📚</span>
          <span>Take Tutorial</span>
        </button>
      </div>
    );
  }

  const currentTutorialStep = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h3 className="text-xl font-semibold text-white">{currentTutorialStep.title}</h3>
          <button
            onClick={closeTutorial}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-300 leading-relaxed">{currentTutorialStep.description}</p>
            {currentTutorialStep.highlight && (
              <div className="mt-4 p-3 bg-blue-500 bg-opacity-20 border border-blue-500 rounded-lg">
                <p className="text-blue-300 font-medium">{currentTutorialStep.highlight}</p>
              </div>
            )}
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Progress</span>
              <span>{currentStep + 1} / {tutorialSteps.length}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center p-6 border-t border-gray-700">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex space-x-2">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-blue-500' : 
                  index < currentStep ? 'bg-green-500' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextStep}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            {currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InteractiveTutorial;