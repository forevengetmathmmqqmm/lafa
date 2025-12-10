// 导入Redux Toolkit的configureStore函数
import { configureStore } from '@reduxjs/toolkit';

// 导入各个slice的reducer
// 使用相对路径确保能正确导入模块
import userReducer from './slices/userSlice';
import walletReducer from './slices/walletSlice';

/**
 * Redux store 配置
 * 使用configureStore创建一个带有内置中间件支持的store
 * 自动配置了Redux DevTools和thunk中间件
 */
export const store = configureStore({
  // 组合所有的reducer
  reducer: {
    // user slice的reducer，处理用户相关状态
    user: userReducer,
    // wallet slice的reducer，处理钱包相关状态
    wallet: walletReducer,
  },
});

/**
 * RootState类型
 * 从store本身推断出的整个Redux状态树的类型
 * 用于在组件中使用useAppSelector时提供类型安全
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * AppDispatch类型
 * 从store.dispatch推断出的类型，包含了thunk和其他中间件增强的dispatch类型
 * 用于在组件中使用useAppDispatch时提供类型安全
 */
export type AppDispatch = typeof store.dispatch;