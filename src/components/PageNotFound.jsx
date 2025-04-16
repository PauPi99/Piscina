const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
        <p className="text-2xl text-gray-800 mb-6">Pàgina no trobada</p>
        <p className="text-lg text-gray-600 mb-4">
          Sembla que el token no està disponible. Si us plau, inicia sessió per continuar.
        </p>
        <a
          href="/login"
          className="mt-4 inline-block px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition"
        >
          Anar a Login
        </a>
      </div>
    </div>
  );
};

export default NotFound;
