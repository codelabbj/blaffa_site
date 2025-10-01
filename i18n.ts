import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // General translations
      "Secure 256-bit SSL encryption": "Secure 256-bit SSL encryption",

      //Left side Content
      "Secure Global Payments": "Secure Global Payments",
      "Fast, secure transactions with real-time tracking": "Fast, secure transactions with real-time tracking",
      "Bank-level Security": "Bank-level Security",
      "Simple Payments": "Simple Payments",
      "Mobile Money": "Mobile Money",
      "Simple Payment": "Simple Payment",
      "Mobile Integration": "Mobile IIntegration",
      "Processing Time": "Processing Time",
      "24/7 Support": "24/7 Support",
      "Your trusted partner for secure transactions": "Your trusted partner for secure transactions",
      "Available": "Available",
      "Transaction Smoothness": "Transaction Smoothness",
      "© 2025 Blaffa. All rights reserved .": "© 2025 blaffa. All rights reserved .",


      
      // Dashboard Header translations
      "Welcome to our amazing platform" : "Welcome to our amazing platform",
      "Discover incredible opportunities" : "Discover incredible opportunities",
      "DEPOSIT": "DEPOSIT",
      "WITHDRAW": "WITHDRAW",
      "Transaction History": "Transaction History",
      "Hello": "Hello",

      "theme":"theme",

      // AuthForm translations
      "Welcome to Blaffa": "Welcome to Blaffa",
      "Login": "Login",
      "Register": "Register",
      "Full Name": "Full Name",
      "Enter your full name": "Enter your full name",
      "Email": "Email",
      "Enter your email address": "Enter your email address",
      "Phone": "Phone",
      "Enter your phone number": "Enter your phone number",
      "Email or Phone": "Email or Phone",
      "Enter your email or phone": "Enter your email or phone",
      "Password": "Password",
      "Enter your password": "Enter your password",
      "Confirm Password": "Confirm Password",
      "Confirm your password": "Confirm your password",
      "Forgot Password?": "Forgot Password?",
      "Sign In": "Sign In",
      "Invalid email or phone number": "Invalid email or phone number",
      "Invalid email address": "Invalid email address",
      "Invalid phone number": "Invalid phone number",
      "The password must include at least one uppercase letter, one lowercase letter, one digit, and be at least 6 characters long.": "The password must include at least one uppercase letter, one lowercase letter, one digit, and be at least 6 characters long.",
      "Passwords do not match": "Passwords do not match",
      "Login successful! Redirecting to your dashboard...": "Login successful! Redirecting to your dashboard...",
      "Registration successful! Please login.": "Registration successful! Please login.",
      "An unexpected error occurred.": "An unexpected error occurred.",
      "if you cant see it check your Junk folder as well": "if you cant see it check your Junk folder as well",
      "Log in": "Log in",
      "Verify Code":"Verify Code",
      "Confirm New Password":"Confirm New Password",
      "OTP verified successfully":"OTP verified successfully",
      "Create a new password for your account":"Create a new password for your account",
      "if you cant see it check your Junk older as well":"if you cant see it check your Junk older as well",
      "Forgot Password":"Forgot Password",
      "Enter Verification Code":"Enter Verification Code",
      "We sent a code to your email. Please enter it below.":"We sent a code to your email. Please enter it below.",
      "Enter your email to receive a verification code":"Enter your email to receive a verification code",
      

      "Send Verification Code" : "Send Verification Code",
      "Back to Login": "Back to Login",

      "OTP has been sent to your email', 'if you cant see it check your Junk older as well":"OTP has been sent to your email', 'if you cant see it check your Junk older as well",
      


      // Profile Page translations
      "Profile": "Profile",
      "Edit your personal information here": "Edit your personal information here",
      "Loading profile...": "Loading profile...",
      "Personal Information": "Personal Information",
      "Danger Zone": "Danger Zone",
      "Back": "Back",
      "First Name": "First Name",
      "Last Name": "Last Name",
      "E-mail": "E-mail",
      "Mobile Number": "Mobile Number",
      "Update Details": "Update Details",
      "Reset Password": "Reset Password",
      "Add New Bet ID" : "Add New Bet ID",
      "App Name" : "App Name",
      "Select App" : "Select App",
      "Saved Bet IDs" : "Saved Bet IDs",
      "User Bet ID" : "User Bet ID",
      "Enter your bet ID" : "Enter your bet ID",
      "Add Bet ID" : "Add Bet ID",
      "No bet IDs saved yet" : "No bet IDs saved yet",
      "Note": "Note",
      "To update your password, enter the old password and the new one you want to use": "To update your password, enter the old password and the new one you want to use",
      "Old Password": "Old Password",
      "New Password": "New Password",
      "Details updated successfully!": "Details updated successfully!",
      "Failed to update details": "Failed to update details",
      "You must be logged in to update your details.": "You must be logged in to update your details.",
      "You must be logged in to change your password.": "You must be logged in to change your password.",
      "New password and confirm password do not match.": "New password and confirm password do not match.",
      "Password changed successfully!": "Password changed successfully!",
      "Failed to change password": "Failed to change password",
      "Delete My Account": "Delete My Account",
      "Delete Account": "Delete Account",
      "Delete Account Permanently": "Delete Account Permanently",
      "Are you sure you want to delete your account? This action cannot be undone.": "Are you sure you want to delete your account? This action cannot be undone.",
      "Account deleted successfully!": "Account deleted successfully!",
      "Warning": "Warning",
      "This action cannot be undone.": "This action cannot be undone.",
      "All your personal data will be permanently deleted.": "All your personal data will be permanently deleted.",
      "You will lose access to all your transactions and account history.": "You will lose access to all your transactions and account history.",
      "Type your email to confirm deletion": "Type your email to confirm deletion",
      "This action will permanently delete your account and all associated data. This cannot be undone.": "This action will permanently delete your account and all associated data. This cannot be undone.",
      "All account data will be immediately erased from our systems." : "All account data will be immediately erased from our systems.",
      "Use strong, unique passwords": "Use strong, unique passwords",
      "Update your password regularly" : "Update your password regularly",
      "History" : "History",
      "View All" : "View All",
      "MY ID": "MY ID",

      // Transaction History translations
      "No transactions found": "No transactions found",
      "You haven't made any transactions yet.":"You haven't made any transactions yet.",
      "Loading transactions...": "Loading transactions...", 
      "Failed to fetch transactions": "Failed to fetch transactions",
      "You must be logged in to view transactions.": "You must be logged in to view transactions.",
      "Failed to load transactions. Please try again.": "Failed to load transactions. Please try again.",
      
      "All": "All",
      "Deposits": "Deposits",
      "Withdraw": "Withdraw",
      "Sale": "Sale",
      "See more": "See more",
      "Transaction Details": "Transaction details",
      "Payment Method": "Payment Method",
      "For deposits": "For deposits",
      "Status": "Status",
      "Number": "Number",
      "Transaction Date": "Transaction Date",
      "Transaction ID": "Transaction ID",
      "Close": "Close",

      // Notification translations
      "Notifications": "Notifications",
      "No notifications found": "No notifications found",
      "Loading notifications...": "Loading notifications...",
      "Failed to fetch notifications": "Failed to fetch notifications",
      "You must be logged in to view notifications.": "You must be logged in to view notifications.",
      "Failed to load notifications. Please try again.": "Failed to load notifications. Please try again.",
      "Mark all as read": "Mark all as read",
      "Load more": "Load more",
      "Loading...": "Loading...",
      "Mark as read": "Mark as read",
      "Mark as unread": "Mark as unread",


      "Available Coupons": "Available Coupons",
      "No Coupons Available":"No Coupons Available",
      "Check back later!":"Check back later!",


      // Withdraw Page translations
      "Withdraw Funds":"Withdraw Funds",
      
      "Withdraw from your account": "Withdraw from your account",
      "Please fill in all fields": "Please fill in all fields",
      "Phone numbers do not match": "Phone numbers do not match",
      "Withdrawal request submitted successfully!": "Withdrawal request submitted successfully!",
      "Something went wrong. Please try again.": "Something went wrong. Please try again.",
      "Network error. Please check your connection and try again.": "Network error. Please check your connection and try again.",
     
      "Take Note": "Take Note",
      "The currency of your account must be in XOF": "The currency of your account must be in XOF",
      "CITY": "CITY",
      "STREET": "STREET",
      "ID": "ID",
      "Enter ID": "Enter ID",
      "Withdrawal Code": "Withdrawal Code",
      "Enter your withdrawal code": "Enter your withdrawal code",
      
      "Enter number": "Enter number",
      "Confirm Number": "Confirm Number",
      "Enter Confirm number": "Enter Confirm number",
      "Network": "Network",
      "Processing...": "Processing...",
      "Submit my request": "Submit my request",
      
      // New withdraw page translations
      "Amount": "Amount",
      "Enter amount to withdraw": "Enter amount to withdraw",
      "Transaction Summary": "Transaction Summary",
      "Amount to withdraw": "Amount to withdraw",
      "Fee": "Fee",
      "You will receive": "You will receive",
      "City": "City",
      "Street": "Street",
      "Remplissez les détails de votre pari": "Fill in your bet details",
      "Gérer vos IDs de pari": "Manage your bet IDs",
      "Ajouter un ID de pari": "Add a bet ID",
      "Vos IDs de pari enregistrés": "Your saved bet IDs",
      "Aucun ID de pari enregistré.": "No bet ID saved.",
      "Supprimer": "Delete",
      "Choisissez la plateforme de pari que vous souhaitez utiliser": "Choose the betting platform you want to use",
      "Aucune plateforme de pari trouvée": "No betting platform found",
      "Aucune plateforme de pari n'est disponible pour le moment.": "No betting platform is available at the moment.",
      "Choisissez votre réseau de paiement mobile": "Choose your mobile payment network",
      "Back to Platforms": "Back to Platforms",
      "Comment obtenir un code de retrait ?": "How to get a withdrawal code?",
      "Pourquoi le retrait échoue ?": "Why does withdrawal fail?",
      // "Back": "Back",

      //Deposit Page translations
      "Deposit Funds": "Deposit Funds",
      "Select Network":"Select Network",
      "Select Bet ID":"Select Bet ID",
      "Enter Details":"Enter Details",
      "Select Your Betting Platform":"Select Your Betting Platform",
     
      
      "Back to Bet IDs":"Back to Bet IDs",
      "Phone Number":"Phone Number",

      "Submit":"Submit",

      "Click to continue payment": "Click to continue payment",
      
      
      
      "Make deposits to your account": "Make deposits to your account",
      "Make your deposits to your account here": "Make your deposits to your account here",
      
      "IMPORTANT": "IMPORTANT",
      "Your account currency must be in XOF.": "Your account currency must be in XOF.",
      
      "Enter your ID": "Enter your ID",
      "Enter or select your betting app ID" : "Enter or select your betting app ID",
      "This is your 1xbet user ID": "This is your 1xbet user ID",
      "Enter your betting app ID or select from saved IDs." : "Enter your betting app ID or select from saved IDs.",
      "You are entering a new ID. Defaulting to 1xbet app." : "You are entering a new ID. Defaulting to 1xbet app.",
      "Saved IDs": "Saved IDs",
      "Selected App": "Select App id",
      "Betting App ID" : "Betting App ID",
      "Unknown App" : "Unknown ",
      // "Amount": "Amount",
      "Enter deposit amount": "Enter deposit amount",

      "Selected Bet ID":"Selected Bet ID",
      
      "Enter your mobile money number": "Enter your mobile money number",
      "Your mobile money number": "Your mobile money number",
      
      "Please select a network": "Please select a network",
      
      "Proceed": "Proceed",
      "Deposit successful! Transaction ID:": "Deposit successful! Transaction ID:",
      "Failed to load necessary data. Please try again later.": "Failed to load necessary data. Please try again later.",
      "Error fetching data:": "Error fetching data:",
      "Error processing deposit:": "Error processing deposit:",
      "Failed to process deposit. Please try again.": "Failed to process deposit. Please try again.",
      "You must be logged in to access this feature.": "You must be logged in to access this feature.",

      // Modal and Bet ID management translations
      "Confirmer l'ID de pari": "Confirmer l'ID de pari",
      "Confirm Bet ID": "Confirm Bet ID",
      "Nom de l'utilisateur": "Nom de l'utilisateur",
      "User Name": "User Name",
      "ID de pari": "ID de pari",
      "Bet ID": "Bet ID",
      "Appareil": "Appareil",
      "Device": "Device",
      "Annuler": "Annuler",
      "Cancel": "Cancel",
      "Confirmer": "Confirmer",
      "Confirm": "Confirm",
      "ID de pari invalide": "ID de pari invalide",
      "Invalid Bet ID": "Invalid Bet ID",
      "L'ID de pari est invalide ou n'existe pas.": "L'ID de pari est invalide ou n'existe pas.",
      "Bet ID is invalid or does not exist.": "Bet ID is invalid or does not exist.",
      "Échec de la validation de l'ID de pari. Veuillez réessayer.": "Échec de la validation de l'ID de pari. Veuillez réessayer.",
      "Failed to validate Bet ID. Please try again.": "Failed to validate Bet ID. Please try again.",
      "ID de pari ajouté avec succès !": "ID de pari ajouté avec succès !",
      "Bet ID added successfully!": "Bet ID added successfully!",
      "Fermer": "Fermer",
      
      "Failed to add bet ID": "Failed to add bet ID",

      "Veuillez sélectionner une application et saisir un ID de pari.": "Veuillez sélectionner une application et saisir un ID de pari.",
      "Please select an app and enter a bet ID.": "Please select an app and enter a bet ID.",
      "Vous devez être connecté pour ajouter un ID de pari.": "Vous devez être connecté pour ajouter un ID de pari.",
      "You must be logged in to add a bet ID.": "You must be logged in to add a bet ID.",
      "No account was found with the ID {{betid}}. Make sure it is spelled correctly and try again.": "No account was found with the ID {{betid}}. Make sure it is spelled correctly and try again.",
      "Transaction initiated successfully!": "Transaction initiated successfully!",

      // CryptoTransactionForm translations
      "Please verify your account to buy or sell crypto.": "Veuillez vérifier votre compte pour acheter ou vendre de la crypto.",
      "Buy or Sell": "Acheter ou Vendre",
      // "Select Network": "Sélectionnez le réseau",
      "Select a network": "Sélectionnez un réseau",
      "Public Amount": "Montant public",
      "Amount (Local Currency)": "Montant (monnaie locale)",
      "Enter amount": "Entrez le montant",
      "You will get": "Vous recevrez",
      "Phone number": "Numéro de téléphone",
      "Confirm phone number": "Confirmez le numéro de téléphone",
      "Continue": "Continuer",
      "Are you buying or selling?": "Achetez-vous ou vendez-vous ?",
      "Buy": "Acheter",
      "Sell": "Vendre",
      "Enter your wallet link": "Entrez le lien de votre portefeuille",
      "Wallet link": "Lien du portefeuille",
      "Confirm wallet link": "Confirmez le lien du portefeuille",
      "Confirm your transaction": "Confirmez votre transaction",
      // "Processing...": "Traitement...",
      // "Confirm": "Confirmer",
      "Sell Wallet Address": "Adresse de vente du portefeuille",
      "Copy": "Copier",
      "Send your crypto to this address to complete the sale.": "Envoyez votre crypto à cette adresse pour finaliser la vente.",
      "Your buy request has been submitted!": "Votre demande d'achat a été soumise !",
      "Please fill all fields and confirm your phone number.": "Veuillez remplir tous les champs et confirmer votre numéro de téléphone.",
      "Please select a network.": "Veuillez sélectionner un réseau.",
      "Wallet links do not match.": "Wallet links do not match.",
      "Transaction failed. Please try again.": "Transaction failed. Please try again.",
      "Please fill all fields.": "Please fill all fields.",
      "Please fill all fields and confirm your wallet link.": "Please fill all fields and confirm your wallet link.",
      "Back to Crypto": "Retour à la crypto",
      "Back to Cryptos": "Retour aux cryptos",

      // Account Verification Modal translations
      "Account Verification Required": "Vérification du compte requise",
      "Upload your image (face)": "Téléchargez votre image (visage)",
      "Upload your card image (ID card)": "Téléchargez l'image de votre carte (carte d'identité)",
      "Images uploaded. Please wait for admin verification.": "Images téléchargées. Veuillez attendre la vérification de l'administrateur.",
      "Failed to upload images. Try again.": "Échec du téléchargement des images. Réessayez.",
      "Uploading...": "Téléchargement...",
      "Upload & Submit": "Télécharger et soumettre",
      "Checking...": "Vérification...",
      "Verified": "Vérifié",
      "Not Verified": "Non vérifié",
      "Success": "Succès",

      // Buy/Sell modal translations
      "Choose Transaction Type": "Choose Transaction Type",
      "Buy Crypto": "Buy Crypto",
      "Sell Crypto": "Sell Crypto",
    },
  },
  fr: {
    translation: {
      // General translations
      "Secure 256-bit SSL encryption": "Chiffrement SSL 256 bits sécurisé",

      //Left side Content
      "Secure Global Payments": "Paiements mondiaux sécurisés",
      "Fast, secure transactions with real-time tracking": "Transactions rapides et sécurisées avec suivi en temps réel",
      "Bank-level Security": "Sécurité de niveau bancaire",
      "Mobile Money": "Argent mobile",
      "Simple Payment": "Paiement simple",
      "Mobile Integration": "Intégration mobile",
      "Payments made easy": "Paiements faciles",
      "24/7 Support": "Support 24/7",
      "Available": "Disponible",
      "Transaction Smoothness": "Fluidité de la transaction",
      "Processing Time": "Temps de traitement",
      "© 2025 Blaffa. All rights reserved .": "© 2025 Blaffa. Tous droits réservés.",
      "theme": "thème",


      // Dashboard Header translations

      "DEPOSIT": "DÉPOSER",
      "WITHDRAW": "RETIRER",
      "Transaction History": "Historique des transactions",
      "Logout": "Déconnexion",
      "Hello": "Bonjour",

      "History": "Historique",
      "View All": "Voir tout",
      "MY ID": "MON ID",

      //Hero
      "Welcome to our amazing platform" : "Bienvenue sur notre incroyable plateforme",
      "Discover incredible opportunities" : "Découvrez des opportunités incroyables",

      // AuthForm translations
      "Welcome to Blaffa": "Bienvenue sur Blaffa",
      "Login": "Connexion",
      "Register": "Inscription",
      "Full Name": "Nom complet",
      "Enter your full name": "Entrez votre nom complet",
      "Email": "Email",
      "Enter your email address": "Entrez votre adresse email",
      "Phone": "Téléphone",
      "Enter your phone number": "Entrez votre numéro de téléphone",
      "Email or Phone": "Email ou Téléphone",
      "Enter your email or phone": "Entrez votre email ou téléphone",
      "Password": "Mot de passe",
      "Enter your password": "Entrez votre mot de passe",
      "Confirm Password": "Confirmez le mot de passe",
      "Confirm your password": "Confirmez votre mot de passe",
      "Forgot Password?": "Mot de passe oublié ?",
      "Sign In": "Se connecter",
      "Invalid email or phone number": "Email ou numéro de téléphone invalide",
      "Invalid email address": "Adresse email invalide",
      "Invalid phone number": "Numéro de téléphone invalide",
      "The password must include at least one uppercase letter, one lowercase letter, one digit, and be at least 6 characters long.": "Le mot de passe doit inclure au moins une lettre majuscule, une lettre minuscule, un chiffre et comporter au moins 6 caractères.",
      "Passwords do not match": "Les mots de passe ne correspondent pas",
      "Login successful! Redirecting to your dashboard...": "Connexion réussie ! Redirection vers votre tableau de bord...",
      "Registration successful! Please login.": "Inscription réussie ! Veuillez vous connecter.",
      "An unexpected error occurred.": "Une erreur inattendue s'est produite.",
      "if you cant see it check your Junk folder as well": "si vous ne le voyez pas, vérifiez également votre dossier indésirable",
      "Log in": "Se connecter",

      "Verify Code":"Vérifier le code",
      "Confirm New Password":"Confirmez le nouveau mot de passe",
      "OTP verified successfully":"OTP vérifié avec succès",
      "Create a new password for your account":"Créez un nouveau mot de passe pour votre compte",
      "if you cant see it check your Junk older as well":"si vous ne le voyez pas, vérifiez également votre dossier indésirable",
      "Forgot Password":"Mot de passe oublié",
      "Enter Verification Code":"Entrez le code de vérification",
      "We sent a code to your email. Please enter it below.":"Nous avons envoyé un code à votre email. Veuillez l'entrer ci-dessous.",
      "Enter your email to receive a verification code":"Entrez votre email pour recevoir un code de vérification",
      
      "Send Verification Code":"Envoyer le code de vérification",
      "Back to Login":"Retour à la connexion",

      "OTP has been sent to your email', 'if you cant see it check your Junk older as well":"OTP a été envoyé à votre email', 'si vous ne le voyez pas, vérifiez également votre dossier indésirable",


      // Profile Page translations
      "Profile": "Profil",
      "Edit your personal information here": "Modifiez vos informations personnelles ici",
      "Loading profile...": "Chargement du profil...",
      "Personal Information": "Informations personnelles",
      "Danger Zone": "Zone de danger",
      "Back": "Retour",
      "First Name": "Prénom",
      "Last Name": "Nom",
      "E-mail": "E-mail",
      "Mobile Number": "Numéro de téléphone",
      "Update Details": "Mettre à jour les informations",
      "Reset Password": "Réinitialiser le mot de passe",
      "Add New Bet ID" : "Ajouter un nouvel identifiant de pari",
      "App Name" : "Nom de l'application",
      "Select App" : "Sélectionner l'application",
      "Saved Bet IDs" : "Identifiants de pari enregistrés",
      "User Bet ID" : "Identifiant de pari utilisateur",
      "Enter your bet ID" : "Saisir votre identifiant de pari",
      "Add Bet ID" : "Ajouter un identifiant de pari",
      "No bet IDs saved yet" : "Aucun identifiant de pari enregistré pour le moment",
      "Note": "Remarque",
      "To update your password, enter the old password and the new one you want to use": "Pour mettre à jour votre mot de passe, entrez l'ancien mot de passe et le nouveau que vous souhaitez utiliser",
      "Old Password": "Ancien mot de passe",
      "New Password": "Nouveau mot de passe",
      "Details updated successfully!": "Informations mises à jour avec succès !",
      "Failed to update details": "Échec de la mise à jour des informations",
      "You must be logged in to update your details.": "Vous devez être connecté pour mettre à jour vos informations.",
      "You must be logged in to change your password.": "Vous devez être connecté pour changer votre mot de passe.",
      "New password and confirm password do not match.": "Le nouveau mot de passe et la confirmation ne correspondent pas.",
      "Password changed successfully!": "Mot de passe changé avec succès !",
      "Failed to change password": "Échec du changement de mot de passe",
      "Delete My Account": "Supprimer mon compte",
      "Delete Account": "Supprimer compte",
      "Are you sure you want to delete your account? This action cannot be undone.": "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action ne peut pas être annulée.",
      "Account deleted successfully!": "Compte supprimé avec succès !",
      "Warning": "Avertissement",
      "This action cannot be undone.": "Cette action ne peut pas être annulée.",
      "Failed to delete account": "Échec de la suppression du compte",
      "You must be logged in to delete your account.": "Vous devez être connecté pour supprimer votre compte.",
      "You must be logged in to view your account details.": "Vous devez être connecté pour voir les détails de votre compte.",
      "All your personal data will be permanently deleted.": "Toutes vos données personnelles seront définitivement supprimées.",
      "You will lose access to all your transactions and account history.": "Vous perdrez l'accès à toutes vos transactions et à l'historique de votre compte.",
      "Type your email to confirm deletion": "Tapez votre email pour confirmer la suppression",
      "This action will permanently delete your account and all associated data. This cannot be undone.": "Cette action supprimera définitivement votre compte et toutes les données associées. Cela ne peut pas être annulé.",
      "All account data will be immediately erased from our systems." : "Toutes les données du compte seront immédiatement effacées de nos systèmes.",
      "Are you sure you want to delete your account?": "Êtes-vous sûr de vouloir supprimer votre compte ?",
      "Use strong, unique passwords": "Utilisez des mots de passe forts et uniques",
      "Update your password regularly" : "Mettez à jour votre mot de passe régulièrement",
      "Your password has been reset successfully!": "Votre mot de passe a été réinitialisé avec succès !",
      "Your password has been updated successfully!": "Votre mot de passe a été mis à jour avec succès !",
      "Your password has been updated successfully.": "Votre mot de passe a été mis à jour avec succès.",
      
      "Check back later!":"Revoyez plus tard !",
      "No Coupons Available":"Aucun coupon disponible",
      "Available Coupons":"Coupons disponibles",


      // Transaction History translations
      "No transactions found": "Aucune transaction trouvée",
      "You haven't made any transactions yet." : "Vous n'avez pas encore fait de transactions.",
      "Loading transactions...": "Chargement des transactions...",
      "Failed to fetch transactions": "Échec de la récupération des transactions",
      "You must be logged in to view transactions.": "Vous devez être connecté pour voir les transactions.",
      "Failed to load transactions. Please try again.": "Échec du chargement des transactions. Veuillez réessayer.",
      
      "All": "Tous",
      "Deposits": "Dépôts",
      "Withdraw": "Retrait",
      "Sale": "Vente",
      "See more": "Voir plus",
      "Transaction Details": "Détails de la transaction",
      "Payment Method": "Méthode de paiement",
      "For deposits": "Pour les dépôts",
      "Status": "Statut",
      "Number": "Numéro",
      "Transaction Date": "Date de la transaction",
      "Transaction ID": "ID de la transaction",
      "Close": "Fermer",

      // Notification translations
      "Notifications": "Notifications",
      "No notifications found": "Aucune notification trouvée",
      "Loading notifications...": "Chargement des notifications...",
      "Failed to fetch notifications": "Échec de la récupération des notifications",
      "You must be logged in to view notifications.": "Vous devez être connecté pour voir les notifications.",
      "Failed to load notifications. Please try again.": "Échec du chargement des notifications. Veuillez réessayer.",
      "Mark all as read": "Tout marquer comme lu",
      "Load more": "Charger plus",
      "Loading...": "Chargement...",
      "Mark as read": "Marquer comme lu",
      "Mark as unread": "Marquer comme non lu",


      // Withdraw Page translations
      "Phone Number":"Numéro de téléphone",
      "Withdraw from your account": "Retirer de votre compte",
      "Please fill in all fields": "Veuillez remplir tous les champs",
      "Phone numbers do not match": "Les numéros de téléphone ne correspondent pas",
      "Withdrawal request submitted successfully!": "Demande de retrait soumise avec succès !",
      "Something went wrong. Please try again.": "Une erreur s'est produite. Veuillez réessayer.",
      "Network error. Please check your connection and try again.": "Erreur réseau. Veuillez vérifier votre connexion et réessayer.",
      "Take Note": "Prenez note",
      "The currency of your account must be in XOF": "La devise de votre compte doit être en XOF",
      "CITY": "VILLE",
      "STREET": "RUE",
      "ID": "ID",
      "Enter ID": "Entrez l'ID",
      "Withdrawal Code": "Code de retrait",
      "Enter your withdrawal code": "Entrez votre code de retrait",
      "Enter number": "Entrez le numéro",
      "Confirm Number": "Confirmez le numéro",
      "Enter Confirm number": "Entrez le numéro de confirmation",
      "Network": "Réseau",
      "Processing...": "Traitement...",
      "Submit my request": "Soumettre ma demande",
      
      // New withdraw page translations
      "Amount": "Montant",
      "Enter amount to withdraw": "Entrez le montant à retirer",
      "Transaction Summary": "Résumé de la transaction",
      "Amount to withdraw": "Montant à retirer",
      "Fee": "Frais",
      "You will receive": "Vous recevrez",
      "City": "Ville",
      "Street": "Rue",
      "Remplissez les détails de votre pari": "Remplissez les détails de votre pari",
      "Gérer vos IDs de pari": "Gérer vos IDs de pari",
      "Ajouter un ID de pari": "Ajouter un ID de pari",
      "Vos IDs de pari enregistrés": "Vos IDs de pari enregistrés",
      "Aucun ID de pari enregistré.": "Aucun ID de pari enregistré.",
      "Supprimer": "Supprimer",
      "Choisissez la plateforme de pari que vous souhaitez utiliser": "Choisissez la plateforme de pari que vous souhaitez utiliser",
      "Aucune plateforme de pari trouvée": "Aucune plateforme de pari trouvée",
      "Aucune plateforme de pari n'est disponible pour le moment.": "Aucune plateforme de pari n'est disponible pour le moment.",
      "Choisissez votre réseau de paiement mobile": "Choisissez votre réseau de paiement mobile",
      "Back to Platforms": "Retour aux plateformes",
      "Comment obtenir un code de retrait ?": "Comment obtenir un code de retrait ?",
      "Pourquoi le retrait échoue ?": "Pourquoi le retrait échoue ?",
      // "Back": "Retour",


      "Withdraw Funds":"Retirer des fonds",
      
      // Deposit Page translations
      "Deposit Funds":"Déposer des fonds",
      "Select Bet ID":"Sélectionnez l'ID de pari",
      "Enter Details":"Entrez les détails",
      "Select Network":"Sélectionnez le réseau",
      "Select Your Betting Platform":"Sélectionnez votre plateforme de paris",
     
      "Back to Bet IDs":"Retour aux ID de pari",
      "Selected Bet ID":"ID de pari sélectionné",

      "Submit":"Soumettre",

      "Deposit to your account": "Déposez sur votre compte",
      "Deposit to your account here": "Déposez sur votre compte ici",
      "Click to continue payment": "Cliquez pour continuer le paiement",


      "Make deposits to your account": "Effectuez des dépôts sur votre compte",
      "Make your deposits to your account here": "Effectuez vos dépôts sur votre compte ici",
      
      "IMPORTANT": "IMPORTANT",
      "Your account currency must be in XOF.": "La devise de votre compte doit être en XOF.",
      
      "Enter your 1xbet user ID": "Entrez votre ID utilisateur 1xbet",
      "Enter your ID": "Entrez votre ID",
      "Enter or select your betting app ID" : "Entrez ou sélectionnez votre ID de l'application de paris",
      "Enter your betting app ID or select from saved IDs.":" Entrez votre ID de l'application de paris ou sélectionnez-en un enregistré.",
      "Selected App": "Sélectionnez l'ID",
      "Saved IDs": "IDs enregistrés",
      "Unknown App" : "Appareil inconnu",


      "This is your 1xbet user ID": "Ceci est votre ID utilisateur 1xbet",
      // "Amount": "Montant",
      "Enter deposit amount": "Entrez le montant du dépôt",
      
      "Enter your mobile money number": "Entrez votre numéro de mobile money",
      "Your mobile money number": "Votre numéro de mobile money",
      
      "Please select a network": "Veuillez sélectionner un réseau",
      
      "Proceed": "Procéder",
      "Deposit successful! Transaction ID:": "Dépôt réussi ! ID de transaction :",
      "Failed to load necessary data. Please try again later.": "Échec du chargement des données nécessaires. Veuillez réessayer plus tard.",
      "Error fetching data:": "Erreur lors de la récupération des données :",
      "Error processing deposit:": "Erreur lors du traitement du dépôt :",
      "Failed to process deposit. Please try again.": "Échec du traitement du dépôt. Veuillez réessayer.",
      "You must be logged in to access this feature.": "Vous devez être connecté pour accéder à cette fonctionnalité.",

      // Modal and Bet ID management translations
      "Confirmer l'ID de pari": "Confirmer l'ID de pari",
      "Confirm Bet ID": "Confirm Bet ID",
      "Nom de l'utilisateur": "Nom de l'utilisateur",
      "User Name": "User Name",
      "ID de pari": "ID de pari",
      "Bet ID": "Bet ID",
      "Appareil": "Appareil",
      "Device": "Device",
      "Annuler": "Annuler",
      "Cancel": "Cancel",
      "Confirmer": "Confirmer",
      "Confirm": "Confirm",
      "ID de pari invalide": "ID de pari invalide",
      "Invalid Bet ID": "Invalid Bet ID",
      "L'ID de pari est invalide ou n'existe pas.": "L'ID de pari est invalide ou n'existe pas.",
      "Bet ID is invalid or does not exist.": "Bet ID is invalid or does not exist.",
      "Échec de la validation de l'ID de pari. Veuillez réessayer.": "Échec de la validation de l'ID de pari. Veuillez réessayer.",
      "Failed to validate Bet ID. Please try again.": "Failed to validate Bet ID. Please try again.",
      "ID de pari ajouté avec succès !": "ID de pari ajouté avec succès !",
      "Bet ID added successfully!": "Bet ID added successfully!",
      "Fermer": "Fermer",
      "Failed to add bet ID": "Échec de l'ajout de l'ID de pari",
      "Veuillez sélectionner une application et saisir un ID de pari.": "Veuillez sélectionner une application et saisir un ID de pari.",
      "Please select an app and enter a bet ID.": "Please select an app and enter a bet ID.",
      "Vous devez être connecté pour ajouter un ID de pari.": "Vous devez être connecté pour ajouter un ID de pari.",
      "You must be logged in to add a bet ID.": "You must be logged in to add a bet ID.",
      "No account was found with the ID {{betid}}. Make sure it is spelled correctly and try again.": "Aucun compte n'a été trouvé avec l'ID {{betid}}. Vérifiez l'orthographe et réessayez.",
      "Transaction initiated successfully!": "Transaction initiée avec succès !",

      // CryptoTransactionForm translations
      "Please verify your account to buy or sell crypto.": "Veuillez vérifier votre compte pour acheter ou vendre de la crypto.",
      "Buy or Sell": "Acheter ou Vendre",
      // "Select Network": "Sélectionnez le réseau",
      "Select a network": "Sélectionnez un réseau",
      "Public Amount": "Montant public",
      "Amount (Local Currency)": "Montant (monnaie locale)",
      "Enter amount": "Entrez le montant",
      "You will get": "Vous recevrez",
      "Phone number": "Numéro de téléphone",
      "Confirm phone number": "Confirmez le numéro de téléphone",
      "Continue": "Continuer",
      "Are you buying or selling?": "Achetez-vous ou vendez-vous ?",
      "Buy": "Acheter",
      "Sell": "Vendre",
      "Enter your wallet link": "Entrez le lien de votre portefeuille",
      "Wallet link": "Lien du portefeuille",
      "Confirm wallet link": "Confirmez le lien du portefeuille",
      "Confirm your transaction": "Confirmez votre transaction",
      // "Processing...": "Traitement...",
      // "Confirm": "Confirmer",
      "Sell Wallet Address": "Adresse de vente du portefeuille",
      "Copy": "Copier",
      "Send your crypto to this address to complete the sale.": "Envoyez votre crypto à cette adresse pour finaliser la vente.",
      "Your buy request has been submitted!": "Votre demande d'achat a été soumise !",
      "Please fill all fields and confirm your phone number.": "Veuillez remplir tous les champs et confirmer votre numéro de téléphone.",
      "Please select a network.": "Veuillez sélectionner un réseau.",
      "Wallet links do not match.": "Les liens du portefeuille ne correspondent pas.",
      "Transaction failed. Please try again.": "La transaction a échoué. Veuillez réessayer.",
      "Please fill all fields.": "Veuillez remplir tous les champs.",
      "Please fill all fields and confirm your wallet link.": "Veuillez remplir tous les champs et confirmer votre lien de portefeuille.",
      "Back to Crypto": "Retour à la crypto",
      "Back to Cryptos": "Retour aux cryptos",

      // Account Verification Modal translations
      "Account Verification Required": "Vérification du compte requise",
      "Upload your image (face)": "Téléchargez votre image (visage)",
      "Upload your card image (ID card)": "Téléchargez l'image de votre carte (carte d'identité)",
      "Images uploaded. Please wait for admin verification.": "Images téléchargées. Veuillez attendre la vérification de l'administrateur.",
      "Failed to upload images. Try again.": "Échec du téléchargement des images. Réessayez.",
      "Uploading...": "Téléchargement...",
      "Upload & Submit": "Télécharger et soumettre",
      "Checking...": "Vérification...",
      "Verified": "Vérifié",
      "Not Verified": "Non vérifié",
      "Success": "Succès",

      // Buy/Sell modal translations
      "Choose Transaction Type": "Choisissez le type de transaction",
      "Buy Crypto": "Acheter de la crypto",
      "Sell Crypto": "Vendre de la crypto",
    },
  },
};

// Skip detection during SSR
// const languageDetector = new LanguageDetector(null, {
//   order: ['localStorage', 'navigator'], // Try localStorage first, then browser language
//   lookupLocalStorage: 'i18nextLng', // Key to store language in localStorage
//   caches: ['localStorage'], // Only use localStorage for persistence
 
//   //fallbackLng: 'fr', // Default to French if no language is detected
  
// });
export const initializeI18n = () => {
   // Configuration for i18next
   const config = {
    resources,
    lng: 'fr', // Default language
    fallbackLng: 'fr', // Fallback language
    supportedLngs: ['fr', 'en'], // Supported languages with French first
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
  };

  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init(config);
    // .init({
    //   resources,
    //   fallbackLng: 'fr',
    //   supportedLngs: ['en', 'fr'],
    //   interpolation: {
    //     escapeValue: false,
    //   },
    //   detection: {
    //     order: ['localStorage', 'navigator'],
    //     lookupLocalStorage: 'i18nextLng',
    //     caches: ['localStorage'],
    //   },
    // });

  // Set default language if not set
  if (typeof window !== 'undefined') {
    const savedLanguage = localStorage.getItem('i18nextLng');
    if (!savedLanguage) {
      i18n.changeLanguage('fr');
      localStorage.setItem('i18nextLng', 'fr');
    }
  }

  return i18n;
};

export default i18n;