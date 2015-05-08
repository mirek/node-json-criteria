
export default {
  expansions: {

    // Matches e-mail string.
    $email: {
      $type: 'string',
      $regex: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
    }

  }
}
