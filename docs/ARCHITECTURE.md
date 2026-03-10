# ARCHITECTURE.md

## 1. Mục tiêu kiến trúc

Dự án sử dụng **Feature-based Pragmatic Architecture** với mục tiêu:

* Dễ mở rộng (scalable)
* Dễ maintain
* Tránh over-engineering
* Phù hợp Next.js App Router
* Phù hợp team nhỏ → trung bình
* Giữ separation of concern rõ ràng

Kiến trúc này nằm giữa:

* Folder-based đơn giản
* Clean Architecture đầy đủ layer

---

# 2. Cấu trúc tổng thể

```
src/
  app/
  features/
  shared/
  i18n/
  messages/
  config/
```

---

# 3. Nguyên tắc cốt lõi

## 3.1 Feature là đơn vị scale

Mỗi business domain là một feature:

```
features/
  activity/
  course/
  poem/
  question/
  ritual/
```

Mỗi feature phải độc lập tối đa với feature khác.

Không được import chéo giữa các feature.

---

## 3.2 Structure bên trong một feature

Ví dụ:

```
features/activity/
  api/
  model/
  ui/
  index.ts
```

### api/

* Chứa logic gọi HTTP
* Không chứa React
* Không chứa state
* Không chứa business logic phức tạp

### model/

* Chứa types
* Chứa custom hooks
* Chứa logic xử lý dữ liệu
* Chứa state management (nếu có)

### ui/

* Chứa React components
* Không được gọi API trực tiếp
* Không chứa business logic nặng
* Không chứa logic HTTP

### index.ts

* Export public API của feature
* app chỉ import từ đây

---

# 4. Dependency Rules (Bắt buộc)

## 4.1 Trong một feature

Dependency flow bắt buộc:

```
ui → model → api
```

### Được phép:

* ui import model
* model import api
* api import types (chỉ types file riêng biệt)

### Không được phép:

* api import model
* api import ui
* model import ui

👉 Tức là:
types nên nằm trong model hoặc tách file types riêng
api chỉ dùng type definition, không import hook hoặc logic

---

## 4.2 Giữa các feature

* Feature không được import trực tiếp feature khác
* Nếu có shared domain logic → tách sang shared/
* Nếu chỉ reuse UI → export public API qua index.ts

## 4.3 Shared layer

```
shared/
  ui/
  lib/
  hooks/
  types/
```
không được chứa business logic của bất kỳ feature nào

### Rule:

* Shared không được import từ feature
* Feature có thể import từ shared

---

# 5. Quy tắc cho app/

```
app/
  activity/
    page.tsx
```

### app chỉ làm:

* Routing
* Layout
* Page entry point

### app không được:

* Gọi API trực tiếp
* Chứa business logic
* Chứa state management

Ví dụ đúng:

```tsx
import { ActivityList } from "@/features/activity"

export default function Page() {
  return <ActivityList />
}
```

---

# 6. API Organization

Không được tạo `lib/api.ts` lớn chứa toàn bộ API.

API phải nằm trong feature:

```
features/activity/api/activity.api.ts
```

Chỉ những utility HTTP chung mới đặt ở:

```
shared/lib/http-client.ts
```

---

# 7. Shared Rules

Chỉ đưa vào shared nếu:

* Được dùng bởi ≥ 2 feature
* Không chứa business logic riêng của một feature

Ví dụ hợp lệ:

* Button
* Card
* useDebounce
* http-client
* constants chung

Không hợp lệ:

* ActivityFilter logic
* Course validation logic

---

# 8. Naming Convention

## File name

* Dùng lowercase + domain prefix
* Không dùng PascalCase cho file trừ component

Ví dụ:

```
activity.api.ts
activity.types.ts
useActivities.ts
ActivityCard.tsx
```

---

## Folder name

* lowercase
* số ít
* theo business domain

---

# 9. Không được làm (Anti-patterns)

❌ Service nằm trong component folder
❌ Component gọi fetch trực tiếp
❌ Feature import chéo nhau
❌ shared import ngược lại feature
❌ File 1000 dòng (God file)
❌ app chứa logic

---

# 10. Khi nào cần nâng cấp kiến trúc?

Nếu hệ thống có:

* Workflow phức tạp
* Business rule nhiều
* Permission layer phức tạp
* Multi-platform reuse

Có thể nâng cấp lên:

* Clean Architecture đầy đủ
* Feature-Sliced Design (FSD)
* Hoặc module hóa sâu hơn

---

# 11. Checklist Review Pull Request

Khi review PR, cần kiểm tra:

* [ ] Component có gọi API trực tiếp không?
* [ ] Feature có import feature khác không?
* [ ] Logic dùng chung có đặt sai chỗ không?
* [ ] File có quá 300–400 dòng không?
* [ ] Có vi phạm dependency rule không?

---

# 12. Tóm tắt kiến trúc

Kiến trúc này đảm bảo:

* High cohesion (theo feature)
* Low coupling (giữa feature)
* Clear dependency direction
* Dễ scale
* Dễ onboarding
* Phù hợp Next.js App Router
 
