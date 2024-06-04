import React, { useState, useEffect, useMemo } from 'react';
import { Button, Form, Container, Row, Col, Image, Card } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { BiTrash } from 'react-icons/bi';
import { getToken } from '../../util/authUtils';

// Fonction pour télécharger l'image
const apiUpload = async (file, token) => {
  const formData = new FormData();
  formData.append('files', file);

  const response = await axios.post('http://localhost:1337/api/upload', formData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data[0];
};

// Fonction pour soumettre le formulaire
const submitForm = async (values, profile, token, isUpdate, profileId) => {
  try {
    let photoProfilId = profile.photoProfil ? profile.photoProfil.id : null;

    // Si la photo de profil a été modifiée, la télécharger
    if (profile.photoProfil && profile.photoProfil instanceof File) {
      const uploadedPhoto = await apiUpload(profile.photoProfil, token);
      photoProfilId = uploadedPhoto.id;
    }

    const payload = {
      ...values,
      competences: values.competences.split(',').map(comp => comp.trim()), // Convertir les compétences en tableau
      photoProfil: photoProfilId
    };

    const url = isUpdate ? `http://localhost:1337/api/profils/${profileId}` : 'http://localhost:1337/api/profils';
    const method = isUpdate ? 'PUT' : 'POST';

    console.log('Payload:', payload); // Log du payload pour débogage

    const response = await axios({
      method,
      url,
      data: payload,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Profile saved:', response.data);
    alert('Profile saved successfully');
  } catch (error) {
    console.error('Error saving profile:', error);
    alert('Error saving profile');
  }
};

// Fonction pour récupérer le profil
const fetchProfile = async (token) => {
  try {
    const response = await axios.get('http://localhost:1337/api/custom-profile/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};



// Schéma de validation avec Yup
const validationSchema = Yup.object().shape({
  niveauEtudes: Yup.string().required('Niveau d\'études est obligatoire'),
  programmeEtudes: Yup.string().nullable().when('niveauEtudes', {
    is: (val) => val === 'Formation',
    then: (schema) => schema.required('Programme d\'études est obligatoire'),
    otherwise: (schema) => schema.nullable()
  }),
  
  anneeEtudes: Yup.string().nullable().when('niveauEtudes', {
    is: (val) => ['Moyen', 'Lycée', 'Université','Formation'].includes(val),
    then: (schema) => schema.required('Année d\'études est obligatoire'),
    otherwise: (schema) => schema.nullable()
  }),
  institution: Yup.string().nullable(),
  competences: Yup.string()
    .required('Compétences sont obligatoires')
    .test('is-valid-competences', 'Les compétences doivent être séparées par des virgules et ne doivent pas être vides', (value) => {
      if (!value) return false;
      const competences = value.split(',').map(comp => comp.trim());
      return competences.every(comp => comp !== '');
    }),
  experienceStage: Yup.string().nullable(),
  projets: Yup.string().nullable(),
  bio: Yup.string().nullable(),
  // niveauFormation: Yup.string().nullable().when('niveauEtudes', {
  //   is: 'Formation',
  //   then: (schema) => schema.required('Niveau de formation est obligatoire'),
  //   otherwise: (schema) => schema.nullable()
  // })
});

const CreerProfil = () => {
  const [role, setRole] = useState('');
  const [niveau, setNiveau] = useState('');
  const [isUpdate, setIsUpdate] = useState(false);
  const [profileId, setProfileId] = useState(null);

  const [initialValues, setInitialValues] = useState({
    niveauEtudes: '',
    programmeEtudes: '',
    anneeEtudes: '',
    institution: '',
    competences: '',
    experienceStage: '',
    projets: '',
    bio: '',
    // niveauFormation: ''
  });

  const [profile, setProfile] = useState({
    photoProfil: null,
    photoProfilPreview: ''
  });

  useEffect(() => {
    // Récupérer le rôle depuis le localStorage lors du chargement de la page
    const userRole = localStorage.getItem('role');
    if (userRole) {
      setRole(userRole);
    }

    const token = getToken();
    if (token) {
      fetchProfile(token).then(profile => {
        if (profile) {
          setIsUpdate(true);
          setProfileId(profile.id);
          setInitialValues({
            niveauEtudes: profile.niveauEtudes || '',
            programmeEtudes: profile.programmeEtudes || '',
            anneeEtudes: profile.anneeEtudes || '',
            institution: profile.institution || '',
            competences: profile.competences ? profile.competences.join(', ') : '',
            experienceStage: profile.experienceStage || '',
            projets: profile.projets || '',
            bio: profile.bio || '',
            // niveauFormation: profile.niveauFormation || ''
          });

          if (profile.photoProfil) {
            setProfile({
              ...profile,
              photoProfilPreview: `http://localhost:1337${profile.photoProfil.url}`,
              photoProfilId: profile.photoProfil.id,
            });
          }

          setNiveau(profile.niveauEtudes);
        }
      });
    }
  }, []);

  const token = useMemo(() => getToken(), []);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: role === 'student' ? validationSchema : Yup.object({}),
    onSubmit: async (values) => {
      console.log('Form values:', values); // Log des valeurs du formulaire pour débogage
      await submitForm(values, profile, token, isUpdate, profileId);
    }
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({
          photoProfil: file,
          photoProfilPreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfile({
      photoProfil: null,
      photoProfilPreview: ''
    });
  };

  const handleNiveauChange = (e) => {
    const value = e.target.value;
    setNiveau(value);
    formik.setFieldValue('niveauEtudes', value);
  };


  console.log('====================================');
console.log(formik);
console.log('====================================');
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={8}>
          <h2 className="text-center">Créer Votre Profil</h2>
          <p className="text-center">Fournissez quelques informations pour faire ressortir votre profil</p>
          
          <Card className="mb-4 text-center">
            <Card.Body>
              <div className="mb-3">
                {profile.photoProfilPreview && (
                  <Button variant="danger" onClick={handleRemovePhoto} className="mb-2"><BiTrash size={24} /></Button>
                )}
                <Form.Label htmlFor="photoProfil">
                  <Image
                    src={profile.photoProfilPreview || "https://via.placeholder.com/150"}
                    roundedCircle
                    width="150"
                    height="150"
                    className="mb-3"
                    style={{ cursor: 'pointer' }}
                  />
                </Form.Label>
                <Form.Control
                  type="file"
                  name="photoProfil"
                  id="photoProfil"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>
            </Card.Body>
          </Card>

          <Form onSubmit={formik.handleSubmit}>
            {role === 'student' && (
              <>
                <Form.Group controlId="niveauEtudes">
                  <Form.Label>Niveau d'Études <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    as="select"
                    name="niveauEtudes"
                    value={niveau}
                    onChange={handleNiveauChange}
                    isInvalid={!!formik.errors.niveauEtudes}>
                    <option value="">Sélectionner le niveau d'études</option>
                    <option value="Moyen">Enseignement Moyen</option>
                    <option value="Lycée">Lycée</option>
                    <option value="Université">Université</option>
                    <option value="Formation">Formation</option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.niveauEtudes}
                  </Form.Control.Feedback>
                </Form.Group>

                {['Moyen', 'Lycée', 'Université'].includes(niveau) && (
                  <Form.Group controlId="anneeEtudes">
                    <Form.Label>Année d'Études <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="anneeEtudes"
                      value={formik.values.anneeEtudes}
                      onChange={formik.handleChange}
                      isInvalid={!!formik.errors.anneeEtudes}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.anneeEtudes}
                    </Form.Control.Feedback>
                  </Form.Group>
                )}

                {niveau === 'Formation' && (
                  <Form.Group controlId="programmeEtudes">
                    <Form.Label>Programme d'Études <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="programmeEtudes"
                      value={formik.values.programmeEtudes}
                      onChange={formik.handleChange}
                      isInvalid={!!formik.errors.programmeEtudes}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.programmeEtudes}
                    </Form.Control.Feedback>
                  </Form.Group>
                )}
              </>
            )}

            <Form.Group controlId="institution">
              <Form.Label>Institution</Form.Label>
              <Form.Control
                type="text"
                name="institution"
                value={formik.values.institution}
                onChange={formik.handleChange}
                isInvalid={!!formik.errors.institution}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.institution}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="competences">
              <Form.Label>Compétences <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="competences"
                value={formik.values.competences}
                onChange={formik.handleChange}
                placeholder="Ex: HTML, CSS, JavaScript, Français"
                isInvalid={!!formik.errors.competences}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.competences}
              </Form.Control.Feedback>
            </Form.Group>

            {role === 'student' && (
              <>
                <Form.Group controlId="experienceStage">
                  <Form.Label>Expérience de Stage/Travail</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="experienceStage"
                    value={formik.values.experienceStage}
                    onChange={formik.handleChange}
                    rows={3}
                  />
                </Form.Group>

                <Form.Group controlId="projets">
                  <Form.Label>Projets</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="projets"
                    value={formik.values.projets}
                    onChange={formik.handleChange}
                    rows={3}
                  />
                </Form.Group>
              </>
            )}

            <Form.Group controlId="bio">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                name="bio"
                value={formik.values.bio}
                onChange={formik.handleChange}
                rows={3}
              />
            </Form.Group>

            <Button variant="primary" type="submit">Envoyer</Button>
            <Button variant="secondary" type="button" className="ml-2">Retour</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CreerProfil;
