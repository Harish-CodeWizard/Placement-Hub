export default function StatusTimeline({ currentStatus, statuses }) {
  const getStepIndex = (status) => {
    return statuses.findIndex((s) => s.label === status);
  };

  const currentStep = getStepIndex(currentStatus);

  // If status not found, default to first step
  const safeCurrentStep = currentStep >= 0 ? currentStep : 0;

  return (
    <div className="bg-white rounded-lg">
      <div className="flex items-center justify-between relative">
        {/* Progress bar background */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 z-0 rounded-full"></div>

        {/* Progress bar fill */}
        {safeCurrentStep >= 0 && (
          <div
            className="absolute top-6 left-0 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 z-0 transition-all duration-700 rounded-full shadow-sm"
            style={{
              width: `${(safeCurrentStep / (statuses.length - 1)) * 100}%`,
            }}
          ></div>
        )}

        {/* Steps */}
        <div className="flex justify-between w-full relative z-10 px-2">
          {statuses.map((status, index) => {
            const isCompleted = index < safeCurrentStep;
            const isCurrent = index === safeCurrentStep;
            const isUpcoming = index > safeCurrentStep;

            return (
              <div key={status.label} className="flex flex-col items-center max-w-16 min-w-12">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 shadow-md ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-emerald-200'
                      : isCurrent
                        ? 'bg-blue-500 text-white shadow-blue-200 animate-pulse'
                        : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {isCompleted ? '✓' : isCurrent ? '●' : index + 1}
                </div>
                <div className="text-center mt-2">
                  <div className="text-lg mb-1">
                    {status.icon || '⏳'}
                  </div>
                  <p className="text-xs text-gray-400 mb-1">
                    Step {index + 1}
                  </p>
                  <p
                    className={`text-xs font-semibold leading-tight ${
                      isCurrent ? 'text-blue-600' : isCompleted ? 'text-emerald-600' : 'text-gray-500'
                    }`}
                  >
                    {status.label}
                  </p>
                  {isCurrent && (
                    <p className="text-xs text-gray-500 mt-1 leading-tight max-w-20">
                      {status.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current status summary */}
      <div className="mt-6 p-3 bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${safeCurrentStep >= 0 ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
          <p className="text-sm text-gray-800">
            <span className="font-semibold">Current Status:</span>{' '}
            <span className={`font-medium ${safeCurrentStep >= 0 ? 'text-emerald-600' : 'text-gray-600'}`}>
              {currentStatus}
            </span>
          </p>
        </div>
        {statuses[safeCurrentStep]?.description && (
          <p className="text-xs text-gray-600 mt-1 ml-5">
            {statuses[safeCurrentStep].description}
          </p>
        )}
      </div>
    </div>
  );
}
