// utils/index.js

/**
 * 获取指定天数的日期范围（从n天前到今天，仅日期格式）
 * @param {number} [param=0] - 时间范围天数：
 *                            - param=0（默认）：今天
 *                            - param=7：7天前到今天（包含今天）
 * @returns {Array} [startDate, endDate] - 格式为 "YYYY-MM-DD"
 */
export const getTimeRange = (param = 0) => {
    const now = new Date();
    const endDate = now; // 结束日期固定为今天
    
    // 计算开始日期：param天前（param=0 时为今天）
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - param); // 直接减去 param 天
    
    // 格式化日期（仅 YYYY-MM-DD，补零处理）
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const start = formatDate(startDate); // 开始日期（n天前）
    const end = formatDate(endDate);     // 结束日期（今天）

    return [start, end];
};