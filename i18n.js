/* =====================================================================
 * i18n.js  —  Trilingual support: English | Deutsch | 廣東話
 * =====================================================================
 *
 * HOW TO EDIT TRANSLATIONS
 * ─────────────────────────
 *   1. Open this file in any text editor.
 *   2. Find the section for your language by searching:
 *        === GERMAN ===     for German (DE)
 *        === CANTONESE ===  for Cantonese (CT)
 *   3. Each entry is a   key: "value",   pair.
 *      Change the text inside the quotes. The key must stay the same.
 *   4. HTML tags (<strong>, <em>, <a href="...">, etc.) are allowed.
 *   5. Save the file and reload your browser — changes apply instantly.
 *
 * KEY PREFIXES
 *   nav_  →  navigation (all pages)
 *   idx_  →  Home page
 *   rsm_  →  Resume page
 *   blg_  →  Blog page
 *   prj_  →  Personal Projects page
 *   shw_  →  Showcase page
 *   ast_  →  Asteroids page
 *
 * MISSING TRANSLATIONS: if a key is absent in DE or CT the English
 *   text is shown automatically (fallback).
 * ===================================================================== */

(function () {

  var _lang = localStorage.getItem('ks-lang') || 'en';
  var i18n = { en: {}, de: {}, ct: {} };

  /* ─── lookup with EN fallback ─── */
  function get(lang, key) {
    var v = i18n[lang] && i18n[lang][key];
    return (v !== undefined && v !== null) ? v : (i18n.en[key] || '');
  }

  function applyLang(lang) {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var val = get(lang, el.getAttribute('data-i18n'));
      if (val) el.innerHTML = val;
    });
    var map = { en: 'en', de: 'de', ct: 'zh-HK' };
    document.documentElement.lang = map[lang] || 'en';
    localStorage.setItem('ks-lang', lang);
    document.querySelectorAll('#lang-selector button').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  }

  function initSelector() {
    var labels = { en: 'EN', de: 'DE', ct: 'CT' };
    var titles = { en: 'English', de: 'Deutsch', ct: '廣東話' };
    var sel = document.createElement('div');
    sel.id = 'lang-selector';
    sel.setAttribute('aria-label', 'Language selector');
    Object.keys(labels).forEach(function (code) {
      var btn = document.createElement('button');
      btn.setAttribute('data-lang', code);
      btn.textContent = labels[code];
      btn.title = titles[code];
      if (code === _lang) btn.classList.add('active');
      btn.addEventListener('click', function () { applyLang(code); });
      sel.appendChild(btn);
    });
    document.body.appendChild(sel);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initSelector();
    if (_lang !== 'en') applyLang(_lang);
  });


  /* =================================================================
     NAVIGATION  nav_*
     ================================================================= */

  // === ENGLISH ===
  Object.assign(i18n.en, {
    nav_home:     "Home",
    nav_resume:   "Resume",
    nav_blog:     "Blog",
    nav_projects: "Personal Projects",
    nav_showcase: "Showcase",
  });
  // === GERMAN ===
  Object.assign(i18n.de, {
    nav_home:     "Startseite",
    nav_resume:   "Lebenslauf",
    nav_blog:     "Blog",
    nav_projects: "Persönliche Projekte",
    nav_showcase: "Galerie",
  });
  // === CANTONESE ===
  Object.assign(i18n.ct, {
    nav_home:     "主頁",
    nav_resume:   "履歷",
    nav_blog:     "網誌",
    nav_projects: "個人項目",
    nav_showcase: "作品集",
  });


  /* =================================================================
     HOME PAGE  idx_*
     ================================================================= */

  // === ENGLISH ===
  Object.assign(i18n.en, {
    idx_caption:     "@ Ford Robotics Building, Sept 2025",
    idx_about_h2:    "About Me",
    idx_about_p:     "Hi, I'm Yuqi Sun (Kevin). I study Computer Science and Robotics at University of Michigan, College of Engineering. I am interested in multimodal perception for autonomous systems. In my free time, I enjoy cycling, writing poetry, and playing my cello.",
    idx_inv_h2:      "Current Involvements",
    idx_inv_mmint:   "Research Assistant",
    idx_inv_mdst:    "Member (F25), Project Lead (W26)",
    idx_inv_polo:    "Member",
    idx_inv_every:   "Developer",
    idx_acad_h2:     "Academics",
    idx_gpa:         "4.0 GPA <em>(updated Fall 2025)</em>",
    idx_fall:        "Fall 2025",
    idx_winter:      "Winter 2026",
    idx_skills_h2:   "Skills",
    idx_skill_prog:  "<strong>Programming:</strong> C/C++, Java, Python",
    idx_skill_tools: "<strong>Tools &amp; Platforms:</strong> SQL Databases, Fusion360, PyTorch",
    idx_skill_other: "<strong>Other:</strong> 3D printer, Laser cutter, Water jet, CNC machine",
    idx_info_h2:     "Useful Information",
    idx_info_lang:   "<strong>Languages:</strong> English (Bilingual), Mandarin (Bilingual), Cantonese (Fluent), German (Basic)",
    idx_info_avail:  "<strong>Availability:</strong> Up to 14 hours/week for research involvement",
  });
  // === GERMAN ===
  Object.assign(i18n.de, {
    idx_caption:     "@ Ford Robotics Gebäude, Sept. 2025",
    idx_about_h2:    "Über mich",
    idx_about_p:     "Hallo, ich bin Yuqi Sun (Kevin). Ich studiere Informatik und Robotik an der Universität Michigan, College of Engineering. Mein Interesse gilt der multimodalen Wahrnehmung für autonome Systeme. In meiner Freizeit fahre ich gerne Fahrrad, schreibe Gedichte und spiele Cello.",
    idx_inv_h2:      "Aktuelle Tätigkeiten",
    idx_inv_mmint:   "Wissenschaftlicher Mitarbeiter",
    idx_inv_mdst:    "Mitglied (H25), Projektleiter (W26)",
    idx_inv_polo:    "Mitglied",
    idx_inv_every:   "Entwickler",
    idx_acad_h2:     "Studium",
    idx_gpa:         "4.0 GPA <em>(aktualisiert Herbst 2025)</em>",
    idx_fall:        "Herbst 2025",
    idx_winter:      "Winter 2026",
    idx_skills_h2:   "Kenntnisse",
    idx_skill_prog:  "<strong>Programmierung:</strong> C/C++, Java, Python",
    idx_skill_tools: "<strong>Werkzeuge &amp; Plattformen:</strong> SQL-Datenbanken, Fusion360, PyTorch",
    idx_skill_other: "<strong>Sonstiges:</strong> 3D-Drucker, Laserschneider, Wasserstrahlschneider, CNC-Maschine",
    idx_info_h2:     "Nützliche Informationen",
    idx_info_lang:   "<strong>Sprachen:</strong> Englisch (zweisprachig), Mandarin (zweisprachig), Kantonesisch (fließend), Deutsch (Grundkenntnisse)",
    idx_info_avail:  "<strong>Verfügbarkeit:</strong> Bis zu 14 Stunden pro Woche für Forschungsarbeit",
  });
  // === CANTONESE ===
  Object.assign(i18n.ct, {
    idx_caption:     "@ Ford 機器人大樓，2025年9月",
    idx_about_h2:    "關於我",
    idx_about_p:     "你好，我係孫宇琦（Kevin）。我喺密歇根大學工程學院修讀計算機科學及機器人學。我對自主系統嘅多模態感知好有興趣。喺業餘時間，我鍾意踩單車、寫詩同拉大提琴。",
    idx_inv_h2:      "現時參與",
    idx_inv_mmint:   "研究助理",
    idx_inv_mdst:    "成員（2025秋），項目負責人（2026冬）",
    idx_inv_polo:    "成員",
    idx_inv_every:   "開發員",
    idx_acad_h2:     "學業",
    idx_gpa:         "4.0 GPA <em>（2025年秋季更新）</em>",
    idx_fall:        "2025年秋季",
    idx_winter:      "2026年冬季",
    idx_skills_h2:   "技能",
    idx_skill_prog:  "<strong>編程：</strong>C/C++、Java、Python",
    idx_skill_tools: "<strong>工具及平台：</strong>SQL 數據庫、Fusion360、PyTorch",
    idx_skill_other: "<strong>其他：</strong>3D 打印機、激光切割機、水刀、CNC 機床",
    idx_info_h2:     "實用資訊",
    idx_info_lang:   "<strong>語言：</strong>英語（雙語）、普通話（雙語）、廣東話（流利）、德語（基礎）",
    idx_info_avail:  "<strong>可用性：</strong>每週最多14小時可從事研究工作",
  });


  /* =================================================================
     RESUME PAGE  rsm_*
     ================================================================= */

  // === ENGLISH ===
  Object.assign(i18n.en, {
    rsm_h1:              "My Resume",
    rsm_download:        "Download Resume (.pdf)",
    rsm_edu_h3:          "Education",
    rsm_umich_degree:    "<strong>Degree:</strong> Computer Science &amp; Robotics BSE, Sept 2025 – May 2029 (anticipated), GPA: 4.0",
    rsm_umich_honors:    "University Honors, Dean's List, William J. Branstrom Freshman Prize",
    rsm_umich_maxkade:   "Max Kade Hause German Residence — Member &amp; Resident (F26, W27)",
    rsm_umich_li1:       "Manipulation and Machine Intelligence Lab (Professor Nima Fazeli) — Research Assistant (W26, F25)",
    rsm_umich_li2:       "Michigan Data Science Team — Project Lead (W26), Member (F25)",
    rsm_umich_li3:       "Michigan Student Artificial Intelligence Lab — Member (W26, F25)",
    rsm_umich_li4:       "Michigan Intercollegiate Polo Club — Member (W26, F25)",
    rsm_isf_degree:      "<strong>Degree:</strong> International Baccalaureate (IB) Bilingual Diploma, Score: 43/45 &nbsp; Aug 2021 – June 2025",
    rsm_isf_li1:         "Magna cum laude — Top 10% in school (G11)",
    rsm_isf_li2:         "2× Summa cum laude — Top 5% in school (G10)",
    rsm_isf_li3:         "3× Academy Honors — Top 20% in school (G11, G12)",
    rsm_isf_li4:         "2× MYP Gold Service Award (G9, G10)",
    rsm_isf_li5:         "2× Honorary Shuyuan STEM Research Scholarship (G9, G10)",
    rsm_isf_li6:         "2× IBDP Computer Science Subject Award — Awarded to best CS student (G11, G12)",
    rsm_isf_li7:         "ISF Academy Special Talent Scholarship | The Harvard University Book Award | The S. K. and Margaret Wong Prize for Community Service | Information Communication Technologies Award",
    rsm_research_h3:     "Research Experience",
    rsm_rwth_role:       "<strong>Position:</strong> Research Intern, May 2026 – July 2026",
    rsm_rwth_li1:        "Supervisor: Dr. Elma Kerz, Co-Founder &amp; CEO @ Exaia Technologies",
    rsm_sjtu_role:       "<strong>First Author</strong> (Submitted for Publishing), July 2025 – August 2025",
    rsm_sjtu_li1:        "Paper title: &ldquo;Road Sign Classification with a Denoising Pipeline Approach.&rdquo;",
    rsm_sjtu_li2:        "Used the German Traffic Sign Recognition Benchmark dataset with over 50,000 entries and added Gaussian noise of different severity; used the PyTorch framework to train CNN and ResNet models with clean and noisy datasets; innovated a singular classification model and SwinIR denoise-classification pipeline.",
    rsm_sjtu_li3:        "Data suggests the pipeline with CNN significantly improves performance comparable to singular ResNet, whereas the pipeline with ResNet weakens performance compared to its singular classification form; investigation ongoing.",
    rsm_sjtu_li4:        "Accepted to the <strong>7th International Conference on Intelligent Autonomous Systems</strong>",
    rsm_sjtu_li5:        "Presented at University of Michigan 2nd Annual Computer Science &amp; Engineering Research Symposium and 2026 Undergraduate Research Symposium",
    rsm_vtol_role:       "<strong>First Author</strong> (Published), June 2023 – May 2025",
    rsm_vtol_li1:        "Paper title: &ldquo;Evaluating the Feasibility of Using Vertical Take-Off and Landing (VTOL) Aircraft to Replace Helicopters for Rescue Missions.&rdquo;",
    rsm_vtol_li2:        "Constructed a VTOL prototype with vertical takeoff, horizontal flight, and stable hover; designed a modular airframe with dual rotating exhaust nozzles using Fusion 360; integrated control systems using an ESP32 microcontroller, gyroscope, and servo motors; VTOL may function as well as a helicopter in short missions but limitations in range and cost render it impractical.",
    rsm_vtol_li3:        "Paper published in Bauhinia Journal, Volume X, Issue 2, Pages 9–21 (ISSN 2409-4064).",
    rsm_solar1_role:     "<strong>First Author</strong> (Published), April 2023 – December 2024",
    rsm_solar1_li1:      "Researched &ldquo;Development and Evaluation of a Low-Cost Open Source Power Monitoring and Recording System for Solar Panel Efficiency Analysis.&rdquo;",
    rsm_solar1_li2:      "Used an ESP32 microcontroller, INA219 sensor, and microSD to construct a customizable power monitoring system; conducted a 15-day test at the ISF weather station; analyzed data using PowerBI; found strong R² correlation despite minor discrepancies due to environmental shadows.",
    rsm_solar1_li3:      'Paper published at IEEE 2023 YE conference: <a href="https://www.researchgate.net/publication/386508879_Development_and_Evaluation_of_a_Low-Cost_Open_Source_Power_Monitoring_and_Recording_System_for_Solar_Panel_Efficiency_Analysis">Link</a>.',
    rsm_solar2_role:     "<strong>First Author</strong> (Published), December 2021 – April 2022",
    rsm_solar2_li1:      "Researched &ldquo;The Potential of Tracking Solar Panels in Hong Kong Compared to Fixed Panels.&rdquo;",
    rsm_solar2_li2:      "Used PowerBI to analyze 3 years of solar panel output data from the ISF Center for Renewable Energy Education; found that tracking solar panels generated only 29% more energy than fixed panels; because tracking panels cost 25% more, concluded fixed arrays offer better ROI.",
    rsm_solar2_li3:      'Condensed poster presentation published by <strong>American Geophysical Union (AGU)</strong>: <a href="https://agu2022fallmeeting-agu.ipostersessions.com/Default.aspx?s=13-4E-8F-0E-A8-42-2E-71-74-37-18-20-F4-AF-E1-CE">Link</a>.',
    rsm_exp_h3:          "Professional Experience",
    rsm_every_role:      "Software Developer, Nov 2025 – ongoing",
    rsm_every_li1:       "Developing a pipeline to streamline user input from Google Drive to AWS and Supabase.",
    rsm_crost_role:      "Contractor, Jan 2024 – May 2024",
    rsm_crost_li1:       "Contracted to design and build an office door lock that opens automatically when a recognized phone connects to the office Wi-Fi, and locks automatically when no device is connected; design parameters: commercially available parts, no manual operation, per-unit cost ≤ 1,500 HKD.",
    rsm_crost_li2:       "Used an ESP-32 chip and Wi-Fi module to control a solenoid lock within the parameters; provided a blueprint for the design.",
    rsm_entrak_role:     "Software Developer, Mar 2023 – Oct 2023",
    rsm_entrak_li1:      "Developed an API to fetch data for En-Trak TEP, an application that tracks and displays power usage and sustainability data for organizations that own commercial real estate.",
    rsm_entrak_li2:      "Used Go to develop the API with object-relational mapping to access Firebase databases maintained by En-Trak; deployed on the En-Trak TEP application in 2023.",
    rsm_qirui_role:      "Founder &amp; Developer, First Author (Published), March 2022 – ongoing",
    rsm_qirui_li1:       "Programmed and developed Qirui Pay, an app permitting organizations to issue their own unique currencies pegged to local fiat; use cases include schools and organizations that issue points, tickets, or currencies redeemable for real money or items.",
    rsm_qirui_li2:       "Presented a paper examining the technology, security, and use cases for Qirui Pay at the 49th International Exhibition of Inventions Geneva; recorded ~52,000 USD in transactions during the trial period (2022–2023); received a Silver Medal.",
    rsm_qirui_li3:       'Published at 49th International Exhibition of Inventions Geneva: <a href="https://catalog-admin.palexpo.ch/media/invention_invention_documentation/0c01584c-dd02-41e8-9ac5-7852d0346e95.pdf">Link</a>.',
  });
  // === GERMAN ===
  Object.assign(i18n.de, {
    rsm_h1:              "Mein Lebenslauf",
    rsm_download:        "Lebenslauf herunterladen (.pdf)",
    rsm_edu_h3:          "Ausbildung",
    rsm_umich_degree:    "<strong>Abschluss:</strong> BSE Informatik &amp; Robotik, Sept. 2025 – Mai 2029 (voraussichtlich), GPA: 4.0",
    rsm_umich_honors:    "University Honors, Dean's List, William J. Branstrom Freshman Prize",
    rsm_umich_maxkade:   "Max Kade Hause Deutsches Wohnheim — Mitglied &amp; Bewohner (W26, S27)",
    rsm_umich_li1:       "Manipulation and Machine Intelligence Lab (Prof. Nima Fazeli) — Wissenschaftlicher Mitarbeiter (W26, H25)",
    rsm_umich_li2:       "Michigan Data Science Team — Projektleiter (W26), Mitglied (H25)",
    rsm_umich_li3:       "Michigan Student Artificial Intelligence Lab — Mitglied (W26, H25)",
    rsm_umich_li4:       "Michigan Intercollegiate Polo Club — Mitglied (W26, H25)",
    rsm_isf_degree:      "<strong>Abschluss:</strong> IB Bilinguales Diplom, Punktzahl: 43/45 &nbsp; Aug. 2021 – Juni 2025",
    rsm_isf_li1:         "Magna cum laude — Top 10% der Schule (Klasse 11)",
    rsm_isf_li2:         "2× Summa cum laude — Top 5% der Schule (Klasse 10)",
    rsm_isf_li3:         "3× Academy Honors — Top 20% der Schule (Klasse 11, 12)",
    rsm_isf_li4:         "2× MYP Gold Service Award (Klasse 9, 10)",
    rsm_isf_li5:         "2× Shuyuan STEM Forschungsstipendium (Klasse 9, 10)",
    rsm_isf_li6:         "2× IBDP Informatik-Fachpreis — an den besten Informatikschüler verliehen (Klasse 11, 12)",
    rsm_isf_li7:         "ISF Sondertalentstipendium | Harvard University Book Award | S. K. and Margaret Wong Gemeinschaftsdienst-Preis | IKT-Auszeichnung",
    rsm_research_h3:     "Forschungserfahrung",
    rsm_rwth_role:       "<strong>Position:</strong> Forschungspraktikant, Mai 2026 – Juli 2026",
    rsm_rwth_li1:        "Betreuung: Dr. Elma Kerz, Mitgründerin &amp; CEO @ Exaia Technologies",
    rsm_sjtu_role:       "<strong>Erstautor</strong> (Eingereicht), Juli 2025 – August 2025",
    rsm_sjtu_li1:        "Titel: &ldquo;Road Sign Classification with a Denoising Pipeline Approach.&rdquo;",
    rsm_sjtu_li2:        "Verwendete den German Traffic Sign Recognition Benchmark-Datensatz (über 50.000 Einträge) mit Gaußschem Rauschen verschiedener Stärke; trainierte CNN- und ResNet-Modelle in PyTorch auf sauberen und verrauschten Datensätzen; entwickelte eine SwinIR-Entrauschungs-Klassifikationspipeline.",
    rsm_sjtu_li3:        "Daten zeigen: CNN-Pipeline verbessert Leistung signifikant gegenüber singulärem ResNet; ResNet-Pipeline schwächt die Leistung im Vergleich zum singulären Modell; Untersuchung läuft.",
    rsm_sjtu_li4:        "Angenommen bei der <strong>7. Internationalen Konferenz für intelligente autonome Systeme</strong>",
    rsm_sjtu_li5:        "Präsentiert beim 2. jährlichen Informatik- und Ingenieurforschungssymposium der Universität Michigan und beim Undergraduate Research Symposium 2026",
    rsm_vtol_role:       "<strong>Erstautor</strong> (Veröffentlicht), Juni 2023 – Mai 2025",
    rsm_vtol_li1:        "Titel: &ldquo;Evaluating the Feasibility of Using VTOL Aircraft to Replace Helicopters for Rescue Missions.&rdquo;",
    rsm_vtol_li2:        "Entwickelte einen VTOL-Prototyp mit vertikalem Start, horizontalem Flug und stabilem Schwebeflug; entwarf modularen Rumpf mit Fusion 360; Steuerung per ESP32, Gyroskop und Servomotoren; Fazit: für Kurzeinsätze vergleichbar mit Hubschrauber, aber wegen Reichweite und Kosten nicht praktikabel.",
    rsm_vtol_li3:        "Veröffentlicht im Bauhinia Journal, Band X, Ausgabe 2, S. 9–21 (ISSN 2409-4064).",
    rsm_solar1_role:     "<strong>Erstautor</strong> (Veröffentlicht), April 2023 – Dezember 2024",
    rsm_solar1_li1:      "Forschung: &ldquo;Development and Evaluation of a Low-Cost Open Source Power Monitoring and Recording System for Solar Panel Efficiency Analysis.&rdquo;",
    rsm_solar1_li2:      "Konstruierte ein Strommesssystem (ESP32, INA219, microSD); 15-tägiger Test an der ISF-Wetterstation; Datenanalyse mit PowerBI; hohe R²-Korrelation mit kommerziellem System.",
    rsm_solar1_li3:      'Veröffentlicht bei der IEEE 2023 YE-Konferenz: <a href="https://www.researchgate.net/publication/386508879_Development_and_Evaluation_of_a_Low-Cost_Open_Source_Power_Monitoring_and_Recording_System_for_Solar_Panel_Efficiency_Analysis">Link</a>.',
    rsm_solar2_role:     "<strong>Erstautor</strong> (Veröffentlicht), Dezember 2021 – April 2022",
    rsm_solar2_li1:      "Forschung: &ldquo;The Potential of Tracking Solar Panels in Hong Kong Compared to Fixed Panels.&rdquo;",
    rsm_solar2_li2:      "Analysierte 3 Jahre Solardaten mit PowerBI; Nachführsysteme erzeugten nur 29% mehr Energie bei 25% höheren Kosten — Festmontierungen haben besseren ROI.",
    rsm_solar2_li3:      'Posterpräsentation veröffentlicht durch die <strong>American Geophysical Union (AGU)</strong>: <a href="https://agu2022fallmeeting-agu.ipostersessions.com/Default.aspx?s=13-4E-8F-0E-A8-42-2E-71-74-37-18-20-F4-AF-E1-CE">Link</a>.',
    rsm_exp_h3:          "Berufliche Erfahrung",
    rsm_every_role:      "Softwareentwickler, Nov. 2025 – laufend",
    rsm_every_li1:       "Entwicklung einer Pipeline zur Automatisierung von Nutzerdaten von Google Drive zu AWS und Supabase.",
    rsm_crost_role:      "Auftragnehmer, Jan. 2024 – Mai 2024",
    rsm_crost_li1:       "Entwicklung eines automatischen Türschlosses, das bei Wi-Fi-Verbindung eines erkannten Geräts öffnet; Vorgaben: handelsübliche Teile, kein manueller Betrieb, Stückkosten ≤ 1.500 HKD.",
    rsm_crost_li2:       "Verwendete ESP-32 und Wi-Fi-Modul zur Steuerung eines Solenoidschlosses; lieferte Konstruktionsblaupause.",
    rsm_entrak_role:     "Softwareentwickler, März 2023 – Okt. 2023",
    rsm_entrak_li1:      "Entwickelte eine API für En-Trak TEP, eine Anwendung zur Anzeige von Energieverbrauch und Nachhaltigkeitsdaten für Gewerbeimmobilienbesitzer.",
    rsm_entrak_li2:      "API in Go mit objekt-relationalem Mapping auf Firebase-Datenbanken; 2023 in der En-Trak TEP-App eingesetzt.",
    rsm_qirui_role:      "Gründer &amp; Entwickler, Erstautor (Veröffentlicht), März 2022 – laufend",
    rsm_qirui_li1:       "Entwickelte Qirui Pay, eine App für Organisationen zur Ausgabe eigener Währungen, die an Fiat-Währungen gekoppelt sind; Anwendungsfälle: Schulen und Unternehmen mit Punktesystemen.",
    rsm_qirui_li2:       "Präsentierte eine Abhandlung auf der 49. Internationalen Erfindungsausstellung Genf; ~52.000 USD Transaktionen im Testzeitraum 2022–2023; Silbermedaille gewonnen.",
    rsm_qirui_li3:       'Veröffentlicht bei der 49. Internationalen Erfindungsausstellung Genf: <a href="https://catalog-admin.palexpo.ch/media/invention_invention_documentation/0c01584c-dd02-41e8-9ac5-7852d0346e95.pdf">Link</a>.',
  });
  // === CANTONESE ===
  Object.assign(i18n.ct, {
    rsm_h1:              "我的履歷",
    rsm_download:        "下載履歷 (.pdf)",
    rsm_edu_h3:          "學歷",
    rsm_umich_degree:    "<strong>學位：</strong>計算機科學及機器人學理學士，2025年9月 – 2029年5月（預計），GPA：4.0",
    rsm_umich_honors:    "大學榮譽、院長名單、William J. Branstrom 新生獎",
    rsm_umich_maxkade:   "Max Kade Hause 德語宿舍 — 成員及住客（2026秋、2027冬）",
    rsm_umich_li1:       "Manipulation and Machine Intelligence Lab（Nima Fazeli 教授）— 研究助理（2026冬、2025秋）",
    rsm_umich_li2:       "Michigan Data Science Team — 項目負責人（2026冬）、成員（2025秋）",
    rsm_umich_li3:       "Michigan Student Artificial Intelligence Lab — 成員（2026冬、2025秋）",
    rsm_umich_li4:       "Michigan Intercollegiate Polo Club — 成員（2026冬、2025秋）",
    rsm_isf_degree:      "<strong>學位：</strong>國際文憑（IB）雙語文憑，成績：43/45 &nbsp; 2021年8月 – 2025年6月",
    rsm_isf_li1:         "Magna cum laude — 全校前10%（中六）",
    rsm_isf_li2:         "2次 Summa cum laude — 全校前5%（中五）",
    rsm_isf_li3:         "3次書院榮譽 — 全校前20%（中六、中七）",
    rsm_isf_li4:         "2次 MYP 金牌服務獎（中四、中五）",
    rsm_isf_li5:         "2次 Shuyuan STEM 研究獎學金（中四、中五）",
    rsm_isf_li6:         "2次 IBDP 計算機科學科目獎 — 頒予最優秀計算機科學學生（中六、中七）",
    rsm_isf_li7:         "ISF 特殊才能獎學金 | 哈佛大學書獎 | S. K. and Margaret Wong 社區服務獎 | 資訊通訊技術獎",
    rsm_research_h3:     "研究經驗",
    rsm_rwth_role:       "<strong>職位：</strong>研究實習生，2026年5月 – 2026年7月",
    rsm_rwth_li1:        "導師：Dr. Elma Kerz，Exaia Technologies 聯合創辦人兼行政總裁",
    rsm_sjtu_role:       "<strong>第一作者</strong>（已投稿），2025年7月 – 2025年8月",
    rsm_sjtu_li1:        "論文題目：〈Road Sign Classification with a Denoising Pipeline Approach〉",
    rsm_sjtu_li2:        "使用德國交通標誌識別基準數據集（逾50,000條目），加入不同程度嘅高斯噪聲；以PyTorch訓練CNN及ResNet模型；研發SwinIR去噪分類流水線。",
    rsm_sjtu_li3:        "數據顯示CNN流水線表現顯著優於單一ResNet；ResNet流水線則弱於其單一形式；研究持續進行。",
    rsm_sjtu_li4:        "已獲<strong>第7屆智能自主系統國際會議</strong>接受",
    rsm_sjtu_li5:        "於密歇根大學第2屆計算機科學及工程研究研討會及2026年本科生研究研討會上發表",
    rsm_vtol_role:       "<strong>第一作者</strong>（已發表），2023年6月 – 2025年5月",
    rsm_vtol_li1:        "論文題目：〈Evaluating the Feasibility of Using VTOL Aircraft to Replace Helicopters for Rescue Missions〉",
    rsm_vtol_li2:        "建造可垂直起降及穩定懸停嘅VTOL原型；以Fusion 360設計雙旋轉噴嘴機身；使用ESP32、陀螺儀及伺服電機整合控制系統；結論：VTOL短途任務表現相若，但航程及成本限制令其不切實際。",
    rsm_vtol_li3:        "發表於《Bauhinia Journal》第X卷第2期，第9–21頁（ISSN 2409-4064）。",
    rsm_solar1_role:     "<strong>第一作者</strong>（已發表），2023年4月 – 2024年12月",
    rsm_solar1_li1:      "研究題目：〈Development and Evaluation of a Low-Cost Open Source Power Monitoring and Recording System for Solar Panel Efficiency Analysis〉",
    rsm_solar1_li2:      "以ESP32、INA219感應器及microSD建構低成本電力監測系統；於ISF氣象站進行15天測試；以PowerBI分析數據，發現高R²相關性。",
    rsm_solar1_li3:      '發表於2023年IEEE YE會議：<a href="https://www.researchgate.net/publication/386508879_Development_and_Evaluation_of_a_Low-Cost_Open_Source_Power_Monitoring_and_Recording_System_for_Solar_Panel_Efficiency_Analysis">連結</a>。',
    rsm_solar2_role:     "<strong>第一作者</strong>（已發表），2021年12月 – 2022年4月",
    rsm_solar2_li1:      "研究題目：〈The Potential of Tracking Solar Panels in Hong Kong Compared to Fixed Panels〉",
    rsm_solar2_li2:      "以PowerBI分析ISF再生能源中心3年嘅太陽能數據；追蹤式面板僅多產29%電能，但貴25%，固定式面板回報率更佳。",
    rsm_solar2_li3:      '海報摘要由<strong>美國地球物理聯盟（AGU）</strong>出版：<a href="https://agu2022fallmeeting-agu.ipostersessions.com/Default.aspx?s=13-4E-8F-0E-A8-42-2E-71-74-37-18-20-F4-AF-E1-CE">連結</a>。',
    rsm_exp_h3:          "工作經驗",
    rsm_every_role:      "軟件開發員，2025年11月 – 至今",
    rsm_every_li1:       "開發流水線，將用戶輸入由Google Drive自動同步至AWS及Supabase。",
    rsm_crost_role:      "承包商，2024年1月 – 2024年5月",
    rsm_crost_li1:       "受託設計及製造辦公室自動門鎖，當已識別手機連接Wi-Fi時自動開鎖；要求採用市售零件，毋須人手操作，單件成本不超過1,500港幣。",
    rsm_crost_li2:       "採用ESP-32及Wi-Fi模組控制電磁鎖，符合所有設計要求；提供設計藍圖。",
    rsm_entrak_role:     "軟件開發員，2023年3月 – 2023年10月",
    rsm_entrak_li1:      "為En-Trak TEP開發API，該應用程式追蹤及顯示商業地產機構嘅用電量及可持續發展數據。",
    rsm_entrak_li2:      "以Go語言開發API，以對象關係映射訪問Firebase數據庫；2023年正式部署。",
    rsm_qirui_role:      "創辦人兼開發員，第一作者（已發表），2022年3月 – 至今",
    rsm_qirui_li1:       "開發Qirui Pay，讓機構發行與法幣掛鈎嘅專屬貨幣；適用於以積分、票據或貨幣運作嘅學校及企業。",
    rsm_qirui_li2:       "喺第49屆日內瓦國際發明展發表論文；試行期間（2022–2023年）錄得約52,000美元交易；榮獲銀獎。",
    rsm_qirui_li3:       '發表於第49屆日內瓦國際發明展：<a href="https://catalog-admin.palexpo.ch/media/invention_invention_documentation/0c01584c-dd02-41e8-9ac5-7852d0346e95.pdf">連結</a>。',
  });


  /* =================================================================
     BLOG PAGE  blg_*
     ================================================================= */

  // === ENGLISH ===
  Object.assign(i18n.en, {
    blg_h1:           "My Blog",
    blg_p01_h2:       "01 Poetry Anthology | Gedichtsammlung 01 | 初號詩集",
    blg_p01_date:     "April 6, 2026",
    blg_p01_p1:       "I'm proud to present my second poetry anthology, <strong>01 Poetry Anthology | Gedichtsammlung 01 | 初號詩集</strong>, a trilingual collection featuring my best 10 詞 and modern style poems in English, German, and Cantonese. This collection represents a linguistic and emotional journey across three languages and cultures.",
    blg_p01_p2:       "The poems focus on emotional development and personal growth, exploring themes of identity, transformation, and the inner landscape of a student bridging multiple worlds. Each piece reflects the unique expressive power of its language while maintaining a unified voice throughout.",
    blg_p01_p3:       '<a href="assets/poem2.pdf" target="_blank">Download 01 Poetry Anthology | Gedichtsammlung 01 | 初號詩集</a> to experience the full trilingual collection.',
    blg_p01_p4:       "Please read the Creator's Note at the end of the anthology for more information.",
    blg_p00_h2:       "00 Poetry Anthology",
    blg_p00_date:     "April 2, 2026",
    blg_p00_p1:       "I'm excited to share my first poetry anthology, a bilingual collection of 26 poems chronicling my journey from April 2024 to April 2026. This two-year compilation features works in both English and Chinese, reflecting on my experiences, growth, and emotional developments during my transition from end of high school to start of college.",
    blg_p00_p2:       "The collection includes reflections on young adulthood, homesickness, emotional challenges, cultural identity, and the beauty found in everyday moments. Some pieces explore the intersection of Eastern and Western perspectives, while others capture the universal emotions of a stranger navigating new horizons.",
    blg_p00_p3:       '<a href="assets/poem.pdf" target="_blank">Download the full poetry anthology</a> to read the complete collection.',
    blg_umai_h2:      "University of Michigan AI Business Hackathon",
    blg_umai_date:    "February 19–20, 2026",
    blg_umai_p1:      "I participated in the University of Michigan AI Business Hackathon, a collaboration between Ross School of Business and College of Engineering. Our team (Yuqi Sun, Wonsik Jung, Chhavi Jain, and Deepti Mathur) developed <strong>AlignAI</strong>, an AI-powered EdTech and wellness personal assistant that helps students manage their energy, not just their time.",
    blg_umai_p2:      "AlignAI is designed to prevent student burnout by using cognitive weight tagging to assess the mental load of each task, protecting wellness activities as non-negotiable priorities, and proactively creating buffer time for recovery. Unlike traditional calendars that optimize for productivity, AlignAI optimizes for sustainable success by aligning your day with your wellbeing.",
    blg_umai_p3:      'Check out our <a href="https://alignai-sigma.vercel.app/" target="_blank">live demo</a>, watch our <a href="https://youtu.be/vw3Lj4yOHQ0" target="_blank">demo video</a>, or <a href="assets/umai.pdf" target="_blank">download our presentation</a>.',
    blg_tartan_h2:    "TartanHacks 2026 at Carnegie Mellon",
    blg_tartan_date:  "February 6–7, 2026",
    blg_tartan_p1:    'I participated in TartanHacks 2026 at Carnegie Mellon University and developed <strong>Ledgerly</strong> with Jonathan, Adil, and James. Ledgerly is an all-in-one real-time financial planning and budgeting platform. We deliver proactive AI-powered insights that help users avoid financial problems before they happen.',
    blg_tartan_p2:    'Ledgerly was selected as the favorite project at TartanHacks by Agentuity! Check out our <a href="https://github.com/jonathandunne/Ledgerly-UI" target="_blank">GitHub repository</a>, read the <a href="https://agentuity.com/blog/tartanhacks-2026-recap" target="_blank">Agentuity recap blog post</a>, or <a href="assets/tartan.pdf" target="_blank">download our presentation</a>, and watch <a href="https://youtu.be/bbiGeH78C5Q" target="_blank">Ledgerly\'s demo video by Jonathan Dunne</a>.',
    blg_w26_h2:       "Winter 2026 semester starts!",
    blg_w26_date:     "January 7, 2026",
    blg_w26_p:        "I'm excited to start my second semester at Michigan. Go blue!",
    blg_f25end_h2:    "Fall 2025 semester concluded",
    blg_f25end_date:  "Dec 17, 2025",
    blg_f25end_p:     "I'm proud to have completed my first semester at Michigan with a 4.0 GPA. I greatly appreciate all the time and support from my wonderful professors and classmates. Go Blue!",
    blg_f25_h2:       "Fall 2025 semester starts!",
    blg_f25_date:     "August 25, 2025",
    blg_f25_p:        "I'm excited to start my first semester at Michigan. Go blue!",
    blg_start_h2:     "Start of my blog",
    blg_start_date:   "August 8, 2025",
    blg_start_p:      "Ready to go blue!",
  });
  // === GERMAN ===
  Object.assign(i18n.de, {
    blg_h1:           "Mein Blog",
    blg_p01_h2:       "01 Poetry Anthology | Gedichtsammlung 01 | 初號詩集",
    blg_p01_date:     "6. April 2026",
    blg_p01_p1:       "Ich freue mich, meine zweite Gedichtsammlung vorzustellen: <strong>01 Poetry Anthology | Gedichtsammlung 01 | 初號詩集</strong>, eine dreisprachige Sammlung mit meinen besten 10 詞 und modernen Gedichten auf Englisch, Deutsch und Kantonesisch. Diese Sammlung steht für eine sprachliche und emotionale Reise durch drei Sprachen und Kulturen.",
    blg_p01_p2:       "Die Gedichte widmen sich der emotionalen Entwicklung und dem persönlichen Wachstum — mit Themen wie Identität, Wandel und der inneren Welt eines Studenten, der mehrere Welten miteinander verbindet. Jedes Stück spiegelt die einzigartige Ausdruckskraft seiner Sprache wider.",
    blg_p01_p3:       '<a href="assets/poem2.pdf" target="_blank">01 Poetry Anthology | Gedichtsammlung 01 | 初號詩集 herunterladen</a>, um die vollständige dreisprachige Sammlung zu erleben.',
    blg_p01_p4:       "Bitte lies die Anmerkung des Autors am Ende der Anthologie für weitere Informationen.",
    blg_p00_h2:       "00 Gedichtsammlung",
    blg_p00_date:     "2. April 2026",
    blg_p00_p1:       "Ich freue mich, meine erste Gedichtsammlung zu teilen: eine zweisprachige Sammlung von 26 Gedichten, die meine Reise von April 2024 bis April 2026 festhalten. Die Werke auf Englisch und Chinesisch spiegeln meine Erfahrungen und meinen Wandel beim Übergang vom Ende der Schulzeit zum Studienbeginn wider.",
    blg_p00_p2:       "Die Sammlung enthält Reflexionen über das junge Erwachsensein, Heimweh, emotionale Herausforderungen, kulturelle Identität und die Schönheit im Alltag. Einige Stücke erkunden die Schnittstelle östlicher und westlicher Perspektiven.",
    blg_p00_p3:       '<a href="assets/poem.pdf" target="_blank">Die vollständige Gedichtsammlung herunterladen</a>.',
    blg_umai_h2:      "KI-Business-Hackathon der Universität Michigan",
    blg_umai_date:    "19.–20. Februar 2026",
    blg_umai_p1:      "Ich nahm am KI-Business-Hackathon der Universität Michigan teil, einer Zusammenarbeit zwischen der Ross School of Business und dem College of Engineering. Unser Team entwickelte <strong>AlignAI</strong>, einen KI-gestützten EdTech- und Wellness-Assistenten, der Studierenden hilft, ihre Energie zu managen — nicht nur ihre Zeit.",
    blg_umai_p2:      "AlignAI verhindert Burnout durch kognitive Aufgabengewichtung, schützt Wellness-Aktivitäten als Prioritäten und plant proaktiv Erholungszeiten. Im Gegensatz zu herkömmlichen Kalendern optimiert AlignAI auf nachhaltigen Erfolg.",
    blg_umai_p3:      'Schau dir unsere <a href="https://alignai-sigma.vercel.app/" target="_blank">Live-Demo</a> an, unser <a href="https://youtu.be/vw3Lj4yOHQ0" target="_blank">Demo-Video</a> oder <a href="assets/umai.pdf" target="_blank">lade unsere Präsentation herunter</a>.',
    blg_tartan_h2:    "TartanHacks 2026 an der Carnegie Mellon University",
    blg_tartan_date:  "6.–7. Februar 2026",
    blg_tartan_p1:    'Ich nahm an TartanHacks 2026 an der CMU teil und entwickelte <strong>Ledgerly</strong> mit Jonathan, Adil und James. Ledgerly ist eine All-in-one-Echtzeit-Finanzplanungsplattform mit proaktiven KI-Einblicken.',
    blg_tartan_p2:    'Ledgerly wurde von Agentuity als Lieblingsprojekt ausgezeichnet! Schau dir unser <a href="https://github.com/jonathandunne/Ledgerly-UI" target="_blank">GitHub-Repository</a> an, lies den <a href="https://agentuity.com/blog/tartanhacks-2026-recap" target="_blank">Agentuity-Rückblick</a> oder <a href="assets/tartan.pdf" target="_blank">lade unsere Präsentation herunter</a> und schau dir <a href="https://youtu.be/bbiGeH78C5Q" target="_blank">Ledgerlys Demo-Video</a> an.',
    blg_w26_h2:       "Wintersemester 2026 beginnt!",
    blg_w26_date:     "7. Januar 2026",
    blg_w26_p:        "Ich freue mich auf mein zweites Semester in Michigan. Go Blue!",
    blg_f25end_h2:    "Herbstsemester 2025 abgeschlossen",
    blg_f25end_date:  "17. Dezember 2025",
    blg_f25end_p:     "Ich bin stolz, mein erstes Semester in Michigan mit einem 4.0 GPA abgeschlossen zu haben. Herzlichen Dank an alle Professoren und Kommilitonen. Go Blue!",
    blg_f25_h2:       "Herbstsemester 2025 beginnt!",
    blg_f25_date:     "25. August 2025",
    blg_f25_p:        "Ich freue mich auf mein erstes Semester in Michigan. Go Blue!",
    blg_start_h2:     "Beginn meines Blogs",
    blg_start_date:   "8. August 2025",
    blg_start_p:      "Bereit für Michigan!",
  });
  // === CANTONESE ===
  Object.assign(i18n.ct, {
    blg_h1:           "我的網誌",
    blg_p01_h2:       "01 Poetry Anthology | Gedichtsammlung 01 | 初號詩集",
    blg_p01_date:     "2026年4月6日",
    blg_p01_p1:       "我好榮幸發表我嘅第二本詩集：<strong>01 Poetry Anthology | Gedichtsammlung 01 | 初號詩集</strong>，呢係一本三語詩集，收錄咗我最精選嘅10首詞及現代詩，以英語、德語及廣東話寫成，代表一次跨越三種語言同文化嘅情感旅程。",
    blg_p01_p2:       "詩集聚焦於情感發展與個人成長，探索身份認同、蛻變，以及身處多元世界嘅學生內心風景。每首作品都展現其語言獨特嘅表達力，同時貫穿一致嘅聲音。",
    blg_p01_p3:       '<a href="assets/poem2.pdf" target="_blank">下載 01 Poetry Anthology | Gedichtsammlung 01 | 初號詩集</a>，欣賞完整嘅三語詩集。',
    blg_p01_p4:       "請閱讀詩集末尾嘅創作者手記，了解更多資訊。",
    blg_p00_h2:       "00 詩集",
    blg_p00_date:     "2026年4月2日",
    blg_p00_p1:       "我好開心分享我嘅第一本詩集，呢係一本記錄咗我由2024年4月至2026年4月旅程嘅雙語詩集，共26首詩，以英文同中文寫成，反映咗我喺高中尾聲到大學開始呢個過渡期嘅經歷、成長同情感發展。",
    blg_p00_p2:       "詩集收錄咗對青年時期、鄉愁、情感挑戰、文化身份認同，以及日常美好嘅感悟。部分作品探索東西方視野嘅交匯，其他則捕捉一個陌生人踏上新天地嘅普世情感。",
    blg_p00_p3:       '<a href="assets/poem.pdf" target="_blank">下載完整詩集</a>閱讀全部作品。',
    blg_umai_h2:      "密歇根大學人工智能商業黑客馬拉松",
    blg_umai_date:    "2026年2月19–20日",
    blg_umai_p1:      "我參加咗密歇根大學人工智能商業黑客馬拉松，呢次係Ross商學院同工程學院嘅合辦活動。我哋團隊研發咗 <strong>AlignAI</strong>，一款以AI驅動嘅教育科技及健康個人助理，幫助學生管理精力，而唔單係時間。",
    blg_umai_p2:      "AlignAI 透過認知負荷標記評估每項任務嘅精神負擔，將健康活動列為不可妥協嘅優先事項，並主動預留休息時間，致力於可持續嘅成功。",
    blg_umai_p3:      '睇睇我哋嘅<a href="https://alignai-sigma.vercel.app/" target="_blank">即時示範</a>、<a href="https://youtu.be/vw3Lj4yOHQ0" target="_blank">示範影片</a>，或<a href="assets/umai.pdf" target="_blank">下載我哋嘅簡報</a>。',
    blg_tartan_h2:    "卡內基梅隆大學 TartanHacks 2026",
    blg_tartan_date:  "2026年2月6–7日",
    blg_tartan_p1:    '我參加咗卡內基梅隆大學嘅 TartanHacks 2026，同 Jonathan、Adil 同 James 一齊開發咗 <strong>Ledgerly</strong>。Ledgerly 係一個一站式實時財務規劃及預算管理平台，提供主動式AI洞察，幫助用家喺財務問題發生前防患未然。',
    blg_tartan_p2:    'Ledgerly 被 Agentuity 選為 TartanHacks 最受歡迎項目！睇睇我哋嘅<a href="https://github.com/jonathandunne/Ledgerly-UI" target="_blank">GitHub 倉庫</a>，閱讀<a href="https://agentuity.com/blog/tartanhacks-2026-recap" target="_blank">Agentuity 回顧文章</a>，或<a href="assets/tartan.pdf" target="_blank">下載我哋嘅簡報</a>，亦可欣賞<a href="https://youtu.be/bbiGeH78C5Q" target="_blank">Jonathan Dunne 製作嘅示範影片</a>。',
    blg_w26_h2:       "2026年冬季學期開始！",
    blg_w26_date:     "2026年1月7日",
    blg_w26_p:        "好興奮開始我喺密歇根嘅第二個學期。Go Blue！",
    blg_f25end_h2:    "2025年秋季學期結束",
    blg_f25end_date:  "2025年12月17日",
    blg_f25end_p:     "我好自豪以4.0 GPA完成咗喺密歇根嘅第一個學期。非常感謝所有教授同同學嘅時間同支持。Go Blue！",
    blg_f25_h2:       "2025年秋季學期開始！",
    blg_f25_date:     "2025年8月25日",
    blg_f25_p:        "好興奮開始我喺密歇根嘅第一個學期。Go Blue！",
    blg_start_h2:     "我的網誌開始了",
    blg_start_date:   "2025年8月8日",
    blg_start_p:      "準備好 Go Blue！",
  });


  /* =================================================================
     PERSONAL PROJECTS  prj_*
     ================================================================= */

  // === ENGLISH ===
  Object.assign(i18n.en, {
    prj_h1:         "Personal Projects",
    prj_h2:         "Projects",
    prj_orbital_h3: "Orbital2025 (2025 March – Ongoing)",
    prj_orbital_p:  'Indie game in development. Retro-futuristic space combat with realistic orbital physics. Check out my <a href="https://youtube.com/playlist?list=PL4bcmDv4awOb4WdpuHDiPknu6YfnpEedx&si=pohlLYl6zVkXZvKv" target="_blank">devlog series</a> for more! You can download the <a href="https://kevinsunyuqi.itch.io/orbital2025" target="_blank">latest release</a> of the game here.',
    prj_qirui_h3:   "Qirui Pay (2022 May – 2025 June)",
    prj_qirui_p:    'Qirui Pay is a digital wallet and transaction platform for private currencies issued by large organizations such as schools and companies for use in their internal events. Check out my <a href="https://www.youtube.com/@the_real_kevin8996" target="_blank">YouTube channel</a> for more!',
    prj_recycle_h3: "Recycle Royale (2022 December – 2023 December)",
    prj_recycle_p:  'Project lead for Recycle Royale, a system of smart bins that uses machine vision to sort recyclable trash. Users earn points through a gamified app, redeemable for prizes or donated to charity. Check out the app on the <a href="https://apps.apple.com/app/recycle-royale/id6446848447" target="_blank">App Store</a> and <a href="http://recycling.student.isf.edu.hk" target="_blank">the website</a>!',
    prj_rc_h3:      "Various RC vehicles/robots (2020 April – 2023 November)",
    prj_rc_p:       "A collection of my various RC vehicles and robots. From my first flying wing to hovercrafts, from ekranoplans to robotic boats. All designed and made in my free time.",
    prj_ieee_h3:    "IEEE YE Conference (2023 November)",
    prj_ieee_p:     'See Resume section for details on "Development and Evaluation of a Low-Cost Open Source Power Monitoring and Recording System for Solar Panel Efficiency Analysis."',
    prj_13e_h3:     "13e education (2021 June – 2021 August)",
    prj_13e_p:      'Developed the portal app for 13e education, a mobile app for parents to track their children\'s learning progress in real-time. Check out 13e education on the <a href="https://apps.apple.com/hk/app/13e-education/id1640954044" target="_blank">App Store</a>!',
    prj_solar_h3:   "Solar Sim 1 (2020 June – 2020 August)",
    prj_solar_p:    "Developed a solar system simulator completely written in C. Gravity and other physical processes are simulated. Planets specs can be edited in a config file, and the player can design and program the flight of rockets and spacecrafts.",
  });
  // === GERMAN ===
  Object.assign(i18n.de, {
    prj_h1:         "Persönliche Projekte",
    prj_h2:         "Projekte",
    prj_orbital_h3: "Orbital2025 (März 2025 – laufend)",
    prj_orbital_p:  'Indie-Spiel in Entwicklung. Retrofuturistischer Weltraumkampf mit realistischer Orbitalphysik. Schau dir meine <a href="https://youtube.com/playlist?list=PL4bcmDv4awOb4WdpuHDiPknu6YfnpEedx&si=pohlLYl6zVkXZvKv" target="_blank">Devlog-Serie</a> an! Die <a href="https://kevinsunyuqi.itch.io/orbital2025" target="_blank">neueste Version</a> des Spiels hier herunterladen.',
    prj_qirui_h3:   "Qirui Pay (Mai 2022 – Juni 2025)",
    prj_qirui_p:    'Qirui Pay ist eine digitale Geldbörse und Transaktionsplattform für private Währungen von Schulen und Unternehmen. Schau dir meinen <a href="https://www.youtube.com/@the_real_kevin8996" target="_blank">YouTube-Kanal</a> für mehr an!',
    prj_recycle_h3: "Recycle Royale (Dezember 2022 – Dezember 2023)",
    prj_recycle_p:  'Projektleiter für Recycle Royale, ein System intelligenter Mülleimer mit maschinellem Sehen. Nutzer erhalten Punkte über eine spielifizierte App, einlösbar als Preise oder Spenden. App im <a href="https://apps.apple.com/app/recycle-royale/id6446848447" target="_blank">App Store</a> und <a href="http://recycling.student.isf.edu.hk" target="_blank">auf der Website</a>!',
    prj_rc_h3:      "Verschiedene RC-Fahrzeuge/Roboter (April 2020 – November 2023)",
    prj_rc_p:       "Eine Sammlung meiner RC-Fahrzeuge und Roboter: Vom Nurflügler über Luftkissenfahrzeuge bis zu Ekranoplanen und Roboterbooten — alles in meiner Freizeit entworfen und gebaut.",
    prj_ieee_h3:    "IEEE YE Konferenz (November 2023)",
    prj_ieee_p:     'Siehe Lebenslauf für Details zu „Development and Evaluation of a Low-Cost Open Source Power Monitoring and Recording System for Solar Panel Efficiency Analysis."',
    prj_13e_h3:     "13e education (Juni 2021 – August 2021)",
    prj_13e_p:      'Portal-App für 13e education entwickelt — eine Eltern-App zur Echtzeit-Verfolgung des Lernfortschritts. Im <a href="https://apps.apple.com/hk/app/13e-education/id1640954044" target="_blank">App Store</a> verfügbar!',
    prj_solar_h3:   "Solar Sim 1 (Juni 2020 – August 2020)",
    prj_solar_p:    "Sonnensystem-Simulator komplett in C entwickelt. Gravitation und andere physikalische Prozesse werden simuliert. Planetenparameter editierbar; Spieler können Raketen und Raumfahrzeuge entwerfen und programmieren.",
  });
  // === CANTONESE ===
  Object.assign(i18n.ct, {
    prj_h1:         "個人項目",
    prj_h2:         "項目",
    prj_orbital_h3: "Orbital2025（2025年3月 – 至今）",
    prj_orbital_p:  '開發中嘅獨立遊戲，具有逼真軌道物理學嘅復古未來主義太空戰鬥。睇睇我嘅<a href="https://youtube.com/playlist?list=PL4bcmDv4awOb4WdpuHDiPknu6YfnpEedx&si=pohlLYl6zVkXZvKv" target="_blank">開發日誌系列</a>！可以喺呢度下載遊戲嘅<a href="https://kevinsunyuqi.itch.io/orbital2025" target="_blank">最新版本</a>。',
    prj_qirui_h3:   "Qirui Pay（2022年5月 – 2025年6月）",
    prj_qirui_p:    'Qirui Pay 係一個數字錢包及交易平台，供大型機構（如學校及公司）發行內部專屬貨幣。歡迎睇睇我嘅<a href="https://www.youtube.com/@the_real_kevin8996" target="_blank">YouTube 頻道</a>了解更多！',
    prj_recycle_h3: "Recycle Royale（2022年12月 – 2023年12月）",
    prj_recycle_p:  '擔任 Recycle Royale 項目負責人，呢個系統以機器視覺智能垃圾桶區分可回收物。用家透過遊戲化應用程式獲得積分，可換取獎品或捐贈。歡迎喺<a href="https://apps.apple.com/app/recycle-royale/id6446848447" target="_blank">App Store</a> 同<a href="http://recycling.student.isf.edu.hk" target="_blank">官方網站</a>了解更多！',
    prj_rc_h3:      "各種遙控車輛及機器人（2020年4月 – 2023年11月）",
    prj_rc_p:       "我各式遙控車輛及機器人嘅合集：由第一架飛翼機到氣墊船，由地效翼船到機器人船，全部都係喺業餘時間設計同製作。",
    prj_ieee_h3:    "IEEE YE 會議（2023年11月）",
    prj_ieee_p:     '詳情請參閱本網站履歷頁，了解「低成本開源太陽能電池板效率分析電力監測系統嘅開發與評估」研究。',
    prj_13e_h3:     "13e education（2021年6月 – 2021年8月）",
    prj_13e_p:      '為 13e education 開發門戶應用程式，供家長實時追蹤子女嘅學習進度。歡迎喺<a href="https://apps.apple.com/hk/app/13e-education/id1640954044" target="_blank">App Store</a> 了解更多！',
    prj_solar_h3:   "Solar Sim 1（2020年6月 – 2020年8月）",
    prj_solar_p:    "以C語言完全開發嘅太陽系模擬器，模擬重力等物理過程。行星參數可於設定文件中編輯，玩家可設計及編程火箭與太空飛行器嘅飛行路徑。",
  });


  /* =================================================================
     SHOWCASE PAGE  shw_*
     ================================================================= */

  // === ENGLISH ===
  Object.assign(i18n.en, {
    shw_h1:         "Game Showcase",
    shw_h2:         "Interactive Games &amp; Projects",
    shw_intro:      "A collection of games and interactive experiences I've created using Construct 3 and other tools.",
    shw_collage_h3: "Auto Image Collage Generator",
    shw_collage_p:  "A photomosaic generator built with Python and Streamlit that transforms any target image into a stunning collage made entirely from your own source images. The tool analyzes colors, matches tiles intelligently, and creates high-resolution artistic mosaics. Developed as project lead for Michigan Data Science Team (MDST).",
    shw_btn_demo:   "View Demo →",
    shw_btn_play:   "Play Game →",
    shw_github:     "GitHub Repository",
    shw_watch_demo: "Watch Demo Video",
    shw_watch_tut:  "Watch Tutorial",
    shw_civ_h3:     "Civilisation",
    shw_civ_p:      "An open-world strategy game where you manage a society through various challenges. Complete missions, interact with NPCs, and make decisions that shape your civilization's future. Built with Construct 3 using TypeScript for game logic.",
    shw_inv_h3:     "Space Invaders",
    shw_inv_p:      "A classic arcade game recreation. Defend Earth from waves of alien invaders! Features smooth gameplay, progressive difficulty, and retro-style graphics.",
    shw_ast_h3:     "Asteroids",
    shw_ast_p:      "Navigate through space, destroy asteroids, and survive as long as possible! Physics-based movement styled in University of Michigan blue and maize colors.",
  });
  // === GERMAN ===
  Object.assign(i18n.de, {
    shw_h1:         "Galerie",
    shw_h2:         "Interaktive Spiele &amp; Projekte",
    shw_intro:      "Eine Sammlung von Spielen und interaktiven Erlebnissen, die ich mit Construct 3 und anderen Werkzeugen erstellt habe.",
    shw_collage_h3: "Automatischer Bildcollagengenerator",
    shw_collage_p:  "Ein Fotomosaik-Generator (Python &amp; Streamlit), der jedes Zielbild in eine beeindruckende Collage aus eigenen Quellbildern verwandelt. Das Werkzeug analysiert Farben, wählt Kacheln intelligent aus und erstellt hochauflösende künstlerische Mosaike. Als Projektleiter des Michigan Data Science Teams (MDST) entwickelt.",
    shw_btn_demo:   "Demo ansehen →",
    shw_btn_play:   "Spielen →",
    shw_github:     "GitHub-Repository",
    shw_watch_demo: "Demo-Video ansehen",
    shw_watch_tut:  "Tutorial ansehen",
    shw_civ_h3:     "Civilisation",
    shw_civ_p:      "Ein Strategiespiel mit offener Welt, in dem du eine Gesellschaft durch Herausforderungen führst. Entwickelt mit Construct 3 und TypeScript.",
    shw_inv_h3:     "Space Invaders",
    shw_inv_p:      "Neuinterpretation des klassischen Arcade-Spiels. Verteidige die Erde gegen Alien-Wellen! Flüssiges Gameplay und Retro-Grafik.",
    shw_ast_h3:     "Asteroiden",
    shw_ast_p:      "Navigiere durch den Weltraum, zerstöre Asteroiden und überlebe so lange wie möglich! Physikbasierte Bewegung in den Farben der Universität Michigan.",
  });
  // === CANTONESE ===
  Object.assign(i18n.ct, {
    shw_h1:         "作品集",
    shw_h2:         "互動遊戲及項目",
    shw_intro:      "呢係我用 Construct 3 同其他工具開發嘅遊戲及互動體驗合集。",
    shw_collage_h3: "自動圖像拼貼生成器",
    shw_collage_p:  "以 Python 及 Streamlit 開發嘅相片馬賽克生成器，將任何目標圖像轉換為由你自己嘅圖片組成嘅精美拼貼。工具智能分析顏色、匹配圖塊，生成高解析度藝術馬賽克。作為密歇根大學數據科學團隊（MDST）項目負責人開發。",
    shw_btn_demo:   "查看示範 →",
    shw_btn_play:   "開始遊戲 →",
    shw_github:     "GitHub 倉庫",
    shw_watch_demo: "觀看示範影片",
    shw_watch_tut:  "觀看教學影片",
    shw_civ_h3:     "Civilisation",
    shw_civ_p:      "一款開放世界策略遊戲，帶領一個社會應對各種挑戰。以 Construct 3 及 TypeScript 開發。",
    shw_inv_h3:     "Space Invaders",
    shw_inv_p:      "經典街機遊戲重製版。抵禦外星入侵者，保衛地球！流暢嘅遊戲體驗及復古風格圖形。",
    shw_ast_h3:     "小行星",
    shw_ast_p:      "穿越太空、摧毀小行星、盡可能生存！以密歇根大學藍色及金色為主題嘅物理移動遊戲。",
  });


  /* =================================================================
     ASTEROIDS PAGE  ast_*
     ================================================================= */

  // === ENGLISH ===
  Object.assign(i18n.en, {
    ast_h1:    "Asteroids",
    ast_h2:    "Maize and Blue Asteroids",
    ast_instr: "Use <strong>W</strong> to thrust, <strong>A/D</strong> to steer, and <strong>Spacebar</strong> to shoot. Destroy asteroids to earn points!",
    ast_score: "Score:",
  });
  // === GERMAN ===
  Object.assign(i18n.de, {
    ast_h1:    "Asteroiden",
    ast_h2:    "Maize and Blue Asteroiden",
    ast_instr: "<strong>W</strong> zum Beschleunigen, <strong>A/D</strong> zum Lenken, <strong>Leertaste</strong> zum Schießen. Asteroiden zerstören = Punkte!",
    ast_score: "Punkte:",
  });
  // === CANTONESE ===
  Object.assign(i18n.ct, {
    ast_h1:    "小行星",
    ast_h2:    "藍金小行星",
    ast_instr: "按 <strong>W</strong> 推進，<strong>A/D</strong> 轉向，<strong>空白鍵</strong> 射擊。摧毀小行星可獲得分數！",
    ast_score: "分數：",
  });


  /* =================================================================
     CIVILISATION PAGE  civ_*
     ================================================================= */

  // === ENGLISH ===
  Object.assign(i18n.en, {
    civ_h1:         "Civilisation",
    civ_h2:         "Play Civilisation",
    civ_desc:       "Build and manage your own civilization in this strategy game built with Construct 3",
    civ_tutorial:   '📺 <a href="https://www.youtube.com/watch?v=yWzf6_O5P8Q" target="_blank">Watch Gameplay Tutorial &amp; Demo</a>',
    civ_btn:        "🎮 Launch Game in New Window",
    civ_note:       "The game will open in a new tab/window for the best experience",
    civ_about_h3:   "About This Game",
    civ_about_p:    "Civilisation is an open-world strategy game where you manage a society through various challenges. Complete missions, interact with NPCs, and make decisions that shape your civilization's future.",
    civ_ctrl_h4:    "Controls:",
    civ_ctrl_arrow: "<strong>Arrow Keys</strong> - Move your character",
    civ_ctrl_e:     "<strong>E Key</strong> - Interact with objects, NPCs, and enter buildings",
    civ_ctrl_f:     "<strong>F Key</strong> - Use items",
    civ_ctrl_r:     "<strong>R Key</strong> - Additional actions",
    civ_ctrl_m:     "<strong>M Key</strong> - View instructions",
    civ_ctrl_c:     "<strong>C Key</strong> - View credits",
  });
  // === GERMAN ===
  Object.assign(i18n.de, {
    civ_h1:         "Civilisation",
    civ_h2:         "Civilisation spielen",
    civ_desc:       "Baue und verwalte deine eigene Zivilisation in diesem mit Construct 3 entwickelten Strategiespiel",
    civ_tutorial:   '📺 <a href="https://www.youtube.com/watch?v=yWzf6_O5P8Q" target="_blank">Gameplay-Tutorial &amp; Demo ansehen</a>',
    civ_btn:        "🎮 Spiel in neuem Fenster öffnen",
    civ_note:       "Das Spiel öffnet sich in einem neuen Tab/Fenster für das beste Erlebnis",
    civ_about_h3:   "Über das Spiel",
    civ_about_p:    "Civilisation ist ein Strategiespiel mit offener Welt, in dem du eine Gesellschaft durch verschiedene Herausforderungen führst. Erfülle Missionen, interagiere mit NPCs und triff Entscheidungen, die die Zukunft deiner Zivilisation gestalten.",
    civ_ctrl_h4:    "Steuerung:",
    civ_ctrl_arrow: "<strong>Pfeiltasten</strong> - Charakter bewegen",
    civ_ctrl_e:     "<strong>E-Taste</strong> - Mit Objekten und NPCs interagieren, Gebäude betreten",
    civ_ctrl_f:     "<strong>F-Taste</strong> - Gegenstände benutzen",
    civ_ctrl_r:     "<strong>R-Taste</strong> - Weitere Aktionen",
    civ_ctrl_m:     "<strong>M-Taste</strong> - Anweisungen anzeigen",
    civ_ctrl_c:     "<strong>C-Taste</strong> - Credits anzeigen",
  });
  // === CANTONESE ===
  Object.assign(i18n.ct, {
    civ_h1:         "Civilisation",
    civ_h2:         "開始 Civilisation",
    civ_desc:       "喺呢個以 Construct 3 開發嘅策略遊戲中，建立同管理你嘅文明",
    civ_tutorial:   '📺 <a href="https://www.youtube.com/watch?v=yWzf6_O5P8Q" target="_blank">觀看遊戲教學及示範</a>',
    civ_btn:        "🎮 喺新視窗開啟遊戲",
    civ_note:       "遊戲將會喺新分頁或視窗開啟，帶來最佳體驗",
    civ_about_h3:   "關於呢個遊戲",
    civ_about_p:    "Civilisation 係一款開放世界策略遊戲，你需要帶領一個社會應對各種挑戰。完成任務、與 NPC 互動，並作出塑造文明未來嘅決定。",
    civ_ctrl_h4:    "操控：",
    civ_ctrl_arrow: "<strong>方向鍵</strong> - 移動角色",
    civ_ctrl_e:     "<strong>E 鍵</strong> - 與物件、NPC 互動及進入建築物",
    civ_ctrl_f:     "<strong>F 鍵</strong> - 使用物品",
    civ_ctrl_r:     "<strong>R 鍵</strong> - 附加動作",
    civ_ctrl_m:     "<strong>M 鍵</strong> - 查看說明",
    civ_ctrl_c:     "<strong>C 鍵</strong> - 查看製作名單",
  });


  /* =================================================================
     INVADERS PAGE  inv_*
     ================================================================= */

  // === ENGLISH ===
  Object.assign(i18n.en, {
    inv_h1:         "Space Invaders",
    inv_h2:         "Play Space Invaders",
    inv_desc:       "A classic arcade game recreation built with Construct 3. Defend Earth from the alien invasion!",
    inv_ctrl_h3:    "How to Play",
    inv_ctrl_lr:    "<strong>Arrow Keys (← →)</strong> - Move your ship left and right",
    inv_ctrl_space: "<strong>Spacebar</strong> - Fire lasers at the invaders",
    inv_ctrl_goal:  "<strong>Goal</strong> - Destroy all aliens before they reach the bottom!",
  });
  // === GERMAN ===
  Object.assign(i18n.de, {
    inv_h1:         "Space Invaders",
    inv_h2:         "Space Invaders spielen",
    inv_desc:       "Eine Neuinterpretation des klassischen Arcade-Spiels mit Construct 3. Verteidige die Erde vor der Alien-Invasion!",
    inv_ctrl_h3:    "Spielanleitung",
    inv_ctrl_lr:    "<strong>Pfeiltasten (← →)</strong> - Schiff nach links und rechts bewegen",
    inv_ctrl_space: "<strong>Leertaste</strong> - Laser auf die Eindringlinge abfeuern",
    inv_ctrl_goal:  "<strong>Ziel</strong> - Vernichte alle Außerirdischen, bevor sie den Boden erreichen!",
  });
  // === CANTONESE ===
  Object.assign(i18n.ct, {
    inv_h1:         "Space Invaders",
    inv_h2:         "開始 Space Invaders",
    inv_desc:       "以 Construct 3 重製嘅經典街機遊戲。抵禦外星人入侵，保衛地球！",
    inv_ctrl_h3:    "點樣玩",
    inv_ctrl_lr:    "<strong>方向鍵（← →）</strong> - 向左右移動飛船",
    inv_ctrl_space: "<strong>空白鍵</strong> - 向入侵者開火",
    inv_ctrl_goal:  "<strong>目標</strong> - 喺外星人到達底部之前消滅所有外星人！",
  });


  /* =================================================================
     COLLAGE DEMO PAGE  col_*
     ================================================================= */

  // === ENGLISH ===
  Object.assign(i18n.en, {
    col_h1:      "Auto Image Collage Generator",
    col_loading: '<strong>Loading interactive demo...</strong> If the app doesn\'t load, <a href="https://auto-image-collage-generator.streamlit.app/" target="_blank">open it in a new window</a>.',
  });
  // === GERMAN ===
  Object.assign(i18n.de, {
    col_h1:      "Automatischer Bildcollagengenerator",
    col_loading: '<strong>Interaktive Demo wird geladen...</strong> Falls die App nicht lädt, <a href="https://auto-image-collage-generator.streamlit.app/" target="_blank">hier in einem neuen Fenster öffnen</a>.',
  });
  // === CANTONESE ===
  Object.assign(i18n.ct, {
    col_h1:      "自動圖像拼貼生成器",
    col_loading: '<strong>正在載入互動示範...</strong> 如果應用程式未能載入，<a href="https://auto-image-collage-generator.streamlit.app/" target="_blank">喺新視窗開啟</a>。',
  });

})();
