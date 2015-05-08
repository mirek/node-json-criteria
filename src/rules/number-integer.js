
export default {
  expansions: {

    // Matches integer numbers (..., -2, -1, 0, 1, 2, ...)
    '$number:integer': {
      $type: 'number',
      $mod: [ 1, 0 ]
    }

  }
}
