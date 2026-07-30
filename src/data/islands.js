// Content for the 4 regular islands (Levels 1-4). Every user-facing string
// is a `{ vi, en }` pair (see utils/i18n.js). Each island has a `lessons`
// array rather than a single `puzzle` — Level 1 has 5, everyone else has 1
// — so the engine never has to special-case "islands with many lessons".

const GUIDE = { vi: 'Người Dẫn Đường', en: 'The Guide' }

export const islands = [
  {
    id: 'level-1-outset',
    name: { vi: 'Đảo Khởi Hành', en: 'Isle of Beginnings' },
    level: 1,
    order: 1,
    position: { x: 14, y: 78 },
    arrival: {
      speaker: GUIDE,
      lines: [
        {
          vi: 'Chào tới Đảo Khởi Hành — Level đầu tiên của hành trình mày đó.',
          en: "Welcome to the Isle of Beginnings — the first level of your damn journey.",
        },
        {
          vi: 'Ở đây có vài thử thách nhỏ đang đợi mày, đừng có than.',
          en: "A couple small trials are waiting here — don't you dare complain.",
        },
      ],
      secretLines: [
        {
          vi: 'Khoan đã... "Hiền" á? Tên hiền lành vậy mà dám một mình ra khơi, gan dữ ha.',
          en: 'Wait... "Hiền"? Such a sweet name daring to sail out alone — ballsy.',
        },
        {
          vi: 'Được rồi, tao để mắt tới mày đặc biệt chút đó. Lười biếng giữa chừng là biết tay tao!',
          en: "Alright, I'll keep a special eye on you. Slack off halfway through and you'll answer to me!",
        },
      ],
    },
    discovery: {
      title: { vi: 'Hai Thử Thách', en: 'Two Trials' },
      story: [
        {
          vi: 'Đảo này giữ hai thử thách: giải ba câu đố, và nối chữ với tao một ván.',
          en: 'This island holds two trials: crack three riddles, and play a round of word-chain with me.',
        },
        { vi: 'Sẵn sàng chưa?', en: 'Ready?' },
      ],
    },
    lessons: [
      {
        id: 'level1-riddle-1',
        type: 'riddle',
        prompt: {
          vi: '"Không phải là cầu nhưng lại bắc ngang trời, có bảy sắc màu tươi hiện ra sau cơn mưa. Là gì?"',
          en: '"It is not a bridge, yet it arches across the sky with seven bright colors after the rain. What is it?"',
        },
        secretPrompt: {
          vi: '"Không phải là cầu nhưng lại bắc ngang trời, có bảy sắc màu tươi sau cơn mưa — ngẫu hứng y như tâm trạng thất thường của mày vậy đó."',
          en: '"Not a bridge, yet it arches across the sky in seven colors after the rain — about as unpredictable as your damn mood."',
        },
        data: {
          acceptedAnswers: ['cầu vồng', 'cái cầu vồng', 'rainbow'],
          hints: [
            { vi: 'Nó chỉ xuất hiện khi vừa có nắng, vừa có mưa.', en: 'It only appears when there is both sun and rain at once.' },
            { vi: 'Nó có bảy màu xếp thành hình vòng cung trên bầu trời.', en: 'It has seven colors arranged in an arc across the sky.' },
            {
              vi: 'Ông bà ta hay gọi nó là "cây cầu" nối liền trời và đất.',
              en: 'Elders often call it the "bridge" connecting sky and earth.',
            },
          ],
        },
      },
      {
        id: 'level1-riddle-2',
        type: 'riddle',
        prompt: {
          vi: '"Mỗi sáng mọc lên ở đằng đông, mỗi chiều lặn xuống đằng tây, sưởi ấm cho muôn loài. Là gì?"',
          en: '"Every morning it rises in the east, every evening it sets in the west, warming every living thing. What is it?"',
        },
        data: {
          acceptedAnswers: ['mặt trời', 'ông mặt trời', 'sun'],
          hints: [
            { vi: 'Không có nó, cây cối sẽ không thể quang hợp.', en: 'Without it, plants could not photosynthesize.' },
            { vi: 'Nhìn thẳng vào nó quá lâu sẽ bị chói mắt.', en: 'Staring straight at it too long will hurt your eyes.' },
            {
              vi: 'Ban ngày nó tỏa sáng khắp nơi, ban đêm lại nhường chỗ cho mặt trăng.',
              en: 'By day it lights up everything; by night it gives way to the moon.',
            },
          ],
        },
      },
      {
        id: 'level1-riddle-3',
        type: 'riddle',
        prompt: {
          vi: '"Con gì bé nhỏ mà chăm chỉ suốt ngày, bay khắp vườn hoa tìm mật ngọt mang về tổ?"',
          en: '"What tiny creature works tirelessly all day, flying through the garden to bring sweet nectar back to its hive?"',
        },
        data: {
          acceptedAnswers: ['con ong', 'ong', 'bee'],
          hints: [
            { vi: 'Nó sống thành đàn, có một "ong chúa" đứng đầu cả tổ.', en: 'It lives in a colony led by a single queen.' },
            { vi: 'Chọc vào tổ của nó là bị chích ngay lập tức.', en: 'Poke its hive and you will get stung right away.' },
            {
              vi: 'Thứ nó mang về tổ là nguyên liệu để làm ra mật ong.',
              en: 'What it carries back to the hive is the raw material for honey.',
            },
          ],
        },
      },
      {
        id: 'level1-wordchain',
        type: 'word-chain',
        prompt: {
          vi: 'Giờ thì... nối chữ với tao coi kkk! Nối đúng 10 lần là qua thử thách.',
          en: "Now... let's chain words! Chain 10 correct in a row to clear this trial.",
        },
        data: {},
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
        { vi: 'Chỗ này giấu một câu đố nhỏ. Giải được không mày?', en: 'A little riddle is hiding here. Think you can crack it?' },
      ],
      secretLines: [
        {
          vi: 'Đảo này giấu kho báu đó, Hiền — nhưng chắc kho báu to nhất vẫn là cái sự kiên nhẫn của tao khi ngồi chờ mày suy nghĩ.',
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
          vi: '"Cái gì có răng mà không cắn được? Gợi ý: không phải là mày lúc giả bộ dữ đâu."',
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
        { vi: 'Mày đi được nửa đường rồi đó.', en: "You're halfway there." },
      ],
      secretLines: [
        {
          vi: 'Này Hiền, đám sinh vật biển cứ bơi vòng quanh mày mãi — chắc tưởng mày cũng lầy lội y như tụi nó vậy.',
          en: "Hey Hiền, the sea creatures keep circling you — probably think you're just as goofy as they are.",
        },
      ],
    },
    discovery: {
      title: { vi: 'Chặng Đường Giữa', en: 'The Midpoint' },
      story: [
        {
          vi: 'Mỗi bước chân trên đảo này là một lời nhắc: mày đã đi xa hơn mày tưởng đó.',
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
          vi: '"Con gì càng to càng nhẹ? Không phải cái tôi của mày sau khi được khen đâu!!!"',
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
        { vi: 'Đây là thử thách cuối trước khi mày chạm tới chân trời.', en: 'Last trial before you hit the horizon.' },
      ],
      secretLines: [
        {
          vi: 'Sóng to gió lớn vầy, tao cá là mày sắp than "trời ơi mệt quá" cho coi.',
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
          vi: '"Cái gì luôn tiến tới mà chẳng bao giờ lùi? Gợi ý: không phải là quyết tâm giảm cân của mày."',
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
