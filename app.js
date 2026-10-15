(() => {
  const form = document.querySelector('#decision-form');
  const input = document.querySelector('#decision-input');
  const counter = document.querySelector('#char-count');
  const results = document.querySelector('#results');
  const concernButtons = [...document.querySelectorAll('[data-concern]')];
  const examples = [...document.querySelectorAll('[data-example]')];
  const arDigits = new Intl.NumberFormat('ar');
  let selectedConcern = 'unknown';

  const lens = {
    unknown: {
      forwardWeek: 'إذا كانت الخطوة هي «{decision}»، فربما لا تحتاج إلى إجابة نهائية هذا الأسبوع. تحتاج إلى معلومة واحدة تجعل الاحتمال أقل ضبابية.',
      forwardLater: 'قد لا تضمن النتيجة، لكنك ستكون قد استبدلت بعض التخمين بتجربة حقيقية. اسأل: ما الإشارة الصغيرة التي ستقول لي إن هذا الاتجاه يستحق المتابعة؟',
      waitWeek: 'الانتظار قد يمنحك هدوءًا مفيدًا. سمِّ بالضبط ما الذي تنتظر معرفته، حتى لا يتحول الغموض نفسه إلى سبب للتأجيل.',
      waitLater: 'إذا لم يظهر شيء جديد، قد يبقى السؤال كما هو. ضع موعدًا لمراجعته ومعيارًا واحدًا يساعدك على المقارنة.',
      micro: 'اختبر المجهول بسؤال',
      microCopy: 'تواصل مع شخص خاض تجربة قريبة، واسأله سؤالًا واحدًا عن يومه العادي فيها — لا عن أفضل وأسوأ ما حدث فقط.'
    },
    security: {
      forwardWeek: 'بالنسبة إلى «{decision}»، لا يلزم أن تتخلّى عن الأمان لتعرف المزيد. هذا الأسبوع، حدد ما الذي تريد حمايته قبل أن تختبر أي خطوة.',
      forwardLater: 'قد تكتشف أن هناك صيغة أهدأ من القفز الكامل: حدّ زمني أو مالي أو دعم واضح. النجاح هنا ليس الاندفاع؛ بل أن تتعلم من دون أن تتجاوز حدودك.',
      waitWeek: 'قد يكون التريث حماية حكيمة، لا خوفًا. اكتب الحد الأدنى من الأمان الذي تحتاجه كي تصبح التجربة ممكنة.',
      waitLater: 'إذا ظل شرط الأمان غير محدد، قد يبقى الانتظار مفتوحًا. حوّله إلى معيار ملموس تعود إليه بدل سؤال عام: «هل أنا جاهز؟».',
      micro: 'عرّف حدّ الأمان أولًا',
      microCopy: 'اكتب شرطًا واحدًا لا تتنازل عنه (وقت، مبلغ، دعم أو موعد مراجعة)، ثم اختبر خطوة صغيرة داخله فقط.'
    },
    time: {
      forwardWeek: 'إذا كانت «{decision}» تبدو أكبر من وقتك، جرّب أن تقلّصها. ما الذي يمكن إنجازه في ٢٥ دقيقة من دون التزام بما بعدها؟',
      forwardLater: 'خطوات قصيرة ومتكررة قد تعطيك دليلًا أفضل من انتظار أسبوع مثالي. راقب هل تستحق الفكرة وقتًا إضافيًا فعلًا.',
      waitWeek: 'ربما جدولك مزدحم حقًا. ميّز بين «لا أستطيع الآن» و«لا أجد لها مكانًا» — الفرق بينهما يغيّر خطوتك التالية.',
      waitLater: 'إن لم يُحجز وقت للقرار، قد يُزاحمك شيء آخر كل مرة. موعد واحد واضح للمراجعة أصدق من «لاحقًا».',
      micro: 'جرّب جلسة واحدة قصيرة',
      microCopy: 'احجز ٢٥ دقيقة فقط للفعل المرتبط بقرارك. ضع مؤقتًا، وتوقف بعده حتى لو كان بإمكانك الاستمرار.'
    },
    regret: {
      forwardWeek: 'حين تفكر في «{decision}»، جرّب أن تسأل نفسك: أي ندم أخفّ عليك — تجربة صغيرة لم تنجح، أم ألا تعرف ماذا كان سيحدث؟',
      forwardLater: 'التجربة لا تزيل احتمال الندم، لكنها تمنحك سياقًا تستند إليه. حدّد مسبقًا ما الذي ستعتبره تعلّمًا، حتى لو لم تكمل.',
      waitWeek: 'التريث قد يمنع قرارًا متسرعًا. وفي الوقت نفسه، انتبه: أهو انتظار لمعلومة ناقصة، أم محاولة للحصول على ضمان كامل؟',
      waitLater: 'قد يبقى بعض الندم في كلا المسارين. المهم أن يكون التأجيل اختيارًا له سبب وموعد، لا ردّة فعل لا تنتهي.',
      micro: 'اكتب تعريفك للنجاح',
      microCopy: 'دوّن جملة تكمل بها: «سأكون راضيًا عن التجربة حتى لو لم تنجح، إذا تعلّمت…». هذا يخفف ضغط النتيجة.'
    },
    others: {
      forwardWeek: 'في «{decision}»، قد تظهر آراء كثيرة، لكنها لا تعيش تبعات القرار بالنيابة عنك. افصل نصيحة من يهمك عن توقّعك لما سيقوله الجميع.',
      forwardLater: 'الخطوة الصغيرة قد توضح لك أي صوت يحمل معلومة وأيّها يحمل ضغطًا. استمع باهتمام من دون أن تسلّم المقود.',
      waitWeek: 'أحيانًا تحتاج إلى سماع شخص تثق به. اختر رأيًا محددًا تطلبه، بدل أن تجمع آراء بلا نهاية.',
      waitLater: 'إذا صار رضا الآخرين شرطًا لا يمكن تحقيقه، قد يصعب أن تجد جوابًا. اكتب من سيتأثر فعلًا، وما الذي يبقى اختيارك.',
      micro: 'اختر محادثة واحدة صادقة',
      microCopy: 'شارك الفكرة مع شخص تثق به وقل له ما الذي تحتاجه تحديدًا: سؤالًا صعبًا، أم استماعًا بلا حكم؟'
    },
    money: {
      forwardWeek: 'إذا كان ثمن «{decision}» يوقفك، افصل تكلفة الاستكشاف عن تكلفة الالتزام الكامل. قد تستطيع جمع معلومة مهمة بكلفة صغيرة جدًا.',
      forwardLater: 'ميزانية اختبار محدودة قد تكشف إن كان للاستثمار الأكبر ما يبرره. ضع حدًا للخسارة قبل البداية، لا بعد أن تتعلق بالنتيجة.',
      waitWeek: 'قد تكون الحسابات سببًا وجيهًا للتأني. حاول أن تكتب ما تعرفه بالأرقام وما لا يزال مجرد تقدير أو خوف.',
      waitLater: 'الأرقام الناقصة نادرًا ما تظهر وحدها. موعد قصير لجمع رقم أو عرض سعر قد يجعل الانتظار خطوة فاعلة.',
      micro: 'ضع سقفًا لتجربة صغيرة',
      microCopy: 'حدّد مبلغًا صغيرًا لا يتجاوز ميزانيتك وتستطيع تحمّل خسارته، أو اختبر الفكرة أولًا بلا إنفاق. لا تلتزم بما لا يناسب ظروفك.'
    }
  };

  function updateCounter() {
    counter.textContent = `${arDigits.format(input.value.length)} / ١٨٠`;
  }

  function clean(value) {
    return value.replace(/[<>\u0000-\u001F]/g, '').replace(/\s+/g, ' ').trim();
  }

  function put(id, text) {
    document.getElementById(id).textContent = text;
  }

  function makeSummary() {
    const decision = clean(input.value);
    return [
      `مسافة — محاكاة تفكير لقرار: ${decision}`,
      `بعد أسبوع، لو بدأت بخطوة صغيرة: ${document.querySelector('#forward-week').textContent}`,
      `لو انتظرت: ${document.querySelector('#wait-week').textContent}`,
      `تجربتي الصغيرة: ${document.querySelector('#micro-copy').textContent}`,
      'هذه تمرين تأملي عام وليست نصيحة مهنية أو مالية أو علاجية.'
    ].join('\n\n');
  }

  input.addEventListener('input', updateCounter);

  examples.forEach((button) => button.addEventListener('click', () => {
    input.value = button.dataset.example;
    updateCounter();
    input.focus();
  }));

  concernButtons.forEach((button) => button.addEventListener('click', () => {
    concernButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    selectedConcern = button.dataset.concern;
  }));

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const decision = clean(input.value);
    let error = document.querySelector('#form-error');
    if (!error) {
      error = document.createElement('p');
      error.id = 'form-error';
      error.className = 'form-error';
      error.setAttribute('role', 'alert');
      form.querySelector('.textarea-wrap').after(error);
    }
    if (!decision) {
      error.textContent = 'اكتب جملة واحدة عن القرار الذي يشغلك، ثم نبدأ من هناك.';
      input.focus();
      return;
    }
    error.textContent = '';
    const chosen = lens[selectedConcern] || lens.unknown;
    const personalize = (template) => template.replaceAll('{decision}', decision);
    put('result-decision', 'الفكرة التي وضعتها في الإطار: ' + decision);
    put('forward-week', personalize(chosen.forwardWeek));
    put('forward-later', personalize(chosen.forwardLater));
    put('wait-week', personalize(chosen.waitWeek));
    put('wait-later', personalize(chosen.waitLater));
    put('future-letter', 'إلى نفسي: لم أكن بحاجة إلى ضمان النتيجة. كنت بحاجة إلى تجربة صغيرة تكشف لي أكثر مما يفعله التفكير الدائري. حتى لو غيّرت رأيي بعدها، ستكون تلك معرفة أملكها الآن.');
    put('micro-title', chosen.micro);
    put('micro-copy', chosen.microCopy);
    document.querySelector('#copy-status').textContent = '';
    results.hidden = false;
    results.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    document.querySelector('#results-title').focus({ preventScroll: true });
  });

  document.querySelector('#reset-button').addEventListener('click', () => {
    results.hidden = true;
    input.value = '';
    updateCounter();
    selectedConcern = 'unknown';
    concernButtons.forEach((item) => item.setAttribute('aria-pressed', String(item.dataset.concern === 'unknown')));
    const error = document.querySelector('#form-error');
    if (error) error.textContent = '';
    input.focus();
  });

  document.querySelector('#copy-button').addEventListener('click', async () => {
    const status = document.querySelector('#copy-status');
    try {
      await navigator.clipboard.writeText(makeSummary());
      status.textContent = 'نُسخت الخلاصة إلى الحافظة.';
    } catch {
      status.textContent = 'تعذّر النسخ هنا؛ يمكنك تحديد النص ونسخه يدويًا.';
    }
  });

  updateCounter();
})();
