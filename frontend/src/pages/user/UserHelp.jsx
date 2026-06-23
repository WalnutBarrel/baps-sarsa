import React from 'react';
import { HelpCircle, QrCode, BookOpen, Key, Info } from 'lucide-react';

const UserHelp = () => {
  const faqs = [
    {
      question: "How do I mark my attendance?",
      answer: "Go to the 'Attendance' page from the menu. You can either scan the QR code displayed in the Sabha using your camera, or manually enter your Yuvak Number / Mobile Number.",
      icon: <QrCode className="text-saffron" size={24} />
    },
    {
      question: "How do I share a Prasang?",
      answer: "Navigate to the 'Prasangs' page. Under the 'Submit a Prasang' section, enter the title and description, then click 'Submit for Review'. Once approved by an admin, it will appear in the Inspiration Feed.",
      icon: <BookOpen className="text-blue" size={24} />
    },
    {
      question: "How can I change my password?",
      answer: "Click the 'Password' button in the top right corner (next to the Logout button). Enter your current password and your new password to update it.",
      icon: <Key className="text-green-600" size={24} />
    },
    {
      question: "Who should I contact if I face issues?",
      answer: "If you have any technical issues or need updates to your profile, please contact your Mandal Karyakar or the Admin directly.",
      icon: <Info className="text-purple-600" size={24} />
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue/10 text-blue mb-2">
          <HelpCircle size={32} />
        </div>
        <h1 className="text-3xl font-heading font-bold text-[#0b3f88]">Help & FAQ</h1>
        <p className="text-gray-600 max-w-lg mx-auto">Find answers to common questions and learn how to use the Yuvak Portal effectively.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4 mb-3">
              <div className="mt-1 bg-gray-50 p-2 rounded-xl border border-gray-100">
                {faq.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg leading-tight mb-2">{faq.question}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-saffron/10 border border-saffron/20 rounded-2xl p-6 text-center">
        <h3 className="font-heading font-bold text-[#f37021] mb-2">Still need help?</h3>
        <p className="text-sm text-gray-700">Please reach out to your local karyakar for further assistance. Jay Swaminarayan!</p>
      </div>
    </div>
  );
};

export default UserHelp;
