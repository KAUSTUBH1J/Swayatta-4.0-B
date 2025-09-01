import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import PermissionMatrixTable from "../components/Layout/PermissionMatrixTable";
import masterDataService from "../services/masterDataService";
import toast from "react-hot-toast";

const RolePermissionsPage = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [permissionsData, setPermissionsData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all roles for dropdown
  const fetchRoles = async () => {
    try {
      const response = await masterDataService.getRoles({ limit: 100 });
      if (response?.status_code === 200) {
        setRoles(response.data?.roles || []);
      } else {
        toast.error(response.message || "Failed to fetch roles");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Failed to fetch roles");
    }
  };

  // ✅ Fetch permissions for selected role
  const fetchRolePermissions = async (roleId) => {
    if (!roleId) return;
    setLoading(true);
    try {
      const response = await masterDataService.getRolePermissionsNested();
      if (response?.status_code === 200) {
        setPermissionsData(response.data?.data_roles || []);
      } else {
        toast.error(response.message || "Failed to fetch role permissions");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Failed to fetch role permissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (selectedRole) {
      fetchRolePermissions(selectedRole);
    }
  }, [selectedRole]);

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Role Permissions</h1>

        {/* ✅ Role Tabs instead of dropdown */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4 overflow-x-auto">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`px-4 py-2 -mb-px text-sm font-medium border-b-2 transition-colors ${
                selectedRole === role.id
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
              }`}
            >
              {role.name}
            </button>
          ))}
        </div>

        {/* Permission Table */}
        <PermissionMatrixTable 
          data={permissionsData} 
          headline="Permissions" 
          loading={loading} 
        />
      </div>
    </Layout>

  );
};

export default RolePermissionsPage;
