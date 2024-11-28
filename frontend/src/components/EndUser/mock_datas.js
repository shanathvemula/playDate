import C1 from "../../assets/images/Carousel/carousel_1.jpeg";
import C2 from "../../assets/images/Carousel/carousel_2.jpeg";
import C3 from "../../assets/images/Carousel/carousel_3.jpg";
import C4 from "../../assets/images/Carousel/carousel_4.jpg";
import C5 from "../../assets/images/Carousel/carousel_5.jpg";
import C6 from "../../assets/images/Carousel/carousel_6.jpg";
export const BookVenue = [
  {
    id: 1,
    gameName: "Cricket",
    academy: "Kodambakkam Cricket Academy",
    location: {
      area: "Kodambakkam",
      fieldType: "Synthetic Pitch",
    },
    numberOfPlayers: 10,
    specialNote: "Wooden Bats",
    schedule: "Today",
    images: [C2, C1, C5, C6],
    rating: 4.5,
    venues: ["Cricket", "Football", "Tennis"], // Array of selected games
    amenities: ["Washroom", "Shower", "Locker Room"], // Array of amenities
    groundActiveTime: "7:00 AM to 10:00 PM", // Ground active time
    venueDetails: `Kodambakkam Cricket Academy offers a premium synthetic pitch for cricket enthusiasts. Located in the heart of Kodambakkam, this academy provides high-quality ground conditions and wooden bats for a traditional cricket experience. The ground is active from morning till evening, and it's perfect for both practice sessions and casual matches. The venue also provides essential amenities like washrooms, showers, and a locker room for players' convenience. With a rating of 4.5, it’s a well-maintained venue for all cricket lovers.`,
  },
  {
    id: 2,
    gameName: "Football",
    academy: "Anna Nagar Football Academy",
    location: {
      area: "Anna Nagar",
      fieldType: "Grass Field",
    },
    numberOfPlayers: 22,
    specialNote: "Cleats ",
    schedule: "Today",
    images: [C3, C4, C1],
    rating: 4.7,
    venues: ["Football", "Cricket", "Badminton"], // Array of selected games
    amenities: ["Rest Area", "Shower", "First-Aid Kit"], // Array of amenities
    groundActiveTime: "6:00 AM to 9:00 PM", // Ground active time
    venueDetails: `Anna Nagar Football Academy offers a large grass field, ideal for competitive football games and casual play. The academy is known for its spacious grounds and excellent facilities, making it a perfect place for teams to train or individuals to enjoy a friendly match. The venue has a strict policy of cleats  to ensure player safety. It operates throughout the day with the availability of rest areas, showers, and first-aid kits. This location is highly rated and frequently visited by football enthusiasts.`,
  },
  {
    id: 3,
    gameName: "Basketball",
    academy: "T Nagar Basketball Club",
    location: {
      area: "T Nagar",
      fieldType: "Indoor Court",
    },
    numberOfPlayers: 10,
    specialNote: "Basketball Shoes ",
    schedule: "Tomorrow",
    images: [C5, C6, C3, C4],
    rating: 4.3,
    venues: ["Basketball", "Volleyball", "Swimming"], // Array of selected games
    amenities: ["Air Conditioning", "Seating", "Water Cooler"], // Array of amenities
    groundActiveTime: "8:00 AM to 8:00 PM", // Ground active time
    venueDetails: `T Nagar Basketball Club features an indoor court with well-maintained flooring for a premium basketball experience. The academy is fully equipped to provide a comfortable environment for players with air conditioning and seating for spectators. Basketball shoes are  to ensure safety and maximize performance on the court. The venue operates from early morning until late evening and offers amenities like water coolers to keep players hydrated. It’s an excellent choice for those looking for an indoor basketball environment.`,
  },
];

export const GameNear = [
  {
    id: 1,
    gameName: "Cricket",
    academy: "Kodambakkam Cricket Academy",
    location: {
      area: "Kodambakkam",
      fieldType: "Synthetic Pitch",
    },
    numberOfPlayers: 10,
    specialNote: "Wooden Bats",
    schedule: "Available",
    images: [C2, C1, C3, C5, C6],
    rating: 4.5,
    venues: ["Cricket", "Football", "Tennis"],
    amenities: ["Washroom", "Shower", "Locker Room"],
    groundActiveTime: "7:00 AM to 10:00 PM",
    venueDetails: `Kodambakkam Cricket Academy offers a premium synthetic pitch for cricket enthusiasts. Located in the heart of Kodambakkam, this academy provides high-quality ground conditions and wooden bats for a traditional cricket experience. The ground is active from morning till evening, and it's perfect for both practice sessions and casual matches. The venue also provides essential amenities like washrooms, showers, and a locker room for players' convenience. With a rating of 4.5, it’s a well-maintained venue for all cricket lovers.`,
  },
  {
    id: 2,
    gameName: "Football",
    academy: "Anna Nagar Football Academy",
    location: {
      area: "Anna Nagar",
      fieldType: "Grass Field",
    },
    numberOfPlayers: 22,
    specialNote: "Cleats ",
    schedule: "Maintenance",
    images: [C5, C6, C3, C4],
    rating: 4.7,
    venues: ["Football", "Cricket", "Badminton"],
    amenities: ["Rest Area", "Shower", "First-Aid Kit"],
    groundActiveTime: "6:00 AM to 9:00 PM",
    venueDetails: `Anna Nagar Football Academy offers a large grass field, ideal for competitive football games and casual play. The academy is known for its spacious grounds and excellent facilities, making it a perfect place for teams to train or individuals to enjoy a friendly match. The venue has a strict policy of cleats  to ensure player safety. It operates throughout the day with the availability of rest areas, showers, and first-aid kits. This location is highly rated and frequently visited by football enthusiasts.`,
  },
  {
    id: 3,
    gameName: "Basketball",
    academy: "T Nagar Basketball Club",
    location: {
      area: "T Nagar",
      fieldType: "Indoor Court",
    },
    numberOfPlayers: 10,
    specialNote: "Basketball Shoes ",
    schedule: "Available",
    images: [C3, C5, C6, C1],
    rating: 4.3,
    venues: ["Basketball", "Volleyball", "Swimming"],
    amenities: ["Air Conditioning", "Seating", "Water Cooler"],
    groundActiveTime: "8:00 AM to 8:00 PM",
    venueDetails: `T Nagar Basketball Club features an indoor court with well-maintained flooring for a premium basketball experience. The academy is fully equipped to provide a comfortable environment for players with air conditioning and seating for spectators. Basketball shoes are  to ensure safety and maximize performance on the court. The venue operates from early morning until late evening and offers amenities like water coolers to keep players hydrated. It’s an excellent choice for those looking for an indoor basketball environment.`,
  },
  {
    id: 4,
    gameName: "Tennis",
    academy: "Nungambakkam Tennis Academy",
    location: {
      area: "Nungambakkam",
      fieldType: "Clay Court",
    },
    numberOfPlayers: 2,
    specialNote: "Tennis Rackets ",
    schedule: "Maintenance",
    images: [C3, C4, C2],
    rating: 4.6,
    venues: ["Tennis", "Football", "Badminton"],
    amenities: ["Locker Room", "Shower", "Seating"],
    groundActiveTime: "6:00 AM to 7:00 PM",
    venueDetails: `Nungambakkam Tennis Academy offers a clay court that provides an authentic tennis experience. The academy is known for its high standards of court Maintenance and top-notch tennis rackets. The venue operates with flexible timings to cater to players of all skill levels. Whether you are a beginner or an experienced player, this academy provides the perfect environment for you to improve your game. Additionally, the venue includes amenities like a locker room, seating, and showers, ensuring comfort and convenience for all players.`,
  },
  {
    id: 5,
    gameName: "Badminton",
    academy: "Adyar Badminton Academy",
    location: {
      area: "Adyar",
      fieldType: "Indoor Court",
    },
    numberOfPlayers: 4,
    specialNote: "Shuttlecocks",
    schedule: "Available",
    images: [C3, C4, "empty"],
    rating: 4.2,
    venues: ["Badminton", "Football", "Volleyball"],
    amenities: ["Air Conditioning", "Shower", "Water Cooler"],
    groundActiveTime: "7:00 AM to 9:00 PM",
    venueDetails: `Adyar Badminton Academy offers an indoor court ideal for singles or doubles matches. The academy ensures the availability of high-quality racquets and shuttlecocks, offering a hassle-free playing experience for badminton enthusiasts. The venue operates throughout the day with air conditioning and convenient amenities like showers and water coolers. With a rating of 4.2, it's known for its welcoming environment and is a top choice for local badminton players.`,
  },
  {
    id: 6,
    gameName: "Volleyball",
    academy: "Besant Nagar Beach Volleyball Club",
    location: {
      area: "Besant Nagar",
      fieldType: "Sand Court",
    },
    numberOfPlayers: 6,
    specialNote: "Beach Volleyball",
    schedule: "Available",
    images: ["empty", C5, C3],
    rating: 4.4,
    venues: ["Volleyball", "Basketball", "Cricket"],
    amenities: ["Water Cooler", "Shower", "Rest Area"],
    groundActiveTime: "6:00 AM to 8:00 PM",
    venueDetails: `Besant Nagar Beach Volleyball Club offers an outdoor sand court for a true beach volleyball experience. The venue is perfect for volleyball enthusiasts who prefer playing in an open-air environment. With a water cooler, shower facilities, and a rest area, it provides a complete package for players. The venue operates during the day, ensuring players can enjoy a beach-like atmosphere while getting a great workout. Known for its 4.4-star rating, this venue attracts both casual players and those looking to improve their skills.`,
  },
  {
    id: 7,
    gameName: "Swimming",
    academy: "Ekkatuthangal Swimming Academy",
    location: {
      area: "Ekkatuthangal",
      fieldType: "Indoor Pool",
    },
    numberOfPlayers: 1,
    specialNote: "Swim Gear ",
    schedule: "Maintenance",
    images: [C1, "empty"],
    rating: 4.8,
    venues: ["Swimming", "Football", "Cricket"],
    amenities: ["Locker Room", "Shower", "Water Cooler"],
    groundActiveTime: "7:00 AM to 9:00 PM",
    venueDetails: `Ekkatuthangal Swimming Academy features an indoor pool ideal for both beginners and experienced swimmers. The academy provides swim gear to enhance the experience, making it convenient for individuals to practice without bringing their own equipment. The pool operates from morning till evening, with amenities like locker rooms, showers, and water coolers available. With a high rating of 4.8, this academy is well-loved by swimmers for its excellent facilities and top-tier environment.`,
  },
  {
    id: 8,
    gameName: "Table Tennis",
    academy: "Kilpauk Table Tennis Academy",
    location: {
      area: "Kilpauk",
      fieldType: "Indoor Table",
    },
    numberOfPlayers: 2,
    specialNote: "Paddles and Balls ",
    schedule: "Maintenance",
    images: [C2, "empty", C3, C5, C6],
    rating: 4.0,
    venues: ["Table Tennis", "Badminton", "Volleyball"],
    amenities: ["Air Conditioning", "Water Cooler", "Seating"],
    groundActiveTime: "9:00 AM to 9:00 PM",
    venueDetails: `Kilpauk Table Tennis Academy features well-maintained indoor tables perfect for singles or doubles games. The academy provides paddles and balls to ensure players can focus entirely on their game. Air conditioning is available for player comfort, and the venue operates all day. The venue also offers seating and water coolers, making it a convenient spot for players to take breaks. With a rating of 4.0, it's a popular destination for table tennis enthusiasts.`,
  },
];
