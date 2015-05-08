
export default {
  expansions: {

    // Matches natural numbers (0, 1, 2...).
    '$number:natural': {
      $is: 'number:integer',
      $gte: 0
    }

  }
}
