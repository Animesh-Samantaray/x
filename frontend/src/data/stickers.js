

export const STICKER_CATEGORIES = [
  { id: "all", label: "All", icon: "✨" },
  { id: "popular", label: "Popular", icon: "🔥" },
  { id: "love", label: "Love", icon: "❤️" },
  { id: "happy", label: "Happy", icon: "😊" },
  { id: "laugh", label: "Laugh", icon: "😂" },
  { id: "reactions", label: "Reactions", icon: "👍" },
  { id: "celebration", label: "Party", icon: "🎉" },
  { id: "sad", label: "Sad", icon: "😢" },
  { id: "thanks", label: "Thanks", icon: "🙏" },
  { id: "funny", label: "Funny", icon: "🤪" },
];

export const STICKERS = [
 
  { id: "sticker-1", emoji: "❤️", label: "Red Heart", category: "love", popular: true },
  { id: "sticker-2", emoji: "👍", label: "Thumbs Up", category: "reactions", popular: true },
  { id: "sticker-3", emoji: "😂", label: "Joy Laugh", category: "laugh", popular: true },
  { id: "sticker-4", emoji: "🔥", label: "Fire", category: "reactions", popular: true },
  { id: "sticker-5", emoji: "🎉", label: "Party Popper", category: "celebration", popular: true },
  { id: "sticker-6", emoji: "😊", label: "Smile", category: "happy", popular: true },
  { id: "sticker-7", emoji: "🙏", label: "Folded Hands", category: "thanks", popular: true },
  { id: "sticker-8", emoji: "🚀", label: "Rocket", category: "celebration", popular: true },

 
  { id: "sticker-9", emoji: "😍", label: "Heart Eyes", category: "love", popular: true },
  { id: "sticker-10", emoji: "🥰", label: "Smiley with Hearts", category: "love" },
  { id: "sticker-11", emoji: "😘", label: "Blow Kiss", category: "love" },
  { id: "sticker-12", emoji: "💖", label: "Sparkle Heart", category: "love" },
  { id: "sticker-13", emoji: "💕", label: "Two Hearts", category: "love" },
  { id: "sticker-14", emoji: "💓", label: "Beating Heart", category: "love" },


  { id: "sticker-15", emoji: "🥳", label: "Partying Face", category: "happy", popular: true },
  { id: "sticker-16", emoji: "🤩", label: "Star-Struck", category: "happy" },
  { id: "sticker-17", emoji: "😁", label: "Beaming Smile", category: "happy" },
  { id: "sticker-18", emoji: "✨", label: "Sparkles", category: "happy" },
  { id: "sticker-19", emoji: "🌟", label: "Glowing Star", category: "happy" },
  { id: "sticker-20", emoji: "😎", label: "Cool Glasses", category: "happy" },

  
  { id: "sticker-21", emoji: "🤣", label: "Rolling Laugh", category: "laugh" },
  { id: "sticker-22", emoji: "😹", label: "Cat Laugh", category: "laugh" },
  { id: "sticker-23", emoji: "😜", label: "Wink Tongue", category: "laugh" },
  { id: "sticker-24", emoji: "🤭", label: "Hand over Mouth", category: "laugh" },
  { id: "sticker-25", emoji: "💀", label: "Dead Laughing", category: "laugh" },

  
  { id: "sticker-26", emoji: "🙌", label: "Raising Hands", category: "reactions" },
  { id: "sticker-27", emoji: "👏", label: "Clapping", category: "reactions" },
  { id: "sticker-28", emoji: "💡", label: "Idea", category: "reactions" },
  { id: "sticker-29", emoji: "💯", label: "100 Points", category: "reactions" },
  { id: "sticker-30", emoji: "⚡", label: "High Voltage", category: "reactions" },
  { id: "sticker-31", emoji: "💪", label: "Flex Muscle", category: "reactions" },
  { id: "sticker-32", emoji: "🤝", label: "Handshake", category: "reactions" },


  { id: "sticker-33", emoji: "🎂", label: "Birthday Cake", category: "celebration" },
  { id: "sticker-34", emoji: "🏆", label: "Trophy", category: "celebration" },
  { id: "sticker-35", emoji: "🥂", label: "Clinking Glasses", category: "celebration" },
  { id: "sticker-36", emoji: "👑", label: "Crown", category: "celebration" },


  { id: "sticker-37", emoji: "😢", label: "Crying Face", category: "sad" },
  { id: "sticker-38", emoji: "😭", label: "Loud Crying", category: "sad" },
  { id: "sticker-39", emoji: "🥺", label: "Pleading Face", category: "sad" },
  { id: "sticker-40", emoji: "😔", label: "Pensive Face", category: "sad" },


  { id: "sticker-41", emoji: "🤝", label: "Agreement", category: "thanks" },
  { id: "sticker-42", emoji: "💐", label: "Bouquet", category: "thanks" },
  { id: "sticker-43", emoji: "🎁", label: "Gift Box", category: "thanks" },


  { id: "sticker-44", emoji: "🤪", label: "Zany Face", category: "funny" },
  { id: "sticker-45", emoji: "🤯", label: "Exploding Head", category: "funny" },
  { id: "sticker-46", emoji: "🤖", label: "Robot", category: "funny" },
  { id: "sticker-47", emoji: "👻", label: "Ghost", category: "funny" },
  { id: "sticker-48", emoji: "🦄", label: "Unicorn", category: "funny" },
  { id: "sticker-49", emoji: "👀", label: "Eyes Look", category: "funny" },
  { id: "sticker-50", emoji: "🍕", label: "Pizza Slice", category: "funny" },
];


const STICKER_EMOJI_SET = new Set(STICKERS.map((s) => s.emoji));


export const isStickerMessage = (text) => {
  if (!text || typeof text !== "string") return false;
  const trimmed = text.trim();
  if (STICKER_EMOJI_SET.has(trimmed)) return true;

  const emojiRegex = /^(?:\p{Extended_Pictographic}|\p{Emoji_Presentation}|\p{Emoji_Modifier_Base}|\p{Emoji_Component}){1,2}$/u;
  return emojiRegex.test(trimmed);
};
