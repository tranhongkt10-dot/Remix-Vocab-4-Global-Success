import { PhonicsLesson } from '../types';

export const PHONICS_LESSONS: PhonicsLesson[] = [
  {
    id: 's-es',
    title: 'Phát âm đuôi -s và -es',
    subtitle: 'Học cách đọc chuẩn 3 âm: /s/, /z/ và /ɪz/',
    description: 'Khi thêm -s hoặc -es vào sau danh từ số nhiều hoặc động từ ngôi thứ 3 số ít, chúng ta có 3 cách phát âm cực kỳ dễ nhớ.',
    rules: [
      {
        id: 'rule_s',
        endingOrType: 'Phát âm là /s/',
        soundIpa: '/s/',
        memoryTrick: 'Mẹo nhớ: "Thời Phong Kiến Phương Tây" (tận cùng bằng các âm /t/, /p/, /k/, /f/, /θ/)',
        examples: [
          { word: 'cats', phonetic: '/kæts/', meaningVi: 'những chú mèo (/t/ + s)' },
          { word: 'books', phonetic: '/bʊks/', meaningVi: 'những cuốn sách (/k/ + s)' },
          { word: 'stops', phonetic: '/stɒps/', meaningVi: 'dừng lại (/p/ + s)' },
          { word: 'laughs', phonetic: '/lɑːfs/', meaningVi: 'cười (/f/ + s)' },
        ]
      },
      {
        id: 'rule_iz',
        endingOrType: 'Phát âm là /ɪz/',
        soundIpa: '/ɪz/',
        memoryTrick: 'Mẹo nhớ: "Sóng Gió Chẳng Sợ Zì" (tận cùng bằng /s/, /z/, /ʃ/ (sh), /tʃ/ (ch), /dʒ/ (ge/dge), /x/)',
        examples: [
          { word: 'watches', phonetic: '/ˈwɒtʃɪz/', meaningVi: 'đồng hồ đeo tay (tận cùng ch)' },
          { word: 'boxes', phonetic: '/ˈbɒksɪz/', meaningVi: 'những chiếc hộp (tận cùng x)' },
          { word: 'buses', phonetic: '/ˈbʌsɪz/', meaningVi: 'những xe buýt (tận cùng s)' },
          { word: 'dishes', phonetic: '/ˈdɪʃɪz/', meaningVi: 'những chiếc đĩa (tận cùng sh)' },
        ]
      },
      {
        id: 'rule_z',
        endingOrType: 'Phát âm là /z/',
        soundIpa: '/z/',
        memoryTrick: 'Quy tắc: Các trường hợp còn lại (nguyên âm và các phụ âm hữu thanh như /b/, /d/, /g/, /m/, /n/, /l/...)',
        examples: [
          { word: 'pens', phonetic: '/penz/', meaningVi: 'những cây bút (/n/ + s)' },
          { word: 'dogs', phonetic: '/dɒɡz/', meaningVi: 'những chú chó (/g/ + s)' },
          { word: 'apples', phonetic: '/ˈæplz/', meaningVi: 'những quả táo (/l/ + s)' },
          { word: 'days', phonetic: '/deɪz/', meaningVi: 'những ngày (nguyên âm + s)' },
        ]
      }
    ],
    practiceQuiz: [
      {
        id: 'quiz_s_1',
        question: 'Đuôi "-s" trong từ "cats" được phát âm là gì?',
        options: ['/s/', '/z/', '/ɪz/'],
        correctAnswer: '/s/',
        explanation: 'Từ "cat" kết thúc bằng âm vô thanh /t/ (thuộc "Thời Phong Kiến..."), nên đuôi -s đọc là /s/.',
        audioWord: 'cats'
      },
      {
        id: 'quiz_s_2',
        question: 'Đuôi "-es" trong từ "watches" được phát âm là gì?',
        options: ['/s/', '/z/', '/ɪz/'],
        correctAnswer: '/ɪz/',
        explanation: 'Từ "watch" kết thúc bằng âm /tʃ/ (ch), nên đuôi -es đọc là /ɪz/.',
        audioWord: 'watches'
      },
      {
        id: 'quiz_s_3',
        question: 'Đuôi "-s" trong từ "pens" được phát âm là gì?',
        options: ['/s/', '/z/', '/ɪz/'],
        correctAnswer: '/z/',
        explanation: 'Từ "pen" kết thúc bằng âm hữu thanh /n/, nên đuôi -s đọc là /z/.',
        audioWord: 'pens'
      }
    ]
  },
  {
    id: 'ed',
    title: 'Phát âm đuôi -ed',
    subtitle: 'Học cách đọc chuẩn 3 âm: /ɪd/, /t/ và /d/',
    description: 'Đuôi -ed thường xuất hiện ở các động từ quá khứ đơn (Past Simple). Chúng ta có 3 cách đọc rất dễ thuộc.',
    rules: [
      {
        id: 'rule_ed_id',
        endingOrType: 'Phát âm là /ɪd/',
        soundIpa: '/ɪd/',
        memoryTrick: 'Mẹo nhớ: "Tiền Đô" (khi động từ tận cùng bằng âm /t/ hoặc /d/)',
        examples: [
          { word: 'wanted', phonetic: '/ˈwɒntɪd/', meaningVi: 'đã muốn (/t/ + ed)' },
          { word: 'needed', phonetic: '/ˈniːdɪd/', meaningVi: 'đã cần (/d/ + ed)' },
          { word: 'visited', phonetic: '/ˈvɪzɪtɪd/', meaningVi: 'đã đến thăm (/t/ + ed)' },
        ]
      },
      {
        id: 'rule_ed_t',
        endingOrType: 'Phát âm là /t/',
        soundIpa: '/t/',
        memoryTrick: 'Mẹo nhớ: "Chính Phủ Pháp Sang Sông Không Chết" (tận cùng bằng các âm /tʃ/ (ch), /p/, /f/, /s/, /ʃ/ (sh), /k/)',
        examples: [
          { word: 'stopped', phonetic: '/stɒpt/', meaningVi: 'đã dừng lại (/p/ + ed)' },
          { word: 'cooked', phonetic: '/kʊkt/', meaningVi: 'đã nấu ăn (/k/ + ed)' },
          { word: 'washed', phonetic: '/wɒʃt/', meaningVi: 'đã rửa (/sh/ + ed)' },
          { word: 'watched', phonetic: '/wɒtʃt/', meaningVi: 'đã xem (/ch/ + ed)' },
        ]
      },
      {
        id: 'rule_ed_d',
        endingOrType: 'Phát âm là /d/',
        soundIpa: '/d/',
        memoryTrick: 'Quy tắc: Các trường hợp còn lại (nguyên âm và các phụ âm hữu thanh khác)',
        examples: [
          { word: 'played', phonetic: '/pleɪd/', meaningVi: 'đã chơi' },
          { word: 'cleaned', phonetic: '/kliːnd/', meaningVi: 'đã lau dọn' },
          { word: 'opened', phonetic: '/ˈəʊpənd/', meaningVi: 'đã mở' },
        ]
      }
    ],
    practiceQuiz: [
      {
        id: 'quiz_ed_1',
        question: 'Đuôi "-ed" trong từ "wanted" được phát âm là gì?',
        options: ['/ɪd/', '/t/', '/d/'],
        correctAnswer: '/ɪd/',
        explanation: 'Từ "want" tận cùng bằng âm /t/ (mẹo "Tiền Đô"), nên đuôi -ed phát âm là /ɪd/.',
        audioWord: 'wanted'
      },
      {
        id: 'quiz_ed_2',
        question: 'Đuôi "-ed" trong từ "cooked" được phát âm là gì?',
        options: ['/t/', '/d/', '/ɪd/'],
        correctAnswer: '/t/',
        explanation: 'Từ "cook" kết thúc bằng âm /k/ (vô thanh), nên đuôi -ed đọc là /t/.',
        audioWord: 'cooked'
      },
      {
        id: 'quiz_ed_3',
        question: 'Đuôi "-ed" trong từ "played" được phát âm là gì?',
        options: ['/d/', '/t/', '/ɪd/'],
        correctAnswer: '/d/',
        explanation: 'Từ "play" tận cùng bằng nguyên âm /eɪ/, nên đuôi -ed đọc là /d/.',
        audioWord: 'played'
      }
    ]
  },
  {
    id: 'word-stress',
    title: 'Trọng âm của từ (Word Stress)',
    subtitle: 'Cách nhấn âm chuẩn xác cho từ 2 âm tiết',
    description: 'Trọng âm giống như nốt nhạc cao hơn, to hơn và rõ hơn trong một từ tiếng Anh. Nhấn đúng trọng âm giúp người nghe hiểu ngay!',
    rules: [
      {
        id: 'stress_noun_adj',
        endingOrType: 'Danh từ & Tính từ 2 âm tiết -> Nhấn ÂM 1',
        soundIpa: 'ˈO o (Nhấn đầu)',
        memoryTrick: 'Đa số danh từ & tính từ quen thuộc thường nhấn vào âm tiết thứ nhất.',
        examples: [
          { word: 'table', phonetic: '/ˈteɪbl/', meaningVi: 'cái bàn (Danh từ: TEI-bl)' },
          { word: 'happy', phonetic: '/ˈhæpi/', meaningVi: 'vui vẻ (Tính từ: HAP-py)' },
          { word: 'summer', phonetic: '/ˈsʌmə/', meaningVi: 'mùa hè (Danh từ: SUM-mer)' },
          { word: 'clever', phonetic: '/ˈklevə/', meaningVi: 'thông minh (Tính từ: CLE-ver)' },
        ]
      },
      {
        id: 'stress_verb',
        endingOrType: 'Động từ 2 âm tiết -> Nhấn ÂM 2',
        soundIpa: 'o ˈO (Nhấn sau)',
        memoryTrick: 'Đa số động từ 2 âm tiết thường nhấn vào âm tiết thứ hai.',
        examples: [
          { word: 'relax', phonetic: '/rɪˈlæks/', meaningVi: 'thư giãn (Động từ: re-LAX)' },
          { word: 'begin', phonetic: '/bɪˈɡɪn/', meaningVi: 'bắt đầu (Động từ: be-GIN)' },
          { word: 'enjoy', phonetic: '/ɪnˈdʒɔɪ/', meaningVi: 'thưởng thức (Động từ: en-JOY)' },
        ]
      }
    ],
    practiceQuiz: [
      {
        id: 'quiz_stress_1',
        question: 'Từ "happy" (vui vẻ - tính từ 2 âm tiết) có trọng âm rơi vào âm tiết thứ mấy?',
        options: ['Âm tiết thứ 1', 'Âm tiết thứ 2'],
        correctAnswer: 'Âm tiết thứ 1',
        explanation: 'Tính từ 2 âm tiết đa phần nhấn âm 1: HAPPY /ˈhæpi/.',
        audioWord: 'happy'
      },
      {
        id: 'quiz_stress_2',
        question: 'Từ "enjoy" (thích thú - động từ 2 âm tiết) có trọng âm rơi vào âm tiết thứ mấy?',
        options: ['Âm tiết thứ 2', 'Âm tiết thứ 1'],
        correctAnswer: 'Âm tiết thứ 2',
        explanation: 'Động từ 2 âm tiết đa phần nhấn âm 2: en-JOY /ɪnˈdʒɔɪ/.',
        audioWord: 'enjoy'
      }
    ]
  },
  {
    id: 'sentence-stress',
    title: 'Trọng âm câu & Ngữ điệu',
    subtitle: 'Nói tiếng Anh tự nhiên như người bản xứ',
    description: 'Trong một câu, ta không đọc đều đều từng chữ mà sẽ nhấn giọng vào các "từ mang nội dung chính" và lên/xuống giọng ở cuối câu.',
    rules: [
      {
        id: 'content_words',
        endingOrType: 'Nhấn vào Từ mang nội dung (Content Words)',
        soundIpa: '🎵 Nhấn mạnh',
        memoryTrick: 'Nhấn vào: Danh từ, Động từ chính, Tính từ, Từ để hỏi (What, Where, Who). Lướt nhẹ: a, an, the, in, on, is, am, are.',
        examples: [
          { word: 'I LIKE apples.', phonetic: 'Nhấn: LIKE, APPLES', meaningVi: 'Tớ THÍCH những quả TÁO.' },
          { word: 'She is a GOOD student.', phonetic: 'Nhấn: GOOD, STUDENT', meaningVi: 'Bạn ấy là một học sinh TỐT.' },
        ]
      },
      {
        id: 'intonation',
        endingOrType: 'Ngữ điệu cuối câu (Intonation)',
        soundIpa: '↗️ Lên giọng / ↘️ Xuống giọng',
        memoryTrick: 'Câu hỏi Yes/No -> Lên giọng ↗️ cuối câu. Câu trần thuật & câu hỏi Wh -> Xuống giọng ↘️ cuối câu.',
        examples: [
          { word: 'Can you swim? ↗️', phonetic: 'Lên giọng ở từ swim', meaningVi: 'Cậu biết bơi không? (Câu hỏi Yes/No)' },
          { word: 'What is your name? ↘️', phonetic: 'Xuống giọng ở từ name', meaningVi: 'Tên cậu là gì? (Câu hỏi Wh-)' },
        ]
      }
    ],
    practiceQuiz: [
      {
        id: 'quiz_sent_1',
        question: 'Với câu hỏi Yes/No "Can you swim?", chúng ta thường:',
        options: ['Lên giọng ở cuối câu ↗️', 'Xuống giọng ở cuối câu ↘️', 'Đọc đều đều như tiếng trống'],
        correctAnswer: 'Lên giọng ở cuối câu ↗️',
        explanation: 'Câu hỏi Yes/No trong tiếng Anh thường lên giọng ở âm cuối để thể hiện sự dò hỏi.',
        audioWord: 'Can you swim?'
      },
      {
        id: 'quiz_sent_2',
        question: 'Trong câu "I can ride a bicycle.", từ nào cần được nhấn mạnh nhất?',
        options: ['ride & bicycle', 'I & can', 'a & can'],
        correctAnswer: 'ride & bicycle',
        explanation: '"ride" (động từ chính) và "bicycle" (danh từ) là 2 từ mang nội dung quan trọng nhất của câu.',
        audioWord: 'I can ride a bicycle'
      }
    ]
  }
];
