import {
  FiActivity,
  FiBriefcase,
  FiClipboard,
  FiFileText,
  FiGrid,
  FiLogOut,
  FiShield,
  FiX,
} from "react-icons/fi";

import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ open, onClose }) => {
  const {
    user,
    logout,
  } = useAuth();

  const links = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: FiGrid,
      roles: [
        "ADMIN",
        "INVESTIGATION_OFFICER",
        "LEGAL_OFFICER",
        "VIEWER",
      ],
    },
    {
      label: "Cases",
      path: "/cases",
      icon: FiBriefcase,
      roles: [
        "ADMIN",
        "INVESTIGATION_OFFICER",
        "LEGAL_OFFICER",
        "VIEWER",
      ],
    },
    {
      label: "Documents",
      path: "/documents",
      icon: FiFileText,
      roles: [
        "ADMIN",
        "INVESTIGATION_OFFICER",
        "LEGAL_OFFICER",
        "VIEWER",
      ],
    },
    {
      label: "Audit Logs",
      path: "/audit",
      icon: FiClipboard,
      roles: ["ADMIN"],
    },
    {
      label: "Security Events",
      path: "/security",
      icon: FiShield,
      roles: ["ADMIN"],
    },
  ];

  const filteredLinks = links.filter((link) =>
    link.roles.includes(user?.role)
  );

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0 ${
          open
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">

          <div className="flex items-center gap-2">
            <FiShield size={22} />

            <span className="font-bold text-slate-900">
              KavachDocs
            </span>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
          >
            <FiX />
          </button>

        </div>

        <nav className="space-y-1 p-3">

          {filteredLinks.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                <Icon size={18} />
                {link.label}
              </NavLink>
            );
          })}

        </nav>

        <div className="absolute bottom-0 w-full border-t border-slate-200 p-3">

          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-700"
          >
            <FiLogOut size={18} />
            Logout
          </button>

        </div>

      </aside>
    </>
  );
};

export default Sidebar;