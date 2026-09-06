// Content for the 4 regular islands (Levels 1-4). Every user-facing string
// is a `{ vi, en }` pair (see utils/i18n.js). Each island has a `lessons`
// array rather than a single `puzzle` — Level 1 has 5, everyone else has 1
// — so the engine never has to special-case "islands with many lessons".

import { quizQuestions } from './quizAssets.js'
import { island2Content } from './island2Content.js'

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
    name: { vi: 'Những Điều Nhỏ', en: 'Little Things' },
    level: 2,
    order: 2,
    position: { x: 38, y: 45 },
    arrival: {
      speaker: GUIDE,
      lines: [
        {
          vi: 'Đảo thứ hai rồi. Ở đây không có gì phải tìm cả.',
          en: "Second island. There's nothing to search for here.",
        },
      ],
      secretLines: [
        {
          vi: 'Cứ thong thả, An Hiền — không có gì phải vội đâu.',
          en: 'Take it slow, An Hiền — no rush at all.',
        },
      ],
    },
    discovery: {
      title: { vi: 'Những Điều Nhỏ', en: 'Little Things' },
      story: [
        {
          vi: 'Không có câu hỏi khó, không có điểm số.',
          en: 'No hard questions here. No score.',
        },
        {
          vi: 'Chỉ là những lựa chọn nhỏ, để hiểu thêm một chút.',
          en: 'Just small choices, to get to know a little more.',
        },
      ],
    },
    lessons: [
      {
        id: 'level2-hidden-cove',
        type: 'little-things',
        prompt: {
          vi: 'Chọn theo cảm giác của em thôi.',
          en: 'Just go with your gut.',
        },
        data: island2Content,
      },
    ],
    outro: {
      lines: [
        {
          vi: 'Những điều nhỏ, để dành cho lần sau kể tiếp.',
          en: 'Little things — saved for another time.',
        },
      ],
    },
    fragment: {
      id: 'fragment-level2',
      name: { vi: 'Mảnh La Bàn II', en: 'Compass Fragment II' },
      loreText: {
        vi: 'Mảnh thứ hai — cho những điều nhỏ vừa được biết thêm.',
        en: 'The second fragment — for the little things just discovered.',
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
