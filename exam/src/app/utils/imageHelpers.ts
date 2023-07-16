import { environment } from 'src/environments/environment.development';

export function decodeBuffer(data: { data: [] }) {
  const uint = new Uint8ClampedArray(data.data);
  const decoder = new TextDecoder('utf-8');
  const img = decoder.decode(uint);
  return environment.REST_API + '/' + img;
}
