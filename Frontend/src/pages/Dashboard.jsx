import {
  FiAlertTriangle,
  FiBriefcase,
  FiFileText,
  FiPlus,
  FiUpload,
} from "react-icons/fi";

import { Link } from "react-router-dom";
import Layout from "../components/common/Layout";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Cases",
      value: "128",
      icon: FiBriefcase,
    },
    {
      title: "Documents",
      value: "1,842",
      icon: FiFileText,
    },
    {
      title: "Security Events",
      value: "07",
      icon: FiAlertTriangle,
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">

        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Overview of cases, documents and system activity.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      {stat.title}
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {stat.value}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-100 p-3">
                    <Icon
                      size={22}
                      className="text-slate-700"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold text-slate-900">
            Quick Actions
          </h2>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/cases/new"
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <FiPlus />
              Create Case
            </Link>

            <Link
              to="/documents"
              className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <FiUpload />
              Upload Document
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-5">
            <h2 className="font-semibold text-slate-900">
              Recent Activity
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            {[
              "Document uploaded to Case KVD-2026-001",
              "Document integrity verified",
              "New case KVD-2026-009 created",
              "Security event resolved",
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-5"
              >
                <p className="text-sm text-slate-700">
                  {activity}
                </p>

                <span className="text-xs text-slate-400">
                  {index + 1}h ago
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default Dashboard;