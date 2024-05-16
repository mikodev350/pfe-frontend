// Initial values for question form state
const initialValues = {
  WriteText: "",
  trueAnwser: "",
  rangAnswer: ["", "", "", ""],
  driveLinkImage: "",
  image: undefined,
  youtubeLink: "",
  justificateAnwser: "",
  audio: "",
};

// Initial values for an updated question form state
const initialValuesUpdated = {
  WriteText: "",
  trueAnwser: {
    id: null,
    answer: "",
    isCorrect: true,
  },
  rangAnswer: [
    { id: null, answer: "", isCorrect: false },
    { id: null, answer: "", isCorrect: false },
    { id: null, answer: "", isCorrect: false },
    { id: null, answer: "", isCorrect: false },
  ],
  driveLinkImage: "",
  image: undefined,
  idMedia: undefined,
  youtubeLink: undefined,
  justificateAnwser: "",
  audio: "",
};

// This example shows the usage of plain objects for form states and configurations without TypeScript interfaces.
