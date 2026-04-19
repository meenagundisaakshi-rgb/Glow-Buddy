const affirmations = [
  "I am enough just as I am.",
  "My grades do not define my worth.",
  "It is okay to take a break and rest.",
  "I am growing and learning every single day.",
  "I choose to be kind to myself today.",
  "My feelings are valid.",
  "Comparing myself to others online doesn't help me.",
  "I am proud of the small steps I've taken."
];

const app = {
  activeScreen: 'dashboard',
  mediaRecorder: null,
  audioChunks: [],
  journalEntries: [],
  
  quizState: {
    currentQuestion: -1,
    score: 0,
    questions: [
      "Did you take a moment to be proud of yourself today?",
      "Did you treat yourself kindly when you made a mistake?",
      "Are you remembering that social media is just a highlight reel?",
      "Did you focus on things you can control today?",
      "Do you believe that your feelings are valid?"
    ]
  },
  
  badges: [
    { id: 'starter', name: 'Starter Spark', desc: 'Write your first journal entry.', icon: '🌱', unlocked: false },
    { id: 'quiz', name: 'Check-In Pro', desc: 'Finish the Daily Check-In Paper.', icon: '📋', unlocked: false },
    { id: 'zen', name: 'Zen Master', desc: 'Take a moment for a breathing exercise.', icon: '🧘', unlocked: false },
    { id: 'lexly_master', name: 'Language Legend', desc: 'Score 5/5 in any Lexly test.', icon: '🏆', unlocked: false },
    { id: 'gratitude', name: 'Gratitude Guru', desc: 'Save an item to your Gratitude Jar.', icon: '🏺', unlocked: false }
  ],
    this.cacheDOM();
    this.handleLocalEnvironment();
    this.bindEvents();
    this.registerServiceWorker();
    this.loadHistory();
    this.setRandomAffirmation();
    
    // Simulate loading
    setTimeout(() => {
      document.getElementById('loader').classList.add('hidden');
      document.getElementById('app').classList.remove('hidden');
      this.checkBadges();
    }, 1500);
  },
  
  handleLocalEnvironment() {
    if (window.location.protocol === 'file:') {
      const wrappers = document.querySelectorAll('.video-wrapper');
      wrappers.forEach(wrapper => {
        const iframe = wrapper.querySelector('iframe');
        if (!iframe) return;
        const src = iframe.src;
        const match = src.match(/embed\/([^?"]+)/);
        if (match) {
          const vidId = match[1];
          const ytLink = `https://www.youtube.com/watch?v=${vidId}`;
          const thumb = `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`;
          wrapper.innerHTML = `
            <a href="${ytLink}" target="_blank" style="display: block; width: 100%; height: 100%; position: absolute; top: 0; left: 0;">
              <img src="${thumb}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 18px;" alt="Video Thumbnail">
              <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); border-radius: 18px; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">
                 <div style="background: #FF0000; color: white; padding: 12px 24px; border-radius: 30px; font-weight: bold; font-size: 1.1rem; box-shadow: 0 5px 15px rgba(255,0,0,0.4); display: flex; align-items: center; gap: 8px;">
                   <span>▶</span> Watch on YouTube
                 </div>
              </div>
            </a>
          `;
        }
      });
    }
  },

  cacheDOM() {
    this.navItems = document.querySelectorAll('.nav-links li');
    this.screens = document.querySelectorAll('.screen');
    
    // CBT Elements
    this.analyzeBtn = document.getElementById('analyze-btn');
    this.negativeInput = document.getElementById('negative-thought');
    
    // Insight Elements
    this.insightBox = document.getElementById('glow-insight');
    this.insightText = document.getElementById('insight-text');
    this.restartSection = document.getElementById('restart-section');
    this.restartBtn = document.getElementById('restart-journal-btn');
    
    // History Elements
    this.historyFeed = document.getElementById('history-feed');
    
    // Gratitude Elements
    this.affirmationText = document.getElementById('daily-affirmation');
    this.newAffirmBtn = document.getElementById('new-affirmation-btn');
    this.gratitudeInput = document.getElementById('gratitude-input');
    this.saveGratitudeBtn = document.getElementById('save-gratitude-btn');
    
    // Breathe Elements
    this.breatheCircle = document.getElementById('breathe-animator');
    this.breatheText = document.getElementById('breathe-text');
    this.startBreatheBtn = document.getElementById('start-breathe-btn');
    this.breatheInterval = null;

    // Speech Elements
    this.startRecordBtn = document.getElementById('start-record-btn');
    this.stopRecordBtn = document.getElementById('stop-record-btn');
    this.recordingStatus = document.getElementById('recording-status');
    this.audioPlaybackArea = document.getElementById('audio-playback');
    this.finishSpeechBtn = document.getElementById('finish-module-btn');
    
    // Mood
    this.moodBtns = document.querySelectorAll('.mood-btn');
  },
  
  bindEvents() {
    // Navigation
    this.navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const target = e.currentTarget.getAttribute('data-target');
        this.navigate(target);
      });
    });
    
    // Mood Selector
    this.moodBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.moodBtns.forEach(b => b.classList.remove('selected'));
        e.currentTarget.classList.add('selected');
        setTimeout(() => alert('Daily mood saved! Thanks for checking in.'), 300);
      });
    });
    
    // CBT Logic - Glow Buddy answers directly
    this.analyzeBtn.addEventListener('click', () => {
      const text = this.negativeInput.value.toLowerCase().trim();
      if (text.length < 5) {
        alert("Please write a bit more so we can help you!");
        return;
      }
      
      let insight = "That sounds like a really heavy burden to carry around. Thank you so much for being brave enough to write it down here. Whatever you are facing, your feelings are 100% valid. Everyone struggles and has bad days, but you have incredible inner strength to overcome this challenge. Take a deep breath. You are not alone in feeling this way, and the fact that you are reaching out shows tremendous courage. Remember that tough times don't last, but tough people do. Be patient with yourself and treat yourself with the same kindness you would show your best friend.";
      
      if (text.match(/(exam|exams|school|study|marks|test|grades|fail|homework|tuition|board)/)) {
        insight = "It sounds like you're experiencing a lot of academic pressure right now, and that is completely understandable. In India, we grow up surrounded by the idea that marks define our future, but that is simply not true. A test score does not measure your intelligence, your creativity, your kindness, or your worth as a human being. Some of the most successful people in the world struggled in school. What truly matters is the effort you are putting in and the lessons you learn along the way. Take a deep breath right now. You are doing your best, and your best is always enough. Focus on progress, not perfection.";
      } else if (text.match(/(instagram|snapchat|ugly|fat|looks|skinny|follower|social media|compare|tiktok|reel|beautiful|pretty|handsome|dark|fair|skin|weight|tall|short)/)) {
        insight = "It seems like you might be caught in the social comparison trap, and I want you to know that you are absolutely not alone in feeling this way. When we scroll through social media, we usually only see everyone's highlight reel - the best, most filtered, most carefully curated moments of their lives. Nobody posts their bad days, their insecurities, or their struggles. Comparing your real, beautifully complex life to someone else's fake online persona is never going to be a fair comparison. You are completely unique, and the world needs exactly who you are. Your beauty is not defined by filters or follower counts. It is defined by your kindness, your laughter, and the light you bring into the world.";
      } else if (text.match(/(friend|friends|lonely|hate|mean|bully|ignored|left out|alone|fight|nobody|no one|talk|popular)/)) {
        insight = "Friendship issues and feeling left out can be one of the most deeply painful experiences, especially during your school years. It is completely natural to feel hurt, lonely, or upset when the people around you aren't treating you with the kindness and respect you deserve. But here is something really important to remember: how others treat you is almost always a reflection of what THEY are going through internally, not a reflection of your value as a person. You are worthy of love, respect, and genuine friendship. The right people will find you and appreciate you for exactly who you are. In the meantime, be your own best friend. Treat yourself with compassion and never dim your light to fit in with others.";
      } else if (text.match(/(parent|parents|mom|dad|family|mum|mother|father|sister|brother|home|shout|yell|scold)/)) {
        insight = "Family situations can feel incredibly overwhelming, especially when you feel like the people closest to you don't fully understand what you're going through. It is important to remember that your parents and family members are human too, and sometimes they express their love and concern in ways that feel harsh or confusing. Even when home life is tough, your feelings are completely valid. You deserve to feel safe and heard. If things ever feel too heavy, please consider talking to a trusted teacher, school counselor, or calling a helpline. You are never truly alone, even when it feels that way.";
      }

      this.insightText.innerText = insight;
      this.insightBox.classList.remove('hidden');
      this.restartSection.classList.remove('hidden');
      this.analyzeBtn.classList.add('hidden');
      this.negativeInput.disabled = true;
      
      // Auto-save Q&A to history
      this.addEntry({
        type: 'cbt',
        date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
        original: this.negativeInput.value.trim(),
        reframed: insight
      });
      localStorage.setItem('gb_badge_spark', 'unlocked');
      this.checkBadges();
    });
    
    // Restart button - clears the journal for a new question
    this.restartBtn.addEventListener('click', () => {
      this.negativeInput.value = '';
      this.negativeInput.disabled = false;
      this.analyzeBtn.classList.remove('hidden');
      this.insightBox.classList.add('hidden');
      this.restartSection.classList.add('hidden');
    });

    // Gratitude / Chit Jar Logic
    this.newAffirmBtn.addEventListener('click', () => {
      const chit = document.getElementById('live-chit');
      chit.classList.remove('slide-up');
      setTimeout(() => {
        this.setRandomAffirmation();
        chit.classList.add('slide-up');
      }, 400); 
    });
    
    this.saveGratitudeBtn.addEventListener('click', () => {
       if (this.gratitudeInput.value.trim().length < 5) return;
       
       this.addEntry({
         type: 'gratitude',
         date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
         reframed: this.gratitudeInput.value.trim()
       });
       
       alert('Dropped in the jar! Saved to your History Vault.');
       this.gratitudeInput.value = '';
       this.navigate('history');
    });

    // Breathe Logic
    this.startBreatheBtn.addEventListener('click', () => this.startBreatheExercise());
    
    // Speech Logic
    this.startRecordBtn.addEventListener('click', () => this.startRecording());
    this.stopRecordBtn.addEventListener('click', () => this.stopRecording());
    this.finishSpeechBtn.addEventListener('click', () => {
      localStorage.setItem('gb_badge_voice', 'unlocked');
      alert('Amazing speaking practice! You earned the "Brave Voice" badge! +10XP');
      this.audioPlaybackArea.classList.add('hidden');
      this.checkBadges();
      this.navigate('badges');
    });
  },
  
  navigate(target) {
    if (this.activeScreen === 'chill' && target !== 'chill') {
      const iframes = document.querySelectorAll('#chill iframe');
      iframes.forEach(iframe => {
        const src = iframe.src;
        iframe.src = src;
      });
    }

    this.activeScreen = target;
    if (target === 'badges') this.checkBadges();
    
    this.navItems.forEach(item => {
      if (item.getAttribute('data-target') === target) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
    
    this.screens.forEach(screen => {
      if (screen.id === 'loader' || screen.id === 'app') return;
      if (screen.id === target) {
        screen.classList.remove('hidden-screen');
        screen.classList.add('active-screen');
      } else {
        screen.classList.remove('active-screen');
        screen.classList.add('hidden-screen');
      }
    });
  },

  // Database / Storage Methods
  loadHistory() {
    const saved = localStorage.getItem('gb_journal_entries');
    if (saved) {
      this.journalEntries = JSON.parse(saved);
    }
    this.renderHistoryList();
  },

  addEntry(entry) {
    this.journalEntries.unshift(entry);
    localStorage.setItem('gb_journal_entries', JSON.stringify(this.journalEntries));
    this.renderHistoryList();
  },

  renderHistoryList() {
    this.historyFeed.innerHTML = '';
    
    if (this.journalEntries.length === 0) {
      this.historyFeed.innerHTML = '<p class="hint">Your vault is empty! Ask a question in the Journal or drop a Gratitude note to fill it.</p>';
      return;
    }

    this.journalEntries.forEach(entry => {
      const card = document.createElement('div');
      card.className = `history-entry fade-in ${entry.type === 'gratitude' ? 'gratitude-type' : ''}`;
      
      const dateEl = document.createElement('div');
      dateEl.className = 'entry-date';
      dateEl.innerText = entry.date + (entry.type === 'gratitude' ? ' \u2022 Gratitude Note' : ' \u2022 Journal Q&A');
      card.appendChild(dateEl);

      if (entry.type === 'cbt' && entry.original) {
        const questionLabel = document.createElement('div');
        questionLabel.className = 'entry-label';
        questionLabel.innerText = 'You asked:';
        card.appendChild(questionLabel);
        
        const origEl = document.createElement('div');
        origEl.className = 'entry-question';
        origEl.innerText = entry.original;
        card.appendChild(origEl);
        
        const answerLabel = document.createElement('div');
        answerLabel.className = 'entry-label answer-label';
        answerLabel.innerText = 'Glow Buddy answered:';
        card.appendChild(answerLabel);
      }

      const mainEl = document.createElement('div');
      mainEl.className = entry.type === 'gratitude' ? 'entry-gratitude' : 'entry-reframed';
      mainEl.innerText = entry.reframed;
      card.appendChild(mainEl);

      this.historyFeed.appendChild(card);
    });
  },

  // Gratitude / Affirmation
  setRandomAffirmation() {
    const rnd = Math.floor(Math.random() * affirmations.length);
    this.affirmationText.innerText = `"${affirmations[rnd]}"`;
  },

  // Breathe feature
  startBreatheExercise() {
    if (this.startBreatheBtn.innerText === "Stop") {
      this.stopBreatheExercise();
      return;
    }
    
    this.startBreatheBtn.innerText = "Stop";
    this.breatheCircle.classList.add('animating');
    let cycles = 0;
    
    const breatheCycle = () => {
      this.breatheText.innerText = "Breathe In...";
      setTimeout(() => {
        if(!this.breatheCircle.classList.contains('animating')) return;
        this.breatheText.innerText = "Breathe Out...";
      }, 4000);
      cycles++;
      if(cycles >= 6) {
        setTimeout(() => this.stopBreatheExercise(), 8000);
      }
    };
    
    breatheCycle();
    this.breatheInterval = setInterval(breatheCycle, 8000);
  },

  stopBreatheExercise() {
    this.startBreatheBtn.innerText = "Start Exercise";
    this.breatheCircle.classList.remove('animating');
    this.breatheText.innerText = "Completed!";
    clearInterval(this.breatheInterval);
    setTimeout(() => {
      if(!this.breatheCircle.classList.contains('animating')) this.breatheText.innerText = "Ready";
    }, 2000);
  },
  
  checkBadges() {
    const spark = localStorage.getItem('gb_badge_spark');
    const voice = localStorage.getItem('gb_badge_voice');
    
    if (spark === 'unlocked') {
      const b = document.getElementById('badge-spark');
      if(b) {
        b.classList.remove('locked');
        b.classList.add('unlocked');
      }
    }
    
    if (voice === 'unlocked') {
      const b = document.getElementById('badge-voice');
      if(b) {
        b.classList.remove('locked');
        b.classList.add('unlocked');
      }
    }
  },
  
  // --- Quiz / Sample Paper Logic ---
  speakText(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Make the most girliest/sweetest voice possible natively
      utterance.rate = 0.85;
      utterance.pitch = 2.0; 
      
      // Try to find the sweetest default female voice on the system
      const voices = window.speechSynthesis.getVoices();
      const sweetVoice = voices.find(v => 
        v.name.includes('Zira') || 
        v.name.includes('Hazel') || 
        v.name.includes('Samantha') || 
        v.name.includes('Female')
      );
      if (sweetVoice) {
        utterance.voice = sweetVoice;
      }

      // Animate the specific lips while talking, not the body
      const lips = document.getElementById('mascot-mouth');
      utterance.onstart = () => {
        if(lips) lips.classList.add('is-talking');
      };
      utterance.onend = () => {
        if(lips) lips.classList.remove('is-talking');
      };
      utterance.onerror = () => {
        if(lips) lips.classList.remove('is-talking');
      };

      window.speechSynthesis.speak(utterance);
    }
  },

  startQuiz() {
    this.quizState.currentQuestion = 0;
    this.quizState.score = 0;
    this.renderQuizQuestion();
  },
  
  renderQuizQuestion() {
    const qIndex = this.quizState.currentQuestion;
    const qText = document.getElementById('quiz-question');
    const optionsContainer = document.getElementById('quiz-options');
    
    if (qIndex >= this.quizState.questions.length) {
      this.showQuizResult();
      return;
    }
    
    qText.innerText = `Question ${qIndex + 1}: ${this.quizState.questions[qIndex]}`;
    optionsContainer.innerHTML = `
      <button class="btn success-btn quiz-btn" onclick="app.answerQuiz(2)">Yes, always!</button>
      <button class="btn secondary-btn quiz-btn" onclick="app.answerQuiz(1)">Sometimes</button>
      <button class="btn secondary-btn quiz-btn" onclick="app.answerQuiz(0)">Not today, but I will try</button>
    `;
    
    const readOutLoud = `Question ${qIndex + 1}. ${this.quizState.questions[qIndex]} Your options are: Yes, always! Sometimes. Or, Not today.`;
    this.speakText(readOutLoud);
  },
  
  answerQuiz(points) {
    this.quizState.score += points;
    this.quizState.currentQuestion++;
    this.renderQuizQuestion();
  },
  
  showQuizResult() {
    const paper = document.getElementById('quiz-paper');
    const reward = document.getElementById('sticker-reward');
    const icon = document.getElementById('earned-sticker');
    const text = document.getElementById('sticker-text');
    
    paper.classList.add('hidden');
    reward.classList.remove('hidden');
    
    const maxScore = this.quizState.questions.length * 2;
    const percentage = this.quizState.score / maxScore;
    
    if (percentage >= 0.8) {
      icon.innerHTML = '<img src="star.png" style="width: 130px; height: 130px; mix-blend-mode: multiply; border-radius: 10px;">';
      text.innerText = "Premium Gold Star Sticker!";
      this.speakText("Wow! You earned the realistic Gold Star Sticker. You are incredibly special, keep shining bright!");
    } else if (percentage >= 0.4) {
      icon.innerHTML = '<div style="font-size: 6rem; line-height: 1;">\ud83d\udcaa</div>';
      text.innerText = "Brave Heart Sticker!";
      this.speakText("Great effort! You earned the Brave Heart Sticker. I am so proud of you for trying your best.");
    } else {
      icon.innerHTML = '<div style="font-size: 6rem; line-height: 1;">\ud83c\udf31</div>';
      text.innerText = "Growing Sprout Sticker!";
      this.speakText("Thank you so much for trying. You earned the Growing Sprout Sticker. Every little step matters, I believe in you.");
    }
  },
  
  finishQuiz() {
    const paper = document.getElementById('quiz-paper');
    const reward = document.getElementById('sticker-reward');
    const qText = document.getElementById('quiz-question');
    const optionsContainer = document.getElementById('quiz-options');
    
    reward.classList.add('hidden');
    paper.classList.remove('hidden');
    
    qText.innerText = "Ready to start your quick check-in?";
    optionsContainer.innerHTML = `<button class="btn primary-btn quiz-btn" onclick="app.startQuiz()">Let's Go!</button>`;
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  },

  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      
      this.mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) this.audioChunks.push(e.data);
      };
      
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        let audioEl = document.getElementById('recorded-audio');
        if (!audioEl) {
          audioEl = document.createElement('audio');
          audioEl.id = 'recorded-audio';
          audioEl.controls = true;
          this.audioPlaybackArea.insertBefore(audioEl, this.finishSpeechBtn);
        }
        audioEl.src = audioUrl;
        this.audioPlaybackArea.classList.remove('hidden');
        
        stream.getTracks().forEach(track => track.stop());
      };
      
      this.mediaRecorder.start();
      
      this.startRecordBtn.classList.add('hidden');
      this.stopRecordBtn.classList.remove('hidden');
      this.recordingStatus.classList.remove('hidden');
      
    } catch (err) {
      alert('Could not start recording. Please make sure microphone permissions are granted.');
    }
  },
  
  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.startRecordBtn.classList.remove('hidden');
      this.startRecordBtn.innerText = "Try Again";
      this.stopRecordBtn.classList.add('hidden');
      this.recordingStatus.classList.add('hidden');
    }
  },
  
  // ── Lexly Language Flashcard Engine ──────────────────────────────────────

  lexlyDecks: {
    spanish: [
      { level: 1, name: 'Basics', cards: [
        { front: 'Hello', back: 'Hola', pronunciation: '(oh-lah)' },
        { front: 'Thank you', back: 'Gracias', pronunciation: '(gra-see-as)' },
        { front: 'Friend', back: 'Amigo', pronunciation: '(ah-mee-go)' },
        { front: 'Water', back: 'Agua', pronunciation: '(ah-gwah)' },
        { front: 'Bread', back: 'Pan', pronunciation: '(pahn)' },
        { front: 'Milk', back: 'Leche', pronunciation: '(leh-cheh)' },
        { front: 'Sun', back: 'Sol', pronunciation: '(sol)' },
        { front: 'Moon', back: 'Luna', pronunciation: '(loo-nah)' }
      ]},
      { level: 2, name: 'Common Phrases', cards: [
        { front: 'How are you?', back: '¿Cómo estás?', pronunciation: '(koh-moh es-tah-s)' },
        { front: 'My name is...', back: 'Mi nombre es...', pronunciation: '(mee nom-breh es)' },
        { front: 'I like it', back: 'Me gusta', pronunciation: '(meh goos-tah)' },
        { front: 'Speak slowly', back: 'Habla despacio', pronunciation: '(ah-blah dehs-pah-syoh)' },
        { front: 'I dont know', back: 'No lo sé', pronunciation: '(no loh seh)' },
        { front: 'Excuse me', back: 'Disculpe', pronunciation: '(dees-kool-peh)' }
      ]},
      { level: 3, name: 'Daily Conversations', cards: [
        { front: 'Can you help me?', back: '¿Puedes ayudarme?', pronunciation: '(pweh-dehs ah-yoo-dar-meh)' },
        { front: 'Where is the library?', back: '¿Dónde está la biblioteca?', pronunciation: '(don-deh es-tah lah beeb-lee-oh-teh-kah)' },
        { front: 'How much does it cost?', back: '¿Cuánto cuesta?', pronunciation: '(kwan-toh kwes-tah)' },
        { front: 'I am learning Spanish', back: 'Estoy aprendiendo español', pronunciation: '(es-toy ah-pren-dyen-doh es-pah-nyol)' }
      ]}
    ],
    french: [
      { level: 1, name: 'Basics', cards: [
        { front: 'Hello', back: 'Bonjour', pronunciation: '(bon-zhoor)' },
        { front: 'Book', back: 'Livre', pronunciation: '(leev-ruh)' },
        { front: 'Yes', back: 'Oui', pronunciation: '(wee)' },
        { front: 'No', back: 'Non', pronunciation: '(noh)' },
        { front: 'Boy', back: 'Garçon', pronunciation: '(gar-sohn)' },
        { front: 'Girl', back: 'Fille', pronunciation: '(fee)' },
        { front: 'Red', back: 'Rouge', pronunciation: '(roozh)' },
        { front: 'Blue', back: 'Bleu', pronunciation: '(bluh)' }
      ]},
      { level: 2, name: 'Greetings', cards: [
        { front: 'Nice to meet you', back: 'Enchanté', pronunciation: '(ahn-shahn-tay)' },
        { front: 'How is it going?', back: 'Comment ça va?', pronunciation: '(koh-mahn sah vah)' },
        { front: 'Good night', back: 'Bonne nuit', pronunciation: '(bon nwee)' },
        { front: 'See you later', back: 'À plus tard', pronunciation: '(ah ploo tar)' },
        { front: 'Very well', back: 'Très bien', pronunciation: '(treh byahn)' }
      ]},
      { level: 3, name: 'Sentences', cards: [
        { front: 'I would like a coffee', back: 'Je voudrais un café', pronunciation: '(zhuh voo-dreh uhn kah-fay)' },
        { front: 'What time is it?', back: 'Quelle heure est-il?', pronunciation: '(kel er eh-teel)' },
        { front: 'The weather is nice', back: 'Il fait beau', pronunciation: '(eel feh boh)' },
        { front: 'I like France', back: 'J’aime la France', pronunciation: '(zhem lah frahns)' }
      ]}
    ],
    japanese: [
      { level: 1, name: 'Basics', cards: [
        { front: 'Hello', back: 'こんにちは', pronunciation: '(kon-ni-chi-wa)' },
        { front: 'School', back: '学校', pronunciation: '(gak-koh)' },
        { front: 'Sensei (Teacher)', back: '先生', pronunciation: '(sen-say)' },
        { front: 'Friend', back: '友達', pronunciation: '(to-mo-da-chi)' },
        { front: 'Water', back: '水', pronunciation: '(mi-zu)' },
        { front: 'Tree', back: '木', pronunciation: '(ki)' },
        { front: 'Mountain', back: '山', pronunciation: '(ya-ma)' },
        { front: 'River', back: '川', pronunciation: '(ka-wa)' }
      ]},
      { level: 2, name: 'Phrases', cards: [
        { front: 'Thank you very much', back: 'どうもありがとうございます', pronunciation: '(doh-mo a-ri-ga-toh go-zai-mas)' },
        { front: 'Tasty / Delicious', back: '美味しい', pronunciation: '(o-i-shee)' },
        { front: 'Do your best!', back: '頑張って', pronunciation: '(gam-bat-te)' },
        { front: 'I see', back: 'なるほど', pronunciation: '(na-ru-ho-do)' },
        { front: 'Help me', back: '助けて', pronunciation: '(ta-su-ke-te)' }
      ]},
      { level: 3, name: 'Conversations', cards: [
        { front: 'What is your name?', back: 'お名前は何ですか？', pronunciation: '(o-na-ma-e wa nan-des-ka?)' },
        { front: 'I like sushi', back: '寿司が好きです', pronunciation: '(su-shi ga su-ki desu)' },
        { front: 'Where is the station?', back: '駅はどこですか？', pronunciation: '(e-ki wa do-ko des-ka?)' },
        { front: 'Please speak slowly', back: 'ゆっくり話してください', pronunciation: '(yuk-ku-ri ha-na-shi-te ku-da-sai)' }
      ]}
    ],
    hindi: [
      { level: 1, name: 'Basics', cards: [
        { front: 'Hello', back: 'नमस्ते', pronunciation: '(na-mas-tay)' },
        { front: 'Mother', back: 'माँ', pronunciation: '(maa)' },
        { front: 'Father', back: 'पिता', pronunciation: '(pi-ta)' },
        { front: 'Student', back: 'छात्र', pronunciation: '(cha-tra)' },
        { front: 'Book', back: 'किताब', pronunciation: '(ki-taab)' },
        { front: 'Pen', back: 'कलम', pronunciation: '(ka-lam)' },
        { front: 'Country', back: 'देश', pronunciation: '(desh)' },
        { front: 'Sky', back: 'आकाश', pronunciation: '(aa-kaash)' }
      ]},
      { level: 2, name: 'Phrases', cards: [
        { front: 'What are you doing?', back: 'आप क्या कर रहे हैं?', pronunciation: '(aap kya kar rahe hain?)' },
        { front: 'How are you?', back: 'आप कैसे हैं?', pronunciation: '(aap kay-say hain?)' },
        { front: 'I am hungry', back: 'मुझे भूख लगी है', pronunciation: '(mu-jhay bhook la-gi hai)' },
        { front: 'What is the time?', back: 'समय क्या हुआ है?', pronunciation: '(sa-may kya hua hai)' },
        { front: 'I am sorry', back: 'मुझे खेद है', pronunciation: '(mu-jhay khed hai)' }
      ]},
      { level: 3, name: 'Sentences', cards: [
        { front: 'I live in India', back: 'मैं भारत में रहता हूँ', pronunciation: '(main bha-rat mein reh-ta hoon)' },
        { front: 'This is my home', back: 'यह मेरा घर है', pronunciation: '(yeh me-ra ghar hai)' },
        { front: 'Sanskrit is the mother of languages', back: 'संस्कृत भाषाओं की जननी है', pronunciation: '(san-skrit bhaa-sha-on kee jan-nee hai)' },
        { front: 'I love you', back: 'मैं तुमसे प्यार करता हूँ', pronunciation: '(main tum-se pyaar kar-ta hoon)' }
      ]}
    ],
    korean: [
      { level: 1, name: 'Basics', cards: [
        { front: 'Hello', back: '안녕하세요', pronunciation: '(an-nyeong-ha-se-yo)' },
        { front: 'Love', back: '사랑', pronunciation: '(sa-rang)' },
        { front: 'Beautiful', back: '아름다운', pronunciation: '(a-reum-da-un)' },
        { front: 'Sky', back: '하늘', pronunciation: '(ha-neul)' },
        { front: 'Flower', back: '꽃', pronunciation: '(kkot)' },
        { front: 'Star', back: '별', pronunciation: '(byeol)' },
        { front: 'Cloud', back: '구름', pronunciation: '(gu-reum)' }
      ]},
      { level: 2, name: 'Greetings', cards: [
        { front: 'Nice to meet you', back: '반갑습니다', pronunciation: '(ban-gap-seum-ni-da)' },
        { front: 'I am sorry', back: '죄송합니다', pronunciation: '(joe-song-ham-ni-da)' },
        { front: 'Happy Birthday', back: '생일 축하해요', pronunciation: '(saeng-il chuk-ha-hae-yo)' },
        { front: 'How have you been?', back: '잘 지냈어요?', pronunciation: '(jal ji-naess-eo-yo?)' }
      ]},
      { level: 3, name: 'Conversations', cards: [
        { front: 'Where are you from?', back: '어디에서 오셨어요?', pronunciation: '(eo-di-e-seo o-syeos-seo-yo?)' },
        { front: 'I love Korean food', back: '한국 음식을 좋아해요', pronunciation: '(han-guk eum-sig-eul jo-a-hae-yo)' },
        { front: 'What do you do for fun?', back: '취미가 뭐예요?', pronunciation: '(chwi-mi-ga mwo-ye-yo?)' }
      ]}
    ],
    kannada: [
      { level: 1, name: 'Basics', cards: [
        { front: 'Hello', back: 'ನಮಸ್ಕಾರ', pronunciation: '(na-mas-kaa-ra)' },
        { front: 'Morning', back: 'ಮುಂಜಾನೆ', pronunciation: '(mun-jaa-ne)' },
        { front: 'Evening', back: 'ಸಂಜೆ', pronunciation: '(san-je)' },
        { front: 'Earth', back: 'ಭೂಮಿ', pronunciation: '(bhoo-mi)' },
        { front: 'Air', back: 'ಗಾಳಿ', pronunciation: '(gaa-li)' },
        { front: 'Fire', back: 'ಬೆಂಕಿ', pronunciation: '(ben-ki)' }
      ]},
      { level: 2, name: 'Phrases', cards: [
        { front: 'How are you?', back: 'ಹೇಗಿದ್ದೀರಾ?', pronunciation: '(he-gid-dee-ra?)' },
        { front: 'I am fine', back: 'ನಾನು ಆರಾಮವಾಗಿದ್ದೇನೆ', pronunciation: '(naa-nu aa-raa-ma-vaa-gi-dee-ne)' },
        { front: 'What is your name?', back: 'ನಿಮ್ಮ ಹೆಸರೇನು?', pronunciation: '(nim-ma he-sa-re-nu?)' },
        { front: 'Come here', back: 'ಇಲ್ಲಿ ಬಾ', pronunciation: '(il-li baa)' }
      ]},
      { level: 3, name: 'Sentences', cards: [
        { front: 'I love Kannada language', back: 'ನನಗೆ ಕನ್ನಡ ಭಾಷೆ ಇಷ್ಟ', pronunciation: '(na-na-ge kan-na-da bhaa-she ish-ta)' },
        { front: 'Which city is this?', back: 'ಇದು ಯಾವ ಊರು?', pronunciation: '(i-du yaa-va oo-ru?)' },
        { front: 'Where is my friend?', back: 'ನನ್ನ ಗೆಳೆಯ ಎಲ್ಲಿದ್ದಾನೆ?', pronunciation: '(nan-na ge-le-ya el-lid-daa-ne?)' }
      ]}
    ],
    sanskrit: [
      { level: 1, name: 'Basics', cards: [
        { front: 'Hello', back: 'नमः', pronunciation: '(na-mah)' },
        { front: 'Knowledge', back: 'ज्ञानम्', pronunciation: '(jnyaa-nam)' },
        { front: 'Truth', back: 'सत्यम्', pronunciation: '(sat-yam)' },
        { front: 'Peace', back: 'शान्तिः', pronunciation: '(shaan-tih)' },
        { front: 'Light', back: 'ज्योतिः', pronunciation: '(jyo-tih)' },
        { front: 'Action', back: 'कर्म', pronunciation: '(kar-ma)' }
      ]},
      { level: 2, name: 'Phrases', cards: [
        { front: 'All are well', back: 'सर्वे सन्तु निरामयाः', pronunciation: '(sarve santu ni-ra-ma-yah)' },
        { front: 'Victory to India', back: 'जयतु भारतम्', pronunciation: '(ja-ya-tu bhaa-ra-tam)' },
        { front: 'Work is worship', back: 'कर्म एव पूजा अस्ति', pronunciation: '(kar-ma e-va poo-jaa as-ti)' }
      ]},
      { level: 3, name: 'Sentences', cards: [
        { front: 'God is everywhere', back: 'ईश्वरः सर्वत्र अस्ति', pronunciation: '(eesh-va-rah sar-va-tra as-ti)' },
        { front: 'Knowledge is power', back: 'ज्ञानम् बलम् अस्ति', pronunciation: '(jnyaa-nam ba-lam as-ti)' },
        { front: 'Speak the truth', back: 'सत्यं वद', pronunciation: '(sat-yam va-da)' }
      ]}
    ],
    chinese: [
      { level: 1, name: 'Basics', cards: [
        { front: 'Hello', back: '你好', pronunciation: '(nǐ hǎo)' },
        { front: 'Good', back: '好', pronunciation: '(hǎo)' },
        { front: 'Friend', back: '朋友', pronunciation: '(péng yǒu)' },
        { front: 'Teacher', back: '老师', pronunciation: '(lǎo shī)' },
        { front: 'Student', back: '学生', pronunciation: '(xu xué sheng)' },
        { front: 'School', back: '学校', pronunciation: '(xué xiào)' }
      ]},
      { level: 2, name: 'Greetings', cards: [
        { front: 'How are you?', back: '你好吗？', pronunciation: '(nǐ hǎo ma?)' },
        { front: 'I am fine', back: '我很好', pronunciation: '(wǒ hěn hǎo)' },
        { front: 'See you again', back: '再见', pronunciation: '(zài jiàn)' }
      ]},
      { level: 3, name: 'Sentences', cards: [
        { front: 'I am happy to meet you', back: '很高兴见到你', pronunciation: '(hěn gāo xìng jiàn dào nǐ)' },
        { front: 'Do you speak Chinese?', back: '你会说中文吗？', pronunciation: '(nǐ huì shuō zhōng wén ma?)' },
        { front: 'This is beautiful', back: '这很漂亮', pronunciation: '(zhè hěn piào liang)' }
      ]}
    ],
    italian: [
      { level: 1, name: 'Basics', cards: [
        { front: 'Hello', back: 'Ciao', pronunciation: '(chow)' },
        { front: 'Love', back: 'Amore', pronunciation: '(ah-moh-reh)' },
        { front: 'Please', back: 'Per favore', pronunciation: '(per fa-voh-reh)' },
        { front: 'Life', back: 'Vita', pronunciation: '(vee-tah)' },
        { front: 'House', back: 'Casa', pronunciation: '(kah-sah)' },
        { front: 'Time', back: 'Tempo', pronunciation: '(tem-poh)' }
      ]},
      { level: 2, name: 'Food', cards: [
        { front: 'One pizza please', back: 'Una pizza per favore', pronunciation: '(oo-nah peet-zah per fa-voh-reh)' },
        { front: 'The wine is good', back: 'Il vino è buono', pronunciation: '(eel vee-no eh bwo-no)' },
        { front: 'I like pasta', back: 'Mi piace la pasta', pronunciation: '(mee pyah-cheh lah pah-stah)' }
      ]},
      { level: 3, name: 'Travel', cards: [
        { front: 'Where is the train station?', back: 'Dov\'è la stazione?', pronunciation: '(dov-eh lah sta-tzee-oh-neh)' },
        { front: 'I would like more water', back: 'Vorrei più acqua', pronunciation: '(vor-rey pyoo ak-kwah)' },
        { front: 'I am in Italy', back: 'In Italia sono', pronunciation: '(een ee-tah-lyah soh-no)' }
      ]}
    ],
    tamil: [
      { level: 1, name: 'Basics', cards: [
        { front: 'Hello', back: 'வணக்கம்', pronunciation: '(va-nak-kam)' },
        { front: 'Mother', back: 'அம்மா', pronunciation: '(am-ma)' },
        { front: 'Father', back: 'அப்பா', pronunciation: '(ap-pa)' },
        { front: 'Water', back: 'தண்ணீர்', pronunciation: '(than-neer)' },
        { front: 'Book', back: 'புத்தகம்', pronunciation: '(puth-tha-gam)' },
        { front: 'Friend', back: 'நண்பன்', pronunciation: '(nan-ban)' },
        { front: 'Student', back: 'மாணவன்', pronunciation: '(maa-na-van)' }
      ]},
      { level: 2, name: 'Phrases', cards: [
        { front: 'How are you?', back: 'எப்படி இருக்கீங்க?', pronunciation: '(ep-pa-di iruk-keeng-ga?)' },
        { front: 'My name is...', back: 'என் பெயர்...', pronunciation: '(en pe-yar...)' },
        { front: 'Thank you', back: 'நன்றி', pronunciation: '(nan-ri)' },
        { front: 'I am hungry', back: 'எனக்கு பசிக்கிறது', pronunciation: '(e-nak-ku pa-si-kki-ra-dhu)' },
        { front: 'What is the time?', back: 'மணி என்ன?', pronunciation: '(ma-ni en-na?)' }
      ]},
      { level: 3, name: 'Conversations', cards: [
        { front: 'What is your name?', back: 'உங்க பெயர் என்ன?', pronunciation: '(un-ga pe-yar en-na?)' },
        { front: 'I am learning Tamil', back: 'நான் தமிழ் கற்கிறேன்', pronunciation: '(naan tha-mizh kar-ki-ren)' },
        { front: 'Do you speak English?', back: 'நீங்க ஆங்கிலம் பேசுவீங்களா?', pronunciation: '(neeng-ga aan-gi-lam pe-su-veeng-ga-la?)' },
        { front: 'Where is the hospital?', back: 'மருத்துவமனை எங்கே இருக்கிறது?', pronunciation: '(ma-ruth-thu-va-ma-nai en-ge iruk-ki-radhu?)' }
      ]}
    ],
    telugu: [
      { level: 1, name: 'Basics', cards: [
        { front: 'Hello', back: 'నమస్కారం', pronunciation: '(na-mas-kaa-ram)' },
        { front: 'Mother', back: 'అమ్మ', pronunciation: '(am-ma)' },
        { front: 'Father', back: 'నాన్న', pronunciation: '(naan-na)' },
        { front: 'Water', back: 'నీళ్లు', pronunciation: '(neel-lu)' },
        { front: 'Book', back: 'పుస్తకం', pronunciation: '(pus-tha-kam)' },
        { front: 'Friend', back: 'స్నేహితుడు', pronunciation: '(sne-hi-thu-du)' },
        { front: 'Sun', back: 'సూర్యుడు', pronunciation: '(soo-ryu-du)' }
      ]},
      { level: 2, name: 'Phrases', cards: [
        { front: 'How are you?', back: 'ఎలా ఉన్నారు?', pronunciation: '(e-laa un-naa-ru?)' },
        { front: 'My name is...', back: 'నా పేరు...', pronunciation: '(naa pe-ru...)' },
        { front: 'Thank you', back: 'ధన్యవాదాలు', pronunciation: '(dha-nya-vaa-daa-lu)' },
        { front: 'I am hungry', back: 'నాకు ఆకలిగా ఉంది', pronunciation: '(naa-ku aa-ka-li-gaa un-di)' },
        { front: 'What is the time?', back: 'సమయం ఎంత?', pronunciation: '(sa-ma-yam en-tha?)' }
      ]},
      { level: 3, name: 'Conversations', cards: [
        { front: 'What is your name?', back: 'మీ పేరు ఏమిటి?', pronunciation: '(mee pe-ru e-mi-ti?)' },
        { front: 'I am learning Telugu', back: 'నేను తెలుగు నేర్చుకుంటున్నాను', pronunciation: '(ne-nu te-lu-gu ner-chu-kun-tun-naa-nu)' },
        { front: 'I like this place', back: 'నాకు ఈ స్థలం ఇష్టం', pronunciation: '(naa-ku ee stha-lam ish-tam)' },
        { front: 'Where is the market?', back: 'మార్కెట్ ఎక్కడ ఉంది?', pronunciation: '(maar-ket ek-ka-da un-di?)' }
      ]}
    ],
    malayalam: [
      { level: 1, name: 'Basics', cards: [
        { front: 'Hello', back: 'നമസ്കാരം', pronunciation: '(na-mas-kaa-ram)' },
        { front: 'Mother', back: 'അമ്മ', pronunciation: '(am-ma)' },
        { front: 'Father', back: 'അച്ഛൻ', pronunciation: '(ac-chan)' },
        { front: 'Water', back: 'വെള്ളം', pronunciation: '(vel-lam)' },
        { front: 'Friend', back: 'കൂട്ടുകാരൻ', pronunciation: '(koot-tu-kaa-ran)' },
        { front: 'House', back: 'വീട്', pronunciation: '(vee-du)' }
      ]},
      { level: 2, name: 'Phrases', cards: [
        { front: 'How are you?', back: 'സുഖമാണോ?', pronunciation: '(su-kha-maa-no?)' },
        { front: 'My name is...', back: 'என்റെ പേര്...', pronunciation: '(en-te pe-ru...)' },
        { front: 'Thank you', back: 'നന്ദി', pronunciation: '(nan-ni)' },
        { front: 'I am fine', back: 'എനിക്ക് സുഖമാണ്', pronunciation: '(e-nik-ku su-kha-ma-nu)' },
        { front: 'Help me', back: 'എന്നെ സഹായിക്കൂ', pronunciation: '(en-ne sa-haa-yi-koo)' }
      ]},
      { level: 3, name: 'Conversations', cards: [
        { front: 'What is your name?', back: 'നിങ്ങളുടെ പേര് എന്താണ്?', pronunciation: '(nin-ga-lu-de pe-ru en-thaa-nu?)' },
        { front: 'I am learning Malayalam', back: 'ഞാൻ മലയാളം പഠിക്കുന്നു', pronunciation: '(njaan ma-la-yaa-lam pa-dik-kun-nu)' },
        { front: 'Where is the school?', back: 'സ്കൂൾ എവിടെയാണ്?', pronunciation: '(skool e-vi-de-yaa-nu?)' },
        { front: 'I love Kerala', back: 'എനിക്ക് കേരളം ഇഷ്ടമാണ്', pronunciation: '(e-nik-ku ke-ra-lam ish-ta-maa-nu)' }
      ]}
    ]
  },

  lexlyState: {
    deck: [],
    currentIndex: 0,
    isFlipped: false,
    deckName: '',
    currentLevel: 1,
    testState: {
      questions: [],
      currentQuestionIndex: 0,
      score: 0
    }
  },

  showLexlyLevels(lang) {
    const levels = this.lexlyDecks[lang];
    if (!levels) return;

    this.lexlyState.deckName = lang;
    document.getElementById('lexly-categories').classList.add('hidden');
    document.getElementById('lexly-flashcards').classList.add('hidden');
    document.getElementById('lexly-complete').classList.add('hidden');
    document.getElementById('lexly-levels').classList.remove('hidden');
    document.getElementById('lexly-test').classList.add('hidden');
    document.getElementById('lexly-level-title').innerText = `${lang.charAt(0).toUpperCase() + lang.slice(1)} Levels`;

    const grid = document.getElementById('levels-grid');
    grid.innerHTML = '';

    levels.forEach(l => {
      const card = document.createElement('div');
      card.className = 'lexly-lang-card';
      card.onclick = () => this.loadLexlyDeck(lang, l.level);
      card.innerHTML = `
        <div style="font-size: 2.5rem; margin-bottom: 10px;">${l.level === 1 ? '🌱' : l.level === 2 ? '🌿' : '🌳'}</div>
        <h4>Level ${l.level}: ${l.name}</h4>
        <p>${l.cards.length} Cards</p>
      `;
      grid.appendChild(card);
    });
  },

  loadLexlyDeck(lang, level = 1) {
    const levels = this.lexlyDecks[lang];
    const deckData = levels.find(l => l.level === level);
    if (!deckData) return;

    this.lexlyState.deck = deckData.cards;
    this.lexlyState.currentIndex = 0;
    this.lexlyState.isFlipped = false;
    this.lexlyState.currentLevel = level;

    document.getElementById('lexly-levels').classList.add('hidden');
    document.getElementById('lexly-flashcards').classList.remove('hidden');
    document.getElementById('lexly-controls').classList.add('hidden');

    this.renderLexlyCard();
  },

  renderLexlyCard() {
    const { deck, currentIndex } = this.lexlyState;
    const card = deck[currentIndex];
    const cardEl = document.getElementById('lexly-card');

    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    this.lexlyState.isFlipped = false;
    cardEl.classList.remove('is-flipped');
    document.getElementById('lexly-controls').classList.add('hidden');
    document.getElementById('lexly-pronouncer').classList.add('hidden');
    if(document.getElementById('lexly-pronoun-display')) {
        document.getElementById('lexly-pronoun-display').innerText = '';
    }

    document.getElementById('lexly-front-text').innerText = card.front;
    document.getElementById('lexly-back-text').innerText = card.back;
    if(document.getElementById('lexly-pronunciation')) {
        document.getElementById('lexly-pronunciation').innerText = card.pronunciation;
    }

    const progress = (currentIndex / deck.length) * 100;
    document.getElementById('lexly-progress').style.width = progress + '%';
  },

  flipLexlyCard() {
    const cardEl = document.getElementById('lexly-card');
    this.lexlyState.isFlipped = !this.lexlyState.isFlipped;
    cardEl.classList.toggle('is-flipped', this.lexlyState.isFlipped);

    if (this.lexlyState.isFlipped) {
      const card = this.lexlyState.deck[this.lexlyState.currentIndex];
      if(document.getElementById('lexly-pronoun-display')) {
        document.getElementById('lexly-pronoun-display').innerText = card.pronunciation;
      }
      document.getElementById('lexly-pronouncer').classList.remove('hidden');
      document.getElementById('lexly-controls').classList.remove('hidden');
      setTimeout(() => this.lexlySpeak('back'), 400);
    } else {
      document.getElementById('lexly-pronouncer').classList.add('hidden');
      document.getElementById('lexly-controls').classList.add('hidden');
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }
  },

  nextLexlyCard() {
    this.lexlyState.currentIndex++;
    if (this.lexlyState.currentIndex >= this.lexlyState.deck.length) {
      document.getElementById('lexly-flashcards').classList.add('hidden');
      document.getElementById('lexly-progress').style.width = '100%';
      document.getElementById('lexly-complete').classList.remove('hidden');
    } else {
      this.renderLexlyCard();
    }
  },

  // ── Lexly Test Engine ─────────────────────────────────────────────────────

  startLexlyTest(useAllLevels = false) {
    let testPool = [];
    
    if (useAllLevels) {
      // Aggregate all cards from all levels for the current language
      const langDecks = this.lexlyDecks[this.lexlyState.deckName];
      langDecks.forEach(lvl => {
        testPool = testPool.concat(lvl.cards);
      });
      // Store this pool as the "current deck" so wrong answers can be drawn from it
      this.lexlyState.deck = testPool;
    } else {
      // Use specifically the deck the user just finished
      testPool = this.lexlyState.deck;
    }

    if (testPool.length < 2) {
      alert("Practice a few more cards before taking the test!");
      return;
    }

    // Shuffle and pick up to 5 questions
    const shuffled = [...testPool].sort(() => 0.5 - Math.random());
    this.lexlyState.testState.questions = shuffled.slice(0, 5);
    this.lexlyState.testState.currentQuestionIndex = 0;
    this.lexlyState.testState.score = 0;

    document.getElementById('lexly-levels').classList.add('hidden');
    document.getElementById('lexly-complete').classList.add('hidden');
    document.getElementById('lexly-test').classList.remove('hidden');
    
    this.renderLexlyTestQuestion();
  },

  renderLexlyTestQuestion() {
    const ts = this.lexlyState.testState;
    const questionCard = ts.questions[ts.currentQuestionIndex];
    
    document.getElementById('lexly-test-badge').innerText = `Question ${ts.currentQuestionIndex + 1} of ${ts.questions.length}`;
    document.getElementById('lexly-test-question').innerText = `How do you say "${questionCard.front}"?`;
    document.getElementById('lexly-test-feedback').classList.add('hidden');

    // Create options (1 correct, 2-3 wrong)
    const optionsGrid = document.getElementById('lexly-test-options');
    optionsGrid.innerHTML = '';

    // Get random wrong answers from the same deck
    const wrongAnswers = this.lexlyState.deck
      .filter(c => c.back !== questionCard.back)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    const allOptions = [...wrongAnswers.map(c => c.back), questionCard.back].sort(() => 0.5 - Math.random());

    allOptions.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'btn secondary-btn quiz-btn';
      btn.style.margin = '0';
      btn.style.width = '100%';
      btn.innerText = opt;
      btn.onclick = () => this.checkLexlyTestAnswer(opt, questionCard.back);
      optionsGrid.appendChild(btn);
    });
  },

  checkLexlyTestAnswer(selected, correct) {
    const feedback = document.getElementById('lexly-test-feedback');
    const ts = this.lexlyState.testState;
    const isCorrect = selected === correct;

    if (isCorrect) {
      ts.score++;
      feedback.innerText = 'Correct! ✅';
      feedback.style.background = 'var(--success)';
      feedback.style.color = 'white';
    } else {
      feedback.innerText = `Incorrect ❌ (Correct: ${correct})`;
      feedback.style.background = 'var(--danger)';
      feedback.style.color = 'white';
    }
    feedback.classList.remove('hidden');

    // Disable buttons
    const btns = document.querySelectorAll('#lexly-test-options .quiz-btn');
    btns.forEach(b => b.disabled = true);

    setTimeout(() => {
      ts.currentQuestionIndex++;
      if (ts.currentQuestionIndex >= ts.questions.length) {
        alert(`Test Finished! You scored ${ts.score} out of ${ts.questions.length}.`);
        this.exitLexly();
        this.checkBadges(); 
      } else {
        this.renderLexlyTestQuestion();
      }
    }, 1500);
  },

  checkBadges() {
    let changed = false;
    const stats = {
      journalCount: this.journalEntries.length,
      highLexlyScore: this.lexlyState.testState.score === 5 && this.lexlyState.testState.currentQuestionIndex >= 4,
      gratitudeSaved: !!localStorage.getItem('gratitude_history')
    };

    this.badges.forEach(b => {
      if (!b.unlocked) {
        if (b.id === 'starter' && stats.journalCount > 0) { b.unlocked = true; changed = true; }
        if (b.id === 'lexly_master' && stats.highLexlyScore) { b.unlocked = true; changed = true; }
        if (b.id === 'gratitude' && stats.gratitudeSaved) { b.unlocked = true; changed = true; }
        if (b.id === 'zen' && this.activeScreen === 'breathe' && this.breatheInterval) { b.unlocked = true; changed = true; }
      }
    });

    if (this.activeScreen === 'badges' || changed) {
       this.renderBadges();
    }
  },

  renderBadges() {
    const container = document.getElementById('badges-container');
    if (!container) return;
    
    container.innerHTML = '';
    this.badges.forEach(b => {
      const card = document.createElement('div');
      card.className = `badge-card ${b.unlocked ? 'unlocked' : 'locked'}`;
      card.innerHTML = `
        <div class="badge-icon">${b.icon}</div>
        <div class="badge-name">${b.name}</div>
        <div class="badge-desc">${b.desc}</div>
      `;
      container.appendChild(card);
    });
  },

  exitLexly() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    document.getElementById('lexly-flashcards').classList.add('hidden');
    document.getElementById('lexly-levels').classList.add('hidden');
    document.getElementById('lexly-complete').classList.add('hidden');
    document.getElementById('lexly-test').classList.add('hidden');
    document.getElementById('lexly-categories').classList.remove('hidden');
    document.getElementById('lexly-progress').style.width = '0%';
  },

  // BCP-47 locale codes per language
  lexlyLocales: {
    spanish:  'es-ES',
    french:   'fr-FR',
    japanese: 'ja-JP',
    chinese:  'zh-CN',
    hindi:    'hi-IN',
    korean:   'ko-KR',
    kannada:  'kn-IN',
    sanskrit: 'hi-IN',   // closest available locale
    italian:  'it-IT',
    tamil:    'ta-IN',
    telugu:   'te-IN',
    malayalam: 'ml-IN'
  },

  lexlySpeak(face) {
    if (!('speechSynthesis' in window)) {
      alert('Sorry, your browser does not support text-to-speech.');
      return;
    }
    window.speechSynthesis.cancel();

    const card   = this.lexlyState.deck[this.lexlyState.currentIndex];
    const lang   = this.lexlyState.deckName;
    const locale = this.lexlyLocales[lang] || 'en-US';
    const text   = face === 'front' ? card.front : card.back;
    const useLang = face === 'front' ? 'en-US' : locale;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang  = useLang;
    utterance.rate  = 0.82;
    utterance.pitch = 1.1;

    // Try to find a matching voice
    const voices = window.speechSynthesis.getVoices();
    const match  = voices.find(v => v.lang.startsWith(useLang.split('-')[0]));
    if (match) utterance.voice = match;

    // Animate the speak button while speaking
    const btnId = face === 'front' ? 'lexly-speak-front' : null;
    const btn   = btnId ? document.getElementById(btnId) : document.querySelector('.speak-target');
    if (btn) {
      btn.classList.add('speaking');
      utterance.onend   = () => btn.classList.remove('speaking');
      utterance.onerror = () => btn.classList.remove('speaking');
    }

    window.speechSynthesis.speak(utterance);
  },

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
          .then(res => console.log('SW Registered', res))
          .catch(err => console.log('SW Registration Failed', err));
      });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
