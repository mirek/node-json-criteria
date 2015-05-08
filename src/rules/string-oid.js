
export default {
  expansions: {

    // Matches ObjectId string.
    '$string:oid': {
      $type: 'string',
      $regex: /^[0-9A-Fa-f]{24}$/
    }

  }
}
