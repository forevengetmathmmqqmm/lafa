import { RouterProvider } from 'react-router-dom';
import routers from './routes';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full h-full mx-auto">
        <RouterProvider router={routers} />
      </div>
    </div>
  );
}

export default App;
