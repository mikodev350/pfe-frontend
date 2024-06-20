const jwt = require("jsonwebtoken");
const secretKey = "votreCleSecrete";

module.exports = {
  generateTemporaryToken: (id) => {
    const expiresIn = "2h";

    const token = jwt.sign({ resourceId: id }, secretKey, {
      expiresIn,
    });

    return token;
  },

  verifyToken: (token) => {
    try {
      const decoded = jwt.verify(token, secretKey);
      // Extract sectionId and nameSection from the decoded token
      const { sectionId, nameSection } = decoded;
      // Return the extracted values
      return { sectionId, nameSection };
    } catch (error) {
      return null; // Invalid token or expired
    }
  },
};
