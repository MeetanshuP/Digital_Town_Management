import { useEffect, useState } from "react";
import { getAllGrievances, deleteGrievance } from "../services/grievanceService";

const MyGrievances = () => {

    const [grievances, setGrievances] = useState([]);

    const fetchGrievances = async () => {
        try {

            const res = await getAllGrievances();
            setGrievances(res.data);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchGrievances();
    }, []);

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this grievance?")) return;

        try {

            await deleteGrievance(id);
            fetchGrievances();

        } catch (error) {
            console.error(error);
        }

    };

    return (
        <div>

            <h2>My Grievances</h2>

            {grievances.map((g) => (

                <div key={g._id}>

                    <h3>{g.subject}</h3>

                    <p>{g.message}</p>

                    <p>Status: {g.status}</p>

                    {g.evidence?.url && (
                        <img src={g.evidence.url} alt="evidence" width="150" />
                    )}

                    <button onClick={() => handleDelete(g._id)}>
                        Delete
                    </button>

                </div>

            ))}

        </div>
    );
};

export default MyGrievances;