
import AdminPanel from '@/components/AdminPanel';

const Admin = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Compass Admin</h1>
          <p className="text-gray-600">Manage course embeddings and system setup</p>
        </div>
        
        <AdminPanel />
      </div>
    </div>
  );
};

export default Admin;
