// TODO: replace with authenticatedApi once POC is migrated on main api
import axios from 'axios';

export const queryPosition = async (fen: string) => {
  return await axios.get(`http://localhost:3001/pos?fen=${fen}`);
};
