// For the initialValues related to examInterface in JavaScript, you simply use a plain object
const initialValues = {
  title: "",
  PublicSection: "",
  examType: false,
  textBeforeExam: "",
  textAfterExam: "",
  score: 0,
  isPublic: true,
  solution: false,
  correction: false,
  examStartDate: null,
  examEndDate: null,
  timeOfExam: 0,
  randomQuestion: false,
  numberOfQuestions: 0,
  randomQuestionOptions: false,
  numberOfdisplayQuestions: 0,
  negativePoint: false,
  resteOfQuestion: 0,
  numberNegativePoint: 0,
  restOfTheQuestions: 0,
  monitoringMode: false,
};

// Similarly, for CustomSectionExamData and related initial values
const initialValuesStudentExams = {
  id: null,
  name: "",
  status: null,
  examStartDate: "",
  examEndDate: "",
  correction: false,
  numberOfQuestions: 0,
};

// If you need to represent the structure, you could use comments or just recognize that
// JavaScript objects inherently do not enforce any structure or types.

// Example type structure represented with a comment
/*
 * ExamItem represents an exam with a title and a score.
 */
const ExamItem = {
  title: "",
  score: 0,
};

/*
 * SeeMoyenneData represents average data calculation for a student across multiple exams.
 */
const SeeMoyenneData = {
  studentName: "",
  exams: [], // This will hold an array of ExamItem objects
  moyenneTotalOfExams: 0,
};
