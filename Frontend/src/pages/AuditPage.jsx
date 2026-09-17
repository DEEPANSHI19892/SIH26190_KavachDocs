import { useEffect, useState } from "react";
import {
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiShield,
  FiUser,
  FiXCircle,
  FiSlash,
} from "react-icons/fi";
import Layout from "../components/common/Layout";
import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

const AuditPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get(ENDPOINTS.AUDIT.LOGS);
        setLogs(res.data);
      } catch (error) {
        console.error("Audit fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // -------- Helpers --------
  const formatAction = (action) => {
    return action
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const diffMs = Date.now() - date;
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getActionType = (action) => {
    if (action.includes("DOCUMENT") || action.includes("VERSION")) return "Document";
    if (action.includes("VERIFY") || action.includes("INTEGRITY")) return "Verification";
    if (action.includes("CASE")) return "Case";
    if (action.includes("SECURITY")) return "Security";
    if (action.includes("LOGIN") || action.includes("USER")) return "Auth";
    return "System";
  };

  const getResultIcon = (result) => {
    if (result === "SUCCESS") return FiCheckCircle;
    if (result === "FAILED") return FiXCircle;
    if (result === "BLOCKED") return FiSlash;
    return FiShield;
  };

  // -------- Derived Stats --------
  const totalActivities = logs.length;
  const uniqueUsers = new Set(logs.map((l) => l.user_id).filter(Boolean)).size;
  const successRate = totalActivities
    ? ((logs.filter((l) => l.result === "SUCCESS").length / totalActivities) * 100).toFixed(1)
    : "0.0";

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Audit Logs</h1>
          <p className="mt-1 text-sm text-slate-500">
            Review system activity and audit history.
          </p>
        </div>

        {/* Summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-3">
                <FiFileText size={20} className="text-slate-700" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Activities</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {loading ? "—" : totalActivities}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-3">
                <FiUser size={20} className="text-slate-700" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Active Users</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {loading ? "—" : uniqueUsers}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-3">
                <FiCheckCircle size={20} className="text-slate-700" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Success Rate</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {loading ? "—" : `${successRate}%`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 p-5">
            <div>
              <h2 className="font-semibold text-slate-900">
                Recent Audit Activity
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                System activity recorded by KavachDocs.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                    Activity
                  </th>
                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                    User
                  </th>
                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                    Type
                  </th>
                  <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                    Time
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-5 text-sm text-slate-500">
                      Loading...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-5 text-sm text-slate-500">
                      No audit logs found.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    const Icon = getResultIcon(log.result);
                    return (
                      <tr key={log.id} className="transition hover:bg-slate-50">
                        <td className="px-5 py-4">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 rounded-lg bg-slate-100 p-2">
                              <Icon size={17} className="text-slate-700" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-900">
                                {formatAction(log.action)}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {log.details || `Result: ${log.result}`}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-700">
                          {log.user_name || (log.user_id ? `User #${log.user_id}` : "System")}
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                            {getActionType(log.action)}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <FiClock size={14} />
                            {formatTime(log.created_at)}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AuditPage;