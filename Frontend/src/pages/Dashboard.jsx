import { useEffect, useState } from "react";
import {
  FiAlertTriangle,
  FiBriefcase,
  FiFileText,
  FiPlus,
  FiUpload,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import Layout from "../components/common/Layout";
import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    cases: 0,
    documents: 0,
    securityEvents: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const safe = async (promise) => {
        try {
          return await promise;
        } catch {
          return { data: [] };
        }
      };

      try {
        const [casesRes, docsRes, eventsRes, auditRes] = await Promise.all([
          safe(api.get(ENDPOINTS.CASES.LIST)),
          safe(api.get(ENDPOINTS.DOCUMENTS.LIST)),
          safe(api.get(ENDPOINTS.SECURITY.EVENTS)),
          safe(api.get(ENDPOINTS.AUDIT.LOGS)),
        ]);

        setStats({
          cases: casesRes.data.length,
          documents: docsRes.data.length,
          securityEvents: eventsRes.data.length,
        });

        setRecentActivity((auditRes.data || []).slice(0, 4));
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const statCards = [
    { title: "Total Cases", value: stats.cases, icon: FiBriefcase },
    { title: "Documents", value: stats.documents, icon: FiFileText },
    { title: "Security Events", value: stats.securityEvents, icon: FiAlertTriangle },
  ];

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const diffMs = Date.now() - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const formatAction = (action) => {
    return action
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // Role-based visibility
  const canCreateCase = ["ADMIN", "INVESTIGATION_OFFICER"].includes(user?.role);
  const canUpload = ["ADMIN", "INVESTIGATION_OFFICER", "LEGAL_OFFICER"].includes(
    user?.role
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Overview of cases, documents and system activity.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{stat.title}</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {loading ? "—" : stat.value}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-100 p-3">
                    <Icon size={22} className="text-slate-700" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        {(canCreateCase || canUpload) && (
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-900">Quick Actions</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {canCreateCase && (
                <Link
                  to="/cases/new"
                  className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  <FiPlus />
                  Create Case
                </Link>
              )}
              {canUpload && (
                <Link
                  to="/documents"
                  className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <FiUpload />
                  Upload Document
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-5">
            <h2 className="font-semibold text-slate-900">Recent Activity</h2>
          </div>

          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="p-5 text-sm text-slate-500">Loading...</div>
            ) : recentActivity.length === 0 ? (
              <div className="p-5 text-sm text-slate-500">
                No recent activity yet.
              </div>
            ) : (
              recentActivity.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-5"
                >
                  <p className="text-sm text-slate-700">
                    {formatAction(log.action)}
                    {log.details ? ` — ${log.details}` : ""}
                  </p>
                  <span className="text-xs text-slate-400">
                    {formatTime(log.created_at)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;