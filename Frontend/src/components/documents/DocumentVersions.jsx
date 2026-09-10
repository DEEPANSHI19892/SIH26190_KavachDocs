import { useEffect, useState } from "react";
import {
  FiClock,
  FiDownload,
  FiFileText,
  FiGitBranch,
} from "react-icons/fi";

import api from "../../api/axios";
import { ENDPOINTS } from "../../api/endpoints";
import Loader from "../common/Loader";

const DocumentVersions = ({ documentId }) => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (documentId) {
      fetchVersions();
    } else {
      setLoading(false);
    }
  }, [documentId]);

  const fetchVersions = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        ENDPOINTS.DOCUMENTS.VERSIONS(documentId)
      );

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.versions || [];

      setVersions(data);

    } catch (error) {
      console.error(
        "Failed to fetch document versions:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadVersion = async (
    versionId,
    filename
  ) => {
    try {
      const response = await api.get(
        ENDPOINTS.DOCUMENTS.DOWNLOAD(versionId),
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");

      link.href = url;
      link.download = filename || "document-version";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error(
        "Failed to download version:",
        error
      );

      alert("Unable to download this version.");
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!documentId) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">

        <FiGitBranch
          className="mx-auto mb-3 text-slate-400"
          size={32}
        />

        <p className="font-medium text-slate-700">
          Document ID required
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Select a document to view its versions.
        </p>

      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white">

      {/* Header */}
      <div className="border-b border-slate-200 p-5">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
            <FiGitBranch
              className="text-slate-700"
              size={21}
            />
          </div>

          <div>

            <h2 className="font-semibold text-slate-900">
              Document Versions
            </h2>

            <p className="text-sm text-slate-500">
              Track previous versions of this document.
            </p>

          </div>

        </div>

      </div>

      {/* Versions */}
      <div className="p-5">

        {versions.length === 0 ? (

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">

            <FiFileText
              className="mx-auto mb-3 text-slate-400"
              size={34}
            />

            <p className="font-medium text-slate-700">
              No versions found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              This document does not have any recorded versions.
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {versions.map((version, index) => (

              <div
                key={
                  version.id ||
                  version.version_id ||
                  index
                }
                className="rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50"
              >

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                  {/* Version information */}
                  <div className="flex items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">

                      <FiFileText
                        className="text-slate-600"
                        size={19}
                      />

                    </div>

                    <div>

                      <div className="flex flex-wrap items-center gap-2">

                        <p className="font-semibold text-slate-900">
                          Version{" "}
                          {version.version_number ||
                            version.version ||
                            versions.length - index}
                        </p>

                        {index === 0 && (

                          <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                            Current
                          </span>

                        )}

                      </div>

                      <p className="mt-1 text-sm text-slate-500">

                        {version.filename ||
                          version.file_name ||
                          "Document file"}

                      </p>

                    </div>

                  </div>

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">

                    <div className="flex items-center gap-1.5">

                      <FiClock />

                      {version.created_at
                        ? new Date(
                            version.created_at
                          ).toLocaleString()
                        : "Date unavailable"}

                    </div>

                    {version.uploaded_by && (

                      <span>
                        By: {version.uploaded_by}
                      </span>

                    )}

                  </div>

                  {/* Download */}
                  {(version.id ||
                    version.version_id) && (

                    <button
                      type="button"
                      onClick={() =>
                        downloadVersion(
                          version.id ||
                            version.version_id,
                          version.filename ||
                            version.file_name
                        )
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >

                      <FiDownload />

                      Download

                    </button>

                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
};

export default DocumentVersions;