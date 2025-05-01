const sections = [
    {
      title: "Harry Potter", 
      questions: [
        { icon: "🧙‍♂️", text: "Harry Potter serisi toplam 8 kitaptan oluşur.", correct: false, explanation: "Seri 7 kitaptır, 8. kitap tiyatro senaryosudur." },
        { icon: "🦉", text: "Harry'nin baykuşunun adı Hedwig'dir.", correct: true, explanation: "Doğru, sadık baykuşu Hedwig'tir." },
        { icon: "⚡", text: "Harry'nin alnındaki yara yıldız şeklidir.", correct: false, explanation: "Hayır, yara izi yıldırım şekillidir." },
        { icon: "🔮", text: "Dumbledore, Hogwarts'ın müdürüdür.", correct: true, explanation: "Doğru, Albus Dumbledore Hogwarts'ın müdürüdür." },
        { icon: "🧹", text: "Quidditch, Hogwarts'ta öğretilen bir dersin adıdır.", correct: false, explanation: "Hayır, Quidditch bir spor dalıdır, ders değildir." },
      ]
    },
    {
      title: "Klasikler", 
      questions: [
        { icon: "📘", text: "Dostoyevski, Suç ve Ceza'nın yazarıdır.", correct: true, explanation: "Doğru, en bilinen eseridir." },
        { icon: "🧠", text: "Kafka, Sineklerin Tanrısı'nı yazmıştır.", correct: false, explanation: "Hayır, bu kitap William Golding'e aittir." },
        { icon: "💀", text: "Hamlet bir Shakespeare karakteridir.", correct: true, explanation: "Evet, Shakespeare'in en meşhur trajedilerinden biridir." },
        { icon: "🌋", text: "Don Kişot, bir İtalyan şövalyesidir.", correct: false, explanation: "Hayır, Cervantes'in İspanyol karakteridir." },
        { icon: "📖", text: "Madame Bovary, Gustave Flaubert'in eseridir.", correct: true, explanation: "Doğru, 1856'da yayımlanmıştır." },
      ]
    },
    { title: "Yüzüklerin Efendisi", questions: [
        { icon: "💍", text: "Yüzüklerin Efendisi üç kitaptan oluşur.", correct: true, explanation: "Doğru, üçleme olarak yayımlandı." },
        { icon: "👣", text: "Frodo, Gandalf'ın oğlu olur.", correct: false, explanation: "Hayır, aralarında akrabalık yoktur." },
        { icon: "🌋", text: "Yüzük Mordor'da yok edilir.", correct: true, explanation: "Evet, Sauron'un diyarı Mordor'da yok edilir." },
        { icon: "🧙‍♂️", text: "Legolas, bir cücedir.", correct: false, explanation: "Hayır, Legolas bir elf'tir." },
        { icon: "⚔️", text: "Aragorn, Gondor'un kralıdır.", correct: true, explanation: "Doğru, sonradan tahta geçer." },
      ]
    },
    { title: "Modern Romanlar", questions: [
        { icon: "🎈", text: "Oğuz Atay'ın Tutunamayanlar adlı eseri bir şiirdir.", correct: false, explanation: "Hayır, bir romandır." },
        { icon: "📚", text: "Zülfü Livaneli'nin Serenad adlı eseri Almanya'da geçer.", correct: false, explanation: "Büyük kısmı İstanbul'da geçer." },
        { icon: "💔", text: "Buket Uzuner'in Kumral Ada Mavi Tuna romanıdır.", correct: true, explanation: "Doğru, modern Türk edebiyatının sevilen romanlarındandır." },
        { icon: "🧳", text: "Sabahattin Ali'nin Kürk Mantolu Madonna'sı bir denemedir.", correct: false, explanation: "Hayır, bu bir romandır." },
        { icon: "🎨", text: "Orhan Pamuk'un Benim Adım Kırmızı romanında minyatür sanatı konu edilir.", correct: true, explanation: "Doğru, minyatürcüler anlatılır." },
      ]
    },
    { title: "Fantastik Dünya", questions: [
        { icon: "🐉", text: "Ejderha Dövmeli Kız bir fantastik romandır.", correct: false, explanation: "Hayır, polisiye-gerilimdir." },
        { icon: "🗡️", text: "Game of Thrones kitap serisi George R. R. Martin'e aittir.", correct: true, explanation: "Doğru, Buz ve Ateşin Şarkısı serisidir." },
        { icon: "👑", text: "Aslan Kral bir kitap uyarlamasıdır.", correct: false, explanation: "Hayır, özgün bir Disney yapımıdır." },
        { icon: "🦁", text: "Narnia Günlükleri'nde Aslan konuşur.", correct: true, explanation: "Evet, Aslan bilge bir liderdir." },
        { icon: "🔮", text: "Percy Jackson tanrı Poseidon'un oğludur.", correct: true, explanation: "Doğru, Yunan mitolojisine dayanır." },
      ]
    },
    {
    title: "Bilim Kurgu Edebiyatı",
    questions: [
      { icon: "🚀", text: "Isaac Asimov'un Vakıf serisi 7 kitaptan oluşur.", correct: true, explanation: "Evet, orijinal üçleme ve sonradan eklenenlerle birlikte 7 kitaptır." },
      { icon: "🤖", text: "Philip K. Dick'in Androidler Elektrikli Koyun Düşler mi? adlı eseri bir tiyatro oyunudur.", correct: false, explanation: "Hayır, bir romandır ve Blade Runner filmine ilham vermiştir." },
      { icon: "🌌", text: "Dune evreninde 'baharat' olarak bilinen madde bilinçsizliği artırır.", correct: false, explanation: "Hayır, tam tersine bilinci ve ömrü uzatır." },
      { icon: "👽", text: "H.G. Wells'in Dünyaların Savaşı eserinde Marslılar dost canlısı yaratıklardır.", correct: false, explanation: "Hayır, istilacı ve yıkıcıdırlar." },
      { icon: "🕰️", text: "Ray Bradbury'nin Fahrenheit 451 adlı eserinde kitaplar yakılarak yok edilir.", correct: true, explanation: "Doğru, distopik bir geleceği anlatır." },
    ]
  },
  {
    title: "Türk Edebiyatı",
    questions: [
      { icon: "✒️", text: "Yaşar Kemal'in İnce Memed romanı Toros Dağları'nda geçer.", correct: true, explanation: "Doğru, Çukurova ve Toroslar romanın ana mekanlarıdır." },
      { icon: "🏘️", text: "Orhan Kemal'in Bereketli Topraklar Üzerinde üç ciltten oluşur.", correct: true, explanation: "Evet, üçlemedir." },
      { icon: "🌳", text: "Tarık Buğra'nın Küçük Ağa romanı Kurtuluş Savaşı'nı anlatır.", correct: true, explanation: "Doğru, Ankara ve çevresindeki olayları ele alır." },
      { icon: "👩‍🏫", text: "Halide Edip Adıvar'ın Sinekli Bakkal eseri İstanbul'un varoşlarında geçer.", correct: true, explanation: "Doğru, yoksul bir mahalledeki yaşamı anlatır." },
      { icon: "📜", text: "Ahmet Hamdi Tanpınar'ın Saatleri Ayarlama Enstitüsü bir otobiyografidir.", correct: false, explanation: "Hayır, kurgusal bir romandır." },
    ]
  },
  {
    title: "Mitoloji",
    questions: [
      { icon: "🔱", text: "Poseidon, Yunan mitolojisinde deniz tanrısıdır.", correct: true, explanation: "Doğru, aynı zamanda depremlerin ve atların da tanrısıdır." },
      { icon: "⚡", text: "Zeus'un sembolü çift başlı baltadır.", correct: false, explanation: "Hayır, sembolü şimşektir." },
      { icon: "🏹", text: "Artemis, avcılık, vahşi doğa ve ay tanrıçasıdır.", correct: true, explanation: "Doğru, aynı zamanda bekaretin de tanrıçasıdır." },
      { icon: "🔥", text: "Hades, yeraltı dünyasının değil, ateşin tanrısıdır.", correct: false, explanation: "Hayır, yeraltı dünyasının tanrısıdır; ateşin tanrısı Hephaistos'tur." },
      { icon: "🕊️", text: "Afrodit'in sembollerinden biri güvercindir.", correct: true, explanation: "Doğru, aşk ve güzellik tanrıçasının sembollerindendir." },
    ]
  },
  {
    title: "Çocuk Edebiyatı",
    questions: [
      { icon: "🦊", text: "Küçük Prens bir gezegende tek başına yaşayan bir çocuktur.", correct: false, explanation: "Hayır, farklı gezegenleri ziyaret eder." },
      { icon: "👧", text: "Alice Harikalar Diyarında'da beyaz bir tavşanı takip eder.", correct: true, explanation: "Doğru, maceraları bu şekilde başlar." },
      { icon: "🤥", text: "Pinokyo'nun burnu yalan söyledikçe kısalır.", correct: false, explanation: "Hayır, uzar." },
      { icon: "🐻", text: "Ayı Winnie the Pooh'nun en sevdiği yiyecek balıktır.", correct: false, explanation: "Hayır, baldır." },
      { icon: "🐘", text: "Fil Babar bir ormanda yaşar ve insanlarla arkadaş olur.", correct: true, explanation: "Doğru, maceraları bu temalar etrafında döner." },
    ]
  },
  {
    title: "Gizem ve Gerilim",
    questions: [
      { icon: "🕵️", text: "Agatha Christie'nin en ünlü dedektifi Hercule Poirot'dur.", correct: true, explanation: "Doğru, Belçikalı ünlü dedektif." },
      { icon: "🔪", text: "Sherlock Holmes genellikle olayları fiziksel kanıtlar yerine sezgileriyle çözer.", correct: false, explanation: "Hayır, keskin gözlemi ve mantıksal çıkarımlarıyla çözer." },
      { icon: "👻", text: "Stephen King'in O (It) romanında ana kötü karakter bir vampirdir.", correct: false, explanation: "Hayır, Pennywise adında şekil değiştiren kötücül bir varlıktır." },
      { icon: "🔒", text: "Edgar Allan Poe'nun Morgue Sokağı Cinayetleri modern polisiye edebiyatının ilk örneklerindendir.", correct: true, explanation: "Doğru, Auguste Dupin karakteriyle dikkat çeker." },
      { icon: "🌃", text: "Tess Gerritsen bir bilim kurgu yazarıdır.", correct: false, explanation: "Hayır, medikal gerilim türünde yazmaktadır." },
    ]
  },
];
  

  let currentSection = null;
  let questionIndex = 0;
  let score = 0;

  const menu = document.getElementById('menu');
  const game = document.getElementById('game');

  function showMenu() {
menu.style.display = 'block';
game.style.display = 'none';
document.getElementById('sectionButtons').innerHTML = '';
score = 0; // Skoru sıfırla
document.getElementById('final-score').innerText = ''; // Final skoru temizle
document.getElementById('feedback').innerText = ''; // Geri bildirimi temizle
sections.forEach((section, i) => {
  const btn = document.createElement('button');
  btn.className = 'section-btn';
  btn.innerText = section.title;
  btn.onclick = () => startSection(i);
  document.getElementById('sectionButtons').appendChild(btn);
});
}

  function startSection(index) {
    currentSection = sections[index];
    questionIndex = 0;
    score = 0;
    menu.style.display = 'none';
    game.style.display = 'block';
    document.getElementById('sectionTitle').innerText = currentSection.title;
    loadQuestion();
  }

  function loadQuestion() {
    if (questionIndex < currentSection.questions.length) {
      const q = currentSection.questions[questionIndex];
      document.getElementById('question').innerHTML = `${q.icon} ${q.text}`;
      document.getElementById('result').innerText = '';
      document.getElementById('explanation').innerText = '';
      document.getElementById('answerButtons').style.display = 'flex';
      document.getElementById('nextBtn').style.display = 'none';
    } else {
      showFinalScore();
    }
  }

  function answer(userAnswer) {
    const q = currentSection.questions[questionIndex];
    if (userAnswer === q.correct) {
      score++;
      document.getElementById('result').innerText = "✅ Doğru!";
    } else {
      document.getElementById('result').innerText = "❌ Yanlış!";
    }
    document.getElementById('explanation').innerText = q.explanation;
    document.getElementById('answerButtons').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'inline-block';
  }

  function nextQuestion() {
    questionIndex++;
    loadQuestion();
  }

  function showFinalScore() {
    document.getElementById('question').innerText = "Bölüm bitti!";
    document.getElementById('answerButtons').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('result').innerText = '';
    document.getElementById('explanation').innerText = '';
    document.getElementById('final-score').innerText = `Skorun: ${score}/${currentSection.questions.length}`;

    let comment = "";
    if (score === currentSection.questions.length) {
      comment = "Müthiş! Tam bir kitap bilgesisin! 📚🥇";
    } else if (score >= currentSection.questions.length * 0.6) {
      comment = "Gayet iyi! Kitaplarla aran iyi. 👍";
    } else {
      comment = "Daha çok kitap okumalıyız gibi 😅";
    }
    document.getElementById('feedback').innerText = comment;

    setTimeout(showMenu, 3000);
  }

  showMenu();