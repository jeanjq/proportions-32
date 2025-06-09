
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Male = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Male Avatar Data</h1>
          <p className="text-gray-600">Add your male avatar JavaScript data here in dev mode.</p>
        </div>

        {/* Content Card */}
        <Card className="p-6 bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Male Data Storage</h2>
            <p className="text-gray-600 mb-6">
              This page is ready for you to add male avatar data in dev mode.
            </p>
            <div className="bg-gray-100 rounded-lg p-4 text-left">
              <code className="text-sm text-gray-700">
                // Add your male JavaScript data here<br/>
                // Example: const maleData = [...]
              </code>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Male;
