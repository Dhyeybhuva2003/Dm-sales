import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

export const notifyDone = (message) => toast.success(message);

export const notifyErorr = (message) => toast.error(message);