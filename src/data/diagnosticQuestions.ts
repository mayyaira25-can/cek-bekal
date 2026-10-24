import { DiagnosticQuestion } from '../types/chemistry';

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 1,
    competency: 'konsentrasi_partikel',
    competencyLabel: 'Kerapatan & Konsentrasi Partikel',
    prompt: 'Perhatikan dua wadah tertutup bervolume sama di bawah ini. Wadah A berisi sedikit partikel reaktan, sedangkan Wadah B berisi partikel reaktan yang sangat rapat dan padat. Mengapa reaksi pada Wadah B berlangsung jauh lebih cepat?',
    visualType: 'concentration_beakers',
    options: [
      {
        id: '1a',
        text: 'Wadah B memiliki partikel yang lebih banyak sehingga peluang terjadinya tabrakan antar partikel menjadi lebih tinggi.',
        isCorrect: true,
      },
      {
        id: '1b',
        text: 'Partikel pada Wadah B secara alami memiliki ukuran yang jauh lebih besar daripada Wadah A.',
        isCorrect: false,
      },
      {
        id: '1c',
        text: 'Wadah B menghasilkan gas yang membuat suhu di dalam wadah langsung turun drastis.',
        isCorrect: false,
      },
      {
        id: '1d',
        text: 'Partikel pada Wadah B tidak perlu bertabrakan sama sekali untuk membentuk zat baru.',
        isCorrect: false,
      },
    ],
    explanation: 'Dalam volume yang sama, larutan atau campuran yang lebih pekat memiliki kerapatan partikel yang tinggi. Ibarat lorong sempit yang dipenuhi banyak orang berjalan, peluang mereka untuk saling bersenggolan (bertabrakan) menjadi jauh lebih sering terjadi dibandingkan di lorong yang sepi.',
    visualExplanation: 'Kerapatan Tinggi = Frekuensi Tabrakan Melonjak = Pembentukan Hasil Lebih Cepat'
  },
  {
    id: 2,
    competency: 'luas_permukaan',
    competencyLabel: 'Luas Bidang Sentuh & Permukaan',
    prompt: 'Dua orang siswa mereaksikan vitamin C dengan air. Siswa 1 memasukkan tablet utuh (bongkahan padat), sedangkan Siswa 2 menggerus tablet tersebut menjadi serbuk halus terlebih dahulu. Mengapa serbuk halus lebih cepat larut dan menghasilkan gelembung reaksi?',
    visualType: 'surface_area_blocks',
    options: [
      {
        id: '2a',
        text: 'Serbuk halus memiliki massa total yang jauh lebih ringan daripada bongkahan aslinya.',
        isCorrect: false,
      },
      {
        id: '2b',
        text: 'Dengan digerus menjadi butiran kecil, seluruh permukaan partikel terbuka dan langsung bersentuhan serentak dengan molekul air.',
        isCorrect: true,
      },
      {
        id: '2c',
        text: 'Bongkahan tablet utuh menyerap panas dari air sehingga memperlambat tumbukan.',
        isCorrect: false,
      },
      {
        id: '2d',
        text: 'Serbuk vitamin C berubah wujud menjadi gas sebelum masuk ke dalam air.',
        isCorrect: false,
      },
    ],
    explanation: 'Pada bongkahan padat, partikel yang berada di lapisan dalam terkunci dan terlindungi, sehingga molekul pelarut hanya bisa menabrak bagian kulit luar. Saat dihancurkan menjadi serbuk, setiap butiran kecil membuka permukaan sentuh baru sehingga tabrakan dapat berlangsung serentak di mana-mana.',
    visualExplanation: 'Serbuk Terurai = Semua Bidang Kontak Terbuka = Reaksi Serentak di Seluruh Bagian'
  },
  {
    id: 3,
    competency: 'suhu_kinetik',
    competencyLabel: 'Suhu & Energi Gerak Partikel',
    prompt: 'Mengapa teh manis lebih cepat larut dalam air mendidih (suhu tinggi) dibandingkan dalam air es (suhu rendah)? Apa yang sebenarnya dialami oleh partikel zat ketika suhu dinaikkan?',
    visualType: 'temperature_speed',
    options: [
      {
        id: '3a',
        text: 'Kenaikan suhu membuat partikel bergerak lebih lambat dan tenang sehingga tidak saling bertabrakan.',
        isCorrect: false,
      },
      {
        id: '3b',
        text: 'Pemberian panas membuat partikel bergerak dan bergetar jauh lebih lincah dan cepat, sehingga tabrakan terjadi lebih sering dengan hentakan tenaga yang kuat.',
        isCorrect: true,
      },
      {
        id: '3c',
        text: 'Suhu tinggi memusnahkan sebagian molekul air sehingga ruang gerak menjadi lebih kosong.',
        isCorrect: false,
      },
      {
        id: '3d',
        text: 'Suhu tinggi hanya mengubah warna larutan tanpa mempengaruhi pergerakan partikel.',
        isCorrect: false,
      },
    ],
    explanation: 'Suhu adalah indikator rata-rata energi gerak (energi kinetik) partikel. Saat dipanaskan, partikel menyerap energi panas dan bergerak melesat kencang. Akibatnya, frekuensi tabrakan meningkat dan hentakan tabrakannya memiliki energi yang cukup kuat untuk memicu reaksi kimia.',
    visualExplanation: 'Suhu Naik = Partikel Melesat Cepat = Hentakan Tumbukan Berenergi Tinggi'
  },
  {
    id: 4,
    competency: 'tumbukan_efektif',
    competencyLabel: 'Teori Tumbukan & Posisi Tepat',
    prompt: 'Di dalam suatu tabung reaksi, jutaan partikel saling bertabrakan setiap detiknya, namun hanya sebagian tabrakan yang berhasil menghasilkan zat baru. Apa dua syarat utama agar sebuah tabrakan dapat menghasilkan reaksi kimia?',
    visualType: 'collision_angle',
    options: [
      {
        id: '4a',
        text: 'Tabrakan harus terjadi tepat pada tengah malam dan di dalam wadah yang terbuat dari logam mulia.',
        isCorrect: false,
      },
      {
        id: '4b',
        text: 'Partikel harus bertabrakan dengan arah hadap (posisi) yang pas serta memiliki energi benturan yang cukup kuat untuk melampaui rintangan energi reaksi.',
        isCorrect: true,
      },
      {
        id: '4c',
        text: 'Semua partikel yang saling bersentuhan pasti langsung berubah menjadi zat hasil reaksi tanpa syarat apapun.',
        isCorrect: false,
      },
      {
        id: '4d',
        text: 'Partikel hanya boleh bertabrakan dalam garis lurus horizontal tanpa boleh memantul.',
        isCorrect: false,
      },
    ],
    explanation: 'Tidak semua tabrakan menghasilkan reaksi. Tabrakan yang menghasilkan zat baru disebut "Tumbukan Efektif". Syaratnya: (1) Sudut tabrakan/orientasi partikel harus tepat agar ikatan kimia lama bisa putus, dan (2) Benturan harus memiliki energi yang cukup untuk melampaui bukit energi reaksi.',
    visualExplanation: 'Posisi Pas + Hentakan Kuat = Ikatan Lama Putus & Zat Baru Terbentuk'
  },
  {
    id: 5,
    competency: 'katalis_energi',
    competencyLabel: 'Katalis & Hambatan Energi',
    prompt: 'Bayangkan sebuah bukit rintangan yang harus didaki oleh kendaraan. Ada jalur mendaki bukit terjal yang melelahkan, dan ada jalur terowongan datar yang menembus bukit tersebut. Mengapa penambahan katalis dapat membuat reaksi kimia berjalan berkali-kali lipat lebih cepat?',
    visualType: 'catalyst_hill',
    options: [
      {
        id: '5a',
        text: 'Katalis menyediakan rute alternatif berhambatan energi yang lebih rendah (seperti terowongan tembus), sehingga lebih banyak partikel yang sanggup melewatinya.',
        isCorrect: true,
      },
      {
        id: '5b',
        text: 'Katalis ikut terbakar dan habis lenyap menjadi zat beracun di akhir reaksi.',
        isCorrect: false,
      },
      {
        id: '5c',
        text: 'Katalis membuat bukit rintangan reaksi menjadi semakin tinggi dan sulit dilewati.',
        isCorrect: false,
      },
      {
        id: '5d',
        text: 'Katalis menghentikan seluruh pergerakan partikel agar reaksi selesai seketika.',
        isCorrect: false,
      },
    ],
    explanation: 'Katalis bekerja bagaikan pembuat terowongan pintas. Katalis tidak menaikkan energi partikel, melainkan merendahkan ambang batas rintangan energi (energi aktivasi). Partikel yang bertumbukan dengan tenaga sedang pun kini dapat berhasil bereaksi melalui jalur pintas ini.',
    visualExplanation: 'Katalis = Membuka Jalan Pintas Berenergi Rendah Tanpa Habis Terpakai'
  },
  {
    id: 6,
    competency: 'laju_vs_waktu',
    competencyLabel: 'Kecepatan Reaksi vs Waktu Tuntas',
    prompt: 'Dalam kehidupan sehari-hari, bagaimana hubungan antara laju (kecepatan) suatu proses kimia dengan waktu yang dibutuhkan untuk menyelesaikan proses tersebut?',
    visualType: 'reaction_time_graph',
    options: [
      {
        id: '6a',
        text: 'Semakin cepat laju suatu reaksi berlangsung, maka waktu yang dibutuhkan reaksi tersebut untuk tuntas justru semakin singkat.',
        isCorrect: true,
      },
      {
        id: '6b',
        text: 'Laju reaksi yang sangat cepat selalu membutuhkan waktu berhari-hari untuk selesai.',
        isCorrect: false,
      },
      {
        id: '6c',
        text: 'Laju reaksi dan waktu reaksi sama sekali tidak memiliki kaitan dalam kimia.',
        isCorrect: false,
      },
      {
        id: '6d',
        text: 'Waktu reaksi akan selalu tepat 60 detik apa pun jenis pereaksi yang digunakan.',
        isCorrect: false,
      },
    ],
    explanation: 'Kecepatan berbanding terbalik dengan waktu. Seperti mobil balap yang melaju kencang mencapai garis finis dalam hitungan detik, reaksi kimia dengan laju yang tinggi akan menghabiskan reaktan dan membentuk produk dalam tempo yang sangat singkat.',
    visualExplanation: 'Laju Reaksi Meningkat = Waktu Penyelesaian Menjadi Singkat'
  }
];
