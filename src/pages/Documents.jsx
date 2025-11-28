import React, { useState } from "react";

const Documents = () => {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "Passport.pdf",
      type: "Identification",
      uploadDate: "2024-01-15",
      size: "2.4 MB",
    },
    {
      id: 2,
      name: "Driver_License.pdf",
      type: "Identification",
      uploadDate: "2024-01-10",
      size: "1.8 MB",
    },
    {
      id: 3,
      name: "Utility_Bill.pdf",
      type: "Address Proof",
      uploadDate: "2024-01-05",
      size: "3.2 MB",
    },
  ]);

  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploading(true);
      // Simulate upload process
      setTimeout(() => {
        const newDocument = {
          id: documents.length + 1,
          name: file.name,
          type: "Other",
          uploadDate: new Date().toISOString().split("T")[0],
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        };
        setDocuments([...documents, newDocument]);
        setUploading(false);
        setShowUpload(false);
      }, 2000);
    }
  };

  const downloadDocument = (document) => {
    // Simulate download
    console.log("Downloading:", document.name);
  };

  const deleteDocument = (documentId) => {
    setDocuments(documents.filter((doc) => doc.id !== documentId));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Documents
          </h1>
          <button
            onClick={() => setShowUpload(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <span>Upload Document</span>
          </button>
        </div>

        {/* Upload Area */}
        {showUpload && (
          <div className="bg-white dark:bg-secondary-dark-bg rounded-lg shadow-md p-6 mb-6 border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="text-center">
              {uploading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Uploading...
                  </p>
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer block">
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        className="w-12 h-12 text-gray-400 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Upload a file
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        PDF, DOC, JPG, PNG up to 10MB
                      </p>
                    </div>
                  </label>
                  <button
                    onClick={() => setShowUpload(false)}
                    className="mt-4 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Documents List */}
        <div className="bg-white dark:bg-secondary-dark-bg rounded-lg shadow-md overflow-hidden">
          {documents.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                No documents uploaded yet
              </p>
              <p className="text-gray-400 dark:text-gray-500">
                Get started by uploading your first document
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Document
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Upload Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-secondary-dark-bg divide-y divide-gray-200 dark:divide-gray-600">
                  {documents.map((document) => (
                    <tr
                      key={document.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 dark:text-blue-400 font-medium">
                              PDF
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {document.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                          {document.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {document.uploadDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {document.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => downloadDocument(document)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Download
                          </button>
                          <button
                            onClick={() => deleteDocument(document.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Documents;
