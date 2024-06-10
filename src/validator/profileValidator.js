import * as Yup from "yup";

export const validationProfileSchemaStudent = Yup.object().shape({
  typeEtudes: Yup.string().required("Type d'études est obligatoire"),
  niveauEtudes: Yup.string()
    .nullable()
    .when("typeEtudes", {
      is: "académique",
      then: (schema) => schema.required("Niveau d'études est obligatoire"),
    }),
  niveauSpecifique: Yup.string()
    .nullable()
    .when("niveauEtudes", {
      is: (niveauEtudes) =>
        ["Primaire", "Moyen", "Lycée", "Université"].includes(niveauEtudes),
      then: (schema) => schema.required("Niveau spécifique est obligatoire"),
    }),
  specialite: Yup.string()
    .nullable()
    .when("niveauEtudes", {
      is: "Université",
      then: (schema) => schema.required("Spécialité est obligatoire"),
    }),
  nomFormation: Yup.string()
    .nullable()
    .when("typeEtudes", {
      is: "continue",
      then: (schema) => schema.required("Nom de la formation est obligatoire"),
    }),
  etablisement: Yup.string().nullable(),
  competences: Yup.string().required("Compétences sont obligatoires"),
  bio: Yup.string().nullable(),
});

export const validationProfileSchemaTeacher = Yup.object().shape({
  matieresEnseignees: Yup.string()
    .nullable()
    .required("Matières enseignées sont obligatoires"),
  niveauEnseigne: Yup.string()
    .nullable()
    .required("Niveau(x) enseigné(s) est obligatoire"),
  specialiteEnseigne: Yup.string()
    .nullable()
    .when("niveauEnseigne", {
      is: "Université",
      then: (schema) => schema.required("Spécialité est obligatoire"),
    }),
  etablisement: Yup.string().nullable(),
  competences: Yup.string().required("Compétences sont obligatoires"),
  bio: Yup.string().nullable(),
});
