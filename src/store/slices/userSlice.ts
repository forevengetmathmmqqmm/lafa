// 导入Redux Toolkit的createSlice函数
import { createSlice } from '@reduxjs/toolkit';
// 导入PayloadAction类型用于类型安全的action处理
import type { PayloadAction } from '@reduxjs/toolkit';

/**
 * 用户状态接口定义
 * 用于类型安全的用户相关状态管理
 */
export interface UserState {
  // 是否已认证
  isAuthenticated: boolean;
  // 用户信息，包含用户名和邮箱
  userInfo: {
    username: string;
    email: string;
  } | null;
  // 加载状态，用于显示加载指示器
  loading: boolean;
  // 错误信息，用于显示错误提示
  error: string | null;
}

/**
 * 初始状态定义
 * 设置默认值，确保应用启动时状态一致
 */
const initialState: UserState = {
  isAuthenticated: false,
  userInfo: null,
  loading: false,
  error: null,
};

/**
 * 用户状态slice
 * 使用createSlice创建包含reducer和action的用户状态管理模块
 * 处理用户登录、登出等相关操作
 */
const userSlice = createSlice({
  // slice名称，用于action类型前缀
  name: 'user',
  // 初始状态
  initialState,
  // 定义reducer函数，处理状态更新
  reducers: {
    /**
     * 登录开始
     * 设置加载状态，清除之前的错误
     */
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    /**
     * 登录成功
     * 更新认证状态，存储用户信息，清除加载和错误状态
     */
    loginSuccess(state, action: PayloadAction<{ username: string; email: string }>) {
      state.isAuthenticated = true;
      state.userInfo = action.payload;
      state.loading = false;
      state.error = null;
    },
    /**
     * 登录失败
     * 设置错误信息，清除加载状态
     */
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    /**
     * 登出
     * 重置用户状态，清除认证信息
     */
    logout(state) {
      state.isAuthenticated = false;
      state.userInfo = null;
      state.error = null;
    },
    /**
     * 清除错误
     * 重置错误状态，用于关闭错误提示
     */
    clearError(state) {
      state.error = null;
    },
  },
});

// 导出所有action creators，用于在组件中触发状态更新
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError
} = userSlice.actions;

// 导出reducer作为默认导出，用于在store中组合
export default userSlice.reducer;