import { BiBookBookmark, BiCategory, BiArchive } from "react-icons/bi";
import { FaPencilRuler } from "react-icons/fa";

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
    name: "Section",
    route: "/teacher/section",
    icon: BiCategory,
  },
  {
    name: "Exam",
    route: "/teacher/exam",
    icon: BiBookBookmark,
  },
  {
    name: "Archive",
    route: "/teacher/archive",
    icon: BiArchive,
  },
];

const PageRouteDashbordStudent = [
  {
    name: "Section",
    route: "/student/section",
    icon: BiCategory,
  },
  // {
  //   name: "Result",
  //   route: "/student/result",
  //   icon: FaPencilRuler,
  // },
];

export const routesSide = {
  SETTINGS_TEACHER: PageRouteSettingsTeacher,
  DASHEBOARD_TEACHER: PageRouteDashbordTeacher,
  DASHEBOARD_STUDENT: PageRouteDashbordStudent,
  SETTINGS_STUDENT: PageRouteSettingsStudent,
};
