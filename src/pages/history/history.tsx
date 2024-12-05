import { useEffect, useState } from 'react';
// import axios from 'axios';
import HistoryTable from '@/components/historytable/historytable';

type AnalysisData = {
  id: number;
  player1: string;
  player2: string;
  date: string;
};

const History: React.FC = () => {
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisData[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    // REQUETE API A DECOMMENTER !
    /*
    axios
      .get<AnalysisData[]>('/api/history')
      .then((response) => setAnalysisHistory(response.data))
      .catch((error) =>
        console.error('Erreur lors de la récupération des données :', error)
      );
    */

    // Données factices pour tester le rendu
    const mockData: AnalysisData[] = [
      { id: 1, player1: 'Alice', player2: 'Bob', date: '2024-01-01' },
      { id: 2, player1: 'Charlie', player2: 'Dana', date: '2024-01-02' },
    ];
    setAnalysisHistory(mockData);
  }, []);

  const handleDeleteSelected = () => {
    setAnalysisHistory((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
    setSelectedIds([]); // Réinitialise
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Historique des analyses</h1>

      <div className="bg-gray-100 p-4 rounded-md shadow-md mb-4">
        <p className="text-gray-700">
          Total d'analyses : <span className="font-bold">{analysisHistory.length}</span>
        </p>
      </div>
      <HistoryTable data={analysisHistory} selectedIds={selectedIds} setSelectedIds={setSelectedIds} />
      {selectedIds.length > 0 && (
        <button
          onClick={handleDeleteSelected}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600"
        >
          Supprimer les éléments sélectionnés
        </button>
      )}
    </div>
  );
};

export default History;
