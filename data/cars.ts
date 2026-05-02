export interface CarColor {
  name: string;
  slug: string;
  hex: string;
  priceDelta: number;
}

export interface CarWheel {
  index: number;
  name: string;
  priceDelta: number;
  thumbnailPath: string;
}

export interface CarSpecs {
  engine: string;
  power: string;
  torque: string;
  zeroToHundred: string;
  topSpeed: string;
  fuelType: string;
}

export interface CarAddOn {
  id: string;
  name: string;
  plainDescription: string;
  priceDelta: number;
  thumbnailPath?: string;
  replacesWhat?: string;
}

export interface NotIncludedItem {
  name: string;
  description: string;
  addPrice?: number;
}

export interface Promotion {
  description: string;
  saving: number;
  expiryDate?: string;
}

export interface SGFees {
  coeEstimate: number;
  arf: number;
  registrationFee: number;
  annualRoadTax: number;
  omv: number;
}

export interface Car {
  brand: string;
  name: string;
  slug: string;
  colors: CarColor[];
  wheels: CarWheel[];
  specs: CarSpecs;
  basePrice: number;
  addOns: CarAddOn[];
  notIncluded: NotIncludedItem[];
  activePromotions: Promotion[];
  sgFees: SGFees;
}

export const cars: Car[] = [
  {
    brand: "Mercedes-Benz",
    name: "S 580",
    slug: "sclass",
    colors: [
      { name: "Obsidian Black", slug: "black", hex: "#1C1C1C", priceDelta: 0 },
      { name: "Polar White", slug: "white", hex: "#F4F4F0", priceDelta: 0 },
      { name: "Selenite Grey", slug: "grey", hex: "#8A8D8F", priceDelta: 2500 },
      { name: "Rubellite Red", slug: "red", hex: "#8B1A2F", priceDelta: 5800 },
    ],
    wheels: [
      {
        index: 0,
        name: "20-inch 5-spoke alloy, silver finish",
        priceDelta: 0,
        thumbnailPath: "/api/wheel-thumb?model=sclass&wheel=0",
      },
      {
        index: 1,
        name: "21-inch AMG multi-spoke alloy, high-gloss black",
        priceDelta: 3800,
        thumbnailPath: "/api/wheel-thumb?model=sclass&wheel=1",
      },
    ],
    specs: {
      engine: "4.0-litre V8 twin-turbo petrol",
      power: "503 hp",
      torque: "700 Nm",
      zeroToHundred: "4.3 sec",
      topSpeed: "250 km/h",
      fuelType: "Petrol",
    },
    basePrice: 388_888,
    addOns: [
      {
        id: "panoramic-roof",
        name: "Panoramic sunroof",
        plainDescription:
          "A large glass roof that lets in light and can tilt open for fresh air. It does not fully open. Replaces the standard fixed glass roof.",
        priceDelta: 4200,
        replacesWhat: "Standard fixed glass roof panel",
      },
      {
        id: "burmester-sound",
        name: "Burmester 4D surround sound system",
        plainDescription:
          "A high-end speaker system with 30 speakers built into the seats and doors. Music feels like it surrounds you from every direction.",
        priceDelta: 8500,
        replacesWhat: "Standard 9-speaker sound system",
      },
      {
        id: "executive-rear",
        name: "Executive rear seat package",
        plainDescription:
          "Rear seats that recline like business-class airplane seats, with leg rests, massage, and a fold-out table. For passengers, not the driver.",
        priceDelta: 12000,
        replacesWhat: "Standard rear bench seat",
      },
      {
        id: "night-package",
        name: "Night styling package",
        plainDescription:
          "Replaces chrome trim pieces on the outside with gloss-black versions for a darker, sportier look. Pure cosmetic change.",
        priceDelta: 3500,
        replacesWhat: "Chrome exterior trim",
      },
    ],
    notIncluded: [
      {
        name: "Floor mats",
        description: "Fitted rubber or carpet mats for all four footwells.",
        addPrice: 480,
      },
      {
        name: "Window tinting",
        description:
          "Dark film applied to rear windows to reduce heat and glare.",
        addPrice: 680,
      },
      {
        name: "Dashcam",
        description: "Front-and-rear camera that records while driving.",
        addPrice: 390,
      },
    ],
    activePromotions: [
      {
        description: "Year-end fleet clearance discount",
        saving: 5000,
        expiryDate: "31 Jan 2025",
      },
    ],
    sgFees: {
      omv: 68000,
      coeEstimate: 106000,
      arf: 94400,
      registrationFee: 220,
      annualRoadTax: 3720,
    },
  },

  {
    brand: "BMW",
    name: "330i",
    slug: "3series",
    colors: [
      { name: "Alpine White", slug: "white", hex: "#F2F2ED", priceDelta: 0 },
      {
        name: "Black Sapphire",
        slug: "black",
        hex: "#0E1828",
        priceDelta: 1500,
      },
      {
        name: "Portimao Blue",
        slug: "blue",
        hex: "#1C3F6E",
        priceDelta: 2800,
      },
      {
        name: "Brooklyn Grey",
        slug: "grey",
        hex: "#7A7D80",
        priceDelta: 1800,
      },
    ],
    wheels: [
      {
        index: 0,
        name: "18-inch star-spoke alloy, silver",
        priceDelta: 0,
        thumbnailPath: "/api/wheel-thumb?model=3series&wheel=0",
      },
      {
        index: 1,
        name: "19-inch M double-spoke alloy, bicolour",
        priceDelta: 2200,
        thumbnailPath: "/api/wheel-thumb?model=3series&wheel=1",
      },
    ],
    specs: {
      engine: "2.0-litre 4-cylinder turbo petrol",
      power: "258 hp",
      torque: "400 Nm",
      zeroToHundred: "5.8 sec",
      topSpeed: "250 km/h",
      fuelType: "Petrol",
    },
    basePrice: 233_888,
    addOns: [
      {
        id: "m-sport-pack",
        name: "M Sport package",
        plainDescription:
          "Wider bumpers, lower side skirts, and M Sport seats give the car a sportier look outside and firmer seating inside. Mostly cosmetic.",
        priceDelta: 8500,
        replacesWhat: "Standard Sport line exterior and seats",
      },
      {
        id: "harman-sound",
        name: "Harman Kardon surround sound",
        plainDescription:
          "16-speaker audio system with clearer highs and stronger bass than the standard speakers. Good for music lovers.",
        priceDelta: 2800,
        replacesWhat: "Standard 10-speaker Hi-Fi system",
      },
      {
        id: "adaptive-led",
        name: "Adaptive LED headlights",
        plainDescription:
          "Headlights that automatically swivel in the direction you're steering, illuminating corners before you reach them.",
        priceDelta: 1800,
        replacesWhat: "Standard LED headlights",
      },
      {
        id: "parking-assist",
        name: "Parking assistant plus",
        plainDescription:
          "The car steers itself into parallel and perpendicular parking spaces while you control the accelerator and brakes.",
        priceDelta: 2500,
      },
    ],
    notIncluded: [
      {
        name: "All-weather floor mats",
        description: "Rubber mats that protect the carpet from mud and water.",
        addPrice: 320,
      },
      {
        name: "Window tinting",
        description: "Dark film on rear windows for privacy and heat reduction.",
        addPrice: 580,
      },
      {
        name: "Cargo net",
        description: "Net to stop grocery bags from sliding around in the boot.",
        addPrice: 85,
      },
    ],
    activePromotions: [],
    sgFees: {
      omv: 40000,
      coeEstimate: 96000,
      arf: 48000,
      registrationFee: 220,
      annualRoadTax: 1480,
    },
  },

  {
    brand: "Toyota",
    name: "Camry 2.5 Hybrid",
    slug: "camry",
    colors: [
      {
        name: "Glacier White Pearl",
        slug: "white",
        hex: "#EEF0EC",
        priceDelta: 0,
      },
      { name: "Midnight Black", slug: "black", hex: "#1A1A1A", priceDelta: 800 },
      {
        name: "Silver Metallic",
        slug: "silver",
        hex: "#A8A9AD",
        priceDelta: 0,
      },
      { name: "Burning Red", slug: "red", hex: "#B22222", priceDelta: 800 },
    ],
    wheels: [
      {
        index: 0,
        name: "18-inch 10-spoke alloy, silver",
        priceDelta: 0,
        thumbnailPath: "/api/wheel-thumb?model=camry&wheel=0",
      },
      {
        index: 1,
        name: "18-inch 5-spoke sport alloy, dark grey",
        priceDelta: 800,
        thumbnailPath: "/api/wheel-thumb?model=camry&wheel=1",
      },
    ],
    specs: {
      engine: "2.5-litre 4-cylinder petrol + electric motor",
      power: "218 hp (combined)",
      torque: "221 Nm",
      zeroToHundred: "8.3 sec",
      topSpeed: "180 km/h",
      fuelType: "Petrol-electric hybrid",
    },
    basePrice: 175_888,
    addOns: [
      {
        id: "premium-audio",
        name: "9-speaker JBL audio upgrade",
        plainDescription:
          "Replaces the standard 6-speaker system with louder, clearer sound and a subwoofer in the boot for better bass.",
        priceDelta: 1800,
        replacesWhat: "Standard 6-speaker system",
      },
      {
        id: "head-up-display",
        name: "Head-up display",
        plainDescription:
          "Projects your speed and navigation directions onto the windscreen so you can read them without looking away from the road.",
        priceDelta: 1200,
      },
      {
        id: "blind-spot",
        name: "Blind spot monitoring + rear cross-traffic alert",
        plainDescription:
          "Flashes a warning in your door mirror when a car is in your blind spot. Also alerts you to traffic crossing behind when reversing.",
        priceDelta: 1500,
      },
    ],
    notIncluded: [
      {
        name: "Reversing camera paint-protection film",
        description:
          "Clear film over the rear camera lens to prevent scratches from car wash brushes.",
        addPrice: 45,
      },
      {
        name: "Floor mats",
        description: "Fitted carpet mats for all four footwells.",
        addPrice: 280,
      },
      {
        name: "Window tinting",
        description:
          "Privacy film for rear windows — useful in Singapore's heat.",
        addPrice: 480,
      },
    ],
    activePromotions: [
      {
        description: "5-year complimentary servicing package (est. value)",
        saving: 2400,
        expiryDate: "31 Mar 2025",
      },
    ],
    sgFees: {
      omv: 25000,
      coeEstimate: 96000,
      arf: 27000,
      registrationFee: 220,
      annualRoadTax: 1774,
    },
  },

  {
    brand: "Ford",
    name: "Mustang GT",
    slug: "mustang",
    colors: [
      { name: "Race Red", slug: "red", hex: "#CC1100", priceDelta: 0 },
      { name: "Shadow Black", slug: "black", hex: "#1A1A1A", priceDelta: 0 },
      {
        name: "Grabber Blue",
        slug: "blue",
        hex: "#1E4D8C",
        priceDelta: 1200,
      },
      { name: "Oxford White", slug: "white", hex: "#F0EEE8", priceDelta: 0 },
    ],
    wheels: [
      {
        index: 0,
        name: "19-inch 5-spoke alloy, dark silver",
        priceDelta: 0,
        thumbnailPath: "/api/wheel-thumb?model=mustang&wheel=0",
      },
      {
        index: 1,
        name: "20-inch 10-spoke alloy, gloss black",
        priceDelta: 1500,
        thumbnailPath: "/api/wheel-thumb?model=mustang&wheel=1",
      },
    ],
    specs: {
      engine: "5.0-litre V8 naturally aspirated petrol",
      power: "450 hp",
      torque: "529 Nm",
      zeroToHundred: "4.8 sec",
      topSpeed: "250 km/h",
      fuelType: "Petrol",
    },
    basePrice: 238_888,
    addOns: [
      {
        id: "shelby-look",
        name: "Shelby appearance package",
        plainDescription:
          "Adds a front splitter, rear diffuser, and side stripes that make the car look like a race-bred Shelby model. Cosmetic only — no performance change.",
        priceDelta: 5800,
        replacesWhat: "Standard GT exterior trim",
      },
      {
        id: "performance-exhaust",
        name: "Active performance exhaust",
        plainDescription:
          "A louder exhaust with a valve that lets you switch between quiet (for early mornings) and full-noise mode at the press of a button.",
        priceDelta: 3200,
        replacesWhat: "Standard single-exit exhaust",
      },
      {
        id: "recaro-seats",
        name: "Recaro sport bucket seats",
        plainDescription:
          "Firm, deep-bolstered racing-style seats that hold you in place during hard cornering. Less comfortable on long drives than the standard seats.",
        priceDelta: 4500,
        replacesWhat: "Standard cloth sport seats",
      },
      {
        id: "track-handling",
        name: "Track handling package",
        plainDescription:
          "Stiffer springs, upgraded brake pads, and a limited-slip differential that helps power reach both rear wheels evenly for better cornering grip.",
        priceDelta: 3800,
        replacesWhat: "Standard suspension and open differential",
      },
    ],
    notIncluded: [
      {
        name: "Car cover",
        description: "Fitted cover to protect the paintwork when parked outside.",
        addPrice: 220,
      },
      {
        name: "Wheel locks",
        description: "Security bolts that require a special key to remove — deters wheel theft.",
        addPrice: 95,
      },
      {
        name: "Floor mats",
        description: "Fitted rubber mats for all four footwells.",
        addPrice: 290,
      },
    ],
    activePromotions: [],
    sgFees: {
      omv: 48000,
      coeEstimate: 110000,
      arf: 59200,
      registrationFee: 220,
      annualRoadTax: 4796,
    },
  },

  {
    brand: "Audi",
    name: "A4 35 TFSI",
    slug: "a4",
    colors: [
      {
        name: "Glacier White",
        slug: "white",
        hex: "#EBEBEB",
        priceDelta: 0,
      },
      {
        name: "Mythos Black",
        slug: "black",
        hex: "#1A1A1A",
        priceDelta: 0,
      },
      {
        name: "Florett Silver",
        slug: "silver",
        hex: "#C0C2C5",
        priceDelta: 1200,
      },
      {
        name: "Navarra Blue",
        slug: "blue",
        hex: "#1E3A5F",
        priceDelta: 2500,
      },
    ],
    wheels: [
      {
        index: 0,
        name: "17-inch 5-arm alloy, silver",
        priceDelta: 0,
        thumbnailPath: "/api/wheel-thumb?model=a4&wheel=0",
      },
      {
        index: 1,
        name: "18-inch 5-double-spoke alloy, polished",
        priceDelta: 1800,
        thumbnailPath: "/api/wheel-thumb?model=a4&wheel=1",
      },
    ],
    specs: {
      engine: "1.5-litre 4-cylinder turbo petrol (mild hybrid assist)",
      power: "150 hp",
      torque: "270 Nm",
      zeroToHundred: "8.9 sec",
      topSpeed: "224 km/h",
      fuelType: "Petrol (mild hybrid)",
    },
    basePrice: 198_888,
    addOns: [
      {
        id: "virtual-cockpit",
        name: "Audi virtual cockpit plus",
        plainDescription:
          "Replaces the traditional dials with a large, fully digital screen that can show a big map, driving data, or media info — you choose the layout.",
        priceDelta: 2500,
        replacesWhat: "Standard analogue instrument cluster",
      },
      {
        id: "s-line-exterior",
        name: "S line exterior package",
        plainDescription:
          "Sport-look bumpers, side skirts, and S line badges give the car a more aggressive appearance. No mechanical changes.",
        priceDelta: 4200,
        replacesWhat: "Standard A4 exterior trim",
      },
      {
        id: "matrix-led",
        name: "Matrix LED headlights",
        plainDescription:
          "Headlights that use dozens of tiny LEDs to keep full-beam on while blocking the light that would dazzle oncoming drivers.",
        priceDelta: 1500,
        replacesWhat: "Standard LED headlights",
      },
      {
        id: "bang-olufsen",
        name: "Bang & Olufsen 3D premium sound system",
        plainDescription:
          "16-speaker system including ceiling speakers for a concert-hall effect. Noticeably better than the standard system at higher volumes.",
        priceDelta: 3200,
        replacesWhat: "Standard 10-speaker sound system",
      },
    ],
    notIncluded: [
      {
        name: "Floor mats",
        description: "Fitted textile mats for all four footwells.",
        addPrice: 310,
      },
      {
        name: "Tow hook",
        description: "Retractable tow hook for trailers or bike racks.",
        addPrice: 580,
      },
      {
        name: "Roof rails",
        description:
          "Rails along the roof for attaching a roof box or bike carrier.",
        addPrice: 650,
      },
    ],
    activePromotions: [
      {
        description: "Corporate fleet loyalty discount (3%)",
        saving: 5967,
        expiryDate: "30 Jun 2025",
      },
    ],
    sgFees: {
      omv: 36000,
      coeEstimate: 96000,
      arf: 42400,
      registrationFee: 220,
      annualRoadTax: 1094,
    },
  },

  {
    brand: "Porsche",
    name: "911 Carrera",
    slug: "911",
    colors: [
      { name: "Guards Red", slug: "red", hex: "#CC1111", priceDelta: 0 },
      { name: "Jet Black", slug: "black", hex: "#1A1A1A", priceDelta: 0 },
      { name: "GT Silver", slug: "silver", hex: "#C4C4C4", priceDelta: 0 },
      {
        name: "Shark Blue",
        slug: "blue",
        hex: "#1B3A5C",
        priceDelta: 4500,
      },
    ],
    wheels: [
      {
        index: 0,
        name: "20/21-inch Carrera alloy, polished silver",
        priceDelta: 0,
        thumbnailPath: "/api/wheel-thumb?model=911&wheel=0",
      },
      {
        index: 1,
        name: "20/21-inch Carrera Sport alloy, satin black",
        priceDelta: 5500,
        thumbnailPath: "/api/wheel-thumb?model=911&wheel=1",
      },
    ],
    specs: {
      engine: "3.0-litre flat-6 twin-turbo petrol",
      power: "385 hp",
      torque: "450 Nm",
      zeroToHundred: "4.2 sec",
      topSpeed: "293 km/h",
      fuelType: "Petrol",
    },
    basePrice: 488_888,
    addOns: [
      {
        id: "sport-chrono",
        name: "Sport Chrono package",
        plainDescription:
          "Adds a stopwatch on the dashboard, launch control for fastest starts, and a Sport+ mode that sharpens throttle and gearbox response noticeably.",
        priceDelta: 8500,
      },
      {
        id: "bose-sound",
        name: "Bose surround sound system",
        plainDescription:
          "12-speaker system tuned specifically for the 911's cabin shape, with noticeably better bass and clarity than the standard speakers.",
        priceDelta: 4200,
        replacesWhat: "Standard 6-speaker system",
      },
      {
        id: "carbon-interior",
        name: "Carbon interior trim package",
        plainDescription:
          "Replaces the gloss-black plastic trim strips on the dashboard and doors with real woven carbon fibre. Visual upgrade only.",
        priceDelta: 6500,
        replacesWhat: "Gloss-black plastic interior trim",
      },
      {
        id: "sport-exhaust",
        name: "Sport exhaust system",
        plainDescription:
          "A louder, deeper exhaust note with a button to quiet it down when needed. Many owners consider this the most satisfying upgrade.",
        priceDelta: 7800,
        replacesWhat: "Standard single exhaust",
      },
    ],
    notIncluded: [
      {
        name: "Car cover",
        description:
          "Fitted indoor/outdoor cover — important for preventing swirl marks.",
        addPrice: 380,
      },
      {
        name: "Wheel locks",
        description:
          "Anti-theft lug nuts requiring a special key socket to remove.",
        addPrice: 120,
      },
      {
        name: "Key pouch",
        description:
          "Leather key wallet to protect the key fob from scratches.",
        addPrice: 65,
      },
    ],
    activePromotions: [],
    sgFees: {
      omv: 100000,
      coeEstimate: 110000,
      arf: 152000,
      registrationFee: 220,
      annualRoadTax: 3010,
    },
  },

  {
    brand: "Honda",
    name: "Civic 1.5 Turbo",
    slug: "civic",
    colors: [
      {
        name: "Sonic Grey Pearl",
        slug: "grey",
        hex: "#7A7D80",
        priceDelta: 0,
      },
      {
        name: "Crystal Black Pearl",
        slug: "black",
        hex: "#1C1C1E",
        priceDelta: 0,
      },
      {
        name: "Platinum White Pearl",
        slug: "white",
        hex: "#F0EFF0",
        priceDelta: 0,
      },
      {
        name: "Aegean Blue Metallic",
        slug: "blue",
        hex: "#2E5F8A",
        priceDelta: 800,
      },
    ],
    wheels: [
      {
        index: 0,
        name: "17-inch 10-spoke alloy, silver",
        priceDelta: 0,
        thumbnailPath: "/api/wheel-thumb?model=civic&wheel=0",
      },
      {
        index: 1,
        name: "17-inch 5-spoke sport alloy, gloss black",
        priceDelta: 900,
        thumbnailPath: "/api/wheel-thumb?model=civic&wheel=1",
      },
    ],
    specs: {
      engine: "1.5-litre 4-cylinder turbo petrol",
      power: "182 hp",
      torque: "240 Nm",
      zeroToHundred: "7.5 sec",
      topSpeed: "215 km/h",
      fuelType: "Petrol",
    },
    basePrice: 149_888,
    addOns: [
      {
        id: "honda-sensing",
        name: "Honda Sensing safety suite",
        plainDescription:
          "Adds automatic emergency braking, lane-keep assist, and adaptive cruise control that adjusts your speed to match traffic in front.",
        priceDelta: 1200,
      },
      {
        id: "panoramic-roof",
        name: "Panoramic sunroof",
        plainDescription:
          "Large glass roof over the front and rear seats, with a sunshade for hot days. The front section can tilt open for fresh air.",
        priceDelta: 2800,
        replacesWhat: "Standard fixed roof",
      },
      {
        id: "premium-audio",
        name: "12-speaker premium audio upgrade",
        plainDescription:
          "Doubles the number of speakers from 6 to 12, adding a subwoofer under the rear seat for deeper bass without losing boot space.",
        priceDelta: 1500,
        replacesWhat: "Standard 6-speaker system",
      },
      {
        id: "body-kit",
        name: "Type R-inspired exterior body kit",
        plainDescription:
          "Front lip, rear spoiler, and side skirts that give the Civic a sportier look similar to the performance Type R model. No mechanical changes.",
        priceDelta: 1800,
        replacesWhat: "Standard exterior trim",
      },
    ],
    notIncluded: [
      {
        name: "Floor mats",
        description: "Fitted carpet or rubber mats for all four footwells.",
        addPrice: 240,
      },
      {
        name: "Dashcam",
        description:
          "Front-facing camera that records your drives — useful if you're ever in an accident.",
        addPrice: 290,
      },
      {
        name: "Window tinting",
        description: "Dark film on rear windows for heat reduction and privacy.",
        addPrice: 420,
      },
    ],
    activePromotions: [
      {
        description: "4-year complimentary servicing package (est. value)",
        saving: 1800,
        expiryDate: "28 Feb 2025",
      },
    ],
    sgFees: {
      omv: 17000,
      coeEstimate: 96000,
      arf: 17000,
      registrationFee: 220,
      annualRoadTax: 742,
    },
  },

  {
    brand: "Hyundai",
    name: "Tucson 1.6T",
    slug: "tucson",
    colors: [
      {
        name: "Shimmering Silver",
        slug: "silver",
        hex: "#B8BAC0",
        priceDelta: 0,
      },
      {
        name: "Phantom Black",
        slug: "black",
        hex: "#1C1C1C",
        priceDelta: 0,
      },
      { name: "Creamy White", slug: "white", hex: "#F0EDE8", priceDelta: 0 },
      {
        name: "Aqua Teal",
        slug: "teal",
        hex: "#2A7A6A",
        priceDelta: 800,
      },
    ],
    wheels: [
      {
        index: 0,
        name: "17-inch 5-spoke alloy, machine-finish silver",
        priceDelta: 0,
        thumbnailPath: "/api/wheel-thumb?model=tucson&wheel=0",
      },
      {
        index: 1,
        name: "19-inch 5-spoke alloy, two-tone dark grey",
        priceDelta: 1200,
        thumbnailPath: "/api/wheel-thumb?model=tucson&wheel=1",
      },
    ],
    specs: {
      engine: "1.6-litre 4-cylinder turbo petrol",
      power: "180 hp",
      torque: "265 Nm",
      zeroToHundred: "8.9 sec",
      topSpeed: "210 km/h",
      fuelType: "Petrol",
    },
    basePrice: 168_888,
    addOns: [
      {
        id: "panoramic-sunroof",
        name: "Panoramic sunroof",
        plainDescription:
          "A wide glass roof that stretches over both front and rear passengers, with a powered sunshade. The front section opens.",
        priceDelta: 1800,
        replacesWhat: "Standard fixed roof",
      },
      {
        id: "360-camera",
        name: "360-degree surround-view camera",
        plainDescription:
          "Four cameras stitched together to show a bird's-eye view of the car on screen, making tight parking spaces easy to navigate.",
        priceDelta: 1500,
        replacesWhat: "Standard rear camera only",
      },
      {
        id: "ventilated-seats",
        name: "Ventilated front seats",
        plainDescription:
          "Front seats with small fans that blow cool air through the fabric, keeping your back cool in Singapore's heat.",
        priceDelta: 2200,
        replacesWhat: "Standard heated-only front seats",
      },
      {
        id: "hands-free-tailgate",
        name: "Hands-free power tailgate",
        plainDescription:
          "Kick your foot under the rear bumper and the boot opens automatically — useful when your hands are full of shopping bags.",
        priceDelta: 900,
        replacesWhat: "Standard manual tailgate",
      },
    ],
    notIncluded: [
      {
        name: "Floor mats",
        description: "Fitted rubber mats for all four footwells and the boot.",
        addPrice: 260,
      },
      {
        name: "Cargo boot mat",
        description:
          "Rubber liner that protects the boot floor from scratches and spills.",
        addPrice: 95,
      },
      {
        name: "Window tinting",
        description:
          "Dark film applied to all rear windows, standard in Singapore's climate.",
        addPrice: 480,
      },
    ],
    activePromotions: [
      {
        description: "Launch edition promotion — S$3,000 cash discount",
        saving: 3000,
        expiryDate: "31 Mar 2025",
      },
    ],
    sgFees: {
      omv: 22000,
      coeEstimate: 96000,
      arf: 22800,
      registrationFee: 220,
      annualRoadTax: 956,
    },
  },
];

export const carsBySlug = new Map<string, Car>(cars.map((c) => [c.slug, c]));
