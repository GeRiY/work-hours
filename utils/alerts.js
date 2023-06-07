
export function newAlert(type = 'success', text = 'Sikeres felvitel', needCloseButton = true, duration = 2000){
  return { type, text, duration, needCloseButton };
}
