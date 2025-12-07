import { useState } from 'react';
import FileUploader from './components/FileUploader';
import DataVisualization from './components/DataVisualization';

function App() {
  const [data, setData] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string>('');

  const handleFileUpload = (fileData: any[], name: string) => {
    setData(fileData);
    setFileName(name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Data Visualizer</h1>
          <p className="text-gray-600">Upload a CSV or JSON file to visualize your data</p>
        </div>

        {!data.length ? (
          <FileUploader onFileUpload={handleFileUpload} />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{fileName}</h2>
                <p className="text-sm text-gray-600 mt-1">{data.length} rows loaded</p>
              </div>
              <button
                onClick={() => {
                  setData([]);
                  setFileName('');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Upload New File
              </button>
            </div>
            <DataVisualization data={data} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
