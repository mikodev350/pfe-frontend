import * as Yup from "yup";
import { convert } from "html-to-text";

const options = {
  wordwrap: 130,
};

export const validationSchema = Yup.object().shape({
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
        return false; // Fails if value is empty or length <= 2
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
  driveLinkImage: Yup.string()
    .trim()
    .matches(
      /^(https:\/\/drive\.google\.com\/uc\?id=\w+)|(https:\/\/drive\.google\.com\/file\/d\/\w+\/view\?usp=sharing)$/,
      "Please enter a valid Google Drive link for an image."
    )
    .notRequired(),
});

export const validationSchemaUpdateQuestion = Yup.object().shape({
  WriteText: Yup.string()
    .test("textBeforeExam", "Validation failure message", (value) => {
      return value && value.length > 2;
    })
    .required("Please fill out this field"),
  youtubeLink: Yup.string()
    .trim()
    .matches(
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)(\?.*)?$/,
      "Please enter a valid YouTube video link."
    )
    .required("YouTube link is required"),

  driveLinkImage: Yup.string()
    .trim()
    .matches(
      /^(https:\/\/drive\.google\.com\/uc\?id=\w+)|(https:\/\/drive\.google\.com\/file\/d\/\w+\/view\?usp=drive_link)$/,
      "Please enter a valid Google Drive link for an image."
    )
    .notRequired(),
});
