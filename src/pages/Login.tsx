import React from 'react';

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-[449px]">
      <div className="p-8 rounded-lg shadow-lg w-full max-w-md" style={{ backgroundColor: '#343639' }}>
        <h2
          className="text-[36px] font-bold text-center mb-8"
          style={{ fontFamily: 'Inter, sans-serif', color: '#EC9E67' }}
        >
          Connexion
        </h2>

        <form>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="email"></label>
            <input
              type="email"
              id="email"
              className="w-[286px] h-[37px] px-4 py-2 rounded-lg text-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="E-mail"
              style={{ backgroundColor: '#494A4C' }}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="password"></label>
            <input
              type="password"
              id="password"
              className="w-[286px] h-[37px] px-4 py-2 rounded-lg text-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Mot de passe"
              style={{ backgroundColor: '#494A4C' }}
            />
          </div>

          <div className="flex justify-between items-center text-[12px] ">
            <a href="#" className="text-sm text-white hover:text-gray-300">
              Mot de passe oublié ?
            </a>
            <button
              type="submit"
              className="w-[138px] h-[32px] hover:bg-orange-600 text-black font-bold py-2 px-4 rounded-lg transition duration-300"
              style={{ backgroundColor: '#EC9E67' }}
            >
              Connexion
            </button>
          </div>
        </form>
        <div className="text-[12px] text-center text-white">
          Pas encore de compte ?{' '}
          <a href="/register" className="text-white underline hover:text-orange-600">
            Inscription
          </a>
        </div>
        <div className="flex items-center justify-center mt-6">
          <div className="flex-grow border-t border-white"></div>
          <span className="text-white mx-4">ou avec</span>
          <div className="flex-grow border-t border-white"></div>
        </div>

        <div className="flex justify-center mt-4 space-x-4 text-white p-4">
          <button
            className="w-[178px] h-[37px] p-2 rounded-full hover:bg-gray-600 flex justify-start items-center space-x-2"
            style={{ backgroundColor: '#494A4C' }}
          >
            <img src="src/assets/icons/lichess.png" alt="Lichess" className="w-8 h-8" />
            <span className="text-white">Lichess</span>
          </button>

          <button
            className="w-[178px] h-[37px] p-2 rounded-full hover:bg-gray-600 flex justify-start items-center space-x-2"
            style={{ backgroundColor: '#494A4C' }}
          >
            <img src="src/assets/icons/chess_logo.png" alt="Chess.com" className="w-8 h-8" />
            <span className="text-lime-600">chess.com</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
