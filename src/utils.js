
export function* kvs (a) {
  for (let k of Object.keys(a)) {
    if (a.hasOwnProperty(k)) {
      yield [k, a[k]]
    }
  }
}
