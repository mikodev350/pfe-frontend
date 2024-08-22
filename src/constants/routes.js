import { BiArchive, BiUser } from "react-icons/bi";
import { AiFillHome } from "react-icons/ai";
import {
  FaBook,
  FaClipboardList,
  FaQuestionCircle,
  FaUsers,
  FaEnvelopeOpenText,
  FaUserFriends,
  FaHandshake,
  FaChalkboardTeacher,
  FaTasks,
} from "react-icons/fa"; // Ajout des icônes manquantes
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

// const PageRouteDashbordTeacher = [
//   {
//     name: "tableau de bord",
//     route: "/student/homeDashbord",
//     icon: AiFillHome,
//   },
//   {
//     name: "Mon Profile",
//     route: "/student/my-profile",
//     icon: BiUser, // Utilisation de BiUser pour représenter le profil
//   },
//   {
//     name: "mon parcours",
//     route: "/student/parcours",
//     icon: FaBook, // Utilisation de BiBook pour représenter le parcours
//   },
//   {
//     name: "mes resource",
//     route: "/student/resources",
//     icon: BiArchive, // Utilisation de BiArchive pour représenter les ressources
//   },
//   {
//     name: "gere coatching",
//     route: "/student/coatching",
//     icon: FaPeopleGroup, // Utilisation de BiMessageSquareCheck pour représenter le coaching
//   },
// ];

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
    route: "/dashboard/home",
    icon: AiFillHome,
  },
  {
    name: "Mon Profile",
    route: "/dashboard/my-profile",
    icon: BiUser,
  },
  {
    name: "mon parcours",
    route: "/dashboard/parcours",
    icon: FaBook,
  },
  {
    name: "mes resource",
    route: "/dashboard/resources",
    icon: BiArchive,
  },
  {
    name: "Mes Activités",
    route: "/dashboard/assignments",
    icon: FaTasks,
  },
  {
    name: "Mentorat",
    route: "/dashboard/communaute/coaching",
    icon: FaChalkboardTeacher,
  },
  {
    name: "Communauté",
    icon: FaUsers,
    subRoutes: [
      {
        name: "Invitations",
        route: "/dashboard/communaute/invitations",
        icon: FaEnvelopeOpenText,
      },
      {
        name: "Liste d'Amis",
        route: "/dashboard/communaute/amis",
        icon: FaUserFriends,
      },
      {
        name: "Liste de professeur",
        route: "/dashboard/communaute/enseignants",
        icon: FaHandshake,
      },
    ],
  },
];

const PageRouteDashbordTeacher = [
  {
    name: "tableau de bord",
    route: "/dashboard/homeDashbord",
    icon: AiFillHome,
  },
  {
    name: "Mon Profile",
    route: "/dashboard/my-profile",
    icon: BiUser,
  },
  {
    name: "mon parcours",
    route: "/dashboard/parcours",
    icon: FaBook,
  },
  {
    name: "mes resource",
    route: "/dashboard/resources",
    icon: BiArchive,
  },
  {
    name: "suivi pedagogique",
    route: "/dashboard/suivi-pedagogique",
    icon: FaChalkboardTeacher,
  },

  {
    name: "Évaluations",
    icon: FaClipboardList,
    subRoutes: [
      {
        name: "Devoirs",
        route: "/dashboard/devoirs",
        icon: FaClipboardList,
      },
      {
        name: "Quiz",
        route: "/dashboard/quizzes",
        icon: FaQuestionCircle,
      },
    ],
  },
  {
    name: "coaching",
    route: "/dashboard/communaute/coaching",
    icon: FaPeopleGroup,
  },
  {
    name: "Mes Activités",
    route: "/dashboard/assignments",
    icon: FaTasks,
  },
  {
    name: "Communauté",
    icon: FaUsers,
    subRoutes: [
      {
        name: "Invitations",
        route: "/dashboard/communaute/invitations",
        icon: FaEnvelopeOpenText,
      },
      {
        name: "Liste d'Amis",
        route: "/dashboard/communaute/amis",
        icon: FaUserFriends,
      },
      {
        name: "Liste de professeur",
        route: "/dashboard/communaute/enseignants",
        icon: FaHandshake,
      },
    ],
  },
];

// /.../;

export const routesSide = {
  SETTINGS_TEACHER: PageRouteSettingsTeacher,
  DASHEBOARD_TEACHER: PageRouteDashbordTeacher,
  DASHEBOARD_STUDENT: PageRouteDashbordStudent,
  SETTINGS_STUDENT: PageRouteSettingsStudent,
  SETTINGS: PageRouteSettings,
};
