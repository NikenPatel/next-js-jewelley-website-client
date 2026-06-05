interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}

const TextInput = ({
  label,
  value,
  onChange,
  type = "text",
}: TextInputProps) => {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-md font-semibold uppercase tracking-wider text-gray-700">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="
      w-full
      rounded-md
      border
      border-beige
      bg-narvik
      px-4
      py-3
      text-dark
      shadow-sm
      transition-all
      duration-200
      focus:border-gold
      focus:ring-2
      focus:ring-gold/20
      focus:outline-none
    "
      />
    </label>
  );
};

export default TextInput;
