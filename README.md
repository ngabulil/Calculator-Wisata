# Kalkulator Paket Wisata – React + Chakra UI + Tailwind

Aplikasi web internal untuk membantu tim back office travel dalam menghitung total harga **paket wisata kustom**, termasuk hotel/villa, tour, dan tambahan biaya opsional.

---

## Fitur Utama

- **Pilih Hotel/Villa** lengkap dengan durasi inap dan tipe kamar
- **Tambah Paket Tour** dengan harga modal + markup
- **Biaya Tambahan Fleksibel** (e.g. tiket, transport, dekorasi)
- **Markup Otomatis** per item (Rp atau %)
- **Ringkasan & Breakdown Harga Jual**
- **Ekspor / Kirim ke WhatsApp** *(optional next feature)*

---

## Teknologi

- **React JS** – SPA Framework
- **Chakra UI** – Komponen UI elegan dan fleksibel
- **Tailwind CSS** – Styling utilitas untuk responsif & custom
- **JSON Static Data** – Untuk memuat data hotel, villa, dan paket tour
- **React Context / Hooks** – Untuk state management (markup, total, dsb.)

---

## Struktur Folder

```bash
src/
├── components/              # Semua komponen UI modular
│   ├── Calculator/
│   │   ├── HotelSelector.jsx
│   │   ├── VillaSelector.jsx
│   │   ├── TourSelector.jsx
│   │   ├── AdditionalCostForm.jsx
│   │   ├── MarkupInput.jsx
│   │   ├── PriceSummary.jsx
│   │   ├── PriceBreakdownTable.jsx
│   │   └── SubmitBar.jsx
│   └── ui/                  # Reusable UI elements (button, input dsb.)
│       ├── NumberInputWithSuffix.jsx
│       └── CurrencyInput.jsx
│
├── pages/                   # Halaman utama aplikasi
│   ├── index.jsx            # Halaman kalkulator utama
│   └── about.jsx            # Optional: info perusahaan
│
├── data/                    # Data statis seperti hotel/villa/tour
│   ├── hotels.json
│   ├── villas.json
│   └── tours.json
│
├── hooks/                   # Custom hooks jika ada (contoh: useTotalCalculator)
│   └── useCalculator.js
│
├── utils/                   # Utility functions (formatting, etc.)
│   ├── formatCurrency.js
│   ├── calculateMarkup.js
│   └── validateInput.js
│
├── context/                 # State global jika pakai context
│   └── CalculatorContext.jsx
│
├── styles/                  # Global CSS / Tailwind / Chakra config
│   └── globals.css
│
├── App.jsx
└── main.jsx                 # Entry point

| Komponen              | Fungsi                                                |
| --------------------- | ----------------------------------------------------- |
| `HotelSelector`       | Pilih hotel, jumlah malam, tipe kamar                 |
| `VillaSelector`       | Sama seperti hotel, tapi khusus villa                 |
| `TourSelector`        | Pilih dan tambah paket tour                           |
| `AdditionalCostForm`  | Form dinamis untuk input biaya tambahan custom        |
| `MarkupInput`         | Pilih jenis markup (Rp atau %) dan nilainya           |
| `PriceSummary`        | Tampilkan total modal, markup, dan harga jual         |
| `PriceBreakdownTable` | Breakdown elemen: nama, modal, markup, total          |
| `SubmitBar`           | Tombol untuk copy, export PDF, atau kirim ke WhatsApp |

```
### Cara Menjalankan
1. Clone Repo:
git clone https://github.com/TeguhPermana666/kalkulator-paket-wisata.git
cd kalkulator-paket-wisata

2. Install Dependecies
npm install

3. Jalankan Server React
npm run dev

### Config
Tambahkan file JSON data ke dalam folder /src/data/:
- hotels.json
- villas.json
- tours.json

