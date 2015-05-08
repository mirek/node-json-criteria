
export default {
  expansions: {

    // Matches ISO date strings.
    '$strftime:iso': {
      $strftime: '%Y-%m-%dT%H:%M:%S%Z'
    }

  }
}
