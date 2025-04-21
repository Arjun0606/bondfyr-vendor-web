import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthService } from '../firebase/services/AuthService';
import { toast } from 'react-toastify';

const Settings = () => {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Successfully logged out');
      navigate('/login');
    } catch (error) {
      toast.error(`Error logging out: ${error.message}`);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm account deletion');
      return;
    }

    try {
      setLoading(true);
      // Delete the user account
      await AuthService.deleteUserAccount();
      toast.success('Your account has been deleted');
      navigate('/login');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error(`Failed to delete account: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <div className="mb-4">
            <p className="text-gray-400">Email</p>
            <p>{currentUser?.email}</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-400">Display Name</p>
            <p>{currentUser?.displayName || 'Not set'}</p>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
          <div className="flex flex-col space-y-4">
            <button 
              onClick={handleLogout}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-150"
            >
              Log Out
            </button>
          </div>
        </div>
        
        <div className="bg-red-900/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Danger Zone</h2>
          <p className="text-gray-400 mb-4">
            Deleting your account is permanent. All of your data will be permanently removed.
            This action cannot be undone.
          </p>
          
          {!showDeleteConfirm ? (
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition duration-150"
            >
              Delete Account
            </button>
          ) : (
            <div className="border border-red-600 p-4 rounded-lg">
              <p className="mb-4">
                To confirm, please type <span className="font-bold">DELETE</span> in the field below:
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded text-white"
                placeholder="Type DELETE to confirm"
              />
              <div className="flex space-x-4">
                <button 
                  onClick={handleDeleteAccount}
                  disabled={loading || deleteConfirmText !== 'DELETE'}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition duration-150 disabled:opacity-50"
                >
                  {loading ? 'Deleting Account...' : 'Confirm Delete Account'}
                </button>
                <button 
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText('');
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition duration-150"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings; 