/* ================================================================
   BIBLIOTHECA — LIBRARY WEBSITE JAVASCRIPT
   ================================================================ */

// ============================================================
// DATA STORE
// ============================================================
let currentUser = null;
let users = JSON.parse(localStorage.getItem('bib_users') || '[]');
let borrowedBooks = JSON.parse(localStorage.getItem('bib_borrowed') || '[]');
let wishlist = JSON.parse(localStorage.getItem('bib_wishlist') || '[]');
let readingHistory = JSON.parse(localStorage.getItem('bib_history') || '[]');
let userReviews = JSON.parse(localStorage.getItem('bib_reviews') || '[]');
let readingProgress = JSON.parse(localStorage.getItem('bib_progress') || '{}');

let currentPage = 1;
const booksPerPage = 12;
let filteredBooks = [];
let currentView = 'grid';

const GENRES = [
  { name: 'Fiction', icon: '📖', count: '8,400+' },
  { name: 'Mystery', icon: '🔍', count: '5,200+' },
  { name: 'Sci-Fi', icon: '🚀', count: '4,800+' },
  { name: 'Fantasy', icon: '🧙', count: '6,100+' },
  { name: 'Biography', icon: '👤', count: '3,900+' },
  { name: 'History', icon: '🏛️', count: '7,200+' },
  { name: 'Self-Help', icon: '💡', count: '4,300+' },
  { name: 'Romance', icon: '❤️', count: '5,700+' },
  { name: 'Horror', icon: '👻', count: '2,900+' },
  { name: 'Non-Fiction', icon: '📰', count: '9,100+' },
];

const BOOKS = [
  { id: 1,  title: 'The Shadow of the Wind', author: 'Carlos Ruiz Zafón', genre: 'Mystery',   rating: 4.8, year: 2001, pages: 487, isbn: '978-0143034902', available: true,  color: '#2c3e50', desc: 'A young boy discovers a mysterious book and must find its author before a mysterious figure destroys every copy.', reviews: 1240, popular: true  },
  { id: 2,  title: 'Dune',                    author: 'Frank Herbert',       genre: 'Sci-Fi',   rating: 4.9, year: 1965, pages: 688, isbn: '978-0441013593', available: false, color: '#8b5e3c', desc: 'Set in a distant future amid a feudal interstellar society, Dune tells the story of young Paul Atreides.', reviews: 2870, popular: true  },
  { id: 3,  title: 'The Name of the Wind',    author: 'Patrick Rothfuss',    genre: 'Fantasy',  rating: 4.7, year: 2007, pages: 662, isbn: '978-0756404741', available: true,  color: '#1a5276', desc: 'The story of Kvothe, a legendary magician and musician, narrated in his own words.', reviews: 1890, popular: true  },
  { id: 4,  title: 'Sapiens',                  author: 'Yuval Noah Harari',   genre: 'History',  rating: 4.6, year: 2011, pages: 443, isbn: '978-0062316110', available: true,  color: '#145a32', desc: 'A brief history of humankind, exploring how biology and history defined us.', reviews: 3100, popular: true  },
  { id: 5,  title: 'The Midnight Library',     author: 'Matt Haig',           genre: 'Fiction',  rating: 4.4, year: 2020, pages: 304, isbn: '978-0525559474', available: true,  color: '#1a237e', desc: 'Somewhere between life and death is a library that allows you to undo any choice you\'ve made.', reviews: 2210, popular: true  },
  { id: 6,  title: 'Gone Girl',                author: 'Gillian Flynn',        genre: 'Mystery',  rating: 4.3, year: 2012, pages: 422, isbn: '978-0307588364', available: false, color: '#7b241c', desc: 'On the morning of their fifth wedding anniversary, Amy Dunne disappears.', reviews: 1560, popular: false },
  { id: 7,  title: 'Foundation',               author: 'Isaac Asimov',         genre: 'Sci-Fi',   rating: 4.7, year: 1951, pages: 244, isbn: '978-0553382579', available: true,  color: '#4a235a', desc: 'The fall of the Galactic Empire and the rise of the Foundation to preserve civilization.', reviews: 1780, popular: true  },
  { id: 8,  title: 'Atomic Habits',            author: 'James Clear',          genre: 'Self-Help',rating: 4.8, year: 2018, pages: 319, isbn: '978-0735211292', available: true,  color: '#784212', desc: 'An easy and proven way to build good habits and break bad ones.', reviews: 4200, popular: true  },
  { id: 9,  title: 'The Alchemist',            author: 'Paulo Coelho',         genre: 'Fiction',  rating: 4.5, year: 1988, pages: 197, isbn: '978-0062315007', available: true,  color: '#1b4f72', desc: 'A young shepherd travels from Spain to Egypt in search of a worldly treasure.', reviews: 5100, popular: true  },
  { id: 10, title: 'Dracula',                  author: 'Bram Stoker',          genre: 'Horror',   rating: 4.6, year: 1897, pages: 418, isbn: '978-0486411095', available: true,  color: '#1c2833', desc: 'Count Dracula\'s attempt to move from Transylvania to England so he may find new blood.', reviews: 890,  popular: false },
  { id: 11, title: 'Pride and Prejudice',      author: 'Jane Austen',          genre: 'Romance',  rating: 4.7, year: 1813, pages: 432, isbn: '978-0141439518', available: true,  color: '#6b2737', desc: 'The story of Elizabeth Bennet and Mr. Darcy—love, wit, and the prejudices of society.', reviews: 3700, popular: true  },
  { id: 12, title: 'Steve Jobs',               author: 'Walter Isaacson',      genre: 'Biography',rating: 4.4, year: 2011, pages: 630, isbn: '978-1451648539', available: false, color: '#2c3e50', desc: 'The authorised biography of Apple co-founder Steve Jobs, told through interviews.', reviews: 2100, popular: false },
  { id: 13, title: '1984',                     author: 'George Orwell',        genre: 'Fiction',  rating: 4.8, year: 1949, pages: 328, isbn: '978-0451524935', available: true,  color: '#212f3d', desc: 'A dystopian novel set in a totalitarian world where Big Brother watches your every move.', reviews: 4500, popular: true  },
  { id: 14, title: 'The Hitchhiker\'s Guide',  author: 'Douglas Adams',        genre: 'Sci-Fi',   rating: 4.8, year: 1979, pages: 193, isbn: '978-0345391803', available: true,  color: '#154360', desc: 'Moments before Earth is demolished for a bypass, Arthur Dent is swept into outer space.', reviews: 3200, popular: true  },
  { id: 15, title: 'The Silent Patient',       author: 'Alex Michaelides',     genre: 'Mystery',  rating: 4.5, year: 2019, pages: 336, isbn: '978-1250301697', available: true,  color: '#4a4a4a', desc: 'A woman shoots her husband and then never speaks another word.', reviews: 1890, popular: true, isNew: true },
  { id: 16, title: 'Educated',                 author: 'Tara Westover',        genre: 'Biography',rating: 4.7, year: 2018, pages: 334, isbn: '978-0399590504', available: true,  color: '#2e4057', desc: 'A memoir about growing up in rural Idaho and seeking education against all odds.', reviews: 2700, popular: true  },
  { id: 17, title: 'The Way of Kings',         author: 'Brandon Sanderson',    genre: 'Fantasy',  rating: 4.9, year: 2010, pages: 1007,isbn: '978-0765326355', available: false, color: '#1a3a5c', desc: 'Epic tale of knights, assassins and gods across an alien world battered by storms.', reviews: 2400, popular: true, isNew: true  },
  { id: 18, title: 'Think and Grow Rich',      author: 'Napoleon Hill',        genre: 'Self-Help',rating: 4.4, year: 1937, pages: 238, isbn: '978-1585424337', available: true,  color: '#7d6608', desc: 'The classic personal development book that has transformed millions of lives.', reviews: 1600, popular: false },
  { id: 19, title: 'It',                       author: 'Stephen King',         genre: 'Horror',   rating: 4.7, year: 1986, pages: 1138,isbn: '978-1501142970', available: true,  color: '#1c0a0a', desc: 'Seven children in Derry, Maine form a club to fight against an entity that shapeshifts.', reviews: 2900, popular: true, isNew: true  },
  { id: 20, title: 'Outlander',                author: 'Diana Gabaldon',       genre: 'Romance',  rating: 4.5, year: 1991, pages: 850, isbn: '978-0440212560', available: true,  color: '#5d2e46', desc: 'A WWII nurse is hurled back in time to 18th-century Scotland.', reviews: 1800, popular: false },
  { id: 21, title: 'Guns, Germs, and Steel',   author: 'Jared Diamond',        genre: 'History',  rating: 4.5, year: 1997, pages: 480, isbn: '978-0393317558', available: true,  color: '#1a3a1a', desc: 'A fascinating account of why some societies dominate while others fade.', reviews: 1400, popular: false, isNew: true },
  { id: 22, title: 'The Great Gatsby',         author: 'F. Scott Fitzgerald',  genre: 'Fiction',  rating: 4.3, year: 1925, pages: 180, isbn: '978-0743273565', available: true,  color: '#1c3b4b', desc: 'A timeless tale of obsession, wealth, and the American Dream in the Roaring Twenties.', reviews: 3400, popular: true  },
  { id: 23, title: 'Becoming',                 author: 'Michelle Obama',       genre: 'Biography',rating: 4.8, year: 2018, pages: 448, isbn: '978-1524763138', available: false, color: '#7b2d8b', desc: 'An intimate and inspiring memoir of Michelle Obama\'s remarkable life story.', reviews: 3600, popular: true, isNew: true  },
  { id: 24, title: 'A Game of Thrones',        author: 'George R.R. Martin',   genre: 'Fantasy',  rating: 4.7, year: 1996, pages: 835, isbn: '978-0553593716', available: true,  color: '#2c1810', desc: 'Seven noble families fight for control of the mythical land of Westeros.', reviews: 4100, popular: true  },
];

const ANNOUNCEMENTS = [
  { type: 'event', title: 'Author Meet & Greet', text: 'Join us this Saturday as bestselling author Chetan Bhagat visits for a live Q&A session and book signing event.', date: 'May 10, 2026' },
  { type: 'new', title: 'New Arrivals: May 2026', text: '120 new titles added across Fiction, Sci-Fi, and Self-Help. Visit the New Arrivals section to explore.', date: 'May 1, 2026' },
  { type: 'notice', title: 'Extended Sunday Hours', text: 'Starting this weekend, Sunday library hours are extended to 8PM. Come in and enjoy the reading lounges!', date: 'April 28, 2026' },
  { type: 'event', title: 'Children\'s Book Fair', text: 'Our annual children\'s reading fair returns on May 15–17. Activities, storytelling, and free books for kids under 12.', date: 'May 5, 2026' },
  { type: 'notice', title: 'Membership Drive Open', text: 'Refer a friend and both of you get 2 extra borrowing slots for 3 months. Offer valid until May 31.', date: 'April 30, 2026' },
  { type: 'new', title: 'Digital E-Books Now Live', text: 'Access 5,000+ titles directly from your browser. No download needed — start reading instantly.', date: 'May 2, 2026' },
];

const TESTIMONIALS = [
  { name: 'Priya Nair', text: 'Bibliotheca has completely transformed how I read. The collection is breathtaking and the interface makes finding books a genuine joy.', books: '47 books read', color: '#c9a84c' },
  { name: 'Arjun Mehta', text: 'I borrowed my first Asimov here and now I\'ve read every single one. The staff recommendations are always spot-on.', books: '83 books read', color: '#5d6d7e' },
  { name: 'Zara Sheikh', text: 'The events are the best part! I\'ve made friends at book club nights and discovered authors I never would have found on my own.', books: '31 books read', color: '#8e44ad' },
  { name: 'Karthik Suresh', text: 'As a researcher, the non-fiction and history section is unparalleled. Bibliotheca is my second home. Period.', books: '120 books read', color: '#27ae60' },
];

const EVENTS = [
  { title: 'Mystery Book Club', date: 'May 8, 2026', time: '6:00 PM', location: 'Reading Hall B', tag: 'Book Club', emoji: '🔍', desc: 'This month: "The Silent Patient" by Alex Michaelides. New members welcome!' },
  { title: 'Author Talk: Chetan Bhagat', date: 'May 10, 2026', time: '4:00 PM', location: 'Main Auditorium', tag: 'Author Event', emoji: '🎤', desc: 'Live session with the bestselling Indian author. Register in advance.' },
  { title: 'Children\'s Story Hour', date: 'May 11, 2026', time: '10:00 AM', location: 'Children\'s Wing', tag: 'Kids', emoji: '📚', desc: 'Interactive storytelling for ages 5–10. Bring your little readers!' },
  { title: 'Creative Writing Workshop', date: 'May 15, 2026', time: '2:00 PM', location: 'Workshop Room 1', tag: 'Workshop', emoji: '✍️', desc: 'A beginner-friendly session on short story writing. Limited seats.' },
  { title: 'Book Swap Saturday', date: 'May 17, 2026', time: '11:00 AM', location: 'Garden Terrace', tag: 'Community', emoji: '🔄', desc: 'Bring 3 books you\'ve read, leave with 3 new ones. All genres welcome.' },
  { title: 'Science Fiction Night', date: 'May 22, 2026', time: '7:00 PM', location: 'Reading Hall A', tag: 'Book Club', emoji: '🚀', desc: 'Exploring the classics — Asimov, Herbert, and Dick. Panel discussion format.' },
];

const TEAM = [
  { name: 'Dr. Meera Iyer', role: 'Chief Librarian', color: '#c9a84c' },
  { name: 'Rajan Pillai', role: 'Collections Manager', color: '#2ecc71' },
  { name: 'Ananya Srinivas', role: 'Digital Services', color: '#9b59b6' },
  { name: 'Vivek Kumar', role: 'Community Manager', color: '#3498db' },
  { name: 'Fatima Bano', role: 'Children\'s Librarian', color: '#e67e22' },
  { name: 'Samuel Osei', role: 'IT & Systems', color: '#1abc9c' },
];

// ============================================================
// CANVAS BACKGROUND — BOOKSHELVES
// ============================================================
(function initCanvas() {
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  let books = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    drawShelves();
  }

  const BOOK_COLORS = [
    '#3d1c02','#1a2744','#1c3a1a','#4a1942','#1a3a3a',
    '#3a2a0a','#1a1a3a','#3a1a2a','#0a2a1a','#2a1a0a',
    '#1c1c3c','#3c1c1c','#1c3c1c','#3c2c1c','#2c1c3c',
  ];

  function drawShelves() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Deep background gradient
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#0a0805');
    bg.addColorStop(0.5, '#0d0b08');
    bg.addColorStop(1, '#050403');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    const shelfH = 120;
    const numShelves = Math.ceil(H / shelfH) + 1;

    for (let s = 0; s < numShelves; s++) {
      const y = s * shelfH;

      // Shelf plank
      const plankY = y + shelfH - 14;
      ctx.fillStyle = '#1a1008';
      ctx.fillRect(0, plankY, W, 14);
      ctx.fillStyle = '#2a1a0a';
      ctx.fillRect(0, plankY, W, 3);
      ctx.fillStyle = '#0a0603';
      ctx.fillRect(0, plankY + 11, W, 3);

      // Ambient shelf glow
      const grd = ctx.createLinearGradient(0, y, 0, plankY);
      grd.addColorStop(0, 'rgba(201,168,76,0)');
      grd.addColorStop(1, 'rgba(201,168,76,0.03)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, y, W, shelfH);

      // Draw books on shelf
      let x = -15 + (s * 37 % 60);
      while (x < W + 30) {
        const bw = 16 + Math.floor(seeded(x * 7 + s * 31) * 22);
        const bh = 70 + Math.floor(seeded(x * 13 + s * 17) * 40);
        const col = BOOK_COLORS[Math.floor(seeded(x * 3 + s * 11) * BOOK_COLORS.length)];

        ctx.fillStyle = col;
        ctx.fillRect(x, plankY - bh, bw - 2, bh);

        // Spine highlight
        ctx.fillStyle = 'rgba(255,255,255,0.04)';
        ctx.fillRect(x, plankY - bh, 3, bh);

        // Spine shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(x + bw - 4, plankY - bh, 3, bh);

        // Occasional title line
        if (seeded(x * 19 + s * 7) > 0.5) {
          ctx.fillStyle = 'rgba(255,255,255,0.06)';
          const ly = plankY - bh + Math.floor(bh * 0.3);
          ctx.fillRect(x + 3, ly, bw - 8, 1);
          ctx.fillRect(x + 3, ly + 4, bw - 12, 1);
        }

        x += bw + 1;
      }
    }

    // Vignette overlay
    const vig = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W,H)*0.7);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);
  }

  function seeded(n) {
    const x = Math.sin(n) * 10000;
    return x - Math.floor(x);
  }

  window.addEventListener('resize', resize);
  resize();
})();

// ============================================================
// AUTH LOGIC
// ============================================================
function switchAuth(type) {
  document.getElementById('loginForm').classList.toggle('active', type === 'login');
  document.getElementById('signupForm').classList.toggle('active', type === 'signup');
  clearErrors();
}

function clearErrors() {
  document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
}

function togglePw(id, btn) {
  const input = document.getElementById(id);
  const isText = input.type === 'text';
  input.type = isText ? 'password' : 'text';
  btn.querySelector('i').className = isText ? 'fas fa-eye' : 'fas fa-eye-slash';
}

// Password strength
document.getElementById('signupPassword').addEventListener('input', function() {
  const val = this.value;
  const bar = document.getElementById('pwStrength');
  bar.className = 'pw-strength';
  if (!val) return;
  const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(val);
  const medium = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/.test(val);
  if (strong) bar.classList.add('strong');
  else if (medium) bar.classList.add('medium');
  else bar.classList.add('weak');
});

function handleLogin() {
  clearErrors();
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPassword').value;
  let ok = true;

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    document.getElementById('loginEmailErr').textContent = 'Please enter a valid email address.';
    ok = false;
  }
  if (!pass || pass.length < 4) {
    document.getElementById('loginPassErr').textContent = 'Please enter your password.';
    ok = false;
  }
  if (!ok) return;

  const user = users.find(u => u.email === email && u.password === pass);
  if (!user) {
    document.getElementById('loginPassErr').textContent = 'Incorrect email or password.';
    return;
  }

  currentUser = user;
  showSuccess(false, user.firstName);
}

function handleSignup() {
  clearErrors();
  const first   = document.getElementById('signupFirst').value.trim();
  const last    = document.getElementById('signupLast').value.trim();
  const email   = document.getElementById('signupEmail').value.trim();
  const pass    = document.getElementById('signupPassword').value;
  const confirm = document.getElementById('signupConfirm').value;
  const genre   = document.getElementById('signupGenre').value;
  const dob     = document.getElementById('signupDob').value;
  const agreed  = document.getElementById('agreeTerms').checked;
  let ok = true;

  if (!first) { document.getElementById('firstErr').textContent = 'First name required.'; ok = false; }
  if (!last)  { document.getElementById('lastErr').textContent = 'Last name required.'; ok = false; }
  if (!email || !/\S+@\S+\.\S+/.test(email)) { document.getElementById('signupEmailErr').textContent = 'Valid email required.'; ok = false; }
  if (pass.length < 6) { document.getElementById('signupPassErr').textContent = 'Password must be at least 6 characters.'; ok = false; }
  if (pass !== confirm) { document.getElementById('confirmErr').textContent = 'Passwords do not match.'; ok = false; }
  if (!agreed) { showToast('Please agree to the Terms & Conditions.', 'error'); ok = false; }
  if (!ok) return;

  if (users.find(u => u.email === email)) {
    document.getElementById('signupEmailErr').textContent = 'Email already registered.';
    return;
  }

  const newUser = { firstName: first, lastName: last, email, password: pass, genre, dob, phone: document.getElementById('signupPhone').value, joinDate: new Date().toLocaleDateString('en-IN', { year:'numeric', month:'long', day:'numeric' }) };
  users.push(newUser);
  localStorage.setItem('bib_users', JSON.stringify(users));
  currentUser = newUser;
  showSuccess(true, first);
}

// ============================================================
// SUCCESS SCREEN
// ============================================================
function showSuccess(isNew, name) {
  const title = document.getElementById('successTitle');
  const msg   = document.getElementById('successMsg');

  if (isNew) {
    title.textContent = `Welcome to Bibliotheca, ${name}! 🎉`;
    msg.textContent   = 'Your account has been created. Your reading adventure begins now.';
  } else {
    title.textContent = `Successfully Logged In!`;
    msg.textContent   = `Welcome back, ${name}. Your library awaits.`;
  }

  document.getElementById('authSection').classList.remove('active');
  document.getElementById('successSection').classList.add('active');

  // Progress bar
  setTimeout(() => {
    document.getElementById('progressBar').style.width = '100%';
  }, 100);

  // Sparkles
  createSparkles();

  // Redirect after 2.8s
  setTimeout(() => {
    document.getElementById('successSection').classList.remove('active');
    enterMainApp();
  }, 2800);
}

function createSparkles() {
  const container = document.getElementById('sparkles');
  container.innerHTML = '';
  for (let i = 0; i < 24; i++) {
    const s = document.createElement('div');
    s.style.cssText = `
      position:absolute; width:8px; height:8px;
      border-radius:50%;
      background: ${['#c9a84c','#e8c97a','#fff','#f0c040'][i%4]};
      left: ${40+Math.random()*20}%;
      top: ${30+Math.random()*20}%;
      --tx: ${(Math.random()-0.5)*120}px;
      --ty: ${(Math.random()-0.5)*120}px;
      animation: sparkle ${0.6+Math.random()*0.8}s ease-out ${Math.random()*0.4}s both;
    `;
    container.appendChild(s);
  }
}

// ============================================================
// MAIN APP INIT
// ============================================================
function enterMainApp() {
  document.getElementById('mainSection').classList.add('active');

  // Update user display
  const name = currentUser.firstName;
  document.getElementById('heroUsername').textContent = name;
  document.getElementById('navUsername').textContent = name;
  document.getElementById('userAvatar').textContent = name.charAt(0).toUpperCase();

  // Render all sections
  renderFeaturedBooks();
  renderGenreGrid();
  renderNewArrivals();
  renderAnnouncements();
  renderTestimonials();
  updateStatusBanner();
  renderBrowsePage();
  renderMyBooks('borrowed');
  renderReadingPage();
  renderReviewsPage();
  renderEventsPage();
  renderAboutPage();
  renderProfilePage();

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
  });

  showPage('home');
}

// ============================================================
// NAVIGATION
// ============================================================
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + pageId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === pageId);
  });
  // Close mobile menu
  document.getElementById('navLinks').classList.remove('mobile-open');
}

function toggleMobileMenu() {
  document.getElementById('navLinks').classList.toggle('mobile-open');
}

function toggleUserMenu() {
  document.getElementById('userDropdown').classList.toggle('open');
}
document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-user')) {
    document.getElementById('userDropdown').classList.remove('open');
  }
});

function logout() {
  currentUser = null;
  document.getElementById('mainSection').classList.remove('active');
  document.getElementById('authSection').classList.add('active');
  switchAuth('login');
  showToast('You have been logged out.', 'success');
}

// ============================================================
// RENDER: FEATURED BOOKS
// ============================================================
function renderFeaturedBooks() {
  const featured = BOOKS.filter(b => b.popular).slice(0, 8);
  document.getElementById('featuredBooks').innerHTML = featured.map(b => bookCardHTML(b)).join('');
}

function renderNewArrivals() {
  const newOnes = BOOKS.filter(b => b.isNew).concat(BOOKS.slice(-6)).slice(0, 8);
  document.getElementById('newArrivals').innerHTML = newOnes.map(b => bookCardHTML(b, true)).join('');
}

function bookCardHTML(book, showNew = false) {
  const stars = starHTML(book.rating);
  const available = !borrowedBooks.includes(book.id) && book.available;
  const inWishlist = wishlist.includes(book.id);
  const badge = !available ? '<span class="book-badge borrowed">Borrowed</span>' : (showNew && book.isNew ? '<span class="book-badge new">New</span>' : '');

  return `
    <div class="book-card" onclick="openBookModal(${book.id})">
      <div class="book-cover">
        <div class="book-cover-img" style="background: linear-gradient(145deg, ${book.color}, ${book.color}cc)">
          <div class="book-cover-label">
            <div class="book-cover-title">${book.title}</div>
            <div class="book-cover-author">${book.author}</div>
          </div>
        </div>
        ${badge}
      </div>
      <div class="book-info">
        <div class="book-title">${book.title}</div>
        <div class="book-author">${book.author}</div>
        <div class="book-rating">${stars}<span class="rating-num">${book.rating} (${book.reviews.toLocaleString()})</span></div>
        <span class="book-genre-tag">${book.genre}</span>
        <div class="book-actions" onclick="event.stopPropagation()">
          <button class="btn-borrow" ${!available ? 'disabled' : ''} onclick="borrowBook(${book.id})">${available ? 'Borrow' : 'Unavailable'}</button>
          <button class="btn-icon ${inWishlist ? 'liked' : ''}" onclick="toggleWishlist(${book.id}, this)"><i class="fas fa-heart"></i></button>
        </div>
      </div>
    </div>`;
}

function starHTML(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return `<span class="stars">${'★'.repeat(full)}${'½'.repeat(half)}${'☆'.repeat(empty)}</span>`;
}

// ============================================================
// RENDER: GENRE GRID
// ============================================================
function renderGenreGrid() {
  document.getElementById('genreGrid').innerHTML = GENRES.map(g => `
    <div class="genre-card" onclick="quickSearch('${g.name}')">
      <div class="genre-icon">${g.icon}</div>
      <div class="genre-name">${g.name}</div>
      <div class="genre-count">${g.count} books</div>
    </div>`).join('');
}

// ============================================================
// RENDER: ANNOUNCEMENTS
// ============================================================
function renderAnnouncements() {
  document.getElementById('announcementsGrid').innerHTML = ANNOUNCEMENTS.map(a => `
    <div class="announcement-card">
      <span class="ann-badge ${a.type}">${a.type}</span>
      <div class="ann-title">${a.title}</div>
      <div class="ann-text">${a.text}</div>
      <div class="ann-date"><i class="fas fa-calendar" style="color:var(--gold-dim);margin-right:6px"></i>${a.date}</div>
    </div>`).join('');
}

// ============================================================
// RENDER: TESTIMONIALS
// ============================================================
function renderTestimonials() {
  document.getElementById('testimonialsRow').innerHTML = TESTIMONIALS.map(t => `
    <div class="testimonial-card">
      <div class="test-quote">"</div>
      <div class="test-text">${t.text}</div>
      <div class="test-user">
        <div class="test-avatar" style="background:${t.color}">${t.name.charAt(0)}</div>
        <div>
          <div class="test-name">${t.name}</div>
          <div class="test-books"><i class="fas fa-book" style="color:var(--gold-dim);margin-right:4px"></i>${t.books}</div>
        </div>
      </div>
    </div>`).join('');
}

// ============================================================
// RENDER: STATUS BANNER
// ============================================================
function updateStatusBanner() {
  document.getElementById('booksReadCount').textContent = readingHistory.length || 8;
  document.getElementById('booksDueCount').textContent = borrowedBooks.length || 2;
  document.getElementById('wishlistCount').textContent = wishlist.length || 5;
  document.getElementById('reviewsCount').textContent = userReviews.length || 3;
}

// ============================================================
// RENDER: BROWSE PAGE
// ============================================================
function renderBrowsePage() {
  filteredBooks = [...BOOKS];
  renderBookGrid();
}

function applyFilters() {
  const genre  = document.getElementById('filterGenre').value;
  const avail  = document.querySelector('input[name="avail"]:checked')?.value;
  const rating = document.getElementById('filterRating').value;
  const sort   = document.getElementById('sortBy').value;
  const search = document.getElementById('browseSearch').value.toLowerCase();

  filteredBooks = BOOKS.filter(b => {
    if (genre && b.genre !== genre) return false;
    if (avail === 'available' && !b.available) return false;
    if (avail === 'borrowed'  &&  b.available) return false;
    if (rating && b.rating < parseFloat(rating)) return false;
    if (search && !b.title.toLowerCase().includes(search) && !b.author.toLowerCase().includes(search) && !b.genre.toLowerCase().includes(search)) return false;
    return true;
  });

  if (sort === 'rating')   filteredBooks.sort((a,b) => b.rating - a.rating);
  if (sort === 'newest')   filteredBooks.sort((a,b) => b.year - a.year);
  if (sort === 'popular')  filteredBooks.sort((a,b) => b.reviews - a.reviews);
  if (sort === 'title')    filteredBooks.sort((a,b) => a.title.localeCompare(b.title));

  currentPage = 1;
  renderBookGrid();
}

function clearFilters() {
  document.getElementById('filterGenre').value = '';
  document.getElementById('filterRating').value = '';
  document.getElementById('sortBy').value = 'title';
  document.getElementById('browseSearch').value = '';
  document.querySelectorAll('input[name="avail"]')[0].checked = true;
  applyFilters();
}

function setView(v) {
  currentView = v;
  document.getElementById('gridViewBtn').classList.toggle('active', v === 'grid');
  document.getElementById('listViewBtn').classList.toggle('active', v === 'list');
  renderBookGrid();
}

function renderBookGrid() {
  const grid = document.getElementById('browseGrid');
  const start = (currentPage - 1) * booksPerPage;
  const pageBooks = filteredBooks.slice(start, start + booksPerPage);

  document.getElementById('resultCount').textContent = `${filteredBooks.length} books found`;

  if (currentView === 'list') {
    grid.className = 'books-grid list-view';
    grid.innerHTML = pageBooks.map(b => listCardHTML(b)).join('');
  } else {
    grid.className = 'books-grid';
    grid.innerHTML = pageBooks.map(b => bookCardHTML(b)).join('');
  }

  renderPagination();
}

function listCardHTML(book) {
  const available = !borrowedBooks.includes(book.id) && book.available;
  return `
    <div class="book-card list-card" onclick="openBookModal(${book.id})">
      <div class="book-cover" style="width:70px;height:100px;border-radius:6px;overflow:hidden;flex-shrink:0">
        <div style="width:100%;height:100%;background:linear-gradient(145deg,${book.color},${book.color}cc);display:flex;align-items:center;justify-content:center;padding:6px;text-align:center">
          <span style="font-family:'Playfair Display',serif;font-size:0.65rem;color:rgba(255,255,255,0.85);line-height:1.2">${book.title}</span>
        </div>
      </div>
      <div class="book-info">
        <div class="book-title" style="-webkit-line-clamp:1">${book.title}</div>
        <div class="book-author">${book.author} · ${book.year}</div>
        <div class="book-rating">${starHTML(book.rating)}<span class="rating-num">${book.rating}</span></div>
        <div style="color:var(--text-muted);font-size:0.8rem;margin-top:4px">${book.desc.slice(0,100)}...</div>
      </div>
      <div class="mybook-actions" onclick="event.stopPropagation()">
        <button class="btn-borrow" ${!available?'disabled':''} onclick="borrowBook(${book.id})" style="width:110px">${available?'Borrow':'Borrowed'}</button>
        <button class="btn-secondary small" onclick="openBookModal(${book.id})">Details</button>
      </div>
    </div>`;
}

function renderPagination() {
  const total = Math.ceil(filteredBooks.length / booksPerPage);
  const pag = document.getElementById('pagination');
  if (total <= 1) { pag.innerHTML = ''; return; }
  let html = '';
  if (currentPage > 1) html += `<button class="page-btn" onclick="goPage(${currentPage-1})">‹ Prev</button>`;
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(i - currentPage) <= 1) {
      html += `<button class="page-btn ${i===currentPage?'active':''}" onclick="goPage(${i})">${i}</button>`;
    } else if (Math.abs(i - currentPage) === 2) {
      html += `<button class="page-btn" disabled>…</button>`;
    }
  }
  if (currentPage < total) html += `<button class="page-btn" onclick="goPage(${currentPage+1})">Next ›</button>`;
  pag.innerHTML = html;
}

function goPage(p) {
  currentPage = p;
  renderBookGrid();
  document.getElementById('page-browse').scrollIntoView({ behavior: 'smooth' });
}

// ============================================================
// RENDER: MY BOOKS
// ============================================================
function switchTab(tab, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderMyBooks(tab);
}

function renderMyBooks(tab) {
  const el = document.getElementById('mybooksContent');
  if (tab === 'borrowed') {
    const sample = [BOOKS[4], BOOKS[7]];
    el.innerHTML = sample.map(b => `
      <div class="mybook-row">
        <div class="mybook-cover">
          <div style="width:100%;height:100%;background:linear-gradient(145deg,${b.color},${b.color}aa);display:flex;align-items:center;justify-content:center;border-radius:4px">
            <span style="font-size:0.5rem;color:rgba(255,255,255,0.7);text-align:center;padding:4px">${b.title}</span>
          </div>
        </div>
        <div class="mybook-info">
          <div class="mybook-title">${b.title}</div>
          <div class="mybook-author">${b.author}</div>
          <div class="mybook-meta">
            <span><i class="fas fa-calendar-alt"></i> Due: ${getDueDate()}</span>
            <span><i class="fas fa-book"></i> ${b.pages} pages</span>
            <span><i class="fas fa-tag"></i> ${b.genre}</span>
          </div>
          <div class="progress-row">
            <div class="progress-label">Reading Progress: ${readingProgress[b.id] || 30}%</div>
            <div class="progress-track"><div class="progress-fill" style="width:${readingProgress[b.id]||30}%"></div></div>
          </div>
        </div>
        <div class="mybook-actions">
          <button class="btn-borrow" onclick="returnBook(${b.id})">Return Book</button>
          <button class="btn-secondary small" onclick="updateProgress(${b.id})">Update Progress</button>
        </div>
      </div>`).join('');
  } else if (tab === 'reserved') {
    el.innerHTML = `
      <div class="mybook-row">
        <div class="mybook-cover">
          <div style="width:100%;height:100%;background:linear-gradient(145deg,${BOOKS[1].color},${BOOKS[1].color}aa);display:flex;align-items:center;justify-content:center;border-radius:4px"></div>
        </div>
        <div class="mybook-info">
          <div class="mybook-title">${BOOKS[1].title}</div>
          <div class="mybook-author">${BOOKS[1].author}</div>
          <div class="mybook-meta">
            <span><i class="fas fa-clock"></i> Reserved on: May 1, 2026</span>
            <span><i class="fas fa-users"></i> Queue position: 2</span>
          </div>
        </div>
        <div class="mybook-actions">
          <button class="btn-secondary small" onclick="showToast('Reservation cancelled','success')">Cancel Reservation</button>
        </div>
      </div>`;
  } else if (tab === 'history') {
    const hist = BOOKS.slice(0, 8);
    el.innerHTML = hist.map(b => `
      <div class="mybook-row">
        <div class="mybook-cover">
          <div style="width:100%;height:100%;background:linear-gradient(145deg,${b.color},${b.color}aa);border-radius:4px"></div>
        </div>
        <div class="mybook-info">
          <div class="mybook-title">${b.title}</div>
          <div class="mybook-author">${b.author}</div>
          <div class="mybook-meta">
            <span><i class="fas fa-check-circle" style="color:var(--green-accent)"></i> Returned</span>
            <span><i class="fas fa-star" style="color:var(--gold)"></i> Rated: ${(3 + Math.random()*2).toFixed(1)}/5</span>
          </div>
        </div>
        <div class="mybook-actions">
          <button class="btn-secondary small" onclick="borrowBook(${b.id})">Borrow Again</button>
        </div>
      </div>`).join('');
  } else if (tab === 'wishlist') {
    const wishBooks = BOOKS.filter(b => wishlist.includes(b.id)).concat(BOOKS.slice(10, 15)).slice(0, 5);
    if (!wishBooks.length) { el.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px">Your wishlist is empty. Click the ❤ on any book to save it!</p>'; return; }
    el.innerHTML = wishBooks.map(b => `
      <div class="mybook-row">
        <div class="mybook-cover">
          <div style="width:100%;height:100%;background:linear-gradient(145deg,${b.color},${b.color}aa);border-radius:4px"></div>
        </div>
        <div class="mybook-info">
          <div class="mybook-title">${b.title}</div>
          <div class="mybook-author">${b.author}</div>
          <div class="mybook-meta">
            <span><i class="fas fa-tag"></i> ${b.genre}</span>
            <span>${starHTML(b.rating)} ${b.rating}</span>
            <span><i class="fas fa-circle" style="color:${b.available?'var(--green-accent)':'var(--red-accent)'}"></i> ${b.available?'Available':'Borrowed'}</span>
          </div>
        </div>
        <div class="mybook-actions">
          <button class="btn-borrow" ${!b.available?'disabled':''} onclick="borrowBook(${b.id})">${b.available?'Borrow':'Reserve'}</button>
          <button class="btn-icon" onclick="showToast('Removed from wishlist','success')"><i class="fas fa-trash"></i></button>
        </div>
      </div>`).join('');
  }
}

// ============================================================
// RENDER: CURRENTLY READING
// ============================================================
function renderReadingPage() {
  const el = document.getElementById('currentReadingContent');
  const book = BOOKS[4];
  const progress = readingProgress[book.id] || 38;
  el.innerHTML = `
    <div class="reading-layout">
      <div class="reading-main-card">
        <div style="display:flex;gap:28px;align-items:flex-start;flex-wrap:wrap">
          <div style="width:130px;height:190px;border-radius:8px;overflow:hidden;flex-shrink:0">
            <div style="width:100%;height:100%;background:linear-gradient(145deg,${book.color},${book.color}aa);display:flex;align-items:center;justify-content:center;padding:10px;text-align:center">
              <span style="font-family:'Playfair Display',serif;font-size:0.85rem;color:rgba(255,255,255,0.85)">${book.title}</span>
            </div>
          </div>
          <div style="flex:1">
            <div style="font-size:0.8rem;color:var(--gold);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Currently Reading</div>
            <h2 style="font-family:'Playfair Display',serif;font-size:1.8rem;color:var(--cream);margin-bottom:6px">${book.title}</h2>
            <p style="color:var(--text-muted);font-style:italic;margin-bottom:16px">by ${book.author}</p>
            <div style="display:flex;gap:20px;flex-wrap:wrap;margin-bottom:20px">
              <span style="color:var(--text-sub);font-size:0.85rem"><i class="fas fa-book-open" style="color:var(--gold-dim);margin-right:6px"></i>Page 115 of ${book.pages}</span>
              <span style="color:var(--text-sub);font-size:0.85rem"><i class="fas fa-clock" style="color:var(--gold-dim);margin-right:6px"></i>~3 hrs remaining</span>
              <span style="color:var(--text-sub);font-size:0.85rem"><i class="fas fa-calendar" style="color:var(--gold-dim);margin-right:6px"></i>Started: Apr 28</span>
            </div>
            <div class="progress-row" style="margin-bottom:20px">
              <div class="progress-label" style="display:flex;justify-content:space-between"><span>Reading Progress</span><span style="color:var(--gold)">${progress}%</span></div>
              <div class="progress-track" style="height:10px"><div class="progress-fill" style="width:${progress}%"></div></div>
            </div>
            <div style="display:flex;gap:10px;flex-wrap:wrap">
              <button class="btn-primary" style="width:auto;padding:10px 22px" onclick="updateProgress(${book.id})"><span>Update Progress</span><i class="fas fa-arrow-right"></i></button>
              <button class="btn-secondary" onclick="showToast('Added a reading note!','success')"><i class="fas fa-pencil-alt" style="margin-right:6px"></i>Add Note</button>
              <button class="btn-secondary" onclick="markFinished(${book.id})"><i class="fas fa-check" style="margin-right:6px"></i>Mark Finished</button>
            </div>
          </div>
        </div>
      </div>
      <div class="reading-sidebar-cards">
        <div class="reading-sidebar-card">
          <h4><i class="fas fa-chart-line" style="color:var(--gold);margin-right:8px"></i>Reading Stats</h4>
          <div class="session-log">
            <div class="session-item"><i class="fas fa-fire"></i><span>7-day reading streak</span></div>
            <div class="session-item"><i class="fas fa-book"></i><span>8 books finished this year</span></div>
            <div class="session-item"><i class="fas fa-clock"></i><span>Avg. 45 min/day</span></div>
            <div class="session-item"><i class="fas fa-star"></i><span>Top genre: Fiction</span></div>
          </div>
        </div>
        <div class="reading-sidebar-card">
          <h4><i class="fas fa-history" style="color:var(--gold);margin-right:8px"></i>Recent Sessions</h4>
          <div class="session-log">
            <div class="session-item"><i class="fas fa-calendar"></i><span>Today — 32 pages</span></div>
            <div class="session-item"><i class="fas fa-calendar"></i><span>Yesterday — 45 pages</span></div>
            <div class="session-item"><i class="fas fa-calendar"></i><span>May 1 — 28 pages</span></div>
          </div>
        </div>
        <div class="reading-sidebar-card">
          <h4><i class="fas fa-lightbulb" style="color:var(--gold);margin-right:8px"></i>Up Next</h4>
          <div style="display:flex;gap:10px;align-items:center">
            <div style="width:44px;height:60px;border-radius:4px;background:linear-gradient(145deg,${BOOKS[6].color},${BOOKS[6].color}aa);flex-shrink:0"></div>
            <div>
              <div style="color:var(--cream);font-size:0.85rem;font-family:'Playfair Display',serif">${BOOKS[6].title}</div>
              <div style="color:var(--text-muted);font-size:0.75rem;font-style:italic">${BOOKS[6].author}</div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

// ============================================================
// RENDER: REVIEWS PAGE
// ============================================================
const SAMPLE_REVIEWS = [
  { bookId: 0, user: 'Priya N.', text: 'A hauntingly beautiful novel. The atmospheric prose will stay with me for years. Zafón is a master storyteller.', rating: 5, date: 'Apr 29, 2026', color: '#c9a84c' },
  { bookId: 1, user: 'Arjun M.', text: 'Dune is without question one of the greatest works of science fiction. World-building at its absolute finest.', rating: 5, date: 'Apr 25, 2026', color: '#5d6d7e' },
  { bookId: 7, user: 'Karthik S.', text: 'Atomic Habits genuinely changed my daily routine. The 1% better concept is deceptively powerful. Highly recommended.', rating: 4, date: 'Apr 20, 2026', color: '#27ae60' },
  { bookId: 12, user: 'Zara S.', text: '1984 is as terrifying as it is brilliant. Orwell\'s vision feels more relevant with every passing year.', rating: 5, date: 'Apr 15, 2026', color: '#8e44ad' },
  { bookId: 8, user: 'Divya R.', text: 'The Alchemist is short but profound. Some passages feel like they were written specifically for you.', rating: 4, date: 'Apr 10, 2026', color: '#e67e22' },
  { bookId: 4, user: 'Rohit G.', text: 'The Midnight Library made me cry in the best possible way. A beautiful meditation on the choices we make.', rating: 5, date: 'Apr 8, 2026', color: '#1abc9c' },
];

function renderReviewsPage() {
  const el = document.getElementById('reviewsContent');
  el.innerHTML = `
    <div class="reviews-layout">
      <div class="review-form-card">
        <h3><i class="fas fa-pen-fancy" style="color:var(--gold);margin-right:10px"></i>Write a Review</h3>
        <div class="form-group">
          <label>Book Title</label>
          <input type="text" id="reviewBookTitle" placeholder="Search for a book..."/>
        </div>
        <div style="margin-bottom:14px">
          <label style="color:var(--text-sub);font-size:0.82rem;text-transform:uppercase;letter-spacing:0.8px;font-weight:600">Your Rating</label>
          <div class="star-picker" id="starPicker">
            <span onclick="setStars(1)">★</span>
            <span onclick="setStars(2)">★</span>
            <span onclick="setStars(3)">★</span>
            <span onclick="setStars(4)">★</span>
            <span onclick="setStars(5)">★</span>
          </div>
        </div>
        <div class="form-group">
          <label>Your Review</label>
          <textarea rows="4" id="reviewText" placeholder="Share your thoughts on this book..."></textarea>
        </div>
        <button class="btn-primary" style="width:auto;padding:12px 28px" onclick="submitReview()"><span>Post Review</span><i class="fas fa-paper-plane"></i></button>
      </div>
      ${SAMPLE_REVIEWS.map(r => `
      <div class="review-card">
        <div class="review-header">
          <div>
            <div class="review-book-title">${BOOKS[r.bookId].title}</div>
            <div class="review-author">by ${BOOKS[r.bookId].author}</div>
          </div>
          <div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
        </div>
        <div class="review-text">"${r.text}"</div>
        <div class="review-footer">
          <div class="review-user">
            <div class="user-avatar" style="background:${r.color};width:32px;height:32px;font-size:0.8rem">${r.user.charAt(0)}</div>
            <span style="color:var(--text-sub);font-size:0.85rem">${r.user}</span>
          </div>
          <div class="review-date">${r.date}</div>
        </div>
      </div>`).join('')}
    </div>`;

  let selectedStars = 0;
  window.setStars = function(n) {
    selectedStars = n;
    document.querySelectorAll('#starPicker span').forEach((s, i) => {
      s.classList.toggle('lit', i < n);
    });
  };
  window.submitReview = function() {
    const title = document.getElementById('reviewBookTitle').value;
    const text  = document.getElementById('reviewText').value;
    if (!title || !text || !selectedStars) { showToast('Please fill all fields and select a rating.', 'error'); return; }
    showToast('Review posted successfully! Thank you.', 'success');
    document.getElementById('reviewBookTitle').value = '';
    document.getElementById('reviewText').value = '';
    selectedStars = 0;
    document.querySelectorAll('#starPicker span').forEach(s => s.classList.remove('lit'));
  };
}

// ============================================================
// RENDER: EVENTS PAGE
// ============================================================
function renderEventsPage() {
  document.getElementById('eventsContent').innerHTML = `
    <div class="events-grid">
      ${EVENTS.map(ev => `
        <div class="event-card">
          <div class="event-banner" style="background:linear-gradient(135deg,rgba(201,168,76,0.1),rgba(201,168,76,0.05))">
            <span>${ev.emoji}</span>
          </div>
          <div class="event-body">
            <span class="event-tag">${ev.tag}</span>
            <div class="event-title">${ev.title}</div>
            <div class="event-meta">
              <span><i class="fas fa-calendar"></i> ${ev.date}</span>
              <span><i class="fas fa-clock"></i> ${ev.time}</span>
              <span><i class="fas fa-map-marker-alt"></i> ${ev.location}</span>
            </div>
            <p style="color:var(--text-sub);font-size:0.82rem;line-height:1.6;margin-bottom:14px">${ev.desc}</p>
            <button class="btn-primary" style="font-size:0.8rem;padding:10px 18px" onclick="registerEvent('${ev.title}')"><span>Register</span><i class="fas fa-arrow-right"></i></button>
          </div>
        </div>`).join('')}
    </div>`;
}

// ============================================================
// RENDER: ABOUT PAGE
// ============================================================
function renderAboutPage() {
  document.getElementById('teamGrid').innerHTML = TEAM.map(t => `
    <div class="team-card">
      <div class="team-avatar" style="background:${t.color}">${t.name.charAt(0)}</div>
      <div class="team-name">${t.name}</div>
      <div class="team-role">${t.role}</div>
    </div>`).join('');
}

// ============================================================
// RENDER: PROFILE PAGE
// ============================================================
function renderProfilePage() {
  if (!currentUser) return;
  const u = currentUser;
  document.getElementById('profileContent').innerHTML = `
    <div class="profile-layout">
      <div class="profile-card">
        <div class="profile-avatar-big" style="background:linear-gradient(135deg,var(--gold),var(--gold-dim))">${u.firstName.charAt(0)}</div>
        <div class="profile-name">${u.firstName} ${u.lastName}</div>
        <div class="profile-email">${u.email}</div>
        <div class="profile-badge">⭐ Active Member</div>
        <div class="profile-stats">
          <div class="profile-stat"><strong>8</strong><span>Books Read</span></div>
          <div class="profile-stat"><strong>${wishlist.length||5}</strong><span>Wishlist</span></div>
          <div class="profile-stat"><strong>${userReviews.length||3}</strong><span>Reviews</span></div>
          <div class="profile-stat"><strong>2</strong><span>Borrowed</span></div>
        </div>
      </div>
      <div class="profile-edit-card">
        <h3>Edit Profile</h3>
        <div class="form-row-two">
          <div class="form-group"><label>First Name</label><input type="text" value="${u.firstName}" id="editFirst"/></div>
          <div class="form-group"><label>Last Name</label><input type="text" value="${u.lastName}" id="editLast"/></div>
        </div>
        <div class="form-group"><label>Email</label><input type="email" value="${u.email}" id="editEmail"/></div>
        <div class="form-group"><label>Phone</label><input type="tel" value="${u.phone||''}" id="editPhone" placeholder="+91..."/></div>
        <div class="form-group"><label>Favourite Genre</label>
          <select id="editGenre">
            ${['Fiction','Non-Fiction','Mystery','Sci-Fi','Fantasy','Biography','History','Self-Help','Romance','Horror'].map(g => `<option ${u.genre===g?'selected':''}>${g}</option>`).join('')}
          </select>
        </div>
        <div class="form-group"><label>Bio</label><textarea rows="3" placeholder="Tell other readers about yourself...">${u.bio||''}</textarea></div>
        <button class="btn-primary" style="width:auto;padding:12px 28px" onclick="saveProfile()"><span>Save Changes</span><i class="fas fa-check"></i></button>
        <hr style="border:none;border-top:1px solid var(--border);margin:28px 0"/>
        <h3>Change Password</h3>
        <div class="form-group"><label>Current Password</label><input type="password" placeholder="Current password"/></div>
        <div class="form-group"><label>New Password</label><input type="password" placeholder="New password"/></div>
        <div class="form-group"><label>Confirm New Password</label><input type="password" placeholder="Confirm password"/></div>
        <button class="btn-secondary" onclick="showToast('Password updated!','success')">Update Password</button>
      </div>
    </div>`;
}

function saveProfile() {
  if (!currentUser) return;
  currentUser.firstName = document.getElementById('editFirst').value || currentUser.firstName;
  currentUser.lastName  = document.getElementById('editLast').value  || currentUser.lastName;
  currentUser.email     = document.getElementById('editEmail').value  || currentUser.email;
  document.getElementById('navUsername').textContent = currentUser.firstName;
  document.getElementById('heroUsername').textContent = currentUser.firstName;
  document.getElementById('userAvatar').textContent = currentUser.firstName.charAt(0);
  const idx = users.findIndex(u => u.email === currentUser.email);
  if (idx > -1) { users[idx] = currentUser; localStorage.setItem('bib_users', JSON.stringify(users)); }
  showToast('Profile updated successfully!', 'success');
}

// ============================================================
// BOOK MODAL
// ============================================================
function openBookModal(id) {
  const book = BOOKS.find(b => b.id === id);
  if (!book) return;
  const available = !borrowedBooks.includes(id) && book.available;
  const inWishlist = wishlist.includes(id);

  document.getElementById('modalContent').innerHTML = `
    <div class="modal-book-layout">
      <div class="modal-cover" style="background:linear-gradient(145deg,${book.color},${book.color}bb)">
        <div class="modal-cover-text">${book.title}<br/><span style="font-size:0.75rem;opacity:0.7">${book.author}</span></div>
      </div>
      <div class="modal-details">
        <span class="book-genre-tag modal-genre-tag">${book.genre}</span>
        <div class="modal-title">${book.title}</div>
        <div class="modal-author">by ${book.author}</div>
        <div class="modal-rating">${starHTML(book.rating)}<span class="num">${book.rating}/5 · ${book.reviews.toLocaleString()} reviews</span></div>
        <div class="modal-description">${book.desc}</div>
        <div class="modal-meta">
          <div class="modal-meta-item"><div class="label">Published</div><div class="value">${book.year}</div></div>
          <div class="modal-meta-item"><div class="label">Pages</div><div class="value">${book.pages}</div></div>
          <div class="modal-meta-item"><div class="label">ISBN</div><div class="value" style="font-size:0.75rem">${book.isbn}</div></div>
          <div class="modal-meta-item"><div class="label">Status</div><div class="value" style="color:${available?'var(--green-accent)':'#e74c3c'}">${available?'Available':'Borrowed'}</div></div>
        </div>
        <div class="modal-actions">
          <button class="btn-borrow" ${!available?'disabled':''} onclick="borrowBook(${id});closeBookModal()">${available?'Borrow Now':'Unavailable'}</button>
          <button class="btn-icon ${inWishlist?'liked':''}" onclick="toggleWishlist(${id},this)" title="Wishlist"><i class="fas fa-heart"></i></button>
          <button class="btn-icon" onclick="showToast('Book shared!','success')" title="Share"><i class="fas fa-share-alt"></i></button>
          <button class="btn-secondary small" onclick="showPage('reviews');closeBookModal()">Write Review</button>
        </div>
      </div>
    </div>`;

  document.getElementById('bookModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeBookModal() {
  document.getElementById('bookModal').classList.remove('open');
  document.body.style.overflow = '';
}

function closeModal(e) {
  if (e.target === document.getElementById('bookModal')) closeBookModal();
}

// ============================================================
// BORROW / RETURN / WISHLIST
// ============================================================
function borrowBook(id) {
  if (borrowedBooks.includes(id)) { showToast('You\'ve already borrowed this book!', 'error'); return; }
  borrowedBooks.push(id);
  localStorage.setItem('bib_borrowed', JSON.stringify(borrowedBooks));
  showToast('📚 Book borrowed successfully! Due in 14 days.', 'success');
  updateStatusBanner();
  renderBrowsePage();
  renderFeaturedBooks();
  renderNewArrivals();
}

function returnBook(id) {
  borrowedBooks = borrowedBooks.filter(b => b !== id);
  localStorage.setItem('bib_borrowed', JSON.stringify(borrowedBooks));
  readingHistory.push(id);
  localStorage.setItem('bib_history', JSON.stringify(readingHistory));
  showToast('Book returned successfully!', 'success');
  updateStatusBanner();
  renderMyBooks('borrowed');
}

function toggleWishlist(id, btn) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(b => b !== id);
    showToast('Removed from wishlist.', 'success');
    btn.classList.remove('liked');
  } else {
    wishlist.push(id);
    showToast('❤️ Added to wishlist!', 'success');
    btn.classList.add('liked');
  }
  localStorage.setItem('bib_wishlist', JSON.stringify(wishlist));
  updateStatusBanner();
}

function updateProgress(id) {
  const current = readingProgress[id] || 30;
  const next = Math.min(100, current + 10);
  readingProgress[id] = next;
  localStorage.setItem('bib_progress', JSON.stringify(readingProgress));
  showToast(`Reading progress updated to ${next}%!`, 'success');
  renderReadingPage();
  renderMyBooks('borrowed');
}

function markFinished(id) {
  returnBook(id);
  showToast('🎉 Congratulations on finishing the book!', 'success');
  renderReadingPage();
}

// ============================================================
// SEARCH
// ============================================================
function doHeroSearch() {
  const q = document.getElementById('heroSearch').value.trim();
  if (!q) return;
  showPage('browse');
  document.getElementById('browseSearch').value = q;
  applyFilters();
  showToast(`Searching for "${q}"...`, 'success');
}

function quickSearch(genre) {
  showPage('browse');
  document.getElementById('filterGenre').value = genre;
  applyFilters();
}

function doNavSearch() {
  const q = document.getElementById('navSearchInput').value.trim();
  if (!q) return;
  showPage('browse');
  document.getElementById('browseSearch').value = q;
  applyFilters();
}

// ============================================================
// EVENTS / MISC
// ============================================================
function registerEvent(title) {
  showToast(`Registered for "${title}"! Check your email for confirmation.`, 'success');
}

function sendContactMsg() {
  showToast('Message sent! We\'ll get back to you within 24 hours.', 'success');
}

function getDueDate() {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}

function toggleDark() {
  showToast('Theme preference saved!', 'success');
}

// ============================================================
// TOAST
// ============================================================
let toastTimer;
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast ${type} show`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
}