import {
  FiBell,
  FiMenu,
  FiShield,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">

        <div className="flex items-center gap-3">

          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            <FiMenu size={21} />
          </button>

          <div className="flex items-center gap-2">
            <FiShield
              className="text-slate-800"
              size={23}
            />

            <span className="font-bold text-slate-900">
              KavachDocs
            </span>
          </div>

        </div>

        <div className="flex items-center gap-4">

          <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100">
            <FiBell size={19} />
          </button>

          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-800">
              {user?.name || user?.email || "User"}
            </p>

            <p className="text-xs text-slate-500">
              {user?.role || "User"}
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-white">
            {(user?.name || user?.email || "U")
              .charAt(0)
              .toUpperCase()}
          </div>

        </div>

      </div>
    </header>
  );
};

export default Navbar;