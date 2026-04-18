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
  
  init() {
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
      { front: 'Hello',        back: 'Hola',          pronunciation: '(oh-lah)' },
      { front: 'Thank you',    back: 'Gracias',        pronunciation: '(gra-see-as)' },
      { front: 'Please',       back: 'Por favor',      pronunciation: '(por fah-vor)' },
      { front: 'Good morning', back: 'Buenos días',    pronunciation: '(bweh-nos dee-as)' },
      { front: 'Goodbye',      back: 'Adiós',          pronunciation: '(ah-dee-os)' },
      { front: 'Friend',       back: 'Amigo',          pronunciation: '(ah-mee-go)' },
      { front: 'I love you',   back: 'Te quiero',      pronunciation: '(teh kyeh-ro)' },
      { front: 'Beautiful',    back: 'Hermoso',        pronunciation: '(er-moh-so)' },
    ],
    french: [
      { front: 'Hello',        back: 'Bonjour',        pronunciation: '(bon-zhoor)' },
      { front: 'Thank you',    back: 'Merci',          pronunciation: '(mehr-see)' },
      { front: 'Please',       back: "S'il vous plaît",pronunciation: "(seel voo pleh)" },
      { front: 'Good night',   back: 'Bonne nuit',     pronunciation: '(bon nwee)' },
      { front: 'Goodbye',      back: 'Au revoir',      pronunciation: '(oh ruh-vwah)' },
      { front: 'Friend',       back: 'Ami',            pronunciation: '(ah-mee)' },
      { front: 'I love you',   back: "Je t'aime",      pronunciation: "(zhuh tem)" },
      { front: 'Beautiful',    back: 'Beau',           pronunciation: '(boh)' },
    ],
    japanese: [
      { front: 'Hello',        back: 'こんにちは',      pronunciation: '(kon-ni-chi-wa)' },
      { front: 'Thank you',    back: 'ありがとう',      pronunciation: '(a-ri-ga-toh)' },
      { front: 'Please',       back: 'おねがいします',  pronunciation: '(o-ne-gai-shi-mas)' },
      { front: 'Good morning', back: 'おはよう',        pronunciation: '(o-ha-yoh)' },
      { front: 'Goodbye',      back: 'さようなら',      pronunciation: '(sa-yo-na-ra)' },
      { front: 'Friend',       back: '友達',            pronunciation: '(to-mo-da-chi)' },
      { front: 'I love you',   back: '愛してる',        pronunciation: '(ai-shi-te-ru)' },
      { front: 'Beautiful',    back: '美しい',          pronunciation: '(u-tsu-ku-shi-i)' },
    ],
    chinese: [
      { front: 'Hello',        back: '你好',            pronunciation: '(nǐ hǎo)' },
      { front: 'Thank you',    back: '谢谢',            pronunciation: '(xiè xiè)' },
      { front: 'Please',       back: '请',              pronunciation: '(qǐng)' },
      { front: 'Good morning', back: '早上好',          pronunciation: '(zǎo shang hǎo)' },
      { front: 'Goodbye',      back: '再见',            pronunciation: '(zài jiàn)' },
      { front: 'Friend',       back: '朋友',            pronunciation: '(péng yǒu)' },
      { front: 'I love you',   back: '我爱你',          pronunciation: '(wǒ ài nǐ)' },
      { front: 'Beautiful',    back: '美丽',            pronunciation: '(měi lì)' },
    ],
    hindi: [
      { front: 'Hello',        back: 'नमस्ते',          pronunciation: '(na-mas-tay)' },
      { front: 'Thank you',    back: 'धन्यवाद',         pronunciation: '(dhan-ya-vaad)' },
      { front: 'Please',       back: 'कृपया',           pronunciation: '(krip-ya)' },
      { front: 'Good morning', back: 'सुप्रभात',         pronunciation: '(su-pra-bhaat)' },
      { front: 'Goodbye',      back: 'अलविदा',          pronunciation: '(al-vi-daa)' },
      { front: 'Friend',       back: 'दोस्त',           pronunciation: '(dost)' },
      { front: 'I love you',   back: 'मैं तुमसे प्यार करता हूँ', pronunciation: '(main tumse pyaar karta hoon)' },
      { front: 'Beautiful',    back: 'सुंदर',           pronunciation: '(sun-dar)' },
    ],
    korean: [
      { front: 'Hello',        back: '안녕하세요',       pronunciation: '(an-nyeong-ha-se-yo)' },
      { front: 'Thank you',    back: '감사합니다',       pronunciation: '(gam-sa-ham-ni-da)' },
      { front: 'Please',       back: '주세요',           pronunciation: '(ju-se-yo)' },
      { front: 'Good morning', back: '좋은 아침',        pronunciation: '(jo-eun a-chim)' },
      { front: 'Goodbye',      back: '안녕히 가세요',    pronunciation: '(an-nyeong-hi ga-se-yo)' },
      { front: 'Friend',       back: '친구',             pronunciation: '(chin-gu)' },
      { front: 'I love you',   back: '사랑해요',         pronunciation: '(sa-rang-hae-yo)' },
      { front: 'Beautiful',    back: '아름다운',         pronunciation: '(a-reum-da-un)' },
    ],
    kannada: [
      { front: 'Hello',        back: 'ನಮಸ್ಕಾರ',         pronunciation: '(na-mas-kaa-ra)' },
      { front: 'Thank you',    back: 'ಧನ್ಯವಾದ',          pronunciation: '(dhan-ya-vaad-a)' },
      { front: 'Please',       back: 'ದಯವಿಟ್ಟು',          pronunciation: '(da-ya-vit-tu)' },
      { front: 'Good morning', back: 'ಶುಭ ಮುಂಜಾನೆ',      pronunciation: '(shu-bha mun-jaa-ne)' },
      { front: 'Goodbye',      back: 'ವಿದಾಯ',            pronunciation: '(vi-daa-ya)' },
      { front: 'Friend',       back: 'ಗೆಳೆಯ',             pronunciation: '(ge-le-ya)' },
      { front: 'I love you',   back: 'ನಾನು ನಿನ್ನನ್ನು ಪ್ರೀತಿಸುತ್ತೇನೆ', pronunciation: '(naa-nu nin-nan-nu pree-ti-sut-tee-ne)' },
      { front: 'Beautiful',    back: 'ಸುಂದರ',            pronunciation: '(sun-da-ra)' },
    ],
    sanskrit: [
      { front: 'Hello',        back: 'नमः',              pronunciation: '(na-mah)' },
      { front: 'Thank you',    back: 'धन्यवादः',          pronunciation: '(dhan-ya-vaa-dah)' },
      { front: 'Please',       back: 'कृपया',             pronunciation: '(krip-ya-yaa)' },
      { front: 'Good morning', back: 'सुप्रभातम्',         pronunciation: '(su-pra-bhaa-tam)' },
      { front: 'Goodbye',      back: 'पुनर्मिलाम',         pronunciation: '(pu-nar-mi-laa-mah)' },
      { front: 'Friend',       back: 'मित्रम्',            pronunciation: '(mi-tram)' },
      { front: 'I love you',   back: 'अहं त्वां प्रेमि',  pronunciation: '(aham tvaam premi)' },
      { front: 'Beautiful',    back: 'सुन्दरम्',           pronunciation: '(sun-da-ram)' },
    ],
    italian: [
      { front: 'Hello',        back: 'Ciao',              pronunciation: '(chow)' },
      { front: 'Thank you',    back: 'Grazie',            pronunciation: '(grat-tsee-eh)' },
      { front: 'Please',       back: 'Per favore',        pronunciation: '(per fa-voh-reh)' },
      { front: 'Good morning', back: 'Buongiorno',        pronunciation: '(bwon-jor-noh)' },
      { front: 'Goodbye',      back: 'Arrivederci',       pronunciation: '(a-ree-veh-der-chee)' },
      { front: 'Friend',       back: 'Amico',             pronunciation: '(a-mee-koh)' },
      { front: 'I love you',   back: 'Ti amo',            pronunciation: '(tee ah-moh)' },
      { front: 'Beautiful',    back: 'Bello',             pronunciation: '(bel-loh)' },
    ],
  },

  lexlyState: {
    deck: [],
    currentIndex: 0,
    isFlipped: false,
    deckName: '',
  },

  loadLexlyDeck(lang) {
    const deck = this.lexlyDecks[lang];
    if (!deck) return;

    this.lexlyState.deck = deck;
    this.lexlyState.currentIndex = 0;
    this.lexlyState.isFlipped = false;
    this.lexlyState.deckName = lang;

    document.getElementById('lexly-categories').classList.add('hidden');
    document.getElementById('lexly-complete').classList.add('hidden');
    document.getElementById('lexly-flashcards').classList.remove('hidden');
    document.getElementById('lexly-controls').classList.add('hidden');

    this.renderLexlyCard();
  },

  renderLexlyCard() {
    const { deck, currentIndex } = this.lexlyState;
    const card = deck[currentIndex];
    const cardEl = document.getElementById('lexly-card');

    // Cancel any ongoing speech
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    // Reset flip state
    this.lexlyState.isFlipped = false;
    cardEl.classList.remove('is-flipped');
    document.getElementById('lexly-controls').classList.add('hidden');
    document.getElementById('lexly-pronouncer').classList.add('hidden');
    document.getElementById('lexly-pronoun-display').innerText = '';

    // Populate card faces
    document.getElementById('lexly-front-text').innerText = card.front;
    document.getElementById('lexly-back-text').innerText = card.back;
    document.getElementById('lexly-pronunciation').innerText = card.pronunciation;

    // Update progress bar
    const progress = ((currentIndex) / deck.length) * 100;
    document.getElementById('lexly-progress').style.width = progress + '%';
  },

  flipLexlyCard() {
    const cardEl = document.getElementById('lexly-card');
    this.lexlyState.isFlipped = !this.lexlyState.isFlipped;
    cardEl.classList.toggle('is-flipped', this.lexlyState.isFlipped);

    if (this.lexlyState.isFlipped) {
      // Show pronunciation guide
      const card = this.lexlyState.deck[this.lexlyState.currentIndex];
      document.getElementById('lexly-pronoun-display').innerText = card.pronunciation;
      document.getElementById('lexly-pronouncer').classList.remove('hidden');
      document.getElementById('lexly-controls').classList.remove('hidden');
      // Auto-speak the translated word
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
      // Show completion screen
      document.getElementById('lexly-flashcards').classList.add('hidden');
      document.getElementById('lexly-progress').style.width = '100%';
      document.getElementById('lexly-complete').classList.remove('hidden');
    } else {
      this.renderLexlyCard();
    }
  },

  exitLexly() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    document.getElementById('lexly-flashcards').classList.add('hidden');
    document.getElementById('lexly-complete').classList.add('hidden');
    document.getElementById('lexly-pronouncer').classList.add('hidden');
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
