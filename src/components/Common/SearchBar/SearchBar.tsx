
export const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, placeholder}) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="border p-2 rounded sm:w-1/3 text-black focus:ring-indigo-700 max-sm:w-full"
    />
  );
};