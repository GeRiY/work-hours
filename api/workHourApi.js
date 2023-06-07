
export function getWorkHours(){
  const workHours = JSON.parse(localStorage.getItem('workHours'));
  if (workHours) {
    return Array.isArray(workHours) ? workHours : [workHours];
  }
  return [];
}

export function getWorkHourById(id){
  try {
    const workHours = getWorkHours();
    return workHours.filter(workHour => workHour.id === id)[0];
  } catch (err) {
    console.error(err)
  }
  return false;
}

export function addWorkHours(workHour){
  try {
    let workHours = getWorkHours();
    if(!workHours){
      workHours = [];
    }
    workHour.id = getLastId()+1;
    workHours.push(workHour);
    localStorage.setItem('workHours', JSON.stringify(workHours));
    return true;
  } catch (err) {
    console.error(err);
  }
  return false;
}

export function setWorkHourById(workHour){
  try {
    const workHours = getWorkHours();
    const index = workHours.findIndex(workHourItem => workHourItem.id === workHour.id);
    workHours[index] = workHour;
    localStorage.setItem('workHours', JSON.stringify(workHours));
    return true;
  } catch (err) {
    console.error(err);
  }
  return false;
}

function getLastId(){
  try {
    const workHours = getWorkHours();
    if(workHours){
      workHours.sort((a,b) => {
        if(a.id < b.id){
          return true;
        }
      });
      return workHours[workHours.length-1].id ? workHours[workHours.length-1].id : 0;
    }
    return 0;
  } catch (err) {
    console.error(err);
  }
  return false;
}

export async function removeWorkHourById(id){
  try {
    const workHours = getWorkHours();
    const newWorkHours = workHours.filter(workHour => workHour.id !== id);
    localStorage.setItem('workHours', JSON.stringify(newWorkHours));
    return true;
  } catch (err) {
    console.error(err);
  }
  return false;
}
