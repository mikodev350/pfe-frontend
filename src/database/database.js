import Dexie from "dexie";

// Define the classes before using them
class Parcour {
  constructor(
    nom,
    type,
    etablissement,
    autoApprentissage,
    users_permissions_user
  ) {
    this.nom = nom;
    this.type = type;
    this.etablissement = etablissement;
    this.autoApprentissage = autoApprentissage;
    this.users_permissions_user = users_permissions_user;
  }
}

class Module {
  constructor(nom, parcour, lessons, resources, users_permissions_user) {
    this.nom = nom;
    this.parcour = parcour;
    this.lessons = lessons;
    this.resources = resources;
    this.users_permissions_user = users_permissions_user;
  }
}

class Lesson {
  constructor(nom, module, resources, users_permissions_user) {
    this.nom = nom;
    this.module = module;
    this.resources = resources;
  }
}

class Resource {
  constructor(
    id,
    nom,
    format,
    parcours,
    modules,
    lessons,
    note,
    images,
    audio,
    pdf,
    video,
    link,
    users_permissions_user,
    referenceLivre
  ) {
    this.id = id;
    this.nom = nom;
    this.format = format;
    this.parcours = parcours;
    this.modules = modules;
    this.lessons = lessons;
    this.note = note;
    this.images = images;
    this.audio = audio;
    this.pdf = pdf;
    this.video = video;
    this.link = link;
    this.users_permissions_user = users_permissions_user;
    this.referenceLivre = referenceLivre;
  }
}

// Create an instance of the database
const db = new Dexie("POADatabase");

// Define the schema for your database
db.version(1).stores({
  parcours: "++id, nom, type, etablissement, autoApprentissage",
  modules: "++id, nom, parcour, lessons,lessonLength ",
  lessons: "++id, nom, module, createdAt,updatedAt",
  resources:
    "++id, nom, format, parcours, modules, lessons, note, images, audio, pdf, video, link, users_permissions_user, referenceLivre",
  offlineChanges: "++id, type, data, timestamp",
});

// Map the classes to the tables
db.parcours.mapToClass(Parcour);
db.modules.mapToClass(Module);
db.lessons.mapToClass(Lesson);
db.resources.mapToClass(Resource);

export default db;
