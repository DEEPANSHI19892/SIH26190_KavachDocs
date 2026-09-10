import { useEffect, useState } from "react";
import {
  FiDownload,
  FiEye,
  FiFileText,
  FiSearch,
  FiShield,
} from "react-icons/fi";

import api from "../../api/axios";
import { ENDPOINTS } from "../../api/endpoints";
import Loader from "../common/Loader";

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await api.get("/documents");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.documents || [];

      setDocuments(data);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadDocument = async (id, filename) => {
    try {
      setDownloadingId(id);

      const response = await api.get(
        ENDPOINTS.DOCUMENTS.DOWNLOAD(id),
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");

      link.href = url;
      link.download = filename || "document";

      document.body.appendChild(link);
      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download document:", error);
      alert("Unable to download the document.");
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredDocuments = documents.filter((document) => {
    const query = search.toLowerCase();

    return (
      document.filename
        ?.toLowerCase()
        .includes(query) ||
      document.title
        ?.toLowerCase()
        .includes(query) ||
      document.case_number
        ?.toLowerCase()
        .includes(query) ||
      document.document_type
        ?.toLowerCase()
        .includes(query)
    );
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Documents
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Securely manage case-related documents and evidence.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
          <div className="flex items-center gap-3">
            <FiFileText className="text-slate-600" />

            <div>
              <p className="text-xs text-slate-500">
                Total Documents
              </p>

              <p className="text-lg font-semibold text-slate-900">
                {documents.length}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Search */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">

        <div className="relative max-w-md">

          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-slate-600 focus:ring-1 focus:ring-slate-200"
          />

        </div>

      </div>

      {/* Documents Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

        <div className="overflow-x-auto">

          <table className="w-full text-left text-sm">

            <thead className="border-b border-slate-200 bg-slate-50">

              <tr>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Document
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Case
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Type
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Uploaded
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredDocuments.length === 0 ? (

                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center"
                  >
                    <FiFileText
                      className="mx-auto mb-3 text-slate-300"
                      size={36}
                    />

                    <p className="font-medium text-slate-700">
                      No documents found
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Try changing your search or upload a document.
                    </p>
                  </td>
                </tr>

              ) : (

                filteredDocuments.map((item) => (

                  <tr
                    key={item.id}
                    className="transition hover:bg-slate-50"
                  >

                    {/* Document */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                          <FiFileText
                            className="text-slate-600"
                            size={20}
                          />
                        </div>

                        <div className="min-w-0">

                          <p className="truncate font-medium text-slate-900">
                            {item.title ||
                              item.filename ||
                              "Untitled Document"}
                          </p>

                          <p className="max-w-xs truncate text-xs text-slate-500">
                            {item.filename || "No filename"}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Case */}
                    <td className="px-5 py-4">

                      <span className="font-medium text-slate-700">
                        {item.case_number ||
                          item.case_id ||
                          "—"}
                      </span>

                    </td>

                    {/* Type */}
                    <td className="px-5 py-4 text-slate-600">
                      {item.document_type ||
                        item.type ||
                        "Document"}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">

                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">

                        <FiShield size={13} />

                        {item.status || "SECURE"}

                      </span>

                    </td>

                    {/* Uploaded */}
                    <td className="px-5 py-4 text-slate-500">

                      {item.created_at
                        ? new Date(
                            item.created_at
                          ).toLocaleDateString()
                        : "—"}

                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        <button
                          type="button"
                          title="View document"
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                          <FiEye size={16} />
                        </button>

                        <button
                          type="button"
                          title="Download document"
                          disabled={downloadingId === item.id}
                          onClick={() =>
                            downloadDocument(
                              item.id,
                              item.filename
                            )
                          }
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <FiDownload size={16} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default DocumentList;