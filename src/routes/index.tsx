import { createHashRouter, Navigate } from 'react-router-dom';
import AntDesignWeb3 from '@/view/AntDesignWeb3';

const routers = createHashRouter([
  {
    path: '/',
    element: <Navigate to="/antDesignWeb3" replace />,
  },
  {
    path: '/antDesignWeb3',
    element: <AntDesignWeb3 />,
  },
]);

export default routers;