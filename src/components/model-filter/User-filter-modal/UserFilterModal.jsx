import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Select from 'react-select';

const niveauEtudesOptions = [
  { value: 'AP1', label: '1ère année primaire (AP1)' },
  { value: 'AP2', label: '2ème année primaire (AP2)' },
  { value: 'AP3', label: '3ème année primaire (AP3)' },
  { value: 'AP4', label: '4ème année primaire (AP4)' },
  { value: 'AP5', label: '5ème année primaire (AP5)' },
  { value: 'AM1', label: '1ère année moyenne (AM1)' },
  { value: 'AM2', label: '2ème année moyenne (AM2)' },
  { value: 'AM3', label: '3ème année moyenne (AM3)' },
  { value: 'AM4', label: '4ème année moyenne (AM4)' },
  { value: 'AS1', label: '1ère année secondaire (AS1)' },
  { value: 'AS2', label: '2ème année secondaire (AS2)' },
  { value: 'AS3', label: '3ème année secondaire (AS3)' },
  { value: 'L1', label: '1ère année Licence (L1)' },
  { value: 'L2', label: '2ème année Licence (L2)' },
  { value: 'L3', label: '3ème année Licence (L3)' },
  { value: 'M1', label: '1ère année Master (M1)' },
  { value: 'M2', label: '2ème année Master (M2)' },
];

const niveauEnseigneOptions = [
  { value: 'Primaire', label: 'Primaire' },
  { value: 'Moyen', label: 'Moyen' },
  { value: 'Lycée', label: 'Lycée' },
  { value: 'Université', label: 'Université' },
];

const UserFilterModal = ({ show, handleClose, onFilterChange }) => {
  const [filters, setFilters] = useState({
    username: '',
    role: '',
    typeEtudes: '',
    niveauEtudes: '',
    nomFormation: '',
    matieresEnseignees: '',
    specialiteEnseigne: '',
    niveauEnseigne: [], // Initialisation avec un tableau vide
  });

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const applyFilters = () => {
    onFilterChange(filters);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Filtrer Utilisateurs</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
        
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Nom d'utilisateur"
              value={filters.username}
              onChange={(e) => handleFilterChange('username', e.target.value)}
            />
          </Form.Group>
          {/*<Form.Group>
             <Form.Controlmikito
              type="text"
              placeholder="Rôle"
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
            />
          </Form.Group> */}
          <Form.Group>
            <Form.Control
              as="select"
              value={filters.role}
              onChange={(e) => {
                handleFilterChange('role', e.target.value)
}
            }
            >
              <option value="">Sélectionner le type d'utilisateur</option>
              <option value="student">Étudiant</option>
              <option value="teacher">Professeur</option>
            </Form.Control>
          </Form.Group>

          {filters.role === 'student' && (
            <>
              <Form.Group>
                <Form.Control
                  as="select"
                  value={filters.typeEtudes}
                  onChange={(e) => handleFilterChange('typeEtudes', e.target.value)}
                >
                  <option value="">Sélectionner le type d'étude</option>
                  <option value="academique">Académique</option>
                  <option value="continue">Continue</option>
                </Form.Control>
              </Form.Group>
              {filters.typeEtudes === 'academique' && (
                <>
                  <Form.Group>
                    <Select
                      options={niveauEtudesOptions}
                      placeholder="Niveau d'enseignement"
                      onChange={(selectedOption) => handleFilterChange('niveauEtudes', selectedOption.value)}
                      value={niveauEtudesOptions.find((option) => option.value === filters.niveauEtudes)}
                    />
                  </Form.Group>
                  {['L1', 'L2', 'L3', 'M1', 'M2'].includes(filters.niveauEtudes) && (
                    <Form.Group>
                      <Form.Control
                        type="text"
                        placeholder="Spécialité"
                        value={filters.specialiteEnseigne}
                        onChange={(e) => handleFilterChange('specialiteEnseigne', e.target.value)}
                      />
                    </Form.Group>
                  )}
                </>
              )}
              {filters.typeEtudes === 'continue' && (
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Nom du Parcours"
                    value={filters.nomFormation}
                    onChange={(e) => handleFilterChange('nomFormation', e.target.value)}
                  />
                </Form.Group>
              )}
            </>
          )}

          {filters.role === 'teacher' && (
            <>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Matières enseignées"
                  value={filters.matieresEnseignees}
                  onChange={(e) => handleFilterChange('matieresEnseignees', e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Select
                  isMulti
                  options={niveauEnseigneOptions}
                  placeholder="Niveau(x) enseigné(s)"
                  onChange={(selectedOptions) =>
                    handleFilterChange('niveauEnseigne', selectedOptions.map((option) => option.value))
                  }
                   styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  borderColor: state.isFocused ? '#0066cc' : '#ced4da',
                  borderRadius: '20px',
                  height: '45px', // Reduced height
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: '#0056b3',
                  },
                }),
                placeholder: (baseStyles) => ({
                  ...baseStyles,
                  color: '#6c757d',
                  fontSize: '14px', // Slightly smaller font size
                }),
                multiValue: (baseStyles) => ({
                  ...baseStyles,
                  backgroundColor: '#e9ecef',
                  borderRadius: '10px',
                }),
                menu: (baseStyles) => ({
                  ...baseStyles,
                  borderRadius: '20px',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                }),
                option: (baseStyles, state) => ({
                  ...baseStyles,
                  backgroundColor: state.isFocused ? '#f8f9fa' : 'white',
                  color: '#495057',
                  '&:active': {
                    backgroundColor: '#0066cc',
                    color: 'white',
                  },
                }),
              }}
                  value={niveauEnseigneOptions.filter((option) =>
                    filters.niveauEnseigne.includes(option.value)
                  )}
                />
              </Form.Group>
              {filters.niveauEnseigne.includes('Université') && (
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Spécialité Enseignée"
                    value={filters.specialiteEnseigne}
                    onChange={(e) => handleFilterChange('specialiteEnseigne', e.target.value)}
                  />
                </Form.Group>
              )}
            </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>

        <Button variant="primary" style={{
                width: "100%",
                height: "52px",
                backgroundColor: "#007bff",
                borderColor: "#007bff",
              }}
              onClick={applyFilters}>
          Appliquer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserFilterModal;
