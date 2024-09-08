import React, { useState, useEffect, useMemo } from "react";
import { Button, Form, Container, Row, Col, Image, Card } from "react-bootstrap";
import { useFormik } from "formik";
import axios from "axios";
import { BiTrash } from "react-icons/bi";
import { getToken } from "../../util/authUtils";
import { validationProfileSchemaStudent, validationProfileSchemaTeacher } from "../../validator/profileValidator";
import { useNavigate } from "react-router-dom";

import styled from "styled-components";

// /Styled components
const StyledTitle = styled.h1`
  background-color: #10266f;
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  text-align: center;
  font-size: 1.5rem;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.15);
  margin-bottom: 20px;
`;

// Styled components

const StyledCard = styled.div`
  background-color: #ffffff;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.1); /* Enhanced shadow */
  border-radius: 16px; /* Smoother rounded corners */
  padding: 20px 30px;
  max-width: 800px;
  width: 100%;
  margin-top: 20px;
`;



const CardHeaderCustom = styled(Card.Header)`
  background-color: #10266f;
  color: white;
  font-size: 1.5rem;
  text-align: center;
  padding: 15px 20px;
  border-radius: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.15);
  margin-bottom: 20px;
`;

const FormGroupCustom = styled(Form.Group)`
  margin-bottom: 20px;
`;

const CustomButton = styled(Button)`
  border-radius: 20px;
  padding: 10px 20px;
  font-weight: bold;
  &:hover {
    opacity: 0.9;
  }
`;

const ProfileImageWrapper = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto 20px;
`;

const RemovePhotoButton = styled(Button)`
  position: absolute;
  top: -10px;
  right: -10px;
  border-radius: 50%;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ff4d4f;
  border: none;
  &:hover {
    background-color: #e60000;
  }
`;

// Fonction pour télécharger l'image
const apiUpload = async (file, token) => {
  const formData = new FormData();
  formData.append("files", file);

  const response = await axios.post("http://localhost:1337/api/upload", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data[0];
};

const userRole = localStorage.getItem("role")?.toUpperCase();

// Fonction pour soumettre le formulaire
// const submitForm = async (values, profile, token, isUpdate, profileId) => {
//   try {
//     let photoProfilId = profile.photoProfil ? profile.photoProfil.id : null;

//     // Si la photo de profil a été modifiée, la télécharger
//     if (profile.photoProfil && profile.photoProfil instanceof File) {
//       const uploadedPhoto = await apiUpload(profile.photoProfil, token);
//       photoProfilId = uploadedPhoto.id;
//     }

//     if (userRole === "TEACHER") {
//       values.typeEtudes = "teacher";
//       values.niveauEtudes = "rien";
//     }
//     const payload = {
//       ...values,
//       competences: values.competences.split(",").map((comp) => comp.trim()), // Convertir les compétences en tableau
//       matieresEnseignees: values.matieresEnseignees.split(",").map((mat) => mat.trim()), // Convertir les matières enseignées en tableau
//       photoProfil: photoProfilId,
//     };

//     if (values.typeEtudes === "continue") {
//       payload.niveauEtudes = "";
//       payload.niveauSpecifique = "";
//       payload.specialite = "";
//     } else if (values.typeEtudes === "académique") {
//       payload.nomFormation = "";
//     }

//     const url = isUpdate ? `http://localhost:1337/api/profils/${profileId}` : "http://localhost:1337/api/profils";
//     const method = isUpdate ? "PUT" : "POST";

//     console.log("Payload:", payload); // Log du payload pour débogage

//     const response = await axios({
//       method,
//       url,
//       data: payload,
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     console.log("Profile saved:", response.data);
//     alert("Profile saved successfully");
//   } catch (error) {
//     console.error("Error saving profile:", error);
//     alert("Error saving profile");
//   }
// };

// Fonction pour soumettre le formulaire
const submitForm = async (values, profile, token, isUpdate, profileId) => {
  try {
    let photoProfilId = profile.photoProfil ? profile.photoProfil.id : null;

    // Si la photo de profil a été modifiée, la télécharger
    if (profile.photoProfil && profile.photoProfil instanceof File) {
      const uploadedPhoto = await apiUpload(profile.photoProfil, token);
      photoProfilId = uploadedPhoto.id;
    }

    if (userRole === "TEACHER") {
      values.typeEtudes = "teacher";
      values.niveauEtudes = "rien";
    }

    // Convertir les compétences et matières enseignées en majuscules
    const payload = {
      ...values,
      competences: values.competences
        .split(",")
        .map((comp) => comp.trim().toUpperCase()), // Convertir en majuscules
      matieresEnseignees: values.matieresEnseignees
        .split(",")
        .map((mat) => mat.trim().toUpperCase()), // Convertir en majuscules
      photoProfil: photoProfilId,
    };

    if (values.typeEtudes === "continue") {
      payload.niveauEtudes = "";
      payload.niveauSpecifique = "";
      payload.specialite = "";
    } else if (values.typeEtudes === "académique") {
      payload.nomFormation = "";
    }


    const url = isUpdate ? `http://localhost:1337/api/profils/${profileId}` : "http://localhost:1337/api/profils";
    const method = isUpdate ? "PUT" : "POST";

    console.log("Payload:", payload); // Log du payload pour débogage

    const response = await axios({
      method,
      url,
      data: payload,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log("Profile saved:", response.data);
  } catch (error) {
    console.error("Error saving profile:", error);
    alert("Error saving profile");
  }
};


// Fonction pour récupérer le profil
const fetchProfile = async (token) => {
  try {
    const response = await axios.get("http://localhost:1337/api/find-update-profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
};

// Options pour les niveaux d'études
const levelsOptions = {
  Primaire: [
    { value: "AP1", label: "1ère année primaire (AP1)" },
    { value: "AP2", label: "2ème année primaire (AP2)" },
    { value: "AP3", label: "3ème année primaire (AP3)" },
    { value: "AP4", label: "4ème année primaire (AP4)" },
    { value: "AP5", label: "5ème année primaire (AP5)" },
  ],
  Moyen: [
    { value: "AM1", label: "1ère année moyenne (AM1)" },
    { value: "AM2", label: "2ème année moyenne (AM2)" },
    { value: "AM3", label: "3ème année moyenne (AM3)" },
    { value: "AM4", label: "4ème année moyenne (AM4)" },
  ],
  Lycée: [
    { value: "AS1", label: "1ère année secondaire (AS1)" },
    { value: "AS2", label: "2ème année secondaire (AS2)" },
    { value: "AS3", label: "3ème année secondaire (AS3)" },
  ],
  Université: [
    { value: "L1", label: "1ère année Licence (L1)" },
    { value: "L2", label: "2ème année Licence (L2)" },
    { value: "L3", label: "3ème année Licence (L3)" },
    { value: "M1", label: "1ère année Master (M1)" },
    { value: "M2", label: "2ème année Master (M2)" },
  ],
};



const CreerProfil = () => {
  const navigate = useNavigate(); 

  const [role, setRole] = useState("");
  const [typeEtudes, setTypeEtudes] = useState("");
  const [niveauEtudes, setNiveauEtudes] = useState("");
  const [niveauEnseigne, setNiveauEnseigne] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [profileId, setProfileId] = useState(null);

  const [initialValues, setInitialValues] = useState({
    typeEtudes: "",
    niveauEtudes: "",
    niveauSpecifique: "",
    specialite: "",
    etablisement: "",
    competences: "",
    bio: "",
    matieresEnseignees: "",
    niveauEnseigne: "",
    specialiteEnseigne: "",
    nomFormation: "",
  });

  const [profile, setProfile] = useState({
    photoProfil: null,
    photoProfilPreview: "",
  });

  useEffect(() => {
    // Récupérer le rôle depuis le localStorage lors du chargement de la page
    if (userRole) {
      setRole(userRole);
    }

    const token = getToken();
    if (token) {
      fetchProfile(token).then((profile) => {
        if (profile) {
          setIsUpdate(true);
          setProfileId(profile.id);
          setInitialValues({
            typeEtudes: profile.typeEtudes || "",
            niveauEtudes: profile.niveauEtudes || "",
            niveauSpecifique: profile.niveauSpecifique || "",
            specialite: profile.specialite || "",
            etablisement: profile.etablisement || "",
            competences: profile.competences ? profile.competences.join(", ") : "",
            bio: profile.bio || "",
            matieresEnseignees: profile.matieresEnseignees ? profile.matieresEnseignees.join(", ") : "",
            niveauEnseigne: profile.niveauEnseigne || "",
            specialiteEnseigne: profile.specialiteEnseigne || "",
            nomFormation: profile.nomFormation || "",
          });

          if (profile.photoProfil) {
            setProfile({
              ...profile,
              photoProfilPreview: `http://localhost:1337${profile.photoProfil.url}`,
              photoProfilId: profile.photoProfil.id,
            });
          }

          setTypeEtudes(profile.typeEtudes);
          setNiveauEtudes(profile.niveauEtudes);
          setNiveauEnseigne(profile.niveauEnseigne);
        }
      });
    }
  }, []);


   const handleCompetencesChange = (e) => {
    const value = e.target.value.toUpperCase(); // Convert to uppercase
    formik.setFieldValue("competences", value);
  };

  const handleMatieresEnseigneesChange = (e) => {
    const value = e.target.value.toUpperCase(); // Convert to uppercase
    formik.setFieldValue("matieresEnseignees", value);
  };
  const token = useMemo(() => getToken(), []);

  const validationSchema =
    role === "STUDENT"
      ? validationProfileSchemaStudent
      : validationProfileSchemaTeacher;

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      console.log("Form values:", values); // Log des valeurs du formulaire pour débogage
      await submitForm(values, profile, token, isUpdate, profileId);
      navigate('/dashboard/edit-profile');
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({
          photoProfil: file,
          photoProfilPreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfile({
      photoProfil: null,
      photoProfilPreview: "",
    });
  };

  const handleTypeEtudesChange = (e) => {
    const value = e.target.value;
    setTypeEtudes(value);
    formik.setFieldValue("typeEtudes", value);
    if (value === "académique") {
      formik.setFieldValue("nomFormation", "");
    } else if (value === "continue") {
      formik.setFieldValue("niveauEtudes", "");
      formik.setFieldValue("niveauSpecifique", "");
      formik.setFieldValue("specialite", "");
    }
  };

  const handleNiveauEtudesChange = (e) => {
    const value = e.target.value;
    setNiveauEtudes(value);
    formik.setFieldValue("niveauEtudes", value);
  };

  const handleNiveauEnseigneChange = (e) => {
    const value = e.target.value;
    setNiveauEnseigne(value);
    formik.setFieldValue("niveauEnseigne", value);
  };

return (
    <Container fluid >
      <Row className="justify-content-center">
        <StyledCard>
          <StyledTitle>
            {isUpdate ? "Modifier Votre Profil" : "Créer Votre Profil"}
          </StyledTitle>
          <Card.Body>
            <p className="text-center mb-4">
              Fournissez quelques informations pour faire ressortir votre profil
            </p>
            <div className="text-center mb-4">
              <ProfileImageWrapper>
                <Form.Label htmlFor="photoProfil">
                  <Image
                    src={profile.photoProfilPreview || "https://via.placeholder.com/150"}
                    roundedCircle
                    width="150"
                    height="150"
                    className="profile-image"
                    style={{ cursor: "pointer" }}
                  />
                  {profile.photoProfilPreview && (
                    <RemovePhotoButton onClick={handleRemovePhoto}>
                      <BiTrash size={20} />
                    </RemovePhotoButton>
                  )}
                </Form.Label>
                <Form.Control
                  type="file"
                  name="photoProfil"
                  id="photoProfil"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </ProfileImageWrapper>
            </div>

            <Form onSubmit={formik.handleSubmit}>
              {role === "STUDENT" && (
                <>
                  <FormGroupCustom controlId="typeEtudes">
                    <Form.Label>
                      Type d'Études <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="typeEtudes"
                      value={typeEtudes}
                      onChange={handleTypeEtudesChange}
                      isInvalid={!!formik.errors.typeEtudes}
                      className="form-control-custom"
                    >
                      <option value="">Sélectionner le type d'études</option>
                      <option value="académique">Académique</option>
                      <option value="continue">Continue</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.typeEtudes}
                    </Form.Control.Feedback>
                  </FormGroupCustom>

                  {typeEtudes === "académique" && (
                    <>
                      <FormGroupCustom controlId="niveauEtudes">
                        <Form.Label>
                          Niveau d'Études <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          as="select"
                          name="niveauEtudes"
                          value={niveauEtudes}
                          onChange={handleNiveauEtudesChange}
                          isInvalid={!!formik.errors.niveauEtudes}
                          className="form-control-custom"
                        >
                          <option value="">
                            Sélectionner le niveau d'études
                          </option>
                          <option value="Primaire">Primaire</option>
                          <option value="Moyen">Moyen</option>
                          <option value="Lycée">Lycée</option>
                          <option value="Université">Université</option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.niveauEtudes}
                        </Form.Control.Feedback>
                      </FormGroupCustom>

                      {niveauEtudes && (
                        <FormGroupCustom controlId="niveauSpecifique">
                          <Form.Label>
                            Niveau spécifique <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            as="select"
                            name="niveauSpecifique"
                            value={formik.values.niveauSpecifique}
                            onChange={formik.handleChange}
                            isInvalid={!!formik.errors.niveauSpecifique}
                            className="form-control-custom"
                          >
                            <option value="">
                              Sélectionner le niveau spécifique
                            </option>
                            {levelsOptions[niveauEtudes] &&
                              levelsOptions[niveauEtudes].map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                          </Form.Control>
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.niveauSpecifique}
                          </Form.Control.Feedback>
                        </FormGroupCustom>
                      )}

                      {niveauEtudes === "Université" && (
                        <FormGroupCustom controlId="specialite">
                          <Form.Label>
                            Spécialité <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="specialite"
                            value={formik.values.specialite}
                            onChange={formik.handleChange}
                            isInvalid={!!formik.errors.specialite}
                            className="form-control-custom"
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.specialite}
                          </Form.Control.Feedback>
                        </FormGroupCustom>
                      )}
                    </>
                  )}

                  {typeEtudes === "continue" && (
                    <FormGroupCustom controlId="nomFormation">
                      <Form.Label>
                        Nom de la formation <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="nomFormation"
                        value={formik.values.nomFormation}
                        onChange={formik.handleChange}
                        isInvalid={!!formik.errors.nomFormation}
                        className="form-control-custom"
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.nomFormation}
                      </Form.Control.Feedback>
                    </FormGroupCustom>
                  )}
                </>
              )}

              {userRole === "TEACHER" && (
                <>
                  <FormGroupCustom controlId="matieresEnseignees">
                    <Form.Label>
                      Matières enseignées <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="matieresEnseignees"
                      value={formik.values.matieresEnseignees}
                      onChange={handleMatieresEnseigneesChange}
                      placeholder="Ex: Mathématiques, Physique, Chimie"
                      isInvalid={!!formik.errors.matieresEnseignees}
                      className="form-control-custom"
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.matieresEnseignees}
                    </Form.Control.Feedback>
                  </FormGroupCustom>

                  <FormGroupCustom controlId="niveauEnseigne">
                    <Form.Label>
                      Niveau(x) enseigné(s) <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="niveauEnseigne"
                      value={niveauEnseigne}
                      onChange={handleNiveauEnseigneChange}
                      isInvalid={!!formik.errors.niveauEnseigne}
                      className="form-control-custom"
                    >
                      <option value="">Sélectionner le niveau enseigné</option>
                      <option value="Primaire">Primaire</option>
                      <option value="Moyen">Moyen</option>
                      <option value="Lycée">Lycée</option>
                      <option value="Université">Université</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.niveauEnseigne}
                    </Form.Control.Feedback>
                  </FormGroupCustom>

                  {niveauEnseigne === "Université" && (
                    <FormGroupCustom controlId="specialiteEnseigne">
                      <Form.Label>
                        Spécialité <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="specialiteEnseigne"
                        value={formik.values.specialiteEnseigne}
                        onChange={formik.handleChange}
                        isInvalid={!!formik.errors.specialiteEnseigne}
                        className="form-control-custom"
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.specialiteEnseigne}
                      </Form.Control.Feedback>
                    </FormGroupCustom>
                  )}
                </>
              )}

              <FormGroupCustom controlId="etablisement">
                <Form.Label>Établissement</Form.Label>
                <Form.Control
                  type="text"
                  name="etablisement"
                  value={formik.values.etablisement}
                  onChange={formik.handleChange}
                  isInvalid={!!formik.errors.etablisement}
                  className="form-control-custom"
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.etablisement}
                </Form.Control.Feedback>
              </FormGroupCustom>

              <FormGroupCustom controlId="competences">
                <Form.Label>
                  Compétences <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="competences"
                  value={formik.values.competences}
                  onChange={handleCompetencesChange}
                  placeholder="Ex: HTML, CSS, JavaScript, Français"
                  isInvalid={!!formik.errors.competences}
                  className="form-control-custom"
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.competences}
                </Form.Control.Feedback>
              </FormGroupCustom>

              <FormGroupCustom controlId="bio">
                <Form.Label>Bio</Form.Label>
                <Form.Control
                  as="textarea"
                  name="bio"
                  value={formik.values.bio}
                  onChange={formik.handleChange}
                  rows={3}
                  className="form-control-custom"
                />
              </FormGroupCustom>

              <div className="d-flex justify-content-between">
                <CustomButton variant="secondary" onClick={() => navigate('/dashboard/edit-profile')} className="mr-2">
                  Retour
                </CustomButton>
                <CustomButton type="submit" variant="primary">
                  Envoyer
                </CustomButton>
              </div>
            </Form>
          </Card.Body>
        </StyledCard>
      </Row>
    </Container>
  );
};

export default CreerProfil;
