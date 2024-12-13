import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { GameDetails, columns } from "./columns";
import { useTranslation } from "react-i18next";

async function getData(): Promise<GameDetails[]> {
    // Simulated API call
    return [
        {
            id: "1",
            playerOne: "seterB",
            playerTwo: "Terraxe",
            result: "WON",
            moves: 20,
            date: new Date("2024-10-12"),
        },
        {
            id: "2",
            playerOne: "4rthur",
            playerTwo: "c0rinn3",
            result: "LOST",
            moves: 38,
            date: new Date("2024-08-15"),
        },
        {
            id: "3",
            playerOne: "Patate",
            playerTwo: "Banane",
            result: "LOST",
            moves: 9,
            date: new Date("2024-01-01"),
        },
    ];
}

export const History = () => {
    const { t } = useTranslation('history');
    const [data, setData] = useState<GameDetails[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const result = await getData();
            setData(result);
            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <p className="mt-10 mx-10 text-3xl text-castled-accent">{t('title')}</p>
            <div className="container mx-auto py-10 px-10 content-center">
                <DataTable columns={columns} data={data || []} />
            </div>
        </div>
    );
};
