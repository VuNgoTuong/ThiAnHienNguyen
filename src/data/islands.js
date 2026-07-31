// Content for the 4 regular islands (Levels 1-4). Every user-facing string
// is a `{ vi, en }` pair (see utils/i18n.js). Each island has a `lessons`
// array rather than a single `puzzle` — Level 1 has 5, everyone else has 1
// — so the engine never has to special-case "islands with many lessons".

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
          vi: 'Chào tới Đảo Làm Quen — Level đầu tiên của hành trình you đó.',
          en: "Welcome to the Isle of Getting Acquainted — the first level of your journey.",
        },
        {
          vi: 'Không có câu đố hóc búa gì ở đây đâu, chỉ là vài câu hỏi và một ván nối chữ cho vui thôi.',
          en: "No brain-teasers here — just a few questions and a round of word-chain for fun.",
        },
      ],
      secretLines: [
        {
          vi: 'Khoan đã... "Hiền" á? Tên hiền lành vậy mà dám một mình ra khơi, gan dữ ha.',
          en: 'Wait... "Hiền"? Such a sweet name daring to sail out alone — ballsy.',
        },
        {
          vi: 'Được rồi, tao để mắt tới you đặc biệt chút đó. Lười biếng giữa chừng là biết tay tao!',
          en: "Alright, I'll keep a special eye on you. Slack off halfway through and you'll answer to me!",
        },
      ],
    },
    discovery: {
      title: { vi: 'Làm Quen', en: 'Getting Acquainted' },
      story: [
        {
          vi: 'Đảo này không thử bộ não you đâu — chỉ để tao hiểu you hơn một chút, rồi nối chữ với tao một ván cho vui.',
          en: "This island isn't testing your brain — just a chance for me to get to know you a little, then a round of word-chain for fun.",
        },
        { vi: 'Sẵn sàng chưa?', en: 'Ready?' },
      ],
    },
    lessons: [
      {
        id: 'level1-question-1',
        type: 'open-question',
        prompt: {
          vi: 'Điều gì khiến bạn vui nhất trong một ngày bình thường?',
          en: 'What makes you happiest on an ordinary day?',
        },
      },
      {
        id: 'level1-question-2',
        type: 'open-question',
        prompt: {
          vi: 'Nếu được quay lại 5 năm trước, bạn sẽ nói gì với bản thân?',
          en: 'If you could go back 5 years, what would you tell yourself?',
        },
      },
      {
        id: 'level1-question-3',
        type: 'open-question',
        prompt: {
          vi: 'Điều gì ở một người khiến bạn có thiện cảm?',
          en: 'What is it about someone that makes you drawn to them?',
        },
      },
      {
        id: 'level1-wordchain',
        type: 'word-chain',
        prompt: {
          vi: 'Giờ thì... nối chữ với tao cho vui coi kkk! Nối đúng 10 lần là qua thử thách. Mỗi lượt 15 giây thôi đó!',
          en: "Now... let's chain words for fun! Chain 10 correct in a row to clear this trial. 15 seconds a turn!",
        },
        data: { timeLimitMs: 15000 },
      },
    ],
    fragment: {
      id: 'fragment-level1',
      name: { vi: 'Mảnh La Bàn: Khởi Đầu', en: 'Compass Fragment: The Beginning' },
      loreText: {
        vi: 'Mảnh đầu tiên của la bàn — phần thưởng cho đứa nào dám bắt đầu.',
        en: 'The first fragment of the compass — a reward for whoever dares to start.',
      },
    },
  },
  {
    id: 'level-2-mystery',
    name: { vi: 'Đảo Bí Ẩn', en: 'Isle of Mystery' },
    level: 2,
    order: 2,
    position: { x: 38, y: 45 },
    arrival: {
      speaker: GUIDE,
      lines: [
        { vi: 'Tới Đảo Bí Ẩn rồi — Level 2 đây.', en: 'Isle of Mystery, Level 2. Here we are.' },
        { vi: 'Chỗ này giấu một câu đố nhỏ. Giải được không you?', en: 'A little riddle is hiding here. Think you can crack it?' },
      ],
      secretLines: [
        {
          vi: 'Đảo này giấu kho báu đó, Hiền — nhưng chắc kho báu to nhất vẫn là cái sự kiên nhẫn của tao khi ngồi chờ you suy nghĩ.',
          en: "This island hides treasure, Hiền — though the biggest treasure is probably my patience waiting for your brain to work.",
        },
      ],
    },
    discovery: {
      title: { vi: 'Điều Bí Ẩn', en: 'The Mystery' },
      story: [
        {
          vi: 'Không khí ở đây im ru lạ thường, như kiểu hòn đảo đang đợi đứa nào đủ tinh mà lắng nghe.',
          en: 'The air here is weirdly still, like the island is waiting for someone sharp enough to actually listen.',
        },
      ],
    },
    lessons: [
      {
        id: 'level2-riddle',
        type: 'riddle',
        prompt: { vi: '"Cái gì có răng mà không thể cắn?"', en: '"What has teeth but cannot bite?"' },
        secretPrompt: {
          vi: '"Cái gì có răng mà không cắn được? Gợi ý: không phải là you lúc giả bộ dữ đâu."',
          en: '"What has teeth but cannot bite? Hint: not you pretending to be scary."',
        },
        data: {
          acceptedAnswers: ['cái lược', 'lược', 'cái lược chải đầu', 'a comb', 'comb'],
          hints: [
            { vi: 'Bạn dùng nó mỗi sáng để chải tóc.', en: 'You use it every morning to comb your hair.' },
            { vi: "Nó có nhiều 'răng' nhỏ xếp thành hàng.", en: 'It has many small "teeth" lined up in a row.' },
          ],
        },
      },
    ],
    fragment: {
      id: 'fragment-level2',
      name: { vi: 'Mảnh La Bàn: Bí Ẩn', en: 'Compass Fragment: Mystery' },
      loreText: {
        vi: 'Một mảnh giấu kín, chỉ lộ ra khi trí tò mò thắng thế.',
        en: 'A hidden fragment, surfacing only when curiosity wins.',
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
        { vi: 'Tới Đảo Thử Thách rồi — Level 3.', en: 'Isle of Challenge, Level 3.' },
        { vi: 'You đi được nửa đường rồi đó.', en: "You're halfway there." },
      ],
      secretLines: [
        {
          vi: 'Này Hiền, đám sinh vật biển cứ bơi vòng quanh you mãi — chắc tưởng you cũng lầy lội y như tụi nó vậy.',
          en: "Hey Hiền, the sea creatures keep circling you — probably think you're just as goofy as they are.",
        },
      ],
    },
    discovery: {
      title: { vi: 'Chặng Đường Giữa', en: 'The Midpoint' },
      story: [
        {
          vi: 'Mỗi bước chân trên đảo này là một lời nhắc: you đã đi xa hơn you tưởng đó.',
          en: "Every step on this island is a reminder: you've come further than you think.",
        },
      ],
    },
    lessons: [
      {
        id: 'level3-riddle',
        type: 'riddle',
        prompt: { vi: '"Con gì càng to càng nhẹ?"', en: '"What gets lighter the bigger it gets?"' },
        secretPrompt: {
          vi: '"Con gì càng to càng nhẹ? Không phải cái tôi của you sau khi được khen đâu!!!"',
          en: '"What gets lighter the bigger it gets? Definitely not your ego after a compliment."',
        },
        data: {
          acceptedAnswers: ['bong bóng', 'quả bóng bay', 'bóng bay', 'a balloon', 'balloon'],
          hints: [
            { vi: 'Nó bay lên trời khi được bơm đầy khí.', en: 'It floats into the sky when filled with air.' },
            { vi: 'Trẻ em rất thích chơi với nó vào ngày sinh nhật.', en: 'Kids love playing with it at birthday parties.' },
          ],
        },
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
        { vi: 'Tới Đảo Trí Tuệ rồi — Level 4.', en: 'Isle of Wit, Level 4.' },
        { vi: 'Đây là thử thách cuối trước khi you chạm tới chân trời.', en: 'Last trial before you hit the horizon.' },
      ],
      secretLines: [
        {
          vi: 'Sóng to gió lớn vầy, tao cá là you sắp than "trời ơi mệt quá" cho coi.',
          en: 'Waves and wind this rough, bet you\'re about to whine "ugh, so tired" any second.',
        },
      ],
    },
    discovery: {
      title: { vi: 'Ngọn Hải Đăng Trí Tuệ', en: 'The Lighthouse of Wit' },
      story: [
        {
          vi: 'Một ngọn hải đăng cũ đứng sừng sững giữa đảo, ánh sáng chỉ bật lên cho đứa nào chịu suy nghĩ.',
          en: "An old lighthouse towers at the center of the island — its light only switches on for those who actually think.",
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
          vi: '"Cái gì luôn tiến tới mà chẳng bao giờ lùi? Gợi ý: không phải là quyết tâm giảm cân của you."',
          en: '"What always moves forward and never goes back? Hint: not your diet resolutions."',
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
        vi: 'Mảnh cuối trước chân trời — phần thưởng cho cái đầu tỉnh táo.',
        en: 'The last fragment before the horizon — a reward for a clear head.',
      },
    },
  },
]

export function getIslandById(id) {
  return islands.find((island) => island.id === id) ?? null
}
