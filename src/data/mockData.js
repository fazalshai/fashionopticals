export const DOCTOR_INFO = {
  name: "Dr. Vuyyuru Raja Sekhar",
  title: "In-House Senior Ophthalmologist",
  qualifications: "MBBS, MS Ophthalmology",
  experience: "38+ Years",
  rating: "97%",
  totalRatings: 96,
  affiliation: "Guntur Medical College & Hospital",
  location: "Fashion Opticals & Eye Clinic, Kanna Vari Thota, Guntur",
  opdTimings: "Mon - Sat: 9:00 AM - 1:00 PM",
  opdDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  closedDays: ["Sunday"],
  phonePrimary: "+91 9490349868",
  phoneSecondary: "+91 9948501005",
  phone: "+91 9490349868",
  whatsapp: "+919490349868",
  consultationFee: "₹400",
  bio: "Dr. Vuyyuru Raja Sekhar is the resident Senior Ophthalmologist at Fashion Opticals Eye Clinic with over 38 years of clinical surgical excellence. Having completed his MBBS from Nagarjuna University and MS in Ophthalmology, he leads all eye examinations, cataract evaluations, and visual health consultations."
};

export const TREATMENTS = [
  {
    id: "cataract",
    title: "Cataract & Phacoemulsification",
    description: "Advanced micro-incision sutureless cataract surgery with premium intraocular lens (IOL) implantation.",
    category: "Surgical"
  },
  {
    id: "glaucoma",
    title: "Glaucoma Diagnosis & Management",
    description: "Early detection of intraocular pressure, visual field evaluation, and medical/laser management.",
    category: "Diagnostics & Laser"
  },
  {
    id: "cornea",
    title: "Cornea Treatment & Keratoplasty",
    description: "Specialized care for corneal dystrophy, pterygium excision, and corneal transplantation.",
    category: "Cornea Care"
  },
  {
    id: "lasik",
    title: "LASIK & Refractive Surgery",
    description: "Blade-free laser vision correction to permanently eliminate dependency on eyeglasses.",
    category: "Refractive"
  }
];

// EXTRAORDINARY TIERS (₹499, ₹599, ₹699)
export const SPECIAL_TIER_OFFERS = [
  {
    id: "tier-499",
    price: 499,
    originalPrice: 1299,
    badge: "SUPER SAVER OFFER",
    title: "Essential Everyday Spectacles",
    subtitle: "Complete Frame + Anti-Scratch Single Vision Lenses",
    features: [
      "Ultra-lightweight TR90 flexible frame",
      "Anti-scratch single vision prescription lenses",
      "Choice of classic colors & shapes",
      "Free hard case & micro-fiber cleaning cloth",
      "Free eye test verification by Dr. Sekhar"
    ],
    image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=600&q=80",
    tc: "*T&C Apply: Offer valid for power range -4.00D to +4.00D, SPH up to 2.00D CYL."
  },
  {
    id: "tier-599",
    price: 599,
    originalPrice: 1799,
    badge: "MOST POPULAR",
    title: "BlueShield Pro Computer Glasses",
    subtitle: "Frame + 98% HEV Blue-Light Filter + Hydrophobic Anti-Glare",
    features: [
      "Ergonomic anti-fatigue frame design",
      "Blocks 98% harmful digital screen blue light",
      "Anti-reflective & water-repellent coating",
      "Reduces digital eye strain & headaches",
      "Free 1-Year frame replacement warranty"
    ],
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=600&q=80",
    tc: "*T&C Apply: Applicable for Zero-power screen glasses or single vision prescription."
  },
  {
    id: "tier-699",
    price: 699,
    originalPrice: 2499,
    badge: "BEST VALUE PREMIER",
    title: "Photochromic Sun-Adapt & HD Spectacles",
    subtitle: "Auto-Darkening Lenses in Sunlight + Pure Titanium / Acetate",
    features: [
      "Auto-tinting photochromic lenses (Turns dark outdoors)",
      "Pure Titanium or Hand-polished Italian Acetate",
      "100% UV400 Sun Protection + Anti-Glare",
      "Custom digital free-form lens surfacing",
      "Free VIP consultation priority slot"
    ],
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
    tc: "*T&C Apply: Valid on select designer frames. Index 1.56 photochromic lens included."
  }
];

// EXPANDED SPECTACLES CATALOG (10+ Items)
export const OPTICAL_PRODUCTS = [
  {
    id: "opt-01",
    name: "AeroTitanium Ultralight Rectangle",
    category: "Eyeglasses",
    gender: "Unisex",
    price: 499,
    originalPrice: 1299,
    badge: "₹499 Package",
    description: "Featherweight hypoallergenic pure titanium frame with flexible spring hinges. Perfect for all-day office comfort.",
    image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=600&q=80",
    colors: ["Matte Black", "Gunmetal Grey", "Rose Gold"],
    tc: "*T&C Apply: Single vision lens included."
  },
  {
    id: "opt-02",
    name: "Classic Aviator Gold Frame",
    category: "Sunglasses",
    gender: "Men",
    price: 699,
    originalPrice: 2499,
    badge: "₹699 Photochromic",
    description: "Iconic teardrop metallic silhouette with category 3 polarized photochromic auto-darkening sun lenses.",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
    colors: ["Classic Gold / Green Lens", "Silver / Dark Grey", "Black / Gradient"],
    tc: "*T&C Apply: UV400 auto-tinting included."
  },
  {
    id: "opt-03",
    name: "Modern Wayfarer Blue-Blocker",
    category: "Blue-Light Glasses",
    gender: "Unisex",
    price: 599,
    originalPrice: 1799,
    badge: "₹599 BlueShield",
    description: "Specialized anti-reflective lenses engineered to filter harmful HEV blue light from computer & phone screens.",
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=600&q=80",
    colors: ["Crystal Clear Acetate", "Tortoiseshell", "Deep Obsidian"],
    tc: "*T&C Apply: Anti-glare coating included."
  },
  {
    id: "opt-04",
    name: "Cat-Eye Chic Designer Spectacles",
    category: "Eyeglasses",
    gender: "Women",
    price: 699,
    originalPrice: 2299,
    badge: "₹699 Premier",
    description: "Elegant upswept frame crafted from high-density hand-polished Italian acetate for sophisticated styling.",
    image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=600&q=80",
    colors: ["Champagne Gold", "Burgundy Red", "Classic Black"],
    tc: "*T&C Apply: Acetate frame warranty included."
  },
  {
    id: "opt-05",
    name: "Retro Round Acetate Spectacles",
    category: "Eyeglasses",
    gender: "Unisex",
    price: 499,
    originalPrice: 1399,
    badge: "₹499 Offer",
    description: "Vintage-inspired circular frame with keyhole bridge and embedded flexible wire core temples.",
    image: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=600&q=80",
    colors: ["Honey Tortoise", "Smoky Grey", "Classic Black"],
    tc: "*T&C Apply: Standard index 1.56 lens."
  },
  {
    id: "opt-06",
    name: "Varilux Progressive HD Vision Lenses",
    category: "Lens Options",
    gender: "Unisex",
    price: 699,
    originalPrice: 2999,
    badge: "Seamless HD Vision",
    description: "Custom digital free-form progressive lenses offering smooth transition between near, intermediate, and distance viewing.",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80",
    colors: ["Anti-Glare", "Transitions / Photochromic", "DriveSafe Coating"],
    tc: "*T&C Apply: Free-form digital surfacing."
  },
  {
    id: "opt-07",
    name: "Clubmaster Browline Hybrid",
    category: "Eyeglasses",
    gender: "Men",
    price: 599,
    originalPrice: 1899,
    badge: "₹599 Package",
    description: "Distinguished semi-rimless browline architecture combining bold upper acetate with polished lower metal wire.",
    image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=600&q=80",
    colors: ["Black / Silver", "Tortoise / Gold", "Matte Navy"],
    tc: "*T&C Apply: Includes anti-scratch lens."
  },
  {
    id: "opt-08",
    name: "Hexagonal Geometric Gold Spectacles",
    category: "Eyeglasses",
    gender: "Women",
    price: 699,
    originalPrice: 2399,
    badge: "₹699 Premier",
    description: "Trendy multi-faceted hexagonal stainless steel wire frame with ultra-slim temples and silicon nose pads.",
    image: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=600&q=80",
    colors: ["Rose Gold", "Polished Gold", "Silver Sparkle"],
    tc: "*T&C Apply: Ultra-thin index lens."
  },
  {
    id: "opt-09",
    name: "Rimless Executive Titanium Spectacles",
    category: "Eyeglasses",
    gender: "Unisex",
    price: 699,
    originalPrice: 2799,
    badge: "₹699 Titanium",
    description: "Borderless minimalist design with memory-flex titanium bridge and temple arms for invisible weightless feel.",
    image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=600&q=80",
    colors: ["Platinum Silver", "Matte Black", "Graphite"],
    tc: "*T&C Apply: High-impact polycarbonate lens included."
  },
  {
    id: "opt-10",
    name: "Polarized DriveSafe Sun Spectacles",
    category: "Sunglasses",
    gender: "Unisex",
    price: 599,
    originalPrice: 1999,
    badge: "₹599 Polarized",
    description: "High-contrast polarized lenses designed to eliminate road glare and water reflections while driving.",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
    colors: ["Amber Brown", "Polarized Grey", "Mirror Blue"],
    tc: "*T&C Apply: 100% UV400 Protection."
  }
];

export const INITIAL_APPOINTMENTS = [
  {
    id: "FO-20260727-001",
    patientName: "Ramesh Kumar",
    phone: "+91 9490349868",
    age: 46,
    visitedBefore: "Returning Patient",
    gender: "Male",
    date: "2026-07-27",
    timeSlot: "Morning Session (09:00 AM - 10:30 AM)",
    reason: "Cataract Consultation & Eye Checkup",
    status: "Confirmed",
    createdAt: "2026-07-26T08:00:00Z"
  },
  {
    id: "FO-20260727-002",
    patientName: "Saritha Reddy",
    phone: "+91 9948501005",
    age: 38,
    visitedBefore: "First Visit",
    gender: "Female",
    date: "2026-07-27",
    timeSlot: "Mid-Morning Session (10:30 AM - 12:00 PM)",
    reason: "Vision Testing & Spectacle Prescription",
    status: "Arrived",
    createdAt: "2026-07-26T08:30:00Z"
  }
];
