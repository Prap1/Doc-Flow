import { toast, ToastContainer } from 'react-toastify';

export function showToast(message, type = 'success') {
  if (type === 'success') {
    toast.success(message);
  } else if (type === 'error') {
    toast.error(message);
  } else if (type === 'warn') {
    toast.warn(message);
  } else {
    toast.info(message);
  }
}

export function Toaster() {
  return (
    <ToastContainer 
      position="bottom-right"
      theme="dark"
      autoClose={3500}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
}
