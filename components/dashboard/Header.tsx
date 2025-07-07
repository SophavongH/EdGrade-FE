import React from "react";
import { useLanguage } from "@/lib/LanguageProvider";

type UserSession = {
  user: {
    name?: string;
    // add other user properties as needed
  };
};

const Header = ({ session }: { session: UserSession }) => {
  const { t } = useLanguage();

  return (
    <header className="flex lg:items-end items-start justify-between lg:flex-row flex-col gap-5 sm:mb-10 mb-5">
      <div>
        <h2 className="text-2xl font-semibold text-dark-400">
          {t("welcome")}, {session?.user?.name || t("user")}
        </h2>
      </div>
    </header>
  );
};

export default Header;