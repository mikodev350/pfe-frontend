import Dexie from "dexie";

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
    this.referenceLivre = referenceLivre;
  }
}

class File {
  constructor(id, name, type, content, createdAt) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.content = content;
    this.createdAt = createdAt;
  }
}

const db = new Dexie("POADatabase");

db.version(1).stores({
  parcours: "++id, nom, type, etablissement, autoApprentissage",
  modules: "++id, nom, parcour, lessons, lessonLength",
  lessons: "++id, nom, module, createdAt, updatedAt",
  resources:
    "++id, nom, format, parcours, modules, lessons, note, images, audio, pdf, video, link, referenceLivre",
  offlineChanges: "++id, type, data, timestamp, endpoint, method, headers",
  files: "++id, name,preview, type, content, lastModified, createdAt", // Updated schema
  // files: "++id, name, type, content, createdAt",
});

db.parcours.mapToClass(Parcour);
db.modules.mapToClass(Module);
db.lessons.mapToClass(Lesson);
db.resources.mapToClass(Resource);
db.files.mapToClass(File);

export default db;
