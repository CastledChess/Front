import React, { useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'date',
    direction: 'asc',
  });

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, id: number) => {
    setAnchorEl(event.currentTarget);
    setCurrentId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentId(null);
  };

  const handleAnalyze = () => {
    if (currentId) {
      // Analyse a completer avec le back
      console.log(`Analyzing item with ID: ${currentId}`);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (currentId) {
      // Suppression
      console.log(`Deleting item with ID: ${currentId}`);
    }
    handleMenuClose();
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortConfig.key as keyof AnalysisData];
    const bValue = b[sortConfig.key as keyof AnalysisData];
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border border-gray-300 text-left text-black">
              <button onClick={() => handleSort('player1')} className="flex items-center">
                Player 1 {sortConfig.key === 'player1' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </button>
            </th>
            <th className="p-2 border border-gray-300 text-left text-black">
              <button onClick={() => handleSort('player2')} className="flex items-center">
                Player 2 {sortConfig.key === 'player2' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </button>
            </th>
            <th className="p-2 border border-gray-300 text-left text-black">
              <button onClick={() => handleSort('date')} className="flex items-center">
                Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </button>
            </th>
            <th className="p-2 border border-gray-300"></th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item) => (
            <tr key={item.id} className="transition-colors duration-200">
              <td className="p-2 border border-gray-300">{item.player1}</td>
              <td className="p-2 border border-gray-300">{item.player2}</td>
              <td className="p-2 border border-gray-300">{item.date}</td>
              <td className="p-2 border border-gray-300 text-center">
                <MoreVertIcon className="cursor-pointer" onClick={(e) => handleMenuClick(e, item.id)} />
                <Menu anchorEl={anchorEl} open={currentId === item.id} onClose={handleMenuClose}>
                  <MenuItem onClick={handleAnalyze}>Analyser</MenuItem>
                  <MenuItem onClick={handleDelete}>Supprimer</MenuItem>
                </Menu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTable;
