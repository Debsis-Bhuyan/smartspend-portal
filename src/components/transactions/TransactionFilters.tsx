import { TransactionFiltersType } from "./type";

interface TransactionFiltersProps {
  filters: TransactionFiltersType;
  setFilters: React.Dispatch<React.SetStateAction<TransactionFiltersType>>;
}

export default function TransactionFilters({ filters, setFilters }: TransactionFiltersProps) {
  return (
    <div className="flex gap-4 mb-4">
      <select
        value={filters.category}
        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        className="border rounded px-2 py-1"
      >
        <option value="">All Categories</option>
        <option value="Food">Food</option>
        <option value="Rent">Rent</option>
        <option value="Salary">Salary</option>
      </select>

      <input
        type="date"
        value={filters.startDate}
        onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
        className="border rounded px-2 py-1"
      />
    </div>
  );
}
