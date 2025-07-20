const fs = require("fs");
const path = require("path");

// Common definitions for frequent words
const commonDefinitions = {
  a: {
    definition:
      "used when referring to someone or something for the first time",
    examples: ["I saw a cat in the garden.", "She is a teacher."],
    phonetic: "/ə/",
  },
  about: {
    definition: "on the subject of; concerning",
    examples: ["Tell me about your day.", "What do you think about this?"],
    phonetic: "/əˈbaʊt/",
  },
  above: {
    definition: "in or to a higher place than something else",
    examples: ["The bird flew above the trees.", "Look at the star above."],
    phonetic: "/əˈbʌv/",
  },
  accept: {
    definition: "to take willingly something that is offered",
    examples: ["I accept your invitation.", "She accepted the job offer."],
    phonetic: "/əkˈsɛpt/",
  },
  action: {
    definition: "the process of doing something",
    examples: ["We need to take action now.", "His actions were brave."],
    phonetic: "/ˈækʃən/",
  },
  add: {
    definition: "to put something together with something else",
    examples: ["Add sugar to the coffee.", "Please add your name to the list."],
    phonetic: "/æd/",
  },
  after: {
    definition: "following in time or place",
    examples: ["Come after lunch.", "After the rain, the sun came out."],
    phonetic: "/ˈæftər/",
  },
  again: {
    definition: "once more; another time",
    examples: ["Please say that again.", "Let's try again tomorrow."],
    phonetic: "/əˈɡɛn/",
  },
  against: {
    definition: "in opposition to",
    examples: ["I'm against this plan.", "The ladder is against the wall."],
    phonetic: "/əˈɡɛnst/",
  },
  age: {
    definition: "the length of time that a person has lived",
    examples: ["What's your age?", "She's 25 years of age."],
    phonetic: "/eɪdʒ/",
  },
  air: {
    definition: "the mixture of gases that surrounds the earth",
    examples: ["The air is fresh here.", "Open the window for some air."],
    phonetic: "/ɛr/",
  },
  all: {
    definition: "every one of; the whole amount or quantity of",
    examples: ["All students must attend.", "I spent all my money."],
    phonetic: "/ɔl/",
  },
  also: {
    definition: "in addition; too",
    examples: ["I also like pizza.", "She's smart and also kind."],
    phonetic: "/ˈɔlsoʊ/",
  },
  and: {
    definition: "used to connect words, phrases, or clauses",
    examples: ["Red and blue make purple.", "I like cats and dogs."],
    phonetic: "/ænd/",
  },
  answer: {
    definition: "to respond to a question",
    examples: ["Please answer the question.", "She answered the phone."],
    phonetic: "/ˈænsər/",
  },
  any: {
    definition: "one or some of a thing, no matter how much or how many",
    examples: ["Do you have any money?", "Take any book you want."],
    phonetic: "/ˈɛni/",
  },
  ask: {
    definition: "to request information from someone",
    examples: ["Can I ask you a question?", "Ask for help if you need it."],
    phonetic: "/æsk/",
  },
  back: {
    definition: "to or toward a former position",
    examples: ["Come back soon.", "Put the book back on the shelf."],
    phonetic: "/bæk/",
  },
  bad: {
    definition: "not good; unpleasant or harmful",
    examples: ["That's a bad idea.", "The weather is bad today."],
    phonetic: "/bæd/",
  },
  be: {
    definition: "to exist or occur",
    examples: ["I want to be a doctor.", "Be careful!"],
    phonetic: "/bi/",
  },
  because: {
    definition: "for the reason that",
    examples: [
      "I'm tired because I worked late.",
      "She left because of the rain.",
    ],
    phonetic: "/bɪˈkɔz/",
  },
  become: {
    definition: "to come to be; to grow to be",
    examples: ["She became a teacher.", "It's becoming cold."],
    phonetic: "/bɪˈkʌm/",
  },
  before: {
    definition: "earlier than; in front of",
    examples: ["Come before 5 PM.", "Think before you speak."],
    phonetic: "/bɪˈfɔr/",
  },
  begin: {
    definition: "to start",
    examples: ["Let's begin the meeting.", "The movie begins at 8 PM."],
    phonetic: "/bɪˈɡɪn/",
  },
  big: {
    definition: "large in size",
    examples: ["That's a big house.", "He has big dreams."],
    phonetic: "/bɪɡ/",
  },
  book: {
    definition: "a set of printed pages bound together",
    examples: ["I'm reading a good book.", "She wrote a book about cooking."],
    phonetic: "/bʊk/",
  },
  boy: {
    definition: "a male child",
    examples: ["The boy is playing soccer.", "He's a good boy."],
    phonetic: "/bɔɪ/",
  },
  bring: {
    definition: "to carry or take something to a place",
    examples: ["Please bring your books.", "Can you bring me some water?"],
    phonetic: "/brɪŋ/",
  },
  but: {
    definition: "used to introduce a contrasting statement",
    examples: ["I want to go, but I'm busy.", "It's small but powerful."],
    phonetic: "/bʌt/",
  },
  buy: {
    definition: "to purchase something",
    examples: ["I want to buy a car.", "She bought new shoes."],
    phonetic: "/baɪ/",
  },
  call: {
    definition: "to telephone someone; to shout",
    examples: ["Please call me tomorrow.", "I heard someone call my name."],
    phonetic: "/kɔl/",
  },
  can: {
    definition: "to be able to",
    examples: ["I can swim.", "Can you help me?"],
    phonetic: "/kæn/",
  },
  car: {
    definition: "a motor vehicle with four wheels",
    examples: ["My car is red.", "Let's go by car."],
    phonetic: "/kɑr/",
  },
  child: {
    definition: "a young person",
    examples: ["The child is sleeping.", "She has three children."],
    phonetic: "/tʃaɪld/",
  },
  come: {
    definition: "to move toward a place",
    examples: ["Come here, please.", "Spring will come soon."],
    phonetic: "/kʌm/",
  },
  day: {
    definition: "a 24-hour period",
    examples: ["Have a nice day!", "Yesterday was a good day."],
    phonetic: "/deɪ/",
  },
  do: {
    definition: "to perform an action",
    examples: ["What do you want to do?", "I do my homework every day."],
    phonetic: "/du/",
  },
  each: {
    definition: "every one of two or more",
    examples: ["Each student has a book.", "Give each person a chance."],
    phonetic: "/itʃ/",
  },
  eye: {
    definition: "the organ of sight",
    examples: ["She has beautiful eyes.", "Keep your eye on the ball."],
    phonetic: "/aɪ/",
  },
  face: {
    definition: "the front part of the head",
    examples: ["She has a kind face.", "Face the camera, please."],
    phonetic: "/feɪs/",
  },
  fact: {
    definition: "something that is true",
    examples: [
      "That's an interesting fact.",
      "The fact is, we need more time.",
    ],
    phonetic: "/fækt/",
  },
  family: {
    definition: "a group of people related by blood or marriage",
    examples: ["I love my family.", "Family is important."],
    phonetic: "/ˈfæməli/",
  },
  far: {
    definition: "at a great distance",
    examples: ["The store is far from here.", "How far is it?"],
    phonetic: "/fɑr/",
  },
  feel: {
    definition: "to experience an emotion or physical sensation",
    examples: ["I feel happy.", "Feel the soft fabric."],
    phonetic: "/fil/",
  },
  find: {
    definition: "to discover or locate something",
    examples: ["I can't find my keys.", "Find the answer in the book."],
    phonetic: "/faɪnd/",
  },
  first: {
    definition: "before all others in time or order",
    examples: ["This is my first time here.", "First, let's eat lunch."],
    phonetic: "/fɜrst/",
  },
  for: {
    definition: "intended to belong to or be used by",
    examples: ["This gift is for you.", "I'm studying for the exam."],
    phonetic: "/fɔr/",
  },
  from: {
    definition: "indicating the starting point",
    examples: ["I'm from New York.", "The train leaves from platform 3."],
    phonetic: "/frʌm/",
  },
  get: {
    definition: "to obtain or receive",
    examples: ["Can you get me some coffee?", "I got a new job."],
    phonetic: "/ɡɛt/",
  },
  girl: {
    definition: "a female child",
    examples: ["The girl is very smart.", "She's a nice girl."],
    phonetic: "/ɡɜrl/",
  },
  give: {
    definition: "to transfer something to someone",
    examples: ["Give me your hand.", "I'll give you a present."],
    phonetic: "/ɡɪv/",
  },
  go: {
    definition: "to move or travel",
    examples: ["Let's go home.", "I go to school every day."],
    phonetic: "/ɡoʊ/",
  },
  good: {
    definition: "having the required qualities; satisfactory",
    examples: ["That's a good idea.", "She's a good student."],
    phonetic: "/ɡʊd/",
  },
  great: {
    definition: "very good; excellent",
    examples: ["That's great news!", "She's a great teacher."],
    phonetic: "/ɡreɪt/",
  },
  group: {
    definition: "a number of people or things together",
    examples: [
      "Join our study group.",
      "A group of friends went to the movies.",
    ],
    phonetic: "/ɡrup/",
  },
  hand: {
    definition: "the part of the body at the end of the arm",
    examples: ["Raise your hand.", "She has small hands."],
    phonetic: "/hænd/",
  },
  have: {
    definition: "to possess or own",
    examples: ["I have a car.", "Do you have time?"],
    phonetic: "/hæv/",
  },
  he: {
    definition: "referring to a male person or animal",
    examples: ["He is my brother.", "Where is he going?"],
    phonetic: "/hi/",
  },
  help: {
    definition: "to assist someone",
    examples: ["Can you help me?", "I need help with my homework."],
    phonetic: "/hɛlp/",
  },
  her: {
    definition: "belonging to or associated with a female",
    examples: ["That's her book.", "I saw her yesterday."],
    phonetic: "/hɜr/",
  },
  here: {
    definition: "in this place",
    examples: ["Come here, please.", "I live here."],
    phonetic: "/hɪr/",
  },
  him: {
    definition: "referring to a male person as the object",
    examples: ["I saw him at the store.", "Give it to him."],
    phonetic: "/hɪm/",
  },
  his: {
    definition: "belonging to or associated with a male",
    examples: ["That's his car.", "His name is John."],
    phonetic: "/hɪz/",
  },
  home: {
    definition: "the place where one lives",
    examples: ["I'm going home.", "Home is where the heart is."],
    phonetic: "/hoʊm/",
  },
  how: {
    definition: "in what way or manner",
    examples: ["How are you?", "Show me how to do it."],
    phonetic: "/haʊ/",
  },
  I: {
    definition: "referring to oneself",
    examples: ["I am happy.", "Can I help you?"],
    phonetic: "/aɪ/",
  },
  if: {
    definition: "on the condition that",
    examples: ["If it rains, we'll stay inside.", "Call me if you need help."],
    phonetic: "/ɪf/",
  },
  in: {
    definition: "inside; within",
    examples: ["The book is in the bag.", "I live in New York."],
    phonetic: "/ɪn/",
  },
  into: {
    definition: "to the inside of",
    examples: ["Put the key into the lock.", "She walked into the room."],
    phonetic: "/ˈɪntu/",
  },
  is: {
    definition: "third person singular of 'be'",
    examples: ["She is a teacher.", "This is my house."],
    phonetic: "/ɪz/",
  },
  it: {
    definition: "referring to a thing or animal",
    examples: ["It is raining.", "Where is it?"],
    phonetic: "/ɪt/",
  },
  its: {
    definition: "belonging to or associated with a thing",
    examples: ["The dog wagged its tail.", "The book lost its cover."],
    phonetic: "/ɪts/",
  },
  just: {
    definition: "exactly; only",
    examples: ["I just arrived.", "Just a minute, please."],
    phonetic: "/dʒʌst/",
  },
  know: {
    definition: "to be aware of through observation or information",
    examples: ["I know the answer.", "Do you know him?"],
    phonetic: "/noʊ/",
  },
  last: {
    definition: "coming after all others in time or order",
    examples: ["This is the last piece.", "I saw her last week."],
    phonetic: "/læst/",
  },
  leave: {
    definition: "to go away from",
    examples: ["I have to leave now.", "Don't leave me alone."],
    phonetic: "/liv/",
  },
  life: {
    definition: "the condition of being alive",
    examples: ["Life is beautiful.", "She has a good life."],
    phonetic: "/laɪf/",
  },
  like: {
    definition: "to find agreeable or enjoyable",
    examples: ["I like pizza.", "She likes to read."],
    phonetic: "/laɪk/",
  },
  little: {
    definition: "small in size or amount",
    examples: ["A little bird sang.", "Can I have a little water?"],
    phonetic: "/ˈlɪtəl/",
  },
  long: {
    definition: "measuring a great distance from end to end",
    examples: ["That's a long road.", "How long will it take?"],
    phonetic: "/lɔŋ/",
  },
  look: {
    definition: "to direct one's gaze",
    examples: ["Look at the sky.", "You look tired."],
    phonetic: "/lʊk/",
  },
  make: {
    definition: "to create or produce",
    examples: ["I'll make dinner.", "Make a wish."],
    phonetic: "/meɪk/",
  },
  man: {
    definition: "an adult male human",
    examples: ["The man is tall.", "He's a good man."],
    phonetic: "/mæn/",
  },
  many: {
    definition: "a large number of",
    examples: ["Many people came.", "How many books do you have?"],
    phonetic: "/ˈmɛni/",
  },
  may: {
    definition: "expressing possibility",
    examples: ["It may rain tomorrow.", "May I help you?"],
    phonetic: "/meɪ/",
  },
  me: {
    definition: "referring to oneself as the object",
    examples: ["Give it to me.", "Call me later."],
    phonetic: "/mi/",
  },
  more: {
    definition: "a greater amount or quantity",
    examples: ["I need more time.", "Can I have more coffee?"],
    phonetic: "/mɔr/",
  },
  most: {
    definition: "the greatest amount or quantity",
    examples: ["Most people like music.", "This is the most important thing."],
    phonetic: "/moʊst/",
  },
  move: {
    definition: "to change position",
    examples: ["Move your chair closer.", "The car is moving fast."],
    phonetic: "/muv/",
  },
  much: {
    definition: "a great amount or quantity",
    examples: ["How much does it cost?", "I don't have much time."],
    phonetic: "/mʌtʃ/",
  },
  must: {
    definition: "expressing necessity or obligation",
    examples: ["You must be careful.", "I must go now."],
    phonetic: "/mʌst/",
  },
  my: {
    definition: "belonging to me",
    examples: ["This is my book.", "My name is John."],
    phonetic: "/maɪ/",
  },
  name: {
    definition: "a word by which a person or thing is known",
    examples: ["What's your name?", "My name is Sarah."],
    phonetic: "/neɪm/",
  },
  new: {
    definition: "recently made or obtained",
    examples: ["I have a new car.", "What's new?"],
    phonetic: "/nu/",
  },
  no: {
    definition: "not any; used to refuse",
    examples: ["No, thank you.", "There's no time."],
    phonetic: "/noʊ/",
  },
  not: {
    definition: "used to express negation",
    examples: ["I do not understand.", "It's not true."],
    phonetic: "/nɑt/",
  },
  now: {
    definition: "at the present time",
    examples: ["I'm busy now.", "Now is the time to act."],
    phonetic: "/naʊ/",
  },
  number: {
    definition: "a mathematical unit or numeral",
    examples: ["What's your phone number?", "Pick a number."],
    phonetic: "/ˈnʌmbər/",
  },
  of: {
    definition: "expressing relationship or possession",
    examples: ["The color of the sky.", "A friend of mine."],
    phonetic: "/ʌv/",
  },
  off: {
    definition: "away from a place or position",
    examples: ["Turn off the light.", "Take your shoes off."],
    phonetic: "/ɔf/",
  },
  old: {
    definition: "having lived for a long time",
    examples: ["She's 80 years old.", "This is an old building."],
    phonetic: "/oʊld/",
  },
  on: {
    definition: "in contact with and supported by",
    examples: ["The book is on the table.", "Turn on the TV."],
    phonetic: "/ɑn/",
  },
  one: {
    definition: "the number 1",
    examples: ["I have one brother.", "One day, I'll be rich."],
    phonetic: "/wʌn/",
  },
  only: {
    definition: "no more than; just",
    examples: ["I have only one dollar.", "Only you can help me."],
    phonetic: "/ˈoʊnli/",
  },
  or: {
    definition: "used to connect alternatives",
    examples: ["Tea or coffee?", "Hurry up or you'll be late."],
    phonetic: "/ɔr/",
  },
  other: {
    definition: "different from the one mentioned",
    examples: ["The other book is better.", "On the other hand..."],
    phonetic: "/ˈʌðər/",
  },
  our: {
    definition: "belonging to us",
    examples: ["This is our house.", "Our team won."],
    phonetic: "/aʊər/",
  },
  out: {
    definition: "away from the inside",
    examples: ["Let's go out.", "The fire is out."],
    phonetic: "/aʊt/",
  },
  over: {
    definition: "above; more than",
    examples: ["The plane flew over the city.", "It's over there."],
    phonetic: "/ˈoʊvər/",
  },
  own: {
    definition: "belonging to oneself",
    examples: ["I have my own car.", "She owns a restaurant."],
    phonetic: "/oʊn/",
  },
  part: {
    definition: "a piece or segment of something",
    examples: [
      "This is part of the problem.",
      "I want to be part of the team.",
    ],
    phonetic: "/pɑrt/",
  },
  people: {
    definition: "human beings in general",
    examples: ["Many people were there.", "People are friendly here."],
    phonetic: "/ˈpipəl/",
  },
  place: {
    definition: "a particular position or area",
    examples: ["This is a nice place.", "Put it in the right place."],
    phonetic: "/pleɪs/",
  },
  put: {
    definition: "to place something somewhere",
    examples: ["Put the book on the table.", "Where did you put my keys?"],
    phonetic: "/pʊt/",
  },
  right: {
    definition: "correct; on the right side",
    examples: ["That's the right answer.", "Turn right at the corner."],
    phonetic: "/raɪt/",
  },
  run: {
    definition: "to move quickly on foot",
    examples: ["I run every morning.", "Run to catch the bus."],
    phonetic: "/rʌn/",
  },
  say: {
    definition: "to speak words",
    examples: ["What did you say?", "Say hello to your mother."],
    phonetic: "/seɪ/",
  },
  school: {
    definition: "an institution for learning",
    examples: ["I go to school.", "School starts at 8 AM."],
    phonetic: "/skul/",
  },
  see: {
    definition: "to perceive with the eyes",
    examples: ["I can see you.", "See you later."],
    phonetic: "/si/",
  },
  seem: {
    definition: "to appear to be",
    examples: ["You seem tired.", "It seems like rain."],
    phonetic: "/sim/",
  },
  she: {
    definition: "referring to a female person",
    examples: ["She is my sister.", "Where is she?"],
    phonetic: "/ʃi/",
  },
  small: {
    definition: "little in size",
    examples: ["This is a small room.", "I need a small favor."],
    phonetic: "/smɔl/",
  },
  so: {
    definition: "to such a degree",
    examples: ["It's so hot today.", "So, what happened?"],
    phonetic: "/soʊ/",
  },
  some: {
    definition: "an unspecified amount or number",
    examples: ["I need some help.", "Some people like coffee."],
    phonetic: "/sʌm/",
  },
  take: {
    definition: "to get hold of and carry away",
    examples: ["Take my hand.", "I'll take the bus."],
    phonetic: "/teɪk/",
  },
  than: {
    definition: "used in comparisons",
    examples: ["She's taller than me.", "Better late than never."],
    phonetic: "/ðæn/",
  },
  that: {
    definition: "referring to a specific thing",
    examples: ["That's my car.", "I think that you're right."],
    phonetic: "/ðæt/",
  },
  the: {
    definition: "used to refer to specific things",
    examples: ["The sun is bright.", "Close the door."],
    phonetic: "/ðə/",
  },
  their: {
    definition: "belonging to them",
    examples: ["That's their house.", "Their team won."],
    phonetic: "/ðɛr/",
  },
  them: {
    definition: "referring to people or things as objects",
    examples: ["I saw them yesterday.", "Give it to them."],
    phonetic: "/ðɛm/",
  },
  there: {
    definition: "in that place",
    examples: ["Put it there.", "There are many books."],
    phonetic: "/ðɛr/",
  },
  these: {
    definition: "referring to specific things near the speaker",
    examples: ["These are my books.", "I like these shoes."],
    phonetic: "/ðiz/",
  },
  they: {
    definition: "referring to people or things as subjects",
    examples: ["They are my friends.", "Where are they going?"],
    phonetic: "/ðeɪ/",
  },
  think: {
    definition: "to have an opinion or idea",
    examples: ["I think it's true.", "What do you think?"],
    phonetic: "/θɪŋk/",
  },
  this: {
    definition: "referring to a specific thing near the speaker",
    examples: ["This is my book.", "I like this color."],
    phonetic: "/ðɪs/",
  },
  those: {
    definition: "referring to specific things far from the speaker",
    examples: ["Those are beautiful flowers.", "I want those shoes."],
    phonetic: "/ðoʊz/",
  },
  through: {
    definition: "from one side to the other",
    examples: ["Walk through the door.", "I read through the book."],
    phonetic: "/θru/",
  },
  time: {
    definition: "the indefinite continued progress of existence",
    examples: ["What time is it?", "Time flies."],
    phonetic: "/taɪm/",
  },
  to: {
    definition: "expressing direction or intention",
    examples: ["Go to school.", "I want to help."],
    phonetic: "/tu/",
  },
  too: {
    definition: "also; excessively",
    examples: ["I want to come too.", "It's too hot."],
    phonetic: "/tu/",
  },
  two: {
    definition: "the number 2",
    examples: ["I have two cats.", "Two plus two equals four."],
    phonetic: "/tu/",
  },
  up: {
    definition: "toward a higher place or position",
    examples: ["Look up at the sky.", "Stand up."],
    phonetic: "/ʌp/",
  },
  use: {
    definition: "to employ for a purpose",
    examples: ["Use your brain.", "How do you use this?"],
    phonetic: "/juz/",
  },
  very: {
    definition: "to a high degree",
    examples: ["It's very hot.", "Thank you very much."],
    phonetic: "/ˈvɛri/",
  },
  want: {
    definition: "to have a desire for",
    examples: ["I want some water.", "What do you want?"],
    phonetic: "/wɑnt/",
  },
  water: {
    definition: "a clear liquid essential for life",
    examples: ["I need some water.", "The water is cold."],
    phonetic: "/ˈwɔtər/",
  },
  way: {
    definition: "a method or manner of doing something",
    examples: ["Show me the way.", "That's the right way."],
    phonetic: "/weɪ/",
  },
  we: {
    definition: "referring to the speaker and others",
    examples: ["We are friends.", "Shall we go?"],
    phonetic: "/wi/",
  },
  well: {
    definition: "in a good manner; satisfactorily",
    examples: ["You did well.", "I'm feeling well."],
    phonetic: "/wɛl/",
  },
  what: {
    definition: "asking for information",
    examples: ["What is your name?", "What time is it?"],
    phonetic: "/wʌt/",
  },
  when: {
    definition: "at what time",
    examples: ["When are you coming?", "Tell me when you're ready."],
    phonetic: "/wɛn/",
  },
  where: {
    definition: "at what place",
    examples: ["Where are you?", "Where is the bathroom?"],
    phonetic: "/wɛr/",
  },
  which: {
    definition: "asking for a choice between alternatives",
    examples: ["Which book do you want?", "I don't know which way to go."],
    phonetic: "/wɪtʃ/",
  },
  who: {
    definition: "what person or people",
    examples: ["Who are you?", "Who is coming?"],
    phonetic: "/hu/",
  },
  why: {
    definition: "for what reason",
    examples: ["Why are you sad?", "That's why I came."],
    phonetic: "/waɪ/",
  },
  will: {
    definition: "expressing future tense",
    examples: ["I will help you.", "It will rain tomorrow."],
    phonetic: "/wɪl/",
  },
  with: {
    definition: "accompanied by",
    examples: ["Come with me.", "I agree with you."],
    phonetic: "/wɪð/",
  },
  woman: {
    definition: "an adult female human",
    examples: ["The woman is kind.", "She's a strong woman."],
    phonetic: "/ˈwʊmən/",
  },
  word: {
    definition: "a unit of language",
    examples: ["What does this word mean?", "He didn't say a word."],
    phonetic: "/wɜrd/",
  },
  work: {
    definition: "activity involving effort; employment",
    examples: ["I have work to do.", "Where do you work?"],
    phonetic: "/wɜrk/",
  },
  world: {
    definition: "the earth and all its countries and peoples",
    examples: ["I want to travel the world.", "The world is beautiful."],
    phonetic: "/wɜrld/",
  },
  would: {
    definition: "expressing conditional mood",
    examples: ["I would like some coffee.", "Would you help me?"],
    phonetic: "/wʊd/",
  },
  write: {
    definition: "to form letters or words on a surface",
    examples: ["Write your name here.", "I write in my diary."],
    phonetic: "/raɪt/",
  },
  year: {
    definition: "a period of twelve months",
    examples: ["Happy New Year!", "I'm 25 years old."],
    phonetic: "/jɪr/",
  },
  yes: {
    definition: "used to express agreement",
    examples: ["Yes, I agree.", "Yes, please."],
    phonetic: "/jɛs/",
  },
  you: {
    definition: "referring to the person being addressed",
    examples: ["How are you?", "I see you."],
    phonetic: "/ju/",
  },
  your: {
    definition: "belonging to you",
    examples: ["What's your name?", "Your car is nice."],
    phonetic: "/jʊr/",
  },
};

// Helper function to escape quotes and special characters for TypeScript strings
function escapeString(str) {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r");
}

// Function to get definition for a word
function getDefinition(word, partOfSpeech) {
  if (commonDefinitions[word]) {
    return commonDefinitions[word];
  }

  // Generate a basic definition based on part of speech
  const genericDefinitions = {
    noun: `A ${partOfSpeech} referring to "${word}"`,
    verb: `To ${word} - an action word`,
    adjective: `Describing something as ${word}`,
    adverb: `In a ${word} manner`,
    preposition: `A ${partOfSpeech} indicating relationship: ${word}`,
    conjunction: `A ${partOfSpeech} connecting words: ${word}`,
    pronoun: `A ${partOfSpeech} referring to: ${word}`,
    article: `A ${partOfSpeech}: ${word}`,
    interjection: `An exclamation: ${word}`,
    determiner: `A ${partOfSpeech} indicating: ${word}`,
    "modal verb": `A ${partOfSpeech} expressing: ${word}`,
    "auxiliary verb": `A ${partOfSpeech} helping verb: ${word}`,
    "indefinite article": `A ${partOfSpeech}: ${word}`,
    "definite article": `A ${partOfSpeech}: ${word}`,
    exclamation: `An exclamation: ${word}`,
    number: `The number: ${word}`,
    "ordinal number": `The ordinal number: ${word}`,
  };

  const definition =
    genericDefinitions[partOfSpeech] || `A ${partOfSpeech} meaning: ${word}`;
  const examples = [
    `Example sentence with ${word}.`,
    `Another example using ${word}.`,
  ];
  const phonetic = `/${word}/`;

  return { definition, examples, phonetic };
}

// Read the CSV file
const csvFilePath = path.join(__dirname, "oxford-3000.csv");
const csvContent = fs.readFileSync(csvFilePath, "utf8");

// Parse CSV content
const lines = csvContent.trim().split("\n");
const header = lines[0].split(",");
const data = lines.slice(1).map((line) => {
  const values = line.split(",");
  return {
    word: values[0].trim(),
    class: values[1].trim(),
    level: values[2].trim(),
  };
});

// Group words by level
const wordsByLevel = {
  a1: [],
  a2: [],
  b1: [],
  b2: [],
  c1: [],
};

// Process each word
let idCounter = 1;
data.forEach((item) => {
  const level = item.level.toLowerCase();
  if (wordsByLevel[level]) {
    const id = `${level}_${String(idCounter).padStart(3, "0")}`;
    const wordData = getDefinition(item.word, item.class);

    const vocabularyCard = {
      id: id,
      word: item.word,
      level: item.level.toUpperCase(),
      definition: wordData.definition,
      examples: wordData.examples,
      phonetic: wordData.phonetic,
      partOfSpeech: item.class,
      difficulty:
        level === "a1"
          ? 1
          : level === "a2"
          ? 2
          : level === "b1"
          ? 3
          : level === "b2"
          ? 4
          : 5,
      frequency: idCounter,
      learned: false,
      reviewCount: 0,
      correctCount: 0,
      incorrectCount: 0,
      tags: ["oxford-3000", level, item.class],
    };

    wordsByLevel[level].push(vocabularyCard);
    idCounter++;
  }
});

// Generate TypeScript files for each level
Object.keys(wordsByLevel).forEach((level) => {
  const words = wordsByLevel[level];
  const levelUpper = level.toUpperCase();

  const tsContent = `import { VocabularyCard } from "./types";

// Oxford 3000 ${levelUpper} Level Words - Generated from CSV with Enhanced Definitions
export const ${level}Words: VocabularyCard[] = [
${words
  .map(
    (word) => `  {
    id: "${escapeString(word.id)}",
    word: "${escapeString(word.word)}",
    level: "${escapeString(word.level)}",
    definition: "${escapeString(word.definition)}",
    examples: [${word.examples
      .map((ex) => `"${escapeString(ex)}"`)
      .join(", ")}],
    phonetic: "${escapeString(word.phonetic)}",
    partOfSpeech: "${escapeString(word.partOfSpeech)}",
    difficulty: ${word.difficulty},
    frequency: ${word.frequency},
    learned: ${word.learned},
    reviewCount: ${word.reviewCount},
    correctCount: ${word.correctCount},
    incorrectCount: ${word.incorrectCount},
    tags: [${word.tags.map((tag) => `"${escapeString(tag)}"`).join(", ")}],
  }`
  )
  .join(",\n")}
];

// Export statistics for ${levelUpper} level
export const ${level}WordsStats = {
  totalWords: ${words.length},
  level: "${levelUpper}",
  averageDifficulty: ${words.length > 0 ? words[0].difficulty : 1},
  mostCommonPartOfSpeech: "${escapeString(getMostCommonPartOfSpeech(words))}"
};
`;

  // Write to file
  const filename = `${level}-words-oxford.ts`;
  fs.writeFileSync(path.join(__dirname, filename), tsContent);
  console.log(`Generated ${filename} with ${words.length} words`);
});

// Helper function to get most common part of speech
function getMostCommonPartOfSpeech(words) {
  if (words.length === 0) return "unknown";

  const counts = {};
  words.forEach((word) => {
    counts[word.partOfSpeech] = (counts[word.partOfSpeech] || 0) + 1;
  });

  const keys = Object.keys(counts);
  if (keys.length === 0) return "unknown";

  return keys.reduce((a, b) => (counts[a] > counts[b] ? a : b));
}

// Generate summary statistics
const totalWords = Object.values(wordsByLevel).reduce(
  (sum, words) => sum + words.length,
  0
);
const summary = {
  totalWords,
  wordsByLevel: Object.keys(wordsByLevel).reduce((acc, level) => {
    acc[level] = wordsByLevel[level].length;
    return acc;
  }, {}),
};

console.log("\n=== Oxford 3000 Vocabulary Cards Generated ===");
console.log(`Total words processed: ${totalWords}`);
Object.keys(summary.wordsByLevel).forEach((level) => {
  console.log(`${level.toUpperCase()}: ${summary.wordsByLevel[level]} words`);
});

// Generate an index file that exports all levels
const indexContent = `// Oxford 3000 Vocabulary - Generated from CSV with Enhanced Definitions
${Object.keys(wordsByLevel)
  .map(
    (level) =>
      `export { ${level}Words, ${level}WordsStats } from "./${level}-words-oxford";`
  )
  .join("\n")}

// Combined export for all Oxford 3000 words
import { VocabularyCard } from "./types";
${Object.keys(wordsByLevel)
  .map((level) => `import { ${level}Words } from "./${level}-words-oxford";`)
  .join("\n")}

export const allOxfordWords: VocabularyCard[] = [
${Object.keys(wordsByLevel)
  .map((level) => `  ...${level}Words`)
  .join(",\n")}
];

export const oxfordStats = {
  totalWords: ${totalWords},
  byLevel: {
${Object.keys(wordsByLevel)
  .map((level) => `    ${level}: ${wordsByLevel[level].length}`)
  .join(",\n")}
  }
};
`;

fs.writeFileSync(path.join(__dirname, "oxford-3000-index.ts"), indexContent);
console.log("\nGenerated oxford-3000-index.ts with combined exports");
console.log("\n=== Enhanced with Common Word Definitions ===");
console.log(
  `Enhanced definitions available for ${
    Object.keys(commonDefinitions).length
  } common words`
);
