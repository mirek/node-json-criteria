export default {
  expansions: {

    // Matches Extended JSON ObjectId.
    '$ext:oid': {
      $type: 'object',
      $keys: [ '$oid' ],
      ' $oid': {
        $is: 'string:oid'
      }
    }

  }
}
