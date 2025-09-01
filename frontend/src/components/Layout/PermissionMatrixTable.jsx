import React, { useMemo } from "react";
import { Check, X } from "lucide-react";

const PermissionMatrixTable = ({ data, headline, loading }) => {
  const PERMISSIONS = useMemo(() => {
    const perms = new Set();
    data.forEach((role) =>
      role.role_modules.forEach((mod) =>
        mod.module_menus.forEach((menu) =>
          menu.menu_permissions.forEach((p) => perms.add(p))
        )
      )
    );
    return Array.from(perms);
  }, [data]);

  const flattenedRows = useMemo(() => {
    const rows = [];
    data.forEach((role) => {
      role.role_modules.forEach((mod) => {
        mod.module_menus.forEach((menu) => {
          rows.push({
            role: role.role_name,
            module: mod.module_name,
            menu: menu.menu_name,
            permissions: menu.menu_permissions,
          });
        });
      });
    });
    return rows;
  }, [data]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{headline} Matrix</h2>
      <div className="overflow-x-auto border rounded-lg shadow">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Module</th>
              <th className="p-2 border">Menu</th>
              {PERMISSIONS.map((p) => (
                <th key={p} className="p-2 border">
                  {p.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td colSpan={3 + PERMISSIONS.length} className="p-4">
                    <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                  </td>
                </tr>
              ))
            ) : flattenedRows.length === 0 ? (
              <tr>
                <td
                  colSpan={3 + PERMISSIONS.length}
                  className="text-center p-6 text-gray-500"
                >
                  No data available
                </td>
              </tr>
            ) : (
              flattenedRows.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-2 border">{row.role}</td>
                  <td className="p-2 border">{row.module}</td>
                  <td className="p-2 border">{row.menu}</td>
                  {PERMISSIONS.map((p) => (
                    <td key={p} className="text-center border">
                      {row.permissions.includes(p) ? (
                        <Check className="text-green-600 inline" size={16} />
                      ) : (
                        <X className="text-red-600 inline" size={16} />
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PermissionMatrixTable;
