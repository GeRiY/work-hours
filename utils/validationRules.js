export const checkOnlyNumber = (value) => {
  if( value.length){
    return !isNaN(parseInt(value)) || "Csak számot lehet megadni!";
  }
  return true;
}
export const checkRequired = (val) => val.length > 0 || 'Kötelező megadni!';

