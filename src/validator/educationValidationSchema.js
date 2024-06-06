import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  ecole: Yup.string().required("Le nom de l'école ou du bootcamp est requis"),
  diplome: Yup.string().required("Le diplôme ou certificat est requis"),
  domaineEtude: Yup.string().required("Le champ d'étude est requis"),
  dateDebut: Yup.date().required("La date de début est requise"),
  dateFin: Yup.date()
    .nullable()
    .when("ecoleActuelle", {
      is: false,
      then: (schema) =>
        schema
          .required("La date de fin est requise")
          .min(
            Yup.ref("dateDebut"),
            "La date de fin ne peut pas être antérieure à la date de début"
          ),
    }),
  ecoleActuelle: Yup.boolean(),
  descriptionProgramme: Yup.string().required(
    "La description du programme est requise"
  ),
});
