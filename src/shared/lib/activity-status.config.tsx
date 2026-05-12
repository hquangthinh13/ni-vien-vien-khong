const ACTIVITY_STATUS_CONFIG = {
  upcoming: {
    label: { vi: "Sắp diễn ra", en: "Upcoming" },
    className: "bg-cyan-500",
  },
  ongoing: {
    label: { vi: "Đang diễn ra", en: "Ongoing" },
    className: "bg-pink-500",
  },
  unknown: {
    label: { vi: "Không xác định", en: "Unknown" },
    className: "bg-mauve-500",
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
