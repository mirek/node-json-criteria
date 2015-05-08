
export default {
  expansions: {

    // Matches hex string.
    '$hex': {
      $type: 'string',
      $regex: /^[0-9A-Fa-f]+$/
    }

  }
}
