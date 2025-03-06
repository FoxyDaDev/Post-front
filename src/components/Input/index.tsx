import React, { useState, ChangeEvent, useEffect } from 'react';

interface InputProps {
  name: string;
  type: string;
  inputText?: string;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  label?: string;
  id?: string;
  onChange?: (value: string) => void;
}

function Input({
  name = '',
  type = '',
  inputText = '',
  minLength = 0,
  maxLength = 100,
  label = '',
  id,
  required = false,
  onChange,
}: InputProps) {
  const [value, setValue] = useState<string>(inputText);

  useEffect(() => {
    setValue(inputText);
  }, [inputText]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="w-full mb-4">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-500 mb-1 pl-1"
        >
          {label}
        </label>
      )}
      <input
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        minLength={minLength}
        maxLength={maxLength}
        required={required}
        autoComplete="off"
        className="bg-inputBackgroundish text-gray-900 rounded-lg focus:outline-none block w-full p-2.5"
        id={id}
      />
    </div>
  );
}

export default Input;