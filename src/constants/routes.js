import { BiArchive, BiLock, BiUser } from "react-icons/bi";
import { AiFillHome } from "react-icons/ai";
import {
  FaBook,
  FaClipboardList,
  FaChartBar,
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
let Settings = [
  {
    name: "Information",
    route: "/settings/information-account",
  },
  {
    name: "Changer le motde password",
    route: "/settings/change-password",
  },
  {
    name: "Offer",
    route: "/settings/offers",
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
    name: "Informations",
    route: "/settings/information-account",
    icon: BiUser,
  },
  {
    name: "Changer le mot de passe",
    route: "/settings/change-password",
    icon: BiLock, // Icône représentant la sécurité/mot de passe
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
    name: "Notes",
    route: "/dashboard/notes",
    icon: FaChartBar, // Nouvelle icône pour la route Notes
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
    name: "suivi pedagogique",
    route: "/dashboard/suivi-pedagogique",
    icon: FaChalkboardTeacher,
  },
  {
    name: "Notes",
    route: "/dashboard/notes",
    icon: FaChartBar, // Nouvelle icône pour la route Notes
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
  DASHEBOARD_TEACHER: PageRouteDashbordTeacher,
  DASHEBOARD_STUDENT: PageRouteDashbordStudent,
  SETTINGS: PageRouteSettings,
};
