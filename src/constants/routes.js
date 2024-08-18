import {
  BiCategory,
  BiArchive,
  BiUser,
  BiLock,
  BiBook,
  BiGroup,
  BiMessageSquareCheck,
  BiHome,
  BiInfoCircle,
  BiCog,
  BiUsers,
} from "react-icons/bi";
import { AiFillHome } from "react-icons/ai";
import { FaBook } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
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

// ...

const PageRouteDashbordTeacher = [
  {
    name: "tableau de bord",
    route: "/student/homeDashbord",
    icon: AiFillHome,
  },
  {
    name: "Mon Profile",
    route: "/student/my-profile",
    icon: BiUser, // Utilisation de BiUser pour représenter le profil
  },
  {
    name: "mon parcours",
    route: "/student/parcours",
    icon: FaBook, // Utilisation de BiBook pour représenter le parcours
  },
  {
    name: "mes resource",
    route: "/student/resources",
    icon: BiArchive, // Utilisation de BiArchive pour représenter les ressources
  },
  {
    name: "gere coatching",
    route: "/student/coatching",
    icon: FaPeopleGroup, // Utilisation de BiMessageSquareCheck pour représenter le coaching
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
    name: "tableau de bord",
    route: "/student/homeDashbord",
    icon: AiFillHome,
  },
  {
    name: "Mon Profile",
    route: "/student/my-profile",
    icon: BiUser, // Utilisation de BiUser pour représenter le profil
  },
  {
    name: "mon parcours",
    route: "/student/parcours",
    icon: FaBook, // Utilisation de BiBook pour représenter le parcours
  },
  {
    name: "mes resource",
    route: "/student/resources",
    icon: BiArchive, // Utilisation de BiArchive pour représenter les ressources
  },
  {
    name: "communauté",
    route: "/student/communaute",
    icon: FaPeopleGroup, // Utilisation de BiGroup pour représenter la communauté
  },
];

// ...

export const routesSide = {
  SETTINGS_TEACHER: PageRouteSettingsTeacher,
  DASHEBOARD_TEACHER: PageRouteDashbordTeacher,
  DASHEBOARD_STUDENT: PageRouteDashbordStudent,
  SETTINGS_STUDENT: PageRouteSettingsStudent,
  SETTINGS: PageRouteSettings,
};
