import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      nav: {
        home: "Home",
        cars: "Garage",
        about: "About Us",
        faq: "FAQ",
        contacts: "Contacts",
        hi: "Hi, {{name}}",
        dashboard: "Dashboard",
        logout: "Logout",
        login: "Login",
        signup: "Sign Up"
      },
      hero: {
        subtitle: "Premium Car Rentals",
        title1: "LUXURY LIFESTYLE",
        title2: "RENTALS",
        desc: "Ultra Luxury Edition",
        price: "$600",
        perDay: "/ Per Day",
        driveNow: "DRIVE NOW"
      },
      stats: {
        vehicles: "Vehicles",
        support: "24/7 Support",
        clients: "Happy Clients",
        cities: "Cities Covered"
      },
      howItWorks: {
        title: "HOW IT WORKS",
        step1Title: "1. Choose a Car",
        step1Desc: "Browse our collection and find the perfect vehicle for your trip.",
        step2Title: "2. Book Online",
        step2Desc: "Select dates, upload your documents, and confirm your booking.",
        step3Title: "3. Hit the Road",
        step3Desc: "Pick up the keys and enjoy your ride. It's that easy!"
      },
      specials: {
        title: "TODAYS SPECIALS",
        suv: "SUV",
        luxury: "LUXURY",
        sportcar: "SPORTCAR",
        viewAll: "VIEW ALL CARS",
        driveNow: "DRIVE NOW"
      },
      miami: {
        title: "LUXURY CAR RENTAL",
        desc1: "Are you looking for an exotic or luxury car rental?",
        desc2: "You want to rent a luxury car? You can! Get in touch with Yassine Benhamzah – the fastest and easiest agency. Whether you need an exotic or luxury car to rent for business or for play.",
        feature1: "MILEAGE UNLIMITED",
        feature2: "PICK UP SERVICE",
        feature3: "DELIVERY TO DOOR"
      },
      advantages: {
        title: "WHY CHOOSE US?",
        adv1Title: "Best Prices",
        adv1Desc: "Competitive rates with no hidden fees. Transparent pricing for every vehicle.",
        adv2Title: "Full Insurance",
        adv2Desc: "All vehicles come with comprehensive insurance coverage for your peace of mind.",
        adv3Title: "Instant Booking",
        adv3Desc: "Book online in seconds. Get instant confirmation and pick up your car hassle-free.",
        adv4Title: "Maintained Fleet",
        adv4Desc: "Every car is professionally maintained and cleaned before each rental."
      },
      testimonials: {
        title: "WHAT OUR CLIENTS SAY",
        t1Text: "Incredible service! The car was in perfect condition and the booking process was seamless. Highly recommend!",
        t1Name: "Yassine B.",
        t2Text: "Best car rental experience in Morocco. Great prices, clean cars, and very friendly staff.",
        t2Name: "Fatima Z.",
        t3Text: "I've used many rental services, but this agency stands out. The online platform is easy to use and they have a great fleet.",
        t3Name: "Ahmed M."
      },
      locations: {
        title: "OUR LOCATIONS",
        desc: "Available at all major Moroccan airports.",
        casablanca: "Casablanca (Mohammed V)",
        marrakech: "Marrakech (Menara)",
        agadir: "Agadir (Al Massira)",
        tangier: "Tangier (Ibn Battouta)",
        rabat: "Rabat (Salé)",
        fez: "Fez (Saïss)"
      },
      cta: {
        title: "Ready to Hit the Road?",
        desc: "Join hundreds of satisfied customers. Create your account now and book your first rental in minutes.",
        viewCars: "VIEW CARS",
        signUp: "SIGN UP FREE"
      },
      footer: {
        address: "Casablanca, Morocco",
        phone: "+212 6XX-XXXXXX",
        email: "info@rentacar.ma",
        privacy: "Privacy Policy",
        rights: "© Copyright 2026 Yassine Benhamzah. All Rights Reserved."
      },
      filters: {
        from: "From",
        to: "To",
        transmission: "All Transmissions",
        fuel: "All Fuel Types",
        sortBy: "Sort By",
        brand: "Brand",
        results: "{{count}} vehicles",
        noResults: "No vehicles found",
        clear: "Clear All Filters",
        loadMore: "Load More Cars"
      },
      auth: {
        premium: "Premium Fleet",
        signInTitle: "Sign in",
        signInWelcome: "Welcome back to the club.",
        email: "EMAIL ADDRESS",
        password: "PASSWORD",
        forgot: "Forgot password?",
        authorizing: "AUTHENTICATING…",
        authorize: "AUTHORIZE",
        newAccountText: "New to the fleet?",
        createAccount: "Create an account",
        unleash: "UNLEASH",
        power: "THE POWER",
        signInDesc: "Sign in to explore the finest vehicles in Morocco.",
        joinPremium: "JOIN THE",
        premiumFleet: "PREMIUM FLEET",
        signupDesc: "Experience driving in its purest form. Register today to access our exclusive collection of high-performance vehicles across Morocco.",
        applyMembership: "Apply for Membership",
        setupProfile: "Set up your luxury profile",
        fullName: "FULL NAME / VIP ALIAS",
        confirmPassword: "CONFIRM PASSWORD",
        reqDocs: "Required Documents Data",
        cin: "GOV ID (CIN)",
        license: "DRIVER'S LICENSE NUMBER",
        mobile: "MOBILE CONTACT",
        address: "BILLING ADDRESS",
        processing: "PROCESSING APPLICATION…",
        requestMember: "REQUEST MEMBERSHIP",
        existingMember: "Existing Member?",
        signInHere: "Sign In Here →"
      }
    }
  },
  fr: {
    translation: {
      nav: {
        home: "Accueil",
        cars: "Garage",
        about: "À Propos",
        faq: "FAQ",
        contacts: "Contacts",
        hi: "Salut, {{name}}",
        dashboard: "Tableau de Bord",
        logout: "Déconnexion",
        login: "Connexion",
        signup: "S'inscrire"
      },
      hero: {
        subtitle: "Location de Voitures Premium",
        title1: "LOCATION DE",
        title2: "LUXE",
        desc: "Édition Ultra Luxe",
        price: "600$",
        perDay: "/ Par Jour",
        driveNow: "RÉSERVER"
      },
      stats: {
        vehicles: "Véhicules",
        support: "Assistance 24/7",
        clients: "Clients Satisfaits",
        cities: "Villes Couvertes"
      },
      howItWorks: {
        title: "COMMENT ÇA MARCHE",
        step1Title: "1. Choisissez",
        step1Desc: "Parcourez notre collection et trouvez le véhicule parfait.",
        step2Title: "2. Réservez",
        step2Desc: "Sélectionnez vos dates, envoyez vos documents et confirmez.",
        step3Title: "3. Conduisez",
        step3Desc: "Récupérez les clés et profitez de votre trajet. C'est si simple !"
      },
      specials: {
        title: "SPÉCIAUX DU JOUR",
        suv: "SUV",
        luxury: "LUXE",
        sportcar: "SPORT",
        viewAll: "VOIR TOUT",
        driveNow: "RÉSERVER"
      },
      miami: {
        title: "LOCATION DE LUXE",
        desc1: "Vous recherchez une voiture de luxe ou exotique?",
        desc2: "Vous voulez louer une voiture de luxe? Notre agence est la plus rapide et la plus simple. Que vous ayez besoin d'un véhicule pour affaires ou loisirs.",
        feature1: "KILOMÉTRAGE ILLIMITÉ",
        feature2: "SERVICE DE RAMASSAGE",
        feature3: "LIVRAISON À DOMICILE"
      },
      advantages: {
        title: "POURQUOI NOUS CHOISIR ?",
        adv1Title: "Meilleurs Prix",
        adv1Desc: "Des tarifs compétitifs sans frais cachés. Transparence totale.",
        adv2Title: "Assurance Complète",
        adv2Desc: "Tous nos véhicules sont couverts par une assurance.",
        adv3Title: "Réservation Instantanée",
        adv3Desc: "Réservez en quelques secondes et obtenez une confirmation.",
        adv4Title: "Flotte Entretenue",
        adv4Desc: "Chaque voiture est nettoyée et entretenue par des pros."
      },
      testimonials: {
        title: "TÉMOIGNAGES DE CLIENTS",
        t1Text: "Service incroyable ! La voiture était parfaite et la réservation facile. Je recommande !",
        t1Name: "Yassine B.",
        t2Text: "Meilleure location au Maroc. Super prix, voitures propres, et personnel sympa.",
        t2Name: "Fatima Z.",
        t3Text: "Cette agence se démarque vraiment. La plateforme est facile à utiliser et leur flotte est top.",
        t3Name: "Ahmed M."
      },
      locations: {
        title: "NOS AGENCES",
        desc: "Disponibles dans les grands aéroports marocains.",
        casablanca: "Casablanca (Mohammed V)",
        marrakech: "Marrakech (Menara)",
        agadir: "Agadir (Al Massira)",
        tangier: "Tanger (Ibn Battouta)",
        rabat: "Rabat (Salé)",
        fez: "Fès (Saïss)"
      },
      cta: {
        title: "Prêt à Prendre la Route ?",
        desc: "Rejoignez des centaines de clients satisfaits. Créez votre compte et réservez.",
        viewCars: "VOIR LES VÉHICULES",
        signUp: "S'INSCRIRE GRATUITEMENT"
      },
      footer: {
        address: "Casablanca, Maroc",
        phone: "+212 6XX-XXXXXX",
        email: "info@rentacar.ma",
        privacy: "Politique de confidentialité",
        rights: "© Copyright 2026 Yassine Benhamzah. Tous Droits Réservés."
      },
      filters: {
        from: "Du",
        to: "Au",
        transmission: "Toutes Transmissions",
        fuel: "Tous Carburants",
        sortBy: "Trier Par",
        brand: "Marque",
        results: "{{count}} véhicules",
        noResults: "Aucun véhicule trouvé",
        clear: "Effacer les Filtres",
        loadMore: "Voir Plus"
      },
      auth: {
        premium: "Flotte Premium",
        signInTitle: "Connexion",
        signInWelcome: "Rebonjour au club.",
        email: "ADRESSE E-MAIL",
        password: "MOT DE PASSE",
        forgot: "Mot de passe oublié ?",
        authorizing: "AUTHENTIFICATION…",
        authorize: "AUTORISER",
        newAccountText: "Nouveau sur la flotte ?",
        createAccount: "Créer un compte",
        unleash: "LIBÉREZ",
        power: "LA PUISSANCE",
        signInDesc: "Connectez-vous pour explorer les meilleurs véhicules au Maroc.",
        joinPremium: "REJOINDRE",
        premiumFleet: "LA FLOTTE PREMIUM",
        signupDesc: "Vivez la conduite dans sa forme la plus pure. Inscrivez-vous pour accéder à nos véhicules hautes performances.",
        applyMembership: "Demande d'Adhésion",
        setupProfile: "Créez votre profil de luxe",
        fullName: "NOM COMPLET / ALIAS VIP",
        confirmPassword: "CONFIRMER MOT DE PASSE",
        reqDocs: "Données et Documents",
        cin: "CARTE D'IDENTITÉ",
        license: "NUMÉRO DE PERMIS",
        mobile: "CONTACT MOBILE",
        address: "ADRESSE DE FACTURATION",
        processing: "TRAITEMENT EN COURS…",
        requestMember: "DEMANDER L'ADHÉSION",
        existingMember: "Déjà membre ?",
        signInHere: "Se Connecter →"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
