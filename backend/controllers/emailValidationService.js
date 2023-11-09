// emailValidationService.js

// Bu örnekte, e-posta adreslerinin benzersizliğini kontrol etmek için basit bir veri yapısı kullanılıyor. Gerçek bir uygulama için veritabanına erişim kullanmanız gerekebilir.
const uniqueEmails = new Set();

// E-posta adresinin benzersizliğini kontrol eden fonksiyon
const checkIfEmailExists = (email) => {
  if (uniqueEmails.has(email)) {
    return true; // E-posta adresi başka bir kullanıcı tarafından kullanılıyor
  }
  return false; // E-posta adresi benzersiz
};

module.exports = {
  checkIfEmailExists,
};
