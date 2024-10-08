import * as Yup from "yup";
import { convert } from "html-to-text";

const options = {
  wordwrap: 130,
};

export const validationSchema = Yup.object().shape({
  resourceName: Yup.string().trim().required("Resource name is required"),
  format: Yup.string()
    .oneOf(["cours", "devoir", "ressource numérique"], "Invalid format")
    .required("Format is required"),
  parcours: Yup.array().of(Yup.number()).required("Parcours is required"),
  module: Yup.array().of(Yup.number()).required("Module is required"),
  lesson: Yup.array().of(Yup.number()).required("Lesson is required"),
  WriteText: Yup.string()
    .test(
      "textLength",
      "Text must be longer than 2 characters after conversion",
      (value) => {
        if (value) {
          const text = convert(value, options);
          const cleanedText = value.replace(/<br\s*\/?>/gi, "").trim();
          return cleanedText.length > 2;
        }
        return false;
      }
    )
    .required("Please fill out this field"),
  youtubeLink: Yup.string()
    .trim()
    .matches(
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)(\?.*)?$/,
      "Please enter a valid YouTube video link."
    )
    .notRequired(),
  image: Yup.mixed().notRequired(),
  audio: Yup.mixed().notRequired(),
  pdf: Yup.mixed().notRequired(),
  video: Yup.mixed().notRequired(),
});

// import * as Yup from "yup";
// import { convert } from "html-to-text";

// const options = {
//   wordwrap: 130,
// };

// export const validationSchema = Yup.object().shape({
//   WriteText: Yup.string()
//     .test(
//       "textLength",
//       "Text must be longer than 2 characters after conversion",
//       (value) => {
//         if (value) {
//           const text = convert(value, options);
//           const cleanedText = value.replace(/<br\s*\/?>/gi, "").trim();
//           return cleanedText.length > 2;
//         }
//         return false; // Fails if value is empty or length <= 2
//       }
//     )
//     .required("Please fill out this field"),
//   youtubeLink: Yup.string()
//     .trim()
//     .matches(
//       /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)(\?.*)?$/,
//       "Please enter a valid YouTube video link."
//     )
//     .notRequired(),
//   resourceName: Yup.string().trim().required("Resource name is required"),
//   format: Yup.string()
//     .oneOf(["cours", "devoir", "ressource numérique"], "Invalid format")
//     .required("Format is required"),
//   type: Yup.string()
//     .oneOf(["URL", "file", "livre"], "Invalid type")
//     .required("Type is required"),
//   parcours: Yup.string().trim().required("Parcours is required"),
//   module: Yup.string().trim().required("Module is required"),
//   lesson: Yup.string().trim().required("Lesson is required"),
//   note: Yup.string().trim().required("Note is required"),
// });

// // export const validationSchemaUpdateQuestion = Yup.object().shape({
// //   WriteText: Yup.string()
// //     .test("textBeforeExam", "Validation failure message", (value) => {
// //       return value && value.length > 2;
// //     })
// //     .required("Please fill out this field"),
// //   youtubeLink: Yup.string()
// //     .trim()
// //     .matches(
// //       /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)(\?.*)?$/,
// //       "Please enter a valid YouTube video link."
// //     )
// //     .required("YouTube link is required"),
// // });
