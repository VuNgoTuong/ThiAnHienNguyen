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
          vi: 'Chào mừng đến với Đảo Khởi Hành — Level đầu tiên trong hành trình của bạn.',
          en: 'Welcome to the Isle of Beginnings — the first level of your journey.',
        },
        {
          vi: 'Ở đây có vài thử thách nhỏ đang chờ bạn đấy.',
          en: 'A couple of small trials are waiting for you here.',
        },
      ],
      secretLines: [
        {
          vi: 'Khoan đã... "Hiền" á? Cái tên hiền lành thế mà dám một mình ra khơi, gan thật đấy.',
          en: 'Wait... "Hiền"? Such a sweet, gentle name daring to sail out alone — bold move.',
        },
        {
          vi: 'Được rồi, tôi sẽ để mắt tới bạn đặc biệt một chút. Đừng có mà lười biếng giữa chừng đấy nhé!',
          en: "Alright, I'll be keeping a special eye on you. Don't you dare slack off halfway through!",
        },
      ],
    },
    discovery: {
      title: { vi: 'Hai Thử Thách', en: 'Two Trials' },
      story: [
        {
          vi: 'Hòn đảo này giữ hai thử thách: giải ba câu đố vui, và chơi một ván nối chữ với tôi.',
          en: 'This island holds two trials: solve three fun riddles, and play a word-chain game with me.',
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
          vi: '"Không phải là cầu nhưng lại bắc ngang trời, có bảy sắc màu tươi sau cơn mưa — cũng ngẫu hứng y như tâm trạng của Hiền vậy đó."',
          en: '"Not a bridge, yet it arches across the sky in seven colors after the rain — about as unpredictable as Hiền\'s mood."',
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
          vi: 'Giờ thì... nối chữ với tôi nhé! Nối đúng 10 lần để hoàn thành thử thách.',
          en: "Now... let's play word chain! Chain 10 correct words to clear this trial.",
        },
        data: {},
      },
    ],
    fragment: {
      id: 'fragment-level1',
      name: { vi: 'Mảnh La Bàn: Khởi Đầu', en: 'Compass Fragment: The Beginning' },
      loreText: {
        vi: 'Mảnh đầu tiên của chiếc la bàn — phần thưởng cho những ai dám bắt đầu.',
        en: 'The first fragment of the compass — a reward for those who dare to begin.',
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
        { vi: 'Chào mừng đến với Đảo Bí Ẩn — Level 2.', en: 'Welcome to the Isle of Mystery — Level 2.' },
        { vi: 'Nơi đây giấu một câu đố nhỏ. Bạn giải được không?', en: 'A small riddle is hidden here. Can you solve it?' },
      ],
      secretLines: [
        {
          vi: 'Đảo này giấu kho báu đấy, Hiền ạ — nhưng chắc kho báu lớn nhất vẫn là sự kiên nhẫn của tôi khi chờ bạn suy nghĩ.',
          en: "This island hides treasure, Hiền — though the biggest treasure might just be my patience waiting for you to think.",
        },
      ],
    },
    discovery: {
      title: { vi: 'Điều Bí Ẩn', en: 'The Mystery' },
      story: [
        {
          vi: 'Không khí ở đây tĩnh lặng lạ thường, như thể hòn đảo đang chờ ai đó đủ tinh ý để lắng nghe.',
          en: 'The air here is strangely still, as if the island is waiting for someone sharp enough to listen.',
        },
      ],
    },
    lessons: [
      {
        id: 'level2-riddle',
        type: 'riddle',
        prompt: { vi: '"Cái gì có răng mà không thể cắn?"', en: '"What has teeth but cannot bite?"' },
        secretPrompt: {
          vi: '"Cái gì có răng mà không thể cắn? Gợi ý: không phải là Hiền lúc giả vờ dữ đâu."',
          en: '"What has teeth but cannot bite? Hint: it is not Hiền pretending to be fierce."',
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
        vi: 'Một mảnh ẩn giấu, chỉ lộ diện khi trí tò mò chiến thắng.',
        en: 'A hidden fragment, revealed only when curiosity wins out.',
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
        { vi: 'Chào mừng đến với Đảo Thử Thách — Level 3.', en: 'Welcome to the Isle of Challenge — Level 3.' },
        { vi: 'Bạn đã đi được nửa chặng đường rồi đấy.', en: "You're halfway through the journey now." },
      ],
      secretLines: [
        {
          vi: 'Này Hiền, đám sinh vật biển ở đây cứ bơi vòng quanh bạn mãi — chắc tưởng bạn cũng dễ thương và lầy lội như tụi nó.',
          en: 'Hey Hiền, the sea creatures here keep circling you — probably think you are just as cute and goofy as they are.',
        },
      ],
    },
    discovery: {
      title: { vi: 'Chặng Đường Giữa', en: 'The Midpoint' },
      story: [
        {
          vi: 'Mỗi bước chân trên đảo này đều là một lời nhắc: bạn đã đi xa hơn bạn nghĩ.',
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
          vi: '"Con gì càng to càng nhẹ? Không phải là cái tôi của Hiền sau khi được khen đâu nhé."',
          en: '"What gets lighter the bigger it gets? Definitely not Hiền\'s ego after a compliment."',
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
        vi: 'Một mảnh rèn giũa qua thử thách — càng khó, càng đáng giá.',
        en: 'A fragment forged through challenge — the harder it was, the more it matters.',
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
        { vi: 'Chào mừng đến với Đảo Trí Tuệ — Level 4.', en: 'Welcome to the Isle of Wit — Level 4.' },
        { vi: 'Đây là thử thách cuối cùng trước khi bạn đến với chân trời.', en: 'This is the last trial before you reach the horizon.' },
      ],
      secretLines: [
        {
          vi: 'Sóng to gió lớn thế này, tôi cá là Hiền lại sắp than "trời ơi mệt quá" cho mà xem.',
          en: 'With waves and wind this rough, I bet Hiền is about to complain "ugh, so tired" any second now.',
        },
      ],
    },
    discovery: {
      title: { vi: 'Ngọn Hải Đăng Trí Tuệ', en: 'The Lighthouse of Wit' },
      story: [
        {
          vi: 'Một ngọn hải đăng cũ đứng sừng sững giữa đảo, ánh sáng của nó chỉ bật lên cho những ai chịu suy nghĩ.',
          en: "An old lighthouse stands tall at the center of the island — its light only switches on for those willing to think.",
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
          vi: '"Cái gì luôn tiến về phía trước mà không bao giờ lùi lại? Gợi ý: không phải là quyết tâm giảm cân của Hiền."',
          en: '"What always moves forward and never goes back? Hint: not Hiền\'s diet resolutions."',
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
        vi: 'Mảnh cuối cùng trước chân trời — phần thưởng cho một cái đầu tỉnh táo.',
        en: 'The last fragment before the horizon — a reward for a clear mind.',
      },
    },
  },
]

export function getIslandById(id) {
  return islands.find((island) => island.id === id) ?? null
}
