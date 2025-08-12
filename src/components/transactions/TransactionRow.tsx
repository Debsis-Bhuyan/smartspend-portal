import { Calendar, Edit3, Trash2, TrendingDown, TrendingUp } from "lucide-react";

const TransactionRow = ({ transaction, onEdit, onDelete }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className={`p-2 rounded-full mr-3 ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
            {transaction.type === 'income' ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
            {transaction.notes && (
              <div className="text-sm text-gray-500">{transaction.notes}</div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
          {transaction.category}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          {new Date(transaction.date).toLocaleDateString()}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`text-sm font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
          ${Math.abs(transaction.amount).toFixed(2)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => onEdit(transaction)}
            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(transaction.id)}
            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};
export default TransactionRow ;