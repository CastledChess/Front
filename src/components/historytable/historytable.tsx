import React from 'react';
import Checkbox from '@mui/material/Checkbox';

type AnalysisData = {
  id: number;
  player1: string;
  player2: string;
  date: string;
};

interface HistoryTableProps {
  data: AnalysisData[];
  selectedIds: number[];
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ data, selectedIds, setSelectedIds }) => {
  const handleSelect = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]));
  };

  const handleSelectAll = () => {
    setSelectedIds(selectedIds.length === data.length ? [] : data.map((item) => item.id));
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border border-gray-300">
              <Checkbox
                indeterminate={selectedIds.length > 0 && selectedIds.length < data.length}
                checked={selectedIds.length === data.length}
                onChange={handleSelectAll}
              />
            </th>
            <th className="p-2 border border-gray-300 text-left text-black">Player 1</th>
            <th className="p-2 border border-gray-300 text-left text-black">Player 2</th>
            <th className="p-2 border border-gray-300 text-left text-black">Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-100 transition-colors duration-200">
              <td className="p-2 border border-gray-300 text-center">
                <Checkbox checked={selectedIds.includes(item.id)} onChange={() => handleSelect(item.id)} />
              </td>
              <td className="p-2 border border-gray-300">{item.player1}</td>
              <td className="p-2 border border-gray-300">{item.player2}</td>
              <td className="p-2 border border-gray-300">{item.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTable;
