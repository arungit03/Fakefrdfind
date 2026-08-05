import type { BankQuestion } from '../types/quiz'

/**
 * Original question bank for VibeCheck. Every entry is a "fill in about yourself"
 * style prompt the creator answers, then friends guess. Options are generic
 * placeholders the creator is expected to customize before publishing.
 */
export const QUESTION_BANK: BankQuestion[] = [
  // Favorites
  { id: 'fav-01', question: 'What food could I eat every single day without getting bored?', options: ['Pizza', 'Biryani', 'Noodles', 'Tacos'], category: 'favorites', difficulty: 'easy' },
  { id: 'fav-02', question: 'What is my go-to comfort drink?', options: ['Coffee', 'Tea', 'Boba', 'Soda'], category: 'favorites', difficulty: 'easy' },
  { id: 'fav-03', question: 'Which season do I secretly love the most?', options: ['Summer', 'Winter', 'Monsoon', 'Spring'], category: 'favorites', difficulty: 'easy' },
  { id: 'fav-04', question: 'What is my favorite way to spend a Sunday?', options: ['Sleeping in', 'Outdoors', 'Gaming', 'Hanging out'], category: 'favorites', difficulty: 'medium' },
  { id: 'fav-05', question: 'Which color shows up the most in my wardrobe?', options: ['Black', 'White', 'Blue', 'Pastels'], category: 'favorites', difficulty: 'easy' },
  { id: 'fav-06', question: 'What snack do I always have stashed somewhere?', options: ['Chips', 'Chocolate', 'Cookies', 'Fruit'], category: 'favorites', difficulty: 'medium' },
  { id: 'fav-07', question: 'What is my favorite way to unwind after a long day?', options: ['Music', 'A show', 'A walk', 'Napping'], category: 'favorites', difficulty: 'medium' },
  { id: 'fav-08', question: 'Which app do I open the most without thinking?', options: ['Instagram', 'YouTube', 'WhatsApp', 'TikTok'], category: 'favorites', difficulty: 'easy' },
  { id: 'fav-09', question: 'What is my ultimate comfort meal?', options: ['Mom\'s cooking', 'Fast food', 'Ramen', 'Dessert first'], category: 'favorites', difficulty: 'medium' },
  { id: 'fav-10', question: 'Which day of the week do I like best?', options: ['Friday', 'Saturday', 'Sunday', 'Monday (yes really)'], category: 'favorites', difficulty: 'easy' },

  // Personality
  { id: 'per-01', question: 'How would my friends describe my energy in a group?', options: ['The loud one', 'The quiet observer', 'The planner', 'The chaos agent'], category: 'personality', difficulty: 'medium' },
  { id: 'per-02', question: 'Am I more of a morning person or a night owl?', options: ['Morning person', 'Night owl', 'Depends on mood', 'Neither, I just survive'], category: 'personality', difficulty: 'easy' },
  { id: 'per-03', question: 'What is my biggest strength according to people who know me?', options: ['Loyalty', 'Humor', 'Honesty', 'Patience'], category: 'personality', difficulty: 'medium' },
  { id: 'per-04', question: 'What is my most obvious flaw that I openly admit to?', options: ['Overthinking', 'Stubbornness', 'Laziness', 'Impatience'], category: 'personality', difficulty: 'hard' },
  { id: 'per-05', question: 'How do I usually react when I am stressed?', options: ['Go silent', 'Talk it out', 'Distract myself', 'Get snappy'], category: 'personality', difficulty: 'medium' },
  { id: 'per-06', question: 'Which best describes how I make decisions?', options: ['Overthink everything', 'Go with gut feeling', 'Ask everyone first', 'Flip a coin basically'], category: 'personality', difficulty: 'medium' },
  { id: 'per-07', question: 'Am I more of an introvert or extrovert?', options: ['Introvert', 'Extrovert', 'Ambivert', 'Depends on the group'], category: 'personality', difficulty: 'easy' },
  { id: 'per-08', question: 'What is the first thing people notice about me?', options: ['My laugh', 'My style', 'My energy', 'My voice'], category: 'personality', difficulty: 'medium' },
  { id: 'per-09', question: 'How do I show someone I care about them?', options: ['Acts of service', 'Words', 'Gifts', 'Just showing up'], category: 'personality', difficulty: 'hard' },
  { id: 'per-10', question: 'What am I like when I am really excited about something?', options: ['Talk nonstop', 'Go quiet and smile', 'Text everyone', 'Plan everything out loud'], category: 'personality', difficulty: 'medium' },

  // Food
  { id: 'food-01', question: 'What food would I never willingly try?', options: ['Spicy food', 'Seafood', 'Mushrooms', 'Something exotic'], category: 'food', difficulty: 'medium' },
  { id: 'food-02', question: 'What is my order at a coffee shop?', options: ['Black coffee', 'Sweet latte', 'Iced coffee', 'Hot chocolate'], category: 'food', difficulty: 'easy' },
  { id: 'food-03', question: 'Sweet or spicy — which do I always pick?', options: ['Sweet', 'Spicy', 'Both at once', 'Neither, plain food'], category: 'food', difficulty: 'easy' },
  { id: 'food-04', question: 'What can I actually cook well?', options: ['Eggs', 'Pasta', 'Rice dishes', 'Nothing, I order in'], category: 'food', difficulty: 'medium' },
  { id: 'food-05', question: 'What is my late-night snack of choice?', options: ['Instant noodles', 'Chips', 'Leftovers', 'Ice cream'], category: 'food', difficulty: 'medium' },
  { id: 'food-06', question: 'Which cuisine do I order the most?', options: ['Indian', 'Chinese', 'Italian', 'Fast food'], category: 'food', difficulty: 'easy' },
  { id: 'food-07', question: 'What topping ruins pizza for me?', options: ['Pineapple', 'Olives', 'Extra cheese (no such thing)', 'Mushrooms'], category: 'food', difficulty: 'hard' },
  { id: 'food-08', question: 'How do I take my tea or coffee?', options: ['Strong, no sugar', 'Sweet and milky', 'Iced only', 'I don\'t drink either'], category: 'food', difficulty: 'medium' },

  // Travel
  { id: 'trav-01', question: 'What is one place I would love to visit someday?', options: ['Japan', 'A beach town', 'The mountains', 'A big city abroad'], category: 'travel', difficulty: 'medium' },
  { id: 'trav-02', question: 'Beach vacation or mountain trip — what do I pick?', options: ['Beach', 'Mountains', 'City trip', 'Staycation'], category: 'travel', difficulty: 'easy' },
  { id: 'trav-03', question: 'How do I pack for a trip?', options: ['Overpack everything', 'Bare minimum', 'A detailed list', 'Last minute chaos'], category: 'travel', difficulty: 'medium' },
  { id: 'trav-04', question: 'What is my travel personality?', options: ['Planner with an itinerary', 'Go with the flow', 'Photo-first traveler', 'Food-first traveler'], category: 'travel', difficulty: 'medium' },
  { id: 'trav-05', question: 'Window seat or aisle seat?', options: ['Window', 'Aisle', 'Doesn\'t matter', 'I fall asleep before takeoff'], category: 'travel', difficulty: 'easy' },
  { id: 'trav-06', question: 'What is my dream road trip destination?', options: ['Coastal drive', 'Hill stations', 'Cross-country trip', 'A nearby town I\'ve never seen'], category: 'travel', difficulty: 'hard' },

  // Movies
  { id: 'mov-01', question: 'Which movie genre do I enjoy the most?', options: ['Comedy', 'Horror', 'Romance', 'Action'], category: 'movies', difficulty: 'easy' },
  { id: 'mov-02', question: 'Do I cry during movies?', options: ['Every time', 'Only sad songs', 'Never', 'Only if no one is watching'], category: 'movies', difficulty: 'medium' },
  { id: 'mov-03', question: 'What is my go-to comfort movie or show?', options: ['A sitcom rerun', 'An old favorite', 'Whatever is trending', 'A childhood classic'], category: 'movies', difficulty: 'medium' },
  { id: 'mov-04', question: 'Do I watch trailers before a movie or avoid spoilers?', options: ['Watch everything', 'Avoid all spoilers', 'Read reviews only', 'Don\'t care either way'], category: 'movies', difficulty: 'hard' },
  { id: 'mov-05', question: 'Am I the type to binge a whole season in one sitting?', options: ['Absolutely', 'One episode a night', 'Depends on the show', 'I forget shows exist'], category: 'movies', difficulty: 'medium' },

  // Music
  { id: 'mus-01', question: 'What genre dominates my playlists?', options: ['Pop', 'Hip-hop', 'Indie', 'Lo-fi / instrumental'], category: 'music', difficulty: 'easy' },
  { id: 'mus-02', question: 'Do I know all the lyrics to my favorite song?', options: ['Every single word', 'Just the chorus', 'I hum along', 'I don\'t sing at all'], category: 'music', difficulty: 'medium' },
  { id: 'mus-03', question: 'What is my go-to karaoke song?', options: ['A power ballad', 'A pop hit', 'An old classic', 'I refuse to do karaoke'], category: 'music', difficulty: 'hard' },
  { id: 'mus-04', question: 'Do I listen to music while studying or working?', options: ['Always', 'Only instrumental', 'Never, needs silence', 'Only sometimes'], category: 'music', difficulty: 'medium' },
  { id: 'mus-05', question: 'What kind of concert would I want to go to?', options: ['A huge stadium show', 'A small indie gig', 'A DJ set', 'I\'d rather stay home'], category: 'music', difficulty: 'medium' },

  // Gaming
  { id: 'gam-01', question: 'What type of game do I play the most?', options: ['Mobile games', 'Console games', 'PC games', 'I don\'t really game'], category: 'gaming', difficulty: 'easy' },
  { id: 'gam-02', question: 'Am I a rage quitter or calm under pressure in games?', options: ['Total rage quitter', 'Stays calm', 'Trash talks instead', 'Just laughs it off'], category: 'gaming', difficulty: 'medium' },
  { id: 'gam-03', question: 'What game could I play for hours without noticing time pass?', options: ['A battle royale', 'A puzzle game', 'An open-world game', 'A mobile time-killer'], category: 'gaming', difficulty: 'medium' },
  { id: 'gam-04', question: 'Do I prefer playing alone or with friends?', options: ['Solo', 'Squad only', 'Random online teams', 'Local co-op with friends'], category: 'gaming', difficulty: 'easy' },

  // College
  { id: 'col-01', question: 'Which subject do I enjoy the most?', options: ['Math', 'Art', 'Science', 'Literature'], category: 'college', difficulty: 'easy' },
  { id: 'col-02', question: 'Where do I sit in class or lectures?', options: ['Front row', 'Back row', 'Middle, blending in', 'Wherever my friends are'], category: 'college', difficulty: 'medium' },
  { id: 'col-03', question: 'How do I usually study before an exam?', options: ['Start weeks early', 'Cram the night before', 'Group study', 'Flashcards everywhere'], category: 'college', difficulty: 'medium' },
  { id: 'col-04', question: 'What was my best subject growing up?', options: ['Math', 'History', 'PE', 'Art class'], category: 'college', difficulty: 'medium' },
  { id: 'col-05', question: 'What club or activity would I realistically join?', options: ['Sports team', 'Music or drama', 'Debate or quiz club', 'None, I\'d skip it'], category: 'college', difficulty: 'hard' },

  // Childhood
  { id: 'chi-01', question: 'What was my favorite cartoon growing up?', options: ['A classic 90s/2000s show', 'An anime', 'A superhero cartoon', 'I don\'t remember much'], category: 'childhood', difficulty: 'medium' },
  { id: 'chi-02', question: 'What did I want to be when I grew up as a kid?', options: ['A doctor', 'An athlete', 'An artist', 'Something totally random'], category: 'childhood', difficulty: 'medium' },
  { id: 'chi-03', question: 'What was my favorite game to play as a child?', options: ['Hide and seek', 'A video game', 'Something outdoors', 'Board games'], category: 'childhood', difficulty: 'easy' },
  { id: 'chi-04', question: 'Did I have a nickname growing up?', options: ['Yes, an embarrassing one', 'Yes, a sweet one', 'A few different ones', 'No, just my name'], category: 'childhood', difficulty: 'hard' },
  { id: 'chi-05', question: 'What is one thing I was scared of as a kid?', options: ['The dark', 'Insects', 'Loud noises', 'Nothing really'], category: 'childhood', difficulty: 'hard' },

  // Habits
  { id: 'hab-01', question: 'What is my biggest habit that everyone notices?', options: ['Checking my phone constantly', 'Overthinking out loud', 'Being late', 'Talking with my hands'], category: 'habits', difficulty: 'medium' },
  { id: 'hab-02', question: 'Am I usually early, on time, or late?', options: ['Always early', 'Right on time', 'Fashionably late', 'Consistently late'], category: 'habits', difficulty: 'easy' },
  { id: 'hab-03', question: 'What do I do first thing when I wake up?', options: ['Check my phone', 'Stretch or exercise', 'Make coffee/tea', 'Go back to sleep once more'], category: 'habits', difficulty: 'medium' },
  { id: 'hab-04', question: 'How organized is my room or desk usually?', options: ['Spotless', 'Organized chaos', 'A little messy', 'Full disaster zone'], category: 'habits', difficulty: 'medium' },
  { id: 'hab-05', question: 'What is my most-used emoji in texts?', options: ['😂', '❤️', '💀', '👍'], category: 'habits', difficulty: 'medium' },
  { id: 'hab-06', question: 'How do I usually respond to texts?', options: ['Instantly', 'Within a few hours', 'A day later', 'Whenever I remember'], category: 'habits', difficulty: 'easy' },

  // Dreams
  { id: 'dre-01', question: 'What is my dream career?', options: ['Something creative', 'Something in tech', 'Something that helps people', 'I still don\'t know'], category: 'dreams', difficulty: 'hard' },
  { id: 'dre-02', question: 'If money wasn\'t a problem, what would I do with my life?', options: ['Travel the world', 'Start a business', 'Learn new skills', 'Just relax honestly'], category: 'dreams', difficulty: 'hard' },
  { id: 'dre-03', question: 'What skill do I wish I could instantly master?', options: ['Playing an instrument', 'Speaking another language', 'Cooking', 'A sport'], category: 'dreams', difficulty: 'medium' },
  { id: 'dre-04', question: 'Where do I see myself living someday?', options: ['A big city', 'A quiet town', 'Near the beach', 'Somewhere abroad'], category: 'dreams', difficulty: 'hard' },
  { id: 'dre-05', question: 'What is one goal I am currently working toward?', options: ['A career goal', 'A fitness goal', 'A personal project', 'Honestly just figuring life out'], category: 'dreams', difficulty: 'hard' },

  // Funny
  { id: 'fun-01', question: 'What usually makes me laugh the hardest?', options: ['Dumb puns', 'Physical comedy', 'Sarcasm', 'Inside jokes'], category: 'funny', difficulty: 'medium' },
  { id: 'fun-02', question: 'What is my most-used phrase or catchphrase?', options: ['"Literally"', '"No way"', '"I\'m dead"', 'Something only friends would know'], category: 'funny', difficulty: 'hard' },
  { id: 'fun-03', question: 'What would my friends say is my most chaotic trait?', options: ['Random 2am texts', 'Impulsive plans', 'Overreacting to small things', 'Disappearing mid-conversation'], category: 'funny', difficulty: 'hard' },
  { id: 'fun-04', question: 'What is my most irrational fear?', options: ['Clowns', 'Deep water', 'Something oddly specific', 'I don\'t scare easily'], category: 'funny', difficulty: 'hard' },
  { id: 'fun-05', question: 'How do I react when someone tells a bad joke?', options: ['Laugh anyway', 'Groan loudly', 'Deadpan stare', 'Roast them back'], category: 'funny', difficulty: 'medium' },

  // Friendship
  { id: 'frd-01', question: 'What do I value most in a friendship?', options: ['Honesty', 'Loyalty', 'Humor', 'Someone who just gets me'], category: 'friendship', difficulty: 'medium' },
  { id: 'frd-02', question: 'What usually makes me angry at a friend?', options: ['Being flaky', 'Being dishonest', 'Being ignored', 'Not much really'], category: 'friendship', difficulty: 'hard' },
  { id: 'frd-03', question: 'What is my love language with friends?', options: ['Quality time', 'Inside jokes', 'Being there in tough times', 'Random check-ins'], category: 'friendship', difficulty: 'hard' },
  { id: 'frd-04', question: 'What would I do on a perfect day with friends?', options: ['A road trip', 'A movie night in', 'Trying new food', 'Just talking for hours'], category: 'friendship', difficulty: 'medium' },
  { id: 'frd-05', question: 'How do I usually make plans — spontaneous or scheduled?', options: ['Totally spontaneous', 'Planned days ahead', 'Depends on the mood', 'I just show up when invited'], category: 'friendship', difficulty: 'medium' },
  { id: 'frd-06', question: 'What kind of gift would make me happiest?', options: ['Something thoughtful and personal', 'Something practical', 'An experience together', 'Honestly, just their time'], category: 'friendship', difficulty: 'medium' },

  // Random
  { id: 'ran-01', question: 'What would I choose on a completely free day with no plans?', options: ['Stay in bed', 'Go outside', 'Binge a show', 'Hang out with someone'], category: 'random', difficulty: 'easy' },
  { id: 'ran-02', question: 'What is my favorite time of day?', options: ['Early morning', 'Afternoon', 'Evening', 'Late night'], category: 'random', difficulty: 'easy' },
  { id: 'ran-03', question: 'If I could have any superpower, what would I pick?', options: ['Teleportation', 'Mind reading', 'Flying', 'Time travel'], category: 'random', difficulty: 'medium' },
  { id: 'ran-04', question: 'What is my zodiac element energy, honestly?', options: ['Fire — bold', 'Water — emotional', 'Earth — grounded', 'Air — unpredictable'], category: 'random', difficulty: 'hard' },
  { id: 'ran-05', question: 'Cats or dogs — which team am I on?', options: ['Dogs', 'Cats', 'Both equally', 'Neither, honestly'], category: 'random', difficulty: 'easy' },
  { id: 'ran-06', question: 'What would be my go-to karaoke or shower song?', options: ['A pop anthem', 'A sad ballad', 'A throwback hit', 'I don\'t sing, ever'], category: 'random', difficulty: 'medium' },
  { id: 'ran-07', question: 'What is one thing on my bucket list?', options: ['Skydiving', 'Visiting a new country', 'Learning an instrument', 'Something totally unexpected'], category: 'random', difficulty: 'hard' },
  { id: 'ran-08', question: 'How do I handle waiting in a long line?', options: ['Scroll my phone', 'Chat with strangers', 'Get impatient fast', 'Zone out completely'], category: 'random', difficulty: 'medium' },
  { id: 'ran-09', question: 'What is my ideal weather?', options: ['Sunny and warm', 'Rainy and cozy', 'Cool and breezy', 'Snowy'], category: 'random', difficulty: 'easy' },
  { id: 'ran-10', question: 'If I won a small lottery tomorrow, what\'s the first thing I\'d buy?', options: ['Travel tickets', 'Tech gadgets', 'Save it all', 'Treat my friends'], category: 'random', difficulty: 'hard' },
  { id: 'ran-11', question: 'What is my texting style?', options: ['Short and quick', 'Long paragraphs', 'All emojis and gifs', 'Voice notes instead'], category: 'random', difficulty: 'medium' },
  { id: 'ran-12', question: 'What is the one app I could not live without?', options: ['Messaging app', 'Social media app', 'Music app', 'Maps app'], category: 'random', difficulty: 'easy' },
  { id: 'ran-13', question: 'What is my hidden talent?', options: ['Cooking', 'Drawing', 'Mimicking voices', 'Remembering random facts'], category: 'random', difficulty: 'hard' },
  { id: 'ran-14', question: 'What is my biggest pet peeve?', options: ['Loud chewing', 'Being interrupted', 'Messiness', 'Lateness'], category: 'random', difficulty: 'medium' },
  { id: 'ran-15', question: 'What would my autobiography be titled?', options: ['Something dramatic', 'Something funny', 'Something inspiring', 'Something totally random'], category: 'random', difficulty: 'hard' },

  // More Favorites / Personality mix to reach 100+
  { id: 'fav-11', question: 'What dessert can I never say no to?', options: ['Chocolate', 'Ice cream', 'Cake', 'Something fruity'], category: 'favorites', difficulty: 'easy' },
  { id: 'fav-12', question: 'What is my favorite outfit to wear when I feel my best?', options: ['Casual comfy fit', 'Streetwear', 'Something dressy', 'Whatever is clean'], category: 'favorites', difficulty: 'medium' },
  { id: 'per-11', question: 'How do I handle conflict with someone close to me?', options: ['Address it right away', 'Need space first', 'Avoid it if possible', 'Talk it out calmly'], category: 'personality', difficulty: 'hard' },
  { id: 'per-12', question: 'What motivates me the most?', options: ['Making people proud', 'Personal growth', 'Achieving goals', 'Just having fun'], category: 'personality', difficulty: 'hard' },
  { id: 'hab-07', question: 'What is my screen time usually like?', options: ['Way too high', 'Pretty average', 'Surprisingly low', 'I don\'t track it'], category: 'habits', difficulty: 'medium' },
  { id: 'hab-08', question: 'What do I do when I can\'t fall asleep?', options: ['Scroll my phone', 'Listen to music', 'Read something', 'Just lie there overthinking'], category: 'habits', difficulty: 'medium' },
  { id: 'dre-06', question: 'What is a hobby I want to pick up someday?', options: ['Painting', 'An instrument', 'A sport', 'Photography'], category: 'dreams', difficulty: 'medium' },
  { id: 'frd-07', question: 'What is the most spontaneous thing I have ever done with a friend?', options: ['A random road trip', 'A last-minute concert', 'A late-night adventure', 'Nothing too wild, honestly'], category: 'friendship', difficulty: 'hard' },
  { id: 'mov-06', question: 'Would I rather rewatch an old favorite or try something new?', options: ['Rewatch a favorite', 'Always try something new', 'Depends on my mood', 'Ask friends for recommendations'], category: 'movies', difficulty: 'medium' },
  { id: 'gam-05', question: 'What was the first game I ever fell in love with?', options: ['A mobile game', 'A console classic', 'A PC game', 'I don\'t really remember'], category: 'gaming', difficulty: 'hard' },
]

export function getQuestionsByCategory(category: string): BankQuestion[] {
  return QUESTION_BANK.filter((q) => q.category === category)
}

export function getRandomQuestions(count: number, excludeIds: string[] = []): BankQuestion[] {
  const pool = QUESTION_BANK.filter((q) => !excludeIds.includes(q.id))
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
