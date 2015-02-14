
function strsplice (a, i, n, b) {
  return a.slice(0, i) + (b || '') + str.slice(i + n)
}

let fmt = {

  // Day
  '%a': /(Sun|Mon|Tue|Wed|Thu|Fri|Sat)/,
  '%A': /(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)/,
  '%d': /(0[1-9]|[12][0-9]|3[01])/, // 01..31
  '%e': /( [1-9]|[12][0-9]|3[01])/, // _1..31
  '%j': /([0-2][0-9]{2}|3[0-5][0-9]|36[0-6])/,
  '%u': /([1-7])/, // 1..7
  '%w': /(0-6)/, // 0..6

  // Week
  '%U': /(0[0-9]|[1-4][0-9]|5[0-3])/, // 00..53
  '%V': /(0[1-9]|[1-4][0-9]|5[0-3])/, // 01..53
  '%W': /(0[0-9]|[1-4][0-9]|5[0-3])/, // 00..53

  // Month
  '%b': /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/,
  '%B': /(January|February|March|April|May|June|July|August|September|October|November|December)/,
  '%h': /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/,
  '%m': /(0[1-9]|1[0-2])/, // 01..12

  // Year
  '%C': /([0-9]{2})/, // 00..99
  '%g': /([0-9]{2})/, // 00..99
  '%G': /([0-9]{4})/, // 0000..9999
  '%y': /([0-9]{2})/, // 00..99
  '%Y': /([0-9]{4})/, // 0000..9999

  // Time
  '%H': /(0[0-9]|1[0-9]|2[0-3])/, // 00..23
  '%k': /( [0-9]|1[0-9]|2[0-3])/, // _0..23
  '%I': /(0[1-9]|1[0-2])/, // 01..12
  '%l': /( [1-9]|1[0-2])/, // _1..12
  '%M': /([0-5][0-9])/, // 00..59
  '%p': /(AM|PM)/,
  '%P': /(am|pm)/,
  '%r': '%I:%M:%S %p',
  '%R': '%H:%M',
  '%S': /([0-5][0-9])/,
  '%T': /%H:%M:%S/,
  '%X': /%H:%M:%S/,
  '%z': /([+-][0-9]{4}|)/,
  '%Z': /([A-Z]+)/,

  // Time and Date Stamps
  // %c not supported.
  '%D': '%m/%d/%y',
  '%F': '%Y-%m-%d',
  '%s': /([0-9]+)/,
  // %x not supported.

  // Misc
  '%n': /\n/,
  '%t': /\t/,
  '%%': /\%/
}

// Maximum format string length.
let max = 1023

function test_ (f, d) {
  let r = false

  let i = 0
  let j = 0
  let err = null

  if (typeof(f) === 'string' && typeof(d) === 'string' && f.length < max) {
    r = true
    while (r && i < f.length && j < d.length) {
      if (f[i] === '%') {
        let t = f.substr(i, 2)
        // console.log('t', t, f, i)
        let u = fmt[t]
        if (u) {
          if (typeof(u) === 'string') {

            // fmt rule is a string, expand, ie. '%F' -> '%Y-%m-%d'.
            f = strsplice(f, 0, 2, u)
          } else {
            let m = d.substr(j).match(fmt[t])
            if (m) {
              // console.log('matched', t)
              i += 2; j += m[0].length
            } else {
              [ err, r ] = [ new Error(`invalid input for ${t}`), false ]
            }
          }
        } else {
          [ err, r ] = [ new Error(`unknown token ${t}`), false ]
        }
      } else {
        if (f[i] === d[j]) {
          // console.log('++', f[i])
          i++; j++
        } else {
          [ err, r ] = [ new Error(`direct match failed ${f[i]} != ${d[j]}`), false ]
        }
      }
    }
    if (r) {
      if (i !== f.length) {
        [ err, r ] = [ new Error(`invalid extras`), false ]
      }
      if (j !== d.length) {
        [ err, r ] = [ new Error(`not fully matched`), false ]
      }
    }
  }

  return [ err, r, i, j ]
}

export function test (a, b) {
  let [ err, r, i, j ] = test_(a, b)
  return r
}
