import React from "react";

const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-card py-8 mt-auto">
      <div className="container mx-auto max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm  px-4">
          {/* Cột 1: Thông tin chung */}
          <div className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-primary">
              Ni Viện Viên Không
            </h3>
            <p className="text-muted-foreground">
              Nơi tìm về sự bình yên và tu học chánh pháp.
            </p>
          </div>

          {/* Cột 2: Link nhanh */}
          <div className="space-y-3">
            <h4 className="font-bold">Liên kết</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Tin tức
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 3: Liên hệ */}
          <div className="space-y-3">
            <h4 className="font-bold">Địa chỉ</h4>
            <p className="text-muted-foreground">
              Xã Tóc Tiên, Thị xã Phú Mỹ, Bà Rịa - Vũng Tàu
            </p>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-border text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Ni Viện Viên Không. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
