// filepath: /home/nhat/Documents/graduate/code/frontend/src/services/statisticService.js
import axios from '../axios'; // Đảm bảo đường dẫn này đúng với cấu hình axios của bạn

export const getRevenueStatistics = (periodType, date) => {
    return axios.get('/api/statistics/revenue', {
        params: {
            periodType, // 'day', 'month', 'year'
            date,       // 'YYYY-MM-DD'
        }
    });
};