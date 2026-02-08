'use client';

export default function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  options = [],
}) {
  const inputClasses = 'w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-400 text-gray-900 placeholder-gray-500 transition-smooth focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white';

  if (type === 'select') {
    return (
      <div className="mb-5">
        <label className="block text-sm font-600 text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={inputClasses}
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-red-600 text-sm mt-2 font-500">{error}</p>}
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div className="mb-5">
        <label className="block text-sm font-600 text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={4}
          className={inputClasses}
        />
        {error && <p className="text-red-600 text-sm mt-2 font-500">{error}</p>}
      </div>
    );
  }

  if (type === 'file') {
    return (
      <div className="mb-5">
        <label className="block text-sm font-600 text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          type="file"
          name={name}
          onChange={onChange}
          accept=".pdf,.doc,.docx"
          className={`${inputClasses} file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-500 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200`}
        />
        <p className="text-xs text-gray-500 mt-2">Accepted formats: PDF, DOC, DOCX</p>
        {error && <p className="text-red-600 text-sm mt-2 font-500">{error}</p>}
      </div>
    );
  }

  return (
    <div className="mb-5">
      <label className="block text-sm font-600 text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputClasses}
      />
      {error && <p className="text-red-600 text-sm mt-2 font-500">{error}</p>}
    </div>
  );
}
