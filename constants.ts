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
    text: "home",
  },
  {
    img: "/icons/admin/users.svg",
    route: "/school/student",
    text: "allStudents",
  },
  {
    img: "/icons/admin/book.svg",
    route: "/school/classrooms",
    text: "allClassrooms",
  },
  {
    img: "/icons/admin/bookmark.svg",
    route: "/school/archived",
    text: "archiveClassrooms",
  },
];

export const superAdminSideBarLinks = [
  {
    img: "/icons/admin/home.svg",
    route: "/admin",
    text: "home",
  },
];