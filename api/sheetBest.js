import axios from "axios"
import {addWorkHours, getWorkHours} from "./workHourApi";
import {addWorkTypes, getWorkTypes} from "./workTypeApi";
const baseUrl = 'https://sheet.best/api/sheets/b360fdf0-8473-47f3-b3c6-95b24a8dd449';
/*let config = {
  method: 'get',
  url: 'https://sheet.best/api/sheets/3e79148e-f99a-4405-9ac7-2e204c6c4dee',
  headers: {
    'Content-Type': 'application/json'
  },
  data: ""
};*/

export const getDataFromSheet = async (tabName = null) => {
  if(tabName === 'workType'){
    return getWorkTypes();
    /*return {data: [
      {id: 0, name: 'Piacozás', hourlyPrice: 5000},
      {id: 1, name: 'Traktorozás', hourlyPrice: 4000},
      {id: 2, name: 'Egyéb', hourlyPrice: 1000}
    ]};*/
  }
  if(!tabName){
    return getWorkHours();
  }
  return [];
  /*let config = {
    method: 'get',
    url: 'https://sheet.best/api/sheets/b360fdf0-8473-47f3-b3c6-95b24a8dd449',
    headers: {
      'Content-Type': 'application/json'
    },
    data: ""
  };
  config.data = {};
  config.method = "get"
  if (tabName) {
    config.url = config.url + "/tabs/" + tabName;
  }
  else {
    config.url = baseUrl;
  }
  return await axios(config);*/
}

export const insertDataToSheet = async (jsonData, tabName = null) => {
  switch (tabName){
    case 'workType':
      return addWorkTypes(jsonData);
      break
    case 'workHour':
      return addWorkHours(jsonData);
      break
    default:
      console.info('insertDataToSheet')
      console.error('Nincs ilyen tábla név.',tabName)
      break;
  }

  /*let config = {
    method: 'get',
    url: 'https://sheet.best/api/sheets/b360fdf0-8473-47f3-b3c6-95b24a8dd449',
    headers: {
      'Content-Type': 'application/json'
    },
    data: ""
  };
  config.data = JSON.stringify(jsonData);
  config.method = "post"
  if (tabName) {
    config.url = config.url + "/tabs/" + tabName;
  }
  else {
    config.url = baseUrl;
  }
  return await axios(config);*/
}


