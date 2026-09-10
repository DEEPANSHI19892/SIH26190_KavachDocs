import { useState } from "react";
import {
  FiCheckCircle,
  FiFile,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";

import api from "../../api/axios";

const DocumentUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [caseId, setCaseId] = useState("");

  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);
    setError("");
    setSuccess("");
  };

  const removeFile = () => {
    setFile(null);
    setProgress(0);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!file) {
      setError("Please select a document.");
      return;
    }

    if (!title.trim()) {
      setError("Please enter a document title.");
      return;
    }

    if (!caseId.trim()) {
      setError("Please enter the Case ID.");
      return;
    }

    try {
      setUploading(true);
      setProgress(0);

      const formData = new FormData();

      formData.append("file", file);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("case_id", caseId);

      const response = await api.post(
        "/documents/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },

          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded * 100) /
                  progressEvent.total
              );

              setProgress(percent);
            }
          },
        }
      );

      console.log("Upload response:", response.data);

      setSuccess("Document uploaded successfully.");

      setFile(null);
      setTitle("");
      setDescription("");
      setCaseId("");
      setProgress(100);

      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }

    } catch (error) {
      console.error("Document upload failed:", error);

      setError(
        error.response?.data?.detail ||
          "Document upload failed. Please try again."
      );

    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white">

      {/* Header */}
      <div className="border-b border-slate-200 p-5">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
            <FiUploadCloud
              className="text-slate-700"
              size={21}
            />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Upload Document
            </h2>

            <p className="text-sm text-slate-500">
              Add a secure document to a case.
            </p>
          </div>

        </div>

      </div>

      {/* Form */}
      <form
        onSubmit={handleUpload}
        className="space-y-5 p-5"
      >

        {/* Alerts */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            <FiCheckCircle />
            {success}
          </div>
        )}

        {/* Case ID */}
        <div>

          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Case ID
          </label>

          <input
            type="text"
            value={caseId}
            onChange={(e) =>
              setCaseId(e.target.value)
            }
            placeholder="Enter case ID"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-700 focus:ring-1 focus:ring-slate-200"
          />

        </div>

        {/* Title */}
        <div>

          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Document Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="Enter document title"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-700 focus:ring-1 focus:ring-slate-200"
          />

        </div>

        {/* Description */}
        <div>

          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Enter document description"
            rows="4"
            className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-700 focus:ring-1 focus:ring-slate-200"
          />

        </div>

        {/* File Upload */}
        <div>

          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Document File
          </label>

          {!file ? (

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-slate-500 hover:bg-slate-100">

              <FiUploadCloud
                className="mb-3 text-slate-500"
                size={34}
              />

              <p className="font-medium text-slate-700">
                Click to select a document
              </p>

              <p className="mt-1 text-xs text-slate-500">
                PDF, DOC, DOCX, JPG, PNG and other supported files
              </p>

              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />

            </label>

          ) : (

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

              <div className="flex items-center justify-between gap-4">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
                    <FiFile
                      className="text-slate-600"
                      size={20}
                    />
                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-medium text-slate-800">
                      {file.name}
                    </p>

                    <p className="text-xs text-slate-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={removeFile}
                  className="rounded-lg p-2 text-slate-500 hover:bg-white hover:text-red-600"
                  title="Remove file"
                >
                  <FiX size={18} />
                </button>

              </div>

            </div>

          )}

        </div>

        {/* Progress */}
        {uploading && (

          <div>

            <div className="mb-2 flex items-center justify-between text-xs text-slate-500">

              <span>
                Uploading document...
              </span>

              <span>
                {progress}%
              </span>

            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-200">

              <div
                className="h-full rounded-full bg-slate-700 transition-all"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

          </div>

        )}

        {/* Submit */}
        <div className="flex justify-end">

          <button
            type="submit"
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >

            <FiUploadCloud />

            {uploading
              ? "Uploading..."
              : "Upload Document"}

          </button>

        </div>

      </form>

    </div>
  );
};

export default DocumentUpload;