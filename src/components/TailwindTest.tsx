import React from 'react';
import './tailwindTest.scss';

const TailwindTest: React.FC = () => {
  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Tailwind CSS 测试</h1>
      <p className="text-gray-700 mb-4">这是一个使用Tailwind CSS样式的测试组件。</p>
      <div className="flex space-x-4">
        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
          绿色按钮
        </button>
        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
          红色按钮
        </button>
      </div>
      <div className="mt-6 scss-test">
        <p>这是使用SCSS样式的段落。</p>
      </div>
    </div>
  );
};

export default TailwindTest;