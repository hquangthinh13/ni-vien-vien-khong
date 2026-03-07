# Cấu trúc thư mục Automation Testing

Tài liệu này mô tả cấu trúc thư mục cho **Automation Testing sử dụng Playwright** trong project frontend.
Cấu trúc được thiết kế để:

* Dễ mở rộng khi số lượng test tăng
* Áp dụng **Page Object Model (POM)**
* Tách biệt rõ **test cases**, **page objects**, **fixtures** và **utilities**

---

# 1. Tổng quan cấu trúc thư mục

```
tests
│
├── smoke
│   └── homepage.spec.ts
│
├── navigation
│   └── navigation.spec.ts
│
├── activity
│   ├── activity-list.spec.ts
│   └── activity-detail.spec.ts
│
├── course
│   ├── course-list.spec.ts
│   └── course-detail.spec.ts
│
├── library
│   ├── book.spec.ts
│   ├── poem.spec.ts
│   ├── question.spec.ts
│   └── ritual.spec.ts
│
├── forms
│   ├── contact-form.spec.ts
│   ├── activity-registration.spec.ts
│   └── question-form.spec.ts
│
├── pages
│   ├── home.page.ts
│   ├── activity.page.ts
│   ├── course.page.ts
│   ├── library.page.ts
│   ├── contact.page.ts
│   └── navigation.component.ts
│
├── fixtures
│   └── baseTest.ts
│
├── utils
│   ├── helpers.ts
│   ├── testData.ts
│   └── constants.ts
│
└── setup
    └── global.setup.ts
```

---

# 2. Mô tả các thư mục

## 2.1 `smoke`

Chứa các **smoke tests** để kiểm tra nhanh hệ thống có hoạt động hay không.

Ví dụ:

```
smoke/
   homepage.spec.ts
```

Các test trong thư mục này thường kiểm tra:

* Homepage có load thành công
* Navbar hiển thị
* Không có lỗi render nghiêm trọng

---

## 2.2 `navigation`

Chứa test cho **navigation menu**.

Ví dụ:

```
navigation/
   navigation.spec.ts
```

Các test có thể bao gồm:

* Click từ homepage đến các trang chính
* Kiểm tra URL sau khi điều hướng
* Kiểm tra menu desktop
* Kiểm tra menu mobile

---

## 2.3 `activity`

Chứa test cho module **Activity**.

Ví dụ:

```
activity/
   activity-list.spec.ts
   activity-detail.spec.ts
```

Các test:

* Trang danh sách activity `/activity`
* Điều hướng đến trang chi tiết `/activity/[documentId]`
* Kiểm tra hiển thị ActivityCard

---

## 2.4 `course`

Chứa test cho module **Course**.

Ví dụ:

```
course/
   course-list.spec.ts
   course-detail.spec.ts
```

Các test:

* Trang danh sách khóa học `/course`
* Trang chi tiết khóa học `/course/[documentId]`
* Hiển thị sidebar và highlight section

---

## 2.5 `library`

Chứa test cho các module trong **Library**.

Ví dụ:

```
library/
   book.spec.ts
   poem.spec.ts
   question.spec.ts
   ritual.spec.ts
```

Các test bao gồm:

* Trang `/library/book`
* Trang `/library/poem`
* Trang `/library/question`
* Trang `/library/ritual`
* Trang dynamic `/library/poem/[documentId]`

---

## 2.6 `forms`

Chứa test cho các **form tương tác với người dùng**.

Ví dụ:

```
forms/
   contact-form.spec.ts
   activity-registration.spec.ts
   question-form.spec.ts
```

Các test bao gồm:

* Kiểm tra validation
* Kiểm tra submit thành công
* Kiểm tra thông báo lỗi

---

# 3. Page Object Model

## 3.1 `pages`

Thư mục chứa **Page Objects** theo mô hình **Page Object Model (POM)**.

Ví dụ:

```
pages/
   home.page.ts
   activity.page.ts
   course.page.ts
   library.page.ts
   contact.page.ts
```

Page Object giúp:

* Tái sử dụng code
* Giảm duplication trong test
* Test dễ đọc hơn

Ví dụ:

```ts
export class HomePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/')
  }
}
```

---

# 4. Fixtures

## `fixtures`

Chứa **custom fixtures của Playwright**.

Ví dụ:

```
fixtures/
   baseTest.ts
```

Fixtures giúp:

* chia sẻ logic giữa các test
* thiết lập môi trường test
* cấu hình test context

---

# 5. Utilities

## `utils`

Chứa các helper functions và test data.

Ví dụ:

```
utils/
   helpers.ts
   testData.ts
   constants.ts
```

Các file này có thể chứa:

* test data
* helper functions
* constants dùng chung cho test

---

# 6. Test Setup

## `setup`

Chứa logic **khởi tạo môi trường test**.

Ví dụ:

```
setup/
   global.setup.ts
```

Các nhiệm vụ thường gặp:

* chuẩn bị dữ liệu test
* thiết lập trạng thái hệ thống
* đăng nhập trước khi test

---

# 7. Nguyên tắc tổ chức test

Khi viết test mới, cần tuân theo các nguyên tắc sau:

1. Test được phân loại theo **module của hệ thống**
2. Tránh viết logic UI trực tiếp trong test
3. Sử dụng **Page Object Model**
4. Tách **test data** khỏi test logic
5. Giữ test **độc lập và có thể chạy song song**

---

# 8. Lợi ích của cấu trúc này

Cấu trúc này giúp:

* Dễ bảo trì test
* Dễ mở rộng khi số lượng test tăng
* Áp dụng best practices của Playwright
* Tách biệt rõ giữa test logic và UI interaction

Khi project lớn hơn, cấu trúc này vẫn có thể mở rộng lên **100+ test cases** mà không gây rối codebase.
