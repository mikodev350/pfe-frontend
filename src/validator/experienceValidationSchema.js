import * as Yup from "yup";

export const experienceValidationSchema = Yup.object().shape({
  titrePoste: Yup.string().required("Le titre du poste est requis"),
  entreprise: Yup.string().required("Le nom de l'entreprise est requis"),
  localisation: Yup.string().required("La localisation est requise"),
  dateDebut: Yup.date().required("La date de début est requise"),
  dateFin: Yup.date()
    .nullable()
    .when("posteActuel", {
      is: false,
      then: (schema) =>
        schema
          .required("La date de fin est requise")
          .min(
            Yup.ref("dateDebut"),
            "La date de fin ne peut pas être antérieure à la date de début"
          ),
    }),
  posteActuel: Yup.boolean(),
  descriptionPoste: Yup.string().required(
    "La description du poste est requise"
  ),
});
