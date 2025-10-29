# B2B Mini-Platform Assessment

Bu proje, React ve TypeScript kullanılarak geliştirilmiş, modern bir B2B (Business-to-Business) yönetim panelinin prototipidir. Proje, gerçek bir backend olmadan, tüm veri akışını **Mock Service Worker (MSW)** ile taklit ederek, tamamen işlevsel ve cilalanmış bir frontend deneyimi sunmayı amaçlamaktadır.

[![Canlı Demo](https://img.shields.io/badge/Canlı_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://b2b-mini-platform-assesment-git-dev-arifabds-projects.vercel.app/)

---

##  Temel Özellikler (Key Features)

*   **Güvenli Kimlik Doğrulama:** Form doğrulamalı (Zod) giriş sayfası, `localStorage` ile kalıcı hale getirilen kullanıcı oturumları ve yetkisiz erişimi engelleyen korumalı rotalar.
*   **Dinamik Dashboard:** Toplam ürün ve sipariş sayılarını gösteren özet kartları ve son siparişleri listeleyen dinamik bir tablo.
*   **Ürün Yönetimi (CRUD):**
    *   Ürünleri listeleme, debouncing tekniği ile optimize edilmiş anlık arama ve kategoriye göre filtreleme.
    *   Yeniden kullanılabilir bir form bileşeni (React Portalı ile oluşturulmuş) aracılığıyla yeni ürün ekleme ve mevcut ürünleri düzenleme.
    *   İşlem sonrası kullanıcıyı bilgilendiren "Toast" bildirimleri (örn: "Product successfully created!").
*   **Sipariş Yönetimi (Salt Okunur):** Tüm siparişleri listeleme ve her bir sipariş için dinamik olarak oluşturulan detay sayfalarını görüntüleme.
*   **Gelişmiş Kullanıcı Deneyimi (UX):**
    *   **Light/Dark Tema Desteği:** Kullanıcı tercihini `localStorage`'da saklayan, uygulama genelinde çalışan ve şık bir toggle anahtarı ile kontrol edilen tema değiştirici.
    *   **Tamamen Duyarlı (Responsive) Tasarım:** Mobil cihazlar için optimize edilmiş, hamburger menülü, akıcı ve hem mobil hem de masaüstü için açılıp/kapanabilen (collapsible) bir kenar çubuğu.
    *   **Akıcı Animasyonlar:** Sayfa ve bileşen geçişlerinde kullanıcı deneyimini zenginleştiren, Tailwind CSS ile yapılandırılmış özel `fade-in` animasyonları.
    *   **Durum Yönetimi:** Tüm veri çekme işlemlerinde `Loading` (yükleniyor) ve `Error` (hata) durumları kullanıcıya net bir şekilde gösterilir.

##  Teknoloji Yığını (Tech Stack)

*   **Çatı (Framework/Core):** React 18+, Vite, TypeScript
*   **Yönlendirme (Routing):** React Router v6
*   **Stil (Styling):** TailwindCSS
*   **Form Yönetimi ve Doğrulama:** React Hook Form & Zod
*   **API Mocking:** Mock Service Worker (MSW)
*   **İkonlar:** Lucide React
*   **Deployment:** Vercel

##  Proje Mimarisi ve Felsefesi

Proje, ölçeklenebilir ve bakımı kolay bir mimari üzerine kurulmuştur. Ana felsefe, **özellik bazlı (feature-based)** bir yapı kullanarak ilgili kodları bir arada tutmaktır (`colocation`).

*   `src/features/`: Uygulamanin bel kemigidir. Her bir is ozelligine (auth, products, orders vb.) ait tum mantik (API handler'lari, sayfalar, bilesenler) kendi klasoru icinde yer alir.
*   `src/components/`: Proje genelinde kullanilan, paylasilan ve yeniden kullanilabilir UI bilesenlerini (Layout, Header, Toast vb.) barindirir.
*   `src/lib/contexts/`: `AuthContext` ve `ThemeContext` gibi global state yoneticilerini icerir.
*   `src/mocks/`: Mock Service Worker altyapisinin merkezi yapilandirmasini ve sahte veritabanini (`db.ts`) icerir.

##  Neden Mock Service Worker (MSW) Tercih Edildi?

Bu projede sahte veri sunmak için basit bir `json` dosyası yerine MSW tercih edilmiştir. Bu seçimin temel nedenleri, assessment'ın gerektirdiği backend'siz ama gerçekçi bir uygulama prototipi oluşturma hedefine tam olarak hizmet etmesidir:

1.  **Gerçekçilik:** MSW, uygulama kodunu değiştirmeden, **gerçek ağ isteklerini (network requests)** yakalar. Bu sayede uygulama, sanki gerçek bir backend ile konuşuyormuş gibi çalışır. `fetch('/api/products')` kodu hem geliştirme hem de production ortamında aynı kalır.
2.  **Değişiklik Gerektirmeyen Yapı:** Gerçek bir backend'e geçiş yapılacağı zaman, frontend kodunda API isteklerini içeren kısımlarda **hiçbir değişiklik yapmaya gerek kalmaz.** Sadece MSW devre dışı bırakılır.
3.  **Dinamik Yetenekler:** MSW, sadece statik veri döndürmekle kalmaz. Gelen isteğin parametrelerine (`/api/products?q=ring`), body'sine veya header'larına göre dinamik cevaplar üretebilir, ağ gecikmelerini ve hata durumlarını (404, 500 vb.) kolayca simüle edebilir. Bu, projenin arama, filtreleme ve form gönderme gibi interaktif özelliklerini gerçekçi bir şekilde test etmemizi sağlamıştır.

##  Kurulum ve Çalıştırma (Getting Started)

Projeyi lokal makinenizde çalıştırmak için aşağıdaki adımları izleyin.

### **Gereksinimler**

*   Node.js (v18 veya üstü)
*   npm veya yarn
*   Git

### **Kurulum Adımları**

1.  **Projeyi klonlayın:**
    ```bash
    git clone https://github.com/arifabds/b2b-mini-platform-assesment.git
    ```

2.  **Proje dizinine gidin:**
    ```bash
    cd b2b-mini-platform-assesment/frontend
    ```

3.  **Bağımlılıkları yükleyin:**
    ```bash
    npm install
    ```

4.  **Geliştirme sunucusunu başlatın:**
    ```bash
    npm run dev
    ```

Uygulama artık `http://localhost:5173` (veya terminalde belirtilen başka bir port) adresinde çalışıyor olacaktır.

Mock verilerle giriş için: E-mail: admin@example.com, Şifre: password123

### **Kullanılabilir Script'ler**

*   `npm run dev`: Geliştirme sunucusunu başlatır.
*   `npm run build`: Projeyi production için derler.
*   `npm run lint`: ESLint ile kod analizi yapar.