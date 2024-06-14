import { BiCategory, BiArchive } from "react-icons/bi";

// const role = localStorage.getItem("role"); // Get the role from local storage

let PageRouteSettingsTeacher = [
  {
    name: "Information account",
    route: "/settings/update-account",
  },
  {
    name: "Change the password",
    route: "/settings/change-password",
  },
  {
    name: "Offer",
    route: "/settings/offers",
  },
];

let PageRouteSettingsStudent = [
  {
    name: "Information account",
    route: "/settings/update-account",
  },
  {
    name: "Change the password",
    route: "/settings/change-password",
  },
];

const PageRouteDashbordTeacher = [
  {
    name: "Mon Profile",
    route: "/student/my-profile",
    icon: BiCategory,
  },
  {
    name: "mon parcours",
    route: "/student/parcours",
    icon: BiCategory,
  },
  {
    name: "mes resource",
    route: "/student/resources",
    icon: BiCategory,
  },
  {
    name: "gere coatching",
    route: "/student/coatching",
    icon: BiCategory,
  },
];

let PageRouteSettings = [
  {
    name: "Informations du compte",
    route: "/settings/information-account",
  },
  {
    name: "Changez votre mot de passe",
    route: "/settings/change-password",
  },
];

const PageRouteDashbordStudent = [
  {
    name: "Mon Profile",
    route: "/student/my-profile",
    icon: BiCategory,
  },
  {
    name: "mon parcours",
    route: "/student/parcours",
    icon: BiCategory,
  },
  {
    name: "mes resource",
    route: "/student/resources",
    icon: BiCategory,
  },
  {
    name: "communauté",
    route: "/student/communaute",
    icon: BiCategory,
  },
];

export const routesSide = {
  SETTINGS_TEACHER: PageRouteSettingsTeacher,
  DASHEBOARD_TEACHER: PageRouteDashbordTeacher,
  DASHEBOARD_STUDENT: PageRouteDashbordStudent,
  SETTINGS_STUDENT: PageRouteSettingsStudent,
  SETTINGS: PageRouteSettings,
};
