//adminLogin

import React from 'react';

const InputField = ({ label, type, value, onChange }) => {
  return (
    <label className="block mb-4 bg-white">
      <span className="text-gray-700 bg-white">{label}</span>
      <input
        type={type}
        className="mt-1 block w-full border border-gray-300 rounded p-2"
        value={value}
        onChange={onChange}
        required
      />
    </label>
  );
};

export default InputField;
