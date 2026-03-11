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

    // {
    //   title: t("blog.trigger"),
    //   href: "/blog",
    // },
    // 5. Thư viện
    {
      title: t("library.trigger"),
      items: [
        // Mục: Tam tạng kinh điển (Submenu level 2)
        {
          title: t("library.sections.scriptures.title"),
          // href: "/library/scriptures",
          items: [
            // Nhánh Tiếng Việt (Submenu level 3)
            {
              title: t("library.sections.scriptures.vietnamese.title"),
              // href: "/library/scriptures/vi",

              items: [
                {
                  title: t("library.sections.scriptures.vietnamese.sutta"),
                  href: "/library/scriptures/sutta",
                },
                {
                  title: t("library.sections.scriptures.vietnamese.vinaya"),
                  href: "/library/scriptures/vinaya",
                },
                {
                  title: t("library.sections.scriptures.vietnamese.abhidhamma"),
                  href: "/library/scriptures/abhidhamma",
                },
              ],
            },
            // Nhánh Tiếng Anh
            {
              title: t("library.sections.scriptures.english"),
              href: "https://sutamphap.com/category/english-articles/articles/",
            },
          ],
        },

        // Mục: Danh mục sách (Submenu level 2)
        {
          title: t("library.sections.books.title"),
          items: [
            {
              title: t("library.sections.books.author1"),
              href: "/library/book/first-patriarch",
            },
            {
              title: t("library.sections.books.author2"),
              href: "/library/book/vien-minh",
            },
            {
              title: t("library.sections.books.pali"),
              href: "/library/book/pali-docs",
            },
            {
              title: t("library.sections.books.others"),
              href: "/library/book/others",
            },
          ],
        },
        ...t.raw("library.items"),
      ],
    },

    // 6. Thăm viếng
    {
      title: t("visit.trigger"),
      items: t.raw("visit.items"),
    },
  ];
}
