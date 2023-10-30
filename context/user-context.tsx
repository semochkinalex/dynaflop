import { createContext } from 'react';
import { IUser } from '../utils/types';

export const UserContext = createContext<[null | IUser, (a: any) => void]>([null, () => {}]);

