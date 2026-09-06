// Đảo cuối cùng (Level 5) mở khi người chơi thu thập đủ tất cả Mảnh La Bàn.
// Không có câu đố ở đây — chỉ là một khoảng lặng để nhìn lại cả hành trình.

const GUIDE = { vi: 'Người Dẫn Đường', en: 'The Guide' }

export const finalIsland = {
  id: 'lost-horizon',
  name: { vi: 'Chân Trời Cuối Cùng', en: 'The Final Horizon' },
  level: 5,
  position: { x: 50, y: 12 },

  arrival: {
    speaker: GUIDE,
    lines: [
      { vi: 'Bốn hòn đảo rồi đó em.', en: 'Four islands down.' },
      {
        vi: 'Giờ mình dừng lại một chút, nhìn lại cả chặng đường nha.',
        en: "Now let's stop for a moment and look back at the whole way here.",
      },
    ],

    secretLines: [
      {
        vi: 'Đi tới tận đây rồi à, An Hiền? Ở lại thêm một chút với anh nha.',
        en: 'Made it all the way here, An Hiền? Stay with me a little longer.',
      },
    ],
  },

  discovery: {
    title: { vi: 'Hành Trình Của Chúng Ta', en: 'Our Journey' },
    story: [
      { vi: 'Không có câu đố nào ở đây cả.', en: "There's no puzzle here." },
      { vi: 'Chỉ là những gì em đã cho anh thấy trên đường đi thôi.', en: "Just what you've shown me along the way." },
    ],
  },

  // The recap step (see FinalIslandPage) plays these back in order: an
  // opening line, then one sentence per Island 4 round the player actually
  // answered (built from island4Predictions.js's ROUND_DEFS[].recap), a
  // fallback for when there's no Island 4 data to draw from, and a closing
  // line about Island 3's memory quiz.
  recap: {
    intro: { vi: 'Anh nhớ nè...', en: 'I remember...' },
    fallbackLine: {
      vi: 'Em đã đi qua từng đảo một, không bỏ lại điều gì.',
      en: 'You went through every island, without skipping a thing.',
    },
    closingLine: {
      vi: 'Và em vẫn nhớ những chuyện nhỏ của chúng ta.',
      en: 'And you still remember the little things about us.',
    },
  },

  ending: {
    speaker: GUIDE,
    lines: [
      {
        vi: 'Có lẽ đây không phải là chuyến đi để tìm một nơi nào đó.',
        en: 'Maybe this was never a journey to find some place.',
      },
      { vi: 'Mà là chuyến đi để nhận ra...', en: 'But a journey to realize...' },
      {
        vi: 'người mình muốn đi cùng quan trọng hơn nơi mình sẽ đến.',
        en: "that who you want beside you matters more than where you're going.",
      },
    ],
    heartLine: {
      vi: '❤️ Và anh vẫn muốn tiếp tục chuyến đi này cùng em.',
      en: '❤️ And I still want to keep going on this journey with you.',
    },
    continueButton: { vi: 'TIẾP TỤC HÀNH TRÌNH', en: 'CONTINUE THE JOURNEY' },
  },
}
