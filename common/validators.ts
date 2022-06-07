export const validateAge = (birthday: Date) => {
  const date = new Date();
  const ageDifMs = date.getTime() - birthday.getTime();
  const ageDate = new Date(ageDifMs);
  const age = Math.abs(ageDate.getUTCFullYear() - 1970);
  if (age < 18) {
    return false;
  }
  return true;
};
