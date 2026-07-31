// A larger, rotating pool of riddles — Level 1 draws 3 at random from here
// each new game (see utils/islandLogic.js / pages/IslandPage.jsx), so
// replaying doesn't always serve the same three answers. Slightly trickier
// than the old fixed set (more metaphor, less "what has petals and grows
// in a garden") since the whole point is they shouldn't be memorizable
// after one playthrough.
export const riddleBank = [
  {
    id: 'bank-shadow',
    prompt: {
      vi: '"Cái gì đi theo bạn suốt cả ngày, nắng to thì rõ hình, trời râm thì biến mất?"',
      en: '"What follows you all day long, sharp when the sun is strong, gone when the sky clouds over?"',
    },
    data: {
      acceptedAnswers: ['bóng', 'cái bóng', 'shadow'],
      hints: [
        { vi: 'Nó luôn nằm ở phía ngược với ánh sáng.', en: 'It always falls on the side away from the light.' },
        { vi: 'Không có ánh sáng thì nó cũng biến mất theo.', en: 'No light, no sign of it either.' },
      ],
    },
  },
  {
    id: 'bank-wind',
    prompt: {
      vi: '"Không chân mà chạy khắp nơi, không tay mà đẩy được thuyền buồm, không miệng mà rít gào giữa đêm bão?"',
      en: '"No legs, yet it runs everywhere; no hands, yet it pushes sails; no mouth, yet it howls through a storming night?"',
    },
    data: {
      acceptedAnswers: ['gió', 'cơn gió', 'wind'],
      hints: [
        { vi: 'Bạn không thấy được nó, chỉ thấy thứ nó làm rung chuyển.', en: 'You never see it directly — only what it moves.' },
        { vi: 'Cánh buồm no căng là nhờ có nó.', en: "It's what fills a sail." },
      ],
    },
  },
  {
    id: 'bank-salt',
    prompt: {
      vi: '"Trắng như tuyết nhưng chẳng phải tuyết, mặn hơn cả nước mắt lẫn nước biển. Là gì?"',
      en: '"White as snow but not snow at all, saltier than tears or the sea itself. What is it?"',
    },
    data: {
      acceptedAnswers: ['muối', 'muối ăn', 'salt'],
      hints: [
        { vi: 'Nó thường nằm cạnh tiêu trên bàn ăn.', en: 'It usually sits next to the pepper on the dinner table.' },
        { vi: 'Nước biển bốc hơi để lại đúng thứ này.', en: 'Evaporate seawater and this is what remains.' },
      ],
    },
  },
  {
    id: 'bank-egg',
    prompt: {
      vi: '"Bên trong trắng, bên trong vàng, không chân không cánh mà lại nở thành con. Là gì?"',
      en: '"White inside, yellow inside, no legs, no wings — yet a living thing hatches from it. What is it?"',
    },
    data: {
      acceptedAnswers: ['quả trứng', 'trứng', 'cái trứng', 'egg'],
      hints: [
        { vi: 'Gà mái đẻ ra nó mỗi sáng.', en: 'A hen lays one most mornings.' },
        { vi: 'Đập vỡ lớp vỏ ngoài là thấy lòng đỏ, lòng trắng.', en: 'Crack the shell and you find a yolk and white inside.' },
      ],
    },
  },
  {
    id: 'bank-clock-hands',
    prompt: {
      vi: '"Ba anh em cùng quay một chỗ suốt ngày đêm, người nhanh người chậm mà chẳng bao giờ rời khỏi mặt. Là gì?"',
      en: '"Three siblings spin in the same spot day and night — some fast, some slow, none ever leaving the face. What are they?"',
    },
    data: {
      acceptedAnswers: ['kim đồng hồ', 'các kim đồng hồ', 'clock hands', 'kim'],
      hints: [
        { vi: 'Bạn nhìn nó mỗi khi muốn biết mấy giờ.', en: 'You check them whenever you want to know the time.' },
        { vi: 'Cây kim dài và cây kim ngắn chạy khác tốc độ nhau.', en: 'The long one and the short one move at different speeds.' },
      ],
    },
  },
  {
    id: 'bank-bridge',
    prompt: {
      vi: '"Không phải sông nhưng lại bắc ngang qua sông, người và xe cứ thế đi qua mà chẳng cần ướt chân. Là gì?"',
      en: '"Not a river, yet it spans one — people and cars cross it without ever getting their feet wet. What is it?"',
    },
    data: {
      acceptedAnswers: ['cây cầu', 'cái cầu', 'chiếc cầu', 'bridge'],
      hints: [
        { vi: 'Nó nối hai bờ lại với nhau.', en: 'It connects two riverbanks.' },
        { vi: 'Không có nó, muốn qua sông phải đi đò.', en: "Without one, you'd need a ferry to cross." },
      ],
    },
  },
  {
    id: 'bank-mirror',
    prompt: {
      vi: '"Càng nhìn kỹ càng thấy chính mình, nhưng chạm vào thì chỉ thấy lạnh và cứng. Là gì?"',
      en: '"The closer you look, the more you see yourself — yet touch it and all you feel is cold, hard glass. What is it?"',
    },
    data: {
      acceptedAnswers: ['gương', 'cái gương', 'chiếc gương', 'mirror'],
      hints: [
        { vi: 'Bạn soi nó mỗi sáng trước khi ra khỏi nhà.', en: 'You check it every morning before heading out.' },
        { vi: 'Nó phản chiếu mọi thứ đứng trước nó.', en: 'It reflects whatever stands in front of it.' },
      ],
    },
  },
  {
    id: 'bank-book',
    prompt: {
      vi: '"Không mở miệng mà kể chuyện suốt ngàn năm, càng đọc càng thấy mình biết nhiều hơn. Là gì?"',
      en: '"It never opens its mouth, yet tells stories a thousand years old — the more you read it, the more you know. What is it?"',
    },
    data: {
      acceptedAnswers: ['quyển sách', 'cuốn sách', 'sách', 'cái sách', 'book'],
      hints: [
        { vi: 'Nó có bìa, có trang, và đôi khi có tranh minh họa.', en: 'It has a cover, pages, and sometimes pictures.' },
        { vi: 'Thư viện là nơi chứa hàng ngàn thứ này.', en: 'A library is full of these.' },
      ],
    },
  },
  {
    id: 'bank-volcano',
    prompt: {
      vi: '"Ngủ yên có khi cả trăm năm, thức dậy một lần là cả vùng rung chuyển. Là gì?"',
      en: '"It can sleep for a hundred years — wake up just once, and the whole region shakes. What is it?"',
    },
    data: {
      acceptedAnswers: ['núi lửa', 'ngọn núi lửa', 'volcano'],
      hints: [
        { vi: 'Khi nó "thức dậy", dung nham sẽ phun trào.', en: 'When it "wakes up," lava comes pouring out.' },
        { vi: 'Nó là một ngọn núi, nhưng có miệng phun ở đỉnh.', en: "It's a mountain, but with a vent at its peak." },
      ],
    },
  },
  {
    id: 'bank-snail',
    prompt: {
      vi: '"Mang cả căn nhà đi khắp nơi, đi chậm rì rì nhưng chẳng bao giờ lạc mất đường về. Là gì?"',
      en: '"It carries its whole house wherever it goes, crawling at a snail\'s pace — literally — yet never loses its way home. What is it?"',
    },
    data: {
      acceptedAnswers: ['con ốc sên', 'ốc sên', 'con ốc', 'snail'],
      hints: [
        { vi: 'Cái "nhà" của nó chính là lớp vỏ xoắn trên lưng.', en: 'Its "house" is the spiral shell on its back.' },
        { vi: 'Sau cơn mưa, bạn dễ thấy nó bò trên lá.', en: "After rain, you'll often spot it crawling on leaves." },
      ],
    },
  },
  {
    id: 'bank-stars',
    prompt: {
      vi: '"Ban ngày trốn biệt tăm hơi, ban đêm mới chịu ra, trời càng tối chúng càng lấp lánh. Là gì?"',
      en: '"They hide without a trace all day, only showing up at night — the darker the sky, the brighter they shine. What are they?"',
    },
    data: {
      acceptedAnswers: ['ngôi sao', 'các vì sao', 'sao', 'những vì sao', 'stars'],
      hints: [
        { vi: 'Chúng vẫn ở đó ban ngày, chỉ là ánh mặt trời át mất.', en: "They're there in daytime too — sunlight just outshines them." },
        { vi: 'Người ta hay ước điều gì đó khi thấy một ngôi sao băng.', en: 'People make wishes when they spot one shooting across the sky.' },
      ],
    },
  },
  {
    id: 'bank-lock',
    prompt: {
      vi: '"Không phải người nhưng biết giữ bí mật, chỉ chịu mở lòng khi gặp đúng người có chìa. Là gì?"',
      en: '"Not a person, yet it keeps every secret — it only opens up for whoever holds the right key. What is it?"',
    },
    data: {
      acceptedAnswers: ['ổ khóa', 'cái khóa', 'chiếc khóa', 'lock'],
      hints: [
        { vi: 'Nó thường gắn trên cửa hoặc cặp sách.', en: 'You usually find one on a door or a bag.' },
        { vi: 'Không có chìa đúng, nó nhất quyết không mở.', en: 'Without the right key, it refuses to budge.' },
      ],
    },
  },
  {
    id: 'bank-river',
    prompt: {
      vi: '"Không chân mà chạy suốt ngày đêm, chảy hoài chảy mãi mà chẳng bao giờ biết mệt. Là gì?"',
      en: '"No legs, yet it runs day and night, flowing on and on without ever tiring. What is it?"',
    },
    data: {
      acceptedAnswers: ['con sông', 'dòng sông', 'sông', 'river'],
      hints: [
        { vi: 'Nó luôn chảy từ nơi cao xuống biển.', en: 'It always flows from higher ground down to the sea.' },
        { vi: 'Thuyền bè có thể trôi theo dòng chảy của nó.', en: 'Boats can drift along with its current.' },
      ],
    },
  },
  {
    id: 'bank-calendar',
    prompt: {
      vi: '"Có tới ba trăm sáu lăm tờ mỏng, mỗi năm lại phải thay một lần. Là gì?"',
      en: '"It has three hundred and sixty-five thin pages, replaced once every year. What is it?"',
    },
    data: {
      acceptedAnswers: ['quyển lịch', 'cuốn lịch', 'cái lịch', 'lịch', 'calendar'],
      hints: [
        { vi: 'Người ta xé một tờ của nó mỗi ngày.', en: 'People tear off a page from it each day.' },
        { vi: 'Nó ghi lại ngày, tháng, và cả các ngày lễ trong năm.', en: 'It marks the days, months, and holidays of the year.' },
      ],
    },
  },
  {
    id: 'bank-rain',
    prompt: {
      vi: '"Từ trời rơi xuống nhưng chẳng phải là sao, làm ướt cả đất mà chẳng ai giữ lại được. Là gì?"',
      en: "\"It falls from the sky but isn't a star, soaking the whole earth, yet no one can hold onto it. What is it?\"",
    },
    data: {
      acceptedAnswers: ['mưa', 'cơn mưa', 'trận mưa', 'rain'],
      hints: [
        { vi: 'Bạn cần dù hoặc áo mưa để tránh nó.', en: 'You need an umbrella or a raincoat to dodge it.' },
        { vi: 'Nó thường đi kèm với sấm chớp.', en: 'It often comes with thunder and lightning.' },
      ],
    },
  },
  {
    id: 'bank-kite',
    prompt: {
      vi: '"Không có cánh mà bay tít lên trời, có dây buộc mà chẳng phải là con thú. Là gì?"',
      en: '"No wings, yet it soars high into the sky — tied by a string, yet it\'s no animal. What is it?"',
    },
    data: {
      acceptedAnswers: ['cái diều', 'con diều', 'chiếc diều', 'diều', 'kite'],
      hints: [
        { vi: 'Trẻ con hay chơi nó vào những ngày lộng gió.', en: 'Kids love flying one on a windy day.' },
        { vi: 'Không có gió, nó chẳng thể nào bay lên được.', en: "Without wind, it can't get off the ground." },
      ],
    },
  },
  {
    id: 'bank-compass',
    prompt: {
      vi: '"Luôn chỉ về một hướng dù bạn xoay tròn thế nào, dân đi biển nhờ nó mà chẳng bao giờ lạc lối. Là gì?"',
      en: '"It always points the same way no matter how you spin it — sailors trust it never to lead them astray. What is it?"',
    },
    data: {
      acceptedAnswers: ['la bàn', 'cái la bàn', 'chiếc la bàn', 'compass'],
      hints: [
        { vi: 'Kim của nó luôn hướng về phía Bắc.', en: 'Its needle always points north.' },
        { vi: 'Đây chính là thứ cả hành trình này đang đi tìm.', en: "It's the exact thing this whole voyage is searching for." },
      ],
    },
  },
  {
    id: 'bank-candle',
    prompt: {
      vi: '"Càng cháy càng thấp đi, soi sáng cho người khác mà chính mình tan chảy dần. Là gì?"',
      en: '"The longer it burns, the shorter it gets — lighting the way for others while it melts away itself. What is it?"',
    },
    data: {
      acceptedAnswers: ['cây nến', 'ngọn nến', 'cái nến', 'nến', 'candle'],
      hints: [
        { vi: 'Người ta hay thắp nó lên bánh sinh nhật.', en: "People often light these on a birthday cake." },
        { vi: 'Gió thổi mạnh là nó tắt ngay.', en: "A strong gust of wind snuffs it right out." },
      ],
    },
  },
  {
    id: 'bank-echo',
    prompt: {
      vi: '"Bạn hét lên, nó hét lại y hệt bạn, nhưng chẳng bao giờ chịu lộ mặt ra. Là gì?"',
      en: '"You shout, and it shouts right back at you — yet it never once shows its face. What is it?"',
    },
    data: {
      acceptedAnswers: ['tiếng vang', 'tiếng vọng', 'echo'],
      hints: [
        { vi: 'Bạn thường nghe thấy nó ở trong hang động hay thung lũng.', en: 'You usually hear it in a cave or a valley.' },
        { vi: 'Nó lặp lại đúng những gì bạn vừa nói.', en: 'It repeats exactly what you just said.' },
      ],
    },
  },
]

// Returns `count` distinct riddles, drawn at random. `excludeIds` lets a
// caller keep a session's picks from repeating a riddle already shown
// elsewhere in the same playthrough.
export function pickRandomRiddles(count, excludeIds = []) {
  const pool = riddleBank.filter((riddle) => !excludeIds.includes(riddle.id))
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
