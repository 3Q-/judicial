
export const ERR_OK = 0;

export function param(data){
  if (!data) return '';
  let url = '';
  for (var k in data){
    let value = data[k] !== undefined ? data[k] : '';
    url += '&' + k + '=' + encodeURIComponent(value);
  }
  return url ? url.substring(1) : '';
}

export const context = '/bigdata/api/';
