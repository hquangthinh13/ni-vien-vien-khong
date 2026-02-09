import { useTranslations } from "next-intl";

export interface MenuItem {
  title: string;
  href?: string;
  items?: MenuItem[];
}

export default function useMenuConfig(): MenuItem[] {
  const t = useTranslations("Navbar");

  return [
    // 1. Trang chủ
    {
      title: t("home.trigger"),
      href: "/",
    },

    // 2. Giới thiệu
    {
      title: t("about.trigger"),
      items: t.raw("about.items"),
    },

    // 3. Tin tức (Activity)
    {
      title: t("activity.trigger"),
      href: "/activity",
      // items: t.raw("activity.items"),
    },

    // 4. Khóa tu
    {
      title: t("course.trigger"),
      href: "/course",
    },

    // 5. Thư viện
    {
      title: t("library.trigger"),
      items: [
        // Các mục library.items mặc định (Nghi thức, Hình ảnh, Thư pháp...)
        ...t.raw("library.items"),

        // Mục: Tam tạng kinh điển (Submenu level 2)
        {
          title: t("library.sections.scriptures.title"),
          href: "/library/scriptures",
          items: [
            // Nhánh Tiếng Việt (Submenu level 3)
            {
              title: t("library.sections.scriptures.vietnamese.title"),
              // href: "/library/scriptures/vi",

              items: [
                {
                  title: t("library.sections.scriptures.vietnamese.sutta"),
                  href: "/library/scriptures/vn/sutta",
                },
                {
                  title: t("library.sections.scriptures.vietnamese.vinaya"),
                  href: "/library/scriptures/vn/vinaya",
                },
                {
                  title: t("library.sections.scriptures.vietnamese.abhidhamma"),
                  href: "/library/scriptures/vn/abhidhamma",
                },
              ],
            },
            // Nhánh Tiếng Anh
            {
              title: t("library.sections.scriptures.english"),
              href: "/library/scriptures/en",
            },
          ],
        },

        // Mục: Danh mục sách (Submenu level 2)
        {
          title: t("library.sections.books.title"),
          items: [
            {
              title: t("library.sections.books.author1"),
              href: "/library/books/ho-tong",
            },
            {
              title: t("library.sections.books.author2"),
              href: "/library/books/vien-minh",
            },
            {
              title: t("library.sections.books.pali"),
              href: "/library/books/pali-docs",
            },
            {
              title: t("library.sections.books.others"),
              href: "/library/books/others",
            },
          ],
        },
      ],
    },

    // 6. Thăm viếng
    {
      title: t("visit.trigger"),
      items: t.raw("visit.items"),
    },
  ];
}
