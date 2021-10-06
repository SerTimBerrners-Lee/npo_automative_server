
const dt = new Date()
export const date = () => {
  const date = 
    dt.toISOString()
      .slice(0,10)
      .split('-')
      .reverse()
      .join('.')

  return date
}

export const hours = dt.getUTCHours() + 3;
export const minute = dt.getMinutes().toString().length == 1 ? '0' + dt.getMinutes() : dt.getMinutes();
export const seconds = dt.getSeconds().toString().length == 1 ? '0' + dt.getSeconds() : dt.getSeconds();

export const time = () => `${hours}:${minute}:${seconds}`;
