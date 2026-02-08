export default function StatusTimeline({ currentStatus, statuses }) {
  const getStepIndex = (status) => {
    return statuses.findIndex((s) => s.label === status);
  };

  const currentStep = getStepIndex(currentStatus);

  return (
    <div className="bg-white rounded-xl border border-gray-200 card-shadow p-8">
      <h3 className="text-base font-bold text-gray-900 mb-8">Application Timeline</h3>

      <div className="flex items-center justify-between relative">
        {/* Progress bar background */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 z-0 rounded-full"></div>

        {/* Progress bar fill */}
        {currentStep >= 0 && (
          <div
            className="absolute top-6 left-0 h-1 bg-emerald-500 z-0 transition-all duration-500 rounded-full"
            style={{
              width: `${(currentStep / (statuses.length - 1)) * 100}%`,
            }}
          ></div>
        )}

        {/* Steps */}
        <div className="flex justify-between w-full relative z-10">
          {statuses.map((status, index) => {
            const isCompleted = index <= currentStep;
            const isCurrent = index === currentStep;

            return (
              <div key={status.label} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-smooth ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-md'
                      : isCurrent
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {isCompleted ? '✓' : index + 1}
                </div>
                <p
                  className={`text-xs mt-3 font-600 text-center max-w-24 ${
                    isCurrent ? 'text-blue-600' : isCompleted ? 'text-gray-700' : 'text-gray-500'
                  }`}
                >
                  {status.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <span className="font-bold">Current Status:</span>{' '}
          <span className="font-600">{currentStatus}</span>
        </p>
      </div>
    </div>
  );
}
