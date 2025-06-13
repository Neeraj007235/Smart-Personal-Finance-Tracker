import { useState } from 'react';
import { Edit2, Trash2, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORIES } from '@/types/transaction';

const TransactionList = ({ transactions, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
    const matchesType = filterType === 'all' || transaction.type === filterType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const handleDelete = (id, description) => {
    if (window.confirm(`Are you sure you want to delete "${description}"?`)) {
      onDelete(id);
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No transactions yet</p>
        <p className="text-muted-foreground">Add your first transaction to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Heading */}
      <h2 className="text-xl font-semibold">All Transactions</h2>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredTransactions.length} of {transactions.length} transactions
      </p>

      {/* Transaction List */}
      <div className="space-y-2">
        {filteredTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium">{transaction.description}</h3>
                <span
                  className={`font-semibold text-lg ${transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'
                    }`}
                >
                  {transaction.type === 'expense' ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="px-2 py-1 bg-muted rounded-md">{transaction.category}</span>
                <span>{new Date(transaction.date).toLocaleDateString()}</span>
                <span
                  className={`px-2 py-1 rounded-md ${transaction.type === 'expense'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                    }`}
                >
                  {transaction.type}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(transaction)}
                className="h-8 w-8 p-0 cursor-pointer"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(transaction.id, transaction.description)}
                className="h-8 w-8 p-0 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredTransactions.length === 0 && transactions.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No transactions match your filters</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setFilterCategory('all');
              setFilterType('all');
            }}
            className="mt-2"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
