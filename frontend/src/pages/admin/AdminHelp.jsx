import React from 'react';
import { HelpCircle, Users, CheckSquare, CalendarPlus, FileText, BookOpen } from 'lucide-react';

const AdminHelp = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3 border-b border-blue/10 pb-6">
        <HelpCircle className="text-saffron" size={32} />
        <div>
          <h1 className="text-3xl font-heading font-bold text-blue">Admin Help Center</h1>
          <p className="text-text-secondary mt-1">Guide on how to manage the BAPS Sarsa Yuvak Management System</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Manage Yuvaks */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue/5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue/10 p-3 rounded-xl text-blue">
              <Users size={24} />
            </div>
            <h2 className="text-xl font-bold text-blue">Manage Yuvaks</h2>
          </div>
          <ul className="space-y-2 text-text-primary text-sm list-disc pl-5">
            <li><strong>Add New Yuvak:</strong> Click "Add New" to manually register a yuvak with details like ID, Mobile, and Photo.</li>
            <li><strong>Upload Excel:</strong> Bulk import yuvaks via an Excel file to save time.</li>
            <li><strong>Attendance Terminal:</strong> Opens the QR Scanner and manual entry portal for marking attendance.</li>
            <li><strong>Edit/Delete:</strong> Use the table actions to modify or remove records.</li>
          </ul>
        </div>

        {/* Approve Prasangs */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue/5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 p-3 rounded-xl text-green-700">
              <CheckSquare size={24} />
            </div>
            <h2 className="text-xl font-bold text-blue">Approve Prasangs</h2>
          </div>
          <ul className="space-y-2 text-text-primary text-sm list-disc pl-5">
            <li>View all prasangs submitted by users that are currently "Pending".</li>
            <li>Click the Green checkmark to Approve and make it visible in the Feed.</li>
            <li>Click the Red 'X' to Reject. You can also provide an optional note explaining the rejection.</li>
          </ul>
        </div>

        {/* Prasangs Feed */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue/5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#f37021]/10 p-3 rounded-xl text-[#f37021]">
              <BookOpen size={24} />
            </div>
            <h2 className="text-xl font-bold text-blue">Prasangs Feed</h2>
          </div>
          <ul className="space-y-2 text-text-primary text-sm list-disc pl-5">
            <li>Read all approved and inspiring prasangs submitted by the community.</li>
            <li><strong>Add Prasang:</strong> Admins can directly publish a new prasang using the Add button.</li>
            <li><strong>Delete:</strong> Hover over any prasang and click the trash icon to permanently remove it if needed.</li>
          </ul>
        </div>

        {/* Reports */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue/5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-100 p-3 rounded-xl text-purple-700">
              <FileText size={24} />
            </div>
            <h2 className="text-xl font-bold text-blue">Reports</h2>
          </div>
          <ul className="space-y-2 text-text-primary text-sm list-disc pl-5">
            <li>Filter attendance history by selecting a specific date.</li>
            <li><strong>Export to PDF:</strong> Generate a beautifully formatted, print-ready document containing the attendance records of that day.</li>
            <li><strong>Export to CSV:</strong> Download the raw data in an Excel-compatible format.</li>
          </ul>
        </div>

        {/* Create Event */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue/5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gold/10 p-3 rounded-xl text-gold">
              <CalendarPlus size={24} />
            </div>
            <h2 className="text-xl font-bold text-blue">Events (Sabhas)</h2>
          </div>
          <ul className="space-y-2 text-text-primary text-sm list-disc pl-5">
            <li>Create new upcoming events (Sabhas or special functions) and define the start/end time.</li>
            <li>Track which users registered or marked attendance for each specific event.</li>
          </ul>
        </div>
      </div>

      <div className="bg-blue/5 p-6 rounded-2xl border border-blue/10 text-center">
        <h3 className="font-bold text-blue mb-2">Need further technical assistance?</h3>
        <p className="text-sm text-text-secondary">Please contact the system administrator or the IT karyakar team if you face any unresolved issues or bugs.</p>
      </div>
    </div>
  );
};

export default AdminHelp;
