/* ═══════════════════════════════════════════════════════
   NUNO — 共享脚本 (nuno.js)
   引用方式: <script src="nuno.js"></script>
   
   包含模块：
   - 自定义鼠标光标
   - 滚动进度条 + 导航栏
   - 粒子背景 (Hero 专用，需要 #particleCanvas)
   - i18n 多语言系统
   - Hero 卡片轮播 (需要 #deckViewport / .deck-dot)
   - App 卡片横滚 (需要 #appTrack / .app-dot)
   - 磁力按钮 (.btn-magnetic)
   - 滚动显现 (.reveal)
═══════════════════════════════════════════════════════ */

/* ─── 工具函数 ─── */
function $(sel, ctx) { return (ctx || document).querySelector(sel); }
function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

/* ═══════════════════════════════════════════════════════
   自定义鼠标光标
═══════════════════════════════════════════════════════ */
function initCursor() {
  const cursor = $('#cursor');
  const ring   = $('#cursorRing');
  if (!cursor || !ring) return;

  let mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function animCursor() {
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animCursor);
  })();
}

/* ═══════════════════════════════════════════════════════
   滚动进度条 + 导航栏
═══════════════════════════════════════════════════════ */
function initScrollUI() {
  const scrollLine = $('#scrollLine');
  const nav        = $('#mainNav');

  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    if (scrollLine) scrollLine.style.transform = `scaleX(${pct})`;
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ═══════════════════════════════════════════════════════
   粒子背景（仅在页面有 #particleCanvas 时生效）
═══════════════════════════════════════════════════════ */
function initParticles() {
  const canvas = $('#particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['201,168,76', '201,168,76', '96,165,250', '167,139,250'];

  for (let i = 0; i < 60; i++) {
    const c = COLORS[Math.floor(Math.random() * COLORS.length)];
    particles.push({
      x: Math.random() * 1200, y: Math.random() * 900,
      r: Math.random() * 2.2 + 0.8,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.4 - 0.1,
      a: Math.random() * 0.5 + 0.4,
      va: (Math.random() - 0.5) * 0.008,
      color: c,
    });
  }

  (function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      p.a += p.va;
      if (p.a <= 0 || p.a >= 1) p.va *= -1;
      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.a * 0.9})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  })();
}

/* ═══════════════════════════════════════════════════════
   i18n 多语言系统
   用法: setLang('zh') / setLang('en') 等
═══════════════════════════════════════════════════════ */
const i18n = {
  zh: {
    badge:'极简财务工具',hero_h1_1:'复杂变',hero_h1_2:'简单',
    hero_sub:'你不需要懂财务逻辑——水獭替你计算一切。从生存红线到库存毛利，数字自动跑，你只管做生意。',
    hero_cta1:'探索产品 →',hero_cta2:'查看定价',
    nav_apps:'产品',nav_why:'理念',nav_pricing:'定价',nav_start:'免费开始',
    deck_badge1:'能量站',deck_badge2:'零售版',deck_badge3:'美业版',
    deck_label1:'每日生存红线',deck_label2:'今日毛利',deck_label3:'综合净利润',
    deck_bar_rent:'租金',deck_bar_labor:'人工',deck_bar_other:'其他',
    deck_bar_sales:'销售额',deck_bar_cost:'成本',deck_bar_margin:'毛利率',
    deck_bar_staff:'员工提成',deck_bar_channel:'渠道成本',deck_bar_material:'耗材成本',
    deck_hint:'滑动查看',
    tag1_title:'不需要会计学位',tag1_sub:'打开即用，数字自动算好，你只看结果就够了。',
    tag2_title:'生意数据，随时在手',tag2_sub:'无需安装，直接用，数据永远同步。',
    tag3_title:'从零到清晰，几分钟完成',tag3_sub:'录入成本，系统帮你算红线、毛利、提成、库存价值。',
    apps_label:'四款工具',apps_title:'为你的行业\n精准打造',apps_desc:'无论零售、美业还是餐饮，水獭用你听得懂的语言把复杂财务说清楚。',
    app1_name:'水獭能量站',app1_sub:'知道每月最少要赚多少，才能活下去——这比会计报表更重要。',
    app1_f1:'每日生存红线',app1_f2:'净利润计算',app1_f3:'盈亏临界点',app1_f4:'投资回报率',
    app2_name:'獭掌柜·零售版',app2_sub:'卖出一件，库存自动减一件，毛利自动算出来。',
    app2_f1:'智能库存',app2_f2:'辅助定价',app2_f3:'毛利率实时',app2_f4:'库存价值',app2_f5:'贡献利润排行',app2_f6:'临期货品提醒',
    app3_name:'獭掌柜·美业版',app3_sub:'员工提成、获客成本、库存智能精确到ml，每单全自动跑出净利润。',
    app3_f1:'员工提成',app3_f2:'获客成本',app3_f3:'精细化成本计算',app3_f4:'自动减库存',
    app4_name:'獭掌柜·餐饮版',app4_sub:'餐厅的每一分钱都看清楚。',
    app4_f1:'BOM配方',app4_f2:'精准毛利',app4_f3:'外卖成本',app4_f4:'投流成本',
    phil_label:'水獭的理念',phil_title:'款工具\n一个信念',phil_desc:'财务不该是只有专业人士才能读懂的密码。每个做生意的人，都有权利看清楚自己的钱去哪了。',
    stat1_title:'零配置上手',stat1_desc:'不需要培训，不需要会计知识，打开填数字，结果立刻出来。',
    stat2_title:'实时联动数据',stat2_desc:'销售即录入，库存即扣减，毛利即更新。所有数据环环相扣，从不过期。',
    stat3_title:'全球支付',stat3_desc:'支持订阅，不获取您的手机号与实名信息，隐私保护，海内外通用。',
    stat4_title:'无需安装',stat4_desc:'浏览器直开，APP体验。iOS、Android、桌面全平台兼容。',
    pricing_label:'定价',pricing_title:'清晰透明\n按需订阅',pricing_desc:'所有产品均支持免费试用 · 安全支付 · 随时取消',
    plan1_label:'基础版',plan1_name:'水獭能量站',plan1_f1:'每日生存红线计算',plan1_f2:'极简交互',plan1_f3:'数据导出（Excel/CSV）',plan1_f4:'多语言界面',
    plan2_badge:'最受欢迎',plan2_label:'套装版',plan2_name:'獭掌柜套装',plan2_f1:'零售 / 美业 / 餐饮 任选一款',plan2_f2:'库存进销自动联动',plan2_f3:'毛利实时计算',plan2_f4:'员工提成 & BOM & 获客成本',plan2_f5:'辅助录入库存',
    plan3_label:'全家桶',plan3_name:'水獭全系',plan3_f1:'全部 4 款 PWA',plan3_f2:'跨店数据汇总',plan3_f3:'数据导出 (CSV/PDF)',plan3_f4:'专属客服',
    plan4_name:'连锁 / 团队版',plan4_sub:'多门店、多员工账号，定制化接入，联系我们获取报价。',
    per_month:' /月',cta_try:'免费试用 14 天',cta_start:'立即开始',cta_contact:'联系我们',
    trust1:'Stripe 安全支付',trust3:'随时取消，无隐藏费用',
    footer_desc:'复杂变简单。为每一个认真做生意的人，打造最贴心的财务工具。',
    footer_products:'产品',footer_company:'公司',footer_legal:'法律',
    footer_about:'关于我们',footer_blog:'博客',footer_contact:'联系',
    footer_privacy:'隐私政策',footer_terms:'服务条款',footer_refund:'退款政策',
    footer_rights:'版权所有',footer_stripe_note:'支付由 Stripe 提供安全保障',
    mq1_a:'零配置上手',mq1_b:'零摩擦',mq2_a:'实时毛利计算',mq2_b:'自动联动',
    mq3_a:'Stripe 安全支付',mq3_b:'全球通用',mq4_a:'无需安装',mq4_b:'浏览器直开',
    mq5_a:'四款专业工具',mq5_b:'一个价格',mq6_a:'隐私优先',mq6_b:'数据安全',
  },
  en: {
    badge:'Zero-complexity Finance',hero_h1_1:'Complex becomes',hero_h1_2:'Simple',
    hero_sub:"You don't need to understand finance — Otter calculates everything for you. From survival threshold to gross margin, numbers run automatically.",
    hero_cta1:'Explore Products →',hero_cta2:'View Pricing',
    nav_apps:'Products',nav_why:'Philosophy',nav_pricing:'Pricing',nav_start:'Start Free',
    deck_badge1:'Station',deck_badge2:'Retail',deck_badge3:'Beauty',
    deck_label1:'Daily Survival Line',deck_label2:"Today's Gross Profit",deck_label3:'Net Profit',
    deck_bar_rent:'Rent',deck_bar_labor:'Labor',deck_bar_other:'Other',
    deck_bar_sales:'Revenue',deck_bar_cost:'Cost',deck_bar_margin:'Margin',
    deck_bar_staff:'Commission',deck_bar_channel:'Channel',deck_bar_material:'Materials',
    deck_hint:'SWIPE TO EXPLORE',
    tag1_title:'No accounting degree needed',tag1_sub:'Open and use immediately. Numbers calculated automatically — you only see results.',
    tag2_title:'Business data, always in hand',tag2_sub:'No installation. Open in browser, data always synced.',
    tag3_title:'Zero to clarity in minutes',tag3_sub:'Enter costs — system calculates survival line, margin, commissions, inventory value.',
    apps_label:'Four Tools',apps_title:'Built for\nyour industry',apps_desc:"Whether retail, beauty, or F&B — Otter explains complex finances in language you understand.",
    app1_name:'Otter Station',app1_sub:"Know the minimum you need to earn each month to survive — more important than any accounting report.",
    app1_f1:'Survival Line',app1_f2:'Net Profit Calc',app1_f3:'Break-even Point',app1_f4:'ROI Analysis',
    app2_name:'OtterKeeper · Retail',app2_sub:'Sell one — inventory drops, gross profit calculated instantly.',
    app2_f1:'Smart Inventory',app2_f2:'Pricing Assistant',app2_f3:'Real-time Margin',app2_f4:'Inventory Value',app2_f5:'Profit Ranking',app2_f6:'Expiry Alerts',
    app3_name:'OtterKeeper · Beauty',app3_sub:'Staff commissions, acquisition cost, inventory precise to ml — net profit auto-calculated per service.',
    app3_f1:'Staff Commission',app3_f2:'Acquisition Cost',app3_f3:'Granular Costing',app3_f4:'Auto Inventory',
    app4_name:'OtterKeeper · F&B',app4_sub:'Every dollar in your restaurant, crystal clear.',
    app4_f1:'BOM Recipes',app4_f2:'Precise Margin',app4_f3:'Delivery Cost',app4_f4:'Ad Spend',
    phil_label:"Otter's Philosophy",phil_title:'tools\nOne belief',phil_desc:'Finance should not be a code only experts can read. Everyone running a business deserves to see clearly where their money goes.',
    stat1_title:'Zero setup',stat1_desc:'No training, no accounting knowledge needed. Open, enter numbers, get instant results.',
    stat2_title:'Real-time linked data',stat2_desc:'Sales recorded, inventory deducted, margin updated. All data interconnected, never outdated.',
    stat3_title:'Global payments',stat3_desc:'Supports subscriptions with no phone or ID required. Privacy-first, works worldwide.',
    stat4_title:'No installation needed',stat4_desc:'Open in browser, app-like experience. iOS, Android, and desktop all supported.',
    pricing_label:'Pricing',pricing_title:'Clear & transparent\nPay as you grow',pricing_desc:'Free trial · Secure payments · Cancel anytime',
    plan1_label:'Starter',plan1_name:'Otter Station',plan1_f1:'Survival line calculation',plan1_f2:'Minimal UI',plan1_f3:'Export (Excel/CSV)',plan1_f4:'Multi-language UI',
    plan2_badge:'Most Popular',plan2_label:'Bundle',plan2_name:'OtterKeeper Bundle',plan2_f1:'Retail / Beauty / F&B (choose one)',plan2_f2:'Auto inventory sync',plan2_f3:'Real-time gross margin',plan2_f4:'Commissions & BOM & Acquisition cost',plan2_f5:'Assisted inventory input',
    plan3_label:'All-In',plan3_name:'Full Otter Suite',plan3_f1:'All 4 PWA tools',plan3_f2:'Cross-location data',plan3_f3:'Export (CSV/PDF)',plan3_f4:'Dedicated support',
    plan4_name:'Chain / Team Plan',plan4_sub:'Multi-location, multi-staff accounts, custom integration — contact us for pricing.',
    per_month:'/mo',cta_try:'Start 14-day Free Trial',cta_start:'Get Started',cta_contact:'Contact Us',
    trust1:'Secure Stripe Payments',trust3:'Cancel anytime, no hidden fees',
    footer_desc:'Complex becomes simple. Built for every serious business owner.',
    footer_products:'Products',footer_company:'Company',footer_legal:'Legal',
    footer_about:'About',footer_blog:'Blog',footer_contact:'Contact',
    footer_privacy:'Privacy Policy',footer_terms:'Terms of Service',footer_refund:'Refund Policy',
    footer_rights:'All rights reserved.',footer_stripe_note:'Payments secured by Stripe',
    mq1_a:'Zero setup',mq1_b:'Zero friction',mq2_a:'Real-time margin',mq2_b:'Auto-linked',
    mq3_a:'Stripe payments',mq3_b:'Global',mq4_a:'No install',mq4_b:'Browser-ready',
    mq5_a:'Four pro tools',mq5_b:'One price',mq6_a:'Privacy first',mq6_b:'Secure data',
  },
  fr: {
    badge:'Finance Sans Complexité',hero_h1_1:'Le complexe devient',hero_h1_2:'Simple',
    hero_sub:"Vous n'avez pas besoin de comprendre la finance — Otter calcule tout pour vous.",
    hero_cta1:'Explorer les produits →',hero_cta2:'Voir les tarifs',
    nav_apps:'Produits',nav_why:'Philosophie',nav_pricing:'Tarifs',nav_start:'Commencer',
    deck_badge1:'Station',deck_badge2:'Retail',deck_badge3:'Beauté',
    deck_label1:'Seuil de survie',deck_label2:'Marge brute',deck_label3:'Bénéfice net',
    deck_bar_rent:'Loyer',deck_bar_labor:"Main-d'œuvre",deck_bar_other:'Autre',
    deck_bar_sales:'Ventes',deck_bar_cost:'Coûts',deck_bar_margin:'Marge',
    deck_bar_staff:'Commission',deck_bar_channel:'Canal',deck_bar_material:'Matériaux',
    deck_hint:'GLISSER POUR EXPLORER',
    tag1_title:'Sans diplôme comptable',tag1_sub:"Ouvrir et utiliser immédiatement.",
    tag2_title:'Données business, toujours là',tag2_sub:"Pas d'installation. Navigateur, données synchronisées.",
    tag3_title:'De zéro à la clarté',tag3_sub:"Entrez les coûts — le système calcule tout.",
    apps_label:'Quatre Outils',apps_title:'Conçu pour\nvotre secteur',apps_desc:"Retail, beauté ou restauration — Otter parle votre langue.",
    app1_name:'Otter Station',app1_sub:"Connaître le minimum à gagner pour survivre.",
    app1_f1:'Seuil de survie',app1_f2:'Bénéfice net',app1_f3:'Point mort',app1_f4:'ROI',
    app2_name:'OtterKeeper · Retail',app2_sub:"Vendre une unité — stock et marge mis à jour instantanément.",
    app2_f1:'Stock intelligent',app2_f2:'Tarification',app2_f3:'Marge temps réel',app2_f4:'Valeur stock',app2_f5:'Classement',app2_f6:'Alertes expiration',
    app3_name:'OtterKeeper · Beauté',app3_sub:"Commissions, coûts, stock précis au ml.",
    app3_f1:'Commission staff',app3_f2:"Coût d'acquisition",app3_f3:'Coûts détaillés',app3_f4:'Stock auto',
    app4_name:'OtterKeeper · Restauration',app4_sub:"Chaque euro, cristal clair.",
    app4_f1:'Recettes BOM',app4_f2:'Marge précise',app4_f3:'Livraison',app4_f4:'Publicité',
    phil_label:"La Philosophie d'Otter",phil_title:'outils\nUne conviction',phil_desc:"La finance n'est pas réservée aux experts.",
    stat1_title:'Zéro configuration',stat1_desc:"Pas de formation. Résultats immédiats.",
    stat2_title:'Données en temps réel',stat2_desc:"Ventes, stock, marge — tout synchronisé.",
    stat3_title:'Paiements mondiaux',stat3_desc:"Abonnements sans données personnelles.",
    stat4_title:'Sans installation',stat4_desc:"iOS, Android, bureau — partout.",
    pricing_label:'Tarifs',pricing_title:'Clair & transparent\nSelon vos besoins',pricing_desc:"Essai gratuit · Sécurisé · Annulez quand vous voulez",
    plan1_label:'Démarrage',plan1_name:'Otter Station',plan1_f1:'Calcul seuil de survie',plan1_f2:'UI minimaliste',plan1_f3:'Export (Excel/CSV)',plan1_f4:'Multilingue',
    plan2_badge:'Plus Populaire',plan2_label:'Bundle',plan2_name:'Bundle OtterKeeper',plan2_f1:'Retail / Beauté / Restauration',plan2_f2:'Sync stock auto',plan2_f3:'Marge en temps réel',plan2_f4:'Commissions & BOM',plan2_f5:'Saisie assistée',
    plan3_label:'Tout-en-Un',plan3_name:'Suite Otter Complète',plan3_f1:'Les 4 PWA',plan3_f2:'Multi-sites',plan3_f3:'Export CSV/PDF',plan3_f4:'Support dédié',
    plan4_name:'Plan Chaîne / Équipe',plan4_sub:"Multi-sites, multi-employés — contactez-nous.",
    per_month:'/mois',cta_try:'Essai gratuit 14 jours',cta_start:'Commencer',cta_contact:'Nous contacter',
    trust1:'Paiements Stripe',trust3:'Annulez, sans frais cachés',
    footer_desc:'Le complexe devient simple.',
    footer_products:'Produits',footer_company:'Entreprise',footer_legal:'Légal',
    footer_about:'À propos',footer_blog:'Blog',footer_contact:'Contact',
    footer_privacy:'Confidentialité',footer_terms:"Conditions",footer_refund:'Remboursement',
    footer_rights:'Tous droits réservés.',footer_stripe_note:'Paiements sécurisés par Stripe',
    mq1_a:'Zéro config',mq1_b:'Zéro friction',mq2_a:'Marge temps réel',mq2_b:'Auto-lié',
    mq3_a:'Paiements Stripe',mq3_b:'Mondial',mq4_a:'Sans installation',mq4_b:'Navigateur',
    mq5_a:'Quatre outils',mq5_b:'Un prix',mq6_a:'Vie privée',mq6_b:'Données sécurisées',
  },
  vi: {
    badge:'Tài Chính Không Phức Tạp',hero_h1_1:'Phức tạp trở thành',hero_h1_2:'Đơn giản',
    hero_sub:"Bạn không cần hiểu tài chính — Otter tính toán mọi thứ cho bạn.",
    hero_cta1:'Khám phá →',hero_cta2:'Xem bảng giá',
    nav_apps:'Sản phẩm',nav_why:'Triết lý',nav_pricing:'Bảng giá',nav_start:'Bắt đầu miễn phí',
    deck_badge1:'Station',deck_badge2:'Bán lẻ',deck_badge3:'Làm đẹp',
    deck_label1:'Ngưỡng sinh tồn',deck_label2:'Lợi nhuận hôm nay',deck_label3:'Lợi nhuận ròng',
    deck_bar_rent:'Thuê nhà',deck_bar_labor:'Nhân công',deck_bar_other:'Khác',
    deck_bar_sales:'Doanh thu',deck_bar_cost:'Chi phí',deck_bar_margin:'Biên LN',
    deck_bar_staff:'Hoa hồng',deck_bar_channel:'Kênh',deck_bar_material:'Vật liệu',
    deck_hint:'VUỐT ĐỂ XEM',
    tag1_title:'Không cần bằng kế toán',tag1_sub:'Mở ra là dùng ngay.',
    tag2_title:'Dữ liệu, luôn trong tầm tay',tag2_sub:'Không cài đặt. Mở trình duyệt, dữ liệu đồng bộ.',
    tag3_title:'Từ số không đến rõ ràng',tag3_sub:'Nhập chi phí — hệ thống tính tất cả.',
    apps_label:'Bốn Công Cụ',apps_title:'Được xây dựng\ncho ngành của bạn',apps_desc:"Bán lẻ, làm đẹp hay nhà hàng — Otter nói ngôn ngữ của bạn.",
    app1_name:'Otter Station',app1_sub:"Biết mức tối thiểu cần kiếm mỗi tháng.",
    app1_f1:'Ngưỡng sinh tồn',app1_f2:'Lợi nhuận ròng',app1_f3:'Điểm hòa vốn',app1_f4:'ROI',
    app2_name:'OtterKeeper · Bán Lẻ',app2_sub:'Bán một — kho giảm, lợi nhuận tính ngay.',
    app2_f1:'Kho thông minh',app2_f2:'Định giá',app2_f3:'Biên LN thực',app2_f4:'Giá trị kho',app2_f5:'Xếp hạng',app2_f6:'Cảnh báo hết hạn',
    app3_name:'OtterKeeper · Làm Đẹp',app3_sub:'Hoa hồng, chi phí, kho chính xác đến ml.',
    app3_f1:'Hoa hồng',app3_f2:'Chi phí kênh',app3_f3:'Chi tiết',app3_f4:'Tự động trừ kho',
    app4_name:'OtterKeeper · Nhà Hàng',app4_sub:'Từng đồng, rõ như ban ngày.',
    app4_f1:'Công thức BOM',app4_f2:'Biên LN',app4_f3:'Giao hàng',app4_f4:'Quảng cáo',
    phil_label:'Triết Lý Otter',phil_title:'công cụ\nMột niềm tin',phil_desc:'Tài chính không phải mật mã chỉ chuyên gia đọc được.',
    stat1_title:'Không cài đặt',stat1_desc:'Mở, nhập số, kết quả ngay.',
    stat2_title:'Dữ liệu thời gian thực',stat2_desc:'Bán hàng, kho, biên LN — luôn cập nhật.',
    stat3_title:'Thanh toán toàn cầu',stat3_desc:'Không cần số điện thoại hay danh tính.',
    stat4_title:'Không cần cài đặt',stat4_desc:'iOS, Android, máy tính bàn.',
    pricing_label:'Bảng Giá',pricing_title:'Rõ ràng & minh bạch\nTheo nhu cầu',pricing_desc:'Dùng thử · Thanh toán an toàn · Hủy bất lúc',
    plan1_label:'Cơ Bản',plan1_name:'Otter Station',plan1_f1:'Tính ngưỡng sinh tồn',plan1_f2:'Giao diện tối giản',plan1_f3:'Xuất file',plan1_f4:'Đa ngôn ngữ',
    plan2_badge:'Phổ Biến Nhất',plan2_label:'Gói',plan2_name:'Gói OtterKeeper',plan2_f1:'Bán lẻ / Làm đẹp / Nhà hàng',plan2_f2:'Đồng bộ kho',plan2_f3:'Biên LN thực',plan2_f4:'Hoa hồng & BOM',plan2_f5:'Nhập kho hỗ trợ',
    plan3_label:'Trọn Gói',plan3_name:'Bộ Otter Đầy Đủ',plan3_f1:'Tất cả 4 PWA',plan3_f2:'Đa chi nhánh',plan3_f3:'Xuất CSV/PDF',plan3_f4:'Hỗ trợ riêng',
    plan4_name:'Chuỗi / Nhóm',plan4_sub:'Đa địa điểm — liên hệ để báo giá.',
    per_month:'/tháng',cta_try:'Dùng thử 14 ngày',cta_start:'Bắt đầu ngay',cta_contact:'Liên hệ',
    trust1:'Thanh toán Stripe',trust3:'Hủy bất lúc, không phí ẩn',
    footer_desc:'Phức tạp trở thành đơn giản.',
    footer_products:'Sản phẩm',footer_company:'Công ty',footer_legal:'Pháp lý',
    footer_about:'Về chúng tôi',footer_blog:'Blog',footer_contact:'Liên hệ',
    footer_privacy:'Bảo mật',footer_terms:'Điều khoản',footer_refund:'Hoàn tiền',
    footer_rights:'Bảo lưu mọi quyền.',footer_stripe_note:'Bảo mật bởi Stripe',
    mq1_a:'Không cài đặt',mq1_b:'Không ma sát',mq2_a:'Biên LN thực',mq2_b:'Tự động',
    mq3_a:'Thanh toán Stripe',mq3_b:'Toàn cầu',mq4_a:'Không cài',mq4_b:'Mở ngay',
    mq5_a:'Bốn công cụ',mq5_b:'Một giá',mq6_a:'Riêng tư',mq6_b:'Dữ liệu an toàn',
  }
};

// 当前语言（存 localStorage，跨页面保持一致）
let _currentLang = localStorage.getItem('nuno_lang') || 'zh';

function setLang(lang) {
  const data = i18n[lang];
  if (!data) return;
  _currentLang = lang;
  localStorage.setItem('nuno_lang', lang);

  $$('.i18n').forEach(el => {
    const k = el.getAttribute('data-key');
    if (k && data[k] !== undefined) el.textContent = data[k];
  });

  // 更新 shimmer data-text 属性（Hero 标题光晕效果）
  const goldLine = $('.line-gold');
  if (goldLine && data.hero_h1_2) goldLine.setAttribute('data-text', data.hero_h1_2);

  // 切换按钮高亮
  $$('.lang-btn').forEach(b => b.classList.remove('active'));
  const activeBtn = $(`.lang-btn[onclick="setLang('${lang}')"]`);
  if (activeBtn) activeBtn.classList.add('active');

  document.documentElement.lang = lang;
}

function initI18n() {
  setLang(_currentLang);
}

/* ═══════════════════════════════════════════════════════
   Hero 卡片轮播
═══════════════════════════════════════════════════════ */
function initCardDeck() {
  const viewport = $('#deckViewport');
  if (!viewport) return;

  const deckDotEls = $$('.deck-dot');
  let currentCard = 0, startX = 0, isDragging = false;

  function getCards() { return $$('.preview-card', viewport); }

  function updateDeck(active) {
    currentCard = active;
    const cs = getCards(), n = cs.length;
    deckDotEls.forEach((d, i) => d.classList.toggle('active', i === active));
    cs.forEach((card, i) => {
      const rel = (i - active + n) % n;
      card.style.zIndex = n - rel;
      if (rel === 0) {
        card.style.transform = 'translateY(0) scale(1) rotateX(0)';
        card.style.opacity = '1'; card.style.filter = 'blur(0)';
      } else if (rel === 1) {
        card.style.transform = 'translateY(15px) scale(0.94) rotateX(2.5deg)';
        card.style.opacity = '0.7'; card.style.filter = 'blur(0)';
      } else {
        card.style.transform = 'translateY(30px) scale(0.88) rotateX(5deg)';
        card.style.opacity = '0.4'; card.style.filter = 'blur(1px)';
      }
    });
  }

  // 暴露给 HTML onclick 使用
  window.goToCard = function(i) { updateDeck(i); };

  function advanceCard() {
    const cs = getCards(), n = cs.length;
    const frontIdx = cs.findIndex((_, i) => (i - currentCard + n) % n === 0);
    const front = cs[frontIdx];
    if (front) {
      front.style.transition = 'transform 0.38s cubic-bezier(0.4,0,1,1), opacity 0.28s ease';
      front.style.transform = 'translateX(-115%) rotate(-7deg) scale(0.9)';
      front.style.opacity = '0';
      setTimeout(() => {
        front.style.transition = 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1), opacity 0.45s ease, filter 0.45s ease';
        updateDeck((currentCard + 1) % n);
      }, 360);
    } else {
      updateDeck((currentCard + 1) % n);
    }
  }

  viewport.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  viewport.addEventListener('touchend',   e => {
    if (Math.abs(e.changedTouches[0].clientX - startX) > 40) advanceCard();
  }, { passive: true });
  viewport.addEventListener('mousedown', e => { startX = e.clientX; isDragging = true; });
  window.addEventListener('mouseup', e => {
    if (!isDragging) return;
    isDragging = false;
    if (Math.abs(e.clientX - startX) > 40) advanceCard();
  });
  viewport.addEventListener('click', () => advanceCard());

  setInterval(advanceCard, 4500);
}

/* ═══════════════════════════════════════════════════════
   App 卡片横滚
═══════════════════════════════════════════════════════ */
function initAppCards() {
  const appTrack  = $('#appTrack');
  if (!appTrack) return;

  const appDotEls = $$('.app-dot');

  window.scrollAppTo = function(i) {
    const cs = $$('.app-card', appTrack);
    if (cs[i]) cs[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  };

  appTrack.addEventListener('scroll', () => {
    const cs = $$('.app-card', appTrack);
    let closest = 0, minD = Infinity;
    cs.forEach((c, i) => {
      const d = Math.abs(c.getBoundingClientRect().left - appTrack.getBoundingClientRect().left);
      if (d < minD) { minD = d; closest = i; }
    });
    appDotEls.forEach((d, i) => d.classList.toggle('active', i === closest));
  }, { passive: true });
}

/* ═══════════════════════════════════════════════════════
   磁力按钮
═══════════════════════════════════════════════════════ */
function initMagneticButtons() {
  $$('.btn-magnetic').forEach(wrap => {
    const btn = wrap.querySelector('a, button');
    if (!btn) return;
    wrap.addEventListener('mousemove', e => {
      const r = wrap.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width  / 2);
      const dy = e.clientY - (r.top  + r.height / 2);
      btn.style.transform = `translate(${dx * 0.28}px, ${dy * 0.28}px)`;
    });
    wrap.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
      setTimeout(() => btn.style.transition = '', 500);
    });
  });
}

/* ═══════════════════════════════════════════════════════
   滚动显现 (.reveal)
═══════════════════════════════════════════════════════ */
function initScrollReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  $$('.reveal').forEach(el => io.observe(el));
}

/* ═══════════════════════════════════════════════════════
   初始化入口 — DOMContentLoaded 后自动运行
═══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initScrollUI();
  initParticles();
  initI18n();
  initCardDeck();
  initAppCards();
  initMagneticButtons();
  initScrollReveal();
});
