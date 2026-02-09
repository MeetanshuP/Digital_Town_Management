import { useState } from "react";
import axios from "axios";
import { Camera, Loader2 } from "lucide-react";

const ImageUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const uploadFile = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const res = await axios.post("/api/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
      });

      onUpload(res.data.imageUrl);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
        <Camera size={18} />
        Attach Photo / Video
        <input
          type="file"
          accept="image/*,video/*"
          hidden
          onChange={handleChange}
        />
      </label>

      {preview && (
        <div className="relative w-32 h-32">
          <img
            src={preview}
            alt="preview"
            className="w-full h-full object-cover rounded-xl border"
          />
        </div>
      )}

      {file && (
        <button
          type="button"
          onClick={uploadFile}
          disabled={loading}
          className="px-4 py-2 bg-amber-600 text-white rounded-xl text-sm font-semibold hover:bg-amber-700 disabled:opacity-50 flex items-center gap-2"
        >
          {loading && <Loader2 className="animate-spin" size={16} />}
          Upload Evidence
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
