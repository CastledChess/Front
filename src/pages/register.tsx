export const Register = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 rounded-lg shadow-lg w-full max-w-md" style={{ backgroundColor: '#343639' }}>
        <h2 className="text-center mb-8 font-bold" style={{ color: '#EC9E67', fontSize: '36px' }}>
          Inscription
        </h2>

        <form>
          {/* Champ pour l'e-mail */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="email"></label>
            <input
              type="email"
              id="email"
              className="rounded-lg text-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="E-mail"
              style={{ width: '287px', height: '36px', backgroundColor: '#494A4C', padding: '0 16px' }}
            />
          </div>

          {/* Champ pour le nom d'utilisateur */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="username"></label>
            <input
              type="text"
              id="username"
              className="rounded-lg text-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Nom d'utilisateur"
              style={{ width: '287px', height: '36px', backgroundColor: '#494A4C', padding: '0 16px' }}
            />
          </div>

          {/* Champ pour le mot de passe */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="password"></label>
            <input
              type="password"
              id="password"
              className="rounded-lg text-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Mot de passe"
              style={{ width: '287px', height: '36px', backgroundColor: '#494A4C', padding: '0 16px' }}
            />
          </div>

          {/* Champ pour la confirmation du mot de passe */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="confirmPassword"></label>
            <input
              type="password"
              id="confirmPassword"
              className="rounded-lg text-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Confirmer le mot de passe"
              style={{ width: '287px', height: '36px', backgroundColor: '#494A4C', padding: '0 16px' }}
            />
          </div>

          <div className="flex justify-between items-center mb-4">
            <a href="#" className="text-sm text-white hover:text-gray-300">
              Mot de passe oublié ?
            </a>
            <button
              type="submit"
              className="text-black font-bold rounded-lg transition duration-300"
              style={{
                backgroundColor: '#EC9E67',
                width: '138px',
                height: '34px',
              }}
            >
              Inscription
            </button>
          </div>

          <p className="text-gray-400 text-xs mt-4">
            En vous inscrivant, vous acceptez les Conditions d&apos;utilisation et la Politique de confidentialité,
            notamment l&apos;utilisation des cookies.
          </p>
        </form>

        <div className="mt-6 text-center text-white">
          Déjà inscrit ?{' '}
          <a href="/login" className="text-white underline hover:text-orange-600">
            Connexion
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
