/*
 * @Author: pikun
 * @Date: 2019-12-08 10:55:33
 * @LastEditTime: 2019-12-09 14:33:11
 * @Description:
 */
export const IPC_EVENT = {
	ON_BEFORE_UNLOAD: 'sprout:onBeforeUnload',
	ON_WILL_UNLOAD: 'sprout:onWillUnload',
	ON_CLOSE_WINDOW_OK: (oneTimeEventToken: number) => `sprout:ok${oneTimeEventToken}`, // 确认关闭窗口的返回事件
	ON_CLOSE_WINDOW_CANCEL: (oneTimeEventToken: number) => `sprout:cancel${oneTimeEventToken}`, // 不关闭窗口的返回事件
	ON_WILL_UNLOAD_REPLY:  (oneTimeEventToken: number) => `sprout:reply${oneTimeEventToken}`,
}
