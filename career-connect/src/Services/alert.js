import Swal from 'sweetalert2'

// Sweetalert2 is styled to match the dark theme of the app.
const theme = {
  background: '#171717',
  color: '#e5e5e5',
  confirmButtonColor: '#facc15',
  confirmButtonTextColor: '#000000',
  cancelButtonColor: '#404040',
  iconColor: '#facc15',
  toastIconColor: '#facc15',
}

export function showSuccess(title, text = '') {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    ...theme,
  })
}

export function showError(title, text = '') {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonText: 'Close',
    ...theme,
  })
}

export function showInfo(title, text = '') {
  return Swal.fire({
    icon: 'info',
    title,
    text,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    ...theme,
  })
}
