/**
 * 唯一id，包含英文字符和数字，英文字母开头
 */
export const getUniqueId = () => {
    return 'id_' + Date.now() + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};