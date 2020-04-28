module.exports = function validateFacebookLogin(data) {
  let errors = {};
  console.log(data.isLogged == 'true')
  
  // Email checks
  if (!data.isLogged) {
    errors.isLogged = "L'utilisateur n'est pas connecté";
  }
  return { errors }
};