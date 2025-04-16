import React from 'react';

const TaulaUsuaris = ({ usuaris, totalUsuaris }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl relative">
      <header className="px-5 py-4">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Usuaris <span className="text-gray-400 dark:text-gray-500 font-medium">{usuaris.length}  Total: {totalUsuaris}</span>
        </h2>
      </header>
      <div className="overflow-x-auto">
        <table className="table-auto w-full dark:text-gray-300">
          <thead className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20 border-t border-b border-gray-100 dark:border-gray-700/60">
            <tr>
              <th className="px-2 py-3 text-left font-semibold">Data Creació</th>
              <th className="px-2 py-3 text-left font-semibold">Nom</th>
              <th className="px-2 py-3 text-left font-semibold">Cognoms</th>
              <th className="px-2 py-3 text-left font-semibold">Preu</th>
              <th className="px-2 py-3 text-left font-semibold">DNI</th>
              <th className="px-2 py-3 text-left font-semibold">Num Carnet</th>
              <th className="px-2 py-3 text-left font-semibold">Email</th>
              <th className="px-2 py-3 text-left font-semibold">Data Naixement</th>
              <th className="px-2 py-3 text-left font-semibold">Tipus</th>
              <th className="px-2 py-3 text-left font-semibold">Accions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
            {usuaris.map((usuari) => (
              <tr key={usuari.id}>
                <td className="px-2 py-3">
                  {new Date(usuari.dataAlta).toLocaleString('ca-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}
                </td>
                <td className="px-2 py-3">{usuari.nom}</td>
                <td className="px-2 py-3">{usuari.cognoms}</td>
                <td className="px-2 py-3">{usuari.preu}</td>
                <td className="px-2 py-3">{usuari.dni}</td>
                <td className="px-2 py-3">{usuari.numCarnet}</td>
                <td className="px-2 py-3">{usuari.email}</td>
                <td className="px-2 py-3">
                  {new Date(usuari.dataNaixement).toLocaleString('ca-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-2 py-3">{usuari.tipus}</td>
                <td className="px-2 py-3">
                  <button className="text-blue-500 hover:underline text-sm">Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaulaUsuaris;
