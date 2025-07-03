export const FIELD_NAME = {
  email: 'Email',
  password: 'Password',
};

export const FIELD_TYPES = {
  email: 'email',
  password: 'password',
};
export const adminSideBarLinks = [
  {
    img: "/icons/admin/home.svg",
    route: "/school",
    text: "Home",
  },
  {
    img: "/icons/admin/users.svg",
    route: "/school/student",
    text: "All Students",
  },
  {
    img: "/icons/admin/book.svg",
    route: "/school/classrooms",
    text: "All Classrooms",
  },
  {
    img: "/icons/admin/bookmark.svg",
    route: "/school/archived",
    text: "Archive Classrooms",
  },
  
];
export const superAdminSideBarLinks = [
  {
    img: "/icons/admin/home.svg",
    route: "/admin",
    text: "Home",
  },
];