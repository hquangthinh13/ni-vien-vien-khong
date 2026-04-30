const ACTIVITY_STATUS_CONFIG = {
  upcoming: {
    label: { vi: "Sắp diễn ra", en: "Upcoming" },
    className:
      "border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50",
  },
  ongoing: {
    label: { vi: "Đang diễn ra", en: "Ongoing" },
    className:
      "border-green-200 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/50",
  },
  completed: {
    label: { vi: "Đã kết thúc", en: "Completed" },
    className:
      "border-gray-200 bg-gray-50 text-gray-700 dark:bg-gray-950/30 dark:text-gray-400 dark:border-gray-900/50",
  },
  unknown: {
    label: { vi: "Không xác định", en: "Unknown" },
    className:
      "border-rose-200 bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50",
  },
} as const;

type ActivityStatusKey = keyof typeof ACTIVITY_STATUS_CONFIG;

/**
 * Lấy cấu hình Badge cho trạng thái hoạt động
 */
export const getActivityStatusConfig = (status?: string | null) => {
  if (status && status in ACTIVITY_STATUS_CONFIG) {
    return ACTIVITY_STATUS_CONFIG[status as ActivityStatusKey];
  }

  return ACTIVITY_STATUS_CONFIG["unknown"];
};
