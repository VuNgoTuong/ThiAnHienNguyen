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
          vi: 'Chào mừng em tới Đảo Làm Quen! Cùng bắt đầu thử thách nhé.',
          en: "Welcome to the Isle of Getting Acquainted! Let's begin.",
        },
      ],
      secretLines: [
        {
          vi: 'Hiền à? Tên dịu dàng quá. Anh chờ em ở đây nhé!',
          en: "Hiền? Such a gentle name. Anh will be right here for you!",
        },
      ],
    },
    discovery: {
      title: { vi: 'Thử Thách Nối Chữ', en: 'Word Chain Trial' },
      story: [
        {
          vi: 'Nối đúng 10 từ liên tiếp cùng anh để vượt qua đảo 1 nha em.',
          en: 'Connect 10 words in a row to clear Island 1.',
        },
      ],
    },
    lessons: [
      {
        id: 'level1-wordchain',
        type: 'word-chain',
        prompt: {
          vi: 'Nối đúng 10 từ liên tiếp. Mỗi lượt 20 giây.',
          en: 'Connect 10 words in a row. 20 seconds per turn.',
        },
        data: { timeLimitMs: 20000 },
      },
    ],
    fragment: {
      id: 'fragment-level1',
      name: { vi: 'Mảnh La Bàn: Khởi Đầu', en: 'Compass Fragment: The Beginning' },
      loreText: {
        vi: 'Mảnh đầu tiên của la bàn — phần thưởng nhỏ cho công chúa đã dám bắt đầu hành trình này.',
        en: 'The first fragment of the compass — a little reward for the princess who dared to begin.',
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
          vi: 'Cập bến Vịnh Ẩn Giấu rồi! Nhìn hình rồi đoán xem đó là gì nhé.',
          en: "We've landed at Hidden Cove! Look at each picture and guess what it is.",
        },
      ],
      secretLines: [
        {
          vi: 'Đảo này giấu kho báu đó Hiền — cố lên em nhé!',
          en: "This island hides a treasure Hiền — you've got this!",
        },
      ],
    },
    discovery: {
      title: { vi: 'Vịnh Ẩn Giấu', en: 'The Hidden Cove' },
      story: [
        {
          vi: 'Nhìn kỹ từng hình rồi chọn đáp án đúng nhé.',
          en: 'Look closely at each picture and choose the right answer.',
        },
      ],
    },
    lessons: [
      {
        id: 'level2-hidden-cove',
        type: 'hidden-cove',
        prompt: {
          vi: 'Nhìn từng hình cho kỹ rồi đoán xem đó là gì nha em.',
          en: 'Look closely at each picture and guess what it is.',
        },
        data: {
          questions: [
            {
              id: 'level2-quiz-1',
              prompt: { vi: 'Nhìn hình và đoán xem đây là gì:', en: 'Look at the picture and guess what it is:' },
              secretPrompt: {
                vi: 'Nhìn hình và đoán xem đây là gì nha em.',
                en: "Look at the picture and guess.",
              },
              emoji: '🍌',
              effect: 'blur',
              options: [
                { id: 'apple', text: { vi: 'Táo', en: 'Apple' } },
                { id: 'banana', text: { vi: 'Chuối', en: 'Banana' } },
                { id: 'orange', text: { vi: 'Cam', en: 'Orange' } },
                { id: 'watermelon', text: { vi: 'Dưa hấu', en: 'Watermelon' } },
              ],
              correctOptionId: 'banana',
            },
            {
              id: 'level2-quiz-2',
              prompt: { vi: 'Còn đây là gì nào:', en: 'And this one:' },
              secretPrompt: {
                vi: 'Đoán xem đây là con gì nha em.',
                en: 'Guess what this animal is.',
              },
              emoji: '🐱',
              effect: 'silhouette',
              options: [
                { id: 'dog', text: { vi: 'Chó', en: 'Dog' } },
                { id: 'cat', text: { vi: 'Mèo', en: 'Cat' } },
                { id: 'chicken', text: { vi: 'Gà', en: 'Chicken' } },
                { id: 'duck', text: { vi: 'Vịt', en: 'Duck' } },
              ],
              correctOptionId: 'cat',
            },
            {
              id: 'level2-quiz-3',
              prompt: { vi: 'Đoán xem đây là hình gì:', en: "What's this:" },
              secretPrompt: {
                vi: 'Đoán xem cái gì đây nha em.',
                en: "Guess what this is.",
              },
              emoji: '⚓',
              effect: 'zoom',
              options: [
                { id: 'compass', text: { vi: 'La Bàn', en: 'Compass' } },
                { id: 'anchor', text: { vi: 'Mỏ Neo', en: 'Anchor' } },
                { id: 'wheel', text: { vi: 'Bánh Lái', en: 'Ship Wheel' } },
                { id: 'sail', text: { vi: 'Cánh Buồm', en: 'Sail' } },
              ],
              correctOptionId: 'anchor',
            },
            {
              id: 'level2-quiz-4',
              prompt: {
                vi: 'Nhìn kỹ đi, hình biến mất nhanh lắm đó:',
                en: 'Look closely — this disappears fast:',
              },
              secretPrompt: {
                vi: 'Chớp mắt là mất hình đó nha em.',
                en: "Blink and it's gone.",
              },
              emoji: '🌴',
              effect: 'flash',
              options: [
                { id: 'palm', text: { vi: 'Cây Dừa', en: 'Palm Tree' } },
                { id: 'pine', text: { vi: 'Cây Thông', en: 'Pine Tree' } },
                { id: 'rose', text: { vi: 'Hoa Hồng', en: 'Rose' } },
                { id: 'grass', text: { vi: 'Cỏ', en: 'Grass' } },
              ],
              correctOptionId: 'palm',
            },
          ],
        },
      },
    ],
    fragment: {
      id: 'fragment-level2',
      name: { vi: 'Mảnh La Bàn II', en: 'Compass Fragment II' },
      loreText: {
        vi: 'Mảnh thứ hai — phần thưởng cho đôi mắt tinh và những lần đoán đúng.',
        en: 'The second fragment — a reward for sharp eyes and good guesses.',
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
        { vi: 'Chào mừng em tới Đảo Thử Thách Level 3!', en: 'Welcome to Level 3 Challenge Isle!' },
      ],
      secretLines: [
        {
          vi: 'Nỗ lực lên Hiền nhé, anh tin em!',
          en: "Keep going Hiền, I believe in you!",
        },
      ],
    },
    discovery: {
      title: { vi: 'Quiz Arena', en: 'Quiz Arena' },
      story: [
        {
          vi: 'Sẵn sàng bước vào Quiz Arena chưa em?',
          en: 'Ready to enter the Quiz Arena?',
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
      name: { vi: 'Mảnh La Bàn: Thử Thách', en: 'Compass Fragment: Challenge' },
      loreText: {
        vi: 'Một mảnh rèn qua thử thách — càng khó càng đáng giá.',
        en: 'A fragment forged through struggle — the harder it was, the more it counts.',
      },
    },
  },
  {
    id: 'level-4-wit',
    name: { vi: 'Đảo Trí Tuệ', en: 'Isle of Wit' },
    level: 4,
    order: 4,
    position: { x: 85, y: 32 },
    arrival: {
      speaker: GUIDE,
      lines: [
        { vi: 'Chào mừng em tới Đảo Trí Tuệ — thử thách cuối cùng!', en: 'Welcome to Isle of Wit — final trial!' },
      ],
      secretLines: [
        {
          vi: 'Cố lên Hiền nhé, anh tin em làm được!',
          en: "You got this Hiền, I believe in you!",
        },
      ],
    },
    discovery: {
      title: { vi: 'Ngọn Hải Đăng Trí Tuệ', en: 'The Lighthouse of Wit' },
      story: [
        {
          vi: 'Một ngọn hải đăng cũ đứng sừng sững giữa đảo, ánh sáng chỉ bật lên cho những ai đủ kiên nhẫn để suy nghĩ — anh tin đó là em.',
          en: "An old lighthouse towers at the center of the island — its light only switches on for those patient enough to think it through. Anh believes that's you.",
        },
      ],
    },
    lessons: [
      {
        id: 'level4-riddle',
        type: 'riddle',
        prompt: {
          vi: '"Cái gì luôn tiến về phía trước mà không bao giờ lùi lại?"',
          en: '"What always moves forward and never goes back?"',
        },
        secretPrompt: {
          vi: '"Cái gì luôn tiến tới mà chẳng bao giờ lùi? Gợi ý: giống như tình cảm anh dành cho em vậy, chỉ có tăng chứ chẳng bao giờ giảm."',
          en: '"What always moves forward and never goes back? Hint: kind of like anh\'s feelings for you — they only ever grow, never fade."',
        },
        data: {
          acceptedAnswers: ['thời gian', 'thời gian trôi', 'time'],
          hints: [
            { vi: 'Nó trôi qua từng giây, từng phút.', en: 'It passes by, second by second.' },
            { vi: 'Không ai có thể quay ngược nó lại.', en: 'No one can turn it back.' },
          ],
        },
      },
    ],
    fragment: {
      id: 'fragment-level4',
      name: { vi: 'Mảnh La Bàn: Trí Tuệ', en: 'Compass Fragment: Wit' },
      loreText: {
        vi: 'Mảnh cuối trước chân trời — phần thưởng cho công chúa thông minh nhất mà anh biết.',
        en: 'The last fragment before the horizon — a reward for the smartest princess anh knows.',
      },
    },
  },
]

export function getIslandById(id) {
  return islands.find((island) => island.id === id) ?? null
}
