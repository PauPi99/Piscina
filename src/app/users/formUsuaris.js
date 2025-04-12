import React, { useState } from 'react';

export default function FormulariUsuari({ handleCreate, errors }) {
  const [formData, setFormData] = useState({
    nom: '',
    cognoms: '',
    preu: '',
    dni: '',
    numCarnet: '',
    email: '',
    dataNaixement: '',
    tipus: 'NORMAL',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreate(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="nom">Nom</label>
        <input
          type="text"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
        />
        {errors.nom?._errors && <p className="text-sm text-red-500">{errors.nom._errors[0]}</p>}
      </div>

      <div>
        <label htmlFor="cognoms">Cognoms</label>
        <input
          type="text"
          name="cognoms"
          value={formData.cognoms}
          onChange={handleChange}
        />
        {errors.cognoms?._errors && <p className="text-sm text-red-500">{errors.cognoms._errors[0]}</p>}
      </div>

      <div>
        <label htmlFor="preu">Preu</label>
        <input
          type="text"
          name="preu"
          value={formData.preu}
          onChange={handleChange}
        />
        {errors.preu?._errors && <p className="text-sm text-red-500">{errors.preu._errors[0]}</p>}
      </div>

      <div>
        <label htmlFor="dni">DNI</label>
        <input
          type="text"
          name="dni"
          value={formData.dni}
          onChange={handleChange}
        />
        {errors.dni?._errors && <p className="text-sm text-red-500">{errors.dni._errors[0]}</p>}
      </div>

      <div>
        <label htmlFor="numCarnet">Num Carnet</label>
        <input
          type="text"
          name="numCarnet"
          value={formData.numCarnet}
          onChange={handleChange}
        />
        {errors.numCarnet?._errors && <p className="text-sm text-red-500">{errors.numCarnet._errors[0]}</p>}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email?._errors && <p className="text-sm text-red-500">{errors.email._errors[0]}</p>}
      </div>

      <div>
        <label htmlFor="dataNaixement">Data de Naixement</label>
        <input
          type="date"
          name="dataNaixement"
          value={formData.dataNaixement}
          onChange={handleChange}
        />
        {errors.dataNaixement?._errors && <p className="text-sm text-red-500">{errors.dataNaixement._errors[0]}</p>}
      </div>

      <div>
        <label htmlFor="tipus">Tipus</label>
        <select name="tipus" value={formData.tipus} onChange={handleChange}>
          <option value="NORMAL">Normal</option>
          <option value="INFANTIL">Infantil</option>
          <option value="AQUAGYM">Aquagym</option>
          <option value="INFANTIL_NATACIO">Infantil Natació</option>
        </select>
        {errors.tipus?._errors && <p className="text-sm text-red-500">{errors.tipus._errors[0]}</p>}
      </div>

      <button type="submit">Crear Usuari</button>
    </form>
  );
}
