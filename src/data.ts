export type Golongan = 'A' | 'B' | 'C';

export interface Penalty {
  A: number | 'NA';
  B: number | 'NA';
  C: number | 'NA';
}

export interface ChecklistItem {
  id: string;
  no: string;
  kriteria: string;
  penalties?: Penalty;
  isSubItem?: boolean;
}

export interface ChecklistSubsection {
  id: string;
  name: string;
  items: ChecklistItem[];
}

export interface ChecklistSection {
  id: string;
  name: string;
  subsections: ChecklistSubsection[];
}

export const checklistData: ChecklistSection[] = [
  {
    id: "AreaLuar",
    name: "Inspeksi Area Luar TPP",
    subsections: [
      {
        id: "A",
        name: "A Lokasi",
        items: [
          { id: "A.1", no: "1", kriteria: "Lokasi bebas banjir", penalties: { A: 3, B: 3, C: 3 } },
          { id: "A.2", no: "2", kriteria: "Lokasi bebas dari pencemaran bau/asap/debu", penalties: { A: 1, B: 1, C: 1 } },
          { id: "A.3", no: "3", kriteria: "Lokasi bebas dari sumber bebas vektor dan binatang pembawa penyakit", penalties: { A: 1, B: 1, C: 1 } },
        ]
      },
      {
        id: "B",
        name: "B Bangunan dan Fasilitasnya",
        items: [
          { id: "B.1", no: "1", kriteria: "Bangunan pengolahan pangan memiliki pagar pembatas", penalties: { A: 1, B: 1, C: 1 } },
          { id: "B.2", no: "2", kriteria: "Area parkir kendaraan jauh dari pintu masuk bangunan pengolahan pangan untuk mencegah kontaminasi asap kendaraan masuk ke ruang pengolahan pangan", penalties: { A: 1, B: 1, C: 1 } },
          { id: "B.3", no: "3", kriteria: "Halaman bangunan pengolahan pangan bebas vektor dan binatang pembawa penyakit atau binatang peliharaan", penalties: { A: 1, B: 1, C: 1 } },
          { id: "B.4", no: "4", kriteria: "Jika halaman memiliki tanaman, tanaman tidak menempel langsung bangunan/dinding pengolahan pangan", penalties: { A: 1, B: 1, C: 1 } },
          { id: "B.5", no: "5", kriteria: "Dinding bangunan tidak ada retakan yang membuka ke dalam area pengolahan pangan", penalties: { A: 1, B: 1, C: 1 } },
          { id: "B.6", no: "6", kriteria: "Tersedia tempat sampah di area luar, yang:" },
          { id: "B.6.a", no: "a.", kriteria: "Tertutup rapat", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "B.6.b", no: "b.", kriteria: "Tidak ada bau yang menyengat", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "B.6.c", no: "c.", kriteria: "Tidak ada tumpukan sampah menggunung", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "B.7", no: "7", kriteria: "Terdapat sistem drainase di area luar, yang:" },
          { id: "B.7.a", no: "a.", kriteria: "Bersih", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "B.7.b", no: "b.", kriteria: "Tidak ada luapan air/sumbatan", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "B.7.c", no: "c.", kriteria: "Memiliki grease trap/penangkap lemak", penalties: { A: 'NA', B: 1, C: 1 }, isSubItem: true },
          { id: "B.8", no: "8", kriteria: "Plafon bagian luar bangunan pengolahan pangan:" },
          { id: "B.8.a", no: "a.", kriteria: "Tidak ada lubang ke area dalam bangunan pengolahan (tempat sarang atau akses vektor dan binatang pembawa penyakit masuk ke area pengolahan)", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "B.8.b", no: "b.", kriteria: "Tidak ada sawang/bebas kotoran", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "B.9", no: "9", kriteria: "Pintu masuk TPP:" },
          { id: "B.9.a", no: "a.", kriteria: "Bahan kuat dan tahan lama", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "B.9.b", no: "b.", kriteria: "Desain halus/rata", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "B.9.c", no: "c.", kriteria: "Dapat menutup rapat", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "B.9.d", no: "d.", kriteria: "Membuka ke arah luar", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "B.9.e", no: "e.", kriteria: "Selalu tertutup untuk menghindari akses vektor dan binatang pembawa penyakit (atau memiliki penghalang bebas vektor dan binatang pembawa penyakit seperti plastic curtain atau air curtain)", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "B.9.f", no: "f.", kriteria: "Khusus Golongan B dan C: pintu masuk bahan baku dan produk matang dibuat terpisah", penalties: { A: 'NA', B: 1, C: 1 }, isSubItem: true },
          { id: "B.10", no: "10", kriteria: "Memiliki ventilasi udara (jendela/exhaust/AC/lainnya) dengan:" },
          { id: "B.10.a", no: "a.", kriteria: "Bahan kuat dan tahan lama", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "B.10.b", no: "b.", kriteria: "Jika terbuka, memiliki kasa anti serangga yang mudah dilepas dan dibersihkan", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "B.10.c", no: "c.", kriteria: "Jika menggunakan exhaust atau air conditioner maka kondisi terawat, berfungsi dan bersih", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "B.11", no: "11", kriteria: "Tersedia ruang/area khusus untuk istirahat karyawan (jika lokasi TPP di gedung minimal disediakan kursi untuk istirahat karyawan)", penalties: { A: 'NA', B: 1, C: 1 } },
          { id: "B.12", no: "12", kriteria: "Tersedia wastafel sebelum masuk bangunan", penalties: { A: 'NA', B: 1, C: 1 } },
          { id: "B.13", no: "13", kriteria: "Wastafel:" },
          { id: "B.13.a", no: "a.", kriteria: "Terdapat media petunjuk cuci tangan (poster atau tulisan)", penalties: { A: 'NA', B: 1, C: 1 }, isSubItem: true },
          { id: "B.13.b", no: "b.", kriteria: "Terdapat sabun cuci tangan", penalties: { A: 'NA', B: 2, C: 2 }, isSubItem: true },
          { id: "B.13.c", no: "c.", kriteria: "Tersedia air mengalir", penalties: { A: 'NA', B: 2, C: 2 }, isSubItem: true },
          { id: "B.13.d", no: "d.", kriteria: "Tersedia pengering tangan (bisa hand dryer atau tisu, tetapi tidak boleh kain serbet)", penalties: { A: 'NA', B: 1, C: 1 }, isSubItem: true },
          { id: "B.13.e", no: "e.", kriteria: "Bahan kuat", penalties: { A: 'NA', B: 1, C: 1 }, isSubItem: true },
          { id: "B.13.f", no: "f.", kriteria: "Desain mudah dibersihkan", penalties: { A: 'NA', B: 1, C: 1 }, isSubItem: true },
        ]
      },
      {
        id: "C",
        name: "C Penanganan Pangan",
        items: [
          { id: "C.1", no: "1", kriteria: "Tidak ada pengolahan pangan di area luar bangunan pengolahan pangan yang tidak memiliki pelindung", penalties: { A: 3, B: 3, C: 3 } },
          { id: "C.2", no: "2", kriteria: "Pangan matang tidak disimpan dalam kondisi terbuka di area luar bangunan pengolahan pangan", penalties: { A: 3, B: 3, C: 3 } },
        ]
      },
      {
        id: "D",
        name: "D Fasilitas Karyawan",
        items: [
          { id: "D.1", no: "1", kriteria: "Loker karyawan (jika lokasi TPP di dalam gedung, posisi loker tidak boleh menyebabkan kontaminasi silang):" },
          { id: "D.1.a", no: "a.", kriteria: "Terdapat loker karyawan terpisah (perempuan dan laki-laki)", penalties: { A: 'NA', B: 1, C: 1 }, isSubItem: true },
          { id: "D.1.b", no: "b.", kriteria: "Terdapat tata tertib penggunaan loker", penalties: { A: 'NA', B: 1, C: 1 }, isSubItem: true },
          { id: "D.1.c", no: "c.", kriteria: "Loker tidak digunakan sebagai tempat penyimpanan makanan karyawan", penalties: { A: 'NA', B: 1, C: 1 }, isSubItem: true },
          { id: "D.1.d", no: "d.", kriteria: "Loker tidak digunakan sebagai tempat penyimpanan peralatan pengolahan pangan", penalties: { A: 'NA', B: 2, C: 2 }, isSubItem: true },
        ]
      },
      {
        id: "E",
        name: "E Area Penerimaan Bahan Baku",
        items: [
          { id: "E.1", no: "1", kriteria: "Area penerimaan bersih dan rapih", penalties: { A: 1, B: 1, C: 1 } },
          { id: "E.2", no: "2", kriteria: "Kendaraan untuk mengangkut bahan pangan bersih, dan tidak digunakan untuk selain bahan pangan", penalties: { A: 2, B: 2, C: 2 } },
          { id: "E.3", no: "3", kriteria: "Transit time bahan baku pangan cukup untuk memastikan bahan baku yang memerlukan pengendalian suhu (suhu chiller dan freezer) tidak rusak", penalties: { A: 'NA', B: 2, C: 2 } },
          { id: "E.4", no: "4", kriteria: "Suhu kendaraan yang mengangkut pangan segar (jika kondisi suhu dikendalikan sesuai suhu chiller atau freezer) harus sesuai", penalties: { A: 'NA', B: 2, C: 2 } },
        ]
      },
      {
        id: "F",
        name: "F Persyaratan Bahan Baku",
        items: [
          { id: "F.1", no: "1", kriteria: "Bahan pangan yang diterima disimpan dalam wadah dan suhu yang sesuai dengan jenis pangan tersebut", penalties: { A: 2, B: 2, C: 2 } },
          { id: "F.2", no: "2", kriteria: "Bahan baku pangan dalam kemasan:" },
          { id: "F.2.a", no: "a.", kriteria: "Memiliki label", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "F.2.b", no: "b.", kriteria: "Terdaftar atau ada izin edar", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "F.2.c", no: "c.", kriteria: "Tidak kedaluwarsa", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "F.2.d", no: "d.", kriteria: "Kemasan tidak rusak (menggelembung, bocor, penyok atau berkarat)", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "F.3", no: "3", kriteria: "Bahan pangan yang tidak dikemas/berlabel berasal dari sumber yang jelas/dipercaya", penalties: { A: 2, B: 2, C: 2 } },
          { id: "F.4", no: "4", kriteria: "Jika bahan pangan tidak langsung digunakan maka bahan pangan diberikan label tanggal penerimaan", penalties: { A: 1, B: 1, C: 1 } },
          { id: "F.5", no: "5", kriteria: "Tidak menggunakan makanan sisa yang sudah busuk sebagai bahan pangan untuk diolah menjadi makanan baru", penalties: { A: 2, B: 2, C: 2 } },
          { id: "F.6", no: "6", kriteria: "Jika menggunakan es batu yang dicampur dengan pangan matang, maka es batu harus dibuat dari air yang memenuhi standar kualitas air minum/air yang sudah diolah/dimasak", penalties: { A: 2, B: 2, C: 2 } },
          { id: "F.7", no: "7", kriteria: "Air untuk pengolahan pangan memenuhi standar kualitas air minum/air yang sudah diolah/dimasak", penalties: { A: 2, B: 2, C: 2 } }
        ]
      }
    ]
  },
  {
    id: "AreaDalam",
    name: "Inspeksi Area Dalam",
    subsections: [
      {
        id: "AreaDalam_A",
        name: "A Area Penyimpanan Umum",
        items: [
          { id: "AreaDalam.A.1", no: "1", kriteria: "Dinding ruang penyimpanan:" },
          { id: "AreaDalam.A.1.a", no: "a.", kriteria: "Bersih (tidak ada kotoran, jamur atau cat mengelupas)", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.A.1.b", no: "b.", kriteria: "Tidak retak", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.A.2", no: "2", kriteria: "Lantai ruang penyimpanan:" },
          { id: "AreaDalam.A.2.a", no: "a.", kriteria: "Bersih (tidak ada kotoran, jamur atau ceceran pangan yang mengerak)", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.A.2.b", no: "b.", kriteria: "Tidak retak atau kuat", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.A.2.c", no: "c.", kriteria: "Tidak ada genangan air (struktur lantai landai ke arah pembuangan air)", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.A.2.d", no: "d.", kriteria: "Pertemuan dengan dinding tidak membentuk sudut mati (jika tidak demikian, maka pembersihan harus efektif)", penalties: { A: 'NA', B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.A.3", no: "3", kriteria: "Langit -langit:" },
          { id: "AreaDalam.A.3.a", no: "a.", kriteria: "Tinggi minimal 2,4 meter dari lantai", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.A.3.b", no: "b.", kriteria: "Bersih", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.A.3.c", no: "c.", kriteria: "Tertutup rapat", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.A.3.d", no: "d.", kriteria: "Tidak ada jamur", penalties: { A: 3, B: 3, C: 3 }, isSubItem: true },
          { id: "AreaDalam.A.3.e", no: "e.", kriteria: "Permukaan rata (jika tidak rata maka harus bersih, bebas debu atau bebas vektor dan binatang pembawa penyakit )", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.A.3.f", no: "f.", kriteria: "Tidak ada kondensasi air yang jatuh langsung ke bahan pangan", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.A.4", no: "4", kriteria: "Penyimpanan bahan baku menggunakan kartu stok First In First Out/ First Expired First Out (FIFO/FEFO) (untuk bahan baku yang langsung habis, persyaratan ini dapat diabaikan)", penalties: { A: 1, B: 1, C: 1 } },
          { id: "AreaDalam.A.5", no: "5", kriteria: "Personil yang bekerja pada area ini:" },
          { id: "AreaDalam.A.5.a", no: "a.", kriteria: "Sehat", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.A.5.b", no: "b.", kriteria: "Menggunakan APD (masker) dengan benar", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.A.5.c", no: "c.", kriteria: "Menggunakan pakaian kerja", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.A.6", no: "6", kriteria: "Pencahayaan cukup dan lampu tercover (cover terbuat dari material yang tidak mudah pecah)", penalties: { A: 1, B: 1, C: 1 } },
          { id: "AreaDalam.A.7", no: "7", kriteria: "Tempat sampah:" },
          { id: "AreaDalam.A.7.a", no: "a.", kriteria: "Tertutup dan tidak rusak penutupnya", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.A.7.b", no: "b.", kriteria: "Tidak dibuka dengan tangan (dibuka dengan pedal kaki)", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.A.7.c", no: "c.", kriteria: "Dilapisi plastik", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.A.7.d", no: "d.", kriteria: "Dipisahkan antara sampah basah (organik) dan sampah kering (anorganik)", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.A.7.e", no: "e.", kriteria: "Tidak ada tumpukan sampah (pengangkutan keluar minimal 1 x 24 jam)", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.A.8", no: "8", kriteria: "Tidak ada vektor dan binatang pembawa penyakit atau hewan peliharaan berkeliaran di area ini", penalties: { A: 3, B: 3, C: 3 } },
          { id: "AreaDalam.A.9", no: "9", kriteria: "Metode pengendalian vektor dan binatang pembawa penyakit tidak menggunakan racun tetapi jebakan/perangkap yang tidak mengontaminasi pangan", penalties: { A: 3, B: 3, C: 3 } },
          { id: "AreaDalam.A.10", no: "10", kriteria: "Bahan kimia non pangan yang digunakan pada area ini memiliki label identitas dengan volume sesuai penggunaan harian (bukan kemasan besar)", penalties: { A: 2, B: 2, C: 2 } }
        ]
      },
      {
        id: "AreaDalam_A1",
        name: "A1 Area Penyimpanan Bahan Pangan",
        items: [
          { id: "AreaDalam.A1.1", no: "1", kriteria: "Ruang atau alat penyimpanan bahan pangan:" },
          { id: "AreaDalam.A1.1.a", no: "a.", kriteria: "Untuk bahan mentah dari hewan disimpan pada suhu ≤ 4 0 C", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.A1.1.b", no: "b.", kriteria: "Bahan mentah lain yang membutuhkan pendinginan, misalnya sayuran harus disimpan pada suhu yang sesuai", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.A1.1.c", no: "c.", kriteria: "Bahan pangan beku yang tidak langsung digunakan disimpan pada suhu -18 0C atau di bawahnya", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.A1.1.d", no: "d.", kriteria: "Penyimpanan bahan pangan:", isSubItem: true },
          { id: "AreaDalam.A1.1.d.1", no: "-", kriteria: "Disimpan di atas palet atau alas (jarak minimal 15 cm dari lantai)", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.A1.1.d.2", no: "-", kriteria: "Jarak penyimpanan dengan dinding minimal 5 cm", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.A1.1.d.3", no: "-", kriteria: "Jarak penyimpanan dengan langit - langit minimal 60 cm", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.A1.1.e", no: "e.", kriteria: "Suhu gudang bahan pangan kering dan kaleng dijaga kurang dari 25°C.", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.A1.1.f", no: "f.", kriteria: "Tidak terdapat bahan baku pangan yang kedalu warsa", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.A1.1.g", no: "g.", kriteria: "Tidak terdapat pangan yang busuk", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.A1.2", no: "2", kriteria: "Chiller/freezer (jika ada):" },
          { id: "AreaDalam.A1.2.a", no: "a.", kriteria: "Khusus menyimpan bahan baku (tidak menyatu dengan pangan matang)", penalties: { A: 3, B: 3, C: 3 }, isSubItem: true },
          { id: "AreaDalam.A1.2.b", no: "b.", kriteria: "Chiller/freezer atau termometer untuk monitoring sudah dikalibrasi", penalties: { A: 'NA', B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.A1.2.c", no: "c.", kriteria: "Suhu chiller sesuai (≤ 4 oC)", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.A1.2.d", no: "d.", kriteria: "Terdapat rekaman monitoring suhu chiller", penalties: { A: 'NA', B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.A1.2.e", no: "e.", kriteria: "Suhu freezer sesuai (≤ -15 oC)", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.A1.2.f", no: "f.", kriteria: "Terdapat rekaman monitoring suhu freezer", penalties: { A: 'NA', B: 1, C: 1 }, isSubItem: true }
        ]
      },
      {
        id: "AreaDalam_A2",
        name: "A2 Area Penyimpanan Kemasan",
        items: [
          { id: "AreaDalam.A2.1", no: "1", kriteria: "Terdapat area khusus penyimpanan kemasan", penalties: { A: 1, B: 1, C: 1 } },
          { id: "AreaDalam.A2.2", no: "2", kriteria: "Penyimpanan kemasan:" },
          { id: "AreaDalam.A2.2.a", no: "a.", kriteria: "Disimpan di atas palet (jarak minimal 15 cm dari lantai)", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.A2.2.b", no: "b.", kriteria: "Jarak penyimpanan dengan dinding minimal 5 cm", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.A2.2.c", no: "c.", kriteria: "Jarak penyimpanan dengan langit - langit minimal 60 cm", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.A2.3", no: "3", kriteria: "Kemasan khusus untuk pangan atau food grade", penalties: { A: 2, B: 2, C: 2 } }
        ]
      },
      {
        id: "AreaDalam_A3",
        name: "A3 Area Penyimpanan Bahan Kimia Non Pangan",
        items: [
          { id: "AreaDalam.A3.1", no: "1", kriteria: "Terdapat area/ruangan khusus (tidak menyatu dengan penyimpanan pangan siap saji atau bahan baku pangan)", penalties: { A: 2, B: 2, C: 2 } },
          { id: "AreaDalam.A3.2", no: "2", kriteria: "Ruangan penyimpanan memiliki akses terbatas (dikunci atau dengan metode lainnya yang sesuai)", penalties: { A: 'NA', B: 2, C: 2 } },
          { id: "AreaDalam.A3.3", no: "3", kriteria: "Bahan kimia memiliki label yang memuat informasi tentang identitas dan cara penggunaan", penalties: { A: 2, B: 2, C: 2 } }
        ]
      },
      {
        id: "AreaDalam_B",
        name: "B Area Pencucian",
        items: [
          { id: "AreaDalam.B.1", no: "1", kriteria: "Area/tempat pencucian peralatan terpisah dengan area/tempat pencucian pangan", penalties: { A: 1, B: 1, C: 1 } },
          { id: "AreaDalam.B.2", no: "2", kriteria: "Area pencucian peralatan dan pangan tidak digunakan untuk sanitasi karyawan seperti cuci tangan", penalties: { A: 1, B: 1, C: 1 } },
          { id: "AreaDalam.B.3", no: "3", kriteria: "Sarana pencucian peralatan terbuat dari bahan yang kuat, permukaan halus dan mudah dibersihkan", penalties: { A: 1, B: 1, C: 1 } },
          { id: "AreaDalam.B.4", no: "4", kriteria: "Proses pencucian peralatan dilakukan dengan 3 (tiga) proses yaitu pencucian, pembersihan dan sanitasi", penalties: { A: 1, B: 1, C: 1 } },
          { id: "AreaDalam.B.5", no: "5", kriteria: "Penggunaan disinfektan untuk pencucian bahan pangan, takarannya sesuai dengan persyaratan kesehatan/standar disinfektan", penalties: { A: 2, B: 2, C: 2 } },
          { id: "AreaDalam.B.6", no: "6", kriteria: "Pencucian bahan pangan menggunakan air dengan kualitas air minum/air yang sudah diolah/dimasak", penalties: { A: 2, B: 2, C: 2 } },
          { id: "AreaDalam.B.7", no: "7", kriteria: "Tersedia tempat sampah, yang:" },
          { id: "AreaDalam.B.7.a", no: "a.", kriteria: "Tertutup dan tidak rusak", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.B.7.b", no: "b.", kriteria: "Tidak dibuka dengan tangan (dibuka dengan pedal kaki)", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.B.7.c", no: "c.", kriteria: "Dilapisi plastik", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.B.7.d", no: "d.", kriteria: "Dipisahkan antara sampah basah (organik) dan sampah kering (anorganik)", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.B.7.e", no: "e.", kriteria: "Tidak ada tumpukan sampah (pengangkutan keluar minimal 1 x 24 jam)", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.B.8", no: "8", kriteria: "Pengeringan dengan menggunakan lap/kain majun yang bersih dan diganti secara rutin", penalties: { A: 2, B: 2, C: 2 } }
        ]
      },
      {
        id: "AreaDalam_C1",
        name: "C Area Persiapan, Pengolahan dan Pengemasan Pangan - C1 Umum",
        items: [
          { id: "AreaDalam.C1.1", no: "1", kriteria: "Dapur jasaboga terpisah dengan dapur keluarga", penalties: { A: 'NA', B: 1, C: 1 } },
          { id: "AreaDalam.C1.2", no: "2", kriteria: "Khusus golongan B dan C:" },
          { id: "AreaDalam.C1.2.a", no: "a.", kriteria: "Luas lantai dapur yang bebas dari peralatan minimal 2 meter persegi (2m²) untuk setiap penjamah pangan yang sedang bekerja", penalties: { A: 'NA', B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.C1.2.b", no: "b.", kriteria: "Tata letak peralatan sesuai alur pengelolaan pangan (alur linear: persiapan - pengolahan pangan - pengemasan, dan seterusnya)", penalties: { A: 'NA', B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.C1.3", no: "3", kriteria: "Dinding ruangan:" },
          { id: "AreaDalam.C1.3.a", no: "a.", kriteria: "Bersih (tidak ada kotoran, jamur atau cat mengelupas)", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.C1.3.b", no: "b.", kriteria: "Tidak retak", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.C1.3.c", no: "c.", kriteria: "Bagian dinding yang terkena percikan air/minyak dilapisi bahan kedap air/minyak", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.C1.4", no: "4", kriteria: "Lantai ruangan:" },
          { id: "AreaDalam.C1.4.a", no: "a.", kriteria: "Bersih (tidak ada kotoran, jamur atau ceceran pangan yang mengerak)", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.C1.4.b", no: "b.", kriteria: "Tidak retak atau kuat", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.C1.4.c", no: "c.", kriteria: "Tidak ada genangan air (struktur lantai landai ke arah pembuangan air)", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.C1.4.d", no: "d.", kriteria: "Pertemuan dengan dinding tidak membentuk sudut mati (jika tidak demikian, maka pembersihan harus efektif)", penalties: { A: 'NA', B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.C1.5", no: "5", kriteria: "Langit -langit:" },
          { id: "AreaDalam.C1.5.a", no: "a.", kriteria: "Tinggi minimal 2,4 meter dari lantai", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.C1.5.b", no: "b.", kriteria: "Bersih", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.C1.5.c", no: "c.", kriteria: "Tertutup rapat", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.C1.5.d", no: "d.", kriteria: "Tidak ada jamur", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.C1.5.e", no: "e.", kriteria: "Permukaan rata (jika tidak rata maka harus bersih, bebas debu atau bebas vektor dan binatang pembawa penyakit)", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.C1.5.f", no: "f.", kriteria: "Tidak ada kondensasi air yang langsung jatuh ke pangan", penalties: { A: 3, B: 3, C: 3 }, isSubItem: true },
          { id: "AreaDalam.C1.6", no: "6", kriteria: "Penyimpanan bahan yang akan diolah tidak langsung di atas lantai (harus menggunakan wadah atau alas)", penalties: { A: 2, B: 2, C: 2 } },
          { id: "AreaDalam.C1.7", no: "7", kriteria: "Personel yang bekerja pada area ini:" },
          { id: "AreaDalam.C1.7.a", no: "a.", kriteria: "Sehat", penalties: { A: 3, B: 3, C: 3 }, isSubItem: true },
          { id: "AreaDalam.C1.7.b", no: "b.", kriteria: "Menggunakan APD berupa:", isSubItem: true },
          { id: "AreaDalam.C1.7.b.1", no: "1.", kriteria: "Celemek", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.C1.7.b.2", no: "2.", kriteria: "Masker", penalties: { A: 3, B: 3, C: 3 }, isSubItem: true },
          { id: "AreaDalam.C1.7.b.3", no: "3.", kriteria: "Hairnet/penutup rambut", penalties: { A: 3, B: 3, C: 3 }, isSubItem: true },
          { id: "AreaDalam.C1.7.c", no: "c.", kriteria: "Menggunakan pakaian kerja yang hanya digunakan di tempat kerja", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.C1.7.d", no: "d.", kriteria: "Berkuku pendek, bersih dan tidak memakai pewarna kuku", penalties: { A: 3, B: 3, C: 3 }, isSubItem: true },
          { id: "AreaDalam.C1.7.e", no: "e.", kriteria: "Selalu mencuci tangan dengan sabun dan air mengalir sebelum dan secara berkala saat mengolah pangan", penalties: { A: 3, B: 3, C: 3 }, isSubItem: true },
          { id: "AreaDalam.C1.7.f", no: "f.", kriteria: "Tidak menggunakan perhiasan dan aksesoris lain (cincin, gelang, bros, dan lain - lain) ketika mengolah pangan", penalties: { A: 3, B: 3, C: 3 }, isSubItem: true },
          { id: "AreaDalam.C1.7.g", no: "g.", kriteria: "Pada saat mengolah pangan tidak:", isSubItem: true },
          { id: "AreaDalam.C1.7.g.1", no: "1.", kriteria: "merokok", penalties: { A: 3, B: 3, C: 3 }, isSubItem: true },
          { id: "AreaDalam.C1.7.g.2", no: "2.", kriteria: "bersin atau batuk di atas pangan langsung", penalties: { A: 3, B: 3, C: 3 }, isSubItem: true },
          { id: "AreaDalam.C1.7.g.3", no: "3.", kriteria: "meludah", penalties: { A: 3, B: 3, C: 3 }, isSubItem: true },
          { id: "AreaDalam.C1.7.g.4", no: "4.", kriteria: "mengunyah makanan/permen", penalties: { A: 3, B: 3, C: 3 }, isSubItem: true },
          { id: "AreaDalam.C1.7.g.5", no: "5.", kriteria: "menggaruk-garuk atau menyentuh anggota badan yang kotor dan kemudian menyentuh pangan", penalties: { A: 3, B: 3, C: 3 }, isSubItem: true },
          { id: "AreaDalam.C1.7.h", no: "h.", kriteria: "Mengambil pangan matang menggunakan sarung tangan atau alat bantu (contoh sendok, penjapit makanan)", penalties: { A: 3, B: 3, C: 3 }, isSubItem: true },
          { id: "AreaDalam.C1.7.i", no: "i.", kriteria: "Jika terluka maka luka ditutup dengan perban/sejenisnya dan ditutup penutup tahan air dan kondisi bersih", penalties: { A: 3, B: 3, C: 3 }, isSubItem: true },
          { id: "AreaDalam.C1.8", no: "8", kriteria: "Pencahayaan" },
          { id: "AreaDalam.C1.8.a", no: "a.", kriteria: "Cukup terang", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.C1.8.b", no: "b.", kriteria: "Lampu tercover di semua area dan cover tidak terbuat dari bahan kaca/yang mudah pecah", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.C1.8.c", no: "c.", kriteria: "Sumber pencahayaan alami seperti jendela tidak terbuka atau membuka langsung ke area luar", penalties: { A: 3, B: 3, C: 3 }, isSubItem: true },
          { id: "AreaDalam.C1.9", no: "9", kriteria: "Tersedia tempat sampah, yang:" },
          { id: "AreaDalam.C1.9.a", no: "a.", kriteria: "Tertutup dan tidak rusak penutupnya", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.C1.9.b", no: "b.", kriteria: "Desain tidak berlubang - lubang", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.C1.9.c", no: "c.", kriteria: "Tidak dibuka dengan tangan (bisa dengan pedal kaki)", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.C1.9.d", no: "d.", kriteria: "Dilapisi plastik", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.C1.9.e", no: "e.", kriteria: "Dipisahkan antara sampah basah (organik) dan sampah kering (anorganik)", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.C1.9.f", no: "f.", kriteria: "Tidak ada tumpukan sampah (pembuangan keluar minimal 1 x 24 jam)", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.C1.10", no: "10", kriteria: "Tidak ada vektor dan binatang pembawa penyakit atau hewan peliharaan berkeliaran di area ini", penalties: { A: 3, B: 3, C: 3 } },
          { id: "AreaDalam.C1.11", no: "11", kriteria: "Metode pengendalian vektor dan binatang pembawa penyakit tidak menggunakan racun tetapi jebakan/perangkap yang tidak mengontaminasi pangan", penalties: { A: 3, B: 3, C: 3 } },
          { id: "AreaDalam.C1.12", no: "12", kriteria: "Bahan kimia non pangan yang digunakan pada area ini memiliki label identitas dengan volume sesuai penggunaan harian (bukan kemasan besar)", penalties: { A: 3, B: 3, C: 3 } },
          { id: "AreaDalam.C1.13", no: "13", kriteria: "Pembuangan asap dapur dikeluarkan melalui cerobong yang dilengkapi dengan sungkup asap atau penyedot udara", penalties: { A: 'NA', B: 2, C: 2 } },
          { id: "AreaDalam.C1.14", no: "14", kriteria: "Bahan pangan yang akan digunakan dibersihkan dan dicuci dengan air mengalir sebelum dimasak", penalties: { A: 2, B: 2, C: 2 } },
          { id: "AreaDalam.C1.15", no: "15", kriteria: "Melakukan thawing/pelunakan dengan benar", penalties: { A: 2, B: 2, C: 2 } },
          { id: "AreaDalam.C1.16", no: "16", kriteria: "Pangan dimasak sampai matang sempurna", penalties: { A: 3, B: 3, C: 3 } },
          { id: "AreaDalam.C1.17", no: "17", kriteria: "Penyiapan buah dan sayuran segar yang langsung dikonsumsi dicuci dengan menggunakan air yang memenuhi standar kualitas air minum/air yang sudah diolah/dimasak", penalties: { A: 3, B: 3, C: 3 } },
          { id: "AreaDalam.C1.18", no: "18", kriteria: "Jika menggunakan es batu yang dicampur dengan pangan matang, maka es batu harus dibuat dari air yang memenuhi standar kualitas air minum/air yang sudah diolah/dimasak", penalties: { A: 3, B: 3, C: 3 } }
        ]
      },
      {
        id: "AreaDalam_C2",
        name: "C2 Fasilitas Higiene Sanitasi Personil",
        items: [
          { id: "AreaDalam.C2.1", no: "1", kriteria: "Tersedia wastafel, yang:" },
          { id: "AreaDalam.C2.1.a", no: "a.", kriteria: "Terdapat petunjuk cuci tangan", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.C2.1.b", no: "b.", kriteria: "Terdapat sabun cuci tangan", penalties: { A: 3, B: 3, C: 3 }, isSubItem: true },
          { id: "AreaDalam.C2.1.c", no: "c.", kriteria: "Tersedia air mengalir", penalties: { A: 3, B: 3, C: 3 }, isSubItem: true },
          { id: "AreaDalam.C2.1.d", no: "d.", kriteria: "Tersedia pengering tangan (bisa hand dryer atau tisu, tetapi tidak boleh kain serbet)", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.C2.1.e", no: "e.", kriteria: "Bahan kuat", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.C2.1.f", no: "f.", kriteria: "Desain mudah dibersihkan", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.C2.2", no: "2", kriteria: "Tersedia toilet untuk karyawan yang mudah diakses (lokasi bisa berada di luar area pengolahan) dan tidak boleh membuka langsung ke ruangan/area pengolahan pangan", penalties: { A: 3, B: 3, C: 3 } },
          { id: "AreaDalam.C2.2.a", no: "a.", kriteria: "Desain:" },
          { id: "AreaDalam.C2.2.a.1", no: "1.", kriteria: "Kuat", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.C2.2.a.2", no: "2.", kriteria: "Permukaan halus", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.C2.2.a.3", no: "3.", kriteria: "Mudah dibersihkan", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.C2.2.b", no: "b.", kriteria: "Jumlah cukup", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.C2.2.c", no: "c.", kriteria: "Tersedia:" },
          { id: "AreaDalam.C2.2.c.1", no: "1.", kriteria: "Air mengalir", penalties: { A: 3, B: 3, C: 3 }, isSubItem: true },
          { id: "AreaDalam.C2.2.c.2", no: "2.", kriteria: "Sabun cuci tangan", penalties: { A: 3, B: 3, C: 3 }, isSubItem: true },
          { id: "AreaDalam.C2.2.c.3", no: "3.", kriteria: "Tempah sampah", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.C2.2.c.4", no: "4.", kriteria: "Tisu/pengering", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.C2.2.c.5", no: "5.", kriteria: "Ventilasi yang baik dan tidak membuka langsung ke ruang pengolahan", penalties: { A: 3, B: 3, C: 3 }, isSubItem: true },
          { id: "AreaDalam.C2.2.c.6", no: "6.", kriteria: "Dilengkapi petunjuk cuci tangan setelah dari toilet", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.C2.2.d", no: "d.", kriteria: "Dilengkapi wastafel dan fasilitasnya (sabun dan air mengalir) untuk cuci tangan", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.C2.2.e", no: "e.", kriteria: "Khusus Golongan B dan C: toilet terpisah antara laki -laki dan perempuan", penalties: { A: 'NA', B: 1, C: 1 }, isSubItem: true }
        ]
      },
      {
        id: "AreaDalam_C3",
        name: "C3 Peralatan",
        items: [
          { id: "AreaDalam.C3.1", no: "1", kriteria: "Peralatan untuk pengolahan pangan:" },
          { id: "AreaDalam.C3.1.a", no: "a.", kriteria: "Bahan kuat", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.C3.1.b", no: "b.", kriteria: "Tidak terbuat dari kayu (contoh: talenan, alat pengaduk)", penalties: { A: 3, B: 3, C: 3 }, isSubItem: true },
          { id: "AreaDalam.C3.1.c", no: "c.", kriteria: "Tidak berkarat", penalties: { A: 3, B: 3, C: 3 }, isSubItem: true },
          { id: "AreaDalam.C3.1.d", no: "d.", kriteria: "Tara pangan (food grade)", penalties: { A: 3, B: 3, C: 3 }, isSubItem: true },
          { id: "AreaDalam.C3.1.e", no: "e.", kriteria: "Bersih sebelum digunakan", penalties: { A: 3, B: 3, C: 3 }, isSubItem: true },
          { id: "AreaDalam.C3.1.f", no: "f.", kriteria: "Setelah digunakan kondisi bersih dan kering", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.C3.1.g", no: "g.", kriteria: "Berbeda untuk pangan matang dan pangan mentah", penalties: { A: 3, B: 3, C: 3 }, isSubItem: true },
          { id: "AreaDalam.C3.1.h", no: "h.", kriteria: "Peralatan masak/makan sekali pakai tidak dipakai ulang dan food grade", penalties: { A: 3, B: 3, C: 3 }, isSubItem: true },
          { id: "AreaDalam.C3.2", no: "2", kriteria: "Tersedia termometer yang berfungsi dan akurat", penalties: { A: 'NA', B: 2, C: 2 } },
          { id: "AreaDalam.C3.3", no: "3", kriteria: "Peralatan personal (misalnya handphone), peralatan kantor, dan lain -lain yang tidak diperlukan tidak diletakkan di area pengolahan pangan", penalties: { A: 2, B: 2, C: 2 } },
          { id: "AreaDalam.C3.4", no: "4", kriteria: "Alat pengering peralatan seperti lap/kain majun selalu dalam kondisi bersih dan diganti secara rutin untuk menghindari kontaminasi silang", penalties: { A: 2, B: 2, C: 2 } },
          { id: "AreaDalam.C3.5", no: "5", kriteria: "Peralatan pembersih tidak menyebabkan kontaminasi silang (tidak boleh menggunakan sapu ijuk atau kemoceng)", penalties: { A: 2, B: 2, C: 2 } }
        ]
      },
      {
        id: "AreaDalam_C4",
        name: "C4 Penyimpanan Pangan Matang",
        items: [
          { id: "AreaDalam.C4.1", no: "1", kriteria: "Penyimpanan pangan matang tidak dicampur dengan bahan pangan mentah", penalties: { A: 3, B: 3, C: 3 } },
          { id: "AreaDalam.C4.2", no: "2", kriteria: "Wadah penyimpanan pangan matang terpisah untuk setiap jenis pangan", penalties: { A: 2, B: 2, C: 2 } },
          { id: "AreaDalam.C4.3", no: "3", kriteria: "Menyimpan pangan matang untuk bank sample yang disimpan di kulkas dalam jangka waktu 2 x 24 jam.", penalties: { A: 2, B: 2, C: 2 } },
          { id: "AreaDalam.C4.4", no: "4", kriteria: "Chiller/freezer (jika ada):" },
          { id: "AreaDalam.C4.4.a", no: "a.", kriteria: "Khusus menyimpan pangan matang dengan kondisi terkemas", penalties: { A: 3, B: 3, C: 3 }, isSubItem: true },
          { id: "AreaDalam.C4.4.b", no: "b.", kriteria: "Suhu chiller/freezer atau termometer untuk monitoring sudah dikalibrasi", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.C4.4.c", no: "c.", kriteria: "Suhu chiller sesuai (≤ 4 oC)", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.C4.4.d", no: "d.", kriteria: "Terdapat dokumen monitoring chiller (Golongan B dan C)", penalties: { A: 'NA', B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.C4.4.e", no: "e.", kriteria: "Suhu freezer sesuai (≤ -18 oC)", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.C4.4.f", no: "f.", kriteria: "Terdapat dokumen monitoring freezer (Golongan B dan C)", penalties: { A: 'NA', B: 2, C: 2 }, isSubItem: true }
        ]
      },
      {
        id: "AreaDalam_C5",
        name: "C5 Pengemasan Pangan Matang",
        items: [
          { id: "AreaDalam.C5.1", no: "1", kriteria: "Pengemasan dilakukan secara higiene (personil cuci tangan dan menggunakan sarung tangan dengan kondisi baik)", penalties: { A: 3, B: 3, C: 3 } },
          { id: "AreaDalam.C5.2", no: "2", kriteria: "Pangan matang harus dikemas dalam wadah tertutup dan tara pangan (food grade)", penalties: { A: 3, B: 3, C: 3 } },
          { id: "AreaDalam.C5.3", no: "3", kriteria: "Kotak/kemasan untuk pangan yang matang:" },
          { id: "AreaDalam.C5.3.a", no: "a.", kriteria: "Diberikan tanda batas waktu (expired date) tanggal dan waktu makanan boleh dikonsumsi", penalties: { A: 2, B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.C5.3.b", no: "b.", kriteria: "Dicantumkan nomor sertifikat laik higiene sanitasi", penalties: { A: 1, B: 1, C: 1 }, isSubItem: true }
        ]
      },
      {
        id: "AreaDalam_C6",
        name: "C6 Pengangkutan Pangan Matang",
        items: [
          { id: "AreaDalam.C6.1", no: "1", kriteria: "Selama pengangkutan, pangan harus dilindungi dari debu dan jenis kontaminasi lainnya", penalties: { A: 3, B: 3, C: 3 } },
          { id: "AreaDalam.C6.2", no: "2", kriteria: "Pangan matang diangkut pada suhu yang sesuai menggunakan tempat yang dapat menjaga suhu panas dan atau dingin", penalties: { A: 3, B: 3, C: 3 } },
          { id: "AreaDalam.C6.3", no: "3", kriteria: "Khusus jasa boga golongan B dan C: Tersedia kendaraan khusus pengangkut pangan matang, dengan kriteria:" },
          { id: "AreaDalam.C6.3.a", no: "a.", kriteria: "Bersih", penalties: { A: 'NA', B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.C6.3.b", no: "b.", kriteria: "Bebas vektor dan binatang pembawa penyakit", penalties: { A: 'NA', B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.C6.3.c", no: "c.", kriteria: "Terdapat pembersihan secara berkala", penalties: { A: 'NA', B: 2, C: 2 }, isSubItem: true }
        ]
      },
      {
        id: "AreaDalam_D",
        name: "D Dokumentasi dan Rengkaman (diakses di ruang administrasi)",
        items: [
          { id: "AreaDalam.D.1", no: "1", kriteria: "Rekaman Khusus Golongan B dan C (catatan: ruang pengolahan dan adminitrasi pada jasa boga golongan C harus terpisah), dengan kriteria:" },
          { id: "AreaDalam.D.1.a", no: "a.", kriteria: "Tersedia dokumentasi /jadwal pemeliharaan bangunan", penalties: { A: 'NA', B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.D.1.b", no: "b.", kriteria: "Tersedia dokumentasi /jadwal pembersihan dan sanitasi", penalties: { A: 'NA', B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.D.1.c", no: "c.", kriteria: "Tersedia dokumentasi/jadwal pemeliharaan peralatan seperti pengecekan suhu alat pendingin (kalibrasi)", penalties: { A: 'NA', B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.D.1.d", no: "d.", kriteria: "Tersedia dokumentasi/jadwal pemeliharaan sistem penanganan limbah", penalties: { A: 'NA', B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.D.1.e", no: "e.", kriteria: "Tersedia dokumentasi /jadwal pengendalian vektor dan binatang pembawa penyakit", penalties: { A: 'NA', B: 2, C: 2 }, isSubItem: true },
          { id: "AreaDalam.D.1.f", no: "f.", kriteria: "Tersedia dokumentasi penerimaan bahan pangan", penalties: { A: 'NA', B: 1, C: 1 }, isSubItem: true },
          { id: "AreaDalam.D.2", no: "2", kriteria: "Tersedia hasil analisa pengujian air yang sesuai dengan persyaratan air minum dan memiliki hasil yang sesuai persyaratan", penalties: { A: 3, B: 3, C: 3 } },
          { id: "AreaDalam.D.3", no: "3", kriteria: "Tersedia dokumentasi pengawasan internal secara berkala (menggunakan buku rapor/formulir self assessment IKL)", penalties: { A: 2, B: 2, C: 2 } }
        ]
      },
      {
        id: "AreaDalam_D_RekamanPersonel",
        name: "D Rekaman Personel",
        items: [
          { id: "AreaDalam.D_RP.1", no: "1", kriteria: "Pengelola/pemilik memiliki sertifikat pelatihan keamanan pangan siap saji", penalties: { A: 2, B: 2, C: 2 } },
          { id: "AreaDalam.D_RP.2", no: "2", kriteria: "Golongan A: Penjamah pangan sudah memiliki sertifikat pelatihan keamanan pangan siap saji atau sertifikat kompetensi (minimal 20%)", penalties: { A: 3, B: 'NA', C: 'NA' } },
          { id: "AreaDalam.D_RP.3", no: "3", kriteria: "Golongan B: Penjamah pangan sudah memiliki sertifikat pelatihan keamanan pangan siap saji atau sertifikat kompetensi (minimal 50%)", penalties: { A: 'NA', B: 3, C: 'NA' } },
          { id: "AreaDalam.D_RP.4", no: "4", kriteria: "Golongan C:" },
          { id: "AreaDalam.D_RP.4.a", no: "a.", kriteria: "Penjamah pangan dilakukan pemeriksaan kesehatan di awal masuk kerja dibuktikan dengan surat keterangan sehat dari fasyankes", penalties: { A: 'NA', B: 'NA', C: 2 }, isSubItem: true },
          { id: "AreaDalam.D_RP.4.b", no: "b.", kriteria: "Penjamah pangan sudah memiliki sertifikat pelatihan keamanan pangan siap saji atau sertifikat kompetensi (100%)", penalties: { A: 'NA', B: 'NA', C: 3 }, isSubItem: true },
          { id: "AreaDalam.D_RP.4.c", no: "c.", kriteria: "Tersedia jadwal/program pelatihan untuk penjamah pangan", penalties: { A: 'NA', B: 'NA', C: 2 }, isSubItem: true },
          { id: "AreaDalam.D_RP.5", no: "5", kriteria: "Melakukan pemeriksaan kesehatan secara berkala minimal 1 (satu) kali setahun", penalties: { A: 2, B: 2, C: 2 } }
        ]
      },
      {
        id: "AreaDalam_E",
        name: "E Keselamtan, Kesehatan Kerja dan Lainnya",
        items: [
          { id: "AreaDalam.E.1", no: "1", kriteria: "Tersedia alat pemadam api ringan (APAR) gas yang mudah dijangkau untuk situasi darurat disertai dengan petunjuk penggunaan yang jelas", penalties: { A: 1, B: 1, C: 1 } },
          { id: "AreaDalam.E.2", no: "2", kriteria: "Tersedia personil yang bertanggung jawab dan dapat menggunakan APAR", penalties: { A: 1, B: 1, C: 1 } },
          { id: "AreaDalam.E.3", no: "3", kriteria: "APAR tidak kadaluwarsa", penalties: { A: 1, B: 1, C: 1 } },
          { id: "AreaDalam.E.4", no: "4", kriteria: "Tersedia perlengkapan P3K dan obat - obatan yang tidak kadaluwarsa", penalties: { A: 1, B: 1, C: 1 } },
          { id: "AreaDalam.E.5", no: "5", kriteria: "Tersedia petunjuk jalur evakuasi yang jelas pada setiap ruangan ke arah titik kumpul", penalties: { A: 1, B: 1, C: 1 } },
          { id: "AreaDalam.E.6", no: "6", kriteria: "Terdapat pos satpam di pintu masuk TPP dan dilakukan pengecekan terhadap karyawan dan visitor", penalties: { A: 'NA', B: 1, C: 1 } },
          { id: "AreaDalam.E.7", no: "7", kriteria: "Menerapkan kawasan tanpa rokok (KTR)", penalties: { A: 1, B: 1, C: 1 } }
        ]
      }
    ]
  }
];
