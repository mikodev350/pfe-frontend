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
    name: "Tableau de bord",
    route: "/dashboard/home",
    icon: AiFillHome,
  },
  {
    name: "Mon profil",
    route: "/dashboard/my-profile",
    icon: BiUser,
  },
  {
    name: "mon parcours",
    route: "/dashboard/parcours",
    icon: FaBook,
  },
  {
    name: "Mes ressources",
    route: "/dashboard/resources",
    icon: BiArchive,
  },
  {
    name: "Mes activités",
    route: "/dashboard/assignments",
    icon: FaTasks,
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
        name: "Liste d'amis",
        route: "/dashboard/communaute/amis",
        icon: FaUserFriends,
      },
      {
        name: "Liste de professeurs",
        route: "/dashboard/communaute/enseignants",
        icon: FaHandshake,
      },
    ],
  },
];

const PageRouteDashbordTeacher = [
  {
    name: "Tableau de bord",
    route: "/dashboard/home",
    icon: AiFillHome,
  },
  {
    name: "Mon profil",
    route: "/dashboard/my-profile",
    icon: BiUser,
  },
  {
    name: "Mon parcours",
    route: "/dashboard/parcours",
    icon: FaBook,
  },
  {
    name: "Mes ressources",
    route: "/dashboard/resources",
    icon: BiArchive,
  },
  {
    name: "Suivi pédagogique",
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
    name: "Coaching",
    route: "/dashboard/communaute/coaching",
    icon: FaPeopleGroup,
  },
  {
    name: "Mes activités",
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
        name: "Liste de professeurs",
        route: "/dashboard/communaute/enseignants",
        icon: FaHandshake,
      },
    ],
  },
];

export const routesSide = {
  DASHEBOARD_TEACHER: PageRouteDashbordTeacher,
  DASHEBOARD_STUDENT: PageRouteDashbordStudent,
  SETTINGS: PageRouteSettings,
};
