
export function getWorkTypes(){
  const workTypes = JSON.parse(localStorage.getItem('workTypes'));
  return workTypes ?? [];
}

export function getWorkTypeById(id){
  try {
    const workTypes = JSON.parse(localStorage.getItem('workTypes'));
    return workTypes.filter(workType => workType.id === id)[0];
  } catch (err) {
    console.error(err)
  }
  return false;
}

export function addWorkTypes(workType){
  try {
    let workTypes = JSON.parse(localStorage.getItem('workTypes'));
    if(!workTypes){
      workTypes = [];
    }
    workType.id = getLastId()+1;
    workTypes.push(workType);
    localStorage.setItem('workTypes', JSON.stringify(workTypes));
    return true;
  } catch (err) {
    console.error(err);
  }
  return false;
}

export function setWorkTypeById(workType){
  try {
    const workTypes = JSON.parse(localStorage.getItem('workTypes'));
    workTypes.forEach(workTypeItem => {
      if(workTypeItem.id === workType.id){
        workTypeItem = workType;
      }
    })
    localStorage.setItem('workTypes', JSON.stringify(workTypes));
    return true;
  } catch (err) {
    console.error(err);
  }
  return false;
}

function getLastId(){
  try {
    const workTypes = JSON.parse(localStorage.getItem('workTypes'));
    if(workTypes){
      workTypes.sort((a,b) => {
        if(a.id < b.id){
          return true;
        }
      });
      return workTypes[workTypes.length-1].id ? workTypes[workTypes.length-1].id : 0;
    }
    return 0;
  } catch (err) {
    console.error(err);
  }
  return false;
}

export async function removeWorkTypeById(id){
  try {
    const workTypes = JSON.parse(localStorage.getItem('workTypes'));
    const newWorkTypes = workTypes.filter(workType => workType.id !== id);
    localStorage.setItem('workTypes', JSON.stringify(newWorkTypes));
    return true;
  } catch (err) {
    console.error(err);
  }
  return false;
}
