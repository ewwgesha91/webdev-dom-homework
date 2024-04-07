export const currentDate = (date) => {
  let day = String(date.getDate()).padStart(2, "0");
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let year = String(date.getFullYear() - 2000);
  let hour = String(date.getHours()).padStart(2, "0");
  let minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}.${month}.${year} ${hour}:${minutes}`;
};
