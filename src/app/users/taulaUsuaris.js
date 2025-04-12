import React from 'react';

const TaulaUsuaris = ({ usuaris }) => {
  return (
    <table className="min-w-full table-auto">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Cognoms</th>
          <th>Preu</th>
          <th>DNI</th>
          <th>Num Carnet</th>
          <th>Email</th>
          <th>Data Naixement</th>
          <th>Tipus</th>
        </tr>
      </thead>
      <tbody>
        {usuaris.map((usuari, index) => (
          <tr key={`${usuari.numCarnet}-${index}`}>
            <td>{usuari.nom}</td>
            <td>{usuari.cognoms}</td>
            <td>{usuari.preu}</td>
            <td>{usuari.dni}</td>
            <td>{usuari.numCarnet}</td>
            <td>{usuari.email}</td>
            <td>{usuari.dataNaixement}</td>
            <td>{usuari.tipus}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TaulaUsuaris;
