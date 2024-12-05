import { useEffect, useState } from 'react';
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
    // REQUETE API A DECOMMENTER
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
      <h1
        className="text-2xl font-extrabold mb-6 text-[#6E6ED8] font-poppins text-center"
        style={{
          padding: '8px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
        onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
      >
        Historique des analyses
      </h1>
      <HistoryTable data={analysisHistory} selectedIds={selectedIds} setSelectedIds={setSelectedIds} />
      <div className="bg-[#5353BB] p-4 rounded-md shadow-md mb-4 w-48 mx-auto mt-6">
        <p className="text-white">
          Total d'analyses : <span className="font-bold">{analysisHistory.length}</span>
        </p>
      </div>
    </div>
  );
};

export default History;
