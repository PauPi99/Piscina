import React from 'react';

const TaulaUsuaris = ({ usuaris }) => {
  return (
    <table className="min-w-full table-auto">
      <thead>
        <tr>
        <th>Data Creació</th>
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
        {usuaris.map((usuari) => (
          <tr key={usuari.id}>
            <td>
              {new Date(usuari.dataAlta).toLocaleString('ca-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })}
            </td>
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
