// 定义一个函数来管理历史记录
class HistoryManager {
  constructor(storageKey) {
    this.storageKey = storageKey; // 存储在 localStorage 中的 key 名称
    this.historyList = this.loadHistory(); // 加载历史记录
  }
  // 从 localStorage 加载历史记录
  loadHistory() {
    const history = localStorage.getItem(this.storageKey);
    return history ? JSON.parse(history) : [];
  }
  // 保存历史记录到 localStorage
  saveHistory() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.historyList));
  }
  // 添加新的历史记录项
  addHistoryItem(item) {
    if (!item.id || !item.title || !item.vod) {
      console.error("历史记录项必须包含 id, title 和 vod 字段");
      return;
    }
    // 检查是否已存在相同的 id
    const isDuplicate = this.historyList.some((historyItem) => historyItem.id === item.id);
    if (!isDuplicate) {
      this.historyList.push(item); // 如果不存在，则添加
      this.saveHistory(); // 保存到 localStorage
      console.log("历史记录已添加:", item);
    } else {
      console.log("历史记录已存在，未添加:", item);
    }
  }
  // 获取所有历史记录
  getHistory() {
    return this.historyList;
  }
  // 清空历史记录
  clearHistory() {
    this.historyList = [];
    this.saveHistory();
    console.log("历史记录已清空");
  }
}

export default HistoryManager;
