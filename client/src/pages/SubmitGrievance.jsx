import { useState } from "react";
import axios from "../utils/axiosInstance";

const SubmitGrievance = () => {

    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [category, setCategory] = useState("general");
    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const formData = new FormData();

            formData.append("subject", subject);
            formData.append("message", message);
            formData.append("category", category);

            if (file) {
                formData.append("evidence", file);
            }

            await axios.post("/grievances", formData);

            alert("Grievance submitted successfully");

            setSubject("");
            setMessage("");
            setCategory("general");
            setFile(null);
            
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) fileInput.value = "";

        } catch (error) {
            console.error(error);
            alert("Failed to submit grievance");
        }
    };

    return (
        <div className="max-w-lg mx-auto">

            <h2 className="text-xl font-bold mb-4">
                Submit Grievance
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

                <input
                    type="text"
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />

                <textarea
                    placeholder="Describe the issue"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />



                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                />

                {file && (
                    <div className="mt-2 relative inline-block">
                        <img
                            src={URL.createObjectURL(file)}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setFile(null);
                                const fileInput = document.querySelector('input[type="file"]');
                                if (fileInput) fileInput.value = "";
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow-md hover:bg-red-600 transition-colors"
                        >
                            &times;
                        </button>
                    </div>
                )}

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Submit
                </button>

            </form>

        </div>
    );
};

export default SubmitGrievance;