// import { apiAuthenticated } from '@/api/index.ts';
import axios from 'axios';

export const queryPosition = async (fen: string) => {
  return await axios.get(`http://127.0.0.1:3001/pos?fen=${fen}`);
};
