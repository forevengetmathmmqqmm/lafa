// 导入React Redux的基础hooks
import { useDispatch, useSelector } from 'react-redux';
// 导入从store定义的类型
import type { RootState, AppDispatch } from './index';

/**
 * 类型安全的dispatch hook
 * 包装原生useDispatch并提供AppDispatch类型
 * 确保在组件中使用时能够获得正确的类型提示和自动补全
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * 类型安全的selector hook
 * 包装原生useSelector并提供RootState类型
 * 使用泛型确保返回值类型正确，提供完整的类型安全
 * 
 * @template TSelected - selector函数的返回值类型
 * @param selector - 接收RootState并返回选定状态的函数
 * @returns 选定的状态值，类型为TSelected
 */
export const useAppSelector = <TSelected>(
  selector: (state: RootState) => TSelected
): TSelected => useSelector(selector);

// 使用指南：
// 1. 在组件中导入这两个hooks替代原生的useDispatch和useSelector
// 2. 使用useAppDispatch获取dispatch函数并调用actions
// 3. 使用useAppSelector选择需要的状态，并获得完整的类型支持