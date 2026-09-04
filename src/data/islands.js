// Content for the 4 regular islands (Levels 1-4). Every user-facing string
// is a `{ vi, en }` pair (see utils/i18n.js). Each island has a `lessons`
// array rather than a single `puzzle` — Level 1 has 5, everyone else has 1
// — so the engine never has to special-case "islands with many lessons".

import { quizQuestions } from './quizAssets.js'

const GUIDE = { vi: 'Người Dẫn Đường', en: 'The Guide' }

export const islands = [
  {
    id: 'level-1-outset',
    name: { vi: 'Đảo Làm Quen', en: 'Isle of Getting Acquainted' },
    level: 1,
    order: 1,
    position: { x: 14, y: 78 },
    arrival: {
      speaker: GUIDE,
      lines: [
        {
          vi: 'Đảo đầu tiên rồi nè. Không có gì to tát đâu — chỉ là nối chữ với anh thôi.',
          en: "First island. Nothing fancy — just chain words with me.",
        },
      ],
      secretLines: [
        {
          vi: 'Ê An Hiền, sẵn sàng chưa? Đảo này dễ ợt à kkk!',
          en: "Hey An Hiền, ready? This island's easy kkk!",
        },
      ],
    },
    discovery: {
      title: { vi: 'Chúng Ta Bắt Đầu Như Thế Nào?', en: 'How Did We Begin?' },
      story: [
        {
          vi: 'Nối đúng 10 từ liên tiếp cùng anh nha. Không cần nghĩ nhiều đâu — cứ để chữ dẫn đường.',
          en: "Chain 10 words in a row with me. Don't overthink it — just let the words lead the way.",
        },
      ],
    },
    lessons: [
      {
        id: 'level1-wordchain',
        type: 'word-chain',
        prompt: {
          vi: 'Nối đúng 10 từ liên tiếp. Mỗi lượt có 20 giây.',
          en: 'Connect 10 words in a row. 20 seconds per turn.',
        },
        data: { timeLimitMs: 20000 },
      },
    ],
    outro: {
      lines: [
        {
          vi: 'Có những cuộc gặp gỡ nhìn thì rất bình thường...',
          en: 'Some meetings look completely ordinary at first...',
        },
        {
          vi: '...nhưng lại trở thành một phần rất đặc biệt trong cuộc đời mình.',
          en: '...but end up becoming a very special part of your life.',
        },
      ],
    },
    fragment: {
      id: 'fragment-level1',
      name: { vi: 'Mảnh La Bàn: Khởi Đầu', en: 'Compass Fragment: The Beginning' },
      loreText: {
        vi: 'Mảnh đầu tiên của la bàn — cho ngày mình bắt đầu.',
        en: 'The first fragment of the compass — for the day we began.',
      },
    },
  },
  {
    id: 'level-2-mystery',
    name: { vi: 'Vịnh Ẩn Giấu', en: 'The Hidden Cove' },
    level: 2,
    order: 2,
    position: { x: 38, y: 45 },
    arrival: {
      speaker: GUIDE,
      lines: [
        {
          vi: 'Cập bến Vịnh Ẩn Giấu rồi. Ở đây, em sẽ thử đoán xem anh thật sự thích gì nha.',
          en: "We've landed at the Hidden Cove. Here, you'll try to guess what I actually like.",
        },
      ],
      secretLines: [
        {
          vi: 'Xem em hiểu anh cỡ nào nha công chúa An Hiền kkk!',
          en: "Let's see how well you know me, princess An Hiền kkk!",
        },
      ],
    },
    discovery: {
      title: { vi: 'Em Hiểu Anh Không?', en: 'Do You Understand Me?' },
      story: [
        {
          vi: 'Vài câu hỏi nhỏ thôi, không có gì căng thẳng đâu. Cứ chọn theo cảm giác của em.',
          en: "A few small questions, nothing stressful. Just go with your gut.",
        },
      ],
    },
    lessons: [
      {
        id: 'level2-hidden-cove',
        type: 'hidden-cove',
        prompt: {
          vi: 'Chọn điều em nghĩ đúng nhất về anh nha — sai cũng không sao đâu!',
          en: "Pick what you think is truest about me — it's okay to get it wrong!",
        },
        data: {
          wrongReactions: [
            { vi: 'Hmm... anh sẽ cho em thêm một cơ hội 😏', en: "Hmm... I'll give you one more shot 😏" },
            { vi: 'Chưa đúng lắm đâu nha.', en: "Not quite yet." },
            { vi: 'Gần rồi, thử lại xem.', en: "Close — try again." },
          ],
          correctReactions: [
            { vi: 'Đúng rồi. Em hiểu anh ghê.', en: "Right. You really do know me." },
            { vi: 'Chuẩn luôn đó.', en: "Exactly that." },
            { vi: 'Ừ, đúng vậy đó em.', en: "Yep, that's it." },
          ],
          questions: [
            {
              id: 'level2-quiz-1',
              prompt: { vi: 'Khi anh mệt, anh thường muốn...', en: 'When I\'m tired, I usually want...' },
              secretPrompt: {
                vi: 'Đoán xem khi mệt anh thích gì nào công chúa.',
                en: "Guess what I want when I'm tired.",
              },
              emoji: '😴',
              effect: 'blur',
              options: [
                { id: 'coffee', text: { vi: 'Một ly cà phê ☕', en: 'A cup of coffee ☕' } },
                { id: 'game', text: { vi: 'Chơi game 🎮', en: 'Play a game 🎮' } },
                { id: 'rest', text: { vi: 'Nằm im một chút 😴', en: 'Just lie down for a bit 😴' } },
                { id: 'hug', text: { vi: 'Được em ôm 🤗', en: 'Get a hug from you 🤗' } },
              ],
              correctOptionId: 'rest',
            },
            {
              id: 'level2-quiz-2',
              prompt: { vi: 'Nếu được chọn một buổi hẹn, anh sẽ chọn...', en: 'If I got to pick a date, I\'d choose...' },
              secretPrompt: {
                vi: 'Đoán xem anh thích đi đâu nha công chúa.',
                en: "Guess where I'd want to go.",
              },
              emoji: '🌊',
              effect: 'silhouette',
              options: [
                { id: 'sea', text: { vi: 'Đi biển 🌊', en: 'The beach 🌊' } },
                { id: 'food', text: { vi: 'Đi ăn 🍜', en: 'Get food 🍜' } },
                { id: 'movie', text: { vi: 'Xem phim 🎬', en: 'Watch a movie 🎬' } },
                { id: 'night', text: { vi: 'Đi dạo buổi tối 🌃', en: 'A night walk 🌃' } },
              ],
              correctOptionId: 'sea',
            },
            {
              id: 'level2-quiz-3',
              prompt: { vi: 'Điều gì dễ khiến anh vui nhất?', en: 'What makes me happiest, easiest?' },
              secretPrompt: {
                vi: 'Đoán xem điều gì làm anh vui nha em.',
                en: 'Guess what makes me happy.',
              },
              emoji: '😂',
              effect: 'zoom',
              options: [
                { id: 'message', text: { vi: 'Một tin nhắn bất ngờ 💬', en: 'A surprise text 💬' } },
                { id: 'meal', text: { vi: 'Được ăn món ngon 🍔', en: 'A good meal 🍔' } },
                { id: 'laugh', text: { vi: 'Em chọc anh cười 😂', en: 'You making me laugh 😂' } },
                { id: 'hug2', text: { vi: 'Một cái ôm 🤍', en: 'A hug 🤍' } },
              ],
              correctOptionId: 'laugh',
            },
            {
              id: 'level2-quiz-4',
              prompt: {
                vi: 'Nếu có một ngày rảnh trọn vẹn, anh sẽ...',
                en: 'If I had a whole free day, I\'d...',
              },
              secretPrompt: {
                vi: 'Chớp mắt là mất hình đó nha công chúa kkk!',
                en: "Blink and it's gone, kkk!",
              },
              emoji: '💛',
              effect: 'flash',
              options: [
                { id: 'sleep', text: { vi: 'Ngủ nướng cả ngày 😪', en: 'Sleep in all day 😪' } },
                { id: 'outdoor', text: { vi: 'Ra ngoài đổi gió 🚶', en: 'Get out for some air 🚶' } },
                { id: 'withYou', text: { vi: 'Ở nhà với em 💛', en: 'Stay home with you 💛' } },
                { id: 'explore', text: { vi: 'Nghe nhạc một mình 🎧', en: 'Listen to music alone 🎧' } },
              ],
              correctOptionId: 'withYou',
            },
          ],
        },
      },
    ],
    fragment: {
      id: 'fragment-level2',
      name: { vi: 'Mảnh La Bàn II', en: 'Compass Fragment II' },
      loreText: {
        vi: 'Mảnh thứ hai — cho những lần em đoán trúng anh.',
        en: 'The second fragment — for the times you guessed me right.',
      },
    },
  },
  {
    id: 'level-3-challenge',
    name: { vi: 'Đảo Thử Thách', en: 'Isle of Challenge' },
    level: 3,
    order: 3,
    position: { x: 65, y: 62 },
    arrival: {
      speaker: GUIDE,
      lines: [
        { vi: 'Đảo thứ ba rồi nè. Lần này tới lượt em nhớ lại chuyện của tụi mình.', en: "Third island. This time, it's your turn to remember us." },
      ],
      secretLines: [
        {
          vi: 'Cố nhớ nha công chúa An Hiền, anh tin trí nhớ em ngon lắm kkk!',
          en: "Try to remember, princess An Hiền, I trust that memory of yours kkk!",
        },
      ],
    },
    discovery: {
      title: { vi: 'Chuyện Của Chúng Ta', en: 'Our Story' },
      story: [
        {
          vi: 'Vài câu hỏi nhỏ về những gì tụi mình đã cùng đi qua. Em còn nhớ không?',
          en: "A few small questions about what we've been through together. Do you still remember?",
        },
      ],
    },
    lessons: [
      {
        id: 'level3-quiz-arena',
        type: 'quiz-arena',
        data: { questions: quizQuestions },
      },
    ],
    fragment: {
      id: 'fragment-level3',
      name: { vi: 'Mảnh La Bàn: Kỷ Niệm', en: 'Compass Fragment: Memories' },
      loreText: {
        vi: 'Mảnh la bàn ghép từ những chuyện em còn nhớ về tụi mình.',
        en: 'A fragment pieced together from what you still remember about us.',
      },
    },
  },
  {
    id: 'level-4-wit',
    name: { vi: 'Đảo Những Điều Nhỏ', en: 'Isle of Little Things' },
    level: 4,
    order: 4,
    position: { x: 85, y: 32 },
    arrival: {
      speaker: GUIDE,
      lines: [
        { vi: 'Đảo cuối trước khi mình về lại rồi nè. Lần này anh thử đoán về em nha.', en: "Last island before we head back. This time, let me guess about you." },
      ],
      secretLines: [
        {
          vi: 'Đoán trúng hay trật cũng vui hết á, An Hiền kkk!',
          en: "Right or wrong, it's all fun, An Hiền kkk!",
        },
      ],
    },
    discovery: {
      title: { vi: 'Những Điều Nhỏ Xíu', en: 'Little Things' },
      story: [
        {
          vi: 'Không có gì to tát đâu — chỉ là những điều nhỏ về em thôi. Anh đoán, em nói đúng hay sai nha.',
          en: "Nothing big — just little things about you. I'll guess, you tell me right or wrong.",
        },
      ],
    },
    lessons: [
      {
        id: 'level4-ai-guess',
        type: 'ai-guess',
        data: {},
      },
    ],
    fragment: {
      id: 'fragment-level4',
      name: { vi: 'Mảnh La Bàn: Những Điều Nhỏ', en: 'Compass Fragment: Little Things' },
      loreText: {
        vi: 'Mảnh la bàn cuối rồi nè — cho những điều nhỏ mà anh để ý ở em.',
        en: 'The final fragment — for the little things about you I noticed.',
      },
    },
  },
]

export function getIslandById(id) {
  return islands.find((island) => island.id === id) ?? null
}
