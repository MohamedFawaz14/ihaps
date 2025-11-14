import React, { useState, useEffect } from "react";
import { User, Mail, Lock, Edit2, Trash2, Plus, Users, X, Eye, EyeOff, Settings } from "lucide-react";
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './NavBar';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ id: null, name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${SERVER_URL}/manage-users`);
      console.log(res.data);
      setUsers(res.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Email and Password are required',
        confirmButtonColor: '#1e3a8a'
      });
      return;
    }

    try {
      if (form.id) {
        // Update existing user
        const res = await axios.put(`${SERVER_URL}/update-user/${form.id}`, {
          email: form.email,
          password: form.password
        });
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: res.data.message,
          confirmButtonColor: '#1e3a8a'
        });
        fetchUsers();
      } else {
        // Add new user
        const res = await axios.post(`${SERVER_URL}/add-user`, {
          email: form.email,
          password: form.password
        });
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: res.data.message,
          confirmButtonColor: '#1e3a8a'
        });
        fetchUsers();
      }
      
      setForm({ id: null, name: "", email: "", password: "" });
      setShowModal(false);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data?.message || "Error processing request",
        confirmButtonColor: '#1e3a8a'
      });
    }
  };

  const handleEdit = (user) => {
    setForm(user);
    setShowPassword(false);
    setShowModal(true);
  };

  const handleDelete = async (user) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete ${user.email}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e3a8a',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      const deletePromise = axios.delete(`${SERVER_URL}/delete-user/${user.id}`);

      toast.promise(
        deletePromise,
        {
          pending: {
            render() {
              return `Deleting ${user.email}...`;
            },
            icon: "⏳",
          },
          success: {
            render() {
              fetchUsers();
              return `User ${user.email} deleted successfully!`;
            },
            icon: "✅",
          },
          error: {
            render({ data }) {
              return `Failed to delete user: ${data.message || 'Unknown error'}`;
            },
            icon: "❌",
          }
        },
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      toast.info('Delete action cancelled', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const openAddModal = () => {
    setForm({ id: null, name: "", email: "", password: "" });
    setShowPassword(false);
    setShowModal(true);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Navbar />
      <ToastContainer />

      {/* Page content (scrolls) */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 ml-0 md:ml-80 mt-10">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-amber-500 rounded-2xl blur-2xl opacity-20"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border border-blue-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-amber-500 bg-clip-text text-transparent leading-tight pb-1">
                      User Management
                    </h1>
                  </div>
                  <p className="text-gray-600 ml-0 sm:ml-14">Manage and control application users</p>
                </div>

                <button
                  onClick={openAddModal}
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-medium  sm:w-auto"
                >
                  <span className="relative z-10 flex items-center justify-center right-0 gap-2">
                    <Plus className="w-5 h-5" />
                    Add User
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Users</p>
                <p className="text-3xl font-bold text-blue-950 mt-1">{users.length}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Users List Section */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-blue-100 hover:border-blue-300 transition-all duration-300">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white">User Directory</h2>
            </div>

            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                  <p className="mt-4 text-gray-600">Loading users...</p>
                </div>
              ) : users.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-6">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="bg-white rounded-lg border-2 border-blue-100 hover:border-blue-300 shadow-lg hover:shadow-2xl transition-all duration-300 p-4 sm:p-6"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 mb-4">
                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg">
                            {user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-blue-950 font-semibold truncate text-sm sm:text-base">
                            {user.email}
                          </p>
                          <p className="text-xs text-gray-400">User ID: {user.id}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white rounded-lg transition-all shadow-md hover:shadow-lg text-xs sm:text-sm font-bold"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all shadow-md hover:shadow-lg text-xs sm:text-sm font-bold"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-blue-600" />
                  </div>
                  <p className="text-blue-950 font-medium">No users found</p>
                  <p className="text-sm text-gray-600 mt-1">Add your first user to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-blue-950 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full border-2 border-blue-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
              <div className="flex items-center gap-2">
                <div className="bg-white p-2 rounded-lg">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  {form.id ? "Update User" : "Add New User"}
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-blue-950 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter email"
                    className="w-full pl-11 pr-4 py-3 bg-white border-2 border-gray-300 text-blue-950 rounded-md focus:border-blue-600 focus:outline-none transition-colors"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-semibold text-blue-950 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="w-full pl-11 pr-12 py-3 bg-white border-2 border-gray-300 text-blue-950 rounded-md focus:border-blue-600 focus:outline-none transition-colors"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-md hover:bg-gray-300 transition-all duration-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-md transition-all duration-200 font-bold shadow-lg hover:shadow-xl"
                >
                  {form.id ? "Update" : "Add User"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}