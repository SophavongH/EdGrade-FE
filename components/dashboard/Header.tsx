import React from "react";

type UserSession = {
  user: {
    name?: string;
    // add other user properties as needed
  };
};

const Header = ({ session }: { session: UserSession }) => {
  return (
    <header className="flex lg:items-end items-start justify-between lg:flex-row flex-col gap-5 sm:mb-10 mb-5">
      <div>
        <h2 className="text-2xl font-semibold text-dark-400">
          Welcome, {session?.user?.name || "User"}
        </h2>
      </div>
    </header>
  );
};

export default Header;