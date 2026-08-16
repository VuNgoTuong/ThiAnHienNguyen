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
          vi: 'Chào mừng em tới Đảo Làm Quen — chặng đầu tiên trong hành trình nhỏ anh dành riêng cho em.',
          en: "Welcome to the Isle of Getting Acquainted — the first stop on this little journey I made just for you.",
        },
        {
          vi: 'Không có gì hóc búa đâu, chỉ một ván nối chữ cho vui thôi em.',
          en: "Nothing tricky here — just a fun round of word-chain.",
        },
      ],
      secretLines: [
        {
          vi: 'Khoan đã... "Hiền" à? Tên dịu dàng vậy mà dám một mình ra khơi, anh thấy thương ghê.',
          en: '...wait, "Hiền"? Such a gentle name, out here sailing alone — that makes anh love you a little more.',
        },
        {
          vi: 'Được rồi, anh sẽ để mắt tới em đặc biệt một chút. Có mệt giữa chừng thì cứ nghỉ, anh vẫn ở đây chờ em mà.',
          en: "Alright, anh will be keeping a close, caring eye on you. If you get tired halfway, take your time — anh will be right here waiting.",
        },
      ],
    },
    discovery: {
      title: { vi: 'Làm Quen', en: 'Getting Acquainted' },
      story: [
        {
          vi: 'Đảo này không thử bộ não em đâu — chỉ là một ván nối chữ cùng anh cho vui thôi.',
          en: "This island isn't testing your mind — just a fun round of word-chain together.",
        },
        { vi: 'Sẵn sàng chưa em?', en: 'Ready?' },
      ],
    },
    lessons: [
      {
        id: 'level1-wordchain',
        type: 'word-chain',
        prompt: {
          vi: 'Giờ thì... nối chữ cùng anh cho vui nha! Nối đúng 10 lần liên tiếp là qua được thử thách này. Mỗi lượt có 15 giây thôi, hết giờ là mình nối lại từ đầu nha em.',
          en: "Now... let's chain words together! Ten correct in a row clears this trial. You've got 15 seconds a turn — if time runs out, we just start the round over, no worries.",
        },
        data: { timeLimitMs: 15000 },
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
        { vi: 'Mình cập bến Vịnh Ẩn Giấu rồi — Level 2 đây em.', en: "We've landed at the Hidden Cove — Level 2." },
        {
          vi: 'Đảo này có một trò nhỏ: anh đưa hình, em đoán xem đó là gì nha.',
          en: "This island has a little game: anh shows you a picture, you guess what it is.",
        },
      ],
      secretLines: [
        {
          vi: 'Đảo này giấu kho báu đó, Hiền — nhưng với anh, kho báu lớn nhất vẫn là được ngồi đây chờ em suy nghĩ.',
          en: "This island hides a treasure, Hiền — though for anh, the real treasure is just getting to sit here and wait for you.",
        },
      ],
    },
    discovery: {
      title: { vi: 'Vịnh Ẩn Giấu', en: 'The Hidden Cove' },
      story: [
        {
          vi: 'Không khí ở đây yên tĩnh lạ thường, như thể hòn đảo đang chờ một người đủ tinh tế để lắng nghe — anh nghĩ đó là em.',
          en: 'The air here is strangely still, like the island is waiting for someone thoughtful enough to listen — anh thinks that\'s you.',
        },
        {
          vi: 'Anh sẽ đưa em xem lần lượt từng hình một. Nhìn kỹ rồi đoán xem đó là gì nha.',
          en: 'anh will show you one picture at a time. Look closely, then guess what it is.',
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
                vi: 'Nhìn hình và đoán xem đây là gì — đừng đoán bừa như đoán tâm trạng của anh à nha.',
                en: "Look at the picture and guess — don't just guess blindly like you do with anh's moods.",
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
                vi: 'Đoán xem đây là con gì — gợi ý: dễ thương y như em vậy đó.',
                en: 'Guess what this animal is — hint: just as cute as you.',
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
              prompt: { vi: 'Nhìn gần quá hén, đoán xem đây là gì:', en: "Zoomed in real close — what's this:" },
              secretPrompt: {
                vi: 'Đoán xem cái gì đây — không phải trái tim em đang giữ kỹ đâu.',
                en: "Guess what this is — not the heart you're guarding so carefully.",
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
                vi: 'Nhìn kỹ đi, hình sẽ biến mất nhanh lắm à nha:',
                en: 'Look closely — this one disappears fast:',
              },
              secretPrompt: {
                vi: 'Chớp mắt là mất hình đó — giống hồi em chớp mắt là hết tin anh vậy.',
                en: "Blink and it's gone — kinda like how fast you stopped trusting anh that one time.",
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
        { vi: 'Mình tới Đảo Thử Thách rồi — Level 3 đây em.', en: 'The Isle of Challenge, Level 3.' },
        { vi: 'Em đi được nửa chặng đường rồi đó.', en: "You're halfway there, sweetheart." },
      ],
      secretLines: [
        {
          vi: 'Này Hiền, đám sinh vật biển cứ bơi quanh em mãi — chắc tụi nó cũng thấy em đáng yêu như anh thấy vậy.',
          en: "Hey Hiền, the sea creatures keep circling you — guess they think you're just as lovely as anh does.",
        },
      ],
    },
    discovery: {
      title: { vi: 'Quiz Arena', en: 'Quiz Arena' },
      story: [
        {
          vi: 'Ở giữa đảo có một vòng năng lượng kỳ lạ — nơi anh hay gọi đùa là Quiz Arena.',
          en: 'At the center of this island sits a strange ring of light — anh jokingly calls it the Quiz Arena.',
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
        { vi: 'Mình tới Đảo Trí Tuệ rồi — Level 4 đây em.', en: 'The Isle of Wit, Level 4.' },
        { vi: 'Đây là thử thách cuối trước khi em chạm tới chân trời rồi đó.', en: 'Last trial before you reach the horizon.' },
      ],
      secretLines: [
        {
          vi: 'Sóng to gió lớn vầy, chắc em đang mệt lắm phải không? Ráng thêm chút nữa thôi, anh tin em làm được.',
          en: "Rough seas and wind like this — you must be tired. Just a little further, anh knows you've got this.",
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
