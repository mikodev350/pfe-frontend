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
    name: "Évaluations",
    icon: FaClipboardList, // Utilisation de FaClipboardList pour représenter la section Évaluations
    subRoutes: [
      {
        name: "Devoirs",
        route: "/student/devoirs",
        icon: FaClipboardList, // Utilisation de FaClipboardList pour représenter les devoirs
      },
      {
        name: "Quiz",
        route: "/student/quiz",
        icon: FaQuestionCircle, // Utilisation de FaQuestionCircle pour représenter les quiz
      },
    ],
  },
  {
    name: "communauté",
    route: "/student/communaute",
    icon: FaPeopleGroup, // Utilisation de BiGroup pour représenter la communauté
  },
];
const PageRouteDashbordTeacher = [
  {
    name: "tableau de bord",
    route: "/teacher/homeDashbord",
    icon: AiFillHome,
  },
  {
    name: "Mon Profile",
    route: "/teacher/my-profile",
    icon: BiUser,
  },
  {
    name: "mon parcours",
    route: "/teacher/parcours",
    icon: FaBook,
  },
  {
    name: "mes resource",
    route: "/teacher/resources",
    icon: BiArchive,
  },
  {
    name: "Évaluations",
    icon: FaClipboardList,
    subRoutes: [
      {
        name: "Devoirs",
        route: "/teacher/devoirs",
        icon: FaClipboardList,
      },
      {
        name: "Quiz",
        route: "/teacher/quizzes",
        icon: FaQuestionCircle,
      },
    ],
  },
  {
    name: "coaching",
    route: "/teacher/communaute/coaching",
    icon: FaPeopleGroup,
  },
  {
    name: "Communauté",
    icon: FaUsers, // Utilisation de FaUsers pour représenter la communauté
    subRoutes: [
      {
        name: "Invitations",
        route: "/teacher/communaute/invitations",
        icon: FaEnvelopeOpenText, // Utilisation de FaEnvelopeOpenText pour représenter les invitations
      },
      {
        name: "Liste d'Amis",
        route: "/teacher/communaute/amis",
        icon: FaUserFriends, // Utilisation de FaUserFriends pour représenter la liste d'amis
      },
      {
        name: "Liste de professeur",
        route: "/teacher/communaute/enseignants",
        icon: FaHandshake, // Utilisation de FaHandshake pour représenter les collaborations
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
