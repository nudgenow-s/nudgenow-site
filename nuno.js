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

    /* ── 共用法律页 ── */
    legal_effective:'生效日期：2026 年 1 月 1 日',
    legal_updated:'最后更新：2026 年 4 月 30 日',
    legal_toc:'目录',
    legal_nav_products:'产品',legal_nav_philosophy:'理念',legal_nav_pricing:'定价',legal_nav_start:'免费开始',

    /* ── 隐私政策 ── */
    priv_badge:'隐私政策',
    priv_h1:'隐私政策',
    priv_summary:'简短版：NUNO 不收集您的手机号码或政府颁发的身份证明。我们仅收集运营服务所必需的最少信息。您的业务数据属于您，我们不会将其出售给任何第三方。',
    priv_s1_title:'我们收集哪些信息',
    priv_s1_p1:'我们秉持"最小化数据收集"原则，仅收集提供服务所必需的信息。',
    priv_s1_sub1:'您主动提供的信息：',
    priv_s1_l1:'电子邮件地址（用于账户注册与登录）',
    priv_s1_l2:'支付信息（由 Stripe 处理，NUNO 不存储您的完整卡号）',
    priv_s1_l3:'您在应用内录入的业务数据（成本、库存、销售记录等）',
    priv_s1_sub2:'自动收集的信息：',
    priv_s1_l4:'设备类型、操作系统、浏览器版本（用于兼容性优化）',
    priv_s1_l5:'IP 地址（用于安全防护与服务区域判断）',
    priv_s1_l6:'页面访问日志与功能使用频次（用于产品改进）',
    priv_s1_warn:'我们明确不收集：手机号码、身份证号、护照信息、人脸或生物特征数据，以及任何与您的账户无关的个人敏感信息。',
    priv_s2_title:'我们如何使用信息',
    priv_s2_p1:'我们使用收集到的信息仅用于以下目的：',
    priv_s2_l1:'提供、维护和改进 NUNO 旗下各产品的核心功能',
    priv_s2_l2:'处理订阅付款并发送收据',
    priv_s2_l3:'响应您的客户支持请求',
    priv_s2_l4:'发送重要的服务通知（如账户安全提醒、政策变更）',
    priv_s2_l5:'分析汇总匿名使用数据以改进产品体验',
    priv_s2_p2:'我们不会将您的个人信息用于精准广告投放，也不会将其出售、租借或以其他商业方式转让给第三方。',
    priv_s3_title:'信息的存储与安全',
    priv_s3_p1:'您的数据存储在具备行业标准安全认证的云服务器上，并受到以下保护措施：',
    priv_s3_l1:'传输层加密（TLS 1.3）保护所有数据通信',
    priv_s3_l2:'静态数据采用 AES-256 加密存储',
    priv_s3_l3:'定期安全审计与漏洞扫描',
    priv_s3_l4:'最小权限原则，内部员工访问数据须经授权审批',
    priv_s3_p2:'您在 NUNO 应用内录入的业务数据（成本、库存、销售额等）仅归您所有。我们不会分析这些数据以用于任何商业目的。',
    priv_s3_warn:'数据保留：账户注销后，我们将在 30 天内删除您的个人信息及业务数据。法律法规要求保留的记录除外（如付款记录，通常保留 7 年以满足会计合规要求）。',
    priv_s4_title:'信息的共享与披露',
    priv_s4_p1:'我们仅在以下有限情况下共享您的信息：',
    priv_s4_l1:'支付处理：Stripe Inc. 处理所有支付，其隐私政策适用于支付数据',
    priv_s4_l2:'云服务提供商：用于托管服务的基础设施供应商，受严格的保密协议约束',
    priv_s4_l3:'法律要求：在依法收到有效的政府命令时，我们可能被要求披露特定信息',
    priv_s4_l4:'业务转让：若公司发生合并或收购，我们将提前通知您，您可在转让前删除账户',
    priv_s4_p2:'除上述情形外，我们不会在未经您明确同意的情况下共享您的任何个人信息。',
    priv_s5_title:'Cookie 与追踪技术',
    priv_s5_p1:'NUNO 使用少量必要的 Cookie 以确保服务正常运行：',
    priv_s5_l1:'会话 Cookie：维持您的登录状态，关闭浏览器后自动清除',
    priv_s5_l2:'偏好 Cookie：记住您的语言选择等界面偏好设置',
    priv_s5_l3:'安全 Cookie：防止跨站请求伪造（CSRF）攻击',
    priv_s5_p2:'我们不使用第三方广告追踪 Cookie，也不使用 Facebook Pixel、Google Ads 再营销等追踪工具。您可在浏览器设置中管理 Cookie，但禁用必要 Cookie 可能影响部分功能。',
    priv_s6_title:'您的权利',
    priv_s6_p1:'无论您所在的地区，您对自己的数据享有以下权利：',
    priv_s6_l1:'访问权：随时查看我们持有的关于您的信息',
    priv_s6_l2:'更正权：更新不准确的个人信息',
    priv_s6_l3:'删除权：请求删除您的账户及所有关联数据',
    priv_s6_l4:'可携带权：以常见格式（CSV/JSON）导出您的业务数据',
    priv_s6_l5:'反对权：拒绝某些数据处理活动',
    priv_s6_l6:'撤回同意：随时撤回您之前给予的任何同意',
    priv_s6_p2:'如需行使上述权利，请发送邮件至 hi@nudgenow.xyz，我们将在 30 个工作日内响应。',
    priv_s7_title:'儿童隐私',
    priv_s7_p1:'NUNO 的服务面向 18 周岁及以上的成年用户。我们不会故意收集未成年人的个人信息。如果您认为我们无意中收集了儿童的数据，请立即联系我们，我们将迅速删除相关信息。',
    priv_s8_title:'政策变更',
    priv_s8_p1:'我们可能定期更新本隐私政策。当发生重大变更时，我们将通过以下方式通知您：',
    priv_s8_l1:'向您注册的电子邮件地址发送通知',
    priv_s8_l2:'在应用内显示明显的变更提示',
    priv_s8_l3:'在本页顶部更新"最后更新"日期',
    priv_s8_p2:'继续使用我们的服务即表示您接受更新后的政策。如果您不同意变更内容，您可以在变更生效前注销账户。',
    priv_s9_title:'联系我们',
    priv_s9_p1:'如果您对本隐私政策有任何疑问、意见或请求，请通过以下方式联系我们：',
    priv_contact_name:'NUNO LLC — 隐私团队',
    priv_contact_email:'邮件：hi@nudgenow.xyz（隐私相关事宜优先处理）',
    priv_contact_general:'一般咨询：hinuno@outlook.com',
    priv_contact_note:'我们承诺在收到邮件后 5 个工作日内给予初步回复。',
    priv_toc1:'我们收集哪些信息',priv_toc2:'我们如何使用信息',priv_toc3:'信息的存储与安全',
    priv_toc4:'信息的共享与披露',priv_toc5:'Cookie 与追踪技术',priv_toc6:'您的权利',
    priv_toc7:'儿童隐私',priv_toc8:'政策变更',priv_toc9:'联系我们',

    /* ── 服务条款 ── */
    terms_badge:'服务条款',
    terms_h1:'服务条款',
    terms_summary:'简短版：使用 NUNO 即表示您同意这些条款。NUNO 是辅助决策的财务工具，不是会计师或财务顾问。您对基于本工具做出的任何商业决策负全部责任。',
    terms_s1_title:'接受条款',
    terms_s1_p1:'欢迎使用 NUNO。本服务条款是您与 NUNO LLC 之间的法律协议，适用于您对 NUNO 旗下所有产品和服务的使用，包括但不限于：',
    terms_s1_l1:'水獭能量站（Otter Station）',terms_s1_l2:'獭掌柜·零售版（OtterKeeper Retail）',
    terms_s1_l3:'獭掌柜·美业版（OtterKeeper Beauty）',terms_s1_l4:'獭掌柜·餐饮版（OtterKeeper F&B）',
    terms_s1_p2:'通过注册账户、访问或使用我们的任何服务，即表示您已阅读、理解并同意受本条款约束。如果您不同意本条款的任何部分，请停止使用我们的服务。',
    terms_s1_p3:'您须年满 18 周岁方可使用本服务。代表企业使用本服务的个人须具有代表该企业签订具有法律约束力协议的授权。',
    terms_s2_title:'服务说明',
    terms_s2_p1:'NUNO 提供一系列基于 Web 的财务辅助工具，帮助小型企业主理解和追踪其业务的基本财务指标，包括但不限于生存红线计算、库存毛利分析、员工提成管理等。',
    terms_s2_warn:'重要提示：NUNO 是辅助性计算与记录工具，不构成专业会计、税务、法律或财务投资建议。应用内显示的所有数据均基于您输入的信息计算得出。在做出重要商业决策之前，请咨询持牌会计师或财务顾问。',
    terms_s2_p2:'我们保留随时修改、暂停或终止服务（或其任何部分）的权利，恕不另行通知。',
    terms_s3_title:'账户注册与安全',
    terms_s3_p1:'使用 NUNO 需要创建账户。您在注册时须提供真实、准确、完整的信息，并在信息发生变化时及时更新。',
    terms_s3_p2:'关于账户安全，您须承诺：',
    terms_s3_l1:'妥善保管您的登录凭据，不与他人共享账户密码',
    terms_s3_l2:'在发现任何未经授权的账户访问时，立即通知我们',
    terms_s3_l3:'对您账户下发生的所有活动负责，无论是否经过您的授权',
    terms_s3_l4:'不创建多个账户以规避付费限制或其他使用规定',
    terms_s3_note:'一个账户，一个用户：基础订阅计划限单人使用。如需多人访问，请联系我们了解团队版方案。',
    terms_s4_title:'订阅与付款',
    terms_s4_p1:'NUNO 采用订阅制定价模式。所有付款通过 Stripe 安全处理，我们支持主流信用卡和借记卡。',
    terms_s4_l1:'计费周期：按月或按年订阅，从您首次付款之日起计算',
    terms_s4_l2:'自动续费：订阅将在每个计费周期结束时自动续费，除非您提前取消',
    terms_s4_l3:'价格变更：我们将提前 30 天通过电子邮件告知您任何价格调整',
    terms_s4_l4:'免费试用：试用期结束后，除非您主动取消，将自动转为付费订阅',
    terms_s4_l5:'货币：所有价格以美元（USD）计价，实际收费金额可能因您所在地区的税率而略有差异',
    terms_s4_p2:'如因您提供的支付信息有误或账户余额不足导致付款失败，我们保留暂停或终止您访问权限的权利。',
    terms_s5_title:'可接受使用规范',
    terms_s5_p1:'使用 NUNO 服务时，您同意不从事以下行为：',
    terms_s5_l1:'违反任何适用的法律法规',
    terms_s5_l2:'上传或传播包含恶意软件、病毒或任何有害代码的内容',
    terms_s5_l3:'尝试未经授权访问我们的系统、服务器或其他用户的账户',
    terms_s5_l4:'对服务进行逆向工程、反编译或试图提取源代码',
    terms_s5_l5:'将服务用于任何欺诈、洗钱或其他非法商业活动',
    terms_s5_l6:'以任何方式干扰或破坏服务的正常运行',
    terms_s5_l7:'抓取、爬取或以自动化方式批量提取服务数据',
    terms_s5_p2:'违反上述规范可能导致账户被立即终止，且不予退款。',
    terms_s6_title:'您的内容与数据',
    terms_s6_p1:'您在 NUNO 中录入的所有业务数据完全归您所有。我们不主张对您的内容拥有任何知识产权。',
    terms_s6_p2:'通过使用本服务，您授予我们一项有限的、非独占的许可，仅用于向您提供服务所必需的技术操作。',
    terms_s6_l1:'您可随时通过数据导出功能以 CSV 格式导出您的所有数据',
    terms_s6_l2:'账户注销后，您的数据将在 30 天内被永久删除',
    terms_s6_l3:'我们不会将您的业务数据用于任何分析、广告或第三方共享目的',
    terms_s6_p3:'您对您录入数据的准确性负责。基于错误输入数据产生的计算结果，我们不承担任何责任。',
    terms_s7_title:'知识产权',
    terms_s7_p1:'NUNO 服务的所有内容——包括但不限于软件代码、界面设计、图标、文字、算法逻辑和品牌标识——均为 NUNO LLC 的专有财产，受适用的知识产权法律保护。',
    terms_s7_p2:'本条款不向您转让任何知识产权。您获得的仅是在本条款约束下使用服务的有限、不可转让、非独占许可。',
    terms_s7_p3:'未经我们书面许可，您不得复制、修改、分发、出售或创作基于我们服务的衍生作品。',
    terms_s8_title:'免责声明',
    terms_s8_warn:'服务按"现状"提供：在法律允许的最大范围内，NUNO 明确否认所有明示或默示的保证，包括但不限于适销性保证、特定用途适用性保证及不侵权保证。',
    terms_s8_p1:'我们不保证：',
    terms_s8_l1:'服务将不间断、无错误或完全安全地运行',
    terms_s8_l2:'服务中的任何缺陷都将被纠正',
    terms_s8_l3:'基于您输入数据生成的任何计算结果的商业准确性',
    terms_s8_l4:'服务将满足您所有特定的业务需求',
    terms_s8_p2:'财务决策的最终判断权在于您。NUNO 提供的是数据辅助，而非经营建议。',
    terms_s9_title:'责任限制',
    terms_s9_p1:'在适用法律允许的最大范围内，NUNO LLC 及其董事、员工、合作伙伴对以下任何损失概不负责：',
    terms_s9_l1:'因使用或无法使用本服务导致的利润损失',
    terms_s9_l2:'因依赖服务计算结果而做出商业决策所产生的损失',
    terms_s9_l3:'数据丢失或损坏',
    terms_s9_l4:'任何间接、附带、特殊或惩罚性损害',
    terms_s9_p2:'在任何情况下，我们对您的总责任不超过您在索赔事件发生前 12 个月内实际支付给我们的订阅费用总额。',
    terms_s10_title:'服务终止',
    terms_s10_p1:'您可以随时取消订阅，无需提供理由。取消后，您的账户将在当前计费周期结束时失效，已支付的费用不予退还。',
    terms_s10_p2:'我们保留在以下情形下立即暂停或终止您账户的权利：',
    terms_s10_l1:'您违反本服务条款的任何规定',
    terms_s10_l2:'您的账户存在欺诈或违法活动的迹象',
    terms_s10_l3:'连续 3 个计费周期付款失败',
    terms_s10_l4:'法律或监管要求',
    terms_s10_p3:'账户终止后，您可在 30 天内通过联系支持团队申请导出您的数据。30 天后数据将被永久删除。',
    terms_s11_title:'争议解决',
    terms_s11_p1:'如果您对我们的服务有任何争议，我们鼓励您首先通过以下方式与我们直接沟通解决：',
    terms_s11_l1:'发送邮件至 hinuno@outlook.com 描述您的问题',
    terms_s11_l2:'我们承诺在 5 个工作日内给予正式回复',
    terms_s11_l3:'双方将诚意协商，争取在 30 天内友好解决',
    terms_s11_p2:'若协商无法解决争议，双方同意通过具有管辖权的仲裁机构进行约束性仲裁，而非提起集体诉讼。',
    terms_s11_note:'条款变更：我们可能会不时更新本服务条款。重大变更将提前 14 天通过电子邮件通知您。继续使用服务即视为您接受更新后的条款。',
    terms_s12_title:'联系我们',
    terms_s12_p1:'如对本服务条款有任何疑问，请通过以下方式联系我们：',
    terms_contact_name:'NUNO LLC — 法务团队',
    terms_contact_email:'邮件：hi@nudgenow.xyz（条款相关事宜）',
    terms_contact_general:'一般咨询：hinuno@outlook.com',
    terms_contact_note:'工作日内 5 个工作日内回复。',
    terms_toc1:'接受条款',terms_toc2:'服务说明',terms_toc3:'账户注册与安全',
    terms_toc4:'订阅与付款',terms_toc5:'可接受使用规范',terms_toc6:'您的内容与数据',
    terms_toc7:'知识产权',terms_toc8:'免责声明',terms_toc9:'责任限制',
    terms_toc10:'服务终止',terms_toc11:'争议解决',terms_toc12:'联系我们',

    /* ── 退款政策 ── */
    refund_badge:'退款政策',
    refund_h1:'退款政策',
    refund_sum1_title:'14 天免费试用',refund_sum1_sub:'无需信用卡，到期前取消不收费',
    refund_sum2_title:'7 天内全额退款',refund_sum2_sub:'付款后 7 天内，无条件退款',
    refund_sum3_title:'特殊情况个案处理',refund_sum3_sub:'超期仍可申请，我们公平对待',
    refund_s1_title:'总体原则',
    refund_s1_p1:'我们相信，好的软件不需要强制锁定用户。NUNO 的退款政策以"公平、透明、不折腾"为核心原则。',
    refund_s1_p2:'如果您对 NUNO 的服务不满意，我们希望听到您的反馈并尽力改善。同时，我们也会公平地处理每一项退款申请。',
    refund_s1_note:'我们的承诺：所有退款申请将在 3 个工作日内给予正式回复，符合条件的退款将在 5-10 个工作日内退回至原付款方式。',
    refund_s2_title:'免费试用期说明',
    refund_s2_p1:'所有 NUNO 订阅计划均提供 14 天免费试用，让您在付款前充分体验产品。',
    refund_s2_l1:'试用期间享受与付费用户完全相同的功能权限',
    refund_s2_l2:'试用期内随时取消，不会产生任何费用',
    refund_s2_l3:'试用期结束后，系统将自动向您的支付方式收取订阅费用',
    refund_s2_l4:'我们会在试用期结束前 3 天发送提醒邮件',
    refund_s2_note:'建议：如果您在试用期结束前仍未决定是否订阅，请主动在账户设置中取消自动续费，以避免被意外扣款。',
    refund_s3_title:'退款资格与场景',
    refund_s3_p1:'以下表格清晰说明了各类情况的退款处理方式：',
    refund_th1:'场景',refund_th2:'退款窗口',refund_th3:'结果',
    refund_r1c1:'试用期内取消',refund_r1c2:'14 天试用期内',refund_r1c3:'无需退款（未扣费）',
    refund_r2c1:'付款后 7 天内申请退款',refund_r2c2:'首次付款或续费后 7 天',refund_r2c3:'全额退款',
    refund_r3c1:'付款 8–30 天内申请退款',refund_r3c2:'8 到 30 天之间',refund_r3c3:'个案评估',
    refund_r4c1:'付款超过 30 天后申请退款',refund_r4c2:'超过 30 天',refund_r4c3:'原则上不退款',
    refund_r5c1:'服务故障导致无法正常使用（超 24 小时）',refund_r5c2:'任何时间',refund_r5c3:'按比例退款或账户补偿',
    refund_r6c1:'重复扣费（系统错误）',refund_r6c2:'任何时间',refund_r6c3:'全额退款多扣部分',
    refund_r7c1:'账户因违规被终止',refund_r7c2:'—',refund_r7c3:'不予退款',
    refund_r8c1:'年付计划中途取消（未到期）',refund_r8c2:'付款后 7 天内',refund_r8c3:'全额退款',
    refund_r9c1:'年付计划中途取消（超过 7 天）',refund_r9c2:'超过 7 天',refund_r9c3:'按剩余月份比例退款（个案）',
    refund_s3_warn:'注意：退款将退回至原付款方式。因银行处理时间不同，实际到账可能需要 5–10 个工作日。Stripe 手续费不在退款范围内。',
    refund_s4_title:'如何申请退款',
    refund_s4_p1:'申请退款非常简单，只需按照以下步骤操作：',
    refund_step1_title:'发送退款申请邮件',refund_step1_desc:'发送邮件至 hi@nudgenow.xyz，主题注明"退款申请"。',
    refund_step2_title:'提供必要信息',refund_step2_desc:'请在邮件中说明：注册邮箱、付款日期、订阅计划名称，以及申请退款的原因。',
    refund_step3_title:'等待我们回复',refund_step3_desc:'我们将在 3 个工作日内确认您的申请并告知处理结果。符合条件的退款无需提供任何证明材料。',
    refund_step4_title:'退款到账',refund_step4_desc:'退款审核通过后，款项将在 5–10 个工作日内退回您的原付款账户。您会收到 Stripe 发送的退款确认邮件。',
    refund_s5_title:'取消订阅',
    refund_s5_p1:'取消订阅与申请退款是两件不同的事：',
    refund_s5_l1:'取消订阅：停止未来续费，但当前计费周期内仍可继续使用服务直至到期',
    refund_s5_l2:'申请退款：要求退还已支付的费用（需符合上述退款条件）',
    refund_s5_p2:'您可以随时在账户设置页面的"订阅管理"中自助取消订阅。取消后不会立即失去访问权限，服务将持续至当前周期结束日。',
    refund_s5_note:'温馨提示：如果您暂时不需要使用 NUNO，也可以先取消订阅保留账户，日后随时重新订阅，您的历史数据将完整保留 90 天。',
    refund_s6_title:'特殊情况处理',
    refund_s6_p1:'我们理解每位用户的情况都不尽相同。以下特殊情形，我们将以最大的善意个案处理：',
    refund_s6_l1:'账单争议：如果您认为账单存在错误，请在发现后 60 天内联系我们',
    refund_s6_l2:'突发情况：因个人重大变故（疾病、灾难等）无法正常使用，请提供说明，我们将酌情处理',
    refund_s6_l3:'功能预期不符：如果您购买前对功能存在误解，欢迎沟通，我们希望找到令双方满意的解决方案',
    refund_s6_l4:'价格差异：若您购买后 72 小时内遇到促销活动，可申请差价补偿',
    refund_s6_p2:'对于超出常规退款窗口的申请，我们不承诺一定退款，但我们承诺认真对待每一封邮件并给予诚实的回应。',
    refund_s7_title:'联系退款支持',
    refund_s7_p1:'退款申请或相关问题，请通过以下方式联系我们的支持团队：',
    refund_contact_name:'NUNO LLC — 退款支持团队',
    refund_contact_email:'退款专线：hi@nudgenow.xyz（退款申请优先处理）',
    refund_contact_general:'一般客服：hinuno@outlook.com',
    refund_contact_note:'工作时间：周一至周五 9:00–18:00（UTC+8）。我们承诺在 3 个工作日内回复每一封退款申请邮件。',
    refund_toc1:'总体原则',refund_toc2:'免费试用期说明',refund_toc3:'退款资格与场景',
    refund_toc4:'如何申请退款',refund_toc5:'取消订阅',refund_toc6:'特殊情况处理',refund_toc7:'联系退款支持',
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

    /* ── Shared legal ── */
    legal_effective:'Effective: January 1, 2026',
    legal_updated:'Last updated: April 30, 2026',
    legal_toc:'Contents',
    legal_nav_products:'Products',legal_nav_philosophy:'Philosophy',legal_nav_pricing:'Pricing',legal_nav_start:'Start Free',

    /* ── Privacy ── */
    priv_badge:'Privacy Policy',priv_h1:'Privacy Policy',
    priv_summary:'Short version: NUNO does not collect your phone number or government-issued ID. We collect only the minimum information needed to run the service. Your business data belongs to you — we never sell it.',
    priv_s1_title:'What We Collect',
    priv_s1_p1:'We follow a data-minimisation principle and only collect information that is necessary to provide the service.',
    priv_s1_sub1:'Information you provide:',
    priv_s1_l1:'Email address (for account registration and login)',
    priv_s1_l2:'Payment information (processed by Stripe; NUNO never stores your full card number)',
    priv_s1_l3:'Business data you enter in the app (costs, inventory, sales records, etc.)',
    priv_s1_sub2:'Automatically collected:',
    priv_s1_l4:'Device type, OS, browser version (for compatibility)',
    priv_s1_l5:'IP address (for security and region detection)',
    priv_s1_l6:'Page view logs and feature usage (for product improvement)',
    priv_s1_warn:'We explicitly do NOT collect: phone numbers, national ID or passport numbers, biometric data, or any sensitive personal information unrelated to your account.',
    priv_s2_title:'How We Use Your Information',
    priv_s2_p1:'We use the information we collect solely for the following purposes:',
    priv_s2_l1:'Providing, maintaining and improving NUNO products',
    priv_s2_l2:'Processing subscription payments and sending receipts',
    priv_s2_l3:'Responding to your customer support requests',
    priv_s2_l4:'Sending important service notices (security alerts, policy changes)',
    priv_s2_l5:'Analysing aggregated, anonymised usage data to improve the product',
    priv_s2_p2:'We will never use your personal information for targeted advertising, nor sell, rent, or transfer it to third parties for commercial purposes.',
    priv_s3_title:'Storage & Security',
    priv_s3_p1:'Your data is stored on cloud servers with industry-standard security certifications and protected by:',
    priv_s3_l1:'Transport encryption (TLS 1.3) for all data in transit',
    priv_s3_l2:'AES-256 encryption for data at rest',
    priv_s3_l3:'Regular security audits and vulnerability scans',
    priv_s3_l4:'Least-privilege access — internal staff require authorisation to access data',
    priv_s3_p2:'Business data you enter in NUNO (costs, inventory, revenue) belongs solely to you. We do not analyse it for any commercial purpose.',
    priv_s3_warn:'Data retention: Upon account deletion, your personal information and business data will be permanently deleted within 30 days, except records required by law (e.g. payment records, typically 7 years).',
    priv_s4_title:'Sharing & Disclosure',
    priv_s4_p1:'We share your information only in the following limited circumstances:',
    priv_s4_l1:'Payment processing: Stripe Inc. processes all payments; their privacy policy applies to payment data',
    priv_s4_l2:'Cloud infrastructure providers: bound by strict confidentiality agreements',
    priv_s4_l3:'Legal requirements: we may be required to disclose certain information upon a valid government order',
    priv_s4_l4:'Business transfers: in the event of a merger or acquisition, we will notify you in advance and you may delete your account before any transfer',
    priv_s4_p2:'Beyond the above, we will never share your personal information without your explicit consent.',
    priv_s5_title:'Cookies & Tracking',
    priv_s5_p1:'NUNO uses a small number of essential cookies to keep the service running:',
    priv_s5_l1:'Session cookies: maintain your login state; cleared when you close the browser',
    priv_s5_l2:'Preference cookies: remember your language and UI preferences',
    priv_s5_l3:'Security cookies: protect against CSRF attacks',
    priv_s5_p2:'We do NOT use third-party advertising cookies, Facebook Pixel, Google Ads remarketing, or similar tracking tools. You may manage cookies in your browser settings, though disabling essential cookies may affect functionality.',
    priv_s6_title:'Your Rights',
    priv_s6_p1:'Regardless of your location, you have the following rights over your data:',
    priv_s6_l1:'Access: view the information we hold about you at any time',
    priv_s6_l2:'Correction: update inaccurate personal information',
    priv_s6_l3:'Deletion: request deletion of your account and all associated data',
    priv_s6_l4:'Portability: export your business data in common formats (CSV/JSON)',
    priv_s6_l5:'Objection: opt out of certain data-processing activities',
    priv_s6_l6:'Withdraw consent: revoke any consent you have previously given',
    priv_s6_p2:'To exercise any of these rights, email hi@nudgenow.xyz. We will respond within 30 business days.',
    priv_s7_title:'Children\'s Privacy',
    priv_s7_p1:'NUNO is intended for users aged 18 and over. We do not knowingly collect personal information from minors. If you believe we have inadvertently collected data from a child, please contact us immediately and we will delete it promptly.',
    priv_s8_title:'Policy Changes',
    priv_s8_p1:'We may update this Privacy Policy from time to time. For material changes, we will notify you by:',
    priv_s8_l1:'Sending a notice to your registered email address',
    priv_s8_l2:'Displaying a prominent in-app alert',
    priv_s8_l3:'Updating the "Last updated" date at the top of this page',
    priv_s8_p2:'Continued use of the service after changes take effect constitutes acceptance of the updated policy. If you disagree, you may delete your account before the changes take effect.',
    priv_s9_title:'Contact Us',
    priv_s9_p1:'For any questions, comments or requests regarding this Privacy Policy, please reach out to us:',
    priv_contact_name:'NUNO LLC — Privacy Team',
    priv_contact_email:'Email: hi@nudgenow.xyz (privacy matters prioritised)',
    priv_contact_general:'General enquiries: hinuno@outlook.com',
    priv_contact_note:'We commit to an initial response within 5 business days.',
    priv_toc1:'What We Collect',priv_toc2:'How We Use Your Information',priv_toc3:'Storage & Security',
    priv_toc4:'Sharing & Disclosure',priv_toc5:'Cookies & Tracking',priv_toc6:'Your Rights',
    priv_toc7:'Children\'s Privacy',priv_toc8:'Policy Changes',priv_toc9:'Contact Us',

    /* ── Terms ── */
    terms_badge:'Terms of Service',terms_h1:'Terms of Service',
    terms_summary:'Short version: By using NUNO you agree to these terms. NUNO is a decision-support tool, not an accountant or financial adviser. You are fully responsible for any business decisions made based on this tool.',
    terms_s1_title:'Acceptance of Terms',
    terms_s1_p1:'Welcome to NUNO. These Terms of Service constitute a legal agreement between you and NUNO LLC, governing your use of all NUNO products and services, including:',
    terms_s1_l1:'Otter Station',terms_s1_l2:'OtterKeeper · Retail',
    terms_s1_l3:'OtterKeeper · Beauty',terms_s1_l4:'OtterKeeper · F&B',
    terms_s1_p2:'By registering an account or using any part of the service, you confirm that you have read, understood and agree to be bound by these Terms. If you disagree with any part, please stop using the service.',
    terms_s1_p3:'You must be at least 18 years old to use the service. Individuals using the service on behalf of a business must have authority to bind that business.',
    terms_s2_title:'Service Description',
    terms_s2_p1:'NUNO provides a suite of web-based financial tools to help small business owners understand and track key financial metrics, including survival-threshold calculation, gross-margin analysis and staff commission management.',
    terms_s2_warn:'Important: NUNO is a calculation and record-keeping aid. It does NOT constitute professional accounting, tax, legal or financial-investment advice. All figures are based on data you enter. Consult a licensed accountant or financial adviser before making significant business decisions.',
    terms_s2_p2:'We reserve the right to modify, suspend or discontinue the service (or any part of it) at any time without notice.',
    terms_s3_title:'Account Registration & Security',
    terms_s3_p1:'Using NUNO requires an account. You must provide truthful, accurate and complete information at registration and keep it up to date.',
    terms_s3_p2:'You agree to:',
    terms_s3_l1:'Keep your login credentials confidential and not share your password',
    terms_s3_l2:'Notify us immediately of any unauthorised access to your account',
    terms_s3_l3:'Take responsibility for all activity under your account, whether authorised or not',
    terms_s3_l4:'Not create multiple accounts to circumvent payment limits or usage rules',
    terms_s3_note:'One account, one user: base subscription plans are for individual use. Contact us for Team plans.',
    terms_s4_title:'Subscriptions & Payment',
    terms_s4_p1:'NUNO uses a subscription pricing model. All payments are processed securely by Stripe.',
    terms_s4_l1:'Billing cycle: monthly or annual, starting from the date of your first payment',
    terms_s4_l2:'Auto-renewal: subscriptions renew automatically at the end of each billing period unless cancelled',
    terms_s4_l3:'Price changes: we will give you 30 days\' notice by email of any price adjustment',
    terms_s4_l4:'Free trial: if you do not cancel before the trial ends, it converts automatically to a paid subscription',
    terms_s4_l5:'Currency: all prices are in USD; the amount charged may vary slightly due to local taxes',
    terms_s4_p2:'If payment fails due to incorrect information or insufficient funds, we reserve the right to suspend or terminate your access.',
    terms_s5_title:'Acceptable Use',
    terms_s5_p1:'When using NUNO, you agree not to:',
    terms_s5_l1:'Violate any applicable laws or regulations',
    terms_s5_l2:'Upload or distribute malware, viruses or harmful code',
    terms_s5_l3:'Attempt unauthorised access to our systems or other users\' accounts',
    terms_s5_l4:'Reverse-engineer, decompile or attempt to extract the source code',
    terms_s5_l5:'Use the service for fraud, money laundering or other illegal activities',
    terms_s5_l6:'Interfere with or disrupt the normal operation of the service',
    terms_s5_l7:'Scrape or bulk-extract service data via automated means',
    terms_s5_p2:'Violation of these rules may result in immediate account termination without refund.',
    terms_s6_title:'Your Content & Data',
    terms_s6_p1:'All business data you enter in NUNO belongs entirely to you. We make no claim to any intellectual property rights over your content.',
    terms_s6_p2:'By using the service, you grant us a limited, non-exclusive licence solely for the technical operations necessary to provide the service.',
    terms_s6_l1:'You may export all your data in CSV format at any time via the export feature',
    terms_s6_l2:'Your data will be permanently deleted within 30 days of account closure',
    terms_s6_l3:'We will not use your business data for analytics, advertising or third-party sharing',
    terms_s6_p3:'You are responsible for the accuracy of data you enter. We accept no liability for results generated from incorrect inputs.',
    terms_s7_title:'Intellectual Property',
    terms_s7_p1:'All content in the NUNO service — including but not limited to code, UI design, icons, copy, algorithms and brand assets — is the proprietary property of NUNO LLC, protected by applicable IP laws.',
    terms_s7_p2:'These Terms do not transfer any IP rights to you. You receive only a limited, non-transferable, non-exclusive licence to use the service under these Terms.',
    terms_s7_p3:'Without our written permission, you may not copy, modify, distribute, sell or create derivative works based on our service.',
    terms_s8_title:'Disclaimer of Warranties',
    terms_s8_warn:'Service provided "as is": to the maximum extent permitted by law, NUNO expressly disclaims all warranties, express or implied, including merchantability, fitness for a particular purpose and non-infringement.',
    terms_s8_p1:'We do not warrant that:',
    terms_s8_l1:'The service will be uninterrupted, error-free or fully secure',
    terms_s8_l2:'Any defects in the service will be corrected',
    terms_s8_l3:'Any calculation result is commercially accurate for your situation',
    terms_s8_l4:'The service will meet all of your specific business needs',
    terms_s8_p2:'The final judgement on financial decisions rests with you. NUNO provides data assistance, not business advice.',
    terms_s9_title:'Limitation of Liability',
    terms_s9_p1:'To the maximum extent permitted by law, NUNO LLC and its directors, employees and partners shall not be liable for:',
    terms_s9_l1:'Loss of profits arising from use of or inability to use the service',
    terms_s9_l2:'Losses resulting from business decisions made in reliance on service outputs',
    terms_s9_l3:'Data loss or corruption',
    terms_s9_l4:'Any indirect, incidental, special or punitive damages',
    terms_s9_p2:'In no event shall our total liability to you exceed the total subscription fees you actually paid us in the 12 months preceding the claim.',
    terms_s10_title:'Termination',
    terms_s10_p1:'You may cancel your subscription at any time without giving a reason. After cancellation, your account remains active until the end of the current billing period; fees already paid will not be refunded.',
    terms_s10_p2:'We reserve the right to immediately suspend or terminate your account if:',
    terms_s10_l1:'You breach any provision of these Terms',
    terms_s10_l2:'Your account shows signs of fraudulent or illegal activity',
    terms_s10_l3:'Payment fails for 3 consecutive billing cycles',
    terms_s10_l4:'Required by law or regulation',
    terms_s10_p3:'After termination, you have 30 days to request a data export by contacting support. After 30 days, data will be permanently deleted.',
    terms_s11_title:'Dispute Resolution',
    terms_s11_p1:'If you have a dispute, we encourage you to contact us directly first:',
    terms_s11_l1:'Email hello@nuno.app with a description of the issue',
    terms_s11_l2:'We commit to a formal response within 5 business days',
    terms_s11_l3:'Both parties will negotiate in good faith for up to 30 days',
    terms_s11_p2:'If negotiation fails, both parties agree to binding arbitration rather than class-action litigation.',
    terms_s11_note:'Changes to Terms: we may update these Terms from time to time. Material changes will be notified by email 14 days in advance. Continued use constitutes acceptance.',
    terms_s12_title:'Contact Us',
    terms_s12_p1:'For any questions about these Terms, please contact us:',
    terms_contact_name:'NUNO LLC — Legal Team',
    terms_contact_email:'Email: hi@nudgenow.xyz (Terms matters)',
    terms_contact_general:'General enquiries: hinuno@outlook.com',
    terms_contact_note:'Response within 5 business days.',
    terms_toc1:'Acceptance of Terms',terms_toc2:'Service Description',terms_toc3:'Account Registration & Security',
    terms_toc4:'Subscriptions & Payment',terms_toc5:'Acceptable Use',terms_toc6:'Your Content & Data',
    terms_toc7:'Intellectual Property',terms_toc8:'Disclaimer of Warranties',terms_toc9:'Limitation of Liability',
    terms_toc10:'Termination',terms_toc11:'Dispute Resolution',terms_toc12:'Contact Us',

    /* ── Refund ── */
    refund_badge:'Refund Policy',refund_h1:'Refund Policy',
    refund_sum1_title:'14-Day Free Trial',refund_sum1_sub:'No credit card required; cancel before it ends — no charge',
    refund_sum2_title:'Full Refund Within 7 Days',refund_sum2_sub:'Unconditional refund within 7 days of payment',
    refund_sum3_title:'Edge Cases Reviewed Fairly',refund_sum3_sub:'Contact us even if the window has passed',
    refund_s1_title:'Our Principles',
    refund_s1_p1:'We believe great software should not need to lock users in. NUNO\'s refund policy is built on fairness, transparency and no fuss.',
    refund_s1_p2:'If you are unhappy with NUNO, we want to hear your feedback and improve. We will handle every refund request fairly.',
    refund_s1_note:'Our commitment: all refund requests will receive a formal response within 3 business days; approved refunds will be returned to the original payment method within 5–10 business days.',
    refund_s2_title:'Free Trial Explained',
    refund_s2_p1:'All NUNO plans include a 14-day free trial so you can fully experience the product before paying.',
    refund_s2_l1:'Full feature access during the trial — same as paid users',
    refund_s2_l2:'Cancel any time during the trial — no charge whatsoever',
    refund_s2_l3:'After the trial ends, the system will automatically charge your payment method',
    refund_s2_l4:'We will send a reminder email 3 days before the trial expires',
    refund_s2_note:'Tip: if you are undecided before the trial ends, cancel auto-renewal in account settings to avoid being charged unexpectedly.',
    refund_s3_title:'Eligibility & Scenarios',
    refund_s3_p1:'The table below clearly shows how different situations are handled:',
    refund_th1:'Scenario',refund_th2:'Window',refund_th3:'Outcome',
    refund_r1c1:'Cancel during trial',refund_r1c2:'Within 14-day trial',refund_r1c3:'No refund needed (no charge)',
    refund_r2c1:'Refund request within 7 days of payment',refund_r2c2:'Within 7 days of first charge or renewal',refund_r2c3:'Full refund',
    refund_r3c1:'Refund request 8–30 days after payment',refund_r3c2:'Between 8 and 30 days',refund_r3c3:'Case-by-case review',
    refund_r4c1:'Refund request over 30 days after payment',refund_r4c2:'Over 30 days',refund_r4c3:'Not eligible in principle',
    refund_r5c1:'Service outage preventing use (>24 hrs)',refund_r5c2:'Any time',refund_r5c3:'Pro-rated refund or account credit',
    refund_r6c1:'Duplicate charge (system error)',refund_r6c2:'Any time',refund_r6c3:'Full refund of the duplicate amount',
    refund_r7c1:'Account terminated for policy violation',refund_r7c2:'—',refund_r7c3:'No refund',
    refund_r8c1:'Annual plan cancelled (within 7 days)',refund_r8c2:'Within 7 days of payment',refund_r8c3:'Full refund',
    refund_r9c1:'Annual plan cancelled (after 7 days)',refund_r9c2:'After 7 days',refund_r9c3:'Pro-rated for remaining months (case-by-case)',
    refund_s3_warn:'Note: refunds are returned to the original payment method. Allow 5–10 business days for bank processing. Stripe processing fees are non-refundable (approx. 2.9% of the transaction).',
    refund_s4_title:'How to Request a Refund',
    refund_s4_p1:'Requesting a refund is simple — just follow these steps:',
    refund_step1_title:'Send a refund request email',refund_step1_desc:'Email refund@nuno.app with the subject "Refund Request".',
    refund_step2_title:'Provide the necessary details',refund_step2_desc:'Include: your registered email, payment date, plan name, and reason for the refund (helps us improve, but not mandatory).',
    refund_step3_title:'Wait for our reply',refund_step3_desc:'We will confirm your request within 3 business days. No supporting documents are needed for eligible refunds.',
    refund_step4_title:'Refund received',refund_step4_desc:'Once approved, the amount will be returned to your original payment account within 5–10 business days. You will receive a confirmation email from Stripe.',
    refund_s5_title:'Cancelling Your Subscription',
    refund_s5_p1:'Cancellation and refund are two separate things:',
    refund_s5_l1:'Cancel subscription: stops future renewals; you keep access until the end of the current period',
    refund_s5_l2:'Request a refund: asks for money already paid back (subject to eligibility above)',
    refund_s5_p2:'You can cancel at any time via Account Settings → Subscription Management. Access continues until the end of the current billing cycle.',
    refund_s5_note:'Tip: if you temporarily don\'t need NUNO, cancelling retains your account. Resubscribe anytime — your data is preserved for 90 days.',
    refund_s6_title:'Special Circumstances',
    refund_s6_p1:'We understand every situation is different. The following cases will be reviewed with maximum goodwill:',
    refund_s6_l1:'Billing disputes: contact us within 60 days of discovering a billing error',
    refund_s6_l2:'Unexpected hardship: illness, disaster, etc. — please explain and we will accommodate where possible',
    refund_s6_l3:'Feature mismatch: if you misunderstood what the product does before purchasing, reach out and we\'ll find a fair solution',
    refund_s6_l4:'Price difference: if a promotion launches within 72 hours of your purchase, you may request the difference',
    refund_s6_p2:'We cannot guarantee a refund outside the standard window, but we promise to read every email and reply honestly.',
    refund_s7_title:'Contact Refund Support',
    refund_s7_p1:'For refund requests or related questions, contact our support team:',
    refund_contact_name:'NUNO LLC — Refund Support Team',
    refund_contact_email:'Refund line: hi@nudgenow.xyz (refund requests prioritised)',
    refund_contact_general:'General support: hinuno@outlook.com',
    refund_contact_note:'Hours: Mon–Fri 9:00–18:00 UTC+8. We commit to responding to every refund request within 3 business days.',
    refund_toc1:'Our Principles',refund_toc2:'Free Trial Explained',refund_toc3:'Eligibility & Scenarios',
    refund_toc4:'How to Request a Refund',refund_toc5:'Cancelling Your Subscription',refund_toc6:'Special Circumstances',refund_toc7:'Contact Refund Support',
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

    /* ── Légal partagé ── */
    legal_effective:'En vigueur : 1er janvier 2026',
    legal_updated:'Dernière mise à jour : 30 avril 2026',
    legal_toc:'Sommaire',
    legal_nav_products:'Produits',legal_nav_philosophy:'Philosophie',legal_nav_pricing:'Tarifs',legal_nav_start:'Commencer',

    /* ── Confidentialité ── */
    priv_badge:'Politique de confidentialité',priv_h1:'Politique de confidentialité',
    priv_summary:'En bref : NUNO ne collecte pas votre numéro de téléphone ni votre pièce d\'identité. Nous collectons uniquement le strict nécessaire. Vos données métier vous appartiennent — nous ne les vendons jamais.',
    priv_s1_title:'Ce que nous collectons',
    priv_s1_p1:'Nous appliquons le principe de minimisation des données et ne collectons que ce qui est indispensable.',
    priv_s1_sub1:'Informations que vous fournissez :',
    priv_s1_l1:'Adresse e-mail (pour l\'inscription et la connexion)',
    priv_s1_l2:'Informations de paiement (traitées par Stripe ; NUNO ne stocke jamais votre numéro de carte complet)',
    priv_s1_l3:'Données métier saisies dans l\'application (coûts, stocks, ventes, etc.)',
    priv_s1_sub2:'Collectées automatiquement :',
    priv_s1_l4:'Type d\'appareil, OS, version du navigateur (compatibilité)',
    priv_s1_l5:'Adresse IP (sécurité et détection de région)',
    priv_s1_l6:'Journaux de navigation et fréquence d\'utilisation (amélioration du produit)',
    priv_s1_warn:'Nous ne collectons JAMAIS : numéro de téléphone, numéro de carte d\'identité ou passeport, données biométriques, ni aucune information sensible non liée à votre compte.',
    priv_s2_title:'Comment nous utilisons vos données',
    priv_s2_p1:'Nous utilisons les données collectées uniquement pour :',
    priv_s2_l1:'Fournir, maintenir et améliorer les produits NUNO',
    priv_s2_l2:'Traiter les paiements et envoyer les reçus',
    priv_s2_l3:'Répondre à vos demandes de support',
    priv_s2_l4:'Envoyer des notifications importantes (alertes de sécurité, changements de politique)',
    priv_s2_l5:'Analyser des données d\'utilisation agrégées et anonymisées',
    priv_s2_p2:'Nous n\'utiliserons jamais vos données à des fins publicitaires ciblées, ni ne les vendrons à des tiers.',
    priv_s3_title:'Stockage et sécurité',
    priv_s3_p1:'Vos données sont hébergées sur des serveurs cloud certifiés et protégées par :',
    priv_s3_l1:'Chiffrement en transit (TLS 1.3)',
    priv_s3_l2:'Chiffrement au repos (AES-256)',
    priv_s3_l3:'Audits de sécurité et analyses de vulnérabilités réguliers',
    priv_s3_l4:'Principe du moindre privilège pour l\'accès interne',
    priv_s3_p2:'Les données métier que vous saisissez vous appartiennent exclusivement. Nous ne les analysons à aucune fin commerciale.',
    priv_s3_warn:'Conservation : après suppression du compte, vos données seront définitivement effacées sous 30 jours, sauf obligation légale (ex. registres de paiement, généralement 7 ans).',
    priv_s4_title:'Partage et divulgation',
    priv_s4_p1:'Nous partageons vos données uniquement dans les cas limités suivants :',
    priv_s4_l1:'Traitement des paiements : Stripe Inc. — sa politique de confidentialité s\'applique',
    priv_s4_l2:'Prestataires d\'infrastructure cloud : soumis à des accords de confidentialité stricts',
    priv_s4_l3:'Obligations légales : sur réquisition gouvernementale valide',
    priv_s4_l4:'Cession d\'activité : vous serez notifié à l\'avance et pourrez supprimer votre compte',
    priv_s4_p2:'En dehors de ces cas, nous ne partageons jamais vos données sans votre consentement explicite.',
    priv_s5_title:'Cookies et traceurs',
    priv_s5_p1:'NUNO utilise un nombre minimal de cookies essentiels :',
    priv_s5_l1:'Cookies de session : maintiennent votre connexion ; supprimés à la fermeture du navigateur',
    priv_s5_l2:'Cookies de préférences : mémorisent la langue et les réglages d\'interface',
    priv_s5_l3:'Cookies de sécurité : protection contre les attaques CSRF',
    priv_s5_p2:'Nous n\'utilisons PAS de cookies publicitaires tiers, Facebook Pixel, ni Google Ads Remarketing.',
    priv_s6_title:'Vos droits',
    priv_s6_p1:'Quelle que soit votre localisation, vous disposez des droits suivants :',
    priv_s6_l1:'Accès : consulter les données que nous détenons sur vous',
    priv_s6_l2:'Rectification : corriger des informations inexactes',
    priv_s6_l3:'Suppression : demander l\'effacement de votre compte et de toutes les données associées',
    priv_s6_l4:'Portabilité : exporter vos données métier (CSV/JSON)',
    priv_s6_l5:'Opposition : refuser certains traitements',
    priv_s6_l6:'Retrait du consentement : révoquer tout consentement donné précédemment',
    priv_s6_p2:'Pour exercer ces droits, écrivez à hi@nudgenow.xyz. Réponse sous 30 jours ouvrés.',
    priv_s7_title:'Protection des mineurs',
    priv_s7_p1:'NUNO est destiné aux utilisateurs de 18 ans et plus. Nous ne collectons pas sciemment de données sur des mineurs. Contactez-nous immédiatement si vous pensez que c\'est le cas.',
    priv_s8_title:'Modifications de la politique',
    priv_s8_p1:'Nous pouvons mettre à jour cette politique. En cas de changement majeur, vous serez notifié par :',
    priv_s8_l1:'E-mail envoyé à votre adresse enregistrée',
    priv_s8_l2:'Alerte visible dans l\'application',
    priv_s8_l3:'Mise à jour de la date en haut de cette page',
    priv_s8_p2:'Continuer à utiliser le service vaut acceptation de la politique mise à jour.',
    priv_s9_title:'Nous contacter',
    priv_s9_p1:'Pour toute question sur cette politique, contactez-nous :',
    priv_contact_name:'NUNO LLC — Équipe Confidentialité',
    priv_contact_email:'E-mail : hi@nudgenow.xyz (priorité aux questions de confidentialité)',
    priv_contact_general:'Questions générales : hinuno@outlook.com',
    priv_contact_note:'Réponse initiale sous 5 jours ouvrés.',
    priv_toc1:'Ce que nous collectons',priv_toc2:'Comment nous utilisons vos données',priv_toc3:'Stockage et sécurité',
    priv_toc4:'Partage et divulgation',priv_toc5:'Cookies et traceurs',priv_toc6:'Vos droits',
    priv_toc7:'Protection des mineurs',priv_toc8:'Modifications de la politique',priv_toc9:'Nous contacter',

    /* ── Conditions d'utilisation ── */
    terms_badge:'Conditions d\'utilisation',terms_h1:'Conditions d\'utilisation',
    terms_summary:'En bref : utiliser NUNO signifie accepter ces conditions. NUNO est un outil d\'aide à la décision, pas un comptable. Vous êtes entièrement responsable des décisions prises sur la base de cet outil.',
    terms_s1_title:'Acceptation des conditions',
    terms_s1_p1:'Bienvenue sur NUNO. Ces Conditions constituent un accord légal entre vous et NUNO LLC, applicable à tous les produits et services NUNO, notamment :',
    terms_s1_l1:'Otter Station',terms_s1_l2:'OtterKeeper · Retail',
    terms_s1_l3:'OtterKeeper · Beauté',terms_s1_l4:'OtterKeeper · Restauration',
    terms_s1_p2:'En créant un compte ou en utilisant le service, vous confirmez avoir lu et accepté ces Conditions.',
    terms_s1_p3:'Vous devez avoir au moins 18 ans. Toute personne agissant pour le compte d\'une entreprise doit être habilitée à l\'engager.',
    terms_s2_title:'Description du service',
    terms_s2_p1:'NUNO fournit des outils financiers web pour aider les petits entrepreneurs à comprendre leurs indicateurs clés.',
    terms_s2_warn:'Important : NUNO est un outil de calcul et d\'enregistrement. Il ne constitue PAS un conseil comptable, fiscal, juridique ou financier professionnel. Consultez un expert avant toute décision importante.',
    terms_s2_p2:'Nous nous réservons le droit de modifier, suspendre ou interrompre le service à tout moment sans préavis.',
    terms_s3_title:'Inscription et sécurité du compte',
    terms_s3_p1:'L\'utilisation de NUNO nécessite un compte. Vous devez fournir des informations exactes et les maintenir à jour.',
    terms_s3_p2:'Vous vous engagez à :',
    terms_s3_l1:'Garder vos identifiants confidentiels et ne pas partager votre mot de passe',
    terms_s3_l2:'Nous informer immédiatement de tout accès non autorisé',
    terms_s3_l3:'Assumer la responsabilité de toute activité sous votre compte',
    terms_s3_l4:'Ne pas créer plusieurs comptes pour contourner les limites',
    terms_s3_note:'Un compte, un utilisateur : les plans de base sont individuels. Contactez-nous pour les plans Équipe.',
    terms_s4_title:'Abonnements et paiement',
    terms_s4_p1:'NUNO fonctionne par abonnement. Tous les paiements sont traités par Stripe.',
    terms_s4_l1:'Cycle de facturation : mensuel ou annuel, à partir de la date du premier paiement',
    terms_s4_l2:'Renouvellement automatique : sauf résiliation avant la fin de la période',
    terms_s4_l3:'Changement de prix : 30 jours de préavis par e-mail',
    terms_s4_l4:'Essai gratuit : converti automatiquement en abonnement payant si non résilié',
    terms_s4_l5:'Devise : USD ; le montant débité peut varier selon les taxes locales',
    terms_s4_p2:'En cas d\'échec de paiement, nous nous réservons le droit de suspendre l\'accès.',
    terms_s5_title:'Utilisation acceptable',
    terms_s5_p1:'En utilisant NUNO, vous acceptez de ne pas :',
    terms_s5_l1:'Violer toute loi ou réglementation applicable',
    terms_s5_l2:'Télécharger ou diffuser des logiciels malveillants ou du code nuisible',
    terms_s5_l3:'Tenter d\'accéder sans autorisation à nos systèmes ou aux comptes d\'autres utilisateurs',
    terms_s5_l4:'Procéder à de la rétro-ingénierie ou tenter d\'extraire le code source',
    terms_s5_l5:'Utiliser le service à des fins frauduleuses ou illégales',
    terms_s5_l6:'Perturber le fonctionnement normal du service',
    terms_s5_l7:'Extraire des données de manière automatisée',
    terms_s5_p2:'La violation de ces règles peut entraîner la résiliation immédiate du compte sans remboursement.',
    terms_s6_title:'Votre contenu et vos données',
    terms_s6_p1:'Toutes les données métier que vous saisissez dans NUNO vous appartiennent entièrement.',
    terms_s6_p2:'En utilisant le service, vous nous accordez une licence limitée et non exclusive uniquement pour les opérations techniques nécessaires à la fourniture du service.',
    terms_s6_l1:'Vous pouvez exporter toutes vos données en CSV à tout moment',
    terms_s6_l2:'Vos données seront définitivement supprimées dans les 30 jours suivant la clôture du compte',
    terms_s6_l3:'Nous n\'utilisons pas vos données métier à des fins d\'analyse, de publicité ou de partage',
    terms_s6_p3:'Vous êtes responsable de l\'exactitude des données saisies.',
    terms_s7_title:'Propriété intellectuelle',
    terms_s7_p1:'Tout le contenu du service NUNO — code, design, icônes, textes, algorithmes et marques — est la propriété de NUNO LLC.',
    terms_s7_p2:'Ces Conditions ne vous transfèrent aucun droit de propriété intellectuelle.',
    terms_s7_p3:'Sans notre autorisation écrite, vous ne pouvez pas copier, modifier, distribuer ni créer d\'œuvres dérivées.',
    terms_s8_title:'Exclusion de garanties',
    terms_s8_warn:'Service fourni "en l\'état" : dans la limite permise par la loi, NUNO exclut toutes les garanties expresses ou implicites.',
    terms_s8_p1:'Nous ne garantissons pas :',
    terms_s8_l1:'Que le service sera ininterrompu, sans erreur ou totalement sécurisé',
    terms_s8_l2:'Que tous les défauts seront corrigés',
    terms_s8_l3:'L\'exactitude commerciale des résultats de calcul',
    terms_s8_l4:'Que le service répondra à tous vos besoins spécifiques',
    terms_s8_p2:'La décision finale vous appartient. NUNO fournit une aide aux données, pas des conseils d\'entreprise.',
    terms_s9_title:'Limitation de responsabilité',
    terms_s9_p1:'Dans la limite permise par la loi, NUNO LLC et ses dirigeants ne seront pas responsables de :',
    terms_s9_l1:'Pertes de bénéfices liées à l\'utilisation ou à l\'impossibilité d\'utiliser le service',
    terms_s9_l2:'Pertes résultant de décisions fondées sur les résultats du service',
    terms_s9_l3:'Perte ou corruption de données',
    terms_s9_l4:'Dommages indirects, accessoires, spéciaux ou punitifs',
    terms_s9_p2:'Notre responsabilité totale ne dépassera en aucun cas les abonnements effectivement payés au cours des 12 mois précédant la réclamation.',
    terms_s10_title:'Résiliation',
    terms_s10_p1:'Vous pouvez résilier à tout moment sans motif. L\'accès se poursuit jusqu\'à la fin de la période en cours.',
    terms_s10_p2:'Nous pouvons immédiatement suspendre ou résilier votre compte si :',
    terms_s10_l1:'Vous enfreignez ces Conditions',
    terms_s10_l2:'Votre compte présente des signes de fraude ou d\'activité illégale',
    terms_s10_l3:'Le paiement échoue 3 cycles consécutifs',
    terms_s10_l4:'La loi ou la réglementation l\'exige',
    terms_s10_p3:'Après résiliation, vous disposez de 30 jours pour exporter vos données. Passé ce délai, elles seront définitivement supprimées.',
    terms_s11_title:'Règlement des litiges',
    terms_s11_p1:'En cas de litige, nous vous encourageons à nous contacter directement :',
    terms_s11_l1:'Envoyez un e-mail à hello@nuno.app en décrivant le problème',
    terms_s11_l2:'Réponse formelle sous 5 jours ouvrés',
    terms_s11_l3:'Négociation de bonne foi pendant 30 jours',
    terms_s11_p2:'En cas d\'échec, les parties conviennent d\'un arbitrage contraignant plutôt que d\'une action collective.',
    terms_s11_note:'Modifications : nous pouvons mettre à jour ces Conditions. Les changements importants seront notifiés 14 jours à l\'avance.',
    terms_s12_title:'Nous contacter',
    terms_s12_p1:'Pour toute question sur ces Conditions :',
    terms_contact_name:'NUNO LLC — Équipe Juridique',
    terms_contact_email:'E-mail : hi@nudgenow.xyz',
    terms_contact_general:'Questions générales : hinuno@outlook.com',
    terms_contact_note:'Réponse sous 5 jours ouvrés.',
    terms_toc1:'Acceptation des conditions',terms_toc2:'Description du service',terms_toc3:'Inscription et sécurité',
    terms_toc4:'Abonnements et paiement',terms_toc5:'Utilisation acceptable',terms_toc6:'Votre contenu',
    terms_toc7:'Propriété intellectuelle',terms_toc8:'Exclusion de garanties',terms_toc9:'Limitation de responsabilité',
    terms_toc10:'Résiliation',terms_toc11:'Règlement des litiges',terms_toc12:'Nous contacter',

    /* ── Remboursement ── */
    refund_badge:'Politique de remboursement',refund_h1:'Politique de remboursement',
    refund_sum1_title:'14 jours d\'essai gratuit',refund_sum1_sub:'Sans CB ; résiliez avant la fin — aucun frais',
    refund_sum2_title:'Remboursement complet sous 7 jours',refund_sum2_sub:'Remboursement sans condition dans les 7 jours',
    refund_sum3_title:'Cas particuliers examinés',refund_sum3_sub:'Contactez-nous même hors délai',
    refund_s1_title:'Nos principes',
    refund_s1_p1:'Nous croyons qu\'un bon logiciel ne doit pas forcer la fidélité. Notre politique est fondée sur l\'équité, la transparence et la simplicité.',
    refund_s1_p2:'Si vous n\'êtes pas satisfait, faites-le nous savoir. Nous traitons chaque demande équitablement.',
    refund_s1_note:'Notre engagement : réponse formelle sous 3 jours ouvrés ; remboursements approuvés traités sous 5 à 10 jours ouvrés.',
    refund_s2_title:'Essai gratuit',
    refund_s2_p1:'Tous les plans NUNO incluent 14 jours d\'essai gratuit.',
    refund_s2_l1:'Accès complet aux fonctionnalités pendant l\'essai',
    refund_s2_l2:'Résiliation possible à tout moment — aucun frais',
    refund_s2_l3:'Après l\'essai, le paiement est prélevé automatiquement',
    refund_s2_l4:'Un rappel est envoyé 3 jours avant la fin de l\'essai',
    refund_s2_note:'Conseil : si vous n\'avez pas décidé, désactivez le renouvellement automatique dans les paramètres du compte.',
    refund_s3_title:'Éligibilité et scénarios',
    refund_s3_p1:'Le tableau ci-dessous indique clairement le traitement selon les situations :',
    refund_th1:'Scénario',refund_th2:'Délai',refund_th3:'Résultat',
    refund_r1c1:'Résiliation pendant l\'essai',refund_r1c2:'Pendant les 14 jours',refund_r1c3:'Aucun remboursement nécessaire',
    refund_r2c1:'Demande dans les 7 jours suivant le paiement',refund_r2c2:'Dans les 7 jours',refund_r2c3:'Remboursement complet',
    refund_r3c1:'Demande entre 8 et 30 jours après le paiement',refund_r3c2:'Entre 8 et 30 jours',refund_r3c3:'Examen au cas par cas',
    refund_r4c1:'Demande après 30 jours',refund_r4c2:'Après 30 jours',refund_r4c3:'Non éligible en principe',
    refund_r5c1:'Panne de service (>24 h)',refund_r5c2:'À tout moment',refund_r5c3:'Remboursement au prorata ou crédit',
    refund_r6c1:'Double facturation (erreur système)',refund_r6c2:'À tout moment',refund_r6c3:'Remboursement du trop-perçu',
    refund_r7c1:'Compte résilié pour infraction',refund_r7c2:'—',refund_r7c3:'Aucun remboursement',
    refund_r8c1:'Résiliation plan annuel (dans les 7 jours)',refund_r8c2:'Dans les 7 jours',refund_r8c3:'Remboursement complet',
    refund_r9c1:'Résiliation plan annuel (après 7 jours)',refund_r9c2:'Après 7 jours',refund_r9c3:'Au prorata des mois restants (cas par cas)',
    refund_s3_warn:'Note : les remboursements sont effectués sur le moyen de paiement d\'origine. Comptez 5 à 10 jours ouvrés. Les frais Stripe (environ 2,9 %) ne sont pas remboursables.',
    refund_s4_title:'Comment demander un remboursement',
    refund_s4_p1:'La procédure est simple :',
    refund_step1_title:'Envoyez un e-mail',refund_step1_desc:'Écrivez à refund@nuno.app avec l\'objet "Demande de remboursement".',
    refund_step2_title:'Fournissez les informations',refund_step2_desc:'Indiquez : e-mail du compte, date de paiement, nom du plan et motif (facultatif).',
    refund_step3_title:'Attendez notre réponse',refund_step3_desc:'Confirmation sous 3 jours ouvrés. Aucun justificatif requis pour les demandes éligibles.',
    refund_step4_title:'Réception du remboursement',refund_step4_desc:'Une fois approuvé, le montant est restitué sous 5 à 10 jours ouvrés. Stripe vous enverra une confirmation.',
    refund_s5_title:'Résiliation de l\'abonnement',
    refund_s5_p1:'Résiliation et remboursement sont deux choses distinctes :',
    refund_s5_l1:'Résilier : arrête les futurs prélèvements ; l\'accès se poursuit jusqu\'à la fin de la période',
    refund_s5_l2:'Demander un remboursement : récupérer des sommes déjà payées (sous conditions)',
    refund_s5_p2:'Vous pouvez résilier à tout moment via Paramètres → Gestion de l\'abonnement.',
    refund_s5_note:'Astuce : si vous n\'avez temporairement pas besoin de NUNO, résiliez et conservez votre compte. Vos données sont préservées 90 jours.',
    refund_s6_title:'Circonstances particulières',
    refund_s6_p1:'Nous examinons les cas suivants avec bienveillance :',
    refund_s6_l1:'Litige de facturation : contactez-nous dans les 60 jours suivant la découverte de l\'erreur',
    refund_s6_l2:'Cas de force majeure : maladie, catastrophe — expliquez et nous ferons de notre mieux',
    refund_s6_l3:'Fonctionnalité mal comprise : si vous avez mal interprété le produit avant l\'achat, discutons',
    refund_s6_l4:'Différence de prix : si une promotion est lancée dans les 72 h suivant votre achat, vous pouvez demander la différence',
    refund_s6_p2:'Nous ne promettons pas de remboursement hors délai, mais nous nous engageons à répondre honnêtement.',
    refund_s7_title:'Contacter le support remboursement',
    refund_s7_p1:'Pour toute demande de remboursement :',
    refund_contact_name:'NUNO LLC — Support Remboursement',
    refund_contact_email:'Ligne remboursement : hi@nudgenow.xyz',
    refund_contact_general:'Support général : hinuno@outlook.com',
    refund_contact_note:'Horaires : lun.–ven. 9h–18h UTC+8. Réponse sous 3 jours ouvrés.',
    refund_toc1:'Nos principes',refund_toc2:'Essai gratuit',refund_toc3:'Éligibilité et scénarios',
    refund_toc4:'Comment demander un remboursement',refund_toc5:'Résiliation',refund_toc6:'Circonstances particulières',refund_toc7:'Contact support',
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

    /* ── Pháp lý chung ── */
    legal_effective:'Có hiệu lực: 1 tháng 1 năm 2026',
    legal_updated:'Cập nhật lần cuối: 30 tháng 4 năm 2026',
    legal_toc:'Mục lục',
    legal_nav_products:'Sản phẩm',legal_nav_philosophy:'Triết lý',legal_nav_pricing:'Bảng giá',legal_nav_start:'Bắt đầu miễn phí',

    /* ── Chính sách bảo mật ── */
    priv_badge:'Chính sách bảo mật',priv_h1:'Chính sách bảo mật',
    priv_summary:'Tóm tắt: NUNO không thu thập số điện thoại hay giấy tờ tùy thân của bạn. Chúng tôi chỉ thu thập thông tin tối thiểu cần thiết. Dữ liệu kinh doanh thuộc về bạn — chúng tôi không bao giờ bán nó.',
    priv_s1_title:'Chúng tôi thu thập gì',
    priv_s1_p1:'Chúng tôi áp dụng nguyên tắc thu thập dữ liệu tối thiểu, chỉ lấy những gì cần thiết để vận hành dịch vụ.',
    priv_s1_sub1:'Thông tin bạn cung cấp:',
    priv_s1_l1:'Địa chỉ email (để đăng ký và đăng nhập)',
    priv_s1_l2:'Thông tin thanh toán (do Stripe xử lý; NUNO không lưu số thẻ đầy đủ)',
    priv_s1_l3:'Dữ liệu kinh doanh bạn nhập vào ứng dụng (chi phí, tồn kho, doanh thu…)',
    priv_s1_sub2:'Thu thập tự động:',
    priv_s1_l4:'Loại thiết bị, hệ điều hành, phiên bản trình duyệt (để tối ưu tương thích)',
    priv_s1_l5:'Địa chỉ IP (bảo mật và xác định khu vực)',
    priv_s1_l6:'Nhật ký truy cập trang và tần suất sử dụng tính năng (cải thiện sản phẩm)',
    priv_s1_warn:'Chúng tôi KHÔNG thu thập: số điện thoại, số CMND/hộ chiếu, dữ liệu sinh trắc học, hay bất kỳ thông tin nhạy cảm nào không liên quan đến tài khoản của bạn.',
    priv_s2_title:'Cách chúng tôi sử dụng thông tin',
    priv_s2_p1:'Chúng tôi sử dụng thông tin thu thập chỉ cho các mục đích sau:',
    priv_s2_l1:'Cung cấp, duy trì và cải thiện các sản phẩm NUNO',
    priv_s2_l2:'Xử lý thanh toán đăng ký và gửi hóa đơn',
    priv_s2_l3:'Phản hồi yêu cầu hỗ trợ của bạn',
    priv_s2_l4:'Gửi thông báo dịch vụ quan trọng (cảnh báo bảo mật, thay đổi chính sách)',
    priv_s2_l5:'Phân tích dữ liệu sử dụng tổng hợp, ẩn danh để cải thiện sản phẩm',
    priv_s2_p2:'Chúng tôi sẽ không bao giờ dùng thông tin của bạn cho quảng cáo mục tiêu, hay bán, cho thuê hoặc chuyển nhượng cho bên thứ ba vì mục đích thương mại.',
    priv_s3_title:'Lưu trữ và bảo mật',
    priv_s3_p1:'Dữ liệu của bạn được lưu trên máy chủ đám mây được chứng nhận và bảo vệ bởi:',
    priv_s3_l1:'Mã hóa truyền dữ liệu (TLS 1.3)',
    priv_s3_l2:'Mã hóa dữ liệu lưu trữ (AES-256)',
    priv_s3_l3:'Kiểm toán bảo mật và quét lỗ hổng định kỳ',
    priv_s3_l4:'Nguyên tắc đặc quyền tối thiểu — nhân viên nội bộ cần phê duyệt mới được truy cập',
    priv_s3_p2:'Dữ liệu kinh doanh bạn nhập vào NUNO hoàn toàn thuộc về bạn. Chúng tôi không phân tích dữ liệu đó cho bất kỳ mục đích thương mại nào.',
    priv_s3_warn:'Lưu giữ dữ liệu: sau khi xóa tài khoản, dữ liệu cá nhân và kinh doanh của bạn sẽ bị xóa vĩnh viễn trong vòng 30 ngày, trừ hồ sơ theo yêu cầu pháp lý (ví dụ: hồ sơ thanh toán, thường 7 năm).',
    priv_s4_title:'Chia sẻ và tiết lộ',
    priv_s4_p1:'Chúng tôi chỉ chia sẻ thông tin trong các trường hợp hạn chế sau:',
    priv_s4_l1:'Xử lý thanh toán: Stripe Inc. — chính sách bảo mật của họ áp dụng cho dữ liệu thanh toán',
    priv_s4_l2:'Nhà cung cấp hạ tầng đám mây: bị ràng buộc bởi thỏa thuận bảo mật nghiêm ngặt',
    priv_s4_l3:'Yêu cầu pháp lý: khi nhận được lệnh chính phủ hợp lệ',
    priv_s4_l4:'Chuyển nhượng doanh nghiệp: bạn sẽ được thông báo trước và có thể xóa tài khoản trước khi chuyển',
    priv_s4_p2:'Ngoài các trường hợp trên, chúng tôi không bao giờ chia sẻ thông tin của bạn mà không có sự đồng ý rõ ràng.',
    priv_s5_title:'Cookie và công nghệ theo dõi',
    priv_s5_p1:'NUNO sử dụng số lượng tối thiểu cookie cần thiết:',
    priv_s5_l1:'Cookie phiên: duy trì trạng thái đăng nhập; xóa khi đóng trình duyệt',
    priv_s5_l2:'Cookie tùy chọn: ghi nhớ ngôn ngữ và cài đặt giao diện',
    priv_s5_l3:'Cookie bảo mật: bảo vệ chống tấn công CSRF',
    priv_s5_p2:'Chúng tôi KHÔNG sử dụng cookie quảng cáo của bên thứ ba, Facebook Pixel hay Google Ads Remarketing.',
    priv_s6_title:'Quyền của bạn',
    priv_s6_p1:'Bất kể khu vực của bạn, bạn có các quyền sau đối với dữ liệu của mình:',
    priv_s6_l1:'Quyền truy cập: xem thông tin chúng tôi lưu giữ về bạn',
    priv_s6_l2:'Quyền chỉnh sửa: cập nhật thông tin cá nhân không chính xác',
    priv_s6_l3:'Quyền xóa: yêu cầu xóa tài khoản và toàn bộ dữ liệu liên quan',
    priv_s6_l4:'Quyền di chuyển dữ liệu: xuất dữ liệu kinh doanh (CSV/JSON)',
    priv_s6_l5:'Quyền phản đối: từ chối một số hoạt động xử lý dữ liệu',
    priv_s6_l6:'Thu hồi đồng ý: rút lại bất kỳ đồng ý nào bạn đã cấp trước đó',
    priv_s6_p2:'Để thực hiện các quyền này, email hi@nudgenow.xyz. Phản hồi trong vòng 30 ngày làm việc.',
    priv_s7_title:'Quyền riêng tư của trẻ em',
    priv_s7_p1:'NUNO dành cho người dùng từ 18 tuổi trở lên. Chúng tôi không cố tình thu thập thông tin cá nhân của trẻ vị thành niên. Vui lòng liên hệ ngay nếu bạn cho rằng chúng tôi đã vô tình làm vậy.',
    priv_s8_title:'Thay đổi chính sách',
    priv_s8_p1:'Chúng tôi có thể cập nhật Chính sách bảo mật này. Với các thay đổi quan trọng, chúng tôi sẽ thông báo qua:',
    priv_s8_l1:'Email gửi đến địa chỉ đăng ký của bạn',
    priv_s8_l2:'Thông báo nổi bật trong ứng dụng',
    priv_s8_l3:'Cập nhật ngày "Cập nhật lần cuối" ở đầu trang này',
    priv_s8_p2:'Tiếp tục sử dụng dịch vụ sau khi thay đổi có hiệu lực đồng nghĩa với việc bạn chấp nhận chính sách đã cập nhật.',
    priv_s9_title:'Liên hệ chúng tôi',
    priv_s9_p1:'Mọi thắc mắc về Chính sách bảo mật, vui lòng liên hệ:',
    priv_contact_name:'NUNO LLC — Đội ngũ Bảo mật',
    priv_contact_email:'Email: hi@nudgenow.xyz (ưu tiên vấn đề bảo mật)',
    priv_contact_general:'Hỏi đáp chung: hinuno@outlook.com',
    priv_contact_note:'Chúng tôi cam kết phản hồi trong vòng 5 ngày làm việc.',
    priv_toc1:'Chúng tôi thu thập gì',priv_toc2:'Cách sử dụng thông tin',priv_toc3:'Lưu trữ và bảo mật',
    priv_toc4:'Chia sẻ và tiết lộ',priv_toc5:'Cookie và theo dõi',priv_toc6:'Quyền của bạn',
    priv_toc7:'Quyền riêng tư trẻ em',priv_toc8:'Thay đổi chính sách',priv_toc9:'Liên hệ',

    /* ── Điều khoản dịch vụ ── */
    terms_badge:'Điều khoản dịch vụ',terms_h1:'Điều khoản dịch vụ',
    terms_summary:'Tóm tắt: Sử dụng NUNO đồng nghĩa với việc đồng ý các điều khoản này. NUNO là công cụ hỗ trợ quyết định, không phải kế toán viên. Bạn hoàn toàn chịu trách nhiệm về các quyết định kinh doanh dựa trên công cụ này.',
    terms_s1_title:'Chấp nhận điều khoản',
    terms_s1_p1:'Chào mừng đến với NUNO. Điều khoản Dịch vụ này là thỏa thuận pháp lý giữa bạn và NUNO LLC, áp dụng cho tất cả sản phẩm và dịch vụ NUNO, bao gồm:',
    terms_s1_l1:'Otter Station',terms_s1_l2:'OtterKeeper · Bán Lẻ',
    terms_s1_l3:'OtterKeeper · Làm Đẹp',terms_s1_l4:'OtterKeeper · Nhà Hàng',
    terms_s1_p2:'Bằng cách đăng ký tài khoản hoặc sử dụng dịch vụ, bạn xác nhận đã đọc, hiểu và đồng ý bị ràng buộc bởi các Điều khoản này.',
    terms_s1_p3:'Bạn phải đủ 18 tuổi để sử dụng dịch vụ. Người đại diện doanh nghiệp phải có thẩm quyền ký kết thỏa thuận.',
    terms_s2_title:'Mô tả dịch vụ',
    terms_s2_p1:'NUNO cung cấp bộ công cụ tài chính trên web giúp chủ doanh nghiệp nhỏ hiểu và theo dõi các chỉ số tài chính cơ bản.',
    terms_s2_warn:'Quan trọng: NUNO là công cụ tính toán và ghi chép hỗ trợ. KHÔNG cấu thành tư vấn kế toán, thuế, pháp lý hay đầu tư chuyên nghiệp. Hãy tham khảo chuyên gia trước khi đưa ra quyết định kinh doanh quan trọng.',
    terms_s2_p2:'Chúng tôi bảo lưu quyền sửa đổi, tạm dừng hoặc ngừng dịch vụ bất kỳ lúc nào mà không cần thông báo trước.',
    terms_s3_title:'Đăng ký tài khoản và bảo mật',
    terms_s3_p1:'Sử dụng NUNO yêu cầu tạo tài khoản. Bạn phải cung cấp thông tin trung thực, chính xác và cập nhật khi có thay đổi.',
    terms_s3_p2:'Bạn đồng ý:',
    terms_s3_l1:'Bảo mật thông tin đăng nhập và không chia sẻ mật khẩu',
    terms_s3_l2:'Thông báo ngay cho chúng tôi nếu phát hiện truy cập trái phép',
    terms_s3_l3:'Chịu trách nhiệm về mọi hoạt động dưới tài khoản của bạn',
    terms_s3_l4:'Không tạo nhiều tài khoản để lách các giới hạn sử dụng',
    terms_s3_note:'Một tài khoản, một người dùng: gói cơ bản dành cho cá nhân. Liên hệ chúng tôi để biết gói Nhóm.',
    terms_s4_title:'Đăng ký và thanh toán',
    terms_s4_p1:'NUNO sử dụng mô hình đăng ký. Tất cả thanh toán được xử lý an toàn qua Stripe.',
    terms_s4_l1:'Chu kỳ thanh toán: hàng tháng hoặc hàng năm, tính từ ngày thanh toán đầu tiên',
    terms_s4_l2:'Tự động gia hạn: đăng ký tự động gia hạn trừ khi bạn hủy trước',
    terms_s4_l3:'Thay đổi giá: thông báo trước 30 ngày qua email',
    terms_s4_l4:'Dùng thử miễn phí: tự động chuyển sang trả phí nếu không hủy trước khi hết hạn',
    terms_s4_l5:'Tiền tệ: tất cả giá tính bằng USD; số tiền thực tế có thể thay đổi do thuế địa phương',
    terms_s4_p2:'Nếu thanh toán thất bại, chúng tôi bảo lưu quyền tạm dừng hoặc chấm dứt quyền truy cập.',
    terms_s5_title:'Quy tắc sử dụng',
    terms_s5_p1:'Khi sử dụng NUNO, bạn đồng ý không:',
    terms_s5_l1:'Vi phạm bất kỳ luật hoặc quy định hiện hành nào',
    terms_s5_l2:'Tải lên hoặc phát tán phần mềm độc hại, virus hay mã có hại',
    terms_s5_l3:'Cố gắng truy cập trái phép hệ thống hoặc tài khoản người dùng khác',
    terms_s5_l4:'Dịch ngược, dịch mã hoặc cố gắng trích xuất mã nguồn',
    terms_s5_l5:'Sử dụng dịch vụ cho các hoạt động gian lận, rửa tiền hoặc bất hợp pháp',
    terms_s5_l6:'Can thiệp hoặc phá vỡ hoạt động bình thường của dịch vụ',
    terms_s5_l7:'Cào dữ liệu hoặc trích xuất hàng loạt bằng phương tiện tự động',
    terms_s5_p2:'Vi phạm các quy tắc này có thể dẫn đến chấm dứt tài khoản ngay lập tức mà không hoàn tiền.',
    terms_s6_title:'Nội dung và dữ liệu của bạn',
    terms_s6_p1:'Tất cả dữ liệu kinh doanh bạn nhập vào NUNO hoàn toàn thuộc về bạn. Chúng tôi không có bất kỳ quyền sở hữu trí tuệ nào đối với nội dung của bạn.',
    terms_s6_p2:'Bằng cách sử dụng dịch vụ, bạn cấp cho chúng tôi giấy phép hạn chế, không độc quyền chỉ để thực hiện các hoạt động kỹ thuật cần thiết.',
    terms_s6_l1:'Bạn có thể xuất toàn bộ dữ liệu dạng CSV bất kỳ lúc nào',
    terms_s6_l2:'Dữ liệu sẽ bị xóa vĩnh viễn trong vòng 30 ngày sau khi đóng tài khoản',
    terms_s6_l3:'Chúng tôi không dùng dữ liệu kinh doanh của bạn cho phân tích, quảng cáo hay chia sẻ',
    terms_s6_p3:'Bạn chịu trách nhiệm về tính chính xác của dữ liệu nhập vào.',
    terms_s7_title:'Sở hữu trí tuệ',
    terms_s7_p1:'Toàn bộ nội dung dịch vụ NUNO — mã, thiết kế, biểu tượng, văn bản, thuật toán và thương hiệu — là tài sản độc quyền của NUNO LLC.',
    terms_s7_p2:'Các Điều khoản này không chuyển nhượng bất kỳ quyền sở hữu trí tuệ nào cho bạn.',
    terms_s7_p3:'Không có sự cho phép bằng văn bản của chúng tôi, bạn không được sao chép, sửa đổi, phân phối hay tạo tác phẩm phái sinh.',
    terms_s8_title:'Tuyên bố từ chối bảo hành',
    terms_s8_warn:'Dịch vụ cung cấp "nguyên trạng": trong phạm vi pháp luật cho phép, NUNO từ chối rõ ràng tất cả bảo hành, dù rõ ràng hay ngụ ý.',
    terms_s8_p1:'Chúng tôi không bảo đảm rằng:',
    terms_s8_l1:'Dịch vụ sẽ không bị gián đoạn, không có lỗi hoặc hoàn toàn an toàn',
    terms_s8_l2:'Bất kỳ lỗi nào trong dịch vụ sẽ được sửa chữa',
    terms_s8_l3:'Kết quả tính toán có độ chính xác thương mại cho tình huống của bạn',
    terms_s8_l4:'Dịch vụ đáp ứng tất cả nhu cầu kinh doanh cụ thể của bạn',
    terms_s8_p2:'Quyết định tài chính cuối cùng thuộc về bạn. NUNO cung cấp hỗ trợ dữ liệu, không phải tư vấn kinh doanh.',
    terms_s9_title:'Giới hạn trách nhiệm',
    terms_s9_p1:'Trong phạm vi pháp luật cho phép, NUNO LLC và các giám đốc, nhân viên, đối tác không chịu trách nhiệm về:',
    terms_s9_l1:'Mất lợi nhuận do sử dụng hoặc không thể sử dụng dịch vụ',
    terms_s9_l2:'Tổn thất do quyết định kinh doanh dựa trên kết quả dịch vụ',
    terms_s9_l3:'Mất hoặc hỏng dữ liệu',
    terms_s9_l4:'Bất kỳ thiệt hại gián tiếp, ngẫu nhiên, đặc biệt hay trừng phạt nào',
    terms_s9_p2:'Trong mọi trường hợp, tổng trách nhiệm của chúng tôi không vượt quá phí đăng ký bạn thực sự đã trả trong 12 tháng trước khiếu nại.',
    terms_s10_title:'Chấm dứt dịch vụ',
    terms_s10_p1:'Bạn có thể hủy đăng ký bất kỳ lúc nào mà không cần nêu lý do. Sau khi hủy, tài khoản vẫn hoạt động đến cuối chu kỳ thanh toán hiện tại.',
    terms_s10_p2:'Chúng tôi bảo lưu quyền tạm dừng hoặc chấm dứt tài khoản ngay lập tức nếu:',
    terms_s10_l1:'Bạn vi phạm bất kỳ điều khoản nào',
    terms_s10_l2:'Tài khoản có dấu hiệu gian lận hoặc hoạt động bất hợp pháp',
    terms_s10_l3:'Thanh toán thất bại 3 chu kỳ liên tiếp',
    terms_s10_l4:'Yêu cầu pháp lý hoặc quy định',
    terms_s10_p3:'Sau khi chấm dứt, bạn có 30 ngày để yêu cầu xuất dữ liệu. Sau 30 ngày, dữ liệu sẽ bị xóa vĩnh viễn.',
    terms_s11_title:'Giải quyết tranh chấp',
    terms_s11_p1:'Nếu có tranh chấp, chúng tôi khuyến khích bạn liên hệ trực tiếp với chúng tôi trước:',
    terms_s11_l1:'Email hello@nuno.app mô tả vấn đề',
    terms_s11_l2:'Phản hồi chính thức trong vòng 5 ngày làm việc',
    terms_s11_l3:'Hai bên thương lượng thiện chí trong tối đa 30 ngày',
    terms_s11_p2:'Nếu thương lượng thất bại, hai bên đồng ý trọng tài ràng buộc thay vì kiện tập thể.',
    terms_s11_note:'Thay đổi điều khoản: chúng tôi có thể cập nhật các Điều khoản này. Thay đổi quan trọng sẽ được thông báo qua email trước 14 ngày.',
    terms_s12_title:'Liên hệ chúng tôi',
    terms_s12_p1:'Mọi câu hỏi về các Điều khoản này:',
    terms_contact_name:'NUNO LLC — Đội ngũ Pháp lý',
    terms_contact_email:'Email: hi@nudgenow.xyz',
    terms_contact_general:'Hỏi đáp chung: hinuno@outlook.com',
    terms_contact_note:'Phản hồi trong vòng 5 ngày làm việc.',
    terms_toc1:'Chấp nhận điều khoản',terms_toc2:'Mô tả dịch vụ',terms_toc3:'Đăng ký và bảo mật',
    terms_toc4:'Đăng ký và thanh toán',terms_toc5:'Quy tắc sử dụng',terms_toc6:'Nội dung của bạn',
    terms_toc7:'Sở hữu trí tuệ',terms_toc8:'Từ chối bảo hành',terms_toc9:'Giới hạn trách nhiệm',
    terms_toc10:'Chấm dứt dịch vụ',terms_toc11:'Giải quyết tranh chấp',terms_toc12:'Liên hệ',

    /* ── Chính sách hoàn tiền ── */
    refund_badge:'Chính sách hoàn tiền',refund_h1:'Chính sách hoàn tiền',
    refund_sum1_title:'14 ngày dùng thử miễn phí',refund_sum1_sub:'Không cần thẻ; hủy trước khi hết hạn — không tính phí',
    refund_sum2_title:'Hoàn tiền trong 7 ngày',refund_sum2_sub:'Hoàn tiền không điều kiện trong 7 ngày',
    refund_sum3_title:'Trường hợp đặc biệt được xem xét',refund_sum3_sub:'Liên hệ dù đã hết thời hạn',
    refund_s1_title:'Nguyên tắc của chúng tôi',
    refund_s1_p1:'Chúng tôi tin rằng phần mềm tốt không cần khóa chặt người dùng. Chính sách hoàn tiền của NUNO dựa trên sự công bằng, minh bạch và không rắc rối.',
    refund_s1_p2:'Nếu bạn không hài lòng, chúng tôi muốn nghe phản hồi và cải thiện. Chúng tôi xử lý mọi yêu cầu hoàn tiền một cách công bằng.',
    refund_s1_note:'Cam kết của chúng tôi: mọi yêu cầu hoàn tiền sẽ nhận được phản hồi trong 3 ngày làm việc; hoàn tiền được chấp thuận sẽ được xử lý trong 5–10 ngày làm việc.',
    refund_s2_title:'Giải thích về dùng thử miễn phí',
    refund_s2_p1:'Tất cả gói NUNO đều có 14 ngày dùng thử miễn phí để bạn trải nghiệm đầy đủ trước khi thanh toán.',
    refund_s2_l1:'Quyền truy cập đầy đủ trong thời gian dùng thử — giống người dùng trả phí',
    refund_s2_l2:'Hủy bất kỳ lúc nào trong thời gian dùng thử — không tính bất kỳ phí nào',
    refund_s2_l3:'Sau khi hết thời gian dùng thử, hệ thống sẽ tự động tính phí',
    refund_s2_l4:'Chúng tôi sẽ gửi email nhắc nhở 3 ngày trước khi hết dùng thử',
    refund_s2_note:'Mẹo: nếu chưa quyết định trước khi hết thời gian dùng thử, hãy tắt tự động gia hạn trong cài đặt tài khoản.',
    refund_s3_title:'Điều kiện và các tình huống',
    refund_s3_p1:'Bảng dưới đây cho thấy rõ cách xử lý các tình huống khác nhau:',
    refund_th1:'Tình huống',refund_th2:'Thời hạn',refund_th3:'Kết quả',
    refund_r1c1:'Hủy trong thời gian dùng thử',refund_r1c2:'Trong 14 ngày dùng thử',refund_r1c3:'Không cần hoàn tiền (chưa tính phí)',
    refund_r2c1:'Yêu cầu trong 7 ngày sau thanh toán',refund_r2c2:'Trong 7 ngày',refund_r2c3:'Hoàn tiền toàn bộ',
    refund_r3c1:'Yêu cầu 8–30 ngày sau thanh toán',refund_r3c2:'Từ 8 đến 30 ngày',refund_r3c3:'Xem xét từng trường hợp',
    refund_r4c1:'Yêu cầu sau 30 ngày',refund_r4c2:'Sau 30 ngày',refund_r4c3:'Về nguyên tắc không đủ điều kiện',
    refund_r5c1:'Dịch vụ gián đoạn (>24 giờ)',refund_r5c2:'Bất kỳ lúc nào',refund_r5c3:'Hoàn tiền theo tỷ lệ hoặc bù đắp tín dụng',
    refund_r6c1:'Tính phí trùng lặp (lỗi hệ thống)',refund_r6c2:'Bất kỳ lúc nào',refund_r6c3:'Hoàn tiền toàn bộ khoản dư',
    refund_r7c1:'Tài khoản bị chấm dứt do vi phạm',refund_r7c2:'—',refund_r7c3:'Không hoàn tiền',
    refund_r8c1:'Hủy gói năm (trong 7 ngày)',refund_r8c2:'Trong 7 ngày',refund_r8c3:'Hoàn tiền toàn bộ',
    refund_r9c1:'Hủy gói năm (sau 7 ngày)',refund_r9c2:'Sau 7 ngày',refund_r9c3:'Theo tỷ lệ tháng còn lại (từng trường hợp)',
    refund_s3_warn:'Lưu ý: hoàn tiền về phương thức thanh toán gốc. Chờ 5–10 ngày làm việc để ngân hàng xử lý. Phí Stripe (khoảng 2,9%) không được hoàn lại.',
    refund_s4_title:'Cách yêu cầu hoàn tiền',
    refund_s4_p1:'Yêu cầu hoàn tiền rất đơn giản — chỉ cần làm theo các bước sau:',
    refund_step1_title:'Gửi email yêu cầu',refund_step1_desc:'Email đến refund@nuno.app với tiêu đề "Yêu cầu hoàn tiền".',
    refund_step2_title:'Cung cấp thông tin cần thiết',refund_step2_desc:'Ghi rõ: email đăng ký, ngày thanh toán, tên gói, lý do hoàn tiền (không bắt buộc).',
    refund_step3_title:'Chờ phản hồi',refund_step3_desc:'Chúng tôi sẽ xác nhận yêu cầu trong 3 ngày làm việc. Không cần tài liệu chứng minh cho các yêu cầu đủ điều kiện.',
    refund_step4_title:'Nhận hoàn tiền',refund_step4_desc:'Sau khi được phê duyệt, tiền sẽ được hoàn trong 5–10 ngày làm việc. Bạn sẽ nhận email xác nhận từ Stripe.',
    refund_s5_title:'Hủy đăng ký',
    refund_s5_p1:'Hủy đăng ký và yêu cầu hoàn tiền là hai việc khác nhau:',
    refund_s5_l1:'Hủy đăng ký: dừng gia hạn; bạn vẫn có quyền truy cập đến cuối chu kỳ hiện tại',
    refund_s5_l2:'Yêu cầu hoàn tiền: lấy lại tiền đã trả (theo điều kiện trên)',
    refund_s5_p2:'Bạn có thể hủy bất kỳ lúc nào qua Cài đặt tài khoản → Quản lý đăng ký.',
    refund_s5_note:'Mẹo: nếu tạm thời không cần NUNO, hủy đăng ký để giữ tài khoản. Đăng ký lại bất kỳ lúc nào — dữ liệu được lưu 90 ngày.',
    refund_s6_title:'Trường hợp đặc biệt',
    refund_s6_p1:'Chúng tôi hiểu mỗi tình huống là khác nhau. Các trường hợp sau sẽ được xem xét với thiện chí tối đa:',
    refund_s6_l1:'Tranh chấp hóa đơn: liên hệ trong vòng 60 ngày kể từ khi phát hiện lỗi',
    refund_s6_l2:'Hoàn cảnh bất ngờ: bệnh tật, thảm họa… — giải thích và chúng tôi sẽ cố gắng hỗ trợ',
    refund_s6_l3:'Tính năng không như kỳ vọng: nếu bạn hiểu nhầm trước khi mua, hãy liên hệ để tìm giải pháp',
    refund_s6_l4:'Chênh lệch giá: nếu có khuyến mãi trong 72 giờ sau khi bạn mua, bạn có thể yêu cầu bù phần chênh lệch',
    refund_s6_p2:'Chúng tôi không hứa hoàn tiền ngoài thời hạn thông thường, nhưng cam kết đọc và phản hồi trung thực mọi email.',
    refund_s7_title:'Liên hệ hỗ trợ hoàn tiền',
    refund_s7_p1:'Để yêu cầu hoàn tiền hoặc câu hỏi liên quan:',
    refund_contact_name:'NUNO LLC — Đội ngũ Hỗ trợ Hoàn tiền',
    refund_contact_email:'Đường dây hoàn tiền: hi@nudgenow.xyz (ưu tiên xử lý)',
    refund_contact_general:'Hỗ trợ chung: hinuno@outlook.com',
    refund_contact_note:'Giờ làm việc: Thứ Hai–Sáu 9:00–18:00 UTC+8. Cam kết phản hồi trong 3 ngày làm việc.',
    refund_toc1:'Nguyên tắc của chúng tôi',refund_toc2:'Dùng thử miễn phí',refund_toc3:'Điều kiện và tình huống',
    refund_toc4:'Cách yêu cầu hoàn tiền',refund_toc5:'Hủy đăng ký',refund_toc6:'Trường hợp đặc biệt',refund_toc7:'Liên hệ hỗ trợ',
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
